import express from "express";
import {
  createLearningLog,
  getMyLearningLogs,
  getTodayLearningLogs,
} from "../../controllers/learningLogController.js";
import  authCheck  from "../../middleware/authCheck.js";

const router = express.Router();

router.use(authCheck);

router.post("/", createLearningLog);
router.get("/", getMyLearningLogs);
router.get("/today", getTodayLearningLogs);

export default router;