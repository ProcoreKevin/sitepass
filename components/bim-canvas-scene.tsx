"use client"

// This file is intentionally isolated — it is the ONLY file that statically
// imports @react-three/fiber and @react-three/drei. It is loaded exclusively
// via React.lazy() in bim-canvas.tsx, which means webpack never includes it
// in the SSR bundle and Node.js never evaluates it.
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Grid, Html } from "@react-three/drei"
import { Suspense } from "react"
import { BuildingModel } from "./building-model"
import { Loader2 } from "lucide-react"

interface BIMCanvasSceneProps {
  showLayers: {
    structure: boolean
    mechanical: boolean
    electrical: boolean
    plumbing: boolean
  }
  selectedElement: string | null
  onElementSelect: (id: string) => void
}

export function BIMCanvasScene({ showLayers, selectedElement, onElementSelect }: BIMCanvasSceneProps) {
  return (
    <Canvas camera={{ position: [50, 50, 50], fov: 60 }}>
      <Suspense
        fallback={
          <Html center>
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading BIM Model...</span>
            </div>
          </Html>
        }
      >
        <Environment preset="warehouse" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />

        <Grid
          args={[100, 100]}
          position={[0, 0, 0]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#a3a3a3"
          sectionSize={10}
          sectionThickness={1}
          sectionColor="#737373"
        />

        <BuildingModel
          showLayers={showLayers}
          onElementSelect={onElementSelect}
          selectedElement={selectedElement}
        />

        <OrbitControls enablePan enableZoom enableRotate maxPolarAngle={Math.PI / 2} />
      </Suspense>
    </Canvas>
  )
}
