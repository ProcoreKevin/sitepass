"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import {
  Camera,
  ImageIcon,
  Pencil,
  MapPin,
  Box,
  Layers,
  Undo2,
  Redo2,
  Download,
  Save,
  Share2,
  Settings,
  MoreVertical,
  X,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { AssistPanel } from "./assist-panel"

// Dynamically import the canvas so all Three.js code is never evaluated server-side
const BIMCanvas = dynamic(() => import("./bim-canvas").then(m => m.BIMCanvas), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-background-secondary">
      <span className="text-sm text-foreground-tertiary">Loading 3D viewer...</span>
    </div>
  ),
})

interface BIMViewerModalProps {
  model: {
    id: string
    project: string
    revision: string
    discipline: string
    lod: string
    size: string
    software: string
  }
  onClose: () => void
}

export function BIMViewerModal({ model, onClose }: BIMViewerModalProps) {
  const router = useRouter()
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [showProperties, setShowProperties] = useState(true)
  const [activeTab, setActiveTab] = useState<"all" | "related">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [assistOpen, setAssistOpen] = useState(false)
  const [showLayers, setShowLayers] = useState({
    structure: true,
    mechanical: true,
    electrical: true,
    plumbing: true,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setAssistOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleClose = () => {
    onClose()
    router.push("/bim-models")
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background-secondary">
      {/* Header */}
      <header className="h-12 bg-background-primary border-b border-border-default flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground-primary">
            {model.id} {model.revision}
          </span>
          <ChevronDown className="h-4 w-4 text-foreground-tertiary" />
        </div>

        <div className="flex-1 flex justify-center">
          <Button variant="outline" size="sm" onClick={() => setAssistOpen(!assistOpen)} className="gap-2">
            <span>Ask Assist</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
          <Avatar className="h-7 w-7">
            <AvatarImage src="/placeholder.svg?height=28&width=28" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          {/* Left Toolbar */}
          <div className="absolute left-4 top-4 z-40 flex flex-col gap-1 bg-background-primary rounded-lg shadow-lg p-1">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Camera className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Pencil className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <MapPin className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 bg-background-secondary">
              <Box className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Layers className="h-5 w-5" />
            </Button>
            <div className="h-px bg-border-default my-1" />
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Undo2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Redo2 className="h-5 w-5" />
            </Button>
          </div>

          {/* 3D Canvas */}
          <div className="h-full w-full">
            <BIMCanvas
              showLayers={showLayers}
              selectedElement={selectedElement}
              onElementSelect={setSelectedElement}
            />
          </div>

          {/* Minimap */}
          <div className="absolute bottom-4 left-4 z-40 bg-background-primary rounded-lg shadow-lg overflow-hidden border border-border-default">
            <img
              src="/architectural-floor-plan-minimap.jpg"
              alt="Floor plan minimap"
              className="w-40 h-30 object-cover"
            />
          </div>

          {/* Center Action Button */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40">
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-informative-600 hover:bg-informative-800 text-white shadow-lg"
            >
              <Box className="h-6 w-6" />
            </Button>
          </div>

          {/* Properties Panel */}
          {showProperties && (
            <div className="absolute top-4 right-4 w-96 bg-background-primary rounded-lg shadow-2xl z-50 border border-border-default">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-border-default">
                <h2 className="text-sm font-medium text-foreground-tertiary">Properties</h2>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <span className="text-lg leading-none">−</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowProperties(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Object Name */}
              <div className="px-4 py-3 border-b border-border-default">
                <h3 className="font-medium text-foreground-primary">{selectedElement || "Object name here"}</h3>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border-default">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === "all"
                      ? "text-foreground-primary border-b-2 border-foreground-primary"
                      : "text-foreground-tertiary hover:text-foreground-primary"
                  }`}
                >
                  All Properties
                </button>
                <button
                  onClick={() => setActiveTab("related")}
                  className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === "related"
                      ? "text-foreground-primary border-b-2 border-foreground-primary"
                      : "text-foreground-tertiary hover:text-foreground-primary"
                  }`}
                >
                  Related Items
                </button>
              </div>

              {/* Search Filter */}
              <div className="p-4 border-b border-border-default">
                <div className="relative">
                  <Input
                    placeholder="Filter by Keyword"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-8"
                  />
                </div>
              </div>

              {/* Content Area */}
              <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-32 h-24 mb-4 border-2 border-informative-600 rounded-lg relative">
                  <div className="absolute inset-2 border-t-2 border-informative-600" />
                </div>
                <h4 className="font-medium text-foreground-primary mb-2">No Properties Match Your Search</h4>
                <p className="text-sm text-foreground-tertiary">Please try again</p>
              </div>
            </div>
          )}

          {/* Right Toolbar */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 bg-background-primary rounded-lg shadow-lg p-1">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Box className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Layers className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Pencil className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <AssistPanel dock="embedded" isOpen={assistOpen} onClose={() => setAssistOpen(false)} />
      </div>
    </div>
  )
}
