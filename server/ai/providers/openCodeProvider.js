import axios from "axios";

const OPENCODE_URL =
  process.env.OPENCODE_URL || "http://127.0.0.1:4096";

const OPENCODE_PROVIDER =
  process.env.OPENCODE_PROVIDER || "opencode";

const OPENCODE_MODEL =
  process.env.OPENCODE_MODEL || "mimo-v2.5-free";

export const generateWithOpenCode = async ({
  messages,
  temperature = 0.2,
  maxTokens = 1000,
  timeout = 120000,
}) => {
  try {
    const sessionResponse = await axios.post(
      `${OPENCODE_URL}/session`,
      {
        title: "UrPath AI",
      },
      {
        timeout: 10000,
      }
    );

    const sessionId = sessionResponse.data.id;

    const prompt = messages
      .map((message) => {
        return `${message.role}: ${message.content}`;
      })
      .join("\n\n");

    const response = await axios.post(
      `${OPENCODE_URL}/session/${sessionId}/message`,
      {
        model: {
          providerID: OPENCODE_PROVIDER,
          modelID: OPENCODE_MODEL,
        },
        parts: [
          {
            type: "text",
            text: prompt,
          },
        ],
        ...(temperature !== undefined && {
          temperature,
        }),
        ...(maxTokens !== undefined && {
          maxTokens,
        }),
      },
      {
        timeout,
      }
    );

    const textPart = response.data.parts?.find(
      (part) => part.type === "text"
    );

    return textPart?.text || "";
  } catch (error) {
    console.error("========== OPENCODE ERROR ==========");
    console.error("Message:", error.message);
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);
    console.error("====================================");

    throw new Error("AI provider failed");
  }
};
