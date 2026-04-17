import { readFileSync, writeFileSync, readdirSync, rmSync, existsSync } from "fs"
import { join } from "path"

const APP_DIR = "/vercel/share/v0-project/app"
const COMPANY_DIR = join(APP_DIR, "(company)")

// 1. Delete all duplicate (company) tool pages — keep only page.tsx (root route)
const companyFiles = readdirSync(COMPANY_DIR, { withFileTypes: true })
for (const entry of companyFiles) {
  if (entry.isDirectory()) {
    // Delete entire subdirectory (e.g. (company)/admin, (company)/portfolio, etc.)
    rmSync(join(COMPANY_DIR, entry.name), { recursive: true, force: true })
    console.log(`Deleted (company)/${entry.name}/`)
  } else if (entry.name !== "page.tsx" && entry.name !== "_index.ts" && entry.name !== "open-items-tab.tsx") {
    // Keep page.tsx (root route), _index.ts (cache buster), open-items-tab.tsx (used by company-home-content)
    rmSync(join(COMPANY_DIR, entry.name))
    console.log(`Deleted (company)/${entry.name}`)
  }
}

// 2. Strip WorkspaceLayout from all app/**/page.tsx files (except root layout)
function stripWorkspaceLayout(filePath) {
  let content = readFileSync(filePath, "utf8")
  const original = content

  // Remove WorkspaceLayout import line
  content = content.replace(/^import \{ WorkspaceLayout \} from ["']@\/components\/workspace-shell["']\n?/m, "")

  // Replace <WorkspaceLayout>\n      <X />\n    </WorkspaceLayout> with <X />
  // Handle multi-line patterns
  content = content.replace(
    /return\s*\(\s*\n\s*<WorkspaceLayout>\s*\n\s*(<[^>]+\s*\/>)\s*\n\s*<\/WorkspaceLayout>\s*\n\s*\)/gs,
    "return $1"
  )

  // Single-line pattern: return (<WorkspaceLayout><X /></WorkspaceLayout>)
  content = content.replace(
    /return\s*\(\s*<WorkspaceLayout>\s*(<[^>]+\s*\/>)\s*<\/WorkspaceLayout>\s*\)/g,
    "return $1"
  )

  if (content !== original) {
    writeFileSync(filePath, content)
    console.log(`Stripped WorkspaceLayout from ${filePath.replace("/vercel/share/v0-project/", "")}`)
  }
}

function walkDir(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".next") {
      walkDir(fullPath)
    } else if (entry.name === "page.tsx" || entry.name === "loading.tsx") {
      stripWorkspaceLayout(fullPath)
    }
  }
}

walkDir(APP_DIR)
console.log("Done.")
