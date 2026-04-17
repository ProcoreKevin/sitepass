"use client"

import { useState, useEffect } from "react"
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
  RiMoreFill,
  RiMapPinLine,
  RiCalendarLine,
  RiExternalLinkLine,
  RiFileTextLine,
  RiAlertLine,
  RiCheckboxLine,
  RiCalendar2Line,
  RiTimeLine,
} from "react-icons/ri"
import { useNavigation } from "@/lib/navigation-context"
import { getProjectData, type OpenItem, type TimelinePhase } from "@/lib/project-data"

// ─── Icon map for open item types ────────────────────────────────────────────

function ItemTypeIcon({ type }: { type: string }) {
  const cls = "h-3.5 w-3.5"
  switch (type) {
    case "RFI":   return <RiFileTextLine className={cls} />
    case "ISSUE": return <RiAlertLine className={cls} />
    case "SUB":   return <RiCheckboxLine className={cls} />
    case "MTG":   return <RiCalendar2Line className={cls} />
    case "OBS":   return <RiTimeLine className={cls} />
    default:      return <RiFileTextLine className={cls} />
  }
}

// ─── Dashboard Card Wrapper ───────────────────────────────────────────────────

function DashboardCard({
  title,
  action,
  headerExtra,
  children,
  className,
}: {
  title: string
  action?: { label: string; onClick?: () => void }
  headerExtra?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn(className)}>
      <Card className="bg-card rounded-[var(--border-radius-lg)] border-0 shadow-[var(--shadow-sm)] p-[var(--spacing-card-padding)] h-full flex flex-col">
        <div className="flex items-center justify-between mb-[var(--spacing-stack-gap)] flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[length:var(--text-h3-size)] font-semibold leading-[var(--text-h3-lh)] tracking-[var(--text-h3-ls)] text-foreground">
              {title}
            </h3>
            {headerExtra}
          </div>
          <div className="flex items-center gap-[var(--spacing-inline-gap)]">
            {action && (
              <Button variant="outline" size="sm" onClick={action.onClick}>
                {action.label}
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <RiMoreFill className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Configure</DropdownMenuItem>
                <DropdownMenuItem>Remove card</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex-1 min-h-0">{children}</div>
      </Card>
    </div>
  )
}

// ─── Status badge helpers ─────────────────────────────────────────────────────

function ItemStatusBadge({ variant, label }: { variant: OpenItem["statusVariant"]; label: string }) {
  const styles: Record<OpenItem["statusVariant"], string> = {
    "ready":       "bg-[var(--color-bg-feedback-success)] text-[var(--color-text-success)]",
    "in-progress": "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]",
    "open":        "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]",
    "overdue":     "bg-[var(--color-bg-feedback-danger)] text-[var(--color-text-danger)]",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-[var(--border-radius-sm)] text-[length:var(--text-sm-size)] font-semibold tracking-wide whitespace-nowrap",
        styles[variant]
      )}
    >
      {label}
    </span>
  )
}

function TimelineStatusChip({ status, label }: { status: TimelinePhase["status"]; label: string }) {
  const dot: Record<TimelinePhase["status"], string> = {
    "on-track": "bg-[var(--color-chart-2)]",
    "planning": "bg-[var(--color-chart-1)]",
    "bidding":  "bg-[var(--color-border-input-focus)]",
  }
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("h-2 w-2 rounded-full flex-shrink-0", dot[status])} />
      <span className="text-[length:var(--text-sm-size)] text-muted-foreground">{label}</span>
    </div>
  )
}

// ─── Project Setup Card ───────────────────────────────────────────────────────

function ProjectSetupCard({ className }: { className?: string }) {
  const { currentProject } = useNavigation()
  const data = getProjectData(currentProject?.id ?? "burnham-park-dc")
  const { setup } = data
  const pct = Math.round((setup.complete / setup.total) * 100)

  return (
    <DashboardCard
      className={className}
      title="Project Setup"
      action={{ label: "Open Guide", onClick: () => {} }}
    >
      <p className="font-semibold mb-1" style={{ fontSize: "var(--text-body-size)", color: "var(--color-text-primary)" }}>
        Up next: {setup.nextTask}
      </p>
      <p className="mb-4" style={{ fontSize: "var(--text-sm-size)", color: "var(--color-text-secondary)", lineHeight: "1.5" }}>
        {setup.nextTaskDesc}
      </p>
      <div className="flex items-end justify-between mb-2">
        <span style={{ fontSize: "var(--text-h1-size)", fontWeight: 700, color: "var(--color-text-primary)", lineHeight: 1 }}>
          {String(setup.complete).padStart(2, "0")}
        </span>
        <span style={{ fontSize: "var(--text-h1-size)", fontWeight: 700, color: "var(--color-text-secondary)", lineHeight: 1 }}>
          {setup.total}
        </span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: "var(--color-border)" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "var(--color-text-primary)" }} />
      </div>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: "var(--text-sm-size)", color: "var(--color-text-secondary)" }}>Complete</span>
        <span style={{ fontSize: "var(--text-sm-size)", color: "var(--color-text-secondary)" }}>To Go</span>
      </div>
    </DashboardCard>
  )
}

// ─── Project Timeline Card ────────────────────────────────────────────────────

function ProjectTimelineCard({ className }: { className?: string }) {
  const { currentProject } = useNavigation()
  const data = getProjectData(currentProject?.id ?? "burnham-park-dc")
  const { timeline } = data
  const months = ["Month 1", "Month 2", "Month 3", "Month 4"]

  return (
    <DashboardCard
      className={className}
      title="Project Timeline"
      headerExtra={
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="14" fill="none" stroke="var(--color-border)" strokeWidth="5" />
            <circle
              cx="18" cy="18" r="14" fill="none"
              stroke="var(--color-chart-2)" strokeWidth="5"
              strokeDasharray={`${(timeline.percentComplete / 100) * 88} 88`}
              strokeDashoffset="-22"
              transform="rotate(-90 18 18)"
            />
          </svg>
          <span style={{ fontSize: "var(--text-body-size)", color: "var(--color-text-secondary)" }}>
            {timeline.percentComplete}% Complete
          </span>
        </div>
      }
      action={{ label: "View Schedule", onClick: () => {} }}
    >
      <div className="grid mb-2" style={{ gridTemplateColumns: "180px repeat(4, 1fr)" }}>
        <div />
        {months.map((m) => (
          <div
            key={m}
            className="text-center"
            style={{ fontSize: "var(--text-sm-size)", fontWeight: 600, color: "var(--color-text-secondary)" }}
          >
            {m}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        {timeline.phases.map((phase, i) => (
          <div
            key={phase.id}
            className="grid items-center"
            style={{
              gridTemplateColumns: "180px repeat(4, 1fr)",
              borderTop: i > 0 ? "1px solid var(--color-border)" : "none",
              paddingTop: i > 0 ? "6px" : 0,
            }}
          >
            <div className="flex items-center justify-between pr-3">
              <TimelineStatusChip status={phase.status} label={phase.statusLabel} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <RiMoreFill className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View details</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div
              className="rounded"
              style={{
                gridColumn: `${i + 2} / span ${4 - i}`,
                height: 28,
                backgroundColor:
                  phase.status === "on-track" ? "var(--color-bg-feedback-success)"
                  : phase.status === "planning" ? "var(--color-bg-feedback-warning)"
                  : "var(--color-bg-feedback-info)",
                display: "flex",
                alignItems: "center",
                paddingLeft: 8,
              }}
            >
              <span
                style={{
                  fontSize: "var(--text-sm-size)",
                  fontWeight: 500,
                  color:
                    phase.status === "on-track" ? "var(--color-text-success)"
                    : phase.status === "planning" ? "var(--color-text-warning)"
                    : "var(--color-text-info)",
                }}
              >
                {phase.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

// ─── Summary Card ─────────────────────────────────────────────────────────────

function SummaryCard({ className }: { className?: string }) {
  const { currentProject } = useNavigation()
  const data = getProjectData(currentProject?.id ?? "burnham-park-dc")
  const { metrics } = data.summary

  return (
    <DashboardCard
      className={className}
      title="Summary"
      headerExtra={
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-auto rounded-full border-asphalt-400 bg-transparent px-2 py-0.5 text-xs font-medium text-asphalt-900 shadow-none hover:bg-asphalt-100"
        >
          Insights
        </Button>
      }
    >
      <div className="grid grid-cols-4 gap-x-4 gap-y-4">
        {metrics.map((m) => (
          <div key={m.label}>
            <p className="mb-0.5" style={{ fontSize: "var(--text-sm-size)", color: "var(--color-text-secondary)" }}>
              {m.label}
            </p>
            <p
              style={{
                fontSize: "var(--text-h2-size)",
                fontWeight: 700,
                lineHeight: "var(--text-h2-lh)",
                color:
                  m.variant === "danger"   ? "var(--color-text-danger)"
                  : m.variant === "success" ? "var(--color-text-success)"
                  : "var(--color-text-primary)",
              }}
            >
              {m.value}
            </p>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

// ─── Change Event by Reason Card ──────────────────────────────────────────────

function ChangeEventByReasonCard({ className }: { className?: string }) {
  const { currentProject } = useNavigation()
  const data = getProjectData(currentProject?.id ?? "burnham-park-dc")
  const reasons = data.changeReasons
  const total = reasons.reduce((s, d) => s + d.count, 0)
  const circumference = 2 * Math.PI * 45
  let offset = 0
  const segments = reasons.map((d) => {
    const dash = (d.count / total) * circumference
    const seg = { ...d, dash, offset }
    offset += dash
    return seg
  })

  return (
    <DashboardCard className={className} title="Change Event by Change Reason">
      <div className="flex items-center gap-6">
        <div className="relative flex-shrink-0">
          <svg viewBox="0 0 120 120" className="h-32 w-32">
            <circle cx="60" cy="60" r="45" fill="none" stroke="var(--color-border)" strokeWidth="18" />
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx="60" cy="60" r="45" fill="none"
                stroke={seg.color}
                strokeWidth="18"
                strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                strokeDashoffset={-seg.offset}
                transform="rotate(-90 60 60)"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span style={{ fontSize: "var(--text-h1-size)", fontWeight: 700, color: "var(--color-text-primary)" }}>
              {total}
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {reasons.map((d) => (
            <div key={d.label} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span style={{ fontSize: "var(--text-body-size)", color: "var(--color-text-primary)" }}>
                {d.count} {d.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  )
}

// ─── Open Items Card ──────────────────────────────────────────────────────────

function OpenItemsCard({ className }: { className?: string }) {
  const { currentProject } = useNavigation()
  const data = getProjectData(currentProject?.id ?? "burnham-park-dc")
  const [tab, setTab] = useState<"recent" | "overdue" | "due-today" | "due-soon">("recent")
  const tabs = [
    { id: "recent",    label: "Recent" },
    { id: "overdue",   label: "Overdue" },
    { id: "due-today", label: "Due Today" },
    { id: "due-soon",  label: "Due Soon" },
  ] as const

  const items = tab === "overdue"
    ? data.openItems.filter(i => i.statusVariant === "overdue")
    : data.openItems

  return (
    <DashboardCard className={className} title="Open Items">
      <div className="flex gap-4 border-b mb-3 -mt-1" style={{ borderColor: "var(--color-border)" }}>
        {tabs.map((t) => (
          <Button
            key={t.id}
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-auto rounded-none border-b-2 border-transparent px-1 pb-2 text-[length:var(--text-body-size)] font-medium shadow-none ring-0 transition-colors",
              tab === t.id
                ? "border-[var(--color-text-primary)] text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </Button>
        ))}
      </div>
      <div className="flex flex-col">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No items in this view.</p>
        ) : items.map((item, i) => (
          <div
            key={item.id}
            className="flex items-center gap-3 py-2"
            style={{ borderTop: i > 0 ? "1px solid var(--color-border)" : "none" }}
          >
            <span className="flex-shrink-0" style={{ color: "var(--color-text-secondary)" }}>
              <ItemTypeIcon type={item.typeIcon} />
            </span>
            <span
              className="flex-1 truncate"
              style={{ fontSize: "var(--text-body-size)", color: "var(--color-text-primary)", fontWeight: 500 }}
            >
              {item.description}
            </span>
            <span
              className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full"
              style={{ fontSize: "var(--text-sm-size)", color: "var(--color-text-info)", backgroundColor: "var(--color-bg-feedback-info)" }}
            >
              <RiCalendarLine className="h-3 w-3" />
              {item.date}
            </span>
            <ItemStatusBadge variant={item.statusVariant} label={item.statusLabel} />
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

// ─── Open Change Events Card ──────────────────────────────────────────────────

function OpenChangeEventsCard({ className }: { className?: string }) {
  const { currentProject } = useNavigation()
  const data = getProjectData(currentProject?.id ?? "burnham-park-dc")

  return (
    <DashboardCard className={className} title="Open Change Events">
      <div className="flex flex-col">
        {data.changeEvents.map((evt, i) => (
          <div
            key={evt.id}
            className="flex items-center justify-between gap-3 py-2"
            style={{ borderTop: i > 0 ? "1px solid var(--color-border)" : "none" }}
          >
            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ fontSize: "var(--text-body-size)", color: "var(--color-text-primary)", fontWeight: 500 }}>
                {evt.title}
              </p>
              <p style={{ fontSize: "var(--text-sm-size)", color: "var(--color-text-secondary)" }}>
                Total {evt.total}
              </p>
            </div>
            <Button variant="outline" size="sm">View</Button>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

// ─── Project Hero ─────────────────────────────────────────────────────────────

function ProjectHero() {
  const { currentProject } = useNavigation()
  const data = getProjectData(currentProject?.id ?? "burnham-park-dc")
  const projectName = currentProject?.name ?? "Burnham Park Data Center"
  const location = currentProject?.location ?? "Austin, TX"

  return (
    <div
      className="border-b px-[var(--spacing-card-padding)] py-3"
      style={{ background: "var(--color-bg-primary)", borderColor: "var(--color-border)" }}
    >
      <div className="flex items-start gap-4 mb-3">
        {/* Thumbnail */}
        <div
          className="flex-shrink-0 rounded overflow-hidden flex items-center justify-center"
          style={{
            width: 64,
            height: 64,
            background: `linear-gradient(135deg, ${data.thumbGradient[0]} 0%, ${data.thumbGradient[1]} 100%)`,
          }}
        >
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", textAlign: "center", padding: 4 }}>
            {data.thumbLabel}
          </span>
        </div>

        {/* Name + address */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 style={{ fontSize: "var(--text-h1-size)", fontWeight: 700, color: "var(--color-text-primary)", lineHeight: "var(--text-h1-lh)" }}>
              {projectName}
            </h1>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-[var(--color-text-info)]"
              aria-label="Project information"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <text x="8" y="12" textAnchor="middle" fontSize="10" fontWeight="700">i</text>
              </svg>
            </Button>
            <div className="flex-1" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <RiMoreFill className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit project</DropdownMenuItem>
                <DropdownMenuItem>Project settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <RiMapPinLine className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--color-text-secondary)" }} />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto min-h-0 p-0 text-[length:var(--text-sm-size)] font-normal text-[var(--color-text-info)] underline shadow-none hover:bg-transparent hover:text-[var(--color-text-info)]"
            >
              {data.address}
            </Button>
          </div>
        </div>
      </div>

      {/* Weather + quick links */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5" style={{ fontSize: "var(--text-sm-size)", color: "var(--color-text-secondary)" }}>
          <span>{data.weather.icon}</span>
          <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>{data.weather.temp}</span>
          <span>{data.weather.high} | {data.weather.low}</span>
        </div>
        <span style={{ color: "var(--color-border)" }}>|</span>
        {["+ Project Links", "Site Logistic Plans", "Latest Drawings"].map((link) => (
          <Button
            key={link}
            type="button"
            variant="outline"
            size="sm"
            className="h-[var(--height-input)] rounded px-3 py-1 text-[length:var(--text-sm-size)] font-normal text-[var(--color-text-primary)] shadow-none"
            style={{ borderColor: "var(--color-border)", background: "var(--color-bg-primary)" }}
          >
            {link}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-[var(--height-input)] rounded px-3 py-1 text-[length:var(--text-sm-size)] font-normal text-[var(--color-text-primary)] shadow-none"
          style={{ borderColor: "var(--color-border)", background: "var(--color-bg-primary)" }}
          iconTrailing={RiExternalLinkLine}
        >
          EarthCam Link
        </Button>
      </div>
    </div>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <div className="space-y-[var(--spacing-card-padding)]">
      {/* Row 1: Project Setup 1/3 + Timeline 2/3 */}
      <div className="grid grid-cols-3 gap-[var(--spacing-card-padding)] items-stretch">
        <ProjectSetupCard />
        <ProjectTimelineCard className="col-span-2" />
      </div>
      {/* Row 2: Summary 2/3 + Change Event by Reason 1/3 */}
      <div className="grid grid-cols-3 gap-[var(--spacing-card-padding)] items-stretch">
        <SummaryCard className="col-span-2" />
        <ChangeEventByReasonCard />
      </div>
      {/* Row 3: Open Items 2/3 + Open Change Events 1/3 */}
      <div className="grid grid-cols-3 gap-[var(--spacing-card-padding)] items-stretch">
        <OpenItemsCard className="col-span-2" />
        <OpenChangeEventsCard />
      </div>
    </div>
  )
}

// ─── Page Content ─────────────────────────────────────────────────────────────

export function ProjectHomeContent() {
  const { currentProject, projects, setCurrentProject } = useNavigation()
  const [activeTab, setActiveTab] = useState("overview")

  // Project Home is a project-scoped surface: ensure navigation context has a project
  // so the header selector stays in project mode and matches page content (avoids
  // "company mode" header while showing project UI).
  useEffect(() => {
    if (!currentProject && projects[0]) {
      setCurrentProject(projects[0])
    }
  }, [currentProject, projects, setCurrentProject])

  // Resolve the active project — fall back to first available so we never block render.
  const resolvedProject = currentProject ?? projects[0] ?? null

  const tabs = [
    { id: "overview",   label: "Overview" },
    { id: "drawings",   label: "Drawings" },
    { id: "open-items", label: "Open Items" },
    { id: "financials", label: "Financials" },
    { id: "reports",    label: "Reports" },
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      <ProjectHero />
      <div
        className="flex gap-4 border-b px-[var(--spacing-card-padding)]"
        style={{ background: "var(--color-bg-primary)", borderColor: "var(--color-border)" }}
      >
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-auto rounded-none border-b-2 border-transparent px-1 pb-2 pt-2 text-[length:var(--text-body-size)] font-medium shadow-none ring-0 transition-colors",
              activeTab === tab.id
                ? "border-[var(--color-text-primary)] text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-[var(--spacing-page-margin)]">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab !== "overview" && (
          <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
            {tabs.find((t) => t.id === activeTab)?.label} content coming soon
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page Route ───────────────────────────────────────────────────────────────

export default function ProjectHomePage() {
  return <ProjectHomeContent />
}
