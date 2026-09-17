import { Router } from "express";

import authCheck from "../../middleware/authCheck.js";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  removeNotification,
} from "../../controllers/notificationController.js";

const router = Router();

router.use(authCheck);

router.get("/", getNotifications);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);
router.delete("/:id", removeNotification);

export default router;