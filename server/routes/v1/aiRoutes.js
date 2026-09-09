import express from "express";
import { askOllama } from "../../services/ollamaService.js";

const router = express.Router();

router.get("/test", async (req, res) => {
  try {
    const answer = await askOllama([
      {
        role: "user",
        content: "Say hello to UrPath in one short sentence.",
      },
    ]);

    res.json({
      success: true,
      answer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;