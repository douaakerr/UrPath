import { generateText } from "../../aiService.js";
import { retrieveKnowledge } from "../../rag/retriever.js";

export const generateQuiz = async ({
  domain,
  subdomain,
  goal,
  weekNumber,
  taskTitle,
  level = "beginner",
}) => {
  // =========================================================
  // 1. RETRIEVE RELEVANT KNOWLEDGE FROM RAG
  // =========================================================

  const knowledge = await retrieveKnowledge({
    query: `
      ${domain}
      ${subdomain}
      ${taskTitle}
      ${level}
      important concepts
      fundamentals
      practical examples
      common mistakes
      quiz questions
    `,
    domain,
    subdomain,
    limit: 8,
  });

  const context = knowledge
    .map((item) => item.text)
    .filter(Boolean)
    .join("\n\n");

  // =========================================================
  // 2. BUILD AI PROMPT
  // =========================================================

  const prompt = `
You are the UrPath educational quiz generator.

Generate a quiz based on the learner's roadmap task.

Domain:
${domain}

Subdomain:
${subdomain}

Goal:
${goal}

Week:
${weekNumber}

Task:
${taskTitle}

Learner level:
${level}

Use the retrieved knowledge below as the primary source for the quiz.

KNOWLEDGE:
${context}

Return ONLY valid JSON.

Required format:

{
  "title": "...",
  "description": "...",
  "questions": [
    {
      "question": "...",
      "options": [
        "...",
        "...",
        "...",
        "..."
      ],
      "correctAnswer": "...",
      "explanation": "..."
    }
  ]
}

Rules:

- Generate exactly 5 questions.
- Every question must be directly related to the roadmap task.
- Test understanding, not random memorization.
- Use the provided knowledge as the basis for the questions.
- Do not introduce unrelated technologies or concepts.
- Each question must have exactly 4 options.
- There must be exactly ONE correct answer.
- correctAnswer must exactly match one of the options.
- Provide a short explanation for every answer.
- Questions should match the learner level.
- Mix conceptual and practical questions when appropriate.
- Do not repeat the same question or concept unnecessarily.
- Do not include question IDs.
- Do not include answers outside the JSON structure.
- Return JSON only.
`;

  // =========================================================
  // 3. SEND TO OPENCODE THROUGH YOUR EXISTING AI SERVICE
  // =========================================================

  const response = await generateText({
    messages: [
      {
        role: "system",
        content:
          "You generate structured educational quizzes grounded in retrieved knowledge.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
    maxTokens: 1800,
  });

  // =========================================================
  // 4. PARSE AI RESPONSE
  // =========================================================

  const quiz = parseJson(response);

  // =========================================================
  // 5. VALIDATE AI OUTPUT
  // =========================================================

  validateQuiz(quiz);

  return quiz;
};


// =========================================================
// JSON PARSER
// =========================================================

const parseJson = (text) => {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Invalid quiz JSON:");
    console.error(text);

    throw new Error("AI returned invalid quiz JSON");
  }
};


// =========================================================
// QUIZ VALIDATION
// =========================================================

const validateQuiz = (quiz) => {
  if (!quiz || typeof quiz !== "object") {
    throw new Error("AI returned an invalid quiz");
  }

  if (!quiz.title || typeof quiz.title !== "string") {
    throw new Error("Quiz title is missing");
  }

  if (!Array.isArray(quiz.questions)) {
    throw new Error("Quiz questions are missing");
  }

  if (quiz.questions.length !== 5) {
    throw new Error(
      `AI must generate exactly 5 questions. Received ${quiz.questions.length}`
    );
  }

  quiz.questions.forEach((question, index) => {
    if (!question.question) {
      throw new Error(
        `Question ${index + 1} is missing its question text`
      );
    }

    if (
      !Array.isArray(question.options) ||
      question.options.length !== 4
    ) {
      throw new Error(
        `Question ${index + 1} must contain exactly 4 options`
      );
    }

    if (!question.correctAnswer) {
      throw new Error(
        `Question ${index + 1} is missing correctAnswer`
      );
    }

    if (!question.options.includes(question.correctAnswer)) {
      throw new Error(
        `Question ${index + 1} has a correctAnswer that does not match any option`
      );
    }

    if (!question.explanation) {
      throw new Error(
        `Question ${index + 1} is missing an explanation`
      );
    }
  });
};