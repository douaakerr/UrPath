import { Router } from "express";
import auth from "./authRoutes.js";
import ai from "./aiRoutes.js";
import learningDomainRoutes from "./learningDomainRoutes.js";
import assessmentRoutes from "./assessmentRoutes.js";

const router = Router();

router.use("/auth", auth);
router.use("/ai", ai);
router.use("/learning-domains", learningDomainRoutes);
router.use("/assessment", assessmentRoutes);

export default router;
