import LearningLog from "../models/LearningLog.js";
import Roadmap from "../models/Roadmap.js";

export const createLearningLog = async (req, res) => {
  try {
    const {
      roadmapId,
      weekNumber,
      taskId,
      title,
      learned,
      notes,
      minutesSpent,
      points,
    } = req.body;

    // Validate required fields
    if (
      !roadmapId ||
      weekNumber === undefined ||
      !title ||
      !learned ||
      !minutesSpent
    ) {
      return res.status(400).json({
        success: false,
        message:
          "roadmapId, weekNumber, title, learned and minutesSpent are required",
      });
    }

    // Make sure the roadmap belongs to the logged-in user
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

    // Check that the week exists
    const week = roadmap.weeks.find(
      (item) => item.week === Number(weekNumber)
    );

    if (!week) {
      return res.status(404).json({
        success: false,
        message: "Week not found",
      });
    }

    // If taskId was provided, verify that task exists
    let task = null;

    if (taskId) {
      for (const roadmapWeek of roadmap.weeks) {
        const foundTask = roadmapWeek.tasks?.find(
          (item) => item._id.toString() === taskId.toString()
        );

        if (foundTask) {
          task = foundTask;
          break;
        }
      }

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }
    }

    // Create learning log
    const learningLog = await LearningLog.create({
      user: req.user._id,
      roadmap: roadmap._id,
      weekNumber: Number(weekNumber),
      taskId: task ? task._id : undefined,
      title: title.trim(),
      learned: learned.trim(),
      notes: notes?.trim() || "",
      minutesSpent: Number(minutesSpent),
      points: points !== undefined ? Number(points) : 0,
    });

    return res.status(201).json({
      success: true,
      message: "Learning log created successfully",
      learningLog,
    });
  } catch (error) {
    console.error("Create learning log error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getMyLearningLogs = async (req, res) => {
  try {
    const learningLogs = await LearningLog.find({
      user: req.user._id,
    })
      .populate("roadmap", "domain subdomain goal")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: learningLogs.length,
      learningLogs,
    });
  } catch (error) {
    console.error("Get learning logs error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTodayLearningLogs = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const learningLogs = await LearningLog.find({
      user: req.user._id,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate("roadmap", "domain subdomain goal")
      .sort({ createdAt: -1 });

    const totalMinutes = learningLogs.reduce(
      (total, log) => total + log.minutesSpent,
      0
    );

    const totalPoints = learningLogs.reduce(
      (total, log) => total + log.points,
      0
    );

    return res.json({
      success: true,
      count: learningLogs.length,
      totalMinutes,
      totalPoints,
      learningLogs,
    });
  } catch (error) {
    console.error("Get today's learning logs error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
