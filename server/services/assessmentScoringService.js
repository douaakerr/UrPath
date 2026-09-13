export const scoreAssessment = (assessment, answers) => {
  let correct = 0;

  const skillScores = {};

  for (const question of assessment.questions) {
    const userAnswer = answers[question.id];

    const isCorrect = userAnswer === question.correctAnswer;

    if (isCorrect) {
      correct++;
    }

    if (!skillScores[question.skill]) {
      skillScores[question.skill] = {
        correct: 0,
        total: 0,
      };
    }

    skillScores[question.skill].total++;

    if (isCorrect) {
      skillScores[question.skill].correct++;
    }
  }

  const total = assessment.questions.length;

  const percentage = total
    ? Math.round((correct / total) * 100)
    : 0;

  let level;

  if (percentage < 40) {
    level = "beginner";
  } else if (percentage < 70) {
    level = "intermediate";
  } else {
    level = "advanced";
  }

  return {
    correct,
    total,
    percentage,
    level,
    skillScores,
  };
};