import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

const OLLAMA_URL = process.env.OLLAMA_URL;
const EMBEDDING_MODEL = "nomic-embed-text";

export const createEmbedding = async (text) => {
  try {
    const response = await axios.post(
      `${OLLAMA_URL}/api/embeddings`,
      {
        model: EMBEDDING_MODEL,
        prompt: text,
      }
    );

    return response.data.embedding;
  } catch (error) {
    console.error("Embedding error:", error.response?.data || error.message);
    throw new Error("Failed to create embedding");
  }
};