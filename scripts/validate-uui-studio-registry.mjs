#!/usr/bin/env node
/**
 * Ensures refinement-registry.ts points at real files (Untitled sources + app facades).
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const registryFile = path.join(root, "lib", "uui-studio", "refinement-registry.ts")

function stripFacadeSuffix(s) {
  const i = s.indexOf(" (")
  return i === -1 ? s : s.slice(0, i).trim()
}

function main() {
  const src = fs.readFileSync(registryFile, "utf8")
  const ids = [...src.matchAll(/\bid:\s*"([^"]+)"/g)].map(m => m[1])
  const untitled = [...src.matchAll(/\buntitledSource:\s*"([^"]+)"/g)].map(m => m[1])
  const facades = [...src.matchAll(/\bfacadePath:\s*"([^"]+)"/g)].map(m => stripFacadeSuffix(m[1]))

  if (ids.length !== untitled.length || ids.length !== facades.length) {
    console.error(
      "validate-uui-studio-registry: mismatch in extracted field counts",
      { ids: ids.length, untitled: untitled.length, facades: facades.length },
    )
    process.exit(1)
  }

  let errors = 0
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]
    const uPath = path.join(root, untitled[i])
    const fPath = path.join(root, facades[i])
    if (!fs.existsSync(uPath)) {
      console.error(`[${id}] missing untitledSource: ${untitled[i]}`)
      errors++
    }
    if (!fs.existsSync(fPath)) {
      console.error(`[${id}] missing facadePath: ${facades[i]}`)
      errors++
    }
  }

  if (errors) {
    console.error(`validate-uui-studio-registry: ${errors} error(s)`)
    process.exit(1)
  }
  console.log(`validate-uui-studio-registry: OK (${ids.length} entries)`)
}

main()
