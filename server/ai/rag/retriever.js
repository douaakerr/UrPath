import { searchKnowledge } from "./vectorstore/qdrantStore.js";

export const retrieveKnowledge = async ({
  query,
  domain,
  subdomain,
  skill,
  topic,
  limit = 5,
}) => {
  if (!query?.trim()) {
    throw new Error("Query is required");
  }

  try {
    const results = await searchKnowledge({
      query,
      domain,
      subdomain,
      skill,
      topic,
      limit,
    });

    const points = results?.points || (Array.isArray(results) ? results : []);

    return points.map((result) => ({
      id: result.id,
      score: result.score,
      text: result.payload?.text || "",
      metadata: {
        originalId: result.payload?.originalId,
        title: result.payload?.title,
        domain: result.payload?.domain,
        subdomain: result.payload?.subdomain,
        skill: result.payload?.skill,
        topic: result.payload?.topic,
        source: result.payload?.source,
        sourceUrl: result.payload?.sourceUrl,
      },
    }));
  } catch (error) {
    console.warn(
      "Knowledge retrieval fallback: vector store unavailable or failed, continuing without RAG context.",
      error.message
    );
    return [];
  }
};
