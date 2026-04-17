"use client"

import { Menu, ChevronDown, HelpCircle, Bell, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { RichPopover, RichPopoverTrigger, RichPopoverContent } from "@/components/rich-popover"
import { AssistSearchPopover } from "@/components/assist-search-popover"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { RichMenu } from "@/components/rich-menu"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { ProfileEditPopover } from "@/components/profile-edit-popover"
import { ThemeSettingsPopover } from "@/components/theme-settings-popover"
import { useTranslation } from "@/lib/use-translation"

interface GlobalHeaderProps {
  sidebarOpen: boolean
  onSidebarToggle: (open: boolean) => void
  assistOpen: boolean
  onAssistToggle: (open: boolean) => void
}

const projects = [
  {
    id: "burnham-park-dc",
    name: "Burnham Park Data Center",
    status: "Construction",
    location: "Austin, TX",
    statusColor: "hsl(var(--status-construction))",
  },
  {
    id: "gateway-office",
    name: "Gateway Office Complex",
    status: "Pre-Construction",
    location: "Dallas, TX",
    statusColor: "hsl(var(--status-pre-construction))",
  },
  {
    id: "riverside-medical",
    name: "Riverside Medical Center",
    status: "Construction",
    location: "Austin, TX",
    statusColor: "hsl(var(--status-construction))",
  },
  {
    id: "burnham-park-planning",
    name: "Burnham Park Data Center",
    status: "Planning",
    location: "Houston, TX",
    statusColor: "hsl(var(--status-planning))",
  },
  {
    id: "metro-transit",
    name: "Metro Transit Hub",
    status: "Construction",
    location: "San Antonio, TX",
    statusColor: "hsl(var(--status-construction))",
  },
]

export function GlobalHeader({ sidebarOpen, onSidebarToggle, assistOpen, onAssistToggle }: GlobalHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState(projects[0])
  const [assistSearchOpen, setAssistSearchOpen] = useState(false)
  const [richMenuOpen, setRichMenuOpen] = useState(false)
  const [favoriteTools, setFavoriteTools] = useState<string[]>([])
  const [profileData, setProfileData] = useState({
    name: "Robert Brown",
    role: "Project Manager",
    region: "north-america",
    language: "en",
    image: undefined as string | undefined,
  })

  const allToolItems = [
    { name: "Coordination Issues", path: "/coordination-issues" },
    { name: "Change Events", path: "/change-events" },
    { name: "Submittals", path: "/submittals" },
    { name: "Observations", path: "/observations" },
    { name: "Drawings", path: "/drawings" },
    { name: "RFIs", path: "/rfis" },
    { name: "Commitments", path: "/commitments" },
    { name: "Inspections", path: "/inspections" },
    { name: "BIM Models", path: "/bim-models" },
    { name: "Daily Log", path: "/daily-log" },
    { name: "Photos", path: "/photos" },
    { name: "Schedule", path: "/schedule" },
    { name: "Budget", path: "/budget" },
    { name: "Change Orders", path: "/change-orders" },
    { name: "Safety", path: "/quality-safety" },
    { name: "Punch List", path: "/punch-list" },
    { name: "Meetings", path: "/meetings" },
    { name: "Correspondence", path: "/correspondence" },
    { name: "Directory", path: "/directory" },
    { name: "Reports", path: "/reporting" },
    { name: "Prime Contracts", path: "/prime-contracts" },
    { name: "Time Sheets", path: "/timesheets" },
    { name: "Document Management", path: "/documents" },
    { name: "Specifications", path: "/specifications" },
    { name: "Bidding", path: "/bidding" },
    { name: "Quality", path: "/quality-safety" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Checklist", path: "/punch-list" },
    { name: "Forms", path: "/forms" },
    { name: "Head Count", path: "/crews" },
    { name: "Incidents", path: "/incidents" },
    { name: "Instructors", path: "/directory" },
    { name: "Texting", path: "/emails" },
  ]

  const toolItems = allToolItems.filter((tool) => favoriteTools.includes(tool.name))

  const currentTool = toolItems.find((tool) => pathname.startsWith(tool.path))

  useEffect(() => {
    const loadFavorites = () => {
      const storedFavorites = localStorage.getItem("ngx_tool_favorites")
      if (storedFavorites) {
        setFavoriteTools(JSON.parse(storedFavorites))
      }
    }
    loadFavorites()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setAssistSearchOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const handleFavoriteToggle = (event: CustomEvent) => {
      const { toolName, isFavorite } = event.detail
      console.log("[v0] Tool favorite toggled:", toolName, isFavorite)

      const storedFavorites = localStorage.getItem("ngx_tool_favorites")
      if (storedFavorites) {
        setFavoriteTools(JSON.parse(storedFavorites))
      }
    }

    window.addEventListener("tool-favorite-toggled", handleFavoriteToggle as EventListener)
    return () => window.removeEventListener("tool-favorite-toggled", handleFavoriteToggle as EventListener)
  }, [])

  const handleToolSelect = (tool: { name: string; path: string }) => {
    setSelectedTool(tool.name)
    router.push(tool.path)
  }

  const handleProjectSelect = (project: (typeof projects)[0]) => {
    setSelectedProject(project)
    router.push("/")
  }

  const handleGridClick = () => {
    setRichMenuOpen(true)
  }

  const handleFavoriteToggle = (toolName: string) => {
    console.log("[v0] Favorite toggled in global header:", toolName)
    const storedFavorites = localStorage.getItem("ngx_tool_favorites")
    if (storedFavorites) {
      setFavoriteTools(JSON.parse(storedFavorites))
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleProfileSave = (data: {
    image?: string
    name: string
    role: string
    region: string
    language: string
  }) => {
    console.log("[v0] Profile saved with language:", data.language)
    setProfileData(data)
    localStorage.setItem("ngx_user_profile", JSON.stringify(data))
    localStorage.setItem("user_language", data.language)
    localStorage.setItem("user_region", data.region)

    window.dispatchEvent(
      new CustomEvent("language-changed", {
        detail: { language: data.language, region: data.region },
      }),
    )
  }

  useEffect(() => {
    const storedProfile = localStorage.getItem("ngx_user_profile")
    if (storedProfile) {
      setProfileData(JSON.parse(storedProfile))
    }
  }, [])

  return (
    <>
      <TooltipProvider>
        <header className="flex h-14 items-center gap-4 border-b px-4 flex-shrink-0 border-asphalt-700 bg-asphalt-900">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSidebarToggle(!sidebarOpen)}
                className="h-8 w-8 text-asphalt-400 hover:text-white hover:bg-asphalt-800"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{sidebarOpen ? "Close sidebar" : "Open sidebar"}</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button className="flex flex-col items-start gap-0 rounded px-3 py-1.5 text-sm font-medium hover:bg-asphalt-800 transition-colors">
                    <span className="text-xs text-asphalt-400">{t("vertigo_construction")}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white">{selectedProject.name}</span>
                      <ChevronDown className="h-4 w-4 text-asphalt-400" />
                    </div>
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{t("switch_project")}</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="start" className="w-64 p-3">
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  className="flex items-start gap-3 cursor-pointer px-3 py-2.5 rounded-sm"
                  onClick={() => handleProjectSelect(project)}
                >
                  <div
                    className="mt-1.5 h-2 w-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: project.statusColor }}
                  />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-medium text-sm leading-tight">{project.name}</span>
                    <span className="text-xs text-muted-foreground leading-tight">
                      {project.status} • {project.location}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-6 w-px bg-asphalt-700" />

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button className="flex flex-col items-start gap-0 rounded px-3 py-1.5 text-sm hover:bg-asphalt-800 transition-colors">
                    <span className="text-xs text-asphalt-400">{t("favorite_tools")}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white">{currentTool ? currentTool.name : t("select_tool")}</span>
                      <ChevronDown className="h-4 w-4 text-asphalt-400" />
                    </div>
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{t("select_tool_placeholder")}</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="start" className="w-56">
              {toolItems.length === 0 ? (
                <div className="px-3 py-2 text-sm text-foreground-secondary">{t("no_favorite_tools")}</div>
              ) : (
                toolItems.map((tool) => (
                  <DropdownMenuItem
                    key={tool.name}
                    className="flex items-center cursor-pointer"
                    onClick={() => handleToolSelect(tool)}
                  >
                    <span>{tool.name}</span>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1" />

          <RichPopover open={assistSearchOpen} onOpenChange={setAssistSearchOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <RichPopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-background hover:bg-accent text-foreground border-border min-w-[300px] justify-start"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10.6696 10.6696C10.1664 11.1727 9.61532 11.6161 9.02137 12C7.08004 10.7451 4.68077 10.125 2 10.125C4.74905 10.125 6.72819 9.30766 8.01792 8.01792C9.30766 6.72819 10.125 4.74905 10.125 2H13.875C13.875 5.50095 12.8173 8.52181 10.6696 10.6696Z"
                        fill="#FF7433"
                      />
                      <path
                        d="M13.3304 13.3304C13.8336 12.8273 14.3847 12.3839 14.9786 12C16.92 13.2549 19.3192 13.875 22 13.875C19.251 13.875 17.2718 14.6924 15.9821 15.9821C14.6923 17.2718 13.875 19.251 13.875 22H10.125C10.125 18.4991 11.1827 15.4782 13.3304 13.3304Z"
                        fill="#FF7433"
                      />
                      <path
                        d="M13.3304 10.6696C12.8273 10.1664 12.3839 9.61532 12 9.02138C13.2549 7.08004 13.875 4.68077 13.875 2C13.875 4.74905 14.6923 6.72819 15.9821 8.01792C17.2718 9.30766 19.251 10.125 22 10.125V13.875C18.499 13.875 15.4782 12.8173 13.3304 10.6696Z"
                        fill="#FF5100"
                      />
                      <path
                        d="M10.6696 13.3304C8.52181 11.1827 5.50095 10.125 2 10.125V13.875C4.74905 13.875 6.72819 14.6924 8.01793 15.9821C9.30766 17.2718 10.125 19.251 10.125 22C10.125 19.3192 10.7451 16.92 12 14.9786C11.6161 14.3847 11.1727 13.8336 10.6696 13.3304Z"
                        fill="#FF5100"
                      />
                    </svg>
                    <span className="flex-1 text-left">{t("search_placeholder")}</span>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
                      Ctrl K
                    </kbd>
                  </Button>
                </RichPopoverTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{t("quick_search_ai_assistance")}</p>
              </TooltipContent>
            </Tooltip>
            <RichPopoverContent
              align="start"
              scrollClassName="p-0"
              className="w-auto min-w-0 max-w-[min(560px,calc(100vw-2rem))] rounded-xl border border-asphalt-200 bg-white p-0 text-asphalt-900 shadow-lg"
            >
              <AssistSearchPopover onClose={() => setAssistSearchOpen(false)} />
            </RichPopoverContent>
          </RichPopover>

          <div className="flex-1" />

          <ThemeSettingsPopover
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-asphalt-400 hover:text-white hover:bg-asphalt-800"
              >
                <Palette className="h-4 w-4" />
              </Button>
            }
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-asphalt-400 hover:text-white hover:bg-asphalt-800"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{t("help")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-asphalt-400 hover:text-white hover:bg-asphalt-800"
              >
                <Bell className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{t("notifications")}</p>
            </TooltipContent>
          </Tooltip>

          <ProfileEditPopover
            trigger={
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  {profileData.image ? (
                    <AvatarImage src={profileData.image || "/placeholder.svg"} alt={profileData.name} />
                  ) : (
                    <AvatarFallback className="bg-asphalt-700 text-white text-xs">
                      {profileData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            }
            onSave={handleProfileSave}
            initialData={profileData}
          />
        </header>
      </TooltipProvider>

      <RichMenu open={richMenuOpen} onOpenChange={setRichMenuOpen} onFavoriteToggle={handleFavoriteToggle} />
    </>
  )
}
