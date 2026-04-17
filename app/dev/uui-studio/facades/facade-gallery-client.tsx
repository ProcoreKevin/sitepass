"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import manifest from "@/lib/generated/ui-facade-manifest.json"
import { getFacadeStorybookLink } from "@/lib/uui-studio/facade-storybook-hints"

import { FacadePreviewContent } from "./facade-preview-content"
import {
  StudioField,
  StudioFooterMeta,
  StudioPageShell,
  StudioSearchControl,
  StudioSubpageHeader,
  StudioToolbar,
} from "../studio-primitives"

const LS_KEY = "uui-facade-review.v1"

/**
 * Must not be the literal `"all"` — React Stately's Select treats `selection === "all"`
 * as the "select all items" sentinel and skips updating (see useSelectState onSelectionChange).
 */
const STATUS_FILTER_VALUE_ALL = "uui-studio-filter-all" as const

export type FacadeReviewStatus = "approved" | "needs_review" | "in_progress"

type StoredShape = {
  statuses: Record<string, FacadeReviewStatus>
}

function loadStored(): StoredShape {
  if (typeof window === "undefined") return { statuses: {} }
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return { statuses: {} }
    const p = JSON.parse(raw) as Partial<StoredShape>
    if (p && typeof p === "object" && p.statuses && typeof p.statuses === "object") {
      return { statuses: p.statuses as Record<string, FacadeReviewStatus> }
    }
  } catch {
    /* ignore */
  }
  return { statuses: {} }
}

function saveStored(s: StoredShape) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s))
  } catch {
    /* ignore */
  }
}

function statusFor(stored: StoredShape, slug: string): FacadeReviewStatus {
  return stored.statuses[slug] ?? "needs_review"
}

const facades = manifest.facades

function statusFilterSelectValue(filter: "all" | FacadeReviewStatus): string {
  return filter === "all" ? STATUS_FILTER_VALUE_ALL : filter
}

function parseStatusFilterValue(v: string): "all" | FacadeReviewStatus {
  if (v === STATUS_FILTER_VALUE_ALL || v === "" || v === "all") return "all"
  if (v === "approved" || v === "needs_review" || v === "in_progress") return v
  return "all"
}

export function FacadeGalleryClient() {
  const [stored, setStored] = React.useState<StoredShape>({ statuses: {} })
  const [hydrated, setHydrated] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState<"all" | FacadeReviewStatus>("all")
  const [selectedSlug, setSelectedSlug] = React.useState(facades[0]?.slug ?? "")

  /** Stable subtree so Select's collection builder does not rebuild every render (fixes status filter). */
  const statusFilterSelectChildren = React.useMemo(
    () => [
      <SelectTrigger key="sf-trg" className="w-full min-w-[10rem] max-w-[16rem]" size="sm">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>,
      <SelectContent key="sf-cnt">
        <SelectItem value={STATUS_FILTER_VALUE_ALL}>All facades</SelectItem>
        <SelectItem value="needs_review">Needs review</SelectItem>
        <SelectItem value="in_progress">In progress</SelectItem>
        <SelectItem value="approved">Approved / gold</SelectItem>
      </SelectContent>,
    ],
    [],
  )

  React.useEffect(() => {
    setStored(loadStored())
    setHydrated(true)
  }, [])

  const persist = React.useCallback((next: StoredShape) => {
    setStored(next)
    saveStored(next)
  }, [])

  const setStatus = React.useCallback(
    (slug: string, status: FacadeReviewStatus) => {
      persist({
        statuses: { ...stored.statuses, [slug]: status },
      })
    },
    [persist, stored.statuses],
  )

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return facades.filter(f => {
      const st = statusFor(stored, f.slug)
      if (filter !== "all" && st !== filter) return false
      if (!q) return true
      return f.slug.includes(q) || f.label.toLowerCase().includes(q) || f.file.toLowerCase().includes(q)
    })
  }, [filter, query, stored])

  React.useEffect(() => {
    if (filtered.some(f => f.slug === selectedSlug)) return
    setSelectedSlug(filtered[0]?.slug ?? "")
  }, [filtered, selectedSlug])

  const selected = facades.find(f => f.slug === selectedSlug)
  const idxFiltered = filtered.findIndex(f => f.slug === selectedSlug)
  const prevSlug = idxFiltered > 0 ? filtered[idxFiltered - 1]?.slug : undefined
  const nextSlug =
    idxFiltered >= 0 && idxFiltered < filtered.length - 1 ? filtered[idxFiltered + 1]?.slug : undefined

  const sb = selected ? getFacadeStorybookLink(selected.slug) : null
  const currentStatus = selected ? statusFor(stored, selected.slug) : "needs_review"

  return (
    <StudioPageShell>
      <StudioSubpageHeader
        title="Facade gallery"
        description={
          <>
            Walk <code className="text-foreground-primary rounded bg-background-secondary px-1 py-0.5 text-xs">components/ui</code>{" "}
            facades one at a time. Previews run in this app (legacy theme on <code className="text-xs">{"<html>"}</code>
            ). Mark status in local storage; open{" "}
            <a
              href="http://localhost:6006"
              target="_blank"
              rel="noreferrer"
              className="text-foreground-primary font-medium underline-offset-4 hover:underline"
            >
              Untitled Storybook
            </a>{" "}
            for visual SoT when the in-app sample is missing or thin.
          </>
        }
      />

      <StudioToolbar>
        <StudioField label="Search" className="min-w-[min(100%,18rem)] max-w-none flex-[2_1_18rem]">
          <StudioSearchControl
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            placeholder="Search by slug, label, or path…"
          />
        </StudioField>
        <StudioField label="Status filter" className="max-w-none min-w-[10rem] shrink-0">
          <Select
            value={statusFilterSelectValue(filter)}
            onValueChange={v => setFilter(parseStatusFilterValue(v))}
          >
            {statusFilterSelectChildren}
          </Select>
        </StudioField>
        <p className="text-foreground-secondary min-w-0 basis-full pt-1 text-xs">
          {hydrated ? "Review state: localStorage" : "Loading review state…"} ·{" "}
          <code className="text-foreground-primary text-xs">{LS_KEY}</code>
        </p>
      </StudioToolbar>

      <div className="grid min-h-0 min-w-0 w-full flex-1 gap-6 lg:grid-cols-[minmax(200px,280px)_minmax(0,1fr)]">
        <aside className="border-border-default bg-background-primary flex min-h-0 min-w-0 w-full flex-col rounded-lg border shadow-none">
          <div className="border-border-default space-y-3 px-3 py-3">
            <p className="text-foreground-secondary text-xs font-medium">Components</p>
            <Select
              value={selectedSlug || undefined}
              onValueChange={setSelectedSlug}
              disabled={filtered.length === 0}
            >
              <SelectTrigger className="w-full min-w-0" size="sm">
                <SelectValue placeholder={filtered.length === 0 ? "No matches" : "Choose a component…"} />
              </SelectTrigger>
              <SelectContent>
                {filtered.map(f => (
                  <SelectItem key={f.slug} value={f.slug} textValue={f.label}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </aside>

        <section className="border-border-default bg-background-primary flex min-h-0 min-w-0 w-full flex-col rounded-lg border shadow-none">
          {selected ? (
            <>
              <div className="border-border-default flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
                <div className="min-w-0">
                  <h3 className="text-foreground-primary text-base font-medium">{selected.label}</h3>
                  <p className="text-foreground-tertiary font-mono text-xs">{selected.file}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" size="sm" variant="outline" disabled={!prevSlug} onClick={() => prevSlug && setSelectedSlug(prevSlug)}>
                    Prev
                  </Button>
                  <Button type="button" size="sm" variant="outline" disabled={!nextSlug} onClick={() => nextSlug && setSelectedSlug(nextSlug)}>
                    Next
                  </Button>
                </div>
              </div>

              <div className="border-border-default flex w-full min-w-0 flex-col gap-2 border-b px-4 py-3">
                <span className="text-foreground-secondary text-xs font-medium">Mark status</span>
                <Select value={currentStatus} onValueChange={v => setStatus(selected.slug, v as FacadeReviewStatus)}>
                  <SelectTrigger className="w-full max-w-md" size="sm">
                    <SelectValue placeholder="Set review status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approved / gold</SelectItem>
                    <SelectItem value="needs_review">Needs review</SelectItem>
                    <SelectItem value="in_progress">In progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-border-default space-y-2 border-b px-4 py-3">
                <p className="text-foreground-secondary text-xs font-medium">Storybook</p>
                {sb ? (
                  <>
                    <a
                      href={sb.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground-primary text-sm font-medium underline-offset-4 hover:underline"
                    >
                      {sb.isDeepLink ? "Open suggested story ↗" : "Open Storybook (localhost:6006) ↗"}
                    </a>
                    <p className="text-foreground-secondary text-xs leading-relaxed">{sb.sidebarHint}</p>
                  </>
                ) : null}
              </div>

              <div className="bg-background-primary flex min-h-[280px] min-w-0 w-full flex-1 flex-col overflow-visible p-6">
                <p className="text-foreground-secondary mb-4 text-xs font-medium uppercase tracking-wide">Preview</p>
                <div className="bg-background-primary border-border-default relative z-0 min-h-[200px] min-w-0 w-full max-w-none overflow-visible rounded-lg border p-6">
                  <div className="relative z-0 w-full min-w-0 max-w-none overflow-visible">
                    <FacadePreviewContent slug={selected.slug} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-foreground-secondary p-6 text-sm">No facade matches the current filters.</p>
          )}
        </section>
      </div>

      <StudioFooterMeta>
        Regenerate list: <code className="text-xs">pnpm uui:facade-manifest</code>
      </StudioFooterMeta>
    </StudioPageShell>
  )
}
