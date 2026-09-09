import { createEmbedding } from "./services/embeddingService.js";

const test = async () => {
  const embedding = await createEmbedding(
    "JavaScript functions allow developers to create reusable code."
  );

  console.log("Embedding length:", embedding.length);
  console.log("First values:", embedding.slice(0, 5));
};

test();