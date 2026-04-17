import { writeFileSync, mkdirSync, existsSync } from "fs"
import { join } from "path"

const ROOT = "/vercel/share/v0-project/app"

function makePage(toolName) {
  return `"use client"
import { WorkspaceLayout } from "@/components/workspace-shell"
import { ToolPageTemplate } from "@/components/tool-page-template"
export default function Page() {
  return (
    <WorkspaceLayout>
      <ToolPageTemplate toolName="${toolName}" />
    </WorkspaceLayout>
  )
}
`
}

// All tool paths → display names. Only create if page doesn't already exist.
const pages = [
  // Company tools
  ["portfolio",               "Portfolio"],
  ["programs",                "Programs"],
  ["directory",               "Directory"],
  ["reporting",               "360 Reporting"],
  ["analytics",               "Analytics"],
  ["admin",                   "Admin"],
  ["permissions",             "Permissions"],
  ["apps",                    "App Management"],
  ["workflows",               "Workflows"],
  ["connections",             "Connection Manager"],
  ["financials",              "Financials Dashboard"],
  ["snapshots",               "Project Status Snapshots"],
  ["erp",                     "ERP Integrations"],
  ["resource-planning",       "Resource Planning"],
  ["planroom",                "Planroom"],
  ["bid-board",               "Bid Board"],
  ["prequalifications",       "Prequalifications"],
  ["prequalification-portal", "Prequalification Portal"],
  ["cost-catalog",            "Cost Catalog"],
  ["executive",               "Executive Dashboard"],
  ["project-management",      "Project Management Dashboard"],
  ["quality-safety",          "Quality & Safety Dashboard"],
  ["health",                  "Health Dashboard"],
  ["data-extracts",           "Data Extracts"],
  ["assets",                  "Assets"],
  ["link",                    "Link"],
  // Project tools (ones that don't already have full pages)
  ["correspondence",          "Correspondence"],
  ["meetings",                "Meetings"],
  ["transmittals",            "Transmittals"],
  ["emails",                  "Emails"],
  ["coordination-issues",     "Coordination Issues"],
  ["observations",            "Observations"],
  ["inspections",             "Inspections"],
  ["daily-log",               "Daily Log"],
  ["photos",                  "Photos"],
  ["punch-list",              "Punch List"],
  ["incidents",               "Incidents"],
  ["documents",               "Documents"],
  ["specifications",          "Specifications"],
  ["bim-models",              "Models"],
  ["assemble",                "Assemble"],
  ["change-events",           "Change Events"],
  ["change-orders",           "Change Orders"],
  ["commitments",             "Commitments"],
  ["prime-contracts",         "Prime Contracts"],
  ["direct-costs",            "Direct Costs"],
  ["invoicing",               "Invoicing"],
  ["timesheets",              "Timesheets"],
  ["crews",                   "Crews"],
  ["equipment",               "Equipment"],
  ["tm-tickets",              "T&M Tickets"],
  ["bidding",                 "Bidding"],
  ["forms",                   "Forms"],
  ["instructions",            "Instructions"],
  ["agent-builder",           "Agent Builder"],
]

let created = 0
let skipped = 0

for (const [slug, name] of pages) {
  const dir = join(ROOT, slug)
  const file = join(dir, "page.tsx")
  if (existsSync(file)) {
    console.log(`[v0] SKIP  ${file}`)
    skipped++
    continue
  }
  mkdirSync(dir, { recursive: true })
  writeFileSync(file, makePage(name), "utf8")
  console.log(`[v0] CREATE ${file}`)
  created++
}

console.log(`\n[v0] Done — created ${created}, skipped ${skipped}`)
