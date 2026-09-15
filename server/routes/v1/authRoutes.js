import { Router } from "express";

import passport from "passport";
import {
  changePassword,
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resetPassword,
} from "../../controllers/auth.controller.js";
import authCheck from "../../middleware/authCheck.js";
import { googleCallback } from "../../controllers/OauthController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/change-password", authCheck, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", authCheck, getMe);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?oauth=failed`,
  }),
  googleCallback,
);

export default router;
