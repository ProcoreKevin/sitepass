"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function DocumentsPage() {
  return (
    <ToolPageTemplate
      toolName="Documents"
      tabs={[
        { label: "All Documents", value: "all" },
        { label: "Recent", value: "recent" },
        { label: "Shared with Me", value: "shared" },
        { label: "Recycle Bin", value: "recycle" },
      ]}
    />
  )
}
