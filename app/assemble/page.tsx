"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function AssemblePage() {
  return (
    <ToolPageTemplate
      toolName="Assemble"
      tabs={[
        { label: "Models", value: "models" },
        { label: "Takeoffs", value: "takeoffs" },
        { label: "Clash Detection", value: "clashes" },
        { label: "Reports", value: "reports" },
      ]}
    />
  )
}
