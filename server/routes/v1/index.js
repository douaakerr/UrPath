import { Router } from "express";

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and account access
 *   - name: Profile
 *     description: User profile management
 *   - name: Learning Domains
 *     description: Available learning domains
 *   - name: Assessments
 *     description: Skill assessments
 *   - name: Roadmaps
 *     description: Personalized learning roadmaps
 *   - name: Progress
 *     description: Learning progress
 *   - name: Learning Logs
 *     description: Daily learning activity
 *   - name: Quizzes
 *     description: Learning quizzes
 *   - name: Courses
 *     description: Learning courses and lessons
 *   - name: Notifications
 *     description: User notifications
 *   - name: AI
 *     description: AI learning features
 *
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: Douaa }
 *               email: { type: string, format: email, example: user@example.com }
 *               password: { type: string, format: password, example: password123 }
 *     responses:
 *       201: { description: Registration successful }
 *       400: { description: Validation error }
 *       409: { description: Email already exists }
 *
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 *
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout
 *     responses:
 *       200: { description: Logout successful }
 *
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200: { description: Current user returned }
 *       401: { description: Unauthorized }
 *
 * @swagger
 * /auth/change-password:
 *   put:
 *     tags: [Auth]
 *     summary: Change password
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword: { type: string, format: password }
 *               newPassword: { type: string, format: password }
 *     responses:
 *       200: { description: Password changed successfully }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized or incorrect password }
 *
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request a password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200: { description: Password reset request processed }
 *
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password: { type: string, format: password }
 *     responses:
 *       200: { description: Password reset successful }
 *       400: { description: Invalid or expired token }
 *
 * @swagger
 * /auth/google:
 *   get:
 *     tags: [Auth]
 *     summary: Start Google OAuth login
 *     responses:
 *       302: { description: Redirect to Google authentication }
 *
 * @swagger
 * /learning-domains:
 *   get:
 *     tags: [Learning Domains]
 *     summary: Get available learning domains
 *     responses:
 *       200: { description: Learning domains returned }
 *
 * @swagger
 * /assessments:
 *   post:
 *     tags: [Assessments]
 *     summary: Create an assessment
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       201: { description: Assessment created }
 *       401: { description: Unauthorized }
 *
 * @swagger
 * /assessments/{id}/submit:
 *   post:
 *     tags: [Assessments]
 *     summary: Submit an assessment
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200: { description: Assessment submitted and scored }
 *       400: { description: Invalid submission }
 *
 * @swagger
 * /roadmaps:
 *   get:
 *     tags: [Roadmaps]
 *     summary: Get my roadmaps
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200: { description: Roadmaps returned }
 *
 * @swagger
 * /roadmaps/from-assessment/{assessmentId}:
 *   post:
 *     tags: [Roadmaps]
 *     summary: Generate a roadmap from an assessment
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: assessmentId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201: { description: Roadmap generated }
 *
 * @swagger
 * /roadmaps/{roadmapId}:
 *   get:
 *     tags: [Roadmaps]
 *     summary: Get a roadmap by ID
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: roadmapId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Roadmap returned }
 *
 * @swagger
 * /progress:
 *   post:
 *     tags: [Progress]
 *     summary: Create progress
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object, additionalProperties: true }
 *     responses:
 *       201: { description: Progress created }
 *   get:
 *     tags: [Progress]
 *     summary: Get my progress
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200: { description: Progress returned }
 *
 * @swagger
 * /progress/{roadmapId}:
 *   get:
 *     tags: [Progress]
 *     summary: Get progress for a roadmap
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: roadmapId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Roadmap progress returned }
 *
 * @swagger
 * /progress/complete-task:
 *   patch:
 *     tags: [Progress]
 *     summary: Complete a roadmap task
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object, additionalProperties: true }
 *     responses:
 *       200: { description: Task completed }
 *
 * @swagger
 * /learning-logs:
 *   post:
 *     tags: [Learning Logs]
 *     summary: Create a learning log
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object, additionalProperties: true }
 *     responses:
 *       201: { description: Learning log created }
 *   get:
 *     tags: [Learning Logs]
 *     summary: Get my learning logs
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200: { description: Learning logs returned }
 *
 * @swagger
 * /learning-logs/today:
 *   get:
 *     tags: [Learning Logs]
 *     summary: Get today's learning logs
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200: { description: Today's logs returned }
 *
 * @swagger
 * /quizzes:
 *   get:
 *     tags: [Quizzes]
 *     summary: Get my quizzes
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200: { description: Quizzes returned }
 *
 * @swagger
 * /quizzes/generate:
 *   post:
 *     tags: [Quizzes]
 *     summary: Generate a quiz from a roadmap
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object, additionalProperties: true }
 *     responses:
 *       201: { description: Quiz generated }
 *
 * @swagger
 * /quizzes/{quizId}:
 *   get:
 *     tags: [Quizzes]
 *     summary: Get a quiz by ID
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Quiz returned }
 *
 * @swagger
 * /quizzes/{quizId}/submit:
 *   post:
 *     tags: [Quizzes]
 *     summary: Submit a quiz
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object, additionalProperties: true }
 *     responses:
 *       200: { description: Quiz submitted }
 *
 * @swagger
 * /courses:
 *   get:
 *     tags: [Courses]
 *     summary: Get my courses
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200: { description: Courses returned }
 *   post:
 *     tags: [Courses]
 *     summary: Create a course
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object, additionalProperties: true }
 *     responses:
 *       201: { description: Course created }
 *
 * @swagger
 * /courses/generate:
 *   post:
 *     tags: [Courses]
 *     summary: Generate a course from a roadmap
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object, additionalProperties: true }
 *     responses:
 *       201: { description: Course generated }
 *
 * @swagger
 * /courses/{courseId}:
 *   get:
 *     tags: [Courses]
 *     summary: Get a course
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Course returned }
 *   patch:
 *     tags: [Courses]
 *     summary: Update a course
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object, additionalProperties: true }
 *     responses:
 *       200: { description: Course updated }
 *   delete:
 *     tags: [Courses]
 *     summary: Delete a course
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Course deleted }
 *
 * @swagger
 * /courses/{courseId}/progress:
 *   get:
 *     tags: [Courses]
 *     summary: Get course progress
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Course progress returned }
 *
 * @swagger
 * /courses/{courseId}/lessons:
 *   post:
 *     tags: [Courses]
 *     summary: Add a lesson
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object, additionalProperties: true }
 *     responses:
 *       201: { description: Lesson added }
 *
 * @swagger
 * /courses/{courseId}/lessons/{lessonId}:
 *   patch:
 *     tags: [Courses]
 *     summary: Update a lesson
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object, additionalProperties: true }
 *     responses:
 *       200: { description: Lesson updated }
 *
 * @swagger
 * /courses/{courseId}/lessons/{lessonId}/complete:
 *   post:
 *     tags: [Courses]
 *     summary: Complete a lesson
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lesson completed }
 *
 * @swagger
 * /courses/{courseId}/lessons/{lessonId}/resources:
 *   post:
 *     tags: [Courses]
 *     summary: Add a lesson resource
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object, additionalProperties: true }
 *     responses:
 *       201: { description: Resource added }
 *
 * @swagger
 * /courses/{courseId}/lessons/{lessonId}/resources/{resourceId}:
 *   delete:
 *     tags: [Courses]
 *     summary: Delete a lesson resource
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Resource deleted }
 *
 * @swagger
 * /notification:
 *   get:
 *     tags: [Notifications]
 *     summary: Get notifications
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200: { description: Notifications returned }
 *
 * @swagger
 * /notification/read-all:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark all notifications as read
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200: { description: Notifications marked as read }
 *
 * @swagger
 * /notification/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark a notification as read
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Notification marked as read }
 *
 * @swagger
 * /notification/{id}:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete a notification
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Notification deleted }
 *
 * @swagger
 * /profile:
 *   get:
 *     tags: [Profile]
 *     summary: Get my profile
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200: { description: Profile returned }
 *   patch:
 *     tags: [Profile]
 *     summary: Update my profile
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: Douaa }
 *     responses:
 *       200: { description: Profile updated }
 *
 * @swagger
 * /profile/photo:
 *   post:
 *     tags: [Profile]
 *     summary: Upload profile photo
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [photo]
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200: { description: Profile photo updated }
 *   delete:
 *     tags: [Profile]
 *     summary: Remove profile photo
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200: { description: Profile photo removed }
 *
 * @swagger
 * /ai/learning-chat:
 *   post:
 *     tags: [AI]
 *     summary: Chat with the learning assistant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object, additionalProperties: true }
 *     responses:
 *       200: { description: AI response returned }
 */

import ai from "./aiRoutes.js";
import assessmentRoutes from "./assessmentRoutes.js";
import auth from "./authRoutes.js";
import courseRoutes from "./courseRoutes.js";
import learningDomainRoutes from "./learningDomainRoutes.js";
import learningLogRoutes from "./learningLogRoutes.js";
import progressRoutes from "./progressRoutes.js";
import quizRoutes from "./quizRoutes.js";
import roadmap from "./roadmapRoutes.js";
import notification from "./notificationRoutes.js";
import profile from "./profileRoutes.js";   
import spotify from "./spotufyRoutes.js";
import { spotifyCallback } from "../../controllers/spotifyController.js";

const router = Router();

router.use("/auth", auth);
router.use("/ai", ai);
router.use("/learning-domains", learningDomainRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/roadmaps", roadmap);
router.use("/progress", progressRoutes);
router.use("/learning-logs", learningLogRoutes);
router.use("/quizzes", quizRoutes);
router.use("/courses", courseRoutes);
router.use("/notification",notification);
router.use("/profile",profile);
router.use("/spotify", spotify);

export default router;
