"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { RiArrowDownSLine } from "react-icons/ri"
import { CompanyJumboMenu, ProjectJumboMenu } from "./jumbo-menu"
import { useNavigation } from "@/lib/navigation-context"
import { PROJECT_TOOLS, COMPANY_TOOLS } from "@/lib/tool-registry"
import { createPortal } from "react-dom"

export function CompanyToolsDropdown() {
  const pathname = usePathname()
  const { mode } = useNavigation()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  // Ensure we only render portal on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle click outside to close
  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        menuRef.current && 
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  // Determine current tool from pathname
  const currentToolId = Object.values(mode === "company" ? COMPANY_TOOLS : PROJECT_TOOLS)
    .find((tool) => pathname === tool.path || pathname.startsWith(tool.path + "/"))?.id

  const currentToolName = currentToolId 
    ? (mode === "company" ? COMPANY_TOOLS : PROJECT_TOOLS)[currentToolId]?.name 
    : undefined

  const menuContent = open && mounted ? createPortal(
    <div 
      ref={menuRef}
      className="fixed left-1/2 -translate-x-1/2 z-50"
      style={{ top: "60px" }}
    >
      {mode === "company" ? (
        <CompanyJumboMenu 
          activeTool={currentToolId} 
          onClose={() => setOpen(false)} 
        />
      ) : (
        <ProjectJumboMenu 
          activeTool={currentToolId} 
          onClose={() => setOpen(false)} 
        />
      )}
    </div>,
    document.body
  ) : null

  return (
    <>
      <button 
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className="flex flex-col items-start gap-0 rounded px-2 py-1 text-sm hover:bg-asphalt-800 transition-colors whitespace-nowrap"
      >
        <span className="text-xs text-asphalt-400 leading-tight">
          {mode === "company" ? "Company Tools" : "Project Tools"}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-white font-semibold truncate max-w-[100px] leading-tight">
            {currentToolName || "Select Tool"}
          </span>
          <RiArrowDownSLine className="h-4 w-4 text-asphalt-400 flex-shrink-0" />
        </div>
      </button>
      {menuContent}
    </>
  )
}
