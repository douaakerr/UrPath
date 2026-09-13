import { generateWithOllama } from "./providers/ollamaProvider.js";
import { generateWithOpenCode } from "./providers/openCodeProvider.js";

export const generateText = async (params) => {
  const provider = process.env.AI_PROVIDER || "opencode";

  switch (provider) {
    case "ollama":
      return generateWithOllama(params);

    case "opencode":
      return generateWithOpenCode(params);

    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
};