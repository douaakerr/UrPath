import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    id: { type: String, enum: ["a", "b", "c", "d"], required: true },
    text: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    slotId: { type: String, required: true, trim: true },
    skill: { type: mongoose.Schema.Types.ObjectId, ref: "LearningSkill", required: true },
    skillName: { type: String, required: true, trim: true },
    type: { type: String, enum: ["mcq"], default: "mcq" },
    question: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    options: { type: [optionSchema], required: true },
    correctOptionId: { type: String, enum: ["a", "b", "c", "d"], required: true },
    explanation: { type: String, required: true },
    sourceIds: { type: [String], default: [] },
  },
  { _id: true }
);

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    selectedOptionId: { type: String, enum: ["a", "b", "c", "d"], required: true },
  },
  { _id: false }
);

const assessmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    domain: { type: String, required: true, trim: true },
    subdomain: { type: String, required: true, trim: true },
    goal: { type: String, default: "", trim: true },

    blueprint: { type: mongoose.Schema.Types.ObjectId, ref: "AssessmentBlueprint", required: true },
    blueprintVersion: { type: Number, required: true },
    blueprintSnapshot: { type: mongoose.Schema.Types.Mixed, required: true },

    status: {
      type: String,
      enum: ["generating", "ready", "completed", "failed"],
      default: "generating",
      index: true,
    },

    questions: { type: [questionSchema], default: [] },
    answers: { type: [answerSchema], default: [] },

    result: {
      score: { type: Number, default: null },
      total: { type: Number, default: null },
      percentage: { type: Number, default: null },
      level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced", "mixed", "unknown", null],
        default: null,
      },
      perSkill: { type: mongoose.Schema.Types.Mixed, default: {} },
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
      unassessedSkills: { type: [String], default: [] },
    },

    generation: {
      provider: { type: String, default: "ollama" },
      model: { type: String, default: "" },
      batches: { type: Number, default: 0 },
      generatedAt: { type: Date, default: null },
      error: { type: String, default: "" },
    },

    scoringVersion: { type: String, default: "v1" },
    roadmapGenerationStatus: {
      type: String,
      enum: ["pending", "not_started", "generated", "failed"],
      default: "not_started",
    },
  },
  { timestamps: true }
);

assessmentSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Assessment", assessmentSchema);
