import { Router } from "express";
import {
  generateRoadmapFromAssessment,
  getMyRoadmaps,
  getRoadmapById,
} from "../../controllers/roadmapController.js";
import authCheck from "../../middleware/authCheck.js";

const router = Router();

router.use(authCheck);

router.post("/from-assessment/:assessmentId", generateRoadmapFromAssessment);

router.get("/", getMyRoadmaps);

router.get("/:roadmapId", getRoadmapById);

export default router;
