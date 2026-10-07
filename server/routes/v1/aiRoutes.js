import { Router } from "express";
import multer from "multer";
import authCheck from "../../middleware/authCheck.js";
import { learningChat, pdfChat } from "../../controllers/aiController.js";

const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }

    cb(null, true);
  },
});

const router = Router();

router.post("/learning-chat", learningChat);

router.post(
  "/pdf-chat",
  authCheck,
  pdfUpload.single("file"),
  pdfChat
);

export default router;
