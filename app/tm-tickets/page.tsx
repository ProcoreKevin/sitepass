"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function TMTicketsPage() {
  return (
    <ToolPageTemplate
      toolName="T&M Tickets"
      tabs={[
        { label: "All Tickets", value: "all" },
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
      ]}
    />
  )
}
