"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  actualTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const getSystemTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme && ["light", "dark"].includes(savedTheme)) {
      return savedTheme;
    }
    return getSystemTheme();
  };
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [actualTheme, setActualTheme] = useState<"light" | "dark">(getInitialTheme());

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(actualTheme);
    localStorage.setItem("theme", theme);
  }, [theme, actualTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setActualTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  return <ThemeContext.Provider value={{ theme, actualTheme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
