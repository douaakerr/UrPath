import { ChromaClient } from "chromadb";

const client = new ChromaClient({
  path: "http://localhost:8000",
});

const test = async () => {
  try {
    const collection = await client.getOrCreateCollection({
      name: "urpath_knowledge",
    });

    console.log("Chroma connected successfully!");
    console.log("Collection:", collection.name);
  } catch (error) {
    console.error("Chroma error:", error);
  }
};

test();