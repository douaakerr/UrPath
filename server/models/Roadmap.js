import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
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

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    skills: [
  {
    name: String,
    level: String,

    status: {
      type: String,
      enum: ["weak", "learning", "strong", "completed"],
      default: "learning",
    },

    source: {
      type: String,
      enum: ["assessed", "recommended"],
      default: "recommended",
    },
  },
],

    weeks: [
      {
        week: Number,
        title: String,
        objective: String,

        topics: [String],

        tasks: [
          {
            title: String,
            type: {
              type: String,
              enum: ["lesson", "practice", "project", "quiz"],
              default: "lesson",
            },
          },
        ],
      },
    ],

    status: {
      type: String,
      enum: ["generated", "in_progress", "completed"],
      default: "generated",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Roadmap", roadmapSchema);