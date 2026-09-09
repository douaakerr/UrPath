import { ChromaClient } from "chromadb";

const chromaClient = new ChromaClient({
  path: "http://localhost:8000",
});

export const getKnowledgeCollection = async () => {
  const collection = await chromaClient.getOrCreateCollection({
    name: "urpath_knowledge",
  });

  return collection;
};