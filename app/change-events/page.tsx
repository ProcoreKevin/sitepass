"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function ChangeEventsPage() {
  return (
    <ToolPageTemplate
      toolName="Change Events"
      tabs={[
        { label: "All Events", value: "all" },
        { label: "Recycle Bin", value: "recycle" },
      ]}
    />
  )
}
