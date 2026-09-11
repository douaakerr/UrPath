import axios from "axios";

const getConfig = () => {
  const url = process.env.OLLAMA_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "qwen2.5:3b-instruct";
  return { url: url.replace(/\/$/, ""), model };
};

export const askOllama = async ({
  messages,
  temperature = 0.2,
  maxTokens = 300,
  timeout = 180000,
  format,
} = {}) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Ollama messages are required");
  }

  const { url, model } = getConfig();
  const body = {
    model,
    messages,
    stream: false,
    options: { temperature, num_predict: maxTokens },
  };

  if (format) body.format = format;

  try {
    const response = await axios.post(`${url}/api/chat`, body, { timeout });
    const content = response.data?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      throw new Error("Ollama returned no message content");
    }
    return content;
  } catch (error) {
    console.error("========== OLLAMA ERROR ==========");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);
    console.error("Model:", model);
    console.error("==================================");
    throw new Error(
      `Ollama request failed: ${error.response?.data?.error || error.message}`
    );
  }
};
