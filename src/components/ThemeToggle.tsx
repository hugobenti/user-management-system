"use client"

import type React from "react"
import { useTheme } from "../context/ThemeContext"
import Button from "./Button"

const ThemeToggle: React.FC = () => {
  const { actualTheme, toggleTheme } = useTheme()

  const getThemeIcon = () => {
    if (actualTheme === "light") {
      return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )
    }

    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    )
  }

  const getThemeLabel = () => `${actualTheme === "light" ? "Light" : "Dark"} theme`
  const getNextThemeLabel = () => `Switch to ${actualTheme === "light" ? "dark" : "light"} theme`

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-40"
      aria-label={getNextThemeLabel()}
      title={`Current: ${getThemeLabel()}. Click to ${getNextThemeLabel().toLowerCase()}`}
    >
      {getThemeIcon()}
      <span className="sr-only">{getThemeLabel()}</span>
    </Button>
  )
}

export default ThemeToggle
