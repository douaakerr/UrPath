import { Router } from "express";
import auth from "./authRoutes.js";
import ai from "./aiRoutes.js"
import learningDomainRoutes from "./learningDomainRoutes.js";
import assessmentRoutes from "./assessmentRoutes.js";
import roadmap from "./roadmapRoutes.js"

const router = Router();



router.use("/auth", auth);
router.use("/ai", ai);
router.use("/learning-domains", learningDomainRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/roadmaps",roadmap);

export default router;
