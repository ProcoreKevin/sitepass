"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function PrimeContractsPage() {
  return (
    <ToolPageTemplate
      toolName="Prime Contracts"
      tabs={[
        { label: "All Contracts", value: "all" },
        { label: "Active", value: "active" },
        { label: "Draft", value: "draft" },
        { label: "Completed", value: "completed" },
      ]}
    />
  )
}
