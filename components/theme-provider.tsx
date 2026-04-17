"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme, type ThemeProviderProps } from "next-themes"

/** Keeps Untitled UI `theme.css` `.dark-mode { … }` variables in sync with next-themes `dark`. */
function UntitledDarkModeClassSync() {
  const { resolvedTheme } = useTheme()

  React.useEffect(() => {
    if (resolvedTheme === undefined) return
    document.documentElement.classList.toggle("dark-mode", resolvedTheme === "dark")
  }, [resolvedTheme])

  return null
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    // Initialize density from localStorage
    const savedDensity = localStorage.getItem("ngx_ui_density") || "compact"
    document.documentElement.setAttribute("data-density", savedDensity)

    // Listen for density changes
    const handleDensityChange = (event: CustomEvent) => {
      const { density } = event.detail
      document.documentElement.setAttribute("data-density", density)
    }

    window.addEventListener("density-changed", handleDensityChange as EventListener)

    return () => {
      window.removeEventListener("density-changed", handleDensityChange as EventListener)
    }
  }, [])

  return (
    <NextThemesProvider {...props}>
      <UntitledDarkModeClassSync />
      {children}
    </NextThemesProvider>
  )
}
