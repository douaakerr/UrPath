import { Router } from "express";

import {
  spotifyCallback,
  spotifyLogin,
  spotifyLogout,
  spotifyMe,
} from "../../controllers/spotifyController.js";
import authCheck from "../../middleware/authCheck.js";

const router = Router();

router.get("/login", authCheck, spotifyLogin);

router.get("/callback", authCheck, spotifyCallback);

router.get("/me", authCheck, spotifyMe);

router.post("/logout", authCheck, spotifyLogout);

export default router;
