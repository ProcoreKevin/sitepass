"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PublicIllustration } from "@/components/ui/public-illustration"
import {
  RiAddLine,
  RiMoreFill,
  RiUploadCloud2Fill,
  RiArrowUpLine,
  RiArrowDownLine,
  RiMapPinLine,
  RiCalendarLine,
  RiSearchLine,
  RiLayoutGridLine,
  RiFilterLine,
  RiListCheck,
} from "react-icons/ri"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { type OpenItem } from "@/lib/open-items-types"
import { OpenItemsTab } from "@/app/(company)/open-items-tab"
import { SafetyHubTab } from "@/components/company-home-safety-hub"

// ─── Types ───
interface HealthMetric {
  label: string
  count: number
  color: string
}

// ─── Mock Data ───
const MY_OPEN_ITEMS: OpenItem[] = [
  { id: "m1", type: "RFI",       description: "Structural beam clarification - Load bearing capacity",  status: "Open",           date: "Jan 12, 2026", dueDate: "Jan 12, 2026", assignee: "Sarah Chen" },
  { id: "m2", type: "Daily Log", description: "Weather delay report - Rain stoppage Jan 8",            status: "Open",           date: "Jan 9, 2026",  dueDate: "Jan 9, 2026",  assignee: "Sarah Chen" },
  { id: "m3", type: "Meeting",   description: "Weekly coordination meeting - MEP trades",             status: "Open",           date: "Jan 13, 2026", dueDate: "Jan 13, 2026", assignee: "Sarah Chen" },
  { id: "m4", type: "Submittal", description: "Curtain wall shop drawings - Exterior glazing",         status: "Pending Review", date: "Jan 17, 2026", dueDate: "Jan 17, 2026", assignee: "Sarah Chen" },
  { id: "m5", type: "Inspection",description: "Roof membrane inspection - Building A level 4",        status: "In Progress",    date: "Jan 18, 2026", dueDate: "Jan 18, 2026", assignee: "Sarah Chen" },
]

const HEALTH_METRICS: HealthMetric[] = [
  { label: "On Track",     count: 20, color: "bg-[var(--color-chart-2)]" },
  { label: "On Budget",    count: 8,  color: "bg-[var(--color-border-strong)]" },
  { label: "Off Schedule", count: 5,  color: "bg-[var(--color-chart-1)]" },
  { label: "Over Budget",  count: 5,  color: "bg-[var(--color-chart-6)]" },
]

interface Project {
  id: string; name: string; description: string; location: string
  status: "Active" | "Planned" | "Completed" | "In Review"
  progress: number; health: "On Track" | "At Risk" | "Critical"
  budget: number; budgetUsedPct: number; budgetUsed: number
  activeItems: number; depts: number; team: number
  startDate: string; endDate: string
}

const PROJECTS: Project[] = [
  { id: "1", name: "Monarch Apartments",    description: "Mixed-use residential development with 120 luxury apartments and ground-floor retail space", location: "Seattle, WA",       status: "Active",    progress: 68,  health: "On Track", budget: 45000000,  budgetUsedPct: 72, budgetUsed: 32500000,  activeItems: 8,  depts: 5, team: 42,  startDate: "Jan 2024", endDate: "Dec 2026" },
  { id: "2", name: "Skyline Tower Project", description: "45-story Class A office building with underground parking and rooftop amenities",             location: "New York, NY",      status: "Active",    progress: 52,  health: "At Risk",  budget: 180000000, budgetUsedPct: 53, budgetUsed: 95000000,  activeItems: 12, depts: 8, team: 156, startDate: "Mar 2023", endDate: "Jun 2027" },
  { id: "3", name: "Harbor View Condos",    description: "Waterfront condominium complex with marina access and resort-style amenities",                location: "Miami, FL",         status: "Planned",   progress: 8,   health: "On Track", budget: 78000000,  budgetUsedPct: 7,  budgetUsed: 5200000,   activeItems: 2,  depts: 3, team: 18,  startDate: "Jun 2025", endDate: "Mar 2028" },
  { id: "4", name: "Downtown Office Complex",description:"Three-building office park with shared amenities and underground transit connection",         location: "Denver, CO",        status: "Active",    progress: 89,  health: "Critical", budget: 125000000, budgetUsedPct: 90, budgetUsed: 112000000, activeItems: 15, depts: 6, team: 98,  startDate: "Aug 2022", endDate: "Oct 2025" },
  { id: "5", name: "Riverside Retail Center",description:"Open-air lifestyle shopping center with dining and entertainment venues",                     location: "Portland, OR",      status: "Completed", progress: 100, health: "On Track", budget: 52000000,  budgetUsedPct: 98, budgetUsed: 50800000,  activeItems: 0,  depts: 4, team: 0,   startDate: "Feb 2021", endDate: "Nov 2023" },
  { id: "6", name: "Aegis Medical Pavilion",description: "State-of-the-art medical facility with surgical suites and outpatient care",                  location: "Boston, MA",        status: "Active",    progress: 74,  health: "On Track", budget: 95000000,  budgetUsedPct: 76, budgetUsed: 72000000,  activeItems: 6,  depts: 7, team: 64,  startDate: "May 2023", endDate: "Aug 2026" },
  { id: "7", name: "BeaconCare Tower",       description: "Multi-specialty medical office building with integrated diagnostic center",                   location: "Chicago, IL",       status: "Active",    progress: 62,  health: "On Track", budget: 68000000,  budgetUsedPct: 66, budgetUsed: 45000000,  activeItems: 4,  depts: 5, team: 38,  startDate: "Jan 2024", endDate: "Jul 2026" },
  { id: "8", name: "Summit Industrial Park", description: "Modern warehouse and distribution facility with automated logistics",                         location: "Dallas, TX",        status: "In Review", progress: 0,   health: "On Track", budget: 42000000,  budgetUsedPct: 0,  budgetUsed: 0,         activeItems: 0,  depts: 2, team: 8,   startDate: "Q3 2025",  endDate: "Q1 2027" },
  { id: "9", name: "Civic Center Renovation",description:"Historic building restoration with modern infrastructure upgrades",                           location: "San Francisco, CA", status: "Active",    progress: 78,  health: "At Risk",  budget: 35000000,  budgetUsedPct: 80, budgetUsed: 28000000,  activeItems: 7,  depts: 4, team: 52,  startDate: "Apr 2023", endDate: "Dec 2025" },
]

// ─── Dashboard Card Wrapper ───
function DashboardCard({ title, action, children, className }: {
  title: string; action?: { label: string; onClick: () => void }
  children: React.ReactNode; className?: string
}) {
  return (
    <div className={cn(className)}>
      <Card className="bg-card rounded-[var(--border-radius-lg)] border-0 shadow-[var(--shadow-sm)] p-[var(--spacing-card-padding)] h-full">
        <div className="flex items-center justify-between mb-[var(--spacing-stack-gap)]">
          <h3 className="text-[length:var(--text-h3-size)] font-semibold leading-[var(--text-h3-lh)] text-foreground">{title}</h3>
          <div className="flex items-center gap-[var(--spacing-inline-gap)]">
            {action && <Button variant="outline" size="sm" onClick={action.onClick}>{action.label}</Button>}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><RiMoreFill className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Configure</DropdownMenuItem>
                <DropdownMenuItem>Remove card</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {children}
      </Card>
    </div>
  )
}

// ─── Metric Block ───
function MetricBlock({ label, value, trend }: {
  label: string; value: string; trend: { direction: "up" | "down"; value: string }
}) {
  const trendColor = trend.direction === "up" ? "var(--color-text-success)" : "var(--color-text-danger)"
  return (
    <div>
      <p style={{ fontSize: "var(--text-sm-size)", color: "var(--color-text-secondary)" }} className="mb-1">{label}</p>
      <p style={{ fontSize: "var(--text-h2-size)", fontWeight: "var(--text-h2-weight)", color: "var(--color-text-primary)" }}>{value}</p>
      <div className="flex items-center gap-1 mt-1" style={{ fontSize: "var(--text-sm-size)", fontWeight: 500, color: trendColor }}>
        {trend.direction === "up" ? <RiArrowUpLine className="h-3 w-3" /> : <RiArrowDownLine className="h-3 w-3" />}
        <span>{trend.value}</span>
      </div>
    </div>
  )
}

// ─── Financial Summary Card ───
function FinancialSummaryCard({ className }: { className?: string }) {
  return (
    <DashboardCard className={className} title="Financial Summary" action={{ label: "View", onClick: () => {} }}>
      <div className="grid grid-cols-2 gap-[var(--spacing-card-padding)]">
        <MetricBlock label="Original Budget" value="$45,200,000" trend={{ direction: "up",   value: "2.4%" }} />
        <MetricBlock label="Committed Costs" value="$38,750,000" trend={{ direction: "down", value: "1.8%" }} />
        <MetricBlock label="Forecast Cost"   value="$44,900,000" trend={{ direction: "up",   value: "0.6%" }} />
        <MetricBlock label="Cost Variance"   value="$300,000"    trend={{ direction: "down", value: "3.2%" }} />
      </div>
    </DashboardCard>
  )
}

// ─── Project Health Card ───
function ProjectHealthCard({ className }: { className?: string }) {
  const total = HEALTH_METRICS.reduce((s, m) => s + m.count, 0)
  return (
    <DashboardCard className={className} title="Project Health" action={{ label: "View", onClick: () => {} }}>
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <svg viewBox="0 0 120 120" className="h-32 w-32">
            <circle cx="60" cy="60" r="45" fill="none" className="stroke-border" strokeWidth="15" />
            <circle cx="60" cy="60" r="45" fill="none" className="stroke-[var(--color-chart-2)]"       strokeWidth="15" strokeDasharray="149 283" strokeDashoffset="0"    transform="rotate(-90 60 60)" />
            <circle cx="60" cy="60" r="45" fill="none" className="stroke-[var(--color-border-strong)]" strokeWidth="15" strokeDasharray="60 283"  strokeDashoffset="-149" transform="rotate(-90 60 60)" />
            <circle cx="60" cy="60" r="45" fill="none" className="stroke-[var(--color-chart-1)]"       strokeWidth="15" strokeDasharray="37 283"  strokeDashoffset="-209" transform="rotate(-90 60 60)" />
            <circle cx="60" cy="60" r="45" fill="none" className="stroke-[var(--color-chart-6)]"       strokeWidth="15" strokeDasharray="37 283"  strokeDashoffset="-246" transform="rotate(-90 60 60)" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[length:var(--text-h1-size)] font-bold text-foreground">{total}</span>
            <span className="text-[length:var(--text-sm-size)] text-muted-foreground">Projects</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {HEALTH_METRICS.map((m) => (
            <div key={m.label} className="flex items-center justify-between">
              <div className="flex items-center gap-[var(--spacing-inline-gap)]">
                <div className={cn("h-2.5 w-2.5 rounded-full", m.color)} />
                <span className="text-[length:var(--text-body-size)] text-foreground">{m.label}</span>
              </div>
              <span className="text-[length:var(--text-body-size)] font-medium text-foreground">{m.count}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  )
}

// ─── My Open Items Card ───
function MyOpenItemsCard({ className }: { className?: string }) {
  const badge = (status: OpenItem["status"]) => {
    if (status === "Open")           return "badge badge-draft"
    if (status === "Pending Review") return "badge badge-neutral"
    return "badge badge-construction"
  }
  return (
    <DashboardCard className={className} title="My Open Items" action={{ label: "View", onClick: () => {} }}>
      <Table>
        <TableBody>
          {MY_OPEN_ITEMS.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium w-32 pl-0">{item.type}</TableCell>
              <TableCell className="text-muted-foreground truncate max-w-0">{item.description}</TableCell>
              <TableCell className="w-36"><span className={badge(item.status)}>{item.status}</span></TableCell>
              <TableCell className="w-28 text-right pr-0 text-muted-foreground">{item.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardCard>
  )
}

// ─── Safety Docs Card ───
function SafetyDocsCard({ className }: { className?: string }) {
  return (
    <DashboardCard className={className} title="Company Safety Documentation" action={{ label: "Upload", onClick: () => {} }}>
      <div className="flex flex-col items-center justify-center py-[var(--spacing-section-gap)]">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-[var(--spacing-stack-gap)]">
          <RiUploadCloud2Fill className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-[length:var(--text-body-size)] text-muted-foreground text-center">Upload safety documentation for the company</p>
      </div>
    </DashboardCard>
  )
}

// ─── Crews Card ───
function CrewsCard({ className }: { className?: string }) {
  return (
    <DashboardCard className={className} title="Crews" action={{ label: "View More", onClick: () => {} }}>
      <div className="flex flex-col items-center justify-center py-[var(--spacing-section-gap)]">
        <PublicIllustration
          src="/illustrations/_9_crews.svg"
          alt="No crews assigned"
          size="mid"
          className="mb-[var(--spacing-stack-gap)]"
        />
        <p className="text-[length:var(--text-body-size)] text-muted-foreground text-center">No crews assigned</p>
      </div>
    </DashboardCard>
  )
}

// ─── Schedule Card ───
function ScheduleCard({ className }: { className?: string }) {
  return (
    <DashboardCard className={className} title="Schedule" action={{ label: "View More", onClick: () => {} }}>
      <div className="flex flex-col items-center justify-center py-[var(--spacing-section-gap)]">
        <PublicIllustration
          src="/illustrations/_15_scheduling.svg"
          alt="No schedule items"
          size="mid"
          className="mb-[var(--spacing-stack-gap)]"
        />
        <p className="text-[length:var(--text-body-size)] text-muted-foreground text-center">No schedule items</p>
      </div>
    </DashboardCard>
  )
}

// ─── Overview Tab ───
function OverviewTab() {
  return (
    <div className="space-y-[var(--spacing-card-padding)]">
      <div className="grid grid-cols-3 gap-[var(--spacing-card-padding)] items-stretch">
        <FinancialSummaryCard className="col-span-2" />
        <ProjectHealthCard />
      </div>
      <div className="grid grid-cols-3 gap-[var(--spacing-card-padding)] items-stretch">
        <CrewsCard />
        <MyOpenItemsCard className="col-span-2" />
      </div>
      <div className="grid grid-cols-2 gap-[var(--spacing-card-padding)] items-stretch">
        <SafetyDocsCard />
        <ScheduleCard />
      </div>
    </div>
  )
}

// ─── Projects Tab ───
function ProjectsTab() {
  const [search, setSearch] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")

  const filtered = PROJECTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  )

  const formatCurrency = (n: number) =>
    "$" + (n >= 1_000_000
      ? (n / 1_000_000).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ",000,000"
      : n.toLocaleString("en-US"))

  const getStatusBadge = (status: Project["status"]) => {
    const styles: Record<Project["status"], string> = {
      Active:      "bg-[var(--color-bg-feedback-success)] text-[var(--color-text-success)]",
      Planned:     "bg-[var(--color-bg-feedback-info)]    text-[var(--color-text-info)]",
      Completed:   "bg-[var(--color-bg-secondary)]        text-[var(--color-text-secondary)]",
      "In Review": "bg-[var(--color-bg-feedback-warning)] text-[var(--color-text-warning)]",
    }
    return (
      <span className={cn("text-[length:var(--text-sm-size)] font-medium px-2 py-0.5 rounded-[var(--border-radius-full)]", styles[status])}>
        {status}
      </span>
    )
  }

  const getHealthColor = (h: Project["health"]) =>
    h === "On Track" ? "var(--color-text-success)" : h === "At Risk" ? "var(--color-text-warning)" : "var(--color-text-danger)"

  const getProgressColor = (h: Project["health"]) =>
    h === "On Track" ? "var(--color-chart-2)" : h === "At Risk" ? "var(--color-chart-4)" : "var(--color-chart-1)"

  return (
    <div className="flex flex-col gap-[var(--spacing-card-padding)]">
      {/* Toolbar */}
      <div style={{ background: "var(--color-bg-primary)", borderRadius: "var(--border-radius-lg)", boxShadow: "var(--shadow-sm)", padding: "var(--space-3) var(--spacing-card-padding)" }}>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ height: "var(--height-input)", fontSize: "var(--text-body-size)", borderRadius: "var(--border-radius-md)", border: "1px solid var(--color-border-input-default)", backgroundColor: "var(--color-bg-primary)", color: "var(--color-text-primary)", paddingLeft: "2.25rem", paddingRight: "0.75rem", width: "100%", outline: "none" }}
            />
          </div>
          <div className="flex-1" />
          <Button type="button" variant="outline" size="sm" className="shrink-0 font-normal" iconLeading={RiFilterLine}>
            Filter
          </Button>
          <div style={{ display: "flex", border: "1px solid var(--color-border-default)", borderRadius: "var(--border-radius-md)", overflow: "hidden" }}>
            {[{ key: "grid", icon: <RiLayoutGridLine className="h-4 w-4" /> }, { key: "list", icon: <RiListCheck className="h-4 w-4" /> }, { key: "map", icon: <RiMapPinLine className="h-4 w-4" /> }].map(({ key, icon }) => (
              <button key={key} onClick={() => key !== "map" && setView(key as "grid" | "list")}
                style={{ width: "var(--height-button)", height: "var(--height-button)", display: "flex", alignItems: "center", justifyContent: "center", background: view === key ? "var(--color-bg-secondary)" : "var(--color-bg-primary)", color: view === key ? "var(--color-text-primary)" : "var(--color-text-secondary)", border: "none", cursor: "pointer" }}>
                {icon}
              </button>
            ))}
          </div>
          <span style={{ fontSize: "var(--text-body-size)", color: "var(--color-text-secondary)" }}>{filtered.length} projects</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-[var(--spacing-card-padding)]">
        {filtered.map(project => (
          <div key={project.id} style={{ background: "var(--color-bg-primary)", borderRadius: "var(--border-radius-lg)", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", overflow: "hidden", cursor: "pointer" }}>
            <div style={{ padding: "var(--spacing-card-padding)" }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 style={{ fontSize: "var(--text-h3-size)", fontWeight: "var(--text-h3-weight)", lineHeight: "var(--text-h3-lh)", color: "var(--color-text-primary)" }}>{project.name}</h3>
                {getStatusBadge(project.status)}
              </div>
              <p style={{ fontSize: "var(--text-sm-size)", lineHeight: "var(--text-body-lh)", color: "var(--color-text-secondary)", marginBottom: "var(--space-3)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{project.description}</p>
              <div className="flex items-center gap-1" style={{ color: "var(--color-text-secondary)" }}>
                <RiMapPinLine className="h-3.5 w-3.5 flex-shrink-0" />
                <span style={{ fontSize: "var(--text-sm-size)" }}>{project.location}</span>
              </div>
            </div>
            <div style={{ height: "1px", background: "var(--color-border-default)" }} />
            <div style={{ padding: "var(--spacing-card-padding)", display: "flex", flexDirection: "column", gap: "var(--space-3)", flex: 1 }}>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: "var(--text-sm-size)", color: "var(--color-text-secondary)" }}>Progress</span>
                  <span style={{ fontSize: "var(--text-sm-size)", fontWeight: 600, color: "var(--color-text-primary)" }}>{project.progress}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 999, background: "var(--color-bg-tertiary)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${project.progress}%`, borderRadius: 999, background: getProgressColor(project.health) }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: "var(--text-sm-size)", color: "var(--color-text-secondary)" }}>Health</span>
                <span style={{ fontSize: "var(--text-sm-size)", fontWeight: 600, color: getHealthColor(project.health) }}>{project.health}</span>
              </div>
              <div>
                <span style={{ fontSize: "var(--text-sm-size)", color: "var(--color-text-secondary)", display: "block" }}>Budget</span>
                <span style={{ fontSize: "var(--text-h3-size)", fontWeight: "var(--text-h3-weight)", color: "var(--color-text-primary)", display: "block" }}>{formatCurrency(project.budget)}</span>
                <span style={{ fontSize: "var(--text-sm-size)", color: "var(--color-text-secondary)" }}>{project.budgetUsedPct}% used ({formatCurrency(project.budgetUsed)})</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", paddingTop: "var(--space-2)", borderTop: "1px solid var(--color-border-default)" }}>
                {[{ value: project.activeItems, label: "Active" }, { value: project.depts, label: "Depts" }, { value: project.team, label: "Team" }].map(({ value, label }) => (
                  <div key={label}>
                    <span style={{ fontSize: "var(--text-h3-size)", fontWeight: "var(--text-h3-weight)", color: "var(--color-text-primary)", display: "block" }}>{value}</span>
                    <span style={{ fontSize: "var(--text-sm-size)", color: "var(--color-text-secondary)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--color-border-default)", padding: "var(--space-3) var(--spacing-card-padding)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <RiCalendarLine className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--color-text-secondary)" }} />
              <span style={{ fontSize: "var(--text-sm-size)", color: "var(--color-text-secondary)" }}>{project.startDate} - {project.endDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Reports Tab ───
function ReportsTab() {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-[length:var(--text-body-size)] text-muted-foreground">Reports view coming soon</p>
    </div>
  )
}

// ─── Main Export ───
export function CompanyHomeContent() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview",    label: "Overview" },
    { id: "safety-hub",  label: "Safety Hub" },
    { id: "projects",    label: "Projects" },
    { id: "open-items",  label: "Open Items" },
    { id: "reports",     label: "Reports" },
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      <div className="bg-card border-b border-border px-[var(--spacing-card-padding)] py-[var(--spacing-stack-gap)]">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-[length:var(--text-h1-size)] font-bold leading-[var(--text-h1-lh)] text-foreground">Company Home</h1>
            <p className="text-[length:var(--text-body-size)] leading-[var(--text-body-lh)] text-muted-foreground mt-1">Overview of all projects and activities</p>
          </div>
          <Button className="gap-2">
            <RiAddLine className="h-4 w-4" />
            Create
          </Button>
        </div>
        <div className="flex gap-4 border-b border-border -mb-3 -mx-4 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-2 text-[length:var(--text-body-size)] font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "open-items" ? (
        <div className="flex-1 overflow-hidden">
          <OpenItemsTab />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-[var(--spacing-page-margin)]">
          {activeTab === "overview"    && <OverviewTab />}
          {activeTab === "safety-hub" && <SafetyHubTab />}
          {activeTab === "projects"   && <ProjectsTab />}
          {activeTab === "reports"    && <ReportsTab />}
        </div>
      )}
    </div>
  )
}
