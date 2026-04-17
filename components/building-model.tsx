"use client"
import { Box, Cylinder } from "@react-three/drei"

interface BuildingModelProps {
  showLayers: {
    structure: boolean
    mechanical: boolean
    electrical: boolean
    plumbing: boolean
  }
  onElementSelect: (elementId: string) => void
  selectedElement: string | null
}

export function BuildingModel({ showLayers, onElementSelect, selectedElement }: BuildingModelProps) {
  return (
    <group>
      {/* Foundation */}
      {showLayers.structure && (
        <Box args={[40, 2, 30]} position={[0, -1, 0]} onClick={() => onElementSelect("FOUNDATION_001")}>
          <meshStandardMaterial
            color={selectedElement === "FOUNDATION_001" ? "hsl(var(--bim-selected))" : "hsl(var(--bim-foundation))"}
          />
        </Box>
      )}

      {/* Structural Columns */}
      {showLayers.structure && (
        <>
          {Array.from({ length: 12 }, (_, i) => {
            const x = (i % 4) * 10 - 15
            const z = Math.floor(i / 4) * 10 - 10
            const elementId = `COLUMN_${String(i + 1).padStart(3, "0")}`

            return (
              <Cylinder
                key={elementId}
                args={[0.3, 0.3, 12]}
                position={[x, 6, z]}
                onClick={() => onElementSelect(elementId)}
              >
                <meshStandardMaterial
                  color={selectedElement === elementId ? "hsl(var(--bim-selected))" : "hsl(var(--bim-column))"}
                />
              </Cylinder>
            )
          })}
        </>
      )}

      {/* Floor Slabs */}
      {showLayers.structure && (
        <>
          {Array.from({ length: 3 }, (_, level) => (
            <Box
              key={`FLOOR_${level}`}
              args={[40, 0.3, 30]}
              position={[0, level * 4 + 2, 0]}
              onClick={() => onElementSelect(`FLOOR_${String(level + 1).padStart(3, "0")}`)}
            >
              <meshStandardMaterial
                color={
                  selectedElement === `FLOOR_${String(level + 1).padStart(3, "0")}`
                    ? "hsl(var(--bim-selected))"
                    : "hsl(var(--bim-floor))"
                }
              />
            </Box>
          ))}
        </>
      )}

      {/* Exterior Walls */}
      {showLayers.structure && (
        <>
          {/* Front and Back Walls */}
          <Box args={[40, 12, 0.3]} position={[0, 6, 15]} onClick={() => onElementSelect("WALL_EXT_001")}>
            <meshStandardMaterial
              color={selectedElement === "WALL_EXT_001" ? "hsl(var(--bim-selected))" : "hsl(var(--bim-wall))"}
            />
          </Box>
          <Box args={[40, 12, 0.3]} position={[0, 6, -15]} onClick={() => onElementSelect("WALL_EXT_002")}>
            <meshStandardMaterial
              color={selectedElement === "WALL_EXT_002" ? "hsl(var(--bim-selected))" : "hsl(var(--bim-wall))"}
            />
          </Box>

          {/* Side Walls */}
          <Box args={[0.3, 12, 30]} position={[20, 6, 0]} onClick={() => onElementSelect("WALL_EXT_003")}>
            <meshStandardMaterial
              color={selectedElement === "WALL_EXT_003" ? "hsl(var(--bim-selected))" : "hsl(var(--bim-wall))"}
            />
          </Box>
          <Box args={[0.3, 12, 30]} position={[-20, 6, 0]} onClick={() => onElementSelect("WALL_EXT_004")}>
            <meshStandardMaterial
              color={selectedElement === "WALL_EXT_004" ? "hsl(var(--bim-selected))" : "hsl(var(--bim-wall))"}
            />
          </Box>
        </>
      )}

      {/* Mechanical Systems - HVAC Ducts */}
      {showLayers.mechanical && (
        <>
          {Array.from({ length: 6 }, (_, i) => (
            <Box
              key={`DUCT_${i}`}
              args={[35, 0.5, 1]}
              position={[0, 11.5, (i - 2.5) * 4]}
              onClick={() => onElementSelect(`HVAC_DUCT_${String(i + 1).padStart(3, "0")}`)}
            >
              <meshStandardMaterial
                color={
                  selectedElement === `HVAC_DUCT_${String(i + 1).padStart(3, "0")}`
                    ? "hsl(var(--bim-selected))"
                    : "hsl(var(--bim-hvac))"
                }
              />
            </Box>
          ))}
        </>
      )}

      {/* Electrical Systems - Cable Trays */}
      {showLayers.electrical && (
        <>
          {Array.from({ length: 4 }, (_, i) => (
            <Box
              key={`CABLE_TRAY_${i}`}
              args={[38, 0.2, 0.5]}
              position={[0, 11, (i - 1.5) * 6]}
              onClick={() => onElementSelect(`CABLE_TRAY_${String(i + 1).padStart(3, "0")}`)}
            >
              <meshStandardMaterial
                color={
                  selectedElement === `CABLE_TRAY_${String(i + 1).padStart(3, "0")}`
                    ? "hsl(var(--bim-selected))"
                    : "hsl(var(--bim-electrical))"
                }
              />
            </Box>
          ))}
        </>
      )}

      {/* Plumbing Systems - Pipes */}
      {showLayers.plumbing && (
        <>
          {Array.from({ length: 8 }, (_, i) => (
            <Cylinder
              key={`PIPE_${i}`}
              args={[0.1, 0.1, 30]}
              position={[(i - 3.5) * 4, 10.5, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              onClick={() => onElementSelect(`PIPE_${String(i + 1).padStart(3, "0")}`)}
            >
              <meshStandardMaterial
                color={
                  selectedElement === `PIPE_${String(i + 1).padStart(3, "0")}`
                    ? "hsl(var(--bim-selected))"
                    : "hsl(var(--bim-plumbing))"
                }
              />
            </Cylinder>
          ))}
        </>
      )}
    </group>
  )
}
