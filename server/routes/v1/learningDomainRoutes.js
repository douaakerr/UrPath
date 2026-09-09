import { Router } from "express";
import { getLearningDomains } from "../../controllers/learningDomainController.js";

const router = Router();

router.get("/", getLearningDomains);

export default router;