"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function InvoicingPage() {
  return (
    <ToolPageTemplate
      toolName="Invoicing"
      tabs={[
        { label: "All Invoices", value: "all" },
        { label: "Pending", value: "pending" },
        { label: "Paid", value: "paid" },
        { label: "Overdue", value: "overdue" },
      ]}
    />
  )
}
