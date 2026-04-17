"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function MeetingsPage() {
  return (
    <ToolPageTemplate
      toolName="Meetings"
      tabs={[
        { label: "All Meetings", value: "all" },
        { label: "Recycle Bin", value: "recycle" },
      ]}
    />
  )
}
