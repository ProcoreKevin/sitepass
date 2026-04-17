"use client"

import * as React from "react"
import { X, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

// Tool data structure
export interface Tool {
  name: string
  category: string
  type: string[]
  description: string
  icon: React.ReactNode
  isFavorite?: boolean
}

const toolIcons = {
  default: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  ),
}

const defaultTools: Tool[] = [
  {
    name: "Bidding",
    category: "Pre-Construction",
    type: [],
    description:
      "Streamline the bidding process with automated bid invitations and comparison tools for competitive pricing.",
    icon: toolIcons.default,
  },
  {
    name: "BIM Models",
    category: "Planning",
    type: [],
    description:
      "Get more done with model-based collaboration. Solve issues early and help reduce costly rework with tools that keep everyone aligned.",
    icon: toolIcons.default,
  },
  {
    name: "Budget",
    category: "Financial",
    type: ["financial"],
    description:
      "Monitor costs in real-time with detailed forecasting to maintain financial control throughout the project lifecycle.",
    icon: toolIcons.default,
  },
  {
    name: "Change Orders",
    category: "Financial",
    type: ["daily", "financial"],
    description:
      "Track and manage scope changes with complete cost visibility to protect project margins and maintain budget control.",
    icon: toolIcons.default,
  },
  {
    name: "Checklist",
    category: "Operations",
    type: [],
    description: "Create and manage custom checklists for consistent task completion and process standardization.",
    icon: toolIcons.default,
  },
  {
    name: "Commitments",
    category: "Financial",
    type: ["financial"],
    description:
      "Manage subcontractor agreements and purchase orders to ensure accurate cost tracking and payment processing.",
    icon: toolIcons.default,
  },
  {
    name: "Correspondence",
    category: "Communication",
    type: ["communication"],
    description: "Manage project emails and formal communications in one centralized, searchable repository.",
    icon: toolIcons.default,
  },
  {
    name: "Daily Log",
    category: "Daily Operations",
    type: ["daily"],
    description:
      "Capture and document all daily field activities, weather conditions, and site progress in real-time for complete project documentation.",
    icon: toolIcons.default,
  },
  {
    name: "Directory",
    category: "Communication",
    type: ["communication"],
    description:
      "Centralize contact information for all project stakeholders to improve communication and team coordination.",
    icon: toolIcons.default,
  },
  {
    name: "Document Management",
    category: "Planning",
    type: [],
    description:
      "Store and organize all project files in a centralized location with version control and access permissions.",
    icon: toolIcons.default,
  },
  {
    name: "Drawings",
    category: "Planning",
    type: [],
    description:
      "Access and mark up current project plans from any device to ensure teams work from the latest information.",
    icon: toolIcons.default,
  },
  {
    name: "Forms",
    category: "Operations",
    type: [],
    description: "Build and deploy custom digital forms to eliminate paper processes and improve data collection.",
    icon: toolIcons.default,
  },
  {
    name: "Head Count",
    category: "Operations",
    type: [],
    description: "Track workforce numbers and productivity to optimize labor allocation across project sites.",
    icon: toolIcons.default,
  },
  {
    name: "Incidents",
    category: "Safety",
    type: [],
    description:
      "Report and track safety incidents comprehensively to improve workplace safety and regulatory compliance.",
    icon: toolIcons.default,
  },
  {
    name: "Inspections",
    category: "Quality",
    type: [],
    description:
      "Conduct and track quality inspections with customizable checklists to maintain construction standards.",
    icon: toolIcons.default,
  },
  {
    name: "Instructors",
    category: "Training",
    type: [],
    description:
      "Manage training programs and certifications to ensure workforce competency and compliance requirements.",
    icon: toolIcons.default,
  },
  {
    name: "Meetings",
    category: "Communication",
    type: ["communication"],
    description:
      "Organize meeting agendas, minutes, and action items to ensure productive collaboration and accountability.",
    icon: toolIcons.default,
  },
  {
    name: "Observations",
    category: "Quality",
    type: [],
    description: "Record field observations and issues for proactive problem-solving and continuous improvement.",
    icon: toolIcons.default,
  },
  {
    name: "Photos",
    category: "Daily Operations",
    type: ["daily"],
    description:
      "Document visual progress and site conditions with organized photo management for better communication and dispute resolution.",
    icon: toolIcons.default,
  },
  {
    name: "Portfolio",
    category: "Analytics",
    type: [],
    description:
      "Monitor multiple projects simultaneously with executive-level dashboards for strategic decision-making.",
    icon: toolIcons.default,
  },
  {
    name: "Prime Contracts",
    category: "Financial",
    type: ["financial"],
    description:
      "Manage owner agreements and contract compliance to ensure all contractual obligations are met and tracked.",
    icon: toolIcons.default,
  },
  {
    name: "Punch List",
    category: "Quality",
    type: ["daily"],
    description:
      "Track and close out deficiencies efficiently to ensure quality standards are met before project completion.",
    icon: toolIcons.default,
  },
  {
    name: "Quality",
    category: "Quality",
    type: [],
    description:
      "Implement comprehensive quality control programs to ensure construction meets all standards and specifications.",
    icon: toolIcons.default,
  },
  {
    name: "Reports",
    category: "Analytics",
    type: [],
    description:
      "Generate powerful insights and dashboards to make data-driven decisions and track project performance metrics.",
    icon: toolIcons.default,
  },
  {
    name: "RFIs",
    category: "Communication",
    type: ["daily", "communication"],
    description:
      "Streamline information requests between teams to resolve questions quickly and keep projects moving forward without delays.",
    icon: toolIcons.default,
  },
  {
    name: "Safety",
    category: "Daily Operations",
    type: ["daily"],
    description:
      "Manage safety programs, incidents, and compliance to create a safer work environment and reduce project risks.",
    icon: toolIcons.default,
  },
  {
    name: "Schedule",
    category: "Planning",
    type: ["daily"],
    description:
      "Monitor project timelines and critical path activities to ensure on-time delivery and resource optimization.",
    icon: toolIcons.default,
  },
  {
    name: "Specifications",
    category: "Planning",
    type: [],
    description:
      "Manage technical specifications and requirements to ensure all work meets project standards and codes.",
    icon: toolIcons.default,
  },
  {
    name: "Submittals",
    category: "Communication",
    type: ["communication"],
    description:
      "Manage approval workflows efficiently to ensure all materials and equipment meet project specifications before installation.",
    icon: toolIcons.default,
  },
  {
    name: "Texting",
    category: "Communication",
    type: ["communication"],
    description: "Send instant text notifications to field teams for urgent updates and real-time communication.",
    icon: toolIcons.default,
  },
  {
    name: "Time Sheets",
    category: "Financial",
    type: ["financial"],
    description:
      "Track labor hours and costs accurately for better workforce management and certified payroll compliance.",
    icon: toolIcons.default,
  },
]

interface RichMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tools?: Tool[]
  onFavoriteToggle?: (toolName: string) => void
}

export function RichMenu({ open, onOpenChange, tools = defaultTools, onFavoriteToggle }: RichMenuProps) {
  const [activeTab, setActiveTab] = React.useState("all")
  const [localTools, setLocalTools] = React.useState<Tool[]>(tools)

  // Load favorites from localStorage on mount
  React.useEffect(() => {
    const storedFavorites = localStorage.getItem("ngx_tool_favorites")
    if (storedFavorites) {
      const favorites = JSON.parse(storedFavorites) as string[]
      setLocalTools((prevTools) =>
        prevTools.map((tool) => ({
          ...tool,
          isFavorite: favorites.includes(tool.name),
        })),
      )
    }
  }, [])

  const handleFavoriteToggle = (toolName: string) => {
    setLocalTools((prevTools) => {
      const updatedTools = prevTools.map((tool) =>
        tool.name === toolName ? { ...tool, isFavorite: !tool.isFavorite } : tool,
      )

      // Save to localStorage
      const favorites = updatedTools.filter((t) => t.isFavorite).map((t) => t.name)
      localStorage.setItem("ngx_tool_favorites", JSON.stringify(favorites))

      // Dispatch custom event to notify other components
      window.dispatchEvent(
        new CustomEvent("tool-favorite-toggled", {
          detail: { toolName, isFavorite: updatedTools.find((t) => t.name === toolName)?.isFavorite },
        }),
      )

      // Notify parent component
      onFavoriteToggle?.(toolName)

      return updatedTools
    })
  }

  const filteredTools = React.useMemo(() => {
    if (activeTab === "all") return localTools
    if (activeTab === "favorites") return localTools.filter((t) => t.isFavorite)
    return localTools.filter((t) => t.type.includes(activeTab))
  }, [activeTab, localTools])

  const favoriteCount = localTools.filter((t) => t.isFavorite).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="items-stretch justify-stretch bg-black/50 p-[5%]"
        modalClassName="flex h-full min-h-0 w-full max-w-none flex-1"
        className={cn(
          "flex max-h-full min-h-0 w-full max-w-none flex-col gap-0 overflow-hidden border bg-background p-0 shadow-xl sm:rounded-lg",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-default px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground-primary">Project Management Tools</h2>
            <p className="text-sm text-foreground-secondary mt-1">
              Comprehensive tool suite for construction projects
            </p>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="border-b border-border-default px-6">
            <TabsList className="h-12 bg-transparent">
              <TabsTrigger value="all">All Tools ({localTools.length})</TabsTrigger>
              <TabsTrigger value="favorites">Favorites ({favoriteCount})</TabsTrigger>
              <TabsTrigger value="daily">Daily Use</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0 min-h-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredTools.map((tool) => (
                    <ToolCard key={tool.name} tool={tool} onFavoriteToggle={() => handleFavoriteToggle(tool.name)} />
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

interface ToolCardProps {
  tool: Tool
  onFavoriteToggle: () => void
}

function ToolCard({ tool, onFavoriteToggle }: ToolCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-border-default p-4 bg-background",
        "hover:border-border-hover transition-colors",
      )}
    >
      {/* Category */}
      <div className="text-xs font-semibold text-foreground-secondary uppercase tracking-wide mb-2">
        {tool.category}
      </div>

      {/* Name with Icon */}
      <div className="flex items-center gap-2 mb-3">
        <div className="text-foreground-secondary flex-shrink-0">{tool.icon}</div>
        <h3 className="text-lg font-bold text-foreground-primary">{tool.name}</h3>
      </div>

      {/* Description */}
      <p className="text-sm text-foreground-secondary mb-4 line-clamp-3">{tool.description}</p>

      <Button
        variant={tool.isFavorite ? "outline" : "secondary"}
        size="sm"
        onClick={onFavoriteToggle}
        className="w-full gap-2"
      >
        <Star className={cn("h-4 w-4", tool.isFavorite && "fill-current")} />
        {tool.isFavorite ? "Remove Favorite" : "Add to Favorites"}
      </Button>
    </div>
  )
}
