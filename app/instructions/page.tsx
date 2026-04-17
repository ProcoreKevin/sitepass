"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function InstructionsPage() {
  return (
    <ToolPageTemplate
      toolName="Instructions"
      tabs={[
        { label: "All Instructions", value: "all" },
        { label: "Active", value: "active" },
        { label: "Completed", value: "completed" },
        { label: "Templates", value: "templates" },
      ]}
    />
  )
}
