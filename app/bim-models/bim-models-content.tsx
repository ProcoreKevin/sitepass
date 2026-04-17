"use client"

import { useState } from "react"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DrawingCardMenu,
  DrawingCardMenuTrigger,
  DrawingCardMenuContent,
  DrawingCardMenuItem,
} from "@/components/drawing-card-menu"
import dynamic from "next/dynamic"

// Dynamic import with ssr:false is effective here because THIS file is itself
// only ever loaded via dynamic() from a Server Component page — so webpack never
// evaluates this module graph during SSR.
const BIMViewerModal = dynamic(
  () => import("@/components/bim-viewer-modal").then((m) => m.BIMViewerModal),
  { ssr: false }
)

type BIMModel = {
  id: string
  project: string
  revision: string
  discipline: string
  lod: string
  size: string
  software: string
  thumbnail: string
}

const BIM_MODELS: BIMModel[] = [
  {
    id: "VTX-VER-DR-00-A-100",
    project: "Building B2 - Foundation & Podium",
    revision: "REVISION #11",
    discipline: "Structural",
    lod: "350",
    size: "487 MB",
    software: "Revit 2025",
    thumbnail: "/structural-bim-model-foundation-podium.jpg",
  },
  {
    id: "TCT-MEP-TWR-L15-20-R08",
    project: "Tech Campus Tower A",
    revision: "REVISION #11",
    discipline: "MEP - Mechanical & Plumbing",
    lod: "400",
    size: "892 MB",
    software: "Navisworks",
    thumbnail: "/mep-bim-model-tech-campus-tower.jpg",
  },
  {
    id: "NSD-ARC-RBC-ALL-R23",
    project: "Northgate Shopping District - Block C",
    revision: "REVISION #01",
    discipline: "Architecture",
    lod: "500",
    size: "623 MB",
    software: "ArchiCAD 28",
    thumbnail: "/architecture-bim-model-shopping-district.jpg",
  },
  {
    id: "MLE-FED-STP-SITE-R41",
    project: "Metro Line Extension - Station Plaza",
    revision: "REVISION #11",
    discipline: "Federated - Multi-discipline",
    lod: "300",
    size: "2 GB",
    software: "Navisworks 2025",
    thumbnail: "/federated-bim-model-metro-station.jpg",
  },
  {
    id: "VTX-VER-DR-00-A-100",
    project: "Building B2 - Foundation & Podium",
    revision: "REVISION #11",
    discipline: "Structural",
    lod: "350",
    size: "487 MB",
    software: "Revit 2025",
    thumbnail: "/structural-bim-model-foundation-podium.jpg",
  },
  {
    id: "TCT-MEP-TWR-L15-20-R08",
    project: "Tech Campus Tower A",
    revision: "REVISION #11",
    discipline: "MEP - Mechanical & Plumbing",
    lod: "400",
    size: "892 MB",
    software: "Navisworks",
    thumbnail: "/mep-bim-model-tech-campus-tower.jpg",
  },
  {
    id: "NSD-ARC-RBC-ALL-R23",
    project: "Northgate Shopping District - Block C",
    revision: "REVISION #01",
    discipline: "Architecture",
    lod: "500",
    size: "623 MB",
    software: "ArchiCAD 28",
    thumbnail: "/architecture-bim-model-shopping-district.jpg",
  },
  {
    id: "MLE-FED-STP-SITE-R41",
    project: "Metro Line Extension - Station Plaza",
    revision: "REVISION #11",
    discipline: "Federated - Multi-discipline",
    lod: "300",
    size: "2 GB",
    software: "Navisworks 2025",
    thumbnail: "/federated-bim-model-metro-station.jpg",
  },
]

export function BIMModelsContent() {
  const [selectedModel, setSelectedModel] = useState<BIMModel | null>(null)

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-border-default bg-background-primary px-6 py-4 border-b-0">
          <h1 className="text-2xl font-semibold text-foreground-primary">BIM Models</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-transparent">Share</Button>
            <Button>Download Plugin</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto p-6 py-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BIM_MODELS.map((model, index) => (
              <BIMModelCard
                key={`${model.id}-${index}`}
                {...model}
                onOpen={() => setSelectedModel(model)}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedModel && (
        <BIMViewerModal
          model={selectedModel}
          onClose={() => setSelectedModel(null)}
        />
      )}
    </>
  )
}

function BIMModelCard({
  id,
  project,
  revision,
  discipline,
  lod,
  size,
  software,
  thumbnail,
  onOpen,
}: BIMModel & { onOpen: () => void }) {
  return (
    <Card
      className="overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
      onClick={onOpen}
    >
      <div className="p-4 pb-3">
        <div className="mb-1 text-sm font-semibold text-foreground-primary">{id}</div>
        <div className="text-sm text-foreground-tertiary truncate">{project}</div>
      </div>

      <div className="relative w-full overflow-hidden bg-background-secondary" style={{ aspectRatio: "16/9" }}>
        <div className="absolute left-2 top-2 rounded bg-background-primary px-2 py-1 text-xs font-medium text-foreground-primary">
          {revision}
        </div>
        <DrawingCardMenu>
          <DrawingCardMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6 bg-background-primary hover:bg-background-secondary"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DrawingCardMenuTrigger>
          <DrawingCardMenuContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <DrawingCardMenuItem>View</DrawingCardMenuItem>
            <DrawingCardMenuItem>Download</DrawingCardMenuItem>
            <DrawingCardMenuItem>Share</DrawingCardMenuItem>
            <DrawingCardMenuItem>Delete</DrawingCardMenuItem>
          </DrawingCardMenuContent>
        </DrawingCardMenu>
        <img
          src={thumbnail || "/placeholder.svg"}
          alt={project}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4 pt-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="font-medium text-foreground-primary">Discipline</div>
            <div className="text-foreground-tertiary">{discipline}</div>
          </div>
          <div>
            <div className="font-medium text-foreground-primary">LOD</div>
            <div className="text-foreground-tertiary">{lod}</div>
          </div>
          <div>
            <div className="font-medium text-foreground-primary">Size</div>
            <div className="text-foreground-tertiary">{size}</div>
          </div>
          <div>
            <div className="font-medium text-foreground-primary">Software</div>
            <div className="text-foreground-tertiary">{software}</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
