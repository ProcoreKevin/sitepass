"use client"

// SSR-safe workspace layout with proper window guards - v4
// Updated: New unified header, removed sidebar
import { useEffect, useState, createContext, useContext, useRef, useCallback, useMemo } from "react"
import { usePathname } from "next/navigation"
import { UnifiedHeader } from "./navigation/unified-header"
import { AssistPanel, ASSIST_PANEL_WIDTH_PX } from "./assist-panel"
import { SlideOutPanel } from "./slide-out-panel"
import { SplitViewPanel } from "./split-view-panel"
import { GettingStartedOverlay } from "./getting-started-overlay"
import { Toaster } from "@/components/ui/toaster"
import { getSOPForTool, type UserRole, type SOPDefinition, ROLE_ENTRY_VECTORS } from "@/lib/sop-definitions"

interface WorkspaceLayoutProps {
  children: React.ReactNode
}

interface SlideOutContextType {
  openSlideOut: () => void
  closeSlideOut: () => void
}

interface SplitViewContextType {
  openSplitView: (data?: any) => void
  closeSplitView: () => void
  setSplitViewWidth: (width: 37 | 67) => void
}

// Navigation category definitions
type NavigationCategory = 
  | "field-design" 
  | "project-coordination" 
  | "financials-contracts" 
  | "resources" 
  | "administration"

// Map tool paths to categories
const TOOL_TO_CATEGORY: Record<string, NavigationCategory> = {
  "/": "field-design",
  "/drawings": "field-design",
  "/specifications": "field-design",
  "/bim-models": "field-design",
  "/coordination-issues": "field-design",
  "/planroom": "field-design",
  "/photos": "field-design",
  "/daily-log": "field-design",
  "/inspections": "field-design",
  "/incidents": "field-design",
  "/punch-list": "field-design",
  "/forms": "field-design",
  "/observations": "field-design",
  "/locations": "field-design",
  "/action-plans": "project-coordination",
  "/rfis": "project-coordination",
  "/submittals": "project-coordination",
  "/correspondence": "project-coordination",
  "/site-instructions": "project-coordination",
  "/meetings": "project-coordination",
  "/transmittals": "project-coordination",
  "/conversations": "project-coordination",
  "/emails": "project-coordination",
  "/tasks": "project-coordination",
  "/schedule": "project-coordination",
  "/change-events": "financials-contracts",
  "/change-orders": "financials-contracts",
  "/rfq": "financials-contracts",
  "/prime-contracts": "financials-contracts",
  "/head-contract-variations": "financials-contracts",
  "/commitments": "financials-contracts",
  "/subcontract-variations": "financials-contracts",
  "/direct-costs": "financials-contracts",
  "/budget": "financials-contracts",
  "/invoicing": "financials-contracts",
  "/pay": "financials-contracts",
  "/estimating": "financials-contracts",
  "/bidding": "financials-contracts",
  "/prequalification": "financials-contracts",
  "/workforce-planning": "resources",
  "/resource-tracking": "resources",
  "/timesheets": "resources",
  "/crews": "resources",
  "/tm-tickets": "resources",
  "/day-worksheets": "resources",
  "/equipment": "resources",
  "/directory": "administration",
  "/documents": "administration",
  "/reports": "administration",
  "/analytics": "administration",
  "/workflows": "administration",
  "/erp-integrations": "administration",
  "/marketplace": "administration",
  "/admin": "administration",
  "/permissions": "administration",
}

interface WorkspaceContextType {
  // Layout state
  assistOpen: boolean
  splitViewOpen: boolean
  
  // Layout dimensions
  getWorkspaceWidth: () => number
  getAssistWidth: () => number
  getSplitViewWidth: () => number
  
  // Assist panel
  openAssistWithContext: (context: string) => void
  assistContext: string | null
  
  // Role and SOP context
  userRole: UserRole | null
  setUserRole: (role: UserRole | null) => void
  currentSOP: SOPDefinition | null
  activeCategory: NavigationCategory | null
  currentToolPath: string
  // Getting started
  openGettingStarted: () => void
}

const SlideOutContext = createContext<SlideOutContextType | undefined>(undefined)
const SplitViewContext = createContext<SplitViewContextType | undefined>(undefined)
const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export function useSlideOut() {
  const context = useContext(SlideOutContext)
  if (!context) {
    throw new Error("useSlideOut must be used within WorkspaceLayout")
  }
  return context
}

export function useSplitView() {
  const context = useContext(SplitViewContext)
  if (!context) {
    throw new Error("useSplitView must be used within WorkspaceLayout")
  }
  return context
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceLayout")
  }
  return context
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const pathname = usePathname()
  const [assistOpen, setAssistOpen] = useState(false)
  const [slideOutOpen, setSlideOutOpen] = useState(false)
  const [splitViewOpen, setSplitViewOpen] = useState(false)
  const [splitViewWidth, setSplitViewWidth] = useState<37 | 67>(37)
  const [splitViewData, setSplitViewData] = useState<any>(null)
  const [assistContext, setAssistContext] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [gettingStartedForceCount, setGettingStartedForceCount] = useState(0)

  const prevPathnameRef = useRef(pathname)

  // Derive current SOP based on pathname
  const currentSOP = useMemo(() => {
    return getSOPForTool(pathname)
  }, [pathname])

  // Derive active category based on pathname
  const activeCategory = useMemo((): NavigationCategory | null => {
    // Find base tool path (first segment)
    const basePath = "/" + (pathname.split("/")[1] || "")
    return TOOL_TO_CATEGORY[basePath] || null
  }, [pathname])

  // Hydration-safe initialization
  useEffect(() => {
    setMounted(true)
    // Load saved user role
    const savedRole = localStorage.getItem("ngx_user_role")
    if (savedRole) {
      setUserRole(savedRole as UserRole)
    }
  }, [])

  // Persist user role changes
  useEffect(() => {
    if (mounted && userRole) {
      localStorage.setItem("ngx_user_role", userRole)
    }
  }, [userRole, mounted])

  // Track pathname changes
  useEffect(() => {
    prevPathnameRef.current = pathname
  }, [pathname])

  const handleAssistToggle = (open: boolean) => {
    setAssistOpen(open)
    if (!open) {
      setAssistContext(null)
    }
  }

  const openAssistWithContext = (context: string) => {
    setAssistContext(context)
    handleAssistToggle(true)
  }

  // SSR-safe width calculations - window checks must come first
  const getWorkspaceWidth = useCallback((): number => {
    // Guard against SSR - window doesn't exist on server
    if (typeof window === "undefined") {
      return 0
    }
    const winWidth = window.innerWidth
    const assistW = assistOpen ? ASSIST_PANEL_WIDTH_PX : 0
    const splitW = splitViewOpen ? (winWidth * splitViewWidth) / 100 : 0
    return winWidth - assistW - splitW
  }, [assistOpen, splitViewOpen, splitViewWidth])

  const getAssistWidth = (): number => {
    return assistOpen ? ASSIST_PANEL_WIDTH_PX : 0
  }

  // SSR-safe split view width calculation
  const getSplitViewWidth = useCallback((): number => {
    // Guard against SSR - window doesn't exist on server
    if (typeof window === "undefined") {
      return 0
    }
    return splitViewOpen ? (window.innerWidth * splitViewWidth) / 100 : 0
  }, [splitViewOpen, splitViewWidth])

  const slideOutContext: SlideOutContextType = {
    openSlideOut: () => setSlideOutOpen(true),
    closeSlideOut: () => setSlideOutOpen(false),
  }

  const splitViewContext: SplitViewContextType = {
    openSplitView: (data?: any) => {
      setSplitViewData(data)
      setSplitViewOpen(true)
    },
    closeSplitView: () => setSplitViewOpen(false),
    setSplitViewWidth: (width: 37 | 67) => setSplitViewWidth(width),
  }

  const openGettingStarted = () => {
    setGettingStartedForceCount((c) => c + 1)
  }

  const workspaceContext: WorkspaceContextType = {
    assistOpen,
    splitViewOpen,
    getWorkspaceWidth,
    getAssistWidth,
    getSplitViewWidth,
    openAssistWithContext,
    assistContext,
    // Role and SOP context
    userRole,
    setUserRole,
    currentSOP,
    activeCategory,
    currentToolPath: pathname,
    // Getting started
    openGettingStarted,
  }

  return (
    <SlideOutContext.Provider value={slideOutContext}>
      <SplitViewContext.Provider value={splitViewContext}>
        <WorkspaceContext.Provider value={workspaceContext}>
          <div className="relative flex h-screen min-w-0 overflow-hidden">
            <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden">
              <UnifiedHeader
                assistOpen={assistOpen}
                onAssistToggle={handleAssistToggle}
              />

              <main
                className="bg-background-secondary text-foreground-primary min-h-0 flex-1 overflow-auto transition-[margin-right] duration-300"
                style={{
                  marginRight: (() => {
                    const split = splitViewOpen ? `${splitViewWidth}%` : ""
                    const assist = assistOpen ? `${ASSIST_PANEL_WIDTH_PX}px` : ""
                    if (!split && !assist) return "0"
                    if (split && assist) return `calc(${split} + ${assist})`
                    return split || assist
                  })(),
                }}
              >
                {children}
              </main>
            </div>

            <GettingStartedOverlay forceOpenCount={gettingStartedForceCount} />

          <AssistPanel
            isOpen={assistOpen}
            onClose={() => setAssistOpen(false)}
            initialContext={assistContext}
            onGettingStarted={openGettingStarted}
          />

            <SlideOutPanel
              isOpen={slideOutOpen}
              onClose={() => setSlideOutOpen(false)}
              workspaceWidth={getWorkspaceWidth()}
            />

            <SplitViewPanel
              isOpen={splitViewOpen}
              onClose={() => setSplitViewOpen(false)}
              width={splitViewWidth}
              onWidthChange={setSplitViewWidth}
              rfiData={splitViewData}
              assistWidth={getAssistWidth()}
              workspaceWidth={getWorkspaceWidth()}
              onNavigateUp={splitViewData?.onNavigateUp}
              onNavigateDown={splitViewData?.onNavigateDown}
              canNavigateUp={splitViewData?.canNavigateUp ?? false}
              canNavigateDown={splitViewData?.canNavigateDown ?? false}
            />

            <Toaster />
          </div>
        </WorkspaceContext.Provider>
      </SplitViewContext.Provider>
    </SlideOutContext.Provider>
  )
}
