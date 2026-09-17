import Course from "../models/Course.js";
import Roadmap from "../models/Roadmap.js";
import Progress from "../models/Progress.js";
import LearningLog from "../models/LearningLog.js";
import { generateCourse } from "../ai/agent/tools/courseTool.js";



// --------------------------------------------------
// AI GENERATE COURSE FROM ROADMAP TASK
// --------------------------------------------------

export const generateCourseFromRoadmap = async (req, res) => {
  try {
    const {
      roadmapId,
      weekNumber,
      taskId,
    } = req.body;

    if (!roadmapId || !weekNumber || !taskId) {
      return res.status(400).json({
        success: false,
        message:
          "roadmapId, weekNumber and taskId are required",
      });
    }

    const roadmap = await Roadmap.findOne({
      _id: roadmapId,
      user: req.user._id,
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

    const week = roadmap.weeks.find(
      (item) => item.week === Number(weekNumber)
    );

    if (!week) {
      return res.status(404).json({
        success: false,
        message: "Roadmap week not found",
      });
    }

    const task = week.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Roadmap task not found",
      });
    }

    // ------------------------------------------------
    // DO NOT GENERATE THE SAME COURSE TWICE
    // ------------------------------------------------

    const existingCourse = await Course.findOne({
      user: req.user._id,
      roadmap: roadmapId,
      weekNumber: Number(weekNumber),
      taskId,
    });

    if (existingCourse) {
      return res.status(200).json({
        success: true,
        message: "Course already exists",
        generated: false,
        course: existingCourse,
      });
    }

    // ------------------------------------------------
    // GET ASSESSED / RECOMMENDED SKILLS
    // ------------------------------------------------

    const skills = roadmap.skills
      .map((skill) => skill.name)
      .filter(Boolean);

    // ------------------------------------------------
    // GENERATE WITH AI + RAG
    // ------------------------------------------------

    const generatedCourse = await generateCourse({
      domain: roadmap.domain,
      subdomain: roadmap.subdomain,
      goal: roadmap.goal,
      level: roadmap.level,
      weekNumber: Number(weekNumber),
      taskTitle: task.title,
      taskType: task.type,
      skills,
    });

    // ------------------------------------------------
    // SAVE COURSE
    // ------------------------------------------------

    const course = await Course.create({
      user: req.user._id,
      roadmap: roadmap._id,
      weekNumber: Number(weekNumber),
      taskId,

      title: generatedCourse.title,

      description:
        generatedCourse.description || "",

      domain: roadmap.domain,
      subdomain: roadmap.subdomain,
      level: roadmap.level,

      skills,

      lessons: generatedCourse.lessons.map(
        (lesson, index) => ({
          title: lesson.title,

          slug:
            lesson.slug ||
            lesson.title
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, ""),

          order: lesson.order || index + 1,

          content: lesson.content,

          summary:
            lesson.summary || "",

          objectives:
            lesson.objectives || [],

          estimatedMinutes:
            lesson.estimatedMinutes || 20,

          resources:
            (lesson.resources || []).map(
              (resource) => ({
                title: resource.title,
                type: resource.type,
                url: resource.url || "",
                provider:
                  resource.provider || "",
                description:
                  resource.description || "",
                duration:
                  resource.duration ?? null,
              })
            ),
        })
      ),
    });

    return res.status(201).json({
      success: true,
      message:
        "Personalized course generated successfully",

      generated: true,

      course,
    });
  } catch (error) {
    console.error(
      "AI course generation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate course",
    });
  }
};

// --------------------------------------------------
// CREATE COURSE
// --------------------------------------------------

export const createCourse = async (req, res) => {
  try {
    const {
      roadmapId,
      weekNumber,
      taskId,
      title,
      description,
      domain,
      subdomain,
      level,
      skills,
      lessons,
    } = req.body;

    if (
      !roadmapId ||
      !weekNumber ||
      !title ||
      !domain ||
      !subdomain
    ) {
      return res.status(400).json({
        success: false,
        message:
          "roadmapId, weekNumber, title, domain and subdomain are required",
      });
    }

    const roadmap = await Roadmap.findOne({
      _id: roadmapId,
      user: req.user._id,
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

    const existingCourse = await Course.findOne({
      user: req.user._id,
      roadmap: roadmapId,
      weekNumber,
      taskId: taskId || null,
    });

    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: "A course already exists for this roadmap task",
        course: existingCourse,
      });
    }

    const course = await Course.create({
      user: req.user._id,
      roadmap: roadmapId,
      weekNumber,
      taskId: taskId || null,
      title,
      description: description || "",
      domain,
      subdomain,
      level: level || "beginner",
      skills: skills || [],
      lessons: lessons || [],
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// --------------------------------------------------
// CREATE COURSE FROM ROADMAP TASK
// --------------------------------------------------

export const createCourseFromRoadmap = async (req, res) => {
  try {
    const { roadmapId, weekNumber, taskId } = req.body;

    if (!roadmapId || !weekNumber || !taskId) {
      return res.status(400).json({
        success: false,
        message: "roadmapId, weekNumber and taskId are required",
      });
    }

    const roadmap = await Roadmap.findOne({
      _id: roadmapId,
      user: req.user._id,
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

    const week = roadmap.weeks.find(
      (item) => item.week === Number(weekNumber)
    );

    if (!week) {
      return res.status(404).json({
        success: false,
        message: "Roadmap week not found",
      });
    }

    const task = week.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Roadmap task not found",
      });
    }

    const existingCourse = await Course.findOne({
      user: req.user._id,
      roadmap: roadmapId,
      weekNumber,
      taskId,
    });

    if (existingCourse) {
      return res.status(200).json({
        success: true,
        message: "Course already exists",
        course: existingCourse,
      });
    }

    const course = await Course.create({
      user: req.user._id,
      roadmap: roadmapId,
      weekNumber,
      taskId,
      title: task.title,
      description: `Learn ${task.title} as part of your personalized roadmap.`,
      domain: roadmap.domain,
      subdomain: roadmap.subdomain,
      level: roadmap.level,
      skills: roadmap.skills.map((skill) => skill.name),
      lessons: [],
    });

    return res.status(201).json({
      success: true,
      message: "Course created from roadmap task",
      course,
    });
  } catch (error) {
    console.error("Create course from roadmap error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// --------------------------------------------------
// GET MY COURSES
// --------------------------------------------------

export const getMyCourses = async (req, res) => {
  try {
    const { roadmapId, weekNumber, status } = req.query;

    const filter = {
      user: req.user._id,
    };

    if (roadmapId) filter.roadmap = roadmapId;
    if (weekNumber) filter.weekNumber = Number(weekNumber);
    if (status) filter.status = status;

    const courses = await Course.find(filter)
      .sort({ weekNumber: 1, createdAt: 1 })
      .lean();

    return res.json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get courses error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// --------------------------------------------------
// GET COURSE BY ID
// --------------------------------------------------

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({
      _id: courseId,
      user: req.user._id,
    }).populate("roadmap", "domain subdomain goal level");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Get course error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// --------------------------------------------------
// UPDATE COURSE
// --------------------------------------------------

export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const allowedFields = [
      "title",
      "description",
      "level",
      "skills",
      "status",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const course = await Course.findOneAndUpdate(
      {
        _id: courseId,
        user: req.user._id,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Update course error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// --------------------------------------------------
// DELETE COURSE
// --------------------------------------------------

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOneAndDelete({
      _id: courseId,
      user: req.user._id,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// --------------------------------------------------
// ADD LESSON
// --------------------------------------------------

export const addLesson = async (req, res) => {
  try {
    const { courseId } = req.params;

    const {
      title,
      slug,
      content,
      summary,
      objectives,
      resources,
      estimatedMinutes,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Lesson title and content are required",
      });
    }

    const course = await Course.findOne({
      _id: courseId,
      user: req.user._id,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const order = course.lessons.length + 1;

    course.lessons.push({
      title,
      slug:
        slug ||
        title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      order,
      content,
      summary: summary || "",
      objectives: objectives || [],
      resources: resources || [],
      estimatedMinutes: estimatedMinutes || 15,
    });

    await course.save();

    return res.status(201).json({
      success: true,
      message: "Lesson added successfully",
      lesson: course.lessons[course.lessons.length - 1],
      course,
    });
  } catch (error) {
    console.error("Add lesson error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// --------------------------------------------------
// UPDATE LESSON
// --------------------------------------------------

export const updateLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const course = await Course.findOne({
      _id: courseId,
      user: req.user._id,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lesson = course.lessons.id(lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const allowedFields = [
      "title",
      "slug",
      "content",
      "summary",
      "objectives",
      "estimatedMinutes",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        lesson[field] = req.body[field];
      }
    });

    await course.save();

    return res.json({
      success: true,
      message: "Lesson updated successfully",
      lesson,
    });
  } catch (error) {
    console.error("Update lesson error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// --------------------------------------------------
// COMPLETE LESSON
// --------------------------------------------------

export const completeLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const course = await Course.findOne({
      _id: courseId,
      user: req.user._id,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lesson = course.lessons.id(lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    if (lesson.completed) {
      return res.status(400).json({
        success: false,
        message: "Lesson already completed",
      });
    }

    lesson.completed = true;
    lesson.completedAt = new Date();

    const totalLessons = course.lessons.length;

    const completedLessons = course.lessons.filter(
      (item) => item.completed
    ).length;

    course.progressPercentage = totalLessons
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

    course.lastActivityAt = new Date();

    if (!course.startedAt) {
      course.startedAt = new Date();
    }

    if (course.status === "not_started") {
      course.status = "in_progress";
    }

    if (course.progressPercentage === 100) {
      course.status = "completed";
      course.completedAt = new Date();
    }

    await course.save();

    // Update global roadmap progress activity
    const progress = await Progress.findOne({
      user: req.user._id,
      roadmap: course.roadmap,
    });

    if (progress) {
      progress.lastActivityAt = new Date();

      if (progress.status === "not_started") {
        progress.status = "in_progress";
      }

      await progress.save();
    }

    // Create learning log
    const learningLog = await LearningLog.create({
      user: req.user._id,
      roadmap: course.roadmap,
      weekNumber: course.weekNumber,
      title: lesson.title,
      learned:
        lesson.summary ||
        `Completed the lesson "${lesson.title}".`,
      notes: `Course progress: ${course.progressPercentage}%`,
      minutesSpent: lesson.estimatedMinutes || 15,
      points: 5,
    });

    return res.json({
      success: true,
      message: "Lesson completed successfully",

      lesson: {
        id: lesson._id,
        title: lesson.title,
        completed: lesson.completed,
        completedAt: lesson.completedAt,
      },

      courseProgress: {
        completedLessons,
        totalLessons,
        percentage: course.progressPercentage,
        status: course.status,
      },

      learningLog: {
        id: learningLog._id,
        points: learningLog.points,
      },
    });
  } catch (error) {
    console.error("Complete lesson error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// --------------------------------------------------
// ADD RESOURCE
// --------------------------------------------------

export const addResource = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const {
      title,
      type,
      url,
      provider,
      description,
      duration,
    } = req.body;

    if (!title || !type || !url) {
      return res.status(400).json({
        success: false,
        message: "title, type and url are required",
      });
    }

    const course = await Course.findOne({
      _id: courseId,
      user: req.user._id,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lesson = course.lessons.id(lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    lesson.resources.push({
      title,
      type,
      url,
      provider: provider || "",
      description: description || "",
      duration: duration || null,
    });

    await course.save();

    return res.status(201).json({
      success: true,
      message: "Resource added successfully",
      resource: lesson.resources[lesson.resources.length - 1],
    });
  } catch (error) {
    console.error("Add resource error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// --------------------------------------------------
// DELETE RESOURCE
// --------------------------------------------------

export const deleteResource = async (req, res) => {
  try {
    const { courseId, lessonId, resourceId } = req.params;

    const course = await Course.findOne({
      _id: courseId,
      user: req.user._id,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lesson = course.lessons.id(lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const resource = lesson.resources.id(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    resource.deleteOne();

    await course.save();

    return res.json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error("Delete resource error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// --------------------------------------------------
// COURSE PROGRESS
// --------------------------------------------------

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({
      _id: courseId,
      user: req.user._id,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const totalLessons = course.lessons.length;

    const completedLessons = course.lessons.filter(
      (lesson) => lesson.completed
    ).length;

    const nextLesson = course.lessons.find(
      (lesson) => !lesson.completed
    );

    return res.json({
      success: true,

      progress: {
        courseId: course._id,
        title: course.title,
        status: course.status,
        percentage: course.progressPercentage,
        completedLessons,
        totalLessons,
        nextLesson: nextLesson
          ? {
              id: nextLesson._id,
              title: nextLesson.title,
              order: nextLesson.order,
            }
          : null,
        startedAt: course.startedAt,
        completedAt: course.completedAt,
        lastActivityAt: course.lastActivityAt,
      },
    });
  } catch (error) {
    console.error("Get course progress error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};