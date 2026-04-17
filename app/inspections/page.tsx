"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function InspectionsPage() {
  return (
    <ToolPageTemplate
      toolName="Inspections"
      tabs={[
        { label: "All Inspections", value: "all" },
        { label: "Recycle Bin", value: "recycle" },
      ]}
    />
  )
}
