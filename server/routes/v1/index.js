import { Router } from "express";
import auth from "./authRoutes.js";
import roadmap from "./roadmapRoutes.js"
const router = Router();



router.use("/auth", auth);
router.use("/roadmaps", roadmap);

export default router;
