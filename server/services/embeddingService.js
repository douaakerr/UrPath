import axios from "axios";

const getConfig = () => ({
  url: (process.env.OLLAMA_URL || "http://localhost:11434").replace(/\/$/, ""),
  model: process.env.EMBEDDING_MODEL || "nomic-embed-text",
});

export const createEmbedding = async (text) => {
  if (!text?.trim()) throw new Error("Text is required for embedding");

  const { url, model } = getConfig();
  try {
    const response = await axios.post(
      `${url}/api/embeddings`,
      { model, prompt: text },
      { timeout: 120000 }
    );

    const embedding = response.data?.embedding;
    if (!Array.isArray(embedding) || embedding.length === 0) {
      throw new Error("Ollama returned an invalid embedding");
    }
    return embedding;
  } catch (error) {
    console.error("Embedding error:", error.response?.data || error.message);
    throw new Error(`Failed to create embedding: ${error.response?.data?.error || error.message}`);
  }
};
