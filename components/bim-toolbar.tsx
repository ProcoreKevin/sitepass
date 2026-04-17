"use client"

import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import {
  Box,
  Move3D,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Eye,
  Layers,
  Ruler,
  Settings,
  Save,
  Upload,
  Download,
  Cable as Cube,
  Building,
  Home,
} from "lucide-react"

interface BIMToolbarProps {
  viewMode: "3d" | "section" | "plan"
  setViewMode: (mode: "3d" | "section" | "plan") => void
  selectedElement: string | null
}

export function BIMToolbar({ viewMode, setViewMode, selectedElement }: BIMToolbarProps) {
  return (
    <div className="h-14 bg-card border-b border-border flex items-center px-4 gap-2">
      {/* File Operations */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm">
          <Upload className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Save className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* View Controls */}
      <div className="flex items-center gap-1">
        <Button variant={viewMode === "3d" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("3d")}>
          <Cube className="h-4 w-4 mr-1" />
          3D
        </Button>
        <Button variant={viewMode === "section" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("section")}>
          <Building className="h-4 w-4 mr-1" />
          Section
        </Button>
        <Button variant={viewMode === "plan" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("plan")}>
          <Home className="h-4 w-4 mr-1" />
          Plan
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Navigation Tools */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm">
          <Move3D className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Measurement Tools */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm">
          <Ruler className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Box className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Visibility Controls */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm">
          <Layers className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings */}
      <Button variant="ghost" size="sm">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  )
}
