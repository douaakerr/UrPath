import axios from "axios";

const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

export const generateWithNvidia = async ({
  messages,
  temperature = 0.2,
  maxTokens = 25000,
  timeout = 240000,
}) => {
  const apiKey = process.env.NVIDIA_API_KEY;

  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not configured");
  }

  let responseData;

  try {
    const response = await axios.post(
      NVIDIA_URL,
      {
        model:
          process.env.NVIDIA_MODEL ||
          "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
        messages,
        temperature,
        max_tokens: Math.max(maxTokens, 10000),
        stream: false,
        chat_template_kwargs: {
  enable_thinking: false,
},
      },
      {
        timeout,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    responseData = response.data;

    const choice = responseData?.choices?.[0];
    const message = choice?.message;
    const content = message?.content;

    console.log("NVIDIA RESPONSE DEBUG:", {
      finish_reason: choice?.finish_reason,
      content_type: typeof content,
      content_length: typeof content === "string" ? content.length : 0,
      reasoning_length:
        typeof message?.reasoning_content === "string"
          ? message.reasoning_content.length
          : 0,
      usage: responseData?.usage,
    });

console.log("NVIDIA RESPONSE DEBUG:", {
  finish_reason: choice?.finish_reason,
  message_keys: Object.keys(message || {}),
  content_type: typeof message?.content,
  content_length: message?.content?.length ?? 0,
  reasoning_length: message?.reasoning_content?.length ?? 0,
  usage: response.data?.usage,
});

    if (typeof content !== "string" || !content.trim()) {
      console.error(
        "NVIDIA RAW RESPONSE:",
        JSON.stringify(responseData, null, 2)
      );
      throw new Error("NVIDIA returned an empty response");
    }

    return content.trim();
  } catch (error) {
    console.error("========== NVIDIA ERROR ==========");
    console.error("Message:", error.message);
    console.error("Status:", error.response?.status);
    console.error(
      "Response:",
      error.response?.data ?? responseData ?? "No response body received"
    );
    console.error("==================================");

    throw new Error("AI provider failed");
  }
};
