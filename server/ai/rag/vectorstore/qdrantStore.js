import { QdrantClient } from "@qdrant/js-client-rest";
import { createEmbedding } from "../../../services/embeddingService.js";
import { v5 as uuidv5 } from "uuid";

const getConfig = () => ({
  collectionName: process.env.QDRANT_COLLECTION || "urpath_knowledge",
  url: process.env.QDRANT_URL || "http://localhost:6333",
});

const getClient = () => new QdrantClient({ url: getConfig().url });
const URPATH_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
const toPointId = (id) => uuidv5(String(id), URPATH_NAMESPACE);

export const ensureCollection = async () => {
  const { collectionName } = getConfig();
  const qdrant = getClient();
  const collections = await qdrant.getCollections();
  const exists = collections.collections.some((collection) => collection.name === collectionName);

  if (!exists) {
    await qdrant.createCollection(collectionName, {
      vectors: { size: 768, distance: "Cosine" },
    });
    console.log(`Qdrant collection created: ${collectionName}`);
  }
};

export const upsertKnowledge = async ({ id, text, metadata = {} }) => {
  if (!text?.trim()) throw new Error("Knowledge text is required");
  const { collectionName } = getConfig();
  const qdrant = getClient();
  const embedding = await createEmbedding(text);

  await qdrant.upsert(collectionName, {
    wait: true,
    points: [{
      id: toPointId(id),
      vector: embedding,
      payload: { text, ...metadata, originalId: id || null },
    }],
  });

  return { id: toPointId(id), originalId: id || null };
};

export const searchKnowledge = async ({ query, domain, subdomain, skill, topic, limit = 5 }) => {
  if (!query?.trim()) throw new Error("Query is required");
  const { collectionName } = getConfig();
  const qdrant = getClient();
  const embedding = await createEmbedding(query);
  const must = [];

  for (const [key, value] of [["domain", domain], ["subdomain", subdomain], ["skill", skill], ["topic", topic]]) {
    if (value) must.push({ key, match: { value } });
  }

  return qdrant.query(collectionName, {
    query: embedding,
    limit,
    with_payload: true,
    ...(must.length ? { filter: { must } } : {}),
  });
};
