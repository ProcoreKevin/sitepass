"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function TimesheetsPage() {
  return (
    <ToolPageTemplate
      toolName="Timesheets"
      tabs={[
        { label: "All Timesheets", value: "all" },
        { label: "Pending Approval", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "My Timesheets", value: "mine" },
      ]}
    />
  )
}
