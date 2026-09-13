import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    domain: {
      type: String,
      required: true,
      trim: true,
    },

    subdomain: {
      type: String,
      required: true,
      trim: true,
    },

    goal: {
      type: String,
      required: true,
      trim: true,
    },

    questions: {
      type: Array,
      required: true,
    },

    answers: {
      type: Object,
      default: {},
    },

    result: {
      correct: {
        type: Number,
        default: 0,
      },

      total: {
        type: Number,
        default: 0,
      },

      percentage: {
        type: Number,
        default: 0,
      },

      level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner",
      },

      skillScores: {
        type: Object,
        default: {},
      },
    },

    status: {
      type: String,
      enum: ["generated", "completed"],
      default: "generated",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Assessment", assessmentSchema);