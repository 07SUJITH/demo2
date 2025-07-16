"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
  useTheme as useNextTheme,
} from "next-themes";
import { useEffect } from "react";

import { useAuthStore } from "@/store/authStore";

// Internal component to sync theme changes from next-themes to auth store
function ThemeSync() {
  const { setTheme: setAuthTheme } = useAuthStore();
  const { theme: currentTheme } = useNextTheme();

  // Only sync from next-themes to auth store (one-way sync)
  // next-themes is the single source of truth
  useEffect(() => {
    if (currentTheme) {
      setAuthTheme(currentTheme);
    }
  }, [currentTheme, setAuthTheme]);

  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeSync />
      {children}
    </NextThemesProvider>
  );
}
