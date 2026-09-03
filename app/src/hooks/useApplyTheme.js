import { useEffect } from "react";
import { useThemeStore } from "../stores/themeStore";

export function useApplyTheme() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return theme;
}