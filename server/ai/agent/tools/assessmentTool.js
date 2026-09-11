import { generateText } from "../../aiService.js";
import { retrieveKnowledge } from "../../rag/retriever.js";

export const generateAssessment = async ({
  domain,
  subdomain,
  goal,
  learnerLevel = "unknown",
}) => {
  const knowledge = await retrieveKnowledge({
    query: `
      ${domain}
      ${subdomain}
      important skills
      core concepts
      fundamentals
      intermediate concepts
      advanced concepts
      assessment
    `,
    domain,
    subdomain,
    limit: 8,
  });

  const context = knowledge
    .map((item) => item.text)
    .filter(Boolean)
    .join("\n\n");

  const prompt = `
You are the UrPath diagnostic assessment generator.

Create a diagnostic assessment for:

Domain: ${domain}
Subdomain: ${subdomain}
Goal: ${goal}
Current level: ${learnerLevel}

Use the knowledge below to identify the important concepts and skills.

KNOWLEDGE:
${context}

Return ONLY valid JSON.

Format:

{
  "title": "...",
  "domain": "${domain}",
  "subdomain": "${subdomain}",
  "questions": [
    {
      "id": "q1",
      "skill": "...",
      "difficulty": "beginner",
      "type": "mcq",
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

- Generate exactly 10 questions.
- Cover different important skills.
- Test the selected subdomain specifically.
- Do not ask unrelated questions.
- Include beginner, intermediate and advanced questions.
- Use approximately:
  - 4 beginner
  - 4 intermediate
  - 2 advanced
- Each question must have exactly 4 options.
- correctAnswer must exactly match one option.
- Do not invent unrelated technologies or concepts.
- Questions must be useful for determining the learner's real level.
- Return JSON only.
`;

  const response = await generateText({
    messages: [
      {
        role: "system",
        content:
          "You generate structured educational diagnostic assessments.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
    maxTokens: 2500,
  });

  return parseJson(response);
};

const parseJson = (text) => {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Invalid assessment JSON:", text);
    throw new Error("AI returned invalid assessment JSON");
  }
};