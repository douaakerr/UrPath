import express from "express";
import { askOllama } from "../../services/ollamaService.js";
import protect from "../../middleware/authCheck.js";

const router = express.Router();

router.get("/test", protect, async (req, res) => {
  try {
    const answer = await askOllama({
      messages: [
        {
          role: "user",
          content: "Say hello to UrPath in one short sentence.",
        },
      ],
      temperature: 0,
      maxTokens: 64,
    });

    res.json({ success: true, answer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
