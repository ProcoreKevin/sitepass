"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function TransmittalsPage() {
  return (
    <ToolPageTemplate
        toolName="Transmittals"
        tabs={[
          { label: "All Transmittals", value: "all" },
          { label: "Sent", value: "sent" },
          { label: "Received", value: "received" },
          { label: "Drafts", value: "drafts" },
        ]}
      />
  )
}
