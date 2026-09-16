import { Router } from "express";
import auth from "./authRoutes.js";
import ai from "./aiRoutes.js"
import learningDomainRoutes from "./learningDomainRoutes.js";
import assessmentRoutes from "./assessmentRoutes.js";
import roadmap from "./roadmapRoutes.js"
import progressRoutes from "./progressRoutes.js";
import learningLogRoutes from "./learningLogRoutes.js";
import quizRoutes from "./quizRoutes.js";

const router = Router();


router.use("/auth", auth);
router.use("/ai", ai);
router.use("/learning-domains", learningDomainRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/roadmaps",roadmap);
router.use("/progress", progressRoutes);
router.use("/learning-logs", learningLogRoutes);
router.use("/quizzes", quizRoutes);

export default router;
