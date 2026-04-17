"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function ObservationsPage() {
  return (
    <ToolPageTemplate
      toolName="Observations"
      tabs={[
        { label: "All Observations", value: "all" },
        { label: "Recycle Bin", value: "recycle" },
      ]}
    />
  )
}
