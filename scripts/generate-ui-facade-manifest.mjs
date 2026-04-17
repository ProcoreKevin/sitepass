#!/usr/bin/env node
/**
 * Lists components/ui/*.tsx facades (excludes hooks-only files).
 * Writes lib/generated/ui-facade-manifest.json
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const uiDir = path.join(root, "components", "ui")
const outPath = path.join(root, "lib", "generated", "ui-facade-manifest.json")

const EXCLUDE = new Set(["use-mobile.tsx"])

function titleFromFile(name) {
  const base = name.replace(/\.tsx$/, "")
  return base
    .split("-")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ")
}

function main() {
  const files = fs.readdirSync(uiDir).filter(f => f.endsWith(".tsx") && !EXCLUDE.has(f))
  files.sort((a, b) => a.localeCompare(b))

  const facades = files.map(file => {
    const slug = file.replace(/\.tsx$/, "")
    return {
      slug,
      file: `components/ui/${file}`,
      label: titleFromFile(file),
    }
  })

  const payload = {
    generatedAt: new Date().toISOString(),
    facades,
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2))
  console.log(`Wrote ${facades.length} facades to ${path.relative(root, outPath)}`)
}

main()
