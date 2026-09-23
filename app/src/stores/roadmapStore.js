import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getRoadmapById, getRoadmaps } from "../services/roadmapService";
import { getProgressByRoadmap, completeTask } from "../services/progressService";

const normalizeRoadmap = (roadmap) => ({
  ...roadmap,
  id: roadmap._id,
  title: roadmap.goal || roadmap.domain || "Learning roadmap",
  subtitle: roadmap.subdomain || "",
  milestones: (roadmap.weeks || []).map((week, index) => {
    const tasks = week.tasks || [];
    const completedTasks = tasks.filter((task) => task.completed).length;
    const progress = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

    return {
      id: `week-${week.week ?? index + 1}`,
      backendId: roadmap._id,
      weekNumber: week.week ?? index + 1,
      number: String(week.week ?? index + 1).padStart(2, "0"),
      title: week.title || `Week ${week.week ?? index + 1}`,
      description: week.objective || "",
      topics: week.topics || [],
      tasks,
      lessonsCount: tasks.filter((task) => task.type === "lesson").length,
      projectsCount: tasks.filter((task) => task.type === "project").length,
      hours: 0,
      progress,
      status: progress === 100 ? "completed" : progress > 0 ? "current" : index === 0 ? "current" : "upcoming",
    };
  }),
});

const getRoadmapStats = (roadmap) => {
  const milestones = roadmap?.milestones || [];
  const totalTasks = milestones.reduce((sum, milestone) => sum + (milestone.tasks?.length || 0), 0);
  const completedTasks = milestones.reduce(
    (sum, milestone) => sum + (milestone.tasks?.filter((task) => task.completed).length || 0),
    0
  );
  const currentMilestone =
    milestones.find((milestone) => milestone.status === "current") ||
    milestones.find((milestone) => milestone.progress < 100) ||
    milestones[0] ||
    null;

  return {
    total: totalTasks,
    completed: completedTasks,
    remaining: Math.max(totalTasks - completedTasks, 0),
    overallProgress: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
    currentMilestone,
  };
};

export const useRoadmapStore = create(
  persist(
    (set, get) => ({
      activeRoadmapId: null,
      roadmaps: {},
      progressByRoadmap: {},
      loading: false,
      error: null,

      fetchRoadmaps: async () => {
        set({ loading: true, error: null });
        try {
          const data = await getRoadmaps();
          const roadmaps = {};
          (data.roadmaps || []).forEach((roadmap) => {
            const normalized = normalizeRoadmap(roadmap);
            roadmaps[normalized.id] = normalized;
          });
          const firstId = get().activeRoadmapId && roadmaps[get().activeRoadmapId]
            ? get().activeRoadmapId
            : Object.keys(roadmaps)[0] || null;
          set({ roadmaps, activeRoadmapId: firstId, loading: false });
          if (firstId) await get().fetchProgress(firstId);
        } catch (error) {
          set({ loading: false, error: error.response?.data?.message || error.message });
        }
      },

      fetchRoadmap: async (roadmapId) => {
        set({ loading: true, error: null });
        try {
          const data = await getRoadmapById(roadmapId);
          const normalized = normalizeRoadmap(data.roadmap);
          set((state) => ({
            roadmaps: { ...state.roadmaps, [normalized.id]: normalized },
            activeRoadmapId: normalized.id,
            loading: false,
          }));
          await get().fetchProgress(normalized.id);
        } catch (error) {
          set({ loading: false, error: error.response?.data?.message || error.message });
        }
      },

      fetchProgress: async (roadmapId) => {
        try {
          const data = await getProgressByRoadmap(roadmapId);
          set((state) => ({
            progressByRoadmap: { ...state.progressByRoadmap, [roadmapId]: data.progress },
          }));
        } catch (error) {
          if (error.response?.status === 404) return;
          set({ error: error.response?.data?.message || error.message });
        }
      },

      setActiveRoadmap: async (id) => {
        set({ activeRoadmapId: id });
        await get().fetchProgress(id);
      },

      getActiveRoadmap: () => {
        const state = get();
        return state.roadmaps[state.activeRoadmapId] || null;
      },

      getStats: () => {
        const state = get();
        const roadmap = state.roadmaps[state.activeRoadmapId];
        const progress = state.progressByRoadmap[state.activeRoadmapId];
        if (progress) {
          return {
            total: progress.totalTasks || 0,
            completed: progress.completedTasks || 0,
            remaining: Math.max((progress.totalTasks || 0) - (progress.completedTasks || 0), 0),
            overallProgress: progress.percentage || 0,
            currentMilestone:
              roadmap?.milestones?.find((milestone) => milestone.weekNumber === progress.currentWeek) ||
              roadmap?.milestones?.find((milestone) => milestone.progress < 100) ||
              null,
          };
        }
        return getRoadmapStats(roadmap);
      },

      setMilestoneStatus: async (milestoneId, status) => {
        if (status !== "completed") return;
        const roadmap = get().getActiveRoadmap();
        const milestone = roadmap?.milestones?.find((item) => item.id === milestoneId);
        if (!roadmap || !milestone) return;

        const taskIndex = milestone.tasks?.findIndex((task) => !task.completed);
        if (taskIndex === undefined || taskIndex < 0) return;

        try {
          const data = await completeTask({
            roadmapId: roadmap.id,
            weekNumber: milestone.weekNumber,
            taskIndex,
          });
          const updated = normalizeRoadmap(data.roadmap);
          set((state) => ({
            roadmaps: { ...state.roadmaps, [updated.id]: updated },
            progressByRoadmap: { ...state.progressByRoadmap, [updated.id]: data.progress },
          }));
        } catch (error) {
          set({ error: error.response?.data?.message || error.message });
        }
      },

      updateMilestoneProgress: () => {},

      addMilestone: () => {},
      editMilestone: () => {},
      deleteMilestone: () => {},

      toggleFocusGoal: () => {},
      addFocusGoal: () => {},
      deleteFocusGoal: () => {},

      createRoadmap: () => {},

      resetToDefaults: () => {
        set({ roadmaps: {}, progressByRoadmap: {}, activeRoadmapId: null });
      },
    }),
    {
      name: "urpath-roadmaps",
      partialize: (state) => ({ activeRoadmapId: state.activeRoadmapId }),
    }
  )
);
