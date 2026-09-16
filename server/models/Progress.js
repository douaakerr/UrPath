import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    roadmap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
      index: true,
    },

    completedTasks: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalTasks: {
      type: Number,
      default: 0,
      min: 0,
    },

    completedLessons: {
      type: Number,
      default: 0,
      min: 0,
    },

    completedProjects: {
      type: Number,
      default: 0,
      min: 0,
    },

    completedQuizzes: {
      type: Number,
      default: 0,
      min: 0,
    },

    currentWeek: {
      type: Number,
      default: 1,
      min: 1,
    },

    currentTask: {
      type: String,
      default: null,
    },

    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started",
    },

    lastActivityAt: {
      type: Date,
      default: null,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


progressSchema.index(
  { user: 1, roadmap: 1 },
  { unique: true }
);

export default mongoose.model("Progress", progressSchema);