import Progress from "../models/Progress.js";
import Roadmap from "../models/Roadmap.js";

const calculateTotalTasks = (roadmap) => {
  if (!roadmap?.weeks) return 0;

  return roadmap.weeks.reduce((total, week) => {
    return total + (week.tasks?.length || 0);
  }, 0);
};

const calculateCompletedTasks = (roadmap) => {
  if (!roadmap?.weeks) return 0;

  return roadmap.weeks.reduce((total, week) => {
    return (
      total +
      (week.tasks?.filter((task) => task.completed).length || 0)
    );
  }, 0);
};

export const createProgress = async (req, res) => {
  try {
    const { roadmapId } = req.body;

    if (!roadmapId) {
      return res.status(400).json({
        success: false,
        message: "roadmapId is required",
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

    const existingProgress = await Progress.findOne({
      user: req.user._id,
      roadmap: roadmap._id,
    });

    if (existingProgress) {
      return res.status(200).json({
        success: true,
        progress: existingProgress,
      });
    }

    const totalTasks = calculateTotalTasks(roadmap);

    const progress = await Progress.create({
      user: req.user._id,
      roadmap: roadmap._id,
      totalTasks,
    });

    return res.status(201).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error("Create progress error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyProgress = async (req, res) => {
  try {
    const progress = await Progress.find({
      user: req.user._id,
    })
      .populate("roadmap")
      .sort({ updatedAt: -1 });

    return res.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error("Get progress error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProgressByRoadmap = async (req, res) => {
  try {
    const { roadmapId } = req.params;

    const progress = await Progress.findOne({
      user: req.user._id,
      roadmap: roadmapId,
    }).populate("roadmap");

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found",
      });
    }

    return res.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error("Get roadmap progress error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const completeTask = async (req, res) => {
  try {
    const {
      roadmapId,
      weekNumber,
      taskIndex,
    } = req.body;

    if (
      !roadmapId ||
      weekNumber === undefined ||
      taskIndex === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "roadmapId, weekNumber and taskIndex are required",
      });
    }

    // Find roadmap belonging to the logged-in user
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

    // Find week
    const week = roadmap.weeks.find(
      (item) => item.week === Number(weekNumber)
    );

    if (!week) {
      return res.status(404).json({
        success: false,
        message: "Week not found",
      });
    }

    // Find task
    const task = week.tasks[Number(taskIndex)];

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Prevent completing the same task twice
    if (task.completed) {
      return res.status(400).json({
        success: false,
        message: "Task is already completed",
      });
    }

    // Mark task as completed
    task.completed = true;

    await roadmap.save();

    // Find existing progress
    let progress = await Progress.findOne({
      user: req.user._id,
      roadmap: roadmap._id,
    });

    // Create progress if it doesn't exist
    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        roadmap: roadmap._id,
        totalTasks: calculateTotalTasks(roadmap),
      });
    }

    // Calculate all task statistics
    const completedTasks =
      calculateCompletedTasks(roadmap);

    const totalTasks =
      calculateTotalTasks(roadmap);

    const completedLessons =
      roadmap.weeks.reduce(
        (total, week) =>
          total +
          (week.tasks?.filter(
            (task) =>
              task.completed &&
              task.type === "lesson"
          ).length || 0),
        0
      );

    const completedProjects =
      roadmap.weeks.reduce(
        (total, week) =>
          total +
          (week.tasks?.filter(
            (task) =>
              task.completed &&
              task.type === "project"
          ).length || 0),
        0
      );

    const completedQuizzes =
      roadmap.weeks.reduce(
        (total, week) =>
          total +
          (week.tasks?.filter(
            (task) =>
              task.completed &&
              task.type === "quiz"
          ).length || 0),
        0
      );

    // Calculate percentage
    const percentage = totalTasks
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0;

    // Update progress
    progress.completedTasks = completedTasks;
    progress.totalTasks = totalTasks;

    progress.completedLessons =
      completedLessons;

    progress.completedProjects =
      completedProjects;

    progress.completedQuizzes =
      completedQuizzes;

    progress.percentage = percentage;

    progress.lastActivityAt = new Date();

    // First completed task = learning started
    if (!progress.startedAt) {
      progress.startedAt = new Date();
    }

    // Update status
    if (percentage >= 100) {
      progress.status = "completed";

      if (!progress.completedAt) {
        progress.completedAt = new Date();
      }
    } else {
      progress.status = "in_progress";
    }

    // Update current week
    progress.currentWeek = Number(weekNumber);

    // Find next incomplete task
    let nextTask = null;
    let nextWeek = null;

    for (const roadmapWeek of roadmap.weeks) {
      const incompleteTask =
        roadmapWeek.tasks?.find(
          (item) => !item.completed
        );

      if (incompleteTask) {
        nextTask = incompleteTask;
        nextWeek = roadmapWeek.week;
        break;
      }
    }

    if (nextTask) {
      progress.currentTask = nextTask.title;
      progress.currentWeek = nextWeek;
    } else {
      progress.currentTask = null;
    }

    // Save progress
    await progress.save();

    return res.json({
      success: true,
      message: "Task completed successfully",
      roadmap,
      progress,
    });
  } catch (error) {
    console.error("Complete task error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};