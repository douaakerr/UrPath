import mongoose from "mongoose";

const areaSchema = new mongoose.Schema(
  {
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningSkill",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    weight: {
      type: Number,
      default: 1,
    },

    questionCount: {
      type: Number,
      default: 2,
    },
  },
  { _id: false }
);

const assessmentBlueprintSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
    },

    subdomain: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    areas: {
      type: [areaSchema],
      default: [],
    },

    totalQuestions: {
      type: Number,
      default: 12,
    },

    difficultyDistribution: {
      beginner: {
        type: Number,
        default: 40,
      },

      intermediate: {
        type: Number,
        default: 40,
      },

      advanced: {
        type: Number,
        default: 20,
      },
    },

    version: {
      type: Number,
      default: 1,
    },

    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
    },

    generatedBy: {
      type: String,
      enum: ["system", "ai", "manual"],
      default: "system",
    },
  },
  {
    timestamps: true,
  }
);

assessmentBlueprintSchema.index(
  {
    domain: 1,
    subdomain: 1,
    version: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "AssessmentBlueprint",
  assessmentBlueprintSchema
);