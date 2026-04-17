"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { RiArrowDownSLine, RiStarFill, RiStarLine } from "react-icons/ri"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useNavigation } from "@/lib/navigation-context"
import { getToolById } from "@/lib/tool-registry"
import { cn } from "@/lib/utils"

export function FavoriteToolsDropdown() {
  const router = useRouter()
  const pathname = usePathname()
  const { favoriteTools, toggleFavorite, mode } = useNavigation()
  const [open, setOpen] = useState(false)

  // Get favorite tool definitions
  const favorites = favoriteTools
    .map((id) => getToolById(id))
    .filter((tool) => tool !== undefined)
    // Strictly filter to tools matching the active context
    .filter((tool) => tool.context === mode)

  // Current favorite tool based on pathname
  const currentFavorite = favorites.find(
    (tool) => pathname === tool.path || pathname.startsWith(tool.path + "/")
  )

  const handleSelectTool = (tool: NonNullable<ReturnType<typeof getToolById>>) => {
    router.push(tool.path)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex flex-col items-start gap-0 rounded px-2 py-1 text-sm hover:bg-asphalt-800 transition-colors whitespace-nowrap">
          <span className="text-xs text-asphalt-400 leading-tight">Favorite Tools</span>
          <div className="flex items-center gap-1">
            <span className="text-white font-semibold truncate max-w-[100px] leading-tight">
              {currentFavorite?.name || "Select Tool"}
            </span>
            <RiArrowDownSLine className="h-4 w-4 text-asphalt-400 flex-shrink-0" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent 
        align="start" 
        className="w-64 p-0 bg-white border-asphalt-200 shadow-lg"
        sideOffset={8}
      >
        {favorites.length === 0 ? (
          <div className="p-4 text-center">
            <RiStarFill className="h-8 w-8 text-asphalt-300 mx-auto mb-2" />
            <p className="text-sm text-asphalt-600">No favorite tools yet</p>
            <p className="text-xs text-asphalt-500 mt-1">
              Star tools from the Tools menu to add them here
            </p>
          </div>
        ) : (
          <div className="p-2">
            {favorites.map((tool) => {
              const Icon = tool.icon
              const isActive = pathname === tool.path || pathname.startsWith(tool.path + "/")
              
              return (
                <button
                  key={tool.id}
                  onClick={() => handleSelectTool(tool)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors",
                    isActive
                      ? "bg-asphalt-100 text-asphalt-900"
                      : "text-asphalt-700 hover:bg-asphalt-100 hover:text-asphalt-900"
                  )}
                >
                  <Icon className={cn(
                    "h-4 w-4 flex-shrink-0",
                    isActive ? "text-asphalt-900" : "text-asphalt-500"
                  )} />
                  <span className="flex-1 text-sm truncate">{tool.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(tool.id)
                    }}
                    aria-label={`Remove ${tool.name} from favorites`}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", borderRadius: "4px", display: "flex", alignItems: "center" }}
                  >
                    <RiStarFill style={{ width: 14, height: 14, color: "#0f172a" }} />
                  </button>
                </button>
              )
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
