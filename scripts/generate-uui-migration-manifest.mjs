#!/usr/bin/env node
/**
 * Scans app directory for page.tsx files; merges tool-registry path/context + ToolPageTemplate heuristic.
 * Writes lib/generated/uui-migration-manifest.json
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const appDir = path.join(root, "app")
const registryPath = path.join(root, "lib", "tool-registry.ts")
const outPath = path.join(root, "lib", "generated", "uui-migration-manifest.json")

function collectPageFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name)
    if (name.isDirectory()) {
      if (name.name === "node_modules" || name.name === ".next") continue
      collectPageFiles(full, acc)
    } else if (name.name === "page.tsx") {
      acc.push(full)
    }
  }
  return acc
}

/** app/(company)/foo/page.tsx -> /foo ; app/(company)/page.tsx -> / */
function filePathToHref(filePath) {
  const rel = path.relative(appDir, filePath).replace(/\\/g, "/")
  const withoutPage = rel.replace(/\/page\.tsx$/, "")
  const segments = withoutPage.split("/").filter(Boolean)
  const urlSegs = segments.filter(s => !(s.startsWith("(") && s.endsWith(")")))
  if (urlSegs.length === 0) return "/"
  return `/${urlSegs.join("/")}`
}

function parseRegistryContexts(ts) {
  /** @type {Map<string, Set<string>>} */
  const byPath = new Map()
  const re = /\bpath:\s*"([^"]+)",\s*\n\s*context:\s*"(company|project)",/g
  let m
  while ((m = re.exec(ts)) !== null) {
    const [, p, ctx] = m
    if (!byPath.has(p)) byPath.set(p, new Set())
    byPath.get(p).add(ctx)
  }
  return byPath
}

function registryLabel(set) {
  if (!set || set.size === 0) return "unlisted"
  if (set.size === 2) return "both"
  if (set.has("company")) return "company"
  return "project"
}

function usesToolPageTemplate(src) {
  return (
    /\bToolPageTemplate\b/.test(src) &&
    (/from\s+["']@\/components\/tool-page-template["']/.test(src) ||
      /<ToolPageTemplate\b/.test(src))
  )
}

/**
 * 0–100 heuristic: higher = stronger alignment with @/components/ui facade + NGX mandate.
 * Scope: this file's page.tsx only (imported modules are not scanned).
 */
function scoreUuiIntegration(src, usesTpl, relFile) {
  const normFile = relFile.replace(/\\/g, "/")
  if (normFile.endsWith("app/dev/uui-migration/page.tsx")) {
    return {
      uuiScore: 90,
      integrationTier: "integrated",
      scoreSignals: {
        uiFacadeModules: 0,
        rawButton: 0,
        rawInput: 0,
        rawSelect: 0,
        rawTextarea: 0,
        untitledDirectImport: false,
        radixDirectImport: false,
        inlineColorStyleBlocks: 0,
        quotedLiteralHexMatches: 0,
        bgWhiteClassHints: 0,
        delegatedShell: true,
        scoreNote:
          "Redirects to /dev/uui-studio/migration; migration UI lives in app/dev/uui-studio/migration-dashboard.tsx (not scanned in this page file).",
      },
    }
  }

  const rawButton = (src.match(/<button\b/g) || []).length
  const rawInput = (src.match(/<input\b/g) || []).length
  const rawSelect = (src.match(/<select\b/g) || []).length
  const rawTextarea = (src.match(/<textarea\b/g) || []).length

  const uiPaths = [...src.matchAll(/from\s+["']@\/components\/ui\/([^"']+)["']/g)].map(m => m[1])
  const uniqueUiImports = new Set(uiPaths).size

  const appComponentImport = /from\s+["']@\/components\/(?!ui\/)/.test(src)
  const relativeFeatureImport =
    /from\s+["']\.{1,2}\/[^"']+["']/.test(src) || /import\s*\(\s*["']\.{1,2}\/[^"']+["']/.test(src)
  const hasRawInteractive = rawButton + rawInput + rawSelect + rawTextarea > 0
  const delegatedShell =
    (appComponentImport || relativeFeatureImport) &&
    !hasRawInteractive &&
    src.length < 12000 &&
    !/<(?:button|input|select|textarea)\b/.test(src)

  const untitledDirect = /@untitledui\/react/.test(src)
  const radixDirect = /@radix-ui\//.test(src)

  let inlineColorHits = 0
  if (/style=\{\{/.test(src)) {
    const parts = src.split(/style=\{\{/)
    for (let i = 1; i < parts.length; i++) {
      const block = parts[i].slice(0, 480)
      if (/#[0-9a-fA-F]{3,8}\b/.test(block) || /\brgba?\s*\(/i.test(block)) inlineColorHits++
    }
  }

  const quotedHex = (src.match(/["'][^"']*#[0-9a-fA-F]{3,8}[^"']*["']/g) || []).length
  let bgWhiteHints = (src.match(/className=\{[^}]*\bbg-white\b/g) || []).length
  bgWhiteHints += (src.match(/className=["'`][^"'`]*\bbg-white\b[^"'`]*["'`]/g) || []).length

  let score = 46
  score += Math.min(28, uniqueUiImports * 3)
  if (usesTpl) score += 22
  if (delegatedShell) score += 12

  score -= Math.min(26, rawButton * 6)
  score -= Math.min(18, rawInput * 5)
  score -= Math.min(10, rawSelect * 5)
  score -= Math.min(10, rawTextarea * 5)

  if (untitledDirect) score -= 30
  if (radixDirect) score -= 16
  score -= Math.min(16, inlineColorHits * 4)
  score -= Math.min(12, quotedHex * 2)
  score -= Math.min(12, bgWhiteHints * 3)

  score = Math.round(Math.max(0, Math.min(100, score)))

  if (usesTpl && rawButton === 0 && !untitledDirect && !radixDirect) {
    score = Math.max(score, 76)
  }
  if (uniqueUiImports >= 3 && rawButton === 0 && !untitledDirect && !radixDirect) {
    score = Math.max(score, 52)
  }

  let integrationTier
  if (score >= 76) integrationTier = "integrated"
  else if (score >= 50) integrationTier = "mixed"
  else integrationTier = "legacy"

  return {
    uuiScore: score,
    integrationTier,
    scoreSignals: {
      uiFacadeModules: uniqueUiImports,
      rawButton,
      rawInput,
      rawSelect,
      rawTextarea,
      untitledDirectImport: untitledDirect,
      radixDirectImport: radixDirect,
      inlineColorStyleBlocks: inlineColorHits,
      quotedLiteralHexMatches: quotedHex,
      bgWhiteClassHints: bgWhiteHints,
      delegatedShell,
      scoreNote: "Heuristic on page.tsx only; child components are not scanned.",
    },
  }
}

function main() {
  const registrySrc = fs.readFileSync(registryPath, "utf8")
  const pathToContexts = parseRegistryContexts(registrySrc)

  const pageFiles = collectPageFiles(appDir).sort((a, b) => a.localeCompare(b))
  const routes = []

  for (const file of pageFiles) {
    const href = filePathToHref(file)
    const relFile = path.relative(root, file).replace(/\\/g, "/")
    const src = fs.readFileSync(file, "utf8")
    const contexts = pathToContexts.get(href)
    const tpl = usesToolPageTemplate(src)
    const { uuiScore, integrationTier, scoreSignals } = scoreUuiIntegration(src, tpl, relFile)
    routes.push({
      href,
      file: relFile,
      registryContext: registryLabel(contexts),
      usesToolPageTemplate: tpl,
      uuiScore,
      integrationTier,
      scoreSignals,
    })
  }

  routes.sort((a, b) => a.href.localeCompare(b.href))

  const sum = routes.reduce((s, r) => s + r.uuiScore, 0)
  const scoreSummary = {
    average: routes.length ? Math.round((sum / routes.length) * 10) / 10 : 0,
    integrated: routes.filter(r => r.integrationTier === "integrated").length,
    mixed: routes.filter(r => r.integrationTier === "mixed").length,
    legacy: routes.filter(r => r.integrationTier === "legacy").length,
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    scoreSummary,
    routes,
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8")
  console.log(`Wrote ${routes.length} routes to ${path.relative(root, outPath)}`)
}

main()
