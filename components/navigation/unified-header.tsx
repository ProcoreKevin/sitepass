"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  RiHomeFill, RiQuestionFill, RiNotification3Fill, RiApps2Fill, RiFileList3Fill,
  RiCustomerService2Line, RiGroupLine, RiPhoneLine, RiLiveLine, RiPlayCircleLine, RiLightbulbLine, RiMedalLine, RiMessage2Line,
  RiPencilLine,
} from "react-icons/ri"
import { Button } from "@/components/ui/button"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useNavigation, DEFAULT_PROCORE_LOGO } from "@/lib/navigation-context"
import { ProjectSelector } from "./project-selector"
import { CompanyToolsDropdown } from "./company-tools-dropdown"
import { FavoriteToolsDropdown } from "./favorite-tools-dropdown"
import { AppsDropdown } from "./apps-dropdown"
import { AssistSearchBar } from "./assist-search-bar"
import { ProfileEditPopover } from "@/components/profile-edit-popover"
import Image from "next/image"
import { NotificationSlideout } from "./notification-slideout"
import { CompanyEditSlideout } from "./company-edit-slideout"

interface UnifiedHeaderProps {
  assistOpen?: boolean
  onAssistToggle?: (open: boolean) => void
}

export function UnifiedHeader({ assistOpen, onAssistToggle }: UnifiedHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { mode, currentCompany, setCurrentProject } = useNavigation()
  
  const [notifOpen, setNotifOpen] = useState(false)
  const [companyEditOpen, setCompanyEditOpen] = useState(false)
  const [slideoutPortalReady, setSlideoutPortalReady] = useState(false)

  const [profileData, setProfileData] = useState({
    name: "David Chen",
    role: "Project Manager",
    region: "north-america",
    language: "en",
    image: undefined as string | undefined,
  })

  useEffect(() => {
    setSlideoutPortalReady(true)
  }, [])

  // Load profile from localStorage
  useEffect(() => {
    const storedProfile = localStorage.getItem("ngx_user_profile")
    if (storedProfile) {
      try {
        setProfileData(JSON.parse(storedProfile))
      } catch {
        // Keep defaults
      }
    }
  }, [])

  const handleProfileSave = (data: {
    image?: string
    name: string
    role: string
    region: string
    language: string
  }) => {
    setProfileData(data)
    localStorage.setItem("ngx_user_profile", JSON.stringify(data))
    localStorage.setItem("user_language", data.language)
    localStorage.setItem("user_region", data.region)

    window.dispatchEvent(
      new CustomEvent("language-changed", {
        detail: { language: data.language, region: data.region },
      })
    )
  }

  const isCompanyHome = pathname === "/" || pathname === "/company"
  const initials = profileData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // Home icon: white when in company mode, orange when in project mode
  // Clicking always navigates to company home and clears project selection
  const handleHomeClick = () => {
    setCurrentProject(null) // Clear project selection, switches to company mode
    router.push("/")
  }

  return (
    <TooltipProvider>
      <header
        data-header="global"
        className="relative z-30 flex h-14 w-full min-w-0 flex-shrink-0 items-center overflow-hidden border-b border-asphalt-700 bg-asphalt-900"
      >
        {/* Left Section - Priority elements that should always be visible */}
        <div className="flex items-center flex-shrink-0">
          {/* Home Button - Black square area, fixed size, highest priority */}
          <div className="flex items-center justify-center bg-black w-14 h-14 flex-shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleHomeClick}
                  data-home-context={mode === "company" ? "company" : "project"}
                  className="h-10 w-10 flex items-center justify-center rounded-none transition-colors"
                >
                  <RiHomeFill className="h-5 w-5" style={{ color: "inherit" }} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Company Home</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Company logo: CSS `group-hover` only — avoids flicker when RAC tooltip steals hover from JS mouse handlers */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="group relative hidden h-14 w-[110px] flex-shrink-0 overflow-hidden rounded-none bg-asphalt-800 p-0 md:flex"
                onClick={() => setCompanyEditOpen(true)}
                aria-label="Edit company branding"
              >
                <Image
                  src={currentCompany.logo || DEFAULT_PROCORE_LOGO}
                  alt=""
                  width={110}
                  height={56}
                  className="h-full w-full object-contain transition-opacity duration-150 group-hover:opacity-50"
                />
                <span
                  className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  aria-hidden
                >
                  <RiPencilLine className="h-4 w-4 text-white" aria-hidden />
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-white">Edit</span>
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={8}>
              <p>Edit company branding</p>
            </TooltipContent>
          </Tooltip>

          {/* Divider */}
          <div className="w-px h-6 bg-asphalt-700 flex-shrink-0" />

          {/* Project Selector - High priority */}
          <div className="px-2 flex-shrink-0">
            <ProjectSelector />
          </div>

          <div className="w-px h-6 bg-asphalt-700 flex-shrink-0" />

          {/* Company Tools Dropdown - High priority */}
          <div className="px-2 flex-shrink-0">
            <CompanyToolsDropdown />
          </div>

          <div className="w-px h-6 bg-asphalt-700 flex-shrink-0" />

          {/* Favorite Tools Dropdown - High priority */}
          <div className="px-2 flex-shrink-0">
            <FavoriteToolsDropdown />
          </div>
        </div>

        {/* Center - Flexible spacer */}
        <div className="flex-1 min-w-0" />

        {/* Right Section - High priority icons that stay visible */}
        <div className="flex items-center flex-shrink-0">
          {/* Assist Search Bar - First in right section, only in project mode */}
          {mode === "project" && (
            <div className="px-2 hidden lg:block">
              <AssistSearchBar 
                assistOpen={assistOpen} 
                onAssistToggle={onAssistToggle} 
              />
            </div>
          )}

          {/* Apps Dropdown - Medium priority, hidden on smallest screens */}
          <div className="px-2 hidden md:block">
            <AppsDropdown />
          </div>

          <div className="w-px h-6 bg-asphalt-700 hidden md:block flex-shrink-0" />

          {/* Help - Medium priority */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="header-icon-btn h-9 w-9 flex items-center justify-center flex-shrink-0 hidden sm:flex rounded transition-colors">
                <RiQuestionFill className="h-5 w-5" style={{ color: "inherit" }} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="end"
              sideOffset={8}
              style={{
                width: 260,
                padding: "6px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
              }}
            >
              {[
                { icon: RiMessage2Line,          label: "Live Chat",                    highlight: true },
                { icon: RiCustomerService2Line,  label: "Support Center" },
                { icon: RiGroupLine,             label: "Procore Community" },
                { icon: RiPhoneLine,             label: "Contact Support" },
                { icon: RiLiveLine,              label: "Live Webinars" },
                { icon: RiPlayCircleLine,        label: "Quick How-To Training Videos" },
                { icon: RiLightbulbLine,         label: "Post an Idea" },
                { icon: RiMedalLine,             label: "Procore Certification" },
              ].map(({ icon: Icon, label, highlight }) => (
                <button
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "9px 10px",
                    borderRadius: 8,
                    border: "1px solid transparent",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <Icon style={{ width: 18, height: 18, color: "#334155", flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#0f172a", lineHeight: 1.4 }}>
                    {label}
                  </span>
                </button>
              ))}
            </PopoverContent>
          </Popover>

          {/* My Open Items - High priority */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="header-icon-btn h-9 w-9 flex items-center justify-center flex-shrink-0 rounded transition-colors">
                <RiFileList3Fill className="h-5 w-5" style={{ color: "inherit" }} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>My Open Items</p>
            </TooltipContent>
          </Tooltip>

          {/* Notifications — Untitled Button + tooltip (ngx-layout: icon-only control) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={
                  notifOpen
                    ? "header-icon-btn header-icon-btn--active relative h-9 w-9 flex-shrink-0 transition-colors duration-150"
                    : "header-icon-btn relative h-9 w-9 flex-shrink-0 text-white/75 transition-colors duration-150 hover:bg-transparent hover:text-white"
                }
                aria-label="Notifications"
                aria-expanded={notifOpen}
                onClick={() => setNotifOpen((o) => !o)}
              >
                <RiNotification3Fill className="h-5 w-5 shrink-0" />
                <span
                  className="header-notification-badge pointer-events-none absolute top-1.5 right-1.5 h-2 w-2 shrink-0 rounded-full"
                  aria-hidden
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>

          {/* Profile Avatar — same 56×56 chrome zone as home for symmetric edge padding */}
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center">
            <ProfileEditPopover
              trigger={
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    {profileData.image ? (
                      <AvatarImage src={profileData.image} alt={profileData.name} />
                    ) : (
                      <AvatarFallback className="bg-asphalt-600 text-white text-xs font-medium">
                        {initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              }
              onSave={handleProfileSave}
              initialData={profileData}
            />
          </div>
        </div>
      </header>

      {slideoutPortalReady ? (
        <>
          <NotificationSlideout open={notifOpen} onClose={() => setNotifOpen(false)} />
          <CompanyEditSlideout
            open={companyEditOpen}
            onClose={() => setCompanyEditOpen(false)}
            currentCompanyId={currentCompany.id}
          />
        </>
      ) : null}
    </TooltipProvider>
  )
}
