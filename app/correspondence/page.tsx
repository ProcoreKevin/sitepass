"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function CorrespondencePage() {
  return (
    <ToolPageTemplate
      toolName="Correspondence"
      tabs={[
        { label: "All Correspondence", value: "all" },
        { label: "Sent", value: "sent" },
        { label: "Received", value: "received" },
        { label: "Drafts", value: "drafts" },
      ]}
    />
  )
}
