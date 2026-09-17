import { Router } from "express";

import authCheck from "../../middleware/authCheck.js";

import {
  addLesson,
  addResource,
  completeLesson,
  createCourse,
  deleteCourse,
  deleteResource,
  generateCourseFromRoadmap,
  getCourseById,
  getCourseProgress,
  getMyCourses,
  updateCourse,
  updateLesson,
} from "../../controllers/courseController.js";

const router = Router();

router.use(authCheck);

// --------------------------------------------------
// AI COURSE GENERATION
// --------------------------------------------------

router.post("/generate", generateCourseFromRoadmap);

// --------------------------------------------------
// COURSES
// --------------------------------------------------

router.post("/", createCourse);

router.get("/", getMyCourses);

// IMPORTANT:
// Put specific routes before /:courseId

router.get("/:courseId/progress", getCourseProgress);

router.get("/:courseId", getCourseById);

router.patch("/:courseId", updateCourse);

router.delete("/:courseId", deleteCourse);

// --------------------------------------------------
// LESSONS
// --------------------------------------------------

router.post("/:courseId/lessons", addLesson);

router.patch("/:courseId/lessons/:lessonId", updateLesson);

router.post("/:courseId/lessons/:lessonId/complete", completeLesson);

// --------------------------------------------------
// RESOURCES
// --------------------------------------------------

router.post("/:courseId/lessons/:lessonId/resources", addResource);

router.delete(
  "/:courseId/lessons/:lessonId/resources/:resourceId",
  deleteResource,
);

export default router;
