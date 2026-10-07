import { PDFParse } from "pdf-parse";
import { generateLearningAnswer } from "../ai/agent/tools/chatTool.js";
import { generateText } from "../ai/aiService.js";

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

export const pdfChat = async (req, res) => {
  let parser;

  try {
    const message = req.body?.message?.trim();

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    parser = new PDFParse({ data: req.file.buffer });
    const result = await parser.getText();
    const pdfText = result.text?.trim();

    if (!pdfText) {
      return res.status(400).json({
        success: false,
        message: "No readable text was found in this PDF",
      });
    }

    const maxCharacters = 50000;
    const documentText =
      pdfText.length > maxCharacters
        ? pdfText.slice(0, maxCharacters) +
          "\n\n[The PDF was truncated to keep the AI context manageable.]"
        : pdfText;

    const prompt = `
You are the UrPath Learning Assistant.

The learner uploaded a PDF and wants to understand its content.

DOCUMENT:
${documentText}

LEARNER QUESTION:
${message}

RULES:
- Answer the learner's question using the uploaded document as the primary source.
- Stay focused on the document.
- Explain clearly at the learner's level.
- Give examples when they help.
- If the answer is not supported by the document, say that clearly.
- Do not invent information that is not in the document.
- If the PDF is incomplete or unclear, mention that limitation.
- Do not overwhelm the learner with unrelated information.

Return ONLY the answer text.
`;

    const answer = await generateText({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful educational assistant for the UrPath learning platform.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      maxTokens: 1800,
    });

    return res.status(200).json({
      success: true,
      answer: answer.trim(),
      fileName: req.file.originalname,
    });
  } catch (error) {
    console.error("PDF chat error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze the PDF",
    });
  } finally {
    if (parser) {
      await parser.destroy().catch(() => {});
    }
  }
};