import { generateAssessment } from "../ai/agent/tools/assessmentTool.js";
import Assessment from "../models/Assessment.js";

import { scoreAssessment } from "../services/assessmentScoringService.js";

export const createAssessment = async (req, res) => {
  try {
    const { domain, subdomain, goal, learnerLevel = "unknown" } = req.body;

    if (!domain || !subdomain || !goal) {
      return res.status(400).json({
        success: false,
        message: "domain, subdomain and goal are required",
      });
    }

    const assessment = await generateAssessment({
      domain,
      subdomain,
      goal,
      learnerLevel,
    });

    const savedAssessment = await Assessment.create({
      user: req.user._id,
      domain,
      subdomain,
      goal,
      questions: assessment.questions,
      status: "generated",
    });

    return res.status(201).json({
      success: true,
      assessment: savedAssessment,
    });
  } catch (error) {
    console.error("Assessment generation error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const submitAssessment = async (req, res) => {
  try {
    const { assessmentId, answers } = req.body;

    if (!assessmentId || !answers) {
      return res.status(400).json({
        success: false,
        message: "assessmentId and answers are required",
      });
    }

    const assessment = await Assessment.findOne({
      _id: assessmentId,
      user: req.user._id,
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    if (assessment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Assessment has already been completed",
      });
    }

    const result = scoreAssessment(assessment, answers);

    assessment.answers = answers;
    assessment.result = result;
    assessment.status = "completed";

    await assessment.save();

    return res.json({
      success: true,
      assessment,
      result,
    });
  } catch (error) {
    console.error("Assessment scoring error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
