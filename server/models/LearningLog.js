import mongoose from "mongoose";

const learningLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    roadmap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
    },

    weekNumber: {
      type: Number,
      required: true,
    },

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    learned: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    minutesSpent: {
      type: Number,
      required: true,
      min: 1,
    },

    points: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("LearningLog", learningLogSchema);