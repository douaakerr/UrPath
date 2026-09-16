import Quiz from "../models/Quiz.js";
import Roadmap from "../models/Roadmap.js";
import LearningLog from "../models/LearningLog.js";
import Progress from "../models/Progress.js";
import { generateQuiz } from "../ai/agent/tools/quizTool.js";


export const generateQuizFromRoadmap = async (req, res) => {
  try {
    const { roadmapId, weekNumber, taskIndex } = req.body;

  
    if (!roadmapId || !weekNumber || taskIndex === undefined) {
      return res.status(400).json({
        success: false,
        message: "roadmapId, weekNumber and taskIndex are required",
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

    // -------------------------------------------------------
    // 3. Find requested week
    // -------------------------------------------------------

    const week = roadmap.weeks.find(
      (item) => item.week === Number(weekNumber)
    );

    if (!week) {
      return res.status(404).json({
        success: false,
        message: "Week not found",
      });
    }

    // -------------------------------------------------------
    // 4. Find requested task
    // -------------------------------------------------------

    const task = week.tasks[Number(taskIndex)];

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // -------------------------------------------------------
    // 5. Make sure this is actually a quiz task
    // -------------------------------------------------------

    if (task.type !== "quiz") {
      return res.status(400).json({
        success: false,
        message: "Selected task is not a quiz task",
      });
    }

    // -------------------------------------------------------
    // 6. Check if a quiz already exists
    // -------------------------------------------------------

    const existingQuiz = await Quiz.findOne({
      user: req.user._id,
      roadmap: roadmap._id,
      weekNumber: Number(weekNumber),
      title: task.title,
    });

    if (existingQuiz) {
      return res.status(200).json({
        success: true,
        message: "Quiz already exists",
        quiz: existingQuiz,
      });
    }

    // -------------------------------------------------------
    // 7. Generate quiz using AI + RAG
    // -------------------------------------------------------

    const generatedQuiz = await generateQuiz({
      domain: roadmap.domain,
      subdomain: roadmap.subdomain,
      goal: roadmap.goal,
      weekNumber: Number(weekNumber),
      taskTitle: task.title,
      level: roadmap.level,
    });

    // -------------------------------------------------------
    // 8. Validate generated quiz
    // -------------------------------------------------------

    if (
      !generatedQuiz ||
      !Array.isArray(generatedQuiz.questions)
    ) {
      return res.status(500).json({
        success: false,
        message: "AI generated an invalid quiz",
      });
    }

    // -------------------------------------------------------
    // 9. Save quiz in MongoDB
    // -------------------------------------------------------

    const quiz = await Quiz.create({
      user: req.user._id,

      roadmap: roadmap._id,

      weekNumber: Number(weekNumber),

      title: generatedQuiz.title || task.title,

      description:
        generatedQuiz.description ||
        `Quiz for ${task.title}`,

      questions: generatedQuiz.questions,

      status: "not_started",
    });

    // -------------------------------------------------------
    // 10. Return quiz
    // -------------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Quiz generated successfully with AI",
      quiz,
    });
  } catch (error) {
    console.error("AI quiz generation error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================================
// GET QUIZ BY ID
// =========================================================

export const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findOne({
      _id: quizId,
      user: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Never expose answers while the quiz is not completed
    const safeQuestions = quiz.questions.map((question) => ({
      _id: question._id,
      question: question.question,
      options: question.options,
    }));

    return res.json({
      success: true,
      quiz: {
        _id: quiz._id,
        roadmap: quiz.roadmap,
        weekNumber: quiz.weekNumber,
        title: quiz.title,
        description: quiz.description,
        questions: safeQuestions,
        status: quiz.status,

        // Only expose result after completion
        ...(quiz.status === "completed" && {
          result: quiz.result,
          answers: Object.fromEntries(quiz.answers || []),
          completedAt: quiz.completedAt,
        }),
      },
    });
  } catch (error) {
    console.error("Get quiz error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================================
// GET MY QUIZZES
// =========================================================

export const getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      quizzes,
    });
  } catch (error) {
    console.error("Get quizzes error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body || {};

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        message: "Answers are required",
      });
    }

    const quiz = await Quiz.findOne({
      _id: quizId,
      user: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Quiz has already been completed",
      });
    }

    let correct = 0;

    quiz.questions.forEach((question) => {
      const questionId = question._id.toString();
      const userAnswer = answers[questionId];

      if (userAnswer === question.correctAnswer) {
        correct++;
      }
    });

    const total = quiz.questions.length;

    const percentage = total
      ? Math.round((correct / total) * 100)
      : 0;

    const passed = percentage >= 70;

    quiz.answers = answers;

    quiz.result = {
      correct,
      total,
      percentage,
      passed,
    };

    quiz.status = "completed";
    quiz.completedAt = new Date();

    await quiz.save();

    // --------------------------------------------------
    // UPDATE PROGRESS
    // --------------------------------------------------

    const progress = await Progress.findOne({
      user: req.user._id,
      roadmap: quiz.roadmap,
    });

    if (progress) {
      progress.completedQuizzes += 1;
      progress.lastActivityAt = new Date();

      if (progress.status === "not_started") {
        progress.status = "in_progress";
      }

      await progress.save();
    }

    // --------------------------------------------------
    // CREATE LEARNING LOG
    // --------------------------------------------------

    const points = passed ? 10 : 5;

    const learningLog = await LearningLog.create({
      user: req.user._id,
      roadmap: quiz.roadmap,
      weekNumber: quiz.weekNumber,
      title: quiz.title,
      learned:
        `Completed the ${quiz.title}. ` +
        `Answered ${correct} out of ${total} questions correctly.`,
      notes:
        `Quiz score: ${percentage}%. ` +
        `${passed ? "Passed." : "Not passed yet."}`,
      minutesSpent: 10,
      points,
    });

    // --------------------------------------------------
    // BUILD QUIZ REVIEW
    // --------------------------------------------------

    const review = quiz.questions.map((question) => {
      const questionId = question._id.toString();

      const userAnswer = answers[questionId] || null;

      return {
        questionId: question._id,
        question: question.question,
        options: question.options,

        userAnswer,

        correctAnswer: question.correctAnswer,

        explanation: question.explanation,

        isCorrect: userAnswer === question.correctAnswer,
      };
    });

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",

      result: {
        correct,
        total,
        percentage,
        passed,
      },

      review,

      progress: progress
        ? {
            completedQuizzes: progress.completedQuizzes,
            percentage: progress.percentage,
            status: progress.status,
          }
        : null,

      learningLog: {
        id: learningLog._id,
        title: learningLog.title,
        points: learningLog.points,
      },
    });
  } catch (error) {
    console.error("Submit quiz error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};