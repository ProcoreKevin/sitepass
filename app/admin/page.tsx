"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function AdminPage() {
  return (
    <ToolPageTemplate
      toolName="Admin"
      tabs={[
        { label: "Users", value: "users" },
        { label: "Settings", value: "settings" },
      ]}
    />
  )
}
