import mongoose from "mongoose";
import Assessment from "../models/Assessment.js";
import { createAssessment } from "../services/assessmentService.js";

const publicAssessment = (assessment) => ({
  _id: assessment._id,
  domain: assessment.domain,
  subdomain: assessment.subdomain,
  goal: assessment.goal,
  status: assessment.status,
  blueprintVersion: assessment.blueprintVersion,
  questions: assessment.questions.map((question) => ({
    _id: question._id,
    slotId: question.slotId,
    skill: question.skill,
    skillName: question.skillName,
    type: question.type,
    question: question.question,
    difficulty: question.difficulty,
    options: question.options,
  })),
});

export const generateAssessmentController = async (req, res) => {
  try {
    const { domain, subdomain, goal = "" } = req.body;
    if (!domain?.trim() || !subdomain?.trim()) {
      return res.status(400).json({ message: "domain and subdomain are required" });
    }

    const assessment = await createAssessment({
      userId: req.user._id,
      domain: domain.trim(),
      subdomain: subdomain.trim(),
      goal: typeof goal === "string" ? goal.trim() : "",
    });

    return res.status(201).json({ assessment: publicAssessment(assessment) });
  } catch (error) {
    console.error("Assessment generation error:", error);
    return res.status(500).json({ message: error.message || "Failed to generate assessment" });
  }
};

export const getAssessmentController = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid assessment id" });
  }

  const assessment = await Assessment.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).lean();

  if (!assessment) return res.status(404).json({ message: "Assessment not found" });

  return res.json({
    assessment:
      assessment.status === "completed"
        ? { ...publicAssessment(assessment), result: assessment.result }
        : publicAssessment(assessment),
  });
};

export const submitAssessmentController = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid assessment id" });
    }

    const assessment = await Assessment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!assessment) return res.status(404).json({ message: "Assessment not found" });
    if (assessment.status === "completed") {
      return res.status(409).json({ message: "Assessment has already been submitted" });
    }
    if (assessment.status !== "ready") {
      return res.status(409).json({ message: `Assessment is ${assessment.status}` });
    }

    const submittedAnswers = req.body?.answers;
    if (!Array.isArray(submittedAnswers)) {
      return res.status(400).json({ message: "answers must be an array" });
    }

    const questionMap = new Map(assessment.questions.map((q) => [String(q._id), q]));
    const seen = new Set();
    let score = 0;
    const perSkill = {};

    for (const answer of submittedAnswers) {
      if (!mongoose.isValidObjectId(answer.questionId) || seen.has(String(answer.questionId))) {
        return res.status(400).json({ message: "Invalid or duplicate questionId" });
      }
      seen.add(String(answer.questionId));

      const question = questionMap.get(String(answer.questionId));
      if (!question) return res.status(400).json({ message: "Unknown questionId" });
      if (!question.options.some((option) => option.id === answer.selectedOptionId)) {
        return res.status(400).json({ message: "Invalid selected option" });
      }

      const key = String(question.skill);
      if (!perSkill[key]) {
        perSkill[key] = { skillName: question.skillName, correct: 0, total: 0 };
      }
      perSkill[key].total += 1;

      if (answer.selectedOptionId === question.correctOptionId) {
        score += 1;
        perSkill[key].correct += 1;
      }
    }

    if (seen.size !== assessment.questions.length) {
      return res.status(400).json({ message: "All assessment questions must be answered" });
    }

    const total = assessment.questions.length;
    const percentage = Math.round((score / total) * 100);
    const level = percentage < 50 ? "beginner" : percentage < 75 ? "intermediate" : "advanced";
    const strengths = [];
    const weaknesses = [];

    for (const skill of Object.values(perSkill)) {
      const skillPercentage = (skill.correct / skill.total) * 100;
      if (skillPercentage >= 75) strengths.push(skill.skillName);
      if (skillPercentage < 50) weaknesses.push(skill.skillName);
    }

    assessment.answers = submittedAnswers.map((answer) => ({
      questionId: answer.questionId,
      selectedOptionId: answer.selectedOptionId,
    }));
    assessment.result = {
      score,
      total,
      percentage,
      level,
      perSkill,
      strengths,
      weaknesses,
      unassessedSkills: [],
    };
    assessment.status = "completed";
    assessment.roadmapGenerationStatus = "pending";
    await assessment.save();

    return res.json({ assessment: { ...publicAssessment(assessment.toObject()), result: assessment.result } });
  } catch (error) {
    console.error("Assessment submission error:", error);
    return res.status(500).json({ message: "Failed to submit assessment" });
  }
};
