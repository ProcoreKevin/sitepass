"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function BiddingPage() {
  return (
    <ToolPageTemplate
      toolName="Bidding"
      tabs={[
        { label: "All Bids", value: "all" },
        { label: "Open", value: "open" },
        { label: "Submitted", value: "submitted" },
        { label: "Awarded", value: "awarded" },
      ]}
    />
  )
}
