"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function ChangeOrdersPage() {
  return (
    <ToolPageTemplate
      toolName="Change Orders"
      tabs={[
        { label: "All Orders", value: "all" },
        { label: "Recycle Bin", value: "recycle" },
      ]}
    />
  )
}
