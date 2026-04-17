const fs = require("fs")
const path = require("path")

const APP_DIR = "/vercel/share/v0-project/app"

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walk(fullPath))
    } else if (entry.name === "page.tsx") {
      files.push(fullPath)
    }
  }
  return files
}

// Step 1: Delete duplicate company sub-tool pages inside app/(company)/
// Only keep app/(company)/page.tsx — delete everything else under (company)/
const companyDir = path.join(APP_DIR, "(company)")
if (fs.existsSync(companyDir)) {
  const companyEntries = fs.readdirSync(companyDir, { withFileTypes: true })
  for (const entry of companyEntries) {
    if (entry.isDirectory()) {
      const subDir = path.join(companyDir, entry.name)
      const subPage = path.join(subDir, "page.tsx")
      if (fs.existsSync(subPage)) {
        fs.rmSync(subDir, { recursive: true })
        console.log(`Deleted duplicate: app/(company)/${entry.name}/`)
      }
    }
  }
}

// Step 2: Strip WorkspaceLayout wrapper from all page.tsx files
const allPages = walk(APP_DIR)

for (const filePath of allPages) {
  let content = fs.readFileSync(filePath, "utf8")

  // Skip if no WorkspaceLayout reference
  if (!content.includes("WorkspaceLayout")) continue

  // Remove the import line
  content = content.replace(/^import \{ WorkspaceLayout \} from ["']@\/components\/workspace-shell["']\n?/m, "")

  // Replace: return (\n    <WorkspaceLayout>\n      {inner}\n    </WorkspaceLayout>\n  )
  // with:    return {inner}
  content = content.replace(
    /return \(\s*<WorkspaceLayout>\s*([\s\S]*?)\s*<\/WorkspaceLayout>\s*\)/g,
    (match, inner) => {
      const trimmed = inner.trim()
      // If inner is a single JSX element, return it directly
      return `return (\n    ${trimmed}\n  )`
    }
  )

  fs.writeFileSync(filePath, content, "utf8")
  const rel = path.relative(path.join(__dirname, ".."), filePath)
  console.log(`Stripped WorkspaceLayout from: ${rel}`)
}

console.log("Done.")
