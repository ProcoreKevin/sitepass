"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

import {
  Home,
  BarChart3,
  MessageSquare,
  Search,
  ChevronDown,
  ChevronRight,
  Star,
  Shield,
  Gavel,
  Box,
  DollarSign,
  FileEdit,
  FileText,
  GitPullRequest,
  Wrench,
  Users,
  Calendar,
  CreditCard,
  FolderOpen,
  FileImage,
  Mail,
  Truck,
  ClipboardList,
  AlertCircle,
  Receipt,
  Eye,
  Video,
  Camera,
  FileCheck,
  ListChecks,
  HelpCircle,
  CalendarClock,
  Upload,
  CheckSquare,
  Clock,
  Send,
  Ticket,
  MessageCircle,
  Target,
  Activity,
  LineChart,
  GitBranch,
  Link,
  Grid,
  Lock,
  MapPin,
  Calculator,
} from "lucide-react"
import { CloseButton } from "@/components/ui/close-button"
import { ProcoreLogo } from "@/components/ui/procore-logo"
import { spacing } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

// Navigation Categories - validated topical structure
const NAVIGATION_CATEGORIES = [
  {
    id: "field-design",
    label: "Field & Design",
    tools: [
      { icon: Home, label: "Project Overview", href: "/" },
      { icon: FileImage, label: "Drawings", href: "/drawings" },
      { icon: FileText, label: "Specifications", href: "/specifications" },
      { icon: Box, label: "BIM/Models", href: "/bim-models" },
      { icon: Wrench, label: "Coordination Issues", href: "/coordination-issues" },
      { icon: FileCheck, label: "Planroom", href: "/planroom" },
      { icon: Camera, label: "Photos", href: "/photos" },
      { icon: Calendar, label: "Daily Log", href: "/daily-log" },
      { icon: Eye, label: "Inspections", href: "/inspections" },
      { icon: AlertCircle, label: "Incidents", href: "/incidents" },
      { icon: ListChecks, label: "Punch List", href: "/punch-list" },
      { icon: ClipboardList, label: "Forms", href: "/forms" },
      { icon: Eye, label: "Observations", href: "/observations" },
      /* No /locations route — land on project overview until dedicated page exists */
      { icon: MapPin, label: "Locations", href: "/project-home" },
    ],
  },
  {
    id: "project-coordination",
    label: "Project Coordination",
    tools: [
      { icon: Target, label: "Action Plans", href: "/action-plans" },
      { icon: HelpCircle, label: "RFIs", href: "/rfis" },
      { icon: Upload, label: "Submittals", href: "/submittals" },
      { icon: Mail, label: "Correspondence", href: "/correspondence" },
      { icon: MessageCircle, label: "Site Instructions", href: "/instructions" },
      { icon: Video, label: "Meetings", href: "/meetings" },
      { icon: Send, label: "Transmittals", href: "/transmittals" },
      { icon: MessageSquare, label: "Conversations", href: "/correspondence" },
      { icon: Mail, label: "Emails", href: "/emails" },
      { icon: CheckSquare, label: "Tasks", href: "/action-plans" },
      { icon: CalendarClock, label: "Schedule", href: "/schedule" },
    ],
  },
  {
    id: "financials-contracts",
    label: "Financials & Contracts",
    tools: [
      { icon: FileEdit, label: "Change Events", href: "/change-events" },
      { icon: FileText, label: "Change Orders", href: "/change-orders" },
      { icon: HelpCircle, label: "RFQ", href: "/bidding" },
      { icon: FileCheck, label: "Prime Contracts", href: "/prime-contracts" },
      { icon: FileText, label: "Head Contract Variations", href: "/change-orders" },
      { icon: GitPullRequest, label: "Commitments/POs", href: "/commitments" },
      { icon: FileText, label: "Subcontract Variations", href: "/commitments" },
      { icon: CreditCard, label: "Direct Costs", href: "/direct-costs" },
      { icon: DollarSign, label: "Budget", href: "/budget" },
      { icon: Receipt, label: "Invoicing", href: "/invoicing" },
      { icon: CreditCard, label: "Pay", href: "/invoicing" },
      { icon: Calculator, label: "Estimating", href: "/budget" },
      { icon: Gavel, label: "Bidding", href: "/bidding" },
      { icon: ClipboardList, label: "Prequalification", href: "/prequalifications" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    tools: [
      { icon: Users, label: "Workforce Planning", href: "/resource-planning" },
      { icon: Activity, label: "Resource Tracking", href: "/resource-planning" },
      { icon: Clock, label: "Timesheets", href: "/timesheets" },
      { icon: Users, label: "Crews", href: "/crews" },
      { icon: Ticket, label: "T&M Tickets", href: "/tm-tickets" },
      { icon: FileText, label: "Day Worksheets", href: "/timesheets" },
      { icon: Truck, label: "Equipment", href: "/equipment" },
    ],
  },
  {
    id: "administration",
    label: "Administration & Data",
    tools: [
      { icon: FolderOpen, label: "Directory", href: "/directory" },
      { icon: FileImage, label: "Documents", href: "/documents" },
      { icon: BarChart3, label: "Reports", href: "/reporting" },
      { icon: LineChart, label: "Analytics/Insights", href: "/analytics" },
      { icon: GitBranch, label: "Workflows", href: "/workflows" },
      { icon: Link, label: "ERP Integrations", href: "/erp" },
      { icon: Grid, label: "App Marketplace", href: "/apps" },
      { icon: Shield, label: "Admin/Configurations", href: "/admin" },
      { icon: Lock, label: "Permissions", href: "/permissions" },
    ],
  },
]

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
  disabled?: boolean
  loading?: boolean
  badge?: string | number
  onClick?: () => void
  href?: string
  className?: string
  variant?: "default" | "compact" | "expanded"
  size?: "sm" | "md" | "lg"
  showTooltip?: boolean
  tooltipContent?: string
  collapsed?: boolean
  hasDropdown?: boolean
  isOpen?: boolean
  onToggleDropdown?: () => void
  subItems?: Array<{ label: string; active?: boolean; onClick?: () => void }>
}

function NavItem({
  icon: Icon,
  label,
  active = false,
  disabled = false,
  loading = false,
  badge,
  onClick,
  className,
  showTooltip = false,
  tooltipContent,
  collapsed = false,
  hasDropdown = false,
  isOpen = false,
  onToggleDropdown,
  subItems = [],
}: NavItemProps) {
  const handleClick = () => {
    if (hasDropdown && onToggleDropdown) {
      onToggleDropdown()
    } else if (!disabled && !loading && onClick) {
      onClick()
    }
  }

  const buttonContent = (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={cn(
        "nav-menu-item group relative mx-0 my-0 flex w-full items-center text-left transition-all duration-ds-short ease-ds-standard",
        "bg-transparent",
        "focus:outline-none",
        "hover:bg-asphalt-800",
        active && "bg-asphalt-900",
        disabled && "opacity-50 cursor-not-allowed hover:bg-transparent",
        loading && "cursor-wait",
        collapsed && "justify-center",
        className,
      )}
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || loading}
      aria-expanded={hasDropdown ? isOpen : undefined}
      style={{
        padding: collapsed ? spacing.sm : `${spacing.sm} ${spacing.md}`,
        borderRadius: active ? "8px" : "6px",
        height: "40px",
        gap: collapsed ? "0" : "16px",
      }}
    >
      <Icon
        className={cn(
          "flex-shrink-0 w-5 h-5 transition-all duration-200 ease-in-out",
          !active && !disabled && "text-asphalt-400",
          !active && !disabled && "group-hover:text-white",
          active && "text-white",
          disabled && "text-asphalt-600",
        )}
        strokeWidth={1.5}
      />

      {!collapsed && (
        <>
          <span
            className={cn(
              "flex-1 truncate text-sm transition-all duration-ds-short ease-ds-standard",
              !active && !disabled && "text-asphalt-400",
              !active && !disabled && "group-hover:text-white",
              active && "text-white font-medium",
              disabled && "text-asphalt-600",
            )}
          >
            {label}
          </span>
        </>
      )}

      {/* Badge for notifications */}
      {badge && !collapsed && !hasDropdown && (
        <span
          className={cn(
            "mx-2 rounded-full px-2 py-0.5 text-xs transition-all duration-ds-short ease-ds-standard",
            active
              ? "bg-white/20 text-white"
              : "bg-asphalt-700 text-asphalt-300 group-hover:bg-asphalt-600 group-hover:text-white",
          )}
        >
          {badge}
        </span>
      )}

      {loading && !collapsed && (
        <div className="ml-auto">
          <div className="w-4 h-4 border-2 border-asphalt-700 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </button>
  )

  return (
    <div className="w-full">
      {collapsed || showTooltip ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              <p>{tooltipContent || label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        buttonContent
      )}

      {hasDropdown && isOpen && !collapsed && subItems.length > 0 && (
        <div className="mt-1 ml-8 space-y-1">
          {subItems.map((subItem, index) => (
            <button
              key={index}
              onClick={subItem.onClick}
              className={cn(
                "w-full rounded-md px-3 py-2 text-left transition-all duration-ds-short ease-ds-standard focus:outline-none",
                "text-sm",
                subItem.active
                  ? "text-white bg-asphalt-800 font-medium"
                  : "text-asphalt-400 hover:text-white hover:bg-asphalt-800",
              )}
            >
              {subItem.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    NAVIGATION_CATEGORIES.map((c) => c.id) // All expanded by default
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [lastToggledTool, setLastToggledTool] = useState<{ name: string; isFavorite: boolean } | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const storedFavorites = localStorage.getItem("ngx_tool_favorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    } else {
      const defaultFavorites = ["Coordination Issues"]
      setFavorites(defaultFavorites)
      localStorage.setItem("ngx_tool_favorites", JSON.stringify(defaultFavorites))
    }
  }, [])

  useEffect(() => {
    if (lastToggledTool) {
      window.dispatchEvent(
        new CustomEvent("tool-favorite-toggled", {
          detail: { toolName: lastToggledTool.name, isFavorite: lastToggledTool.isFavorite },
        }),
      )
      setLastToggledTool(null)
    }
  }, [lastToggledTool])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    )
  }

  const toggleFavorite = (toolName: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(toolName) ? prev.filter((f) => f !== toolName) : [...prev, toolName]
      localStorage.setItem("ngx_tool_favorites", JSON.stringify(newFavorites))
      setLastToggledTool({ name: toolName, isFavorite: newFavorites.includes(toolName) })
      return newFavorites
    })
  }

  // Filter categories and tools based on search
  const filteredCategories = searchQuery
    ? NAVIGATION_CATEGORIES.map((category) => ({
        ...category,
        tools: category.tools.filter((tool) =>
          tool.label.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((category) => category.tools.length > 0)
    : NAVIGATION_CATEGORIES

  // Get all tools flat for quick access section (favorites)
  const allTools = NAVIGATION_CATEGORIES.flatMap((c) => c.tools)
  const favoriteTools = allTools.filter((tool) => favorites.includes(tool.label))

  return (
    <div
      className="flex flex-col h-full transition-all duration-300 ease-out bg-asphalt-900 fixed top-0 left-0 z-50"
      style={{
        width: isOpen ? "240px" : "0px",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Logo + Close Button */}
      <div
        className="flex items-center justify-between transition-all duration-300 ease-out px-4"
        style={{ height: "56px" }}
      >
        <div className="transition-all duration-300 ease-out transform">
          {isOpen ? (
            <div className="transition-all duration-300 ease-out transform scale-100 opacity-100">
              <ProcoreLogo variant="dark" size="sm" />
            </div>
          ) : (
            <div className="transition-all duration-300 ease-out transform scale-100 opacity-0">
              <ProcoreLogo variant="dark" size="sm" />
            </div>
          )}
        </div>
        {isOpen && onClose && (
          <CloseButton theme="dark" size="sm" label="Close sidebar" onPress={onClose} />
        )}
      </div>

      {/* Main Navigation */}
      <div
        className="flex-1 transition-all duration-300 ease-out overflow-y-auto"
        style={{ padding: isOpen ? spacing.xs : "0" }}
      >
        {/* Search */}
        {isOpen && (
          <div className="mb-4 px-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-asphalt-400" />
              <input
                type="text"
                placeholder="Search Project Tools"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-asphalt-800 text-asphalt-100 text-sm rounded-md border border-asphalt-700 focus:outline-none focus:border-asphalt-400 focus:ring-1 focus:ring-asphalt-500 transition-all"
              />
            </div>
          </div>
        )}

        {/* Favorites Section */}
        {isOpen && favoriteTools.length > 0 && !searchQuery && (
          <div className="mb-4">
            <div className="px-3 py-2 text-xs font-medium text-asphalt-500 uppercase tracking-wider">
              Favorites
            </div>
            <div className="space-y-0.5">
              {favoriteTools.map((tool) => {
                const isActive = pathname === tool.href
                return (
                  <div key={`fav-${tool.label}`} className="relative group">
                    <NavItem
                      icon={tool.icon}
                      label={tool.label}
                      active={isActive}
                      onClick={() => router.push(tool.href)}
                      collapsed={false}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Category Navigation */}
        {isOpen && (
          <div className="space-y-1">
            {filteredCategories.map((category) => {
              const isExpanded = expandedCategories.includes(category.id) || searchQuery.length > 0
              const hasActiveChild = category.tools.some((tool) => pathname === tool.href)

              return (
                <div key={category.id}>
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      "w-full flex items-center justify-between py-2 px-3 text-xs font-medium uppercase tracking-wider transition-colors",
                      hasActiveChild ? "text-asphalt-200" : "text-asphalt-500 hover:text-asphalt-300"
                    )}
                  >
                    <span>{category.label}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>

                  {/* Category Tools */}
                  {isExpanded && (
                    <div className="space-y-0.5 mb-2">
                      {category.tools.map((tool) => {
                        const isFavorite = favorites.includes(tool.label)
                        const isActive = pathname === tool.href

                        return (
                          <div key={tool.label} className="relative group">
                            <NavItem
                              icon={tool.icon}
                              label={tool.label}
                              active={isActive}
                              onClick={() => router.push(tool.href)}
                              collapsed={false}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(tool.label)
                              }}
                              className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Star
                                className={cn(
                                  "w-4 h-4 transition-colors",
                                  isFavorite
                                    ? "fill-yellow-500 text-yellow-500"
                                    : "text-asphalt-400 hover:text-yellow-500"
                                )}
                              />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
