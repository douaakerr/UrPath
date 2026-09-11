export const assessmentBatchSchema = {
  type: "object",
  additionalProperties: false,
  required: ["questions"],
  properties: {
    questions: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "slotId",
          "skillId",
          "type",
          "question",
          "difficulty",
          "options",
          "correctOptionId",
          "explanation",
          "sourceIds",
        ],
        properties: {
          slotId: { type: "string", minLength: 1 },
          skillId: { type: "string", minLength: 1 },
          type: { const: "mcq" },
          question: { type: "string", minLength: 10, maxLength: 1200 },
          difficulty: { enum: ["beginner", "intermediate", "advanced"] },
          options: {
            type: "array",
            minItems: 4,
            maxItems: 4,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["id", "text"],
              properties: {
                id: { enum: ["a", "b", "c", "d"] },
                text: { type: "string", minLength: 1, maxLength: 500 },
              },
            },
          },
          correctOptionId: { enum: ["a", "b", "c", "d"] },
          explanation: { type: "string", minLength: 1, maxLength: 1500 },
          sourceIds: {
            type: "array",
            uniqueItems: true,
            maxItems: 5,
            items: { type: "string", minLength: 1 },
          },
        },
      },
    },
  },
};
