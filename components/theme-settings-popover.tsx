"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sun, Moon, X } from "lucide-react"
import { RichPopover, RichPopoverTrigger, RichPopoverContent } from "@/components/rich-popover"
import { useTheme } from "next-themes"

interface ThemeSettingsPopoverProps {
  trigger: React.ReactNode
}

export function ThemeSettingsPopover({ trigger }: ThemeSettingsPopoverProps) {
  const { theme, setTheme } = useTheme()
  const [density, setDensity] = useState<"compact" | "comfortable">("compact")
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedDensity = localStorage.getItem("ngx_ui_density")
    if (savedDensity === "compact" || savedDensity === "comfortable") {
      setDensity(savedDensity)
    }
  }, [])

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme)
  }

  const handleDensityChange = (newDensity: "compact" | "comfortable") => {
    setDensity(newDensity)
    localStorage.setItem("ngx_ui_density", newDensity)
    window.dispatchEvent(
      new CustomEvent("density-changed", {
        detail: { density: newDensity },
      }),
    )
  }

  if (!mounted) {
    return null
  }

  return (
    <RichPopover open={open} onOpenChange={setOpen}>
      <RichPopoverTrigger asChild>{trigger}</RichPopoverTrigger>
      <RichPopoverContent className="w-[400px] p-0">
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
            <h2 className="text-lg font-semibold text-foreground-primary">Appearance</h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-md hover:bg-accent transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-foreground-secondary" />
            </button>
          </div>

          {/* Color Section */}
          <div className="px-4 py-4">
            <h3 className="text-sm font-medium text-foreground-secondary mb-3">Color</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleThemeChange("light")}
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 transition-all ${
                  theme === "light"
                    ? "border-border-active bg-background-secondary"
                    : "border-border-default bg-background-primary hover:border-border-hover"
                }`}
              >
                <Sun className="h-8 w-8 text-attention-700" />
                <span className="text-sm font-medium text-foreground-primary">Light</span>
              </button>
              <button
                onClick={() => handleThemeChange("dark")}
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 transition-all ${
                  theme === "dark"
                    ? "border-border-active bg-background-secondary"
                    : "border-border-default bg-background-primary hover:border-border-hover"
                }`}
              >
                <Moon className="h-8 w-8 text-asphalt-700" />
                <span className="text-sm font-medium text-foreground-primary">Dark</span>
              </button>
            </div>
          </div>

          {/* Density Section */}
          <div className="px-4 py-4 border-t border-border-default">
            <h3 className="text-sm font-medium text-foreground-secondary mb-3">Density</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDensityChange("compact")}
                className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  density === "compact"
                    ? "border-border-active bg-background-secondary"
                    : "border-border-default bg-background-primary hover:border-border-hover"
                }`}
              >
                <span className="text-sm font-medium text-foreground-primary">Compact</span>
              </button>
              <button
                onClick={() => handleDensityChange("comfortable")}
                className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  density === "comfortable"
                    ? "border-border-active bg-background-secondary"
                    : "border-border-default bg-background-primary hover:border-border-hover"
                }`}
              >
                <span className="text-sm font-medium text-foreground-primary">Comfortable</span>
              </button>
            </div>
          </div>
        </div>
      </RichPopoverContent>
    </RichPopover>
  )
}
