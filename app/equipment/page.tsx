"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function EquipmentPage() {
  return (
    <ToolPageTemplate
      toolName="Equipment"
      tabs={[
        { label: "All Equipment", value: "all" },
        { label: "On Site", value: "onsite" },
        { label: "Available", value: "available" },
        { label: "Maintenance", value: "maintenance" },
      ]}
    />
  )
}
