"use client"

import { Fragment, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
  showHome?: boolean
  separator?: "chevron" | "slash"
  size?: "sm" | "md"
}

// Tool name mappings for automatic breadcrumb generation
const TOOL_LABELS: Record<string, string> = {
  "/": "Home",
  "/rfis": "RFIs",
  "/submittals": "Submittals",
  "/drawings": "Drawings",
  "/specifications": "Specifications",
  "/bim-models": "BIM/Models",
  "/coordination-issues": "Coordination Issues",
  "/photos": "Photos",
  "/daily-log": "Daily Log",
  "/inspections": "Inspections",
  "/incidents": "Incidents",
  "/punch-list": "Punch List",
  "/forms": "Forms",
  "/observations": "Observations",
  "/locations": "Locations",
  "/action-plans": "Action Plans",
  "/meetings": "Meetings",
  "/transmittals": "Transmittals",
  "/conversations": "Conversations",
  "/emails": "Emails",
  "/tasks": "Tasks",
  "/schedule": "Schedule",
  "/change-events": "Change Events",
  "/change-orders": "Change Orders",
  "/commitments": "Commitments/POs",
  "/budget": "Budget",
  "/invoicing": "Invoicing",
  "/direct-costs": "Direct Costs",
  "/timesheets": "Timesheets",
  "/crews": "Crews",
  "/equipment": "Equipment",
  "/directory": "Directory",
  "/documents": "Documents",
  "/reports": "Reports",
  "/analytics": "Analytics",
  "/admin": "Admin",
  "/bidding": "Bidding",
  "/prime-contracts": "Prime Contracts",
  "/planroom": "Planroom",
  "/correspondence": "Correspondence",
  "/site-instructions": "Site Instructions",
  "/tm-tickets": "T&M Tickets",
  "/workforce-planning": "Workforce Planning",
  "/resource-tracking": "Resource Tracking",
  "/day-worksheets": "Day Worksheets",
  "/workflows": "Workflows",
  "/erp-integrations": "ERP Integrations",
  "/marketplace": "App Marketplace",
  "/permissions": "Permissions",
  "/rfq": "RFQ",
  "/head-contract-variations": "Head Contract Variations",
  "/subcontract-variations": "Subcontract Variations",
  "/pay": "Pay",
  "/estimating": "Estimating",
  "/prequalification": "Prequalification",
}

// Category mappings for path segments
const CATEGORY_LABELS: Record<string, string> = {
  "field-design": "Field & Design",
  "project-coordination": "Project Coordination",
  "financials-contracts": "Financials & Contracts",
  "resources": "Resources",
  "administration": "Administration & Data",
}

/**
 * Generate breadcrumb items from pathname
 */
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean)
  const items: BreadcrumbItem[] = []
  
  let currentPath = ""
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    currentPath += `/${segment}`
    
    // Check if this is a known tool path
    const label = TOOL_LABELS[currentPath] || CATEGORY_LABELS[segment] || formatSegment(segment)
    
    // Last segment doesn't get a link
    const isLast = i === segments.length - 1
    
    items.push({
      label,
      href: isLast ? undefined : currentPath,
    })
  }
  
  return items
}

/**
 * Format a URL segment into a readable label
 */
function formatSegment(segment: string): string {
  // Handle dynamic segments like [id]
  if (segment.startsWith("[") && segment.endsWith("]")) {
    return segment.slice(1, -1).toUpperCase()
  }
  
  // Convert kebab-case to Title Case
  return segment
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function Breadcrumbs({ 
  items, 
  className,
  showHome = true,
  separator = "chevron",
  size = "sm"
}: BreadcrumbsProps) {
  const pathname = usePathname()
  
  // Auto-generate breadcrumbs if not provided
  const breadcrumbItems = useMemo(() => {
    if (items) return items
    return generateBreadcrumbs(pathname)
  }, [items, pathname])
  
  // Don't render if we're on home and there are no items
  if (pathname === "/" && breadcrumbItems.length === 0) {
    return null
  }
  
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm"
  }
  
  const SeparatorComponent = separator === "chevron" 
    ? () => <ChevronRight className={cn("flex-shrink-0 text-foreground-tertiary", size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
    : () => <span className="text-foreground-tertiary">/</span>

  return (
    <nav 
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1.5", sizeClasses[size], className)}
    >
      {showHome && pathname !== "/" && (
        <>
          <Link 
            href="/"
            className="flex items-center gap-1 text-foreground-secondary hover:text-foreground-primary transition-colors"
          >
            <Home className={cn("flex-shrink-0", size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
            <span className="sr-only">Home</span>
          </Link>
          {breadcrumbItems.length > 0 && <SeparatorComponent />}
        </>
      )}
      
      {breadcrumbItems.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && <SeparatorComponent />}
          
          {item.href ? (
            <Link 
              href={item.href}
              className="text-foreground-secondary hover:text-foreground-primary transition-colors truncate max-w-[150px]"
            >
              {item.icon && <item.icon className={cn("inline mr-1", size === "sm" ? "h-3 w-3" : "h-4 w-4")} />}
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground-primary font-medium truncate max-w-[200px]">
              {item.icon && <item.icon className={cn("inline mr-1", size === "sm" ? "h-3 w-3" : "h-4 w-4")} />}
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}

/**
 * Hook to get breadcrumb items for the current page
 */
export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname()
  return useMemo(() => generateBreadcrumbs(pathname), [pathname])
}
