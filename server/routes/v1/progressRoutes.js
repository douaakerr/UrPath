import { Router } from "express";

import {
  createProgress,
  getMyProgress,
  getProgressByRoadmap,
  completeTask
} from "../../controllers/progressController.js";

import authCheck from "../../middleware/authCheck.js";

const router = Router();

router.use(authCheck);

router.post("/", createProgress);

router.get("/", getMyProgress);

router.get("/:roadmapId", getProgressByRoadmap);
router.patch("/complete-task", completeTask);

export default router;