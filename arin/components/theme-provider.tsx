"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  attribute?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  enableSystem = true,
  disableTransitionOnChange = false,
  attribute = "data-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement

    // Remove old theme attribute
    root.removeAttribute(attribute)

    // Set the data-theme attribute on the document element
    const dataTheme = theme === "system" ? getSystemTheme() : theme
    root.setAttribute(attribute, dataTheme)

    // Add dark class for dark mode
    if (dataTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Save theme to localStorage
    if (storageKey) {
      localStorage.setItem(storageKey, theme)
    }
  }, [theme, attribute, storageKey])

  // Get system theme preference
  const getSystemTheme = (): "dark" | "light" => {
    if (!enableSystem) return "light"
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }

  // Initialize theme from localStorage or default
  useEffect(() => {
    if (storageKey) {
      const savedTheme = localStorage.getItem(storageKey) as Theme | null
      if (savedTheme) {
        setTheme(savedTheme)
      } else if (enableSystem) {
        setTheme("system")
      }
    }
  }, [enableSystem, storageKey])

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem) return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      if (theme === "system") {
        const root = window.document.documentElement
        const systemTheme = getSystemTheme()
        root.setAttribute(attribute, systemTheme)

        if (systemTheme === "dark") {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, attribute, enableSystem])

  const value = {
    theme,
    setTheme: (theme: Theme) => setTheme(theme),
  }

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

