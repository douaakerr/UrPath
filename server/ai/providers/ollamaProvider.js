import axios from "axios";



export const generateWithOllama = async ({
  messages,
  temperature = 0.2,
  maxTokens = 300,
  timeout = 120000,
}) => {
  try {
    const response = await axios.post(
      `${process.env.OLLAMA_URL}/api/chat`,
      {
        model: process.env.OLLAMA_MODEL,
        messages,
        stream: false,
        think: false,
        options: {
          temperature,
          num_predict: maxTokens,
        },
      },
      {
        timeout,
      }
    );

    return response.data.message.content;
  } catch (error) {
    console.error("========== OLLAMA ERROR ==========");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);
    console.error("==================================");

    throw new Error("AI provider failed");
  }
};