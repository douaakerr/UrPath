import Assessment from "../models/Assessment.js";
import { generateAssessment } from "../ai/agent/tools/assessmentTool.js";
import { generateRoadmap } from "../ai/agent/tools/roadmapTool.js";
import { scoreAssessment } from "../services/assessmentScoringService.js";
import Roadmap from "../models/Roadmap.js";

export const createAssessment = async (req, res) => {
  try {
    const {
      domain,
      subdomain,
      goal,
      learnerLevel = "unknown",
    } = req.body;

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

    const assessment = await Assessment.findById(assessmentId);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
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

export const generateRoadmapFromAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const assessment = await Assessment.findById(assessmentId);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    if (assessment.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Assessment must be completed first",
      });
    }

    const roadmap = await generateRoadmap({
      domain: assessment.domain,
      subdomain: assessment.subdomain,
      goal: assessment.goal,
      level: assessment.result.level,
      skillScores: assessment.result.skillScores,
    });

    const savedRoadmap = await Roadmap.create({
      domain: assessment.domain,
      subdomain: assessment.subdomain,
      goal: assessment.goal,
      level: assessment.result.level,
      skills: roadmap.skills,
      weeks: roadmap.weeks,
      status: "generated",
    });

    return res.status(201).json({
      success: true,
      roadmap: savedRoadmap,
    });
  } catch (error) {
    console.error("Roadmap generation error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};