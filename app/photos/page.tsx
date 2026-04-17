"use client"

import { ToolPageTemplate } from "@/components/tool-page-template"

export default function PhotosPage() {
  return (
    <ToolPageTemplate
      toolName="Photos"
      tabs={[
        { label: "All Photos", value: "all" },
        { label: "Albums", value: "albums" },
      ]}
    />
  )
}
