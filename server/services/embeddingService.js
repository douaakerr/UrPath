import axios from "axios";

const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/embeddings";
const EMBEDDING_MODEL =
  process.env.NVIDIA_EMBEDDING_MODEL ||
  "nvidia/llama-3.2-nv-embedqa-1b-v2";

export const createEmbedding = async (text, inputType = "query") => {
  if (!text?.trim()) {
    throw new Error("Text is required for embedding");
  }

  const apiKey = process.env.NVIDIA_API_KEY;

  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not configured");
  }

  try {
    const response = await axios.post(
      NVIDIA_URL,
      {
        input: [text],
        model: EMBEDDING_MODEL,
        input_type: inputType,
        encoding_format: "float",
        dimensions: 768,
        truncate: "END",
      },
      {
        timeout: 120000,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const embedding = response.data?.data?.[0]?.embedding;

    if (!Array.isArray(embedding) || embedding.length !== 768) {
      throw new Error(
        `NVIDIA returned an invalid embedding (expected 768 dimensions, received ${embedding?.length ?? 0})`
      );
    }

    return embedding;
  } catch (error) {
    console.error(
      "NVIDIA embedding error:",
      error.response?.data || error.message
    );

    throw new Error("Failed to create NVIDIA embedding");
  }
};
