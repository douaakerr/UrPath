import { generateText } from "./ai/aiService.js";

const result = await generateText({
  messages: [
    {
      role: "system",
      content: "You are the UrPath AI assistant.",
    },
    {
      role: "user",
      content: "Reply with exactly: URPATH_PROVIDER_OK",
    },
  ],
});

console.log("AI RESPONSE:", result);