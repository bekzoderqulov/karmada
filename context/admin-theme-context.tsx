"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "dark" | "light" | "system"

type AdminThemeProviderProps = {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type AdminThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: AdminThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const AdminThemeProviderContext = createContext<AdminThemeProviderState>(initialState)

export function AdminThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "admin-theme",
  ...props
}: AdminThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem(storageKey) as Theme
    if (savedTheme && ["dark", "light", "system"].includes(savedTheme)) {
      setTheme(savedTheme)
    }
  }, [storageKey])

  // Listen for theme change events from the theme toggle
  useEffect(() => {
    const handleThemeChange = (e: CustomEvent) => {
      setTheme(e.detail.theme)
    }

    window.addEventListener("themeChange", handleThemeChange as EventListener)
    return () => {
      window.removeEventListener("themeChange", handleThemeChange as EventListener)
    }
  }, [])

  // Apply theme changes
  useEffect(() => {
    if (!mounted) return

    const applyTheme = (newTheme: string) => {
      // Get both the admin root and document root
      const adminRoot = document.getElementById("admin-root")
      const docRoot = document.documentElement

      // Remove existing theme classes
      adminRoot?.classList.remove("light", "dark")
      docRoot.classList.remove("light", "dark")

      // Add the new theme class
      adminRoot?.classList.add(newTheme)
      docRoot.classList.add(newTheme)
    }

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      applyTheme(systemTheme)

      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? "dark" : "light")
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    } else {
      applyTheme(theme)
    }
  }, [theme, mounted])

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  }

  return (
    <AdminThemeProviderContext.Provider {...props} value={value}>
      {children}
    </AdminThemeProviderContext.Provider>
  )
}

export const useAdminTheme = () => {
  const context = useContext(AdminThemeProviderContext)

  if (context === undefined) {
    throw new Error("useAdminTheme must be used within an AdminThemeProvider")
  }

  return context
}

