import LearningDomain from "../models/LearningDomain.js";

export const getLearningDomains = async (req, res) => {
  try {
    const domains = await LearningDomain.find({
      isActive: true,
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: domains.length,
      domains,
    });
  } catch (error) {
    console.error("Get learning domains error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get learning domains",
    });
  }
};