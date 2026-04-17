"use client"

import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { ScrollArea } from "./ui/scroll-area"
import { Badge } from "./ui/badge"
import { ChevronDown, ChevronRight, Building2, Zap, Wrench, Droplets } from "lucide-react"
import { useState } from "react"

interface BIMSidebarProps {
  showLayers: {
    structure: boolean
    mechanical: boolean
    electrical: boolean
    plumbing: boolean
  }
  setShowLayers: (layers: any) => void
  selectedElement: string | null
}

export function BIMSidebar({ showLayers, setShowLayers, selectedElement }: BIMSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    levels: true,
    systems: true,
    elements: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const toggleLayer = (layer: keyof typeof showLayers) => {
    setShowLayers({
      ...showLayers,
      [layer]: !showLayers[layer],
    })
  }

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Project Explorer</h2>
        <p className="text-sm text-muted-foreground">Commercial Office Building</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Building Levels */}
          <Card className="p-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start p-0 h-auto"
              onClick={() => toggleSection("levels")}
            >
              {expandedSections.levels ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              <Building2 className="h-4 w-4 mr-2" />
              Building Levels
            </Button>

            {expandedSections.levels && (
              <div className="mt-3 space-y-2 ml-6">
                {["Roof", "Level 5", "Level 4", "Level 3", "Level 2", "Ground Floor", "Basement"].map((level) => (
                  <div key={level} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{level}</span>
                    <Badge variant="secondary" className="text-xs">
                      {level === "Ground Floor" ? "Active" : "Hidden"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Building Systems */}
          <Card className="p-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start p-0 h-auto"
              onClick={() => toggleSection("systems")}
            >
              {expandedSections.systems ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              <Wrench className="h-4 w-4 mr-2" />
              Building Systems
            </Button>

            {expandedSections.systems && (
              <div className="mt-3 space-y-3 ml-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={showLayers.structure} onCheckedChange={() => toggleLayer("structure")} />
                    <Building2 className="h-4 w-4 text-[color:var(--color-construction-concrete)]" />
                    <span className="text-sm">Structure</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    847
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={showLayers.mechanical} onCheckedChange={() => toggleLayer("mechanical")} />
                    <Wrench className="h-4 w-4 text-[color:var(--color-construction-steel)]" />
                    <span className="text-sm">Mechanical</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    234
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={showLayers.electrical} onCheckedChange={() => toggleLayer("electrical")} />
                    <Zap className="h-4 w-4 text-[color:var(--color-construction-warning)]" />
                    <span className="text-sm">Electrical</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    156
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={showLayers.plumbing} onCheckedChange={() => toggleLayer("plumbing")} />
                    <Droplets className="h-4 w-4 text-primary" />
                    <span className="text-sm">Plumbing</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    89
                  </Badge>
                </div>
              </div>
            )}
          </Card>

          {/* Model Elements */}
          <Card className="p-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start p-0 h-auto"
              onClick={() => toggleSection("elements")}
            >
              {expandedSections.elements ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              Model Elements
            </Button>

            {expandedSections.elements && (
              <div className="mt-3 space-y-2 ml-6">
                {["Walls", "Floors", "Columns", "Beams", "Doors", "Windows"].map((element) => (
                  <div key={element} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{element}</span>
                    <Badge variant="outline" className="text-xs">
                      {Math.floor(Math.random() * 200) + 50}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
