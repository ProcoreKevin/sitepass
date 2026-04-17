"use client"

import { useRouter } from "next/navigation"
import { RiStarLine, RiStarFill } from "react-icons/ri"
import { cn } from "@/lib/utils"
import { useNavigation } from "@/lib/navigation-context"
import type { ToolDefinition } from "@/lib/tool-registry"

interface ToolMenuItemProps {
  tool: ToolDefinition
  isActive?: boolean
  isMobileCritical?: boolean
  onClick?: () => void
  className?: string
}

export function ToolMenuItem({
  tool,
  isActive = false,
  onClick,
  className,
}: ToolMenuItemProps) {
  const router = useRouter()
  const { isFavorite, toggleFavorite } = useNavigation()
  const favorited = isFavorite(tool.id)

  const handleClick = () => {
    if (onClick) onClick()
    router.push(tool.path)
  }

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(tool.id)
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-1.5 w-full rounded px-1 py-1 transition-colors",
        "hover:bg-asphalt-50",
        isActive && "bg-asphalt-100",
        className
      )}
    >
      {/* Arrow + Tool name — clickable */}
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 flex-1 min-w-0 text-left"
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
      >
        {/* Arrow */}
        <span
          style={{
            fontSize: "13px",
            color: isActive ? "#0f172a" : "#475569",
            flexShrink: 0,
            fontWeight: 500,
          }}
        >
          →
        </span>
        {/* Name */}
        <span
          style={{
            fontSize: "14px",
            color: isActive ? "#0f172a" : "#334155",
            fontWeight: isActive ? 600 : 400,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {tool.name}
        </span>
      </button>

      {/* Star favorite toggle */}
      <button
        onClick={handleStarClick}
        aria-label={favorited ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
        className={cn(
          "flex-shrink-0 rounded p-0.5 transition-opacity",
          favorited ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        {favorited ? (
          <RiStarFill style={{ width: 14, height: 14, color: "#0f172a" }} />
        ) : (
          <RiStarLine style={{ width: 14, height: 14, color: "#94a3b8" }} />
        )}
      </button>
    </div>
  )
}
