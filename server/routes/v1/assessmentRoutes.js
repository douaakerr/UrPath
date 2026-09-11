import { Router } from "express";
import protect from "../../middleware/authCheck.js";
import {
  generateAssessmentController,
  getAssessmentController,
  submitAssessmentController,
} from "../../controllers/assessmentController.js";

const router = Router();

router.use(protect);
router.post("/", generateAssessmentController);
router.post("/:id/submit", submitAssessmentController);
router.get("/:id", getAssessmentController);

export default router;
