import dotenv from "dotenv";

dotenv.config();

import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({
  url: process.env.QDRANT_URL || "http://localhost:6333",
});

const COLLECTION_NAME =
  process.env.QDRANT_COLLECTION || "urpath_knowledge";

const run = async () => {
  await client.delete(COLLECTION_NAME, {
    points: [
      "84b4286a-e328-5b37-839d-2c3cce1a27d5",
    ],
    wait: true,
  });

  console.log("Old test point deleted.");
};

run().catch(console.error);