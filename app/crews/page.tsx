"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function CrewsPage() {
  return (
    <ToolPageTemplate
      toolName="Crews"
      tabs={[
        { label: "All Crews", value: "all" },
        { label: "Active", value: "active" },
        { label: "On Site", value: "onsite" },
        { label: "Scheduled", value: "scheduled" },
      ]}
    />
  )
}
