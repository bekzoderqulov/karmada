"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [mounted, setMounted] = useState(false)

  // Apply theme
  const applyTheme = useCallback((theme: Theme) => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [])

  // Set theme and save to localStorage
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme)
      localStorage.setItem("theme", newTheme)
      applyTheme(newTheme)

      // Send custom event for other components
      const event = new CustomEvent("themeChanged", { detail: newTheme })
      window.dispatchEvent(event)
    },
    [applyTheme],
  )

  // Get theme from localStorage
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setThemeState(savedTheme)
      applyTheme(savedTheme)
    }

    // Listen for theme changes from other components
    const handleThemeEvent = (e: CustomEvent) => {
      if (e.detail && ["light", "dark", "system"].includes(e.detail)) {
        setThemeState(e.detail as Theme)
        applyTheme(e.detail as Theme)
      }
    }

    window.addEventListener("themeChanged" as any, handleThemeEvent)

    return () => {
      window.removeEventListener("themeChanged" as any, handleThemeEvent)
    }
  }, [applyTheme])

  // Watch for system theme changes
  useEffect(() => {
    if (!mounted) return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, mounted, applyTheme])

  // Context value
  const value = {
    theme,
    setTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// Hook to use theme context
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

