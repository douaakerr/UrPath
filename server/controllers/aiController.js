import { generateLearningAnswer } from "../ai/agent/tools/chatTool.js";

export const learningChat = async (req, res) => {
  try {
    const {
      domain,
      subdomain,
      goal,
      level,
      courseTitle,
      lessonTitle,
      lessonContent,
      message,
    } = req.body || {};

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (!courseTitle || !lessonTitle) {
      return res.status(400).json({
        success: false,
        message: "Course and lesson context are required",
      });
    }

    const answer = await generateLearningAnswer({
      domain,
      subdomain,
      goal,
      level,
      courseTitle,
      lessonTitle,
      lessonContent,
      message,
    });

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("Learning chat error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to generate learning answer",
    });
  }
};