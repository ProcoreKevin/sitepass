"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function PunchListPage() {
  return (
    <ToolPageTemplate
      toolName="Punch List"
      tabs={[
        { label: "All Items", value: "all" },
        { label: "Recycle Bin", value: "recycle" },
      ]}
    />
  )
}
