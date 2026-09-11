import mongoose from "mongoose";

const knowledgeDocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    source: {
      type: String,
      default: "internal",
      trim: true,
    },

    sourceUrl: {
      type: String,
      default: "",
      trim: true,
    },

    domain: {
      type: String,
      required: true,
      trim: true,
    },

    subdomain: {
      type: String,
      default: "",
      trim: true,
    },

    skill: {
      type: String,
      default: "",
      trim: true,
    },

    topic: {
      type: String,
      default: "",
      trim: true,
    },

    chunkIndex: {
      type: Number,
      default: 0,
    },

    embeddingId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

knowledgeDocumentSchema.index({
  domain: 1,
  subdomain: 1,
  skill: 1,
});

export default mongoose.model(
  "KnowledgeDocument",
  knowledgeDocumentSchema
);
