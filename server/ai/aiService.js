import { generateWithOllama } from "./providers/ollamaProvider.js";

export const generateText = async (params) => {
  const provider = process.env.AI_PROVIDER || "ollama";

  switch (provider) {
    case "ollama":
      return generateWithOllama(params);

    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
};