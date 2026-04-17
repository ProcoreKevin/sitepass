"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function DirectCostsPage() {
  return (
    <ToolPageTemplate
      toolName="Direct Costs"
      tabs={[
        { label: "All Direct Costs", value: "all" },
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "By Cost Code", value: "costcode" },
      ]}
    />
  )
}
