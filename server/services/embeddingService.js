import axios from "axios";

const OLLAMA_URL =
  process.env.OLLAMA_URL || "http://localhost:11434";

const EMBEDDING_MODEL =
  process.env.EMBEDDING_MODEL || "nomic-embed-text";

export const createEmbedding = async (text) => {
  if (!text?.trim()) {
    throw new Error("Text is required for embedding");
  }

  try {
    const response = await axios.post(
      `${OLLAMA_URL}/api/embeddings`,
      {
        model: EMBEDDING_MODEL,
        prompt: text,
      },
      {
        timeout: 120000,
      }
    );

    return response.data.embedding;
  } catch (error) {
    console.error(
      "Embedding error:",
      error.response?.data || error.message
    );

    throw new Error("Failed to create embedding");
  }
};