"use client"

import { cn } from "@/lib/utils"
import { JumboNavIcon } from "@/components/navigation/jumbo-nav-icon"
import { ToolMenuItem } from "./tool-menu-item"
import type { MenuSection as MenuSectionType, ToolDefinition } from "@/lib/tool-registry"

interface MenuSectionProps {
  section: MenuSectionType
  tools: ToolDefinition[]
  activeTool?: string
  onToolClick?: () => void
  className?: string
}

export function MenuSection({
  section,
  tools,
  activeTool,
  onToolClick,
  className,
}: MenuSectionProps) {
  const Icon = section.icon

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {/* Section header — 32px icon-scale art (same visual weight as Hero icons), Geist Mono label */}
      <div className="mb-2 flex items-center gap-2.5">
        {section.illustration ? (
          <JumboNavIcon src={section.illustration} />
        ) : (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center">
            <Icon className="h-8 w-8 text-primary" aria-hidden />
          </span>
        )}

        {/* Label — Geist Mono uppercase */}
        <span
          className="pt-0.5 text-[11px] font-bold uppercase leading-snug tracking-[0.06em] text-foreground-primary"
          style={{
            fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
          }}
        >
          {section.label}
        </span>
      </div>

      {/* Tools List */}
      <div className="flex flex-col gap-0">
        {tools.map((tool) => (
          <ToolMenuItem
            key={tool.id}
            tool={tool}
            isActive={activeTool === tool.id}
            onClick={onToolClick}
          />
        ))}
      </div>
    </div>
  )
}
