import axios from "axios";

const OLLAMA_URL = process.env.OLLAMA_URL;

const OLLAMA_MODEL = process.env.OLLAMA_MODEL;

export const askOllama = async (messages) => {
  try {
    const response = await axios.post(`${process.env.OLLAMA_URL}/api/chat`, {
      model: process.env.OLLAMA_MODEL,
      messages,
      stream: false,
      think: false,
    });

    return response.data.message.content;
  } catch (error) {
    console.error("========== OLLAMA ERROR ==========");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);
    console.log("OLLAMA_URL =", OLLAMA_URL);
    console.log("OLLAMA_MODEL =", process.env.OLLAMA_MODEL);
    console.error("===================================");

    throw new Error("Failed to communicate with Ollama");
  }
};
