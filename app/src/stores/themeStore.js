import { create } from "zustand";
import { persist } from "zustand/middleware";

const getSystemTheme = () => {
  if (typeof window === "undefined") return "dark";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: getSystemTheme(),

      setTheme: (theme) => {
        set({ theme });
      },

      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        }));
      },
    }),
    {
      name: "urpath-theme",
    }
  )
);