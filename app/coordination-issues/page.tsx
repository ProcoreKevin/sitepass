"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function CoordinationIssuesPage() {
  return (
    <ToolPageTemplate
      toolName="Coordination Issues"
      tabs={[
        { label: "All Issues", value: "all" },
        { label: "Recycle Bin", value: "recycle" },
      ]}
    />
  )
}
