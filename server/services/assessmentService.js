import mongoose from "mongoose";
import Assessment from "../models/Assessment.js";
import AssessmentBlueprint from "../models/AssessmentBlueprint.js";
import LearningSkill from "../models/LearningSkill.js";
import { retrieveKnowledge } from "../ai/rag/retriever.js";
import { ensureCollection } from "../ai/rag/vectorstore/qdrantStore.js";
import { generateText } from "../ai/aiService.js";
import { assessmentBatchSchema } from "../utils/assessmentSchema.js";
import { validateAssessmentBatch, validateBlueprint } from "../utils/assessmentValidation.js";

const buildSlots = (blueprint) => {
  const slots = [];
  let index = 1;
  for (const area of blueprint.areas) {
    for (let i = 0; i < area.questionCount; i += 1) {
      slots.push({
        slotId: `q${index++}`,
        skillId: String(area.skill._id || area.skill),
        skillName: area.name,
        difficulty: getDifficulty(i, area.questionCount, blueprint.difficultyDistribution),
      });
    }
  }
  return slots;
};

const getDifficulty = (index, count, distribution) => {
  const beginner = Math.round(count * (distribution.beginner / 100));
  const intermediate = Math.round(count * (distribution.intermediate / 100));
  if (index < beginner) return "beginner";
  if (index < beginner + intermediate) return "intermediate";
  return "advanced";
};

const chunk = (items, size) => {
  const output = [];
  for (let i = 0; i < items.length; i += size) output.push(items.slice(i, i + size));
  return output;
};

const cleanJson = (text) => text.replace(/```json/gi, "").replace(/```/g, "").trim();

const generateBatch = async ({ batch, knowledge, domain, subdomain, goal }) => {
  const sourceIds = new Set(knowledge.map((item) => String(item.id)));
  const prompt = `
Create ONLY the JSON object matching the supplied schema.

UrPath diagnostic assessment:
Domain: ${domain}
Subdomain: ${subdomain}
Goal: ${goal || "not specified"}

Question slots:
${JSON.stringify(batch, null, 2)}

Use only the supplied knowledge. Each question must match its slot skillId and difficulty.
Every sourceIds entry must be one of these retrieved source IDs:
${JSON.stringify([...sourceIds])}

Knowledge:
${knowledge.map((item) => `[SOURCE ${item.id}] ${item.text}`).join("\n\n")}
`;

  const raw = await generateText({
    messages: [
      { role: "system", content: "You generate precise educational MCQs for UrPath." },
      { role: "user", content: prompt },
    ],
    temperature: 0,
    maxTokens: 2200,
    format: assessmentBatchSchema,
  });

  let parsed;
  try {
    parsed = JSON.parse(cleanJson(raw));
  } catch {
    throw new Error("AI returned invalid assessment JSON");
  }

  validateAssessmentBatch(parsed, batch, sourceIds);
  return parsed.questions;
};

export const createAssessment = async ({ userId, domain, subdomain, goal = "" }) => {
  if (!mongoose.isValidObjectId(userId)) throw new Error("Invalid user");

  const blueprint = await AssessmentBlueprint.findOne({ domain, subdomain, status: "active" })
    .sort({ version: -1 })
    .populate("areas.skill");

  if (!blueprint) throw new Error("No active assessment blueprint found for this subdomain");
  validateBlueprint(blueprint);

  const skills = await LearningSkill.find({
    _id: { $in: blueprint.areas.map((area) => area.skill._id || area.skill) },
    domain,
    subdomain,
    isActive: true,
  }).lean();

  const skillMap = new Map(skills.map((skill) => [String(skill._id), skill]));
  for (const area of blueprint.areas) {
    if (!skillMap.has(String(area.skill._id || area.skill))) {
      throw new Error(`Blueprint skill is unavailable: ${area.name}`);
    }
  }

  const assessment = await Assessment.create({
    user: userId,
    domain,
    subdomain,
    goal,
    blueprint: blueprint._id,
    blueprintVersion: blueprint.version,
    blueprintSnapshot: blueprint.toObject(),
    status: "generating",
    generation: {
      provider: process.env.AI_PROVIDER || "ollama",
      model: process.env.OLLAMA_MODEL || "",
    },
  });

  try {
    const slots = buildSlots(blueprint);
    await ensureCollection();
    const knowledge = await retrieveKnowledge({
      query: `${domain} ${subdomain} core concepts skills fundamentals assessment`,
      domain,
      subdomain,
      limit: 12,
    });

    if (!knowledge.length) throw new Error("No knowledge found for this assessment");

    const questions = [];
    for (const batch of chunk(slots, 2)) {
      const generated = await generateBatch({ batch, knowledge, domain, subdomain, goal });
      questions.push(
        ...generated.map((question) => ({
          slotId: question.slotId,
          skill: new mongoose.Types.ObjectId(question.skillId),
          skillName: skillMap.get(String(question.skillId))?.name || question.skillId,
          type: question.type,
          question: question.question,
          difficulty: question.difficulty,
          options: question.options,
          correctOptionId: question.correctOptionId,
          explanation: question.explanation,
          sourceIds: question.sourceIds,
        }))
      );
    }

    await Assessment.updateOne(
      { _id: assessment._id },
      {
        $set: {
          questions,
          status: "ready",
          "generation.batches": Math.ceil(slots.length / 2),
          "generation.generatedAt": new Date(),
        },
      }
    );

    return Assessment.findById(assessment._id).lean();
  } catch (error) {
    await Assessment.updateOne(
      { _id: assessment._id },
      { $set: { status: "failed", "generation.error": error.message } }
    );
    throw error;
  }
};
