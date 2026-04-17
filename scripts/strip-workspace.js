const fs = require("fs")
const path = require("path")

// Try multiple possible project roots
const candidates = [
  "/vercel/share/v0-project",
  path.resolve(__dirname, ".."),
  path.resolve(process.cwd(), ".."),
]

let APP_DIR = null
for (const c of candidates) {
  const p = path.join(c, "app")
  if (fs.existsSync(p)) {
    APP_DIR = p
    console.log("Found app at:", APP_DIR)
    break
  }
}

if (!APP_DIR) {
  console.error("Could not find app directory. Tried:", candidates)
  process.exit(1)
}

function getAllPageFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) getAllPageFiles(full, files)
    else if (entry.name === "page.tsx" || entry.name === "loading.tsx") files.push(full)
  }
  return files
}

const pages = getAllPageFiles(APP_DIR)
let stripped = 0

for (const file of pages) {
  let content = fs.readFileSync(file, "utf8")
  
  if (!content.includes("WorkspaceLayout")) continue
  
  // Skip the layout itself
  if (file.endsWith("layout.tsx")) continue

  // Remove import line
  content = content.replace(/^import \{ WorkspaceLayout \} from "@\/components\/workspace-shell"\n/m, "")
  
  // Remove single-line wrapper: <WorkspaceLayout>.....</WorkspaceLayout>
  content = content.replace(/<WorkspaceLayout>(.*?)<\/WorkspaceLayout>/g, "$1")
  
  // Remove multi-line wrapper open tag on its own line
  content = content.replace(/^\s*<WorkspaceLayout>\n/gm, "")
  
  // Remove closing tag on its own line  
  content = content.replace(/^\s*<\/WorkspaceLayout>\n/gm, "")
  
  // Clean up extra blank lines
  content = content.replace(/\n{3,}/g, "\n\n")
  
  fs.writeFileSync(file, content, "utf8")
  stripped++
  console.log("Stripped:", path.relative(APP_DIR, file))
}

console.log(`\nDone. Stripped WorkspaceLayout from ${stripped} files.`)
