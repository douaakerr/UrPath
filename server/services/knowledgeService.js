import KnowledgeDocument from "../models/knowledgeDocument.js";
import { chunkText } from "./chunkingService.js";
import { upsertKnowledge } from "../ai/rag/vectorstore/qdrantStore.js";

export const ingestKnowledge = async ({
  title,
  content,
  source = "internal",
  sourceUrl = "",
  domain,
  subdomain = "",
  skill = "",
  topic = "",
}) => {
  if (!title || !content || !domain) {
    throw new Error(
      "title, content and domain are required"
    );
  }

  const chunks = chunkText(content);

  if (!chunks.length) {
    throw new Error("No valid knowledge content");
  }

  const documents = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    const embeddingId = [
      domain,
      subdomain,
      skill,
      title,
      i,
    ]
      .filter(Boolean)
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    const document = await KnowledgeDocument.create({
      title,
      content: chunk,
      source,
      sourceUrl,
      domain,
      subdomain,
      skill,
      topic,
      chunkIndex: i,
      embeddingId,
    });

    await upsertKnowledge({
      id: embeddingId,
      text: chunk,
      metadata: {
        knowledgeId: document._id.toString(),
        title,
        domain,
        subdomain,
        skill,
        topic,
        source,
        sourceUrl,
        chunkIndex: i,
      },
    });

    documents.push(document);
  }

  return documents;
};