"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function SchedulePage() {
  return (
    <ToolPageTemplate
      toolName="Schedule"
      tabs={[
        { label: "Gantt View", value: "gantt" },
        { label: "List View", value: "list" },
      ]}
    />
  )
}
