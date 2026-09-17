import { generateText } from "../../aiService.js";
import { retrieveKnowledge } from "../../rag/retriever.js";

export const generateCourse = async ({
  domain,
  subdomain,
  goal,
  level,
  weekNumber,
  taskTitle,
  taskType,
  skills = [],
}) => {
  const knowledge = await retrieveKnowledge({
    query: `
      ${domain}
      ${subdomain}
      ${taskTitle}
      ${taskType}
      ${level}
      ${skills.join(" ")}
      lessons
      tutorials
      fundamentals
      practical examples
      common mistakes
      learning resources
    `,
    domain,
    subdomain,
    limit: 12,
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
You are the UrPath personalized course generator.

Create a complete learning course for ONE roadmap task.

LEARNER CONTEXT

Domain:
${domain}

Subdomain:
${subdomain}

Goal:
${goal}

Level:
${level}

Week:
${weekNumber}

Roadmap task:
${taskTitle}

Task type:
${taskType}

Relevant skills:
${skills.join(", ") || "Not specified"}

KNOWLEDGE FROM URPATH RAG:

${context}

The retrieved knowledge is the primary source.
Use it to create accurate educational content.

Return ONLY valid JSON.

Required format:

{
  "title": "...",
  "description": "...",
  "lessons": [
    {
      "title": "...",
      "slug": "...",
      "order": 1,
      "content": "...",
      "summary": "...",
      "objectives": [
        "..."
      ],
      "estimatedMinutes": 20,
      "resources": [
        {
          "title": "...",
          "type": "documentation",
          "url": "...",
          "provider": "...",
          "description": "...",
          "duration": null
        }
      ]
    }
  ]
}

RULES:

- Generate exactly 3 to 5 lessons.
- Lessons must progress logically from easier concepts to harder concepts.
- Lessons must directly teach the roadmap task.
- Start from the learner's actual level.
- Do not introduce unrelated technologies.
- Each lesson must contain useful educational content.
- Content should teach the concept, not merely describe it.
- Include practical examples when appropriate.
- Include common mistakes when appropriate.
- Each lesson must have 2 to 5 learning objectives.
- Each lesson should take approximately 15 to 40 minutes.
- Use Markdown inside "content" when useful.
- Do not generate empty content.

RESOURCE RULES:

- Include 1 to 3 useful resources per lesson when appropriate.
- Prefer official documentation and authoritative educational sources.
- Use retrieved source URLs when they are available in the knowledge.
- Do NOT invent fake URLs.
- If no trustworthy URL is available in the retrieved knowledge, use:
  "url": ""
- Resource types must be one of:
  "video", "article", "documentation", "book", "other".
- "provider" should identify the resource provider.
- "duration" should be a number in minutes when known, otherwise null.

IMPORTANT:

This is a personalized course, not a generic encyclopedia article.

The course must help the learner complete this exact roadmap task:

"${taskTitle}"

Return JSON only.
`;

  const response = await generateText({
    messages: [
      {
        role: "system",
        content:
          "You generate structured personalized educational courses grounded in retrieved knowledge.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
    maxTokens: 6000,
  });

  const course = parseJson(response);

  validateCourse(course);

  return course;
};

const parseJson = (text) => {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Invalid course JSON:");
    console.error(text);

    throw new Error("AI returned invalid course JSON");
  }
};

const validateCourse = (course) => {
  if (!course || typeof course !== "object") {
    throw new Error("AI returned an invalid course");
  }

  if (!course.title || typeof course.title !== "string") {
    throw new Error("Course title is missing");
  }

  if (!Array.isArray(course.lessons)) {
    throw new Error("Course lessons are missing");
  }

  if (course.lessons.length < 3 || course.lessons.length > 5) {
    throw new Error(
      `Course must contain 3 to 5 lessons. Received ${course.lessons.length}`
    );
  }

  course.lessons.forEach((lesson, index) => {
    if (!lesson.title) {
      throw new Error(
        `Lesson ${index + 1} is missing a title`
      );
    }

    if (!lesson.content) {
      throw new Error(
        `Lesson ${index + 1} is missing content`
      );
    }

    if (!Array.isArray(lesson.objectives)) {
      throw new Error(
        `Lesson ${index + 1} objectives must be an array`
      );
    }

    if (
      !Array.isArray(lesson.resources)
    ) {
      throw new Error(
        `Lesson ${index + 1} resources must be an array`
      );
    }

    lesson.resources.forEach((resource, resourceIndex) => {
      if (!resource.title) {
        throw new Error(
          `Lesson ${index + 1}, resource ${resourceIndex + 1} is missing a title`
        );
      }

      if (!resource.type) {
        throw new Error(
          `Lesson ${index + 1}, resource ${resourceIndex + 1} is missing a type`
        );
      }

      if (
        ![
          "video",
          "article",
          "documentation",
          "book",
          "other",
        ].includes(resource.type)
      ) {
        throw new Error(
          `Invalid resource type in lesson ${index + 1}`
        );
      }

      if (resource.url === undefined) {
        resource.url = "";
      }
    });
  });
};