import { create } from "zustand";
import { persist } from "zustand/middleware";

const defaultRoadmaps = {
  "rm-fullstack": {
    id: "rm-fullstack",
    title: "Full-Stack Web Development Path",
    subtitle: "A comprehensive journey from frontend basics to scalable production backend systems.",
    startDate: "Sep 01, 2026",
    estCompletion: "Dec 2026",
    pace: "10h / week",
    streak: 14,
    learningTimeHours: 32,
    milestones: [
      {
        id: "m_1",
        number: "01",
        title: "Frontend Foundations & Modern React",
        description: "Core DOM fundamentals, component architectures, hooks, and responsive design systems.",
        status: "completed",
        lessonsCount: 8,
        hours: 12,
        projectsCount: 2,
        progress: 100,
      },
      {
        id: "m_2",
        number: "02",
        title: "Backend APIs & Database Modeling",
        description: "RESTful API design with Express, MongoDB aggregation, auth cookies, and middleware.",
        status: "current",
        lessonsCount: 10,
        hours: 15,
        projectsCount: 2,
        progress: 45,
      },
      {
        id: "m_3",
        number: "03",
        title: "Authentication, State & Real-world Architecture",
        description: "Secure JWT handling, Zustand state management, and end-to-end integration.",
        status: "upcoming",
        lessonsCount: 6,
        hours: 10,
        projectsCount: 1,
        progress: 0,
      },
      {
        id: "m_4",
        number: "04",
        title: "Production Deployment & Performance",
        description: "CI/CD pipelines, Docker containerization, caching, and server security.",
        status: "locked",
        lessonsCount: 5,
        hours: 8,
        projectsCount: 1,
        progress: 0,
      },
    ],
    focusGoals: [
      { id: "fg_1", text: "Complete Backend Domain API integration", done: true },
      { id: "fg_2", text: "Implement Onboarding domain selector UI", done: false },
      { id: "fg_3", text: "Review MongoDB indexes and query optimization", done: false },
    ],
  },
};

export const useRoadmapStore = create(
  persist(
    (set, get) => ({
      activeRoadmapId: "rm-fullstack",
      roadmaps: defaultRoadmaps,

      setActiveRoadmap: (id) => set({ activeRoadmapId: id }),

      getActiveRoadmap: () => {
        const state = get();
        return state.roadmaps[state.activeRoadmapId] || Object.values(state.roadmaps)[0];
      },

      getStats: () => {
        const roadmap = get().getActiveRoadmap();
        if (!roadmap) {
          return { total: 0, completed: 0, remaining: 0, overallProgress: 0, currentMilestone: null };
        }
        const milestones = roadmap.milestones || [];
        const total = milestones.length;
        const completed = milestones.filter((m) => m.status === "completed").length;
        const remaining = total - completed;
        const overallProgress = total > 0 ? Math.round((completed / total) * 100) : 0;
        const currentMilestone =
          milestones.find((m) => m.status === "current") || milestones[0] || null;

        return { total, completed, remaining, overallProgress, currentMilestone };
      },

      setMilestoneStatus: (milestoneId, status) => {
        set((state) => {
          const activeId = state.activeRoadmapId;
          const currentRm = state.roadmaps[activeId];
          if (!currentRm) return state;

          const updatedMilestones = currentRm.milestones.map((m) =>
            m.id === milestoneId
              ? { ...m, status, progress: status === "completed" ? 100 : status === "upcoming" || status === "locked" ? 0 : m.progress }
              : m
          );

          return {
            roadmaps: {
              ...state.roadmaps,
              [activeId]: { ...currentRm, milestones: updatedMilestones },
            },
          };
        });
      },

      updateMilestoneProgress: (milestoneId, progress) => {
        set((state) => {
          const activeId = state.activeRoadmapId;
          const currentRm = state.roadmaps[activeId];
          if (!currentRm) return state;

          const updatedMilestones = currentRm.milestones.map((m) =>
            m.id === milestoneId ? { ...m, progress } : m
          );

          return {
            roadmaps: {
              ...state.roadmaps,
              [activeId]: { ...currentRm, milestones: updatedMilestones },
            },
          };
        });
      },

      addMilestone: (milestoneData) => {
        set((state) => {
          const activeId = state.activeRoadmapId;
          const currentRm = state.roadmaps[activeId];
          if (!currentRm) return state;

          const newNumber = String(currentRm.milestones.length + 1).padStart(2, "0");
          const newMilestone = {
            id: `m_${Date.now()}`,
            number: newNumber,
            progress: 0,
            status: "upcoming",
            ...milestoneData,
          };

          return {
            roadmaps: {
              ...state.roadmaps,
              [activeId]: {
                ...currentRm,
                milestones: [...currentRm.milestones, newMilestone],
              },
            },
          };
        });
      },

      editMilestone: (milestoneId, data) => {
        set((state) => {
          const activeId = state.activeRoadmapId;
          const currentRm = state.roadmaps[activeId];
          if (!currentRm) return state;

          const updatedMilestones = currentRm.milestones.map((m) =>
            m.id === milestoneId ? { ...m, ...data } : m
          );

          return {
            roadmaps: {
              ...state.roadmaps,
              [activeId]: { ...currentRm, milestones: updatedMilestones },
            },
          };
        });
      },

      deleteMilestone: (milestoneId) => {
        set((state) => {
          const activeId = state.activeRoadmapId;
          const currentRm = state.roadmaps[activeId];
          if (!currentRm) return state;

          return {
            roadmaps: {
              ...state.roadmaps,
              [activeId]: {
                ...currentRm,
                milestones: currentRm.milestones.filter((m) => m.id !== milestoneId),
              },
            },
          };
        });
      },

      toggleFocusGoal: (goalId) => {
        set((state) => {
          const activeId = state.activeRoadmapId;
          const currentRm = state.roadmaps[activeId];
          if (!currentRm) return state;

          const updatedGoals = (currentRm.focusGoals || []).map((g) =>
            g.id === goalId ? { ...g, done: !g.done } : g
          );

          return {
            roadmaps: {
              ...state.roadmaps,
              [activeId]: { ...currentRm, focusGoals: updatedGoals },
            },
          };
        });
      },

      addFocusGoal: (text) => {
        set((state) => {
          const activeId = state.activeRoadmapId;
          const currentRm = state.roadmaps[activeId];
          if (!currentRm) return state;

          const newGoal = { id: `fg_${Date.now()}`, text, done: false };
          return {
            roadmaps: {
              ...state.roadmaps,
              [activeId]: {
                ...currentRm,
                focusGoals: [...(currentRm.focusGoals || []), newGoal],
              },
            },
          };
        });
      },

      deleteFocusGoal: (goalId) => {
        set((state) => {
          const activeId = state.activeRoadmapId;
          const currentRm = state.roadmaps[activeId];
          if (!currentRm) return state;

          return {
            roadmaps: {
              ...state.roadmaps,
              [activeId]: {
                ...currentRm,
                focusGoals: (currentRm.focusGoals || []).filter((g) => g.id !== goalId),
              },
            },
          };
        });
      },

      createRoadmap: ({ title, subtitle }) => {
        const id = `rm_${Date.now()}`;
        const newRm = {
          id,
          title: title || "New Custom Path",
          subtitle: subtitle || "Personalized learning roadmap.",
          startDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          estCompletion: "TBD",
          pace: "5h / week",
          streak: 0,
          learningTimeHours: 0,
          milestones: [],
          focusGoals: [],
        };

        set((state) => ({
          activeRoadmapId: id,
          roadmaps: { ...state.roadmaps, [id]: newRm },
        }));
      },

      resetToDefaults: () => set({ roadmaps: defaultRoadmaps, activeRoadmapId: "rm-fullstack" }),
    }),
    {
      name: "urpath-roadmaps",
    }
  )
);
