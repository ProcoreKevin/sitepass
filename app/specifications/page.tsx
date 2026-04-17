"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function SpecificationsPage() {
  return (
    <ToolPageTemplate
      toolName="Specifications"
      tabs={[
        { label: "All Specs", value: "all" },
        { label: "By Division", value: "division" },
        { label: "Recent", value: "recent" },
      ]}
    />
  )
}
