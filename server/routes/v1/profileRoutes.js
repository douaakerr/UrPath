import { Router } from "express";

import authCheck from "../../middleware/authCheck.js";
import upload from "../../middleware/upload.js";

import {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
} from "../../controllers/profileController.js";

const router = Router();

router.use(authCheck);

router.get("/", getProfile);

router.patch("/", updateProfile);

router.post(
  "/photo",
  upload.single("photo"),
  uploadProfilePhoto
);

router.delete(
  "/photo",
  deleteProfilePhoto
);

export default router;