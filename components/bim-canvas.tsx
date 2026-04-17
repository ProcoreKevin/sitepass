"use client"

import { lazy, Suspense } from "react"

// BIMCanvasScene is loaded via React.lazy so that @react-three/fiber and
// @react-three/drei — which require WebGL — are never included in the SSR bundle.
const BIMCanvasScene = lazy(() =>
  import("./bim-canvas-scene").then((m) => ({ default: m.BIMCanvasScene }))
)

interface BIMCanvasProps {
  showLayers: {
    structure: boolean
    mechanical: boolean
    electrical: boolean
    plumbing: boolean
  }
  selectedElement: string | null
  onElementSelect: (id: string) => void
}

export function BIMCanvas(props: BIMCanvasProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center bg-background-secondary">
          <span className="text-sm text-foreground-tertiary">Loading 3D viewer...</span>
        </div>
      }
    >
      <BIMCanvasScene {...props} />
    </Suspense>
  )
}
