"use client"

import { useEffect, useRef, useState } from "react"
import { X, ExternalLink, ArrowRight, MessageSquare, Mail, ChevronDown, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SlideOutPanelProps {
  isOpen: boolean
  onClose: () => void
  workspaceWidth: number
}

export function SlideOutPanel({ isOpen, onClose, workspaceWidth }: SlideOutPanelProps) {
  const [width, setWidth] = useState(37) // percentage of workspace
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)

  // Handle resize
  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!panelRef.current) return

      const panelRect = panelRef.current.getBoundingClientRect()
      const distanceFromRight = window.innerWidth - e.clientX
      const newWidthPx = distanceFromRight
      const newWidthPercent = (newWidthPx / workspaceWidth) * 100

      // If dragged beyond 67%, snap to 100%
      if (newWidthPercent > 67) {
        setWidth(100)
      } else if (newWidthPercent < 33) {
        // Minimum 33%
        setWidth(33)
      } else {
        setWidth(newWidthPercent)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing, workspaceWidth])

  const handleResizeStart = () => {
    setIsResizing(true)
    document.body.style.cursor = "ew-resize"
    document.body.style.userSelect = "none"
  }

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  const handleArrowClick = () => {
    if (width === 100) {
      // If at max width, return to default width
      setWidth(37)
    } else {
      // Otherwise, close the slideout
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Transparent scrim that blocks interactions */}
      <div
        className="fixed inset-0 z-40 bg-transparent"
        onClick={onClose}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      />

      {/* Slide-out panel */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 z-50 h-screen bg-background-primary shadow-md transition-transform duration-300 ease-in-out"
        style={{
          width: `${width}%`,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Resize handle on left edge */}
        <div
          ref={resizeHandleRef}
          className="absolute left-0 top-0 h-full w-1 cursor-ew-resize hover:bg-border-hover/20"
          onMouseDown={handleResizeStart}
        />

        {/* Panel content */}
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-default px-6 py-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-foreground-primary">A-02112</h2>
              <Badge variant="outline" className="bg-background-secondary">
                Published
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleArrowClick}>
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <h3 className="mb-6 text-xl font-medium text-foreground-primary">Level 2 Floor Plan - Retail/Podium</h3>

            {/* Drawing image */}
            <div
              className="mb-6 overflow-hidden rounded-lg border border-border-default bg-background-secondary"
              style={{ maxHeight: "260px" }}
            >
              <img
                src="/architectural-construction-floor-plan-blueprint.jpg"
                alt="Level 2 Floor Plan"
                className="h-auto w-full object-contain"
              />
            </div>

            {/* Current Revision and Date */}
            <div className="mb-6 grid grid-cols-2 gap-6">
              <div>
                <h4 className="mb-2 text-sm font-semibold text-foreground-primary">Current Revision</h4>
                <p className="text-base text-foreground-secondary">Revision 5</p>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold text-foreground-primary">Date</h4>
                <p className="text-base text-foreground-secondary">10/22/2025</p>
              </div>
            </div>

            {/* Author and Reviewer */}
            <div className="mb-6 grid grid-cols-2 gap-6">
              <div>
                <h4 className="mb-2 text-sm font-semibold text-foreground-primary">Author</h4>
                <p className="text-base text-foreground-secondary">T. Kim</p>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold text-foreground-primary">Reviewer</h4>
                <p className="text-base text-foreground-secondary">J. Morrison, AIA</p>
              </div>
            </div>

            {/* Related Drawings */}
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-semibold text-foreground-primary">Related Drawings</h4>
              <button className="flex w-full items-center justify-between rounded-lg border border-border-default bg-background-secondary px-4 py-3 text-left hover:bg-background-tertiary">
                <span className="text-sm text-foreground-primary">A-401: Level 2 Reflected Ceiling Plan</span>
                <ChevronDown className="h-4 w-4 text-foreground-secondary" />
              </button>
            </div>

            {/* Team */}
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-semibold text-foreground-primary">Team</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-foreground-primary">Architect: </span>
                    <span className="text-sm text-foreground-secondary">Taylor Kim (TechSystems)</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-foreground-primary">Reviewer: </span>
                    <span className="text-sm text-foreground-secondary">Jennifer Morrison, AIA (License CA-12847)</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-foreground-primary">QA/QC: </span>
                    <span className="text-sm text-foreground-secondary">Samuel Chen, AIA</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution */}
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-semibold text-foreground-primary">Distribution</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-foreground-primary">Owner: </span>
                    <span className="text-sm text-foreground-secondary">Harbor Point Development LLC (PDF)</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-foreground-primary">General Contractor: </span>
                    <span className="text-sm text-foreground-secondary">Bayside Construction Corp (PDF, DWG)</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-foreground-primary">Structural: </span>
                    <span className="text-sm text-foreground-secondary">Pacific Structural Group (DWG)</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-foreground-primary">MEP: </span>
                    <span className="text-sm text-foreground-secondary">TechSystems Engineering (PDF)</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky footer with utility buttons */}
          <div
            className="flex items-center justify-between border-t border-border-default px-6"
            style={{ minHeight: "56px", maxHeight: "56px" }}
          >
            <Button variant="outline">Share</Button>
            <div className="flex gap-2">
              <Button variant="default">Markup</Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
