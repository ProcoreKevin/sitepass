"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function EmailsPage() {
  return (
    <ToolPageTemplate
      toolName="Emails"
      tabs={[
        { label: "All Emails", value: "all" },
        { label: "Inbox", value: "inbox" },
        { label: "Sent", value: "sent" },
        { label: "Archived", value: "archived" },
      ]}
    />
  )
}
