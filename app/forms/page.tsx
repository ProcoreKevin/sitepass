"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function FormsPage() {
  return (
    <ToolPageTemplate
      toolName="Forms"
      tabs={[
        { label: "All Forms", value: "all" },
        { label: "Templates", value: "templates" },
        { label: "Submitted", value: "submitted" },
        { label: "Drafts", value: "drafts" },
      ]}
    />
  )
}
