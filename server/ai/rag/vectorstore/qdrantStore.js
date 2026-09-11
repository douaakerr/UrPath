import { QdrantClient } from "@qdrant/js-client-rest";
import { createEmbedding } from "../../../services/embeddingService.js";
import { v5 as uuidv5 } from "uuid";

const COLLECTION_NAME =
  process.env.QDRANT_COLLECTION || "urpath_knowledge";

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL || "http://localhost:6333",
});

const URPATH_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

const toPointId = (id) => {
  return uuidv5(String(id), URPATH_NAMESPACE);
};

export const ensureCollection = async () => {
  const collections = await qdrant.getCollections();

  const exists = collections.collections.some(
    (collection) => collection.name === COLLECTION_NAME
  );

  if (!exists) {
    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 768,
        distance: "Cosine",
      },
    });

    console.log(`Qdrant collection created: ${COLLECTION_NAME}`);
  }
};

export const upsertKnowledge = async ({
  id,
  text,
  metadata = {},
}) => {
  if (!text?.trim()) {
    throw new Error("Knowledge text is required");
  }

  const embedding = await createEmbedding(text);

  const pointId = toPointId(id);

  await qdrant.upsert(COLLECTION_NAME, {
    wait: true,
    points: [
      {
        id: pointId,
        vector: embedding,
        payload: {
          text,
          ...metadata,
          originalId: id || null,
        },
      },
    ],
  });

  return {
    id: pointId,
    originalId: id || null,
  };
};

export const searchKnowledge = async ({
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

  const embedding = await createEmbedding(query);

  const must = [];

  if (domain) {
    must.push({
      key: "domain",
      match: {
        value: domain,
      },
    });
  }

  if (subdomain) {
    must.push({
      key: "subdomain",
      match: {
        value: subdomain,
      },
    });
  }

  if (skill) {
    must.push({
      key: "skill",
      match: {
        value: skill,
      },
    });
  }

  if (topic) {
    must.push({
      key: "topic",
      match: {
        value: topic,
      },
    });
  }

  const searchParams = {
    vector: embedding,
    limit,
    with_payload: true,
  };

  if (must.length > 0) {
    searchParams.filter = {
      must,
    };
  }

 const results = await qdrant.query(COLLECTION_NAME, {
  query: embedding,
  limit,
  with_payload: true,
  ...(must.length > 0
    ? {
        filter: {
          must,
        },
      }
    : {}),
});

  return results;
};