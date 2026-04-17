"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function AgentBuilderPage() {
  return (
    <ToolPageTemplate
      toolName="Agent Builder"
      tabs={[
        { label: "My Agents", value: "agents" },
        { label: "Templates", value: "templates" },
        { label: "Runs", value: "runs" },
        { label: "Settings", value: "settings" },
      ]}
    />
  )
}
