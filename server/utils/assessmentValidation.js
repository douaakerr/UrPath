const DIFFICULTIES = ["beginner", "intermediate", "advanced"];
const OPTION_IDS = ["a", "b", "c", "d"];

export const validateBlueprint = (blueprint) => {
  if (!blueprint) throw new Error("Assessment blueprint is required");
  if (!Array.isArray(blueprint.areas) || blueprint.areas.length === 0) {
    throw new Error("Assessment blueprint must contain areas");
  }
  if (!Number.isInteger(blueprint.totalQuestions) || blueprint.totalQuestions <= 0) {
    throw new Error("Blueprint totalQuestions must be a positive integer");
  }

  const distribution = blueprint.difficultyDistribution || {};
  const distributionTotal = DIFFICULTIES.reduce(
    (sum, key) => sum + Number(distribution[key] || 0),
    0
  );
  if (distributionTotal !== 100) {
    throw new Error("Blueprint difficulty distribution must sum to 100");
  }

  const skillIds = blueprint.areas.map((area) => String(area.skill?._id || area.skill));
  if (new Set(skillIds).size !== skillIds.length) {
    throw new Error("Blueprint cannot contain duplicate skills");
  }

  const allocated = blueprint.areas.reduce(
    (sum, area) => sum + Number(area.questionCount || 0),
    0
  );
  if (allocated !== blueprint.totalQuestions) {
    throw new Error("Blueprint question allocations must equal totalQuestions");
  }

  for (const area of blueprint.areas) {
    if (!Number.isInteger(area.questionCount) || area.questionCount <= 0) {
      throw new Error("Each blueprint area needs a positive questionCount");
    }
  }
};

export const validateAssessmentBatch = (payload, slots, validSourceIds = new Set()) => {
  if (!payload || !Array.isArray(payload.questions)) {
    throw new Error("AI assessment response must contain questions");
  }

  const expectedIds = new Set(slots.map((slot) => slot.slotId));
  const seen = new Set();

  if (payload.questions.length !== slots.length) {
    throw new Error(`AI returned ${payload.questions.length} questions; expected ${slots.length}`);
  }

  for (const question of payload.questions) {
    if (!question.slotId || !expectedIds.has(question.slotId)) {
      throw new Error("AI returned an unknown slotId");
    }
    if (seen.has(question.slotId)) throw new Error("AI returned duplicate slotId");
    seen.add(question.slotId);

    const slot = slots.find((item) => item.slotId === question.slotId);
    if (String(question.skillId) !== String(slot.skillId)) {
      throw new Error("AI returned a question for the wrong skill");
    }
    if (question.type !== "mcq") throw new Error("Only MCQ questions are supported");
    if (!DIFFICULTIES.includes(question.difficulty)) throw new Error("Invalid question difficulty");
    if (typeof question.question !== "string" || question.question.trim().length < 10) {
      throw new Error("Question text is invalid");
    }
    if (!Array.isArray(question.options) || question.options.length !== 4) {
      throw new Error("Every MCQ must have exactly four options");
    }

    const optionIds = question.options.map((option) => option.id);
    if (
      optionIds.some((id) => !OPTION_IDS.includes(id)) ||
      new Set(optionIds).size !== 4 ||
      question.options.some((option) => !option.text?.trim())
    ) {
      throw new Error("Every MCQ must contain unique a/b/c/d options");
    }
    if (!OPTION_IDS.includes(question.correctOptionId)) {
      throw new Error("Invalid correct option");
    }

    if (!Array.isArray(question.sourceIds)) throw new Error("sourceIds must be an array");
    for (const sourceId of question.sourceIds) {
      if (validSourceIds.size > 0 && !validSourceIds.has(String(sourceId))) {
        throw new Error("AI returned an unknown sourceId");
      }
    }
  }
};
