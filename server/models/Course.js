import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["video", "article", "documentation", "book", "other"],
      required: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    provider: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    duration: {
      type: Number,
      min: 0,
      default: null,
    },
  },
  { _id: true }
);

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      required: true,
      min: 1,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    summary: {
      type: String,
      trim: true,
      default: "",
    },

    objectives: {
      type: [String],
      default: [],
    },

    resources: {
      type: [resourceSchema],
      default: [],
    },

    estimatedMinutes: {
      type: Number,
      min: 1,
      default: 15,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
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

    weekNumber: {
      type: Number,
      required: true,
      min: 1,
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

    description: {
      type: String,
      trim: true,
      default: "",
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

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    skills: {
      type: [String],
      default: [],
    },

    lessons: {
      type: [lessonSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started",
    },

    progressPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    lastActivityAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.index({ user: 1, roadmap: 1 });
courseSchema.index({ user: 1, roadmap: 1, weekNumber: 1 });

export default mongoose.model("Course", courseSchema);