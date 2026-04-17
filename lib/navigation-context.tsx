"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Types
export type NavigationMode = "company" | "project"

export interface Project {
  id: string
  name: string
  status: "Planning" | "Pre-Construction" | "Construction" | "Closeout"
  location: string
  statusColor: string
  companyName?: string
  companyLogo?: string
}

export interface Company {
  id: string
  name: string
  logo?: string
}

export interface NavigationContextType {
  // mode is read-only — derived exclusively from currentProject.
  // null currentProject = "company" context; non-null = "project" context.
  mode: NavigationMode
  currentCompany: Company
  currentProject: Project | null
  setCurrentProject: (project: Project | null) => void
  projects: Project[]
  favoriteTools: string[]
  toggleFavorite: (toolId: string) => void
  isFavorite: (toolId: string) => boolean
  hasPermission: (toolId: string) => boolean
}

// Logos
export const DEFAULT_PROCORE_LOGO = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Procore_Default_Company_Logo-vt6Bx3lcjmS5Vcx1Inf3G0eJGh9UHt.png"
const MILLER_DESIGN_LOGO = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Company%20Logo-Z5UGWf2OYQoCPOt5ZKarKjxnp71DSK.png"

const DEFAULT_COMPANY: Company = {
  id: "miller-design",
  name: "Miller Design",
  logo: MILLER_DESIGN_LOGO,
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "burnham-park-dc",
    name: "Burnham Park Data Center",
    status: "Construction",
    location: "Austin, TX",
    statusColor: "hsl(var(--status-construction))",
    companyName: "Miller Design",
  },
  {
    id: "gateway-office",
    name: "Gateway Office Complex",
    status: "Pre-Construction",
    location: "Dallas, TX",
    statusColor: "hsl(var(--status-pre-construction))",
    companyName: "Miller Design",
  },
  {
    id: "riverside-medical",
    name: "Riverside Medical Center",
    status: "Construction",
    location: "Austin, TX",
    statusColor: "hsl(var(--status-construction))",
    companyName: "Miller Design",
  },
  {
    id: "burnham-park-planning",
    name: "Burnham Park Phase 2",
    status: "Planning",
    location: "Houston, TX",
    statusColor: "hsl(var(--status-planning))",
    companyName: "Miller Design",
  },
  {
    id: "metro-transit",
    name: "Metro Transit Hub",
    status: "Construction",
    location: "San Antonio, TX",
    statusColor: "hsl(var(--status-construction))",
    companyName: "Miller Design",
  },
]

// Default fallback values
const defaultNavigationValue: NavigationContextType = {
  mode: "company",
  currentCompany: { id: "default", name: "Company", logo: DEFAULT_PROCORE_LOGO },
  currentProject: null,
  setCurrentProject: () => {},
  projects: [],
  favoriteTools: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
  hasPermission: () => true,
}

// Context
const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

const SESSION_KEY_PROJECT = "ngx_current_project"

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null)
  const [favoriteTools, setFavoriteTools] = useState<string[]>([])

  // Mode is derived exclusively from currentProject — not pathname, not manual override.
  // This is the single source of truth for context locking.
  const mode: NavigationMode = currentProject ? "project" : "company"

  // Rehydrate currentProject from sessionStorage on mount.
  // This handles React Strict Mode double-invocation and any edge case where
  // the provider remounts during a page transition, resetting useState to null.
  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY_PROJECT)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Project
        // Only restore if it's a valid project from our known list
        const match = DEFAULT_PROJECTS.find(p => p.id === parsed.id)
        if (match) {
          setCurrentProjectState(match)
        }
      } catch {
        // Ignore corrupt data
      }
    }
  }, [])
  
  useEffect(() => {
    const stored = localStorage.getItem("ngx_tool_favorites")
    if (stored) {
      try {
        setFavoriteTools(JSON.parse(stored))
      } catch {
        setFavoriteTools([])
      }
    }
  }, [])

  // Wrap the setter to also persist to sessionStorage
  const setCurrentProject = (project: Project | null) => {
    if (project) {
      sessionStorage.setItem(SESSION_KEY_PROJECT, JSON.stringify(project))
    } else {
      sessionStorage.removeItem(SESSION_KEY_PROJECT)
    }
    setCurrentProjectState(project)
  }
  
  const toggleFavorite = (toolId: string) => {
    setFavoriteTools(prev => {
      const newFavorites = prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
      localStorage.setItem("ngx_tool_favorites", JSON.stringify(newFavorites))
      window.dispatchEvent(
        new CustomEvent("tool-favorite-toggled", {
          detail: { toolId, isFavorite: newFavorites.includes(toolId) },
        })
      )
      return newFavorites
    })
  }
  
  const isFavorite = (toolId: string) => favoriteTools.includes(toolId)
  const hasPermission = (_toolId: string) => true
  
  const value: NavigationContextType = {
    mode,
    currentCompany: DEFAULT_COMPANY,
    currentProject,
    setCurrentProject,
    projects: DEFAULT_PROJECTS,
    favoriteTools,
    toggleFavorite,
    isFavorite,
    hasPermission,
  }
  
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext)
  // Return default values during SSR or when outside provider
  if (!context) {
    return defaultNavigationValue
  }
  return context
}
