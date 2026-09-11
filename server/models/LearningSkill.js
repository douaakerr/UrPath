import mongoose from "mongoose";

const learningSkillSchema = new mongoose.Schema(
  {
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

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    prerequisites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LearningSkill",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

learningSkillSchema.index({
  domain: 1,
  subdomain: 1,
  name: 1,
});

export default mongoose.model("LearningSkill", learningSkillSchema);