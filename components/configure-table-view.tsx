"use client"

import * as React from "react"
import { RichPopoverWithAutoAlign, RichPopoverContent, RichPopoverTrigger } from "@/components/rich-popover"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Settings } from "lucide-react"

interface ConfigureTableViewProps {
  onSave?: (columns: Record<string, boolean>) => void
}

export function ConfigureTableView({ onSave }: ConfigureTableViewProps) {
  const [columns, setColumns] = React.useState({
    location: true,
    assignee: false,
    ballInCourt: false,
    approval: false,
    priority: false,
    category: false,
    initiative: false,
    startDate: false,
    endDate: false,
    createdBy: false,
    updatedBy: false,
    dateOpened: false,
    dateClosed: false,
    riskLevel: false,
    estCost: false,
  })

  const handleToggle = (key: string) => {
    setColumns((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    onSave?.(columns)
    console.log("[v0] Saved table view configuration:", columns)
  }

  const columnLabels = {
    location: "Location",
    assignee: "Assignee",
    ballInCourt: "Ball In Court",
    approval: "Approval",
    priority: "Priority",
    category: "Category",
    initiative: "Initiative",
    startDate: "Start Date",
    endDate: "End Date",
    createdBy: "Created By",
    updatedBy: "Updated By",
    dateOpened: "Date Opened",
    dateClosed: "Date Closed",
    riskLevel: "Risk Level",
    estCost: "Est. Cost",
  }

  return (
    <RichPopoverWithAutoAlign>
      <RichPopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Settings className="h-4 w-4" />
          Configure
        </Button>
      </RichPopoverTrigger>
      <RichPopoverContent
        className="w-[420px]"
        stickyFooter={
          <Button onClick={handleSave} className="w-full">
            Save View
          </Button>
        }
      >
        <div className="space-y-6">
          <div>
            <h2 className="font-semibold text-base leading-4">Configure Table Views</h2>
            <p className="mt-2 text-sm text-muted-foreground">Set up custom views for Coordination Issues</p>
          </div>

          <div className="space-y-4">
            {Object.entries(columnLabels).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm">{label}</span>
                <Switch checked={columns[key as keyof typeof columns]} onCheckedChange={() => handleToggle(key)} />
              </div>
            ))}
          </div>
        </div>
      </RichPopoverContent>
    </RichPopoverWithAutoAlign>
  )
}
