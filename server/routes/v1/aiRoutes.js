import { Router } from "express";
import { learningChat } from "../../controllers/aiController.js";


const router = Router();

router.post("/learning-chat", learningChat);



export default router;
