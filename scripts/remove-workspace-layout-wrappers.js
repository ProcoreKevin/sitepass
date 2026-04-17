/**
 * Removes redundant <WorkspaceLayout> wrappers from every tool page.tsx.
 * app/layout.tsx already wraps all children in WorkspaceLayout, so each
 * individual page doing the same produces a double header.
 */

import fs from "fs"
import path from "path"

import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Try both the sandbox path and the absolute path
const candidates = [
  path.resolve(__dirname, "../app"),
  "/vercel/share/v0-project/app",
  "/home/user/app",
  "/app",
]
const appDir = candidates.find(p => {
  try { fs.readdirSync(p); return true } catch { return false }
})
if (!appDir) {
  console.error("Could not find app directory. Tried:", candidates)
  process.exit(1)
}
console.log("Using appDir:", appDir)

// Files that legitimately own the WorkspaceLayout — do NOT touch these.
const SKIP = new Set([
  path.resolve(appDir, "layout.tsx"),
])

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full, results)
    } else if (entry.isFile() && (entry.name === "page.tsx" || entry.name === "loading.tsx")) {
      results.push(full)
    }
  }
  return results
}

let fixed = 0
let skipped = 0

for (const file of walk(appDir)) {
  if (SKIP.has(file)) continue

  let src = fs.readFileSync(file, "utf8")
  if (!src.includes("WorkspaceLayout")) {
    skipped++
    continue
  }

  const original = src

  // 1. Remove the WorkspaceLayout import line entirely.
  src = src.replace(
    /^import \{ WorkspaceLayout \} from "@\/components\/workspace-shell"\n/m,
    ""
  )
  // If WorkspaceLayout is imported alongside other names, remove it from the list.
  src = src.replace(/,\s*WorkspaceLayout\b/g, "")
  src = src.replace(/\bWorkspaceLayout\s*,\s*/g, "")

  // 2. Remove <WorkspaceLayout> opening tag (with optional attributes / trailing newline)
  src = src.replace(/<WorkspaceLayout[^>]*>\n?/g, "")

  // 3. Remove </WorkspaceLayout> closing tag (with optional leading whitespace / trailing newline)
  src = src.replace(/[ \t]*<\/WorkspaceLayout>\n?/g, "")

  // 4. Clean up any leftover empty import braces that may result
  src = src.replace(/^import \{\s*\} from "@\/components\/workspace-shell"\n/m, "")

  if (src !== original) {
    fs.writeFileSync(file, src, "utf8")
    console.log(`Fixed: ${path.relative(process.cwd(), file)}`)
    fixed++
  } else {
    skipped++
  }
}

console.log(`\nDone. Fixed ${fixed} file(s), skipped ${skipped}.`)
