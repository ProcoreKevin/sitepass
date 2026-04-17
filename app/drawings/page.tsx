"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function DrawingsPage() {
  return (
    <ToolPageTemplate
      toolName="Drawings"
      tabs={[
        { label: "All Drawings", value: "all" },
        { label: "Recycle Bin", value: "recycle" },
      ]}
    />
  )
}
