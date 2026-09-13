import { scoreAssessment } from "./services/assessmentScoringService.js";

const assessment = {
  questions: [
    {
      id: "q1",
      skill: "React",
      correctAnswer: "A",
    },
    {
      id: "q2",
      skill: "JavaScript",
      correctAnswer: "B",
    },
    {
      id: "q3",
      skill: "React",
      correctAnswer: "C",
    },
  ],
};

const answers = {
  q1: "A",
  q2: "B",
  q3: "A",
};

console.log(scoreAssessment(assessment, answers));