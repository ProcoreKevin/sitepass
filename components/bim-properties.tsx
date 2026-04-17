"use client"

import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { ScrollArea } from "./ui/scroll-area"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Edit, Copy, ExternalLink } from "lucide-react"

interface BIMPropertiesProps {
  selectedElement: string | null
}

export function BIMProperties({ selectedElement }: BIMPropertiesProps) {
  if (!selectedElement) {
    return (
      <div className="w-80 bg-card border-l border-border flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">Select an element</p>
          <p className="text-xs mt-1">to view properties</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Properties</h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary">Structural</Badge>
          <Badge variant="outline">Concrete</Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Element Info */}
          <Card className="p-4">
            <h4 className="font-medium text-foreground mb-3">Element Information</h4>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Element ID</Label>
                <p className="text-sm font-mono">{selectedElement}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Type</Label>
                <p className="text-sm">Structural Column</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Family</Label>
                <p className="text-sm">Concrete-Rectangular-Column</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Level</Label>
                <p className="text-sm">Ground Floor</p>
              </div>
            </div>
          </Card>

          {/* Dimensions */}
          <Card className="p-4">
            <h4 className="font-medium text-foreground mb-3">Dimensions</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Width</Label>
                  <Input value="600 mm" className="h-8 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Depth</Label>
                  <Input value="600 mm" className="h-8 text-sm" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Height</Label>
                <Input value="3000 mm" className="h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Volume</Label>
                <p className="text-sm font-mono">1.08 m³</p>
              </div>
            </div>
          </Card>

          {/* Materials */}
          <Card className="p-4">
            <h4 className="font-medium text-foreground mb-3">Materials</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Concrete C30/37</span>
                <Badge variant="outline" className="text-xs">
                  Primary
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Steel Reinforcement</span>
                <Badge variant="outline" className="text-xs">
                  Secondary
                </Badge>
              </div>
              <Separator />
              <div className="text-xs text-muted-foreground">
                <p>Concrete: 2.4 m³</p>
                <p>Steel: 120 kg</p>
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card className="p-4">
            <h4 className="font-medium text-foreground mb-3">Location</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">X</Label>
                  <Input value="12.5" className="h-8 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Y</Label>
                  <Input value="8.2" className="h-8 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Z</Label>
                  <Input value="0.0" className="h-8 text-sm" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Rotation</Label>
                <Input value="0°" className="h-8 text-sm" />
              </div>
            </div>
          </Card>

          {/* Custom Parameters */}
          <Card className="p-4">
            <h4 className="font-medium text-foreground mb-3">Custom Parameters</h4>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Fire Rating</Label>
                <p className="text-sm">R120</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Load Capacity</Label>
                <p className="text-sm">2500 kN</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Installation Date</Label>
                <p className="text-sm">2024-03-15</p>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border">
        <Button className="w-full" size="sm" iconLeading={ExternalLink}>
          Open in Detail View
        </Button>
      </div>
    </div>
  )
}
