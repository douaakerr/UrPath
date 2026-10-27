
import axios from "axios";

const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

export const generateWithNvidia = async ({
  messages,
  temperature = 0.2,
  maxTokens = 2500,
  timeout = 240000,
}) => {
  const apiKey = process.env.NVIDIA_API_KEY;

  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not configured");
  }

  try {
    const response = await axios.post(
      NVIDIA_URL,
      {
        model:
          process.env.NVIDIA_MODEL ||
          "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: false,
      },
      {
        timeout,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;

    if (typeof content !== "string" || !content.trim()) {
      throw new Error("NVIDIA returned an empty response");
    }

    return content.trim();
  } catch (error) {
    console.error("========== NVIDIA ERROR ==========");
    console.error("Message:", error.message);
    console.error("Status:", error.response?.status);
    console.error(
      "Response:",
      error.response?.data
    );
    console.error("==================================");

    throw new Error("AI provider failed");
  }
};
