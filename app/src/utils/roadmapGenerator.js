/* =========================================================
   ROADMAP GENERATOR — Frontend milestone builder
   
   Takes the user's setup choices (domain, subdomain, level,
   assessment score, availability) and generates a realistic
   learning roadmap with milestones.
   ========================================================= */

/**
 * Generate a complete roadmap object from setup data.
 *
 * @param {Object} setupData 
 * @param {string} setupData.domain
 * @param {string} setupData.subDomain
 * @param {string} setupData.goal
 * @param {Object} setupData.currentKnowledge { level, skills }
 * @param {Object} setupData.availability { hoursPerWeek, preferredDays }
 * @param {Object} setupData.preferences { learningStyle, contentTypes }
 * @param {Object} setupData.assessment { score, total, percentage, level }
 * @returns {Object} A roadmap object compatible with roadmapStore
 */
export function generateRoadmap(setupData) {
  const {
    domain,
    subDomain,
    goal,
    currentKnowledge,
    availability,
    assessment,
  } = setupData;

  // Determine the effective level (combine self-reported + assessment)
  let effectiveLevel = currentKnowledge?.level || "beginner";
  if (assessment && assessment.total > 0) {
    effectiveLevel = assessment.level;
  }

  // Adjust pace based on availability
  const hoursPerWeek = availability?.hoursPerWeek || 5;
  const pace = `${hoursPerWeek}h / week`;

  // Determine number of milestones based on goal and level
  let milestoneCount = 5; // default
  if (goal === "advanced" || goal === "career") milestoneCount = 6;
  if (goal === "personal") milestoneCount = 4;
  if (effectiveLevel === "advanced") milestoneCount = 3;

  // Base title
  let title = "My Custom Learning Path";
  let subtitle = "A personalized roadmap built for you.";

  // Generate generic milestones based on domain/subdomain
  const milestones = [];
  
  // M1: Foundations (skip or compress if advanced)
  if (effectiveLevel !== "advanced") {
    milestones.push({
      id: `m_${Date.now()}_1`,
      number: "01",
      title: "Foundations & Fundamentals",
      description: `Core concepts and essential knowledge for ${subDomain || domain}.`,
      status: "current",
      lessonsCount: 4 + Math.floor(Math.random() * 3),
      hours: Math.max(2, Math.floor(hoursPerWeek * 1.5)),
      projectsCount: 1,
      progress: 0,
    });
  }

  // M2: Core Skills
  milestones.push({
    id: `m_${Date.now()}_2`,
    number: effectiveLevel === "advanced" ? "01" : "02",
    title: "Core Mechanics & Theory",
    description: "Deep dive into the primary mechanics and standard practices.",
    status: effectiveLevel === "advanced" ? "current" : "upcoming",
    lessonsCount: 6 + Math.floor(Math.random() * 4),
    hours: Math.max(4, Math.floor(hoursPerWeek * 2)),
    projectsCount: 1,
    progress: 0,
  });

  // M3: Applied Practice
  milestones.push({
    id: `m_${Date.now()}_3`,
    number: effectiveLevel === "advanced" ? "02" : "03",
    title: "Applied Practice",
    description: "Hands-on application of concepts through practical exercises.",
    status: "upcoming",
    lessonsCount: 5 + Math.floor(Math.random() * 3),
    hours: Math.max(5, Math.floor(hoursPerWeek * 2.5)),
    projectsCount: 2,
    progress: 0,
  });

  // Additional milestones depending on count
  if (milestoneCount >= 4) {
    milestones.push({
      id: `m_${Date.now()}_4`,
      number: effectiveLevel === "advanced" ? "03" : "04",
      title: "Advanced Concepts",
      description: "Complex topics, optimization, and advanced patterns.",
      status: "locked",
      lessonsCount: 7 + Math.floor(Math.random() * 3),
      hours: Math.max(6, Math.floor(hoursPerWeek * 3)),
      projectsCount: 1,
      progress: 0,
    });
  }

  if (milestoneCount >= 5) {
    milestones.push({
      id: `m_${Date.now()}_5`,
      number: effectiveLevel === "advanced" ? "04" : "05",
      title: "Real-world Projects",
      description: "Building portfolio-ready projects from scratch.",
      status: "locked",
      lessonsCount: 4,
      hours: Math.max(10, Math.floor(hoursPerWeek * 4)),
      projectsCount: 3,
      progress: 0,
    });
  }

  if (milestoneCount >= 6) {
    milestones.push({
      id: `m_${Date.now()}_6`,
      number: effectiveLevel === "advanced" ? "05" : "06",
      title: "Mastery & Next Steps",
      description: "Final review, advanced challenges, and career preparation.",
      status: "locked",
      lessonsCount: 3,
      hours: Math.max(4, Math.floor(hoursPerWeek * 1.5)),
      projectsCount: 1,
      progress: 0,
    });
  }

  // Generate initial focus goals
  const focusGoals = [
    {
      id: `fg_${Date.now()}_1`,
      text: "Complete module 1 intro",
      done: false,
    },
    {
      id: `fg_${Date.now()}_2`,
      text: "Set up workspace/environment",
      done: false,
    },
  ];

  // Calculate estimated completion
  const totalHours = milestones.reduce((sum, m) => sum + m.hours, 0);
  const weeksToComplete = Math.ceil(totalHours / hoursPerWeek);
  
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + weeksToComplete * 7 * 24 * 60 * 60 * 1000);
  
  const formattedStart = startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const formattedEnd = endDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });

  // Generate a formatted title based on subdomain or domain
  if (subDomain && subDomain !== "other") {
     const formattedSubDomain = subDomain
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
     title = `${formattedSubDomain} Path`;
  } else if (domain) {
     const formattedDomain = domain
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
     title = `${formattedDomain} Mastery`;
  }

  return {
    title,
    subtitle,
    startDate: formattedStart,
    estCompletion: formattedEnd,
    pace,
    streak: 0,
    learningTimeHours: 0,
    milestones,
    focusGoals,
  };
}
