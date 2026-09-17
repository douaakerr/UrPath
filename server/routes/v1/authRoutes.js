import { Router } from "express";
import passport from "passport";
import rateLimit from "express-rate-limit";

import {
  changePassword,
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resetPassword,
} from "../../controllers/auth.controller.js";

import { googleCallback } from "../../controllers/OauthController.js";
import authCheck from "../../middleware/authCheck.js";
import validate from "../../middleware/Validate.js";

import {
  changePasswordValidator,
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
} from "../../validators/authValidator.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

router.post(
  "/register",
  authLimiter,
  registerValidator,
  validate,
  register
);

router.post(
  "/login",
  authLimiter,
  loginValidator,
  validate,
  login
);

router.put(
  "/change-password",
  authCheck,
  changePasswordValidator,
  validate,
  changePassword
);

router.post("/logout", logout);

router.post(
  "/forgot-password",
  authLimiter,
  forgotPasswordValidator,
  validate,
  forgotPassword
);

router.post(
  "/reset-password/:token",
  authLimiter,
  resetPasswordValidator,
  validate,
  resetPassword
);

router.get("/me", authCheck, getMe);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?oauth=failed`,
  }),
  googleCallback
);

export default router;