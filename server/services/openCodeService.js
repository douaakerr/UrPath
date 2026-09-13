import axios from "axios";

const OPENCODE_URL =
  process.env.OPENCODE_URL || "http://127.0.0.1:4096";

const OPENCODE_PROVIDER =
  process.env.OPENCODE_PROVIDER || "opencode";

const OPENCODE_MODEL =
  process.env.OPENCODE_MODEL || "mimo-v2.5-free";

export const askOpenCode = async (prompt) => {
  try {
    // 1. Create a new OpenCode session
    const sessionResponse = await axios.post(
      `${OPENCODE_URL}/session`,
      {
        title: "UrPath AI Test",
      },
      {
        timeout: 10000,
      }
    );

    const sessionId = sessionResponse.data.id;

    // 2. Send the prompt to the selected model
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
      },
      {
        timeout: 120000,
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

    throw new Error("Failed to communicate with local OpenCode server");
  }
};
