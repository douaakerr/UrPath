import { Router } from "express";

import {
  createAssessment,
  submitAssessment,
} from "../../controllers/assesmentController.js";

import authCheck from "../../middleware/authCheck.js";

const router = Router();

router.post("/", authCheck, createAssessment);
router.post("/:id/submit", authCheck, submitAssessment);


export default router;