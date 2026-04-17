"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RiArrowDownSLine, RiSearchLine, RiBuilding4Line, RiHome4Line } from "react-icons/ri"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useNavigation } from "@/lib/navigation-context"
import { cn } from "@/lib/utils"

export function ProjectSelector() {
  const router = useRouter()
  const { mode, currentCompany, currentProject, projects, setCurrentProject } = useNavigation()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectProject = (project: typeof projects[0]) => {
    setCurrentProject(project)
    setOpen(false)
    setSearchQuery("")
    // Navigate to project home when selecting a project
    router.push("/project-home")
  }

  const handleSelectCompany = () => {
    setCurrentProject(null)
    setOpen(false)
    setSearchQuery("")
    // Navigate to root when going back to company level
    router.push("/")
  }

  // Display text based on mode
  const displayLabel = mode === "company" ? currentCompany.name : currentCompany.name
  const displayValue = mode === "company" 
    ? "Select a Project" 
    : (currentProject?.name || "Select a Project")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex flex-col items-start gap-0 rounded px-2 py-1 text-sm hover:bg-asphalt-800 transition-colors whitespace-nowrap">
          <span className="text-xs text-asphalt-400 leading-tight">{displayLabel}</span>
          <div className="flex items-center gap-1">
            <span className="text-white font-semibold truncate max-w-[160px] leading-tight">{displayValue}</span>
            <RiArrowDownSLine className="h-4 w-4 text-asphalt-400 flex-shrink-0" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent 
        align="start" 
        className="w-80 p-0 bg-white border-asphalt-200 shadow-lg"
        sideOffset={8}
      >
        {/* Search */}
        <div className="p-3 border-b border-asphalt-200">
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <RiSearchLine
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "16px",
                height: "16px",
                color: "#94a3b8",
                pointerEvents: "none",
                flexShrink: 0,
              }}
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: "34px",
                paddingRight: "12px",
                paddingTop: "8px",
                paddingBottom: "8px",
                fontSize: "14px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Company Level Option */}
        <div className="p-2 border-b border-asphalt-200">
          <button
            onClick={handleSelectCompany}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors",
              mode === "company" && !currentProject
                ? "bg-asphalt-100 text-asphalt-900"
                : "text-asphalt-700 hover:bg-asphalt-100 hover:text-asphalt-900"
            )}
          >
            {/* Company icon with brand dot */}
            <div style={{ position: "relative", flexShrink: 0, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <RiHome4Line style={{ width: 16, height: 16, color: "#475569" }} />
              </div>
              <span style={{ position: "absolute", bottom: 0, right: 0, width: 8, height: 8, borderRadius: "50%", background: "var(--color-text-primary, #111827)", border: "1.5px solid white" }} />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-medium text-sm">{currentCompany.name}</span>
              <span className="text-xs text-asphalt-500">Company Level</span>
            </div>
          </button>
        </div>

        {/* Projects List */}
        <div className="max-h-64 overflow-y-auto p-2">
          {filteredProjects.length === 0 ? (
            <div className="px-3 py-4 text-sm text-asphalt-500 text-center">
              No projects found
            </div>
          ) : (
            filteredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleSelectProject(project)}
                className={cn(
                  "w-full flex items-start gap-3 px-3 py-2.5 rounded-md text-left transition-colors",
                  currentProject?.id === project.id
                    ? "bg-asphalt-100 text-asphalt-900"
                    : "text-asphalt-700 hover:bg-asphalt-100 hover:text-asphalt-900"
                )}
              >
                {/* Project icon with status dot */}
                <div style={{ position: "relative", flexShrink: 0, width: 28, height: 28, marginTop: 1 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <RiBuilding4Line style={{ width: 16, height: 16, color: "#475569" }} />
                  </div>
                  <span style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: project.statusColor,
                    border: "1.5px solid white",
                  }} />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-medium text-sm truncate">{project.name}</span>
                  <span className="text-xs text-asphalt-500">
                    {project.status} • {project.location}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
