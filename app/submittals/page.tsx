"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function SubmittalsPage() {
  return (
    <ToolPageTemplate
      toolName="Submittals"
      tabs={[
        { label: "All Submittals", value: "all" },
        { label: "Recycle Bin", value: "recycle" },
      ]}
    />
  )
}
