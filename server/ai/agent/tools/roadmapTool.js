import { generateText } from "../../aiService.js";
import { retrieveKnowledge } from "../../rag/retriever.js";

export const generateRoadmap = async ({
  domain,
  subdomain,
  goal,
  level,
  skillScores = {},
}) => {
  const knowledge = await retrieveKnowledge({
    query: `
      ${domain}
      ${subdomain}
      roadmap
      learning path
      skills
      prerequisites
      beginner
      intermediate
      advanced
      courses
      projects
    `,
    domain,
    subdomain,
    limit: 12,
  });

  const context = knowledge
    .map((item) => item.text)
    .filter(Boolean)
    .join("\n\n");

  // Calculate learner strengths and weaknesses
  const skillAnalysis = Object.entries(skillScores).map(
    ([skill, score]) => {
      const percentage = score.total
        ? Math.round((score.correct / score.total) * 100)
        : 0;

      let status;

      if (percentage < 40) {
        status = "weak";
      } else if (percentage < 70) {
        status = "learning";
      } else {
        status = "strong";
      }

      return {
        skill,
        correct: score.correct,
        total: score.total,
        percentage,
        status,
      };
    }
  );

  const weakSkills = skillAnalysis
    .filter((skill) => skill.status === "weak")
    .map((skill) => skill.skill);

  const learningSkills = skillAnalysis
    .filter((skill) => skill.status === "learning")
    .map((skill) => skill.skill);

  const strongSkills = skillAnalysis
    .filter((skill) => skill.status === "strong")
    .map((skill) => skill.skill);

  const prompt = `
You are the UrPath personalized learning roadmap generator.

Create a personalized learning roadmap for:

Domain: ${domain}
Subdomain: ${subdomain}
Goal: ${goal}
Current level: ${level}

IMPORTANT: The learner's assessment results are authoritative.

ASSESSMENT SKILL ANALYSIS:

${JSON.stringify(skillAnalysis, null, 2)}

Weak skills:
${weakSkills.join(", ") || "None"}

Skills that need improvement:
${learningSkills.join(", ") || "None"}

Strong skills:
${strongSkills.join(", ") || "None"}

Use the knowledge below to build a logical learning path.

KNOWLEDGE:
${context}

Return ONLY valid JSON.

Format:

{
  "title": "...",
  "level": "${level}",
 "skills": [
  {
    "name": "...",
    "level": "beginner",
    "status": "weak",
    "source": "assessed"
  }
],
  "weeks": [
    {
      "week": 1,
      "title": "...",
      "objective": "...",
      "topics": [
        "..."
      ],
      "tasks": [
        {
          "title": "...",
          "type": "lesson"
        }
      ]
    }
  ]
}

Rules:

- Create exactly 6 weeks.
- Start from the learner's actual level.
- Prioritize weak skills first.
- Then prioritize skills that need improvement.
- Do not spend unnecessary time teaching strong skills.
- Respect prerequisites between skills.
- Each week must have a clear objective.
- Each week must contain 2 to 4 topics.
- Each week must contain 2 to 4 tasks.
- Use task types: lesson, practice, project, quiz.
- Include at least one practical project.
- The roadmap must directly help achieve the user's goal.
- Do not include unrelated technologies or concepts.

VERY IMPORTANT SKILL STATUS RULES:

- A skill with 70% or higher is NOT weak.
- A skill between 40% and 69% should be "learning".
- A skill below 40% should be "weak".
- Do not invent weak skills that contradict the assessment.
- Do not mark a strong assessment skill as weak.
- You may introduce new skills required for the learner's goal, but clearly distinguish them from assessed weak skills.
- The assessment results must influence the roadmap.

SKILL SOURCE RULES:

- Skills directly represented in the assessment must use source "assessed".
- Assessed skills MUST use the status determined by the assessment.
- Do not change an assessed skill from weak to learning or strong.
- Do not change an assessed skill from strong to learning or weak.
- Skills introduced because they are useful for the learner's goal must use source "recommended".
- Recommended skills may have status "learning".
- Do not invent assessment results.

Return JSON only.
`;

  const response = await generateText({
    messages: [
      {
        role: "system",
        content:
          "You generate personalized structured learning roadmaps based on objective assessment results.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
    maxTokens: 3500,
  });

 const roadmap = parseJson(response);

const assessedSkills = new Map(
  skillAnalysis.map((skill) => [
    skill.skill.toLowerCase().trim(),
    skill,
  ])
);

roadmap.skills = roadmap.skills.map((skill) => {
  const assessed = assessedSkills.get(
    skill.name.toLowerCase().trim()
  );

  if (assessed) {
    return {
      ...skill,
      status: assessed.status,
      source: "assessed",
    };
  }

  return {
    ...skill,
    source: "recommended",
  };
});

return roadmap;
};

const parseJson = (text) => {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Invalid roadmap JSON:", text);
    throw new Error("AI returned invalid roadmap JSON");
  }
};