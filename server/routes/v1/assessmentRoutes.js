import { Router } from "express";
import { generateAssessment } from "../../ai/agent/tools/assessmentTool.js";

const router = Router();

router.post("/", async (req, res) => {
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

    res.json({
      success: true,
      assessment,
    });
  } catch (error) {
    console.error("Assessment generation error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
