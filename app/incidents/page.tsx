"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function IncidentsPage() {
  return (
    <ToolPageTemplate
      toolName="Incidents"
      tabs={[
        { label: "All Incidents", value: "all" },
        { label: "Open", value: "open" },
        { label: "Under Investigation", value: "investigation" },
        { label: "Closed", value: "closed" },
      ]}
    />
  )
}
