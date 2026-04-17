"use client"

import { useState } from "react"
import { RiArrowDownSLine, RiExternalLinkFill, RiApps2Fill } from "react-icons/ri"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface ThirdPartyApp {
  id: string
  name: string
  description: string
  icon: string
  url: string
  category: "productivity" | "communication" | "analytics" | "integration"
}

const THIRD_PARTY_APPS: ThirdPartyApp[] = [
  {
    id: "docusign",
    name: "DocuSign",
    description: "Electronic signatures",
    icon: "/apps/docusign.png",
    url: "https://docusign.com",
    category: "productivity",
  },
  {
    id: "bluebeam",
    name: "Bluebeam",
    description: "PDF markup & collaboration",
    icon: "/apps/bluebeam.png",
    url: "https://bluebeam.com",
    category: "productivity",
  },
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    description: "Team communication",
    icon: "/apps/teams.png",
    url: "https://teams.microsoft.com",
    category: "communication",
  },
  {
    id: "power-bi",
    name: "Power BI",
    description: "Business analytics",
    icon: "/apps/powerbi.png",
    url: "https://powerbi.microsoft.com",
    category: "analytics",
  },
  {
    id: "sage",
    name: "Sage Intacct",
    description: "Accounting & ERP",
    icon: "/apps/sage.png",
    url: "https://sage.com",
    category: "integration",
  },
  {
    id: "viewpoint",
    name: "Viewpoint",
    description: "Construction ERP",
    icon: "/apps/viewpoint.png",
    url: "https://viewpoint.com",
    category: "integration",
  },
]

export function AppsDropdown() {
  const [open, setOpen] = useState(false)

  const handleAppClick = (app: ThirdPartyApp) => {
    window.open(app.url, "_blank", "noopener,noreferrer")
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex flex-col items-start gap-0 rounded px-3 py-1.5 text-sm hover:bg-asphalt-800 transition-colors">
          <span className="text-xs text-asphalt-400">Apps</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">Select App</span>
            <RiArrowDownSLine className="h-4 w-4 text-asphalt-400" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-80 p-0 bg-white border-asphalt-200 shadow-lg"
        sideOffset={8}
      >
        {/* Header */}
        <div className="p-3 border-b border-asphalt-200">
          <h3 className="text-sm font-medium text-asphalt-900">Third-Party Apps</h3>
          <p className="text-xs text-asphalt-500 mt-0.5">Connected integrations</p>
        </div>

        {/* Apps Grid */}
        <div className="p-3 grid grid-cols-2 gap-2">
          {THIRD_PARTY_APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app)}
              className="flex items-start gap-3 p-3 rounded-lg bg-asphalt-50 hover:bg-asphalt-100 transition-colors text-left group"
            >
              <div className="h-10 w-10 rounded-lg bg-asphalt-200 flex items-center justify-center flex-shrink-0">
                <RiApps2Fill className="h-5 w-5 text-asphalt-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-asphalt-900 truncate">
                    {app.name}
                  </span>
                  <RiExternalLinkFill className="h-3 w-3 text-asphalt-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-xs text-asphalt-500 truncate block">
                  {app.description}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-asphalt-200">
          <button className="w-full text-sm text-asphalt-700 hover:text-asphalt-900 transition-colors text-center">
            Browse App Marketplace
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
