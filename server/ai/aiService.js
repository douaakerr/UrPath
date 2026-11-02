import { generateWithOpenCode } from "./providers/openCodeProvider.js";
import { generateWithNvidia } from "./providers/nvidiaProvider.js";

export const generateText = async (params) => {
  const provider = process.env.AI_PROVIDER || "opencode";

  switch (provider) {
    case "opencode":
      return generateWithOpenCode(params);

    case "nvidia":
      return generateWithNvidia(params);

    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
};
