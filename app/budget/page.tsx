"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function BudgetPage() {
  return (
    <ToolPageTemplate
      toolName="Budget"
      tabs={[
        { label: "Overview", value: "overview" },
        { label: "Line Items", value: "items" },
      ]}
    />
  )
}
