import { generateText } from "../../aiService.js";
import { retrieveKnowledge } from "../../rag/retriever.js";

export const generateLearningAnswer = async ({
  domain,
  subdomain,
  goal,
  level,
  courseTitle,
  lessonTitle,
  lessonContent,
  message,
}) => {
  const knowledge = await retrieveKnowledge({
    query: `
      ${domain}
      ${subdomain}
      ${courseTitle}
      ${lessonTitle}
      ${message}
      explanation
      examples
      common mistakes
    `,
    domain,
    subdomain,
    limit: 8,
  });

  const context = knowledge
    .map((item) => {
      const source = item.metadata?.source
        ? `Source: ${item.metadata.source}`
        : "";

      const sourceUrl = item.metadata?.sourceUrl
        ? `Source URL: ${item.metadata.sourceUrl}`
        : "";

      return `${item.text}\n${source}\n${sourceUrl}`;
    })
    .filter(Boolean)
    .join("\n\n");

  const prompt = `
You are the UrPath Learning Assistant.

Your job is to help the learner understand the lesson they are currently studying.

LEARNER

Domain:
${domain}

Subdomain:
${subdomain}

Goal:
${goal}

Level:
${level}

CURRENT COURSE:
${courseTitle}

CURRENT LESSON:
${lessonTitle}

LESSON CONTENT:
${lessonContent}

RETRIEVED KNOWLEDGE:
${context}

LEARNER QUESTION:
${message}

RULES:

- Answer the learner's question directly.
- Stay focused on the current course and lesson.
- Use the retrieved knowledge as the primary factual source.
- Use the lesson content as additional context.
- Explain concepts according to the learner's level.
- Give practical examples when useful.
- If the question is about code, provide a small clear example.
- Do not overwhelm the learner with unrelated information.
- Do not invent facts or sources.
- If the retrieved knowledge does not contain enough information, say that clearly.
- Do not pretend to know something that is not supported by the lesson or retrieved knowledge.
- Encourage understanding rather than simply giving an answer.

Return ONLY the answer text.
`;

  const response = await generateText({
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

  return response.trim();
};