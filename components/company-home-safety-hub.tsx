"use client"

import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  RiMoreFill,
  RiUploadCloud2Fill,
  RiInformationLine,
  RiFullscreenLine,
  RiArrowRightSLine,
} from "react-icons/ri"

const labelMuted = { color: "var(--color-text-secondary)", fontSize: "var(--text-sm-size)" } as const

function SafetyWidgetCard({
  title,
  subtitle,
  badge,
  showInfo,
  headerAction,
  children,
  className,
}: {
  title: string
  subtitle?: string
  badge?: string
  showInfo?: boolean
  headerAction?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card
      className={cn(
        "flex h-full flex-col rounded-[var(--border-radius-lg)] border-0 bg-card p-[var(--spacing-card-padding)] shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      <div className="mb-[var(--spacing-stack-gap)] flex min-w-0 flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[length:var(--text-h3-size)] font-semibold leading-[var(--text-h3-lh)] text-foreground">
              {title}
            </h3>
            {showInfo && (
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
                aria-label="More information"
              >
                <RiInformationLine className="h-4 w-4" />
              </button>
            )}
            {badge && (
              <span
                className="rounded-[var(--border-radius-full)] px-2 py-0.5 text-[length:var(--text-sm-size)] font-medium"
                style={{
                  background: "var(--color-bg-feedback-success)",
                  color: "var(--color-text-success)",
                }}
              >
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-[length:var(--text-sm-size)] leading-[var(--text-body-lh)] text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-1">{headerAction}</div>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </Card>
  )
}

function WidgetChrome({
  showMenu,
  showFullscreen,
}: {
  showMenu?: boolean
  showFullscreen?: boolean
}) {
  return (
    <>
      <Button type="button" variant="outline" size="sm" className="font-normal">
        Action
      </Button>
      {showFullscreen && (
        <Button type="button" variant="ghost" size="icon" aria-label="Expand chart">
          <RiFullscreenLine className="h-4 w-4" />
        </Button>
      )}
      {showMenu && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" aria-label="Card menu">
              <RiMoreFill className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Configure</DropdownMenuItem>
            <DropdownMenuItem>Remove card</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}

const DOCS = [
  { name: "Standard Operating Procedures", file: "company_sop.pdf", date: "Mar 2, 2026" },
  { name: "Safety Plan 2026", file: "Safety Plan 2026.pdf", date: "Feb 18, 2026" },
  { name: "Emergency Response Plan", file: "erp.pdf", date: "Jan 8, 2026" },
]

const ORIENTATION_WEEKS = [
  { label: "Week of Mar 1–7", attended: 18, total: 20 },
  { label: "Week of Feb 22–28", attended: 19, total: 20 },
  { label: "Week of Feb 15–21", attended: 17, total: 19 },
]

const KEY_PERSONNEL = [
  { role: "Project Manager", name: "Jim Taylor", company: "Vertigo Construction" },
  { role: "Safety Manager", name: "Sarah Chen", company: "Vertigo Construction" },
]

const TIME_LOST_MONTHS = [
  { m: "Jan", projected: 42, actual: 38 },
  { m: "Feb", projected: 48, actual: 44 },
  { m: "Mar", projected: 52, actual: 55 },
  { m: "Apr", projected: 45, actual: 41 },
]

const INCIDENT_DATES = ["3/18", "3/20", "3/22", "3/24", "3/26"]
const INCIDENT_STACK = [
  { key: "acme", label: "Acme Builders", color: "var(--color-chart-9)", values: [2, 1, 3, 2, 1] },
  { key: "ridge", label: "Ridge Co.", color: "var(--color-chart-6)", values: [1, 2, 0, 1, 2] },
  { key: "harbor", label: "Harbor Electric", color: "var(--color-chart-7)", values: [0, 1, 1, 0, 1] },
  { key: "summit", label: "Summit Steel", color: "var(--color-chart-4)", values: [1, 0, 1, 1, 0] },
]

const TOOLBOX_TOPICS = [
  { topic: "Fall Protection", attended: 16, total: 18 },
  { topic: "Electrical Safety", attended: 14, total: 17 },
  { topic: "Heat Illness", attended: 18, total: 19 },
  { topic: "Crane Awareness", attended: 12, total: 16 },
]

const HEATMAP_PROJECTS = ["Vortex Tower", "Westwood Plaza", "Button Factory", "Burma Heights"] as const

const HEATMAP_LEGEND = [
  { min: 95, max: 100, label: "Excellent", bg: "rgb(22 101 52)", fg: "rgb(255 255 255)" },
  { min: 85, max: 94, label: "Good", bg: "rgb(187 247 208)", fg: "rgb(22 101 52)" },
  { min: 70, max: 84, label: "Fair", bg: "rgb(254 249 195)", fg: "rgb(113 59 18)" },
  { min: 50, max: 69, label: "Poor", bg: "rgb(254 215 170)", fg: "rgb(119 41 23)" },
  { min: 30, max: 49, label: "Critical", bg: "rgb(254 202 202)", fg: "rgb(127 29 29)" },
  { min: 0, max: 29, label: "Severe", bg: "rgb(185 28 28)", fg: "rgb(255 255 255)" },
] as const

function heatmapScoreStyle(score: number): { background: string; color: string } {
  const clamped = Math.max(0, Math.min(100, Math.round(score)))
  for (const tier of HEATMAP_LEGEND) {
    if (clamped >= tier.min && clamped <= tier.max) {
      return { background: tier.bg, color: tier.fg }
    }
  }
  return { background: HEATMAP_LEGEND[5].bg, color: HEATMAP_LEGEND[5].fg }
}

const HEATMAP_ROWS: { category: string; scores: readonly [number, number, number, number] }[] = [
  { category: "Ladders", scores: [45, 38, 33, 89] },
  { category: "Chemical", scores: [72, 91, 68, 88] },
  { category: "Silica Dust", scores: [41, 55, 62, 77] },
  { category: "Electrical", scores: [85, 88, 50, 95] },
  { category: "Struck By", scores: [78, 82, 44, 91] },
  { category: "Scaffolding", scores: [63, 70, 58, 84] },
  { category: "Falls", scores: [52, 48, 36, 72] },
  { category: "Confined Space", scores: [92, 96, 88, 99] },
  { category: "Heat Stress", scores: [81, 74, 69, 86] },
  { category: "Trenching", scores: [100, 89, 100, 100] },
]

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const rad = (d: number) => (d * Math.PI) / 180
  const x1 = cx + r * Math.cos(rad(startDeg))
  const y1 = cy - r * Math.sin(rad(startDeg))
  const x2 = cx + r * Math.cos(rad(endDeg))
  const y2 = cy - r * Math.sin(rad(endDeg))
  const sweep = endDeg < startDeg ? 1 : 0
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`
}

function HazardGauge() {
  const cx = 80
  const cy = 78
  const r = 52
  const stroke = 14
  const segs = [
    { pct: 0.52, color: "var(--color-chart-7)", label: "Complete" },
    { pct: 0.31, color: "var(--color-chart-8)", label: "In Progress" },
    { pct: 0.17, color: "var(--color-chart-9)", label: "Open" },
  ]
  let angle = 180
  const paths: { d: string; color: string }[] = []
  for (const s of segs) {
    const span = 180 * s.pct
    const next = angle - span
    paths.push({ d: describeArc(cx, cy, r, angle, next), color: s.color })
    angle = next
  }
  return (
    <div className="flex flex-col items-center pt-1">
      <div className="relative h-[92px] w-full max-w-[200px]">
        <svg viewBox="0 0 160 90" className="h-full w-full" aria-hidden>
          <path
            d={describeArc(cx, cy, r, 180, 0)}
            fill="none"
            stroke="var(--color-bg-tertiary)"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          {paths.map((p, i) => (
            <path
              key={i}
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeWidth={stroke}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-[length:var(--text-h2-size)] font-bold text-foreground">45</span>
          <span style={labelMuted}>Company total</span>
        </div>
      </div>
      <ul className="mt-3 w-full space-y-1.5">
        {segs.map((s) => (
          <li key={s.label} className="flex items-center justify-between text-[length:var(--text-sm-size)]">
            <span className="flex items-center gap-2 text-foreground">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
            <span className="font-medium tabular-nums text-muted-foreground">
              {(s.pct * 100).toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StackedMonthBars() {
  const max = 60
  const barH = 140
  return (
    <div className="flex h-[200px] flex-col">
      <div className="relative flex flex-1 items-end gap-3 border-b border-border pl-8">
        <span
          className="pointer-events-none absolute left-0 top-1/2 text-[length:var(--text-sm-size)] text-muted-foreground"
          style={{ transform: "translateY(-50%) rotate(-90deg)", transformOrigin: "center center" }}
        >
          Days
        </span>
        {TIME_LOST_MONTHS.map((row) => {
          const hProj = (row.projected / max) * barH
          const hAct = (row.actual / max) * barH
          return (
            <div key={row.m} className="flex flex-1 flex-col items-center justify-end">
              <div className="flex h-[140px] items-end justify-center gap-1">
                <div
                  className="w-[42%] max-w-[14px] rounded-t-sm"
                  style={{
                    height: Math.max(hProj, 4),
                    background: "var(--color-chart-9-subtle)",
                    border: "1px solid var(--color-chart-9)",
                  }}
                  title={`Projected: ${row.projected} days`}
                />
                <div
                  className="w-[42%] max-w-[14px] rounded-t-sm"
                  style={{
                    height: Math.max(hAct, 4),
                    background: "var(--color-chart-8-subtle)",
                    border: "1px solid var(--color-chart-8)",
                  }}
                  title={`Actual: ${row.actual} days`}
                />
              </div>
              <span className="mt-2 text-[length:var(--text-sm-size)] text-muted-foreground">{row.m}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-4 text-[length:var(--text-sm-size)]">
        <span className="flex items-center gap-2">
          <span className="h-2 w-3 rounded-sm bg-[var(--color-chart-9)]" />
          Projected work (days)
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-3 rounded-sm bg-[var(--color-chart-8)]" />
          Actual work (days)
        </span>
      </div>
    </div>
  )
}

function IncidentsComboChart() {
  const maxY = 12
  const totals = INCIDENT_DATES.map((_, i) =>
    INCIDENT_STACK.reduce((s, row) => s + row.values[i], 0),
  )
  const barW = 28
  const chartH = 120
  const padL = 28
  const padB = 24
  const innerW = INCIDENT_DATES.length * (barW + 8)
  const w = padL + innerW + 8
  const h = chartH + padB

  const linePoints = totals
    .map((t, i) => {
      const x = padL + i * (barW + 8) + barW / 2
      const y = chartH - (t / maxY) * (chartH - 8)
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="overflow-x-auto">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="mx-auto max-w-full">
        {[0, 4, 8, 12].map((tick) => {
          const y = chartH - (tick / maxY) * (chartH - 8)
          return (
            <g key={tick}>
              <line x1={padL - 4} y1={y} x2={w} y2={y} stroke="var(--color-chart-gridline)" strokeWidth={1} />
              <text x={0} y={y + 4} style={{ ...labelMuted, fontSize: 10 }}>
                {tick}
              </text>
            </g>
          )
        })}
        {INCIDENT_DATES.map((d, i) => {
          let yAcc = chartH
          return (
            <g key={d}>
              {INCIDENT_STACK.map((row) => {
                const v = row.values[i]
                const segH = (v / maxY) * (chartH - 8)
                yAcc -= segH
                return (
                  <rect
                    key={row.key}
                    x={padL + i * (barW + 8)}
                    y={yAcc}
                    width={barW}
                    height={Math.max(segH, 0)}
                    fill={row.color}
                    opacity={0.92}
                  />
                )
              })}
              <text
                x={padL + i * (barW + 8) + barW / 2}
                y={chartH + 16}
                textAnchor="middle"
                style={{ ...labelMuted, fontSize: 10 }}
              >
                {d}
              </text>
            </g>
          )
        })}
        <polyline
          fill="none"
          stroke="var(--color-chart-9)"
          strokeWidth={2}
          points={linePoints}
        />
        {totals.map((t, i) => {
          const x = padL + i * (barW + 8) + barW / 2
          const y = chartH - (t / maxY) * (chartH - 8)
          return <circle key={i} cx={x} cy={y} r={3} fill="var(--color-chart-9)" />
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[length:var(--text-xs-size)] text-muted-foreground">
        {INCIDENT_STACK.map((row) => (
          <span key={row.key} className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm" style={{ background: row.color }} />
            {row.label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1">
          <span className="h-0.5 w-3 bg-[var(--color-chart-9)]" />
          Total incidents
        </span>
      </div>
    </div>
  )
}

function ToolboxStackedBars() {
  const maxP = 20
  return (
    <div className="space-y-3">
      {TOOLBOX_TOPICS.map((row) => {
        const wAtt = (row.attended / maxP) * 100
        const wTot = ((row.total - row.attended) / maxP) * 100
        return (
          <div key={row.topic}>
            <div className="mb-1 flex justify-between text-[length:var(--text-sm-size)]">
              <span className="truncate font-medium text-foreground">{row.topic}</span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {row.attended}/{row.total}
              </span>
            </div>
            <div
              className="flex h-3 overflow-hidden rounded-full"
              style={{ background: "var(--color-bg-tertiary)" }}
            >
              <div className="h-full bg-[var(--color-chart-9)]" style={{ width: `${wAtt}%` }} />
              <div
                className="h-full bg-[var(--color-chart-8-subtle)]"
                style={{ width: `${wTot}%`, borderLeft: "1px solid var(--color-chart-8)" }}
              />
            </div>
          </div>
        )
      })}
      <div className="flex flex-wrap gap-4 pt-1 text-[length:var(--text-sm-size)]">
        <span className="flex items-center gap-2">
          <span className="h-2 w-3 rounded-sm bg-[var(--color-chart-9)]" />
          Attended
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-3 rounded-sm bg-[var(--color-chart-8-subtle)] ring-1 ring-[var(--color-chart-8)]" />
          Total
        </span>
      </div>
    </div>
  )
}

function RiskRatioHeatmapCard() {
  const [dateRange, setDateRange] = useState("30d")
  const [incidentWeight, setIncidentWeight] = useState("1x")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [hazardSummaries, setHazardSummaries] = useState<Record<string, string>>({})
  const [hazardSummaryError, setHazardSummaryError] = useState<Record<string, string>>({})
  const hazardFetchStarted = useRef<Set<string>>(new Set())

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })
  }

  const loadHazardSummary = useCallback((category: string) => {
    if (hazardFetchStarted.current.has(category)) return
    hazardFetchStarted.current.add(category)
    setHazardSummaryError((prev) => {
      const next = { ...prev }
      delete next[category]
      return next
    })

    const row = HEATMAP_ROWS.find((r) => r.category === category)
    if (!row) {
      hazardFetchStarted.current.delete(category)
      return
    }

    ;(async () => {
      try {
        const res = await fetch("/api/hazard-category-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category,
            scores: [...row.scores],
            projects: [...HEATMAP_PROJECTS],
          }),
        })
        if (!res.ok) throw new Error("Request failed")
        const reader = res.body?.getReader()
        if (!reader) throw new Error("No response body")
        const decoder = new TextDecoder()
        let acc = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          acc += decoder.decode(value, { stream: true })
          setHazardSummaries((prev) => ({ ...prev, [category]: acc }))
        }
      } catch {
        hazardFetchStarted.current.delete(category)
        setHazardSummaryError((prev) => ({
          ...prev,
          [category]: "Summary could not be generated. Try again.",
        }))
      }
    })()
  }, [])

  useEffect(() => {
    expandedCategories.forEach((category) => loadHazardSummary(category))
  }, [expandedCategories, loadHazardSummary])

  return (
    <SafetyWidgetCard
      title="Risk-Ratio Heatmap"
      subtitle="Identifying hot spots by hazard category and project"
      headerAction={
        <>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger
              size="sm"
              className="h-8 w-[9.5rem] shrink-0 font-normal"
              aria-label="Date range"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={incidentWeight} onValueChange={setIncidentWeight}>
            <SelectTrigger
              size="sm"
              className="h-8 w-[5.5rem] shrink-0 font-normal"
              aria-label="Incident weight"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1x">1x</SelectItem>
              <SelectItem value="2x">2x</SelectItem>
              <SelectItem value="3x">3x</SelectItem>
            </SelectContent>
          </Select>
          <WidgetChrome showFullscreen showMenu />
        </>
      }
    >
      <div className="flex min-h-0 flex-col gap-4">
        <p className="text-[length:var(--text-sm-size)] leading-[var(--text-body-lh)] text-muted-foreground">
          Standard weighting — Incidents and observations weighted equally.
        </p>

        <div className="flex flex-wrap gap-x-3 gap-y-2">
          {HEATMAP_LEGEND.map((tier) => (
            <span
              key={`${tier.min}-${tier.max}`}
              className="inline-flex items-center gap-1.5 rounded-[var(--border-radius-md)] border border-border/60 px-2 py-1 text-[length:var(--text-xs-size)]"
            >
              <span
                className="h-3.5 min-w-[2.75rem] rounded-sm"
                style={{ background: tier.bg }}
                aria-hidden
              />
              <span className="tabular-nums text-foreground">
                {tier.min}–{tier.max}
              </span>
              <span className="text-muted-foreground">({tier.label})</span>
            </span>
          ))}
        </div>

        <div className="min-w-0 overflow-x-auto rounded-[var(--border-radius-md)] border border-border">
          <table className="w-full min-w-[640px] border-collapse text-[length:var(--text-sm-size)]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2.5 text-left text-[length:var(--text-xs-size)] font-semibold uppercase tracking-wide text-muted-foreground">
                  Hazard category
                </th>
                {HEATMAP_PROJECTS.map((p) => (
                  <th
                    key={p}
                    className="px-2 py-2.5 text-center text-[length:var(--text-xs-size)] font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HEATMAP_ROWS.map((row) => {
                const isOpen = expandedCategories.has(row.category)
                return (
                  <Fragment key={row.category}>
                    <tr className="border-b border-border last:border-b-0">
                      <td className="px-1 py-1.5">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => toggleCategory(row.category)}
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-expanded={isOpen}
                            aria-label={
                              isOpen
                                ? `Collapse details for ${row.category}`
                                : `Expand details for ${row.category}`
                            }
                          >
                            <RiArrowRightSLine
                              className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")}
                              aria-hidden
                            />
                          </button>
                          <span className="font-medium text-foreground">{row.category}</span>
                        </div>
                      </td>
                      {row.scores.map((score, i) => {
                        const cellStyle = heatmapScoreStyle(score)
                        return (
                          <td key={HEATMAP_PROJECTS[i]} className="px-2 py-1.5 text-center align-middle">
                            <span
                              className="inline-flex min-w-[2.5rem] justify-center rounded-[var(--border-radius-md)] px-2.5 py-1 text-center text-sm font-semibold tabular-nums"
                              style={cellStyle}
                            >
                              {score}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                    {isOpen && (
                      <tr className="border-b border-border bg-muted/25 last:border-b-0">
                        <td
                          colSpan={HEATMAP_PROJECTS.length + 1}
                          className="px-4 py-3 text-[length:var(--text-sm-size)]"
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 text-[length:var(--text-xs-size)] font-semibold uppercase tracking-wide text-muted-foreground">
                                <Sparkles className="h-3.5 w-3.5 text-foreground/70" aria-hidden />
                                AI summary
                              </span>
                              <span className="text-muted-foreground">·</span>
                              <span className="text-[length:var(--text-xs-size)] text-muted-foreground">
                                Contributing conditions and behaviors
                              </span>
                            </div>
                            {hazardSummaryError[row.category] ? (
                              <div className="flex flex-wrap items-center gap-3">
                                <p className="text-muted-foreground">{hazardSummaryError[row.category]}</p>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-7 font-normal"
                                  onClick={() => {
                                    hazardFetchStarted.current.delete(row.category)
                                    setHazardSummaryError((prev) => {
                                      const next = { ...prev }
                                      delete next[row.category]
                                      return next
                                    })
                                    loadHazardSummary(row.category)
                                  }}
                                >
                                  Try again
                                </Button>
                              </div>
                            ) : hazardSummaries[row.category] ? (
                              <p className="leading-[var(--text-body-lh)] text-foreground">
                                {hazardSummaries[row.category]}
                              </p>
                            ) : (
                              <p className="inline-flex items-center gap-2 text-muted-foreground">
                                <Loader2
                                  className="h-4 w-4 shrink-0 animate-spin"
                                  aria-hidden
                                />
                                <span>Generating summary…</span>
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-2 border-t border-border pt-4 text-[length:var(--text-sm-size)] leading-[var(--text-body-lh)] text-muted-foreground">
          <p className="font-mono text-[length:var(--text-xs-size)] text-foreground/90">
            Safety Score = 100 × Observations / (Observations + Incidents × Weight)
          </p>
          <p>
            Higher scores (green) indicate more proactive hazard identification relative to incidents.
            Lower scores (orange and red) suggest more incidents relative to observations and may need
            intervention. Expand a row to review contributing conditions and behaviors.
          </p>
        </div>
      </div>
    </SafetyWidgetCard>
  )
}

export function SafetyHubTab() {
  const [sortBy, setSortBy] = useState("date")

  return (
      <div className="grid grid-cols-1 gap-[var(--spacing-card-padding)] lg:grid-cols-3">
      <div className="lg:col-span-3">
        <RiskRatioHeatmapCard />
      </div>
      {/* Column 1 */}
      <div className="flex flex-col gap-[var(--spacing-card-padding)]">
        <SafetyWidgetCard
          title="Company Safety Documentation"
          showInfo
          headerAction={
            <>
              <Button type="button" variant="outline" size="sm" className="font-normal" iconLeading={RiUploadCloud2Fill}>
                Upload
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" aria-label="Card menu">
                    <RiMoreFill className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Configure</DropdownMenuItem>
                  <DropdownMenuItem>Remove card</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          }
        >
          <ul className="divide-y divide-border">
            {DOCS.map((d) => (
              <li key={d.file} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
                <div className="min-w-0">
                  <p className="truncate text-[length:var(--text-body-size)] font-medium text-foreground">
                    {d.name}
                  </p>
                  <p style={labelMuted} className="truncate">
                    {d.file} · {d.date}
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" className="shrink-0 font-normal">
                  View
                </Button>
              </li>
            ))}
          </ul>
          <div
            className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3"
            style={{ fontSize: "var(--text-sm-size)" }}
          >
            <div className="flex items-center gap-2">
              <span style={labelMuted}>Sort by</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger size="sm" className="h-8 w-[9rem] min-w-0 max-w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date uploaded</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <span className="text-muted-foreground">1–10 of 50 · Page 1</span>
          </div>
        </SafetyWidgetCard>

        <SafetyWidgetCard
          title="Orientation Attendance"
          badge="5 weeks"
          showInfo
          headerAction={<WidgetChrome showFullscreen />}
        >
          <ul className="space-y-2">
            {ORIENTATION_WEEKS.map((w) => (
              <li
                key={w.label}
                className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--border-radius-md)] bg-muted/40 px-3 py-2"
              >
                <div>
                  <p className="text-[length:var(--text-body-size)] font-medium text-foreground">{w.label}</p>
                  <p style={labelMuted}>
                    {w.attended}/{w.total} people attended
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" className="font-normal">
                  Action
                </Button>
              </li>
            ))}
          </ul>
        </SafetyWidgetCard>

        <SafetyWidgetCard title="Daily Hazard Assessments" headerAction={<WidgetChrome showMenu />}>
          <HazardGauge />
        </SafetyWidgetCard>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-[var(--spacing-card-padding)]">
        <SafetyWidgetCard
          title="Key Safety Personnel"
          showInfo
          headerAction={
            <>
              <Button type="button" variant="outline" size="sm" className="font-normal">
                View all
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" aria-label="Card menu">
                    <RiMoreFill className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Configure</DropdownMenuItem>
                  <DropdownMenuItem>Remove card</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          }
        >
          <ul className="space-y-3">
            {KEY_PERSONNEL.map((p) => (
              <li
                key={p.role}
                className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--border-radius-md)] border border-border px-3 py-3"
              >
                <div className="min-w-0">
                  <p style={labelMuted}>{p.role}</p>
                  <p className="text-[length:var(--text-body-size)] font-semibold text-foreground">{p.name}</p>
                  <p style={labelMuted}>{p.company}</p>
                </div>
                <Button type="button" variant="outline" size="sm" className="shrink-0 font-normal">
                  See details
                </Button>
              </li>
            ))}
          </ul>
        </SafetyWidgetCard>

        <SafetyWidgetCard
          title="Time Lost to Injury"
          subtitle="Projected vs. actual work capacity by month"
          headerAction={<WidgetChrome showFullscreen showMenu />}
        >
          <StackedMonthBars />
        </SafetyWidgetCard>

        <SafetyWidgetCard
          title="Incidents per Manpower Log"
          subtitle="Incidents by contractor over the last nine days"
          headerAction={<WidgetChrome showFullscreen showMenu />}
        >
          <IncidentsComboChart />
        </SafetyWidgetCard>
      </div>

      {/* Column 3 */}
      <div className="flex flex-col gap-[var(--spacing-card-padding)]">
        <SafetyWidgetCard title="Claimed to Date" headerAction={<WidgetChrome showMenu />}>
          <div className="space-y-4">
            <Select defaultValue="qf1">
              <SelectTrigger size="sm" className="h-8 max-w-xs">
                <SelectValue placeholder="Quick filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qf1">Quick filter 1</SelectItem>
                <SelectItem value="qf2">Quick filter 2</SelectItem>
              </SelectContent>
            </Select>
            <div>
              <p className="text-[length:var(--text-h1-size)] font-bold leading-tight text-foreground">$924M</p>
              <p className="mt-1 text-[length:var(--text-sm-size)] text-muted-foreground">0.0% vs. prior period</p>
            </div>
          </div>
        </SafetyWidgetCard>

        <SafetyWidgetCard
          title="Toolbox Talk Attendance"
          badge="5 talks"
          showInfo
          subtitle="Attendance by topic"
          headerAction={<WidgetChrome showFullscreen showMenu />}
        >
          <ToolboxStackedBars />
        </SafetyWidgetCard>
      </div>
    </div>
  )
}
