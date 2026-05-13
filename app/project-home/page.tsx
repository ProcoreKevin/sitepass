"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  RiMoreFill,
  RiMapPinLine,
  RiSearchLine,
  RiCalendarLine,
  RiExternalLinkLine,
  RiFileTextLine,
  RiAlertLine,
  RiCheckboxLine,
  RiCalendar2Line,
  RiTimeLine,
  RiBuildingLine,
  RiSparklingLine,
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

// ─── Site Pass Tab ────────────────────────────────────────────────────────────

type Subcontractor = {
  id: string
  companyName: string
  trade: string
  location: string
}

type Worker = {
  id: string
  name: string
  qualifications: string[]
  timeToSite: string
}

const subcontractors: Subcontractor[] = [
  { id: "sc-01", companyName: "Vector Electrical Group", trade: "Electrical", location: "London" },
  { id: "sc-02", companyName: "Pinnacle Mechanical", trade: "HVAC", location: "Manchester" },
  { id: "sc-03", companyName: "Atlas Framing Co.", trade: "Framing", location: "Birmingham" },
  { id: "sc-04", companyName: "Blue Ridge Concrete", trade: "Concrete", location: "Leeds" },
  { id: "sc-05", companyName: "Cobalt Fire Protection", trade: "Fire Protection", location: "Glasgow" },
]

const otherSubcontractors: Subcontractor[] = [
  { id: "osc-01", companyName: "Northline Groundworks", trade: "Groundworks", location: "Bristol" },
  { id: "osc-02", companyName: "Harborline Scaffolding", trade: "Scaffolding", location: "Liverpool" },
  { id: "osc-03", companyName: "Redwood Interiors", trade: "Interior Fit-Out", location: "Nottingham" },
  { id: "osc-04", companyName: "Summit Roofing Services", trade: "Roofing", location: "Sheffield" },
]

const workersBySubcontractor: Record<string, Worker[]> = {
  "sc-01": [
    { id: "w-001", name: "Miguel Santos", qualifications: ["CSCS card", "Asbestos Awareness", "IEC"], timeToSite: "35 min" },
    { id: "w-002", name: "Alyssa Tran", qualifications: ["CSCS card", "IEC"], timeToSite: "28 min" },
    { id: "w-003", name: "Darnell Price", qualifications: ["Asbestos Awareness", "IEC"], timeToSite: "42 min" },
  ],
  "sc-02": [
    { id: "w-004", name: "Noah Patel", qualifications: ["CSCS card", "Asbestos Awareness"], timeToSite: "31 min" },
    { id: "w-005", name: "Elena Garcia", qualifications: ["CSCS card", "IEC"], timeToSite: "24 min" },
  ],
  "sc-03": [
    { id: "w-006", name: "Trevor Kim", qualifications: ["CSCS card"], timeToSite: "37 min" },
    { id: "w-007", name: "Bianca Hall", qualifications: ["CSCS card", "Asbestos Awareness"], timeToSite: "29 min" },
  ],
  "sc-04": [
    { id: "w-008", name: "Liam Turner", qualifications: ["CSCS card", "IEC"], timeToSite: "33 min" },
    { id: "w-009", name: "Priya Rao", qualifications: ["Asbestos Awareness"], timeToSite: "46 min" },
  ],
  "sc-05": [
    { id: "w-010", name: "Owen Murphy", qualifications: ["CSCS card", "Asbestos Awareness", "IEC"], timeToSite: "26 min" },
    { id: "w-011", name: "Hannah Brooks", qualifications: ["CSCS card"], timeToSite: "39 min" },
  ],
  "osc-01": [
    { id: "w-012", name: "Jacob Stewart", qualifications: ["CSCS card"], timeToSite: "41 min" },
    { id: "w-013", name: "Sophie Ahmed", qualifications: ["Asbestos Awareness"], timeToSite: "34 min" },
    { id: "w-014", name: "Connor Reed", qualifications: ["IEC"], timeToSite: "48 min" },
    { id: "w-015", name: "Luca Barnes", qualifications: ["CSCS card", "IEC"], timeToSite: "27 min" },
  ],
  "osc-02": [
    { id: "w-016", name: "Ruby Collins", qualifications: ["CSCS card"], timeToSite: "36 min" },
    { id: "w-017", name: "George Webb", qualifications: ["CSCS card", "Asbestos Awareness"], timeToSite: "32 min" },
    { id: "w-018", name: "Mia Foster", qualifications: ["IEC"], timeToSite: "44 min" },
  ],
  "osc-03": [
    { id: "w-019", name: "Adam Flynn", qualifications: ["CSCS card", "IEC"], timeToSite: "30 min" },
    { id: "w-020", name: "Chloe Davies", qualifications: ["CSCS card"], timeToSite: "38 min" },
  ],
  "osc-04": [
    { id: "w-021", name: "Riley Cooper", qualifications: ["Asbestos Awareness"], timeToSite: "43 min" },
    { id: "w-022", name: "Ella Grant", qualifications: ["CSCS card", "IEC"], timeToSite: "25 min" },
    { id: "w-023", name: "Harvey Price", qualifications: ["CSCS card"], timeToSite: "40 min" },
  ],
}

function SitePassTab() {
  const [companyOrTrade, setCompanyOrTrade] = useState("")
  const [location, setLocation] = useState("")
  const [isSelectCompanyDialogOpen, setIsSelectCompanyDialogOpen] = useState(false)
  const [dialogCompanyId, setDialogCompanyId] = useState<string | null>(subcontractors[0]?.id ?? null)
  const [selectedWorkerIdsForDirectory, setSelectedWorkerIdsForDirectory] = useState<string[]>([])
  const [projectDirectoryNotice, setProjectDirectoryNotice] = useState<string | null>(null)
  const [selectedSubcontractorId, setSelectedSubcontractorId] = useState<string | null>(subcontractors[0]?.id ?? null)
  const [selectedOtherSubcontractorId, setSelectedOtherSubcontractorId] = useState<string | null>(
    otherSubcontractors[0]?.id ?? null
  )

  const normalizedCompanyOrTrade = companyOrTrade.trim().toLowerCase()
  const normalizedLocation = location.trim().toLowerCase()

  const filteredSubcontractors = subcontractors.filter((subcontractor) => {
    const matchesCompanyOrTrade =
      !normalizedCompanyOrTrade ||
      subcontractor.companyName.toLowerCase().includes(normalizedCompanyOrTrade) ||
      subcontractor.trade.toLowerCase().includes(normalizedCompanyOrTrade)

    const matchesLocation =
      !normalizedLocation || subcontractor.location.toLowerCase().includes(normalizedLocation)

    return matchesCompanyOrTrade && matchesLocation
  })

  const filteredOtherSubcontractors = otherSubcontractors.filter((subcontractor) => {
    const matchesCompanyOrTrade =
      !normalizedCompanyOrTrade ||
      subcontractor.companyName.toLowerCase().includes(normalizedCompanyOrTrade) ||
      subcontractor.trade.toLowerCase().includes(normalizedCompanyOrTrade)

    const matchesLocation =
      !normalizedLocation || subcontractor.location.toLowerCase().includes(normalizedLocation)

    return matchesCompanyOrTrade && matchesLocation
  })

  useEffect(() => {
    if (filteredSubcontractors.length === 0) {
      setSelectedSubcontractorId(null)
      return
    }

    const hasSelectedSubcontractor = filteredSubcontractors.some(
      (subcontractor) => subcontractor.id === selectedSubcontractorId
    )

    if (!hasSelectedSubcontractor) {
      setSelectedSubcontractorId(filteredSubcontractors[0].id)
    }
  }, [filteredSubcontractors, selectedSubcontractorId])

  useEffect(() => {
    if (filteredOtherSubcontractors.length === 0) {
      setSelectedOtherSubcontractorId(null)
      return
    }

    const hasSelectedSubcontractor = filteredOtherSubcontractors.some(
      (subcontractor) => subcontractor.id === selectedOtherSubcontractorId
    )

    if (!hasSelectedSubcontractor) {
      setSelectedOtherSubcontractorId(filteredOtherSubcontractors[0].id)
    }
  }, [filteredOtherSubcontractors, selectedOtherSubcontractorId])

  const selectedSubcontractor = filteredSubcontractors.find(
    (subcontractor) => subcontractor.id === selectedSubcontractorId
  )
  const selectedOtherSubcontractor = filteredOtherSubcontractors.find(
    (subcontractor) => subcontractor.id === selectedOtherSubcontractorId
  )

  const selectedWorkers = selectedSubcontractorId ? (workersBySubcontractor[selectedSubcontractorId] ?? []) : []
  const selectedOtherSubcontractorWorkerCount = selectedOtherSubcontractorId
    ? (workersBySubcontractor[selectedOtherSubcontractorId] ?? []).length
    : 0
  const aiSuggestedSubcontractorId = "sc-01"
  const dialogCompany = subcontractors.find((subcontractor) => subcontractor.id === dialogCompanyId) ?? null
  const dialogWorkers = dialogCompanyId ? (workersBySubcontractor[dialogCompanyId] ?? []) : []

  const getAverageTimeToSite = (subcontractorId: string) => {
    const workers = workersBySubcontractor[subcontractorId] ?? []
    if (workers.length === 0) return "N/A"

    const totalMinutes = workers.reduce((sum, worker) => {
      const minutes = Number.parseInt(worker.timeToSite.replace(" min", ""), 10)
      return sum + (Number.isNaN(minutes) ? 0 : minutes)
    }, 0)

    const averageMinutes = Math.round(totalMinutes / workers.length)
    return `${averageMinutes} min`
  }

  const openSelectCompanyDialog = () => {
    const nextCompanyId = selectedSubcontractorId ?? subcontractors[0]?.id ?? null
    setDialogCompanyId(nextCompanyId)
    setSelectedWorkerIdsForDirectory([])
    setIsSelectCompanyDialogOpen(true)
  }

  const handleToggleWorkerForDirectory = (workerId: string, checked: boolean) => {
    setSelectedWorkerIdsForDirectory((previous) => {
      if (checked) {
        return previous.includes(workerId) ? previous : [...previous, workerId]
      }

      return previous.filter((id) => id !== workerId)
    })
  }

  const handleAddToProjectDirectory = () => {
    if (!dialogCompany) return

    const workerCount = selectedWorkerIdsForDirectory.length
    if (workerCount === 0) return

    setProjectDirectoryNotice(
      `Added ${workerCount} worker${workerCount === 1 ? "" : "s"} from ${dialogCompany.companyName} to Project Directory.`
    )
    setIsSelectCompanyDialogOpen(false)
    setSelectedWorkerIdsForDirectory([])
  }

  return (
    <Card className="bg-card rounded-[var(--border-radius-lg)] border-0 shadow-[var(--shadow-sm)] p-[var(--spacing-card-padding)]">
      <div className="mb-4">
        <h2 className="text-[length:var(--text-h3-size)] font-semibold leading-[var(--text-h3-lh)] tracking-[var(--text-h3-ls)] text-foreground">
          Site Pass
        </h2>
        <p className="mt-1 text-[length:var(--text-sm-size)] text-muted-foreground">
          Search subcontractors by trade, company name, and location.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="site-pass-company-trade"
            className="mb-2 block text-[length:var(--text-sm-size)] font-medium text-[var(--color-text-secondary)]"
          >
            Trade or Company Name
          </label>
          <div className="relative">
            <RiSearchLine className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="site-pass-company-trade"
              value={companyOrTrade}
              onChange={(event) => setCompanyOrTrade(event.target.value)}
              placeholder="Search trade or company"
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="site-pass-location"
            className="mb-2 block text-[length:var(--text-sm-size)] font-medium text-[var(--color-text-secondary)]"
          >
            Location
          </label>
          <div className="relative">
            <RiMapPinLine className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="site-pass-location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Search location"
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 rounded-[var(--border-radius-md)] border border-[var(--color-border-input-focus)] bg-[var(--color-bg-feedback-info)] px-4 py-3">
          <p className="text-[length:var(--text-sm-size)] font-medium text-[var(--color-text-info)]">
            Hey Arnold suggests selecting Vector Electrical Group based on qualifications and time to site.
          </p>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[length:var(--text-body-size)] font-semibold text-foreground">Preferred Subcontractors</h3>
          <div className="flex items-center gap-3">
            <span className="text-[length:var(--text-sm-size)] text-muted-foreground">
              {filteredSubcontractors.length} result{filteredSubcontractors.length === 1 ? "" : "s"}
            </span>
            <Button type="button" variant="outline" size="sm" onClick={openSelectCompanyDialog}>
              Select Company
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[var(--border-radius-md)] border border-[var(--color-border)]">
          <div className="grid grid-cols-4 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2 text-[length:var(--text-sm-size)] font-medium text-[var(--color-text-secondary)]">
            <span>Company</span>
            <span>Trade</span>
            <span>Location</span>
            <span>Average Time to Site</span>
          </div>

          {filteredSubcontractors.length === 0 ? (
            <div className="px-4 py-8 text-center text-[length:var(--text-sm-size)] text-muted-foreground">
              No subcontractors found for the current search.
            </div>
          ) : (
            filteredSubcontractors.map((subcontractor) => (
              <div
                key={subcontractor.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedSubcontractorId(subcontractor.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setSelectedSubcontractorId(subcontractor.id)
                  }
                }}
                className={cn(
                  "grid grid-cols-4 items-center border-b border-[var(--color-border)] px-4 py-3 text-[length:var(--text-body-size)] last:border-b-0 cursor-pointer transition-colors",
                  selectedSubcontractorId === subcontractor.id
                    ? "bg-[var(--color-bg-row-active)]"
                    : "hover:bg-[var(--color-bg-secondary)]"
                )}
              >
                <span className="inline-flex items-center gap-2 font-medium text-foreground">
                  <RiBuildingLine className="h-4 w-4 text-muted-foreground" />
                  {subcontractor.companyName}
                  {subcontractor.id === aiSuggestedSubcontractorId && (
                    <span
                      className="inline-flex items-center rounded-full bg-[var(--color-bg-feedback-info)] p-1 text-[var(--color-text-info)]"
                      aria-label="Hey Arnold suggested subcontractor"
                      title="Hey Arnold suggested subcontractor"
                    >
                      <RiSparklingLine className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  )}
                </span>
                <span className="text-[var(--color-text-primary)]">{subcontractor.trade}</span>
                <span className="text-[var(--color-text-secondary)]">{subcontractor.location}</span>
                <span className="text-[var(--color-text-secondary)]">{getAverageTimeToSite(subcontractor.id)}</span>
              </div>
            ))
          )}
        </div>

        {projectDirectoryNotice && (
          <div className="mt-3 rounded-[var(--border-radius-md)] border border-[var(--color-border-input-focus)] bg-[var(--color-bg-feedback-info)] px-4 py-3">
            <p className="text-[length:var(--text-sm-size)] text-[var(--color-text-info)]">{projectDirectoryNotice}</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[length:var(--text-body-size)] font-semibold text-foreground">Workers</h3>
          {selectedSubcontractor && (
            <span className="text-[length:var(--text-sm-size)] text-muted-foreground">
              {selectedSubcontractor.companyName}
            </span>
          )}
        </div>

        <div className="overflow-hidden rounded-[var(--border-radius-md)] border border-[var(--color-border)]">
          <div className="grid grid-cols-3 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2 text-[length:var(--text-sm-size)] font-medium text-[var(--color-text-secondary)]">
            <span>Worker</span>
            <span>Qualifications</span>
            <span>Time to Site</span>
          </div>

          {!selectedSubcontractor ? (
            <div className="px-4 py-8 text-center text-[length:var(--text-sm-size)] text-muted-foreground">
              Select a subcontractor to view workers.
            </div>
          ) : selectedWorkers.length === 0 ? (
            <div className="px-4 py-8 text-center text-[length:var(--text-sm-size)] text-muted-foreground">
              No workers available for this subcontractor.
            </div>
          ) : (
            selectedWorkers.map((worker) => (
              <div
                key={worker.id}
                className="grid grid-cols-3 items-start gap-4 border-b border-[var(--color-border)] px-4 py-3 text-[length:var(--text-body-size)] last:border-b-0"
              >
                <span className="font-medium text-foreground">{worker.name}</span>
                <div className="flex flex-wrap gap-2">
                  {worker.qualifications.map((qualification) => (
                    <span
                      key={qualification}
                      className="inline-flex items-center rounded-full bg-[var(--color-bg-secondary)] px-2 py-0.5 text-[length:var(--text-sm-size)] text-[var(--color-text-secondary)]"
                    >
                      {qualification}
                    </span>
                  ))}
                </div>
                <span className="text-[var(--color-text-secondary)]">{worker.timeToSite}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[length:var(--text-body-size)] font-semibold text-foreground">Other Subcontractors</h3>
          <span className="text-[length:var(--text-sm-size)] text-muted-foreground">
            {filteredOtherSubcontractors.length} result{filteredOtherSubcontractors.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="overflow-hidden rounded-[var(--border-radius-md)] border border-[var(--color-border)]">
          <div className="grid grid-cols-3 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2 text-[length:var(--text-sm-size)] font-medium text-[var(--color-text-secondary)]">
            <span>Company</span>
            <span>Trade</span>
            <span>Location</span>
          </div>

          {filteredOtherSubcontractors.length === 0 ? (
            <div className="px-4 py-8 text-center text-[length:var(--text-sm-size)] text-muted-foreground">
              No subcontractors found for the current search.
            </div>
          ) : (
            filteredOtherSubcontractors.map((subcontractor) => (
              <div
                key={subcontractor.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedOtherSubcontractorId(subcontractor.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setSelectedOtherSubcontractorId(subcontractor.id)
                  }
                }}
                className={cn(
                  "grid grid-cols-3 items-center border-b border-[var(--color-border)] px-4 py-3 text-[length:var(--text-body-size)] last:border-b-0 cursor-pointer transition-colors",
                  selectedOtherSubcontractorId === subcontractor.id
                    ? "bg-[var(--color-bg-row-active)]"
                    : "hover:bg-[var(--color-bg-secondary)]"
                )}
              >
                <span className="inline-flex items-center gap-2 font-medium text-foreground">
                  <RiBuildingLine className="h-4 w-4 text-muted-foreground" />
                  {subcontractor.companyName}
                </span>
                <span className="text-[var(--color-text-primary)]">{subcontractor.trade}</span>
                <span className="text-[var(--color-text-secondary)]">{subcontractor.location}</span>
              </div>
            ))
          )}
        </div>

        <div className="mt-3 rounded-[var(--border-radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3">
          {!selectedOtherSubcontractor ? (
            <p className="text-[length:var(--text-sm-size)] text-muted-foreground">
              Select an other subcontractor to view worker count.
            </p>
          ) : (
            <p className="text-[length:var(--text-body-size)] text-[var(--color-text-primary)]">
              <span className="font-semibold">{selectedOtherSubcontractor.companyName}</span> has{" "}
              <span className="font-semibold">{selectedOtherSubcontractorWorkerCount}</span> worker
              {selectedOtherSubcontractorWorkerCount === 1 ? "" : "s"}.
            </p>
          )}
        </div>
      </div>

      <Dialog open={isSelectCompanyDialogOpen} onOpenChange={setIsSelectCompanyDialogOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Select Company</DialogTitle>
            <DialogDescription>
              Choose a company, then select workers to add to the Project Directory.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-[var(--border-radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2">
              <p className="text-[length:var(--text-sm-size)] text-[var(--color-text-secondary)]">
                Company:{" "}
                <span className="font-medium text-[var(--color-text-primary)]">
                  {dialogCompany?.companyName ?? "No company selected"}
                </span>
              </p>
            </div>

            <div className="overflow-hidden rounded-[var(--border-radius-md)] border border-[var(--color-border)]">
              <div className="grid grid-cols-[48px_1fr_1fr_120px] border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2 text-[length:var(--text-sm-size)] font-medium text-[var(--color-text-secondary)]">
                <span>Select</span>
                <span>Worker</span>
                <span>Qualifications</span>
                <span>Time to Site</span>
              </div>

              {dialogWorkers.length === 0 ? (
                <div className="px-4 py-8 text-center text-[length:var(--text-sm-size)] text-muted-foreground">
                  No workers found for this company.
                </div>
              ) : (
                dialogWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    className="grid grid-cols-[48px_1fr_1fr_120px] items-start border-b border-[var(--color-border)] px-4 py-3 text-[length:var(--text-body-size)] last:border-b-0"
                  >
                    <div className="pt-0.5">
                      <Checkbox
                        checked={selectedWorkerIdsForDirectory.includes(worker.id)}
                        onCheckedChange={(checked) => handleToggleWorkerForDirectory(worker.id, checked === true)}
                        aria-label={`Select ${worker.name}`}
                      />
                    </div>
                    <span className="font-medium text-foreground">{worker.name}</span>
                    <div className="flex flex-wrap gap-2">
                      {worker.qualifications.map((qualification) => (
                        <span
                          key={qualification}
                          className="inline-flex items-center rounded-full bg-[var(--color-bg-secondary)] px-2 py-0.5 text-[length:var(--text-sm-size)] text-[var(--color-text-secondary)]"
                        >
                          {qualification}
                        </span>
                      ))}
                    </div>
                    <span className="text-[var(--color-text-secondary)]">{worker.timeToSite}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsSelectCompanyDialogOpen(false)
                setSelectedWorkerIdsForDirectory([])
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddToProjectDirectory}
              disabled={selectedWorkerIdsForDirectory.length === 0}
            >
              Add to Project Directory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
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
    { id: "site-pass",  label: "Site Pass" },
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
        {activeTab === "site-pass" && <SitePassTab />}
        {activeTab !== "overview" && activeTab !== "site-pass" && (
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
