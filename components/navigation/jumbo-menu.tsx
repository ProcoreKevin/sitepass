"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { MenuSection } from "./menu-section"
import { useNavigation } from "@/lib/navigation-context"
import { useRouter } from "next/navigation"
import {
  COMPANY_MENU_SECTIONS,
  PROJECT_MENU_SECTIONS,
  COMPANY_TOOLS,
  PROJECT_TOOLS,
  getToolsByIds,
  type MenuSection as MenuSectionType,
  type ToolDefinition,
} from "@/lib/tool-registry"
import { JumboNavIcon } from "@/components/navigation/jumbo-nav-icon"
import { RiSmartphoneFill } from "react-icons/ri"

interface JumboMenuProps {
  type: "company" | "project"
  activeTool?: string
  onClose?: () => void
  className?: string
}

// Find the first "new" badged tool from a set of tools
function getNewTool(tools: Record<string, ToolDefinition>): ToolDefinition | undefined {
  return Object.values(tools).find(t => t.badges?.includes("new"))
}

// NEW promo tile — shown as the last cell in the grid
function NewPromoTile({
  tool,
  onClose,
}: {
  tool: ToolDefinition
  onClose?: () => void
}) {
  const router = useRouter()

  return (
    <div
      className={cn(
        "relative flex min-h-[180px] flex-col gap-3 overflow-hidden rounded-xl p-4 pb-4 pt-5",
        "bg-secondary text-secondary-foreground",
      )}
    >
      {/* NEW badge */}
      <span
        className="text-[10px] font-bold uppercase tracking-[0.1em] text-foreground-tertiary"
        style={{
          fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
        }}
      >
        NEW
      </span>

      {/* Icon-scale art — 32px max, top-right (same contract as section headers) */}
      <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center">
        {tool.id === "connection-manager" ? (
          <JumboNavIcon src="/illustrations/connection-manager.png" />
        ) : (
          (() => {
            const Icon = tool.icon
            return <Icon className="h-8 w-8 shrink-0 text-primary" aria-hidden />
          })()
        )}
      </div>

      {/* Description */}
      <p className="mt-8 max-w-[80%] text-[13px] font-bold leading-snug text-foreground-primary">
        {tool.description || `Now available: ${tool.name}`}
      </p>

      {/* CTA link */}
      <button
        type="button"
        onClick={() => {
          if (onClose) onClose()
          router.push(tool.path)
        }}
        className="flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-left text-sm font-medium text-foreground-secondary"
      >
        <span className="text-foreground-primary">→</span>
        {tool.name}
      </button>
    </div>
  )
}

export function JumboMenu({
  type,
  activeTool,
  onClose,
  className,
}: JumboMenuProps) {
  const { hasPermission } = useNavigation()
  const tools = type === "company" ? COMPANY_TOOLS : PROJECT_TOOLS
  const sections = type === "company" ? COMPANY_MENU_SECTIONS : PROJECT_MENU_SECTIONS

  const menuConfig = useMemo(() => {
    return sections
      .map((section) => ({
        section,
        tools: getToolsByIds(section.tools).filter((tool) => hasPermission(tool.id)),
      }))
      .filter((item) => item.tools.length > 0)
  }, [sections, hasPermission])

  // Find the single "new" tool to feature in the promo tile
  const newTool = useMemo(() => getNewTool(tools), [tools])

  // Grid: 4 cols for company, 4 cols for project. Promo tile fills last slot.
  const colCount = type === "company" ? 4 : 4
  const menuWidth = type === "company" ? "900px" : "900px"

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border-default bg-card shadow-xl",
        className,
      )}
      style={{ width: menuWidth, maxWidth: "calc(100vw - 32px)" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
          gap: "0",
        }}
      >
        {menuConfig.map(({ section, tools: sectionTools }, idx) => {
          const isLast = idx === menuConfig.length - 1 && !newTool
          return (
            <div
              key={section.id}
              className={cn(
                "px-4 py-5",
                (idx + 1) % colCount !== 0 && "border-r border-border-default",
                idx < menuConfig.length - colCount && "border-b border-border-default",
              )}
            >
              <MenuSection
                section={section}
                tools={sectionTools}
                activeTool={activeTool}
                onToolClick={onClose}
              />
            </div>
          )
        })}

        {/* NEW promo tile — fills the remaining grid slot */}
        {newTool && (
          <div
            className={cn(
              "flex items-stretch p-4",
              menuConfig.length % colCount === 0 && "border-l border-border-default",
              menuConfig.length >= colCount && "border-t border-border-default",
            )}
          >
            <NewPromoTile tool={newTool} onClose={onClose} />
          </div>
        )}
      </div>
    </div>
  )
}

// Company-specific jumbo menu wrapper
export function CompanyJumboMenu({
  activeTool,
  onClose,
  className,
}: Omit<JumboMenuProps, "type">) {
  return (
    <JumboMenu
      type="company"
      activeTool={activeTool}
      onClose={onClose}
      className={className}
    />
  )
}

// Project-specific jumbo menu wrapper
export function ProjectJumboMenu({
  activeTool,
  onClose,
  className,
}: Omit<JumboMenuProps, "type">) {
  return (
    <JumboMenu
      type="project"
      activeTool={activeTool}
      onClose={onClose}
      className={className}
    />
  )
}
