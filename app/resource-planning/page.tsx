"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function ResourcePlanningPage() {
  return (
    <ToolPageTemplate
      toolName="Resource Planning"
      tabs={[
        { label: "Overview", value: "overview" },
        { label: "By Resource", value: "resource" },
        { label: "By Project", value: "project" },
        { label: "Conflicts", value: "conflicts" },
      ]}
    />
  )
}
