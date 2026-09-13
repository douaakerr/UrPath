import { Router } from "express";

import {
  createAssessment,
  submitAssessment,
  generateRoadmapFromAssessment,
} from "../../controllers/assesmentController.js";

const router = Router();

router.post("/", createAssessment);

router.post("/submit", submitAssessment);

router.post("/:assessmentId/roadmap", generateRoadmapFromAssessment);

export default router;