"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAdminLanguage } from "@/context/admin-language-context"

export function AdminThemeToggle() {
  const { t } = useAdminLanguage()
  const [mounted, setMounted] = useState(false)
  const [theme, setThemeState] = useState<"light" | "dark" | "system">("system")

  // After mounting, we can safely show the theme toggle without causing hydration mismatch
  useEffect(() => {
    setMounted(true)

    // Get the initial theme from localStorage or default to system
    const savedTheme = (localStorage.getItem("admin-theme") as "light" | "dark" | "system") || "system"
    if (savedTheme && ["dark", "light", "system"].includes(savedTheme)) {
      setThemeState(savedTheme)
    }
  }, [])

  // Function to set theme
  const setTheme = (newTheme: "light" | "dark" | "system") => {
    // Save to localStorage
    localStorage.setItem("admin-theme", newTheme)
    setThemeState(newTheme)

    // Apply theme to document
    const root = document.documentElement
    const adminRoot = document.getElementById("admin-root")

    // Remove existing theme classes
    root.classList.remove("light", "dark")
    adminRoot?.classList.remove("light", "dark")

    // Apply the new theme
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
      adminRoot?.classList.add(systemTheme)
    } else {
      root.classList.add(newTheme)
      adminRoot?.classList.add(newTheme)
    }

    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent("themeChange", { detail: { theme: newTheme } }))
  }

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

      const handleChange = () => {
        const newTheme = mediaQuery.matches ? "dark" : "light"
        document.documentElement.classList.remove("light", "dark")
        document.documentElement.classList.add(newTheme)

        const adminRoot = document.getElementById("admin-root")
        if (adminRoot) {
          adminRoot.classList.remove("light", "dark")
          adminRoot.classList.add(newTheme)
        }
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme, mounted])

  // Get current effective theme (accounting for system preference)
  const getEffectiveTheme = () => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return theme
  }

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 theme-toggle-button">
          {getEffectiveTheme() === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span className="sr-only">{t("toggleTheme")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>{t("light")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>{t("dark")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <span className="mr-2">💻</span>
          <span>{t("system")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

