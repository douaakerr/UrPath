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
You are UrPath's expert diagnostic assessment generator.

Your task is to evaluate the learner's current knowledge of ONE specific subject.

LEARNER PROFILE
- Domain: ${domain}
- Subdomain: ${subdomain}
- Goal: ${goal}
- Current level: ${learnerLevel}

REFERENCE KNOWLEDGE:
${context || "No reference knowledge was retrieved. Use your own knowledge, strictly limited to the selected domain and subdomain."}

SUBJECT RELEVANCE RULES — HIGHEST PRIORITY
1. Every question must directly test knowledge or a practical skill within the selected subdomain: "${subdomain}".
2. Use "${domain}" as the broader context, not as permission to test unrelated subjects.
3. Do not switch to another domain, subdomain, programming language, framework, tool, or platform unless it is essential to the selected subject.
4. Do not assume the learner uses a specific IDE, programming language, robotics kit, or visual programming environment unless specified in the subject or reference knowledge.
5. For robotics, relevant topics can include sensors, actuators, control systems, obstacle detection, robot movement, and embedded programming when appropriate to the selected subdomain.
6. Questions about specific blocks, menus, or commands in Scratch, Arduino IDE, LEGO robotics, or another platform are allowed ONLY when that platform is relevant to the selected subject. Never assume a particular platform without evidence.
7. Reject vague questions such as "Which block is used for a sensor?" unless the programming environment and intended sensor operation are clearly specified.
8. Do not include generic computer science, mathematics, AI, or programming questions merely because they are related to technology. Include them only when they directly support the selected subdomain.
9. The learner's goal affects the assessment emphasis, but must never change the selected subject.
10. Use the reference knowledge when relevant. Do not blindly copy irrelevant or contradictory retrieved content.

QUESTION QUALITY
- Generate exactly 10 distinct questions.
- Use exactly 4 beginner, 4 intermediate, and 2 advanced questions.
- Cover different important skills within the selected subdomain.
- Questions must measure understanding, not just memorization.
- Use clear, self-contained wording.
- Avoid ambiguous questions, duplicate questions, trick questions, and unsupported assumptions.
- Every multiple-choice question must have exactly 4 distinct options.
- Exactly one option must be correct.
- "correctAnswer" must exactly match one of the options.
- Explanations must clearly explain why the answer is correct.
- Assign each question a specific skill that belongs to the selected subdomain.
- Do not fabricate facts, APIs, commands, or platform-specific features.

OUTPUT FORMAT
Return ONLY valid JSON. Do not include Markdown fences or additional text.

{
  "title": "A concise assessment title for the selected subject",
  "domain": "${domain}",
  "subdomain": "${subdomain}",
  "questions": [
    {
      "id": "q1",
      "skill": "A specific relevant skill",
      "difficulty": "beginner",
      "type": "mcq",
      "question": "A clear question about the selected subject",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": "Option A",
      "explanation": "A concise explanation of the correct answer."
    }
  ]
}

Before returning the JSON, silently verify:
- There are exactly 10 questions.
- The difficulty distribution is 4 beginner, 4 intermediate, and 2 advanced.
- Every question matches the selected domain and subdomain.
- No question assumes an unspecified platform.
- Each question has 4 distinct options and a valid correctAnswer.
- The output is valid JSON.
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