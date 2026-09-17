import { Router } from "express";
import ai from "./aiRoutes.js";
import assessmentRoutes from "./assessmentRoutes.js";
import auth from "./authRoutes.js";
import courseRoutes from "./courseRoutes.js";
import learningDomainRoutes from "./learningDomainRoutes.js";
import learningLogRoutes from "./learningLogRoutes.js";
import progressRoutes from "./progressRoutes.js";
import quizRoutes from "./quizRoutes.js";
import roadmap from "./roadmapRoutes.js";
import notification from "./notificationRoutes.js";
import profile from "./profileRoutes.js";   

const router = Router();

router.use("/auth", auth);
router.use("/ai", ai);
router.use("/learning-domains", learningDomainRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/roadmaps", roadmap);
router.use("/progress", progressRoutes);
router.use("/learning-logs", learningLogRoutes);
router.use("/quizzes", quizRoutes);
router.use("/courses", courseRoutes);
router.use("/notification",notification);
router.use("/profile",profile);

export default router;
