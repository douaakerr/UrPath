import { Router } from "express";

import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  changePassword,
  getMe
} from "../../controllers/auth.controller.js";

import authCheck from "../../middleware/authCheck.js";

const router = Router();


router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/change-password", authCheck, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", authCheck, getMe);

export default router;
