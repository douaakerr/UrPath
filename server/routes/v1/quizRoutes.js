import { Router } from "express";

import {
  generateQuizFromRoadmap,
  getMyQuizzes,
  getQuizById,
  submitQuiz,
} from "../../controllers/quizController.js";

import authCheck from "../../middleware/authCheck.js";

const router = Router();

router.use(authCheck);


router.post("/generate", generateQuizFromRoadmap);
router.get("/", getMyQuizzes);
router.get("/:quizId", getQuizById);
router.post("/:quizId/submit", submitQuiz);

export default router;
