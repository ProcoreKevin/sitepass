"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Copy, ExternalLink, FileCode, ListChecks } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import manifest from "@/lib/generated/uui-migration-manifest.json"
import { useNavigation } from "@/lib/navigation-context"
import { cn } from "@/lib/utils"

import {
  StudioCard,
  StudioCardBody,
  StudioCardHeader,
  StudioField,
  StudioFooterMeta,
  StudioPageShell,
  StudioSearchControl,
  StudioSubpageHeader,
  StudioTablePanel,
  StudioToolbar,
} from "./studio-primitives"

const LS_KEY = "uui-migration-dashboard.v1"

const CHECKLIST_KEYS = ["default", "loading", "empty", "error", "dark"] as const
type ChecklistKey = (typeof CHECKLIST_KEYS)[number]

const CHECKLIST_LABELS: Record<ChecklistKey, string> = {
  default: "Default",
  loading: "Loading",
  empty: "Empty",
  error: "Error",
  dark: "Dark",
}

const MIGRATION_STATUS_DOC = "docs/migration-uui-rac-status.md"

type RegistryContext = "company" | "project" | "both" | "unlisted"

type IntegrationTier = "integrated" | "mixed" | "legacy"

type ScoreSignals = {
  uiFacadeModules: number
  rawButton: number
  rawInput: number
  rawSelect: number
  rawTextarea: number
  untitledDirectImport: boolean
  radixDirectImport: boolean
  inlineColorStyleBlocks: number
  quotedLiteralHexMatches: number
  bgWhiteClassHints: number
  delegatedShell: boolean
  scoreNote: string
}

type MigrationRoute = {
  href: string
  file: string
  registryContext: RegistryContext
  usesToolPageTemplate: boolean
  uuiScore: number
  integrationTier: IntegrationTier
  scoreSignals: ScoreSignals
}

type ManifestPayload = {
  generatedAt?: string
  scoreSummary?: {
    average: number
    integrated: number
    mixed: number
    legacy: number
  }
  routes: MigrationRoute[]
}

function formatSignalsTooltip(s: ScoreSignals | undefined): string {
  if (!s) {
    return "No score data — run pnpm uui:migration-manifest"
  }
  const lines = [
    s.scoreNote ?? "",
    `UI facade modules: ${s.uiFacadeModules}`,
    `Raw <button> / <input> / <select> / <textarea>: ${s.rawButton} / ${s.rawInput} / ${s.rawSelect} / ${s.rawTextarea}`,
    `@untitledui/react in page: ${s.untitledDirectImport ? "yes (violation)" : "no"}`,
    `Raw headless UI imports in page (migration scanner): ${s.radixDirectImport ? "yes" : "no"}`,
    `Inline style color blocks: ${s.inlineColorStyleBlocks}`,
    `Quoted hex literals: ${s.quotedLiteralHexMatches}`,
    `White-background utility hints: ${s.bgWhiteClassHints}`,
    `Delegated / thin shell: ${s.delegatedShell ? "yes" : "no"}`,
  ].filter(Boolean)
  return lines.join("\n")
}

function tierClass(tier: IntegrationTier): string {
  if (tier === "integrated") return "font-medium text-[var(--color-text-success)]"
  if (tier === "mixed") return "font-medium text-[var(--color-text-warning)]"
  return "font-medium text-[var(--color-text-danger)]"
}

function isDynamicManifestHref(href: string): boolean {
  return href.includes("[")
}

function isDevRoute(href: string, file: string): boolean {
  return href.startsWith("/dev/") || file.includes("/dev/")
}

function routeKindSummaryTitle(href: string, file: string, signals: ScoreSignals): string {
  const parts: string[] = []
  if (isDevRoute(href, file)) parts.push("Dev — local QA only")
  if (isDynamicManifestHref(href)) parts.push("Dynamic route pattern — not a literal URL")
  if (signals.delegatedShell) parts.push("Thin shell — inspect imported modules for UI")
  return parts.length ? parts.join(" · ") : "No flags — scanner focused on this page file"
}

/** Single-line kind chips — compact table row (ngx list density: h-10, badges h-5, gap-1). */
function RouteKindBadges({ href, file, signals }: { href: string; file: string; signals: ScoreSignals }) {
  const dev = isDevRoute(href, file)
  const dynamic = isDynamicManifestHref(href)
  const thin = signals.delegatedShell
  const title = routeKindSummaryTitle(href, file, signals)
  return (
    <div
      className="flex max-w-[11rem] flex-nowrap items-center gap-1 overflow-hidden"
      title={title}
    >
      {dev ? (
        <Badge variant="outline" className="shrink-0" title={title}>
          Dev
        </Badge>
      ) : null}
      {dynamic ? (
        <Badge variant="warning" className="shrink-0" title={title}>
          Dyn
        </Badge>
      ) : null}
      {thin ? (
        <Badge variant="secondary" className="max-w-[4.5rem] shrink-0 truncate" title={title}>
          Shell
        </Badge>
      ) : null}
      {!dev && !dynamic && !thin ? (
        <span className="text-foreground-tertiary truncate text-xs font-normal">—</span>
      ) : null}
    </div>
  )
}

function MigrationRouteQaPopover({
  href,
  file,
  values,
  setCheck,
  copyText,
}: {
  href: string
  file: string
  values: Partial<Record<ChecklistKey, boolean>> | undefined
  setCheck: (routeHref: string, key: ChecklistKey, value: boolean) => void
  copyText: (text: string) => void | Promise<void>
}) {
  const done = useMemo(() => CHECKLIST_KEYS.filter(k => values?.[k]).length, [values])
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 min-h-9 gap-1 px-2 font-normal"
          aria-label={`QA checklist, route, and file for ${href}`}
        >
          <ListChecks className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
          <span className="text-foreground-tertiary text-xs tabular-nums">
            {done > 0 ? `${done}/${CHECKLIST_KEYS.length}` : "QA"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="border-border-default w-80 max-w-[min(100vw-2rem,20rem)] p-4 shadow-2xl outline-none"
      >
        <div className="border-border-default mb-4 space-y-3 border-b pb-4">
          <div>
            <p className="text-foreground-tertiary mb-1 text-xs font-medium uppercase tracking-wider">Route</p>
            <p className="text-foreground-primary break-all font-mono text-xs font-normal leading-snug">{href}</p>
            <Button
              type="button"
              variant="link"
              className="text-foreground-secondary mt-1 h-auto min-h-0 p-0 text-xs font-normal"
              onClick={() => void copyText(href)}
            >
              Copy route
            </Button>
          </div>
          <div>
            <p className="text-foreground-tertiary mb-1 text-xs font-medium uppercase tracking-wider">File</p>
            <p className="text-foreground-primary break-all font-mono text-xs font-normal leading-snug">{file}</p>
            <Button
              type="button"
              variant="link"
              className="text-foreground-secondary mt-1 h-auto min-h-0 p-0 text-xs font-normal"
              onClick={() => void copyText(file)}
            >
              Copy file path
            </Button>
          </div>
        </div>
        <p className="text-foreground-secondary mb-4 text-xs font-normal leading-relaxed">
          Optional checks stored in this browser. Tick only states you verified; skip anything that does not exist for
          this screen.
        </p>
        <ul className="flex flex-col gap-4">
          {CHECKLIST_KEYS.map(key => (
            <li key={key}>
              <label className="text-foreground-primary flex cursor-pointer items-center gap-2 text-sm font-normal">
                <Checkbox
                  checked={!!values?.[key]}
                  onCheckedChange={v => setCheck(href, key, v === true)}
                  aria-label={`${CHECKLIST_LABELS[key]} for ${href}`}
                />
                <span>{CHECKLIST_LABELS[key]}</span>
              </label>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}

const migrationTh = "bg-background-primary text-foreground-tertiary h-10 px-3 py-0 text-left align-middle text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
const migrationTd =
  "text-foreground-primary h-10 border-border-default border-b px-3 py-0 align-middle text-sm font-normal"

type StoredChecklists = Record<string, Partial<Record<ChecklistKey, boolean>>>

function loadStored(): StoredChecklists {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as StoredChecklists
    return typeof parsed === "object" && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

function saveStored(data: StoredChecklists) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data))
  } catch {
    /* ignore quota */
  }
}

const COMPLIANCE_CMD =
  "bash .cursor/skills/ngx-design-system/scripts/check-compliance.sh app && bash .cursor/skills/ngx-design-system/scripts/check-compliance.sh components/ui"

const COMPLIANCE_PNPM = "pnpm lint:compliance"

const DOCS_COMPLIANCE_PATHS = [
  "docs/uui-facade-inventory.md",
  "docs/frontend-ngx-untitled-mandate.md",
  "docs/token-contract.md",
  MIGRATION_STATUS_DOC,
  "docs/primitive-facade-defaults.md",
  "app/legacy-theme.css",
] as const

export function UuiMigrationDashboard() {
  const router = useRouter()
  const { projects, setCurrentProject } = useNavigation()
  const data = manifest as ManifestPayload
  const routes = data.routes

  const [search, setSearch] = useState("")
  const [ctxFilter, setCtxFilter] = useState<"all" | RegistryContext>("all")
  const [tplFilter, setTplFilter] = useState<"all" | "yes" | "no">("all")
  const [tierFilter, setTierFilter] = useState<"all" | IntegrationTier>("all")
  const [sortBy, setSortBy] = useState<"path" | "score-desc" | "score-asc">("score-desc")
  const [shellMode, setShellMode] = useState<"company" | "project">("company")
  const [checklists, setChecklists] = useState<StoredChecklists>({})

  useEffect(() => {
    setChecklists(loadStored())
  }, [])

  const setCheck = useCallback((href: string, key: ChecklistKey, value: boolean) => {
    setChecklists(prev => {
      const next = {
        ...prev,
        [href]: { ...prev[href], [key]: value },
      }
      saveStored(next)
      return next
    })
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = routes.filter(r => {
      if (q && !r.href.toLowerCase().includes(q) && !r.file.toLowerCase().includes(q)) return false
      if (ctxFilter === "all") {
        /* ok */
      } else if (ctxFilter === "both") {
        if (r.registryContext !== "both") return false
      } else if (ctxFilter === "unlisted") {
        if (r.registryContext !== "unlisted") return false
      } else if (ctxFilter === "company") {
        if (r.registryContext !== "company" && r.registryContext !== "both") return false
      } else if (ctxFilter === "project") {
        if (r.registryContext !== "project" && r.registryContext !== "both") return false
      }
      if (tplFilter === "yes" && !r.usesToolPageTemplate) return false
      if (tplFilter === "no" && r.usesToolPageTemplate) return false
      if (tierFilter !== "all" && (r.integrationTier ?? "mixed") !== tierFilter) return false
      return true
    })
    const sorted = [...list]
    if (sortBy === "path") sorted.sort((a, b) => a.href.localeCompare(b.href))
    else if (sortBy === "score-desc")
      sorted.sort((a, b) => (b.uuiScore ?? 0) - (a.uuiScore ?? 0) || a.href.localeCompare(b.href))
    else sorted.sort((a, b) => (a.uuiScore ?? 0) - (b.uuiScore ?? 0) || a.href.localeCompare(b.href))
    return sorted
  }, [routes, search, ctxFilter, tplFilter, tierFilter, sortBy])

  const openRoute = useCallback(
    (href: string) => {
      if (shellMode === "company") {
        setCurrentProject(null)
      } else {
        const first = projects[0]
        if (first) setCurrentProject(first)
      }
      router.push(href)
    },
    [router, setCurrentProject, projects, shellMode],
  )

  const copyText = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      /* ignore */
    }
  }, [])

  return (
    <StudioPageShell>
      <StudioSubpageHeader
        title="Route migration"
        description={
          <>
            <p>
              Inventory of every <code className="text-foreground-primary rounded bg-background-primary px-1 py-0.5 text-xs">app/**/page.tsx</code> route:
              tool-registry context,{" "}
              <span className="text-foreground-primary font-medium">UUI score (0–100)</span> and tier from the manifest (page file only — hover score for
              signal detail). <strong className="text-foreground-primary font-medium">Kind</strong> flags Dev routes, dynamic patterns like{" "}
              <code className="text-foreground-primary rounded bg-background-primary px-1 py-0.5 text-xs">/foo/[id]</code>, and thin shells that delegate UI
              to child modules. <strong className="text-foreground-primary font-medium">Manual QA</strong> columns are optional ticks stored in{" "}
              <code className="text-foreground-primary rounded bg-background-primary px-1 py-0.5 text-xs">localStorage</code> — only check states that exist
              for that screen. Regenerate manifest:{" "}
              <code className="text-foreground-primary rounded bg-background-primary px-1 py-0.5 text-xs">pnpm uui:migration-manifest</code>. Production
              bar:{" "}
              <code className="text-foreground-primary rounded bg-background-primary px-1 py-0.5 text-xs">pnpm lint:compliance</code> and{" "}
              <code className="text-foreground-primary rounded bg-background-primary px-1 py-0.5 text-xs">docs/frontend-ngx-untitled-mandate.md</code> (
              <code className="text-foreground-primary rounded bg-background-primary px-1 py-0.5 text-xs">{MIGRATION_STATUS_DOC}</code>).
            </p>
            <p className="text-foreground-tertiary mt-2 text-xs font-medium">Manifest generated: {data.generatedAt ?? "—"}</p>
          </>
        }
      />

      {data.scoreSummary ? (
        <StudioCard>
          <StudioCardHeader title="Manifest summary" />
          <StudioCardBody className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="text-foreground-secondary text-xs font-medium tracking-wide uppercase">Avg score</span>
              <div className="text-foreground-primary mt-2 text-2xl font-medium tabular-nums">{data.scoreSummary.average}</div>
            </div>
            <div>
              <span className="text-foreground-secondary text-xs font-medium tracking-wide uppercase">Integrated</span>
              <div className={`mt-2 text-sm font-normal ${tierClass("integrated")}`}>{data.scoreSummary.integrated} pages</div>
            </div>
            <div>
              <span className="text-foreground-secondary text-xs font-medium tracking-wide uppercase">Mixed</span>
              <div className={`mt-2 text-sm font-normal ${tierClass("mixed")}`}>{data.scoreSummary.mixed} pages</div>
            </div>
            <div>
              <span className="text-foreground-secondary text-xs font-medium tracking-wide uppercase">Legacy / risk</span>
              <div className={`mt-2 text-sm font-normal ${tierClass("legacy")}`}>{data.scoreSummary.legacy} pages</div>
            </div>
          </StudioCardBody>
        </StudioCard>
      ) : null}

      <StudioToolbar>
        <StudioField label="Search path / file" className="min-w-[min(100%,18rem)] max-w-none flex-[2_1_18rem]">
          <StudioSearchControl
            id="uui-dash-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="/rfis, page.tsx…"
          />
        </StudioField>
        <StudioField label="Registry context" className="min-w-[160px] max-w-[220px] flex-none">
          <select
            className="border-border-default bg-background-primary text-foreground-primary h-9 w-full rounded-md border px-2 text-sm font-normal"
            value={ctxFilter}
            onChange={e => setCtxFilter(e.target.value as typeof ctxFilter)}
            aria-label="Filter by registry context"
          >
            <option value="all">All</option>
            <option value="company">Company (+ both)</option>
            <option value="project">Project (+ both)</option>
            <option value="both">Both only</option>
            <option value="unlisted">Unlisted</option>
          </select>
        </StudioField>
        <StudioField label="ToolPageTemplate" className="min-w-[140px] max-w-[200px] flex-none">
          <select
            className="border-border-default bg-background-primary text-foreground-primary h-9 w-full rounded-md border px-2 text-sm font-normal"
            value={tplFilter}
            onChange={e => setTplFilter(e.target.value as typeof tplFilter)}
            aria-label="Filter by ToolPageTemplate usage"
          >
            <option value="all">All</option>
            <option value="yes">Uses template</option>
            <option value="no">Custom shell</option>
          </select>
        </StudioField>
        <StudioField label="UUI tier" className="min-w-[140px] max-w-[200px] flex-none">
          <select
            className="border-border-default bg-background-primary text-foreground-primary h-9 w-full rounded-md border px-2 text-sm font-normal"
            value={tierFilter}
            onChange={e => setTierFilter(e.target.value as typeof tierFilter)}
            aria-label="Filter by integration tier"
          >
            <option value="all">All tiers</option>
            <option value="integrated">Integrated (strong)</option>
            <option value="mixed">Mixed</option>
            <option value="legacy">Legacy / risk</option>
          </select>
        </StudioField>
        <StudioField label="Sort" className="min-w-[160px] max-w-[220px] flex-none">
          <select
            className="border-border-default bg-background-primary text-foreground-primary h-9 w-full rounded-md border px-2 text-sm font-normal"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            aria-label="Sort rows"
          >
            <option value="score-desc">Score (high first)</option>
            <option value="score-asc">Score (low first)</option>
            <option value="path">Route path</option>
          </select>
        </StudioField>
        <StudioField label="Open links in shell" className="min-w-[200px] flex-none">
          <div className="flex gap-2">
            <Button type="button" variant={shellMode === "company" ? "default" : "outline"} size="sm" onClick={() => setShellMode("company")}>
              Company
            </Button>
            <Button type="button" variant={shellMode === "project" ? "default" : "outline"} size="sm" onClick={() => setShellMode("project")}>
              Project
            </Button>
          </div>
        </StudioField>
      </StudioToolbar>

      <StudioCard>
        <StudioCardHeader title="Docs & compliance" />
        <StudioCardBody className="space-y-4">
          <ul className="text-foreground-secondary list-inside list-disc text-sm font-normal">
            {DOCS_COMPLIANCE_PATHS.map(p => (
              <li key={p}>
                <code className="text-foreground-primary text-xs">{p}</code>{" "}
                <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={() => copyText(p)}>
                  Copy path
                </Button>
              </li>
            ))}
          </ul>
          <p className="text-foreground-tertiary text-xs font-normal leading-relaxed">
            Table scores do not replace ESLint / import-surface checks — run compliance before release.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <code className="bg-background-primary max-w-full overflow-x-auto rounded px-2 py-2 text-xs whitespace-pre-wrap">{COMPLIANCE_PNPM}</code>
            <Button type="button" size="sm" variant="secondary" onClick={() => copyText(COMPLIANCE_PNPM)}>
              Copy
            </Button>
            <span className="text-foreground-tertiary text-xs">(same script as below)</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <code className="bg-background-primary max-w-full overflow-x-auto rounded px-2 py-2 text-xs whitespace-pre-wrap">{COMPLIANCE_CMD}</code>
            <Button type="button" size="sm" variant="secondary" onClick={() => copyText(COMPLIANCE_CMD)}>
              Copy command
            </Button>
          </div>
        </StudioCardBody>
      </StudioCard>

      <p className="text-foreground-tertiary px-1 text-xs font-normal">
        <strong className="text-foreground-secondary font-medium">Compact table</strong> (NGX list density:{" "}
        <code className="text-foreground-secondary text-[11px]">h-10</code> rows).{" "}
        <strong className="text-foreground-secondary font-medium">Actions</strong> are icon buttons (tooltips).{" "}
        <strong className="text-foreground-secondary font-medium">QA</strong> opens a popover per row — no horizontal checkbox strip. Hover{" "}
        <strong className="text-foreground-secondary font-medium">Score</strong> for scanner signals. Dynamic routes: Open is disabled.
      </p>
      <TooltipProvider delayDuration={400}>
        <StudioTablePanel>
          <Table>
            <TableCaption className="text-foreground-secondary mb-3 text-left text-sm font-normal">
              Manifest columns plus icon actions. The QA popover includes route, file path, copy actions, and the optional checklist (localStorage); checkboxes do not auto-detect UI.
            </TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className={cn(migrationTh, "sticky top-0 z-20")}>Route</TableHead>
                <TableHead
                  className={cn(migrationTh, "sticky top-0 z-20 w-14 text-center")}
                  title="Hover the score cell for full scanner signal breakdown"
                >
                  Score
                </TableHead>
                <TableHead className={cn(migrationTh, "sticky top-0 z-20")}>Tier</TableHead>
                <TableHead className={cn(migrationTh, "sticky top-0 z-20")}>Kind</TableHead>
                <TableHead className={cn(migrationTh, "sticky top-0 z-20")}>Registry</TableHead>
                <TableHead className={cn(migrationTh, "sticky top-0 z-20")}>Tpl</TableHead>
                <TableHead className={cn(migrationTh, "sticky top-0 z-20")}>File</TableHead>
                <TableHead className={cn(migrationTh, "sticky top-0 z-20")}>Actions</TableHead>
                <TableHead className={cn(migrationTh, "sticky top-0 z-20 text-center")}>QA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => {
                const dynamic = isDynamicManifestHref(r.href)
                const tier = r.integrationTier ?? "mixed"
                const showGuide = tier === "mixed" || tier === "legacy"
                return (
                  <TableRow key={r.href}>
                    <TableCell
                      className={cn(migrationTd, "max-w-[10rem] truncate font-mono text-xs")}
                      title={r.href}
                    >
                      {r.href}
                    </TableCell>
                    <TableCell
                      className={cn(migrationTd, "text-center font-mono text-sm font-medium tabular-nums")}
                      title={formatSignalsTooltip(r.scoreSignals)}
                    >
                      {r.uuiScore != null ? r.uuiScore : "—"}
                    </TableCell>
                    <TableCell className={cn(migrationTd, "text-xs", tierClass(tier))} title={formatSignalsTooltip(r.scoreSignals)}>
                      {tier}
                    </TableCell>
                    <TableCell className={cn(migrationTd, "whitespace-normal")}>
                      <RouteKindBadges href={r.href} file={r.file} signals={r.scoreSignals} />
                    </TableCell>
                    <TableCell className={cn(migrationTd, "text-xs")}>{r.registryContext}</TableCell>
                    <TableCell className={cn(migrationTd, "text-center text-xs")}>{r.usesToolPageTemplate ? "Y" : "—"}</TableCell>
                    <TableCell
                      className={cn(migrationTd, "text-foreground-secondary max-w-[14rem] truncate font-mono text-xs")}
                      title={r.file}
                    >
                      {r.file}
                    </TableCell>
                    <TableCell className={cn(migrationTd, "min-w-[11rem] whitespace-normal")}>
                      <div className="flex flex-nowrap items-center gap-2">
                        {dynamic ? (
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            disabled
                            className="h-9 w-9 shrink-0"
                            title="Dynamic route pattern — not a literal URL. Copy file path or navigate with a real id."
                            aria-label="Open route (unavailable for dynamic pattern)"
                          >
                            <ExternalLink className="size-4 opacity-40" strokeWidth={1.5} aria-hidden />
                          </Button>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                size="icon"
                                variant="default"
                                className="h-9 w-9 shrink-0"
                                onClick={() => openRoute(r.href)}
                                aria-label={`Open route ${r.href}`}
                              >
                                <ExternalLink className="size-4" strokeWidth={1.5} aria-hidden />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Open route (Company / Project shell)</TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              className="h-9 w-9 shrink-0"
                              onClick={() => copyText(r.href)}
                              aria-label={`Copy route path ${r.href}`}
                            >
                              <Copy className="size-4" strokeWidth={1.5} aria-hidden />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy route path</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              className="h-9 w-9 shrink-0"
                              onClick={() => copyText(r.file)}
                              aria-label="Copy page file path"
                            >
                              <FileCode className="size-4" strokeWidth={1.5} aria-hidden />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy app-relative page path</TooltipContent>
                        </Tooltip>
                        {showGuide ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                className="h-9 w-9 shrink-0"
                                onClick={() => copyText(MIGRATION_STATUS_DOC)}
                                aria-label="Copy migration status doc path"
                              >
                                <BookOpen className="size-4" strokeWidth={1.5} aria-hidden />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy {MIGRATION_STATUS_DOC}</TooltipContent>
                          </Tooltip>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className={cn(migrationTd, "text-center")}>
                      <MigrationRouteQaPopover
                        href={r.href}
                        file={r.file}
                        values={checklists[r.href]}
                        setCheck={setCheck}
                        copyText={copyText}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </StudioTablePanel>
      </TooltipProvider>

      <StudioFooterMeta>
        Showing {filtered.length} of {routes.length} routes
        {shellMode === "project" && projects.length === 0 ? (
          <span className="text-destructive ml-2 font-medium">No simulated projects — project shell may match company.</span>
        ) : null}
      </StudioFooterMeta>
    </StudioPageShell>
  )
}
