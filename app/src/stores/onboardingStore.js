import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useOnboardingStore = create(
  persist(
    (set) => ({
      // Current active step (1 to 5)
      currentStep: 1,

      // Step 1 & 2: Domain, Subdomain, Language, Custom Topic
      selectedDomain: null,
      selectedSubdomain: null,
      customSubdomain: "",
      customLearningSubject: "",
      selectedLanguage: "",
      customLanguage: "",

      // Step 3: Goal
      goal: "",
      customGoal: "",

      // Step 4: Preferences
      experienceLevel: "beginner",
      learningPace: "balanced",
      availableTime: "5-10",
      learningPreferences: ["video", "practice"],

      // Step Navigation Actions
      setStep: (step) => set({ currentStep: Math.min(Math.max(step, 1), 5) }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

      // Domain & Subdomain Setters
      setSelectedDomain: (domain) => {
        set({
          selectedDomain: domain,
          selectedSubdomain: null,
          customSubdomain: "",
          customLearningSubject: "",
          selectedLanguage: "",
          customLanguage: "",
        });
      },

      setSelectedSubdomain: (subdomain) => {
        set({ selectedSubdomain: subdomain, customSubdomain: "" });
      },

      setCustomSubdomain: (customSubdomain) => {
        set({ customSubdomain });
      },

      setCustomLearningSubject: (subject) => {
        set({ customLearningSubject: subject });
      },

      setSelectedLanguage: (lang) => {
        set({ selectedLanguage: lang, customLanguage: "" });
      },

      setCustomLanguage: (customLang) => {
        set({ customLanguage: customLang, selectedLanguage: "another" });
      },

      // Goal Setters
      setGoal: (goal) => {
        set({ goal });
      },

      setCustomGoal: (customGoal) => {
        set({ customGoal, goal: "custom" });
      },

      // Preferences Setters
      setExperienceLevel: (experienceLevel) => {
        set({ experienceLevel });
      },

      setLearningPace: (learningPace) => {
        set({ learningPace });
      },

      setAvailableTime: (availableTime) => {
        set({ availableTime });
      },

      toggleLearningPreference: (prefId) => {
        set((state) => {
          const current = state.learningPreferences || [];
          if (current.includes(prefId)) {
            // keep at least 1 preference
            if (current.length === 1) return state;
            return { learningPreferences: current.filter((p) => p !== prefId) };
          } else {
            return { learningPreferences: [...current, prefId] };
          }
        });
      },

      // Reset
      resetOnboarding: () => {
        set({
          currentStep: 1,
          selectedDomain: null,
          selectedSubdomain: null,
          customSubdomain: "",
          customLearningSubject: "",
          selectedLanguage: "",
          customLanguage: "",
          goal: "",
          customGoal: "",
          experienceLevel: "beginner",
          learningPace: "balanced",
          availableTime: "5-10",
          learningPreferences: ["video", "practice"],
        });
      },
    }),
    {
      name: "urpath-learning-setup",
      storage:
        typeof window !== "undefined"
          ? createJSONStorage(() => localStorage)
          : undefined,
    }
  )
);
