import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

process.env.QDRANT_COLLECTION = "urpath_knowledge_nvidia";

import connectDB from "../config/connectDb.js";
import KnowledgeDocument from "../models/knowledgeDocument.js";

const { ensureCollection, upsertKnowledge } = await import(
  "../ai/rag/vectorstore/qdrantStore.js"
);

const run = async () => {
  try {
    await connectDB();
    await ensureCollection();

    const documents = await KnowledgeDocument.find().sort({ createdAt: 1 });
    console.log(`Re-embedding ${documents.length} knowledge chunks with NVIDIA...`);

    let completed = 0;

    for (const document of documents) {
      await upsertKnowledge({
        id: document.embeddingId || document._id.toString(),
        text: document.content,
        metadata: {
          knowledgeId: document._id.toString(),
          title: document.title,
          domain: document.domain,
          subdomain: document.subdomain,
          skill: document.skill,
          topic: document.topic,
          source: document.source,
          sourceUrl: document.sourceUrl,
          chunkIndex: document.chunkIndex,
        },
      });

      completed += 1;
      console.log(`Indexed ${completed}/${documents.length}`);
    }

    console.log("NVIDIA knowledge reindex completed.");
  } catch (error) {
    console.error("Knowledge reindex failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

await run();
