// ─── Project-specific mock data for the project home template ─────────────────
// Keyed by the project IDs defined in navigation-context.tsx

import type React from "react"

export interface OpenItem {
  id: string
  typeIcon: string // emoji / text shorthand rendered as icon label
  description: string
  date: string
  statusLabel: string
  statusVariant: "ready" | "in-progress" | "open" | "overdue"
}

export interface ChangeEvent {
  id: string
  title: string
  total: string
}

export interface TimelinePhase {
  id: string
  name: string
  status: "on-track" | "planning" | "bidding"
  statusLabel: string
}

export interface ChangeReasonSegment {
  label: string
  count: number
  color: string
}

export interface SummaryMetric {
  label: string
  value: string
  variant: "normal" | "danger" | "success"
}

export interface ProjectData {
  /** Project thumbnail gradient stops */
  thumbGradient: [string, string]
  thumbLabel: string
  address: string
  weather: { temp: string; high: string; low: string; icon: string }
  setup: { complete: number; total: number; nextTask: string; nextTaskDesc: string }
  timeline: { percentComplete: number; phases: TimelinePhase[] }
  summary: { metrics: SummaryMetric[] }
  changeReasons: ChangeReasonSegment[]
  openItems: OpenItem[]
  changeEvents: ChangeEvent[]
}

// ─── Per-project data map ────────────────────────────────────────────────────

export const PROJECT_DATA: Record<string, ProjectData> = {
  "burnham-park-dc": {
    thumbGradient: ["#1a2a4a", "#2d4a7a"],
    thumbLabel: "Data Center",
    address: "201 East Randolph Street, Chicago, IL 60601",
    weather: { temp: "54°F", high: "58°", low: "41°", icon: "⛅" },
    setup: {
      complete: 7,
      total: 20,
      nextTask: "Task 08",
      nextTaskDesc: "Assign commissioning authority and define systems test schedule",
    },
    timeline: {
      percentComplete: 33,
      phases: [
        { id: "1", name: "Structural & Raised Floor",       status: "on-track", statusLabel: "On Track" },
        { id: "2", name: "MEP & Power Infrastructure",      status: "planning", statusLabel: "Planning" },
        { id: "3", name: "Cooling & IT Build-Out",          status: "bidding",  statusLabel: "Bidding" },
      ],
    },
    summary: {
      metrics: [
        { label: "Revised Budget",          value: "$2.45bn",  variant: "normal" },
        { label: "Approved Budget Changes",  value: "$3.2M",    variant: "normal" },
        { label: "Projected Costs",          value: "$1.38bn",  variant: "normal" },
        { label: "% Projected/Forecast",     value: "56.09%",   variant: "normal" },
        { label: "Est. Cost at Completion",  value: "$2.46bn",  variant: "normal" },
        { label: "% Forecast",              value: "43.91%",   variant: "normal" },
        { label: "Projected Over Under",     value: "-$6.73M",  variant: "danger" },
        { label: "% Forecast/Budget",        value: "100.27%",  variant: "danger" },
      ],
    },
    changeReasons: [
      { label: "Allowance",              count: 25, color: "var(--color-chart-2)" },
      { label: "Existing Conditions",    count: 23, color: "var(--color-border-strong)" },
      { label: "Design Change",          count: 17, color: "var(--color-chart-1)" },
      { label: "Inspector Request",      count: 14, color: "#111827" },
    ],
    openItems: [
      { id: "1", typeIcon: "RFI",  description: "#RFI-31: UPS battery room ventilation rate",      date: "Dec 08, 2024", statusLabel: "READY FOR REVIEW", statusVariant: "ready" },
      { id: "2", typeIcon: "ISSUE",description: "#7: Generator pad elevation conflict — Pod B",    date: "Dec 07, 2024", statusLabel: "IN PROGRESS",      statusVariant: "in-progress" },
      { id: "3", typeIcon: "SUB",  description: "#BP-114: Precision cooling unit submittal",       date: "Dec 06, 2024", statusLabel: "IN PROGRESS",      statusVariant: "in-progress" },
      { id: "4", typeIcon: "MTG",  description: "Power infrastructure coordination — Tier III",   date: "Dec 05, 2024", statusLabel: "IN PROGRESS",      statusVariant: "in-progress" },
      { id: "5", typeIcon: "OBS",  description: "#OBS-4: Cable tray support spacing non-conform", date: "Dec 04, 2024", statusLabel: "OPEN",             statusVariant: "open" },
    ],
    changeEvents: [
      { id: "BP-22", title: "#BP-22: Switchgear Voltage Upgrade",           total: "$412,500" },
      { id: "BP-17", title: "#BP-17: Raised Floor Load Rating Change",      total: "$98,200"  },
      { id: "BP-08", title: "#BP-08: Additional Fiber Conduit — Pod A",     total: "$34,750"  },
      { id: "BP-18", title: "#BP-18: Fire Suppression System Redesign",     total: "$187,400" },
      { id: "BP-13", title: "#BP-13: Generator Fuel Tank Capacity Increase",total: "$62,100"  },
      { id: "BP-12", title: "#BP-12: Cooling Tower Structural Reinforce",   total: "$145,900" },
    ],
  },

  "gateway-office": {
    thumbGradient: ["#1a3a2a", "#2a5a3a"],
    thumbLabel: "Office Complex",
    address: "500 Commerce Street, Dallas, TX 75201",
    weather: { temp: "84°F", high: "89°", low: "68°", icon: "☀️" },
    setup: {
      complete: 3,
      total: 20,
      nextTask: "Task 04",
      nextTaskDesc: "Define project budget baseline and cost tracking structure",
    },
    timeline: {
      percentComplete: 12,
      phases: [
        { id: "1", name: "Site Survey & Assessment",   status: "on-track", statusLabel: "On Track" },
        { id: "2", name: "Schematic Design Phase",     status: "planning", statusLabel: "Planning" },
        { id: "3", name: "Permitting & Procurement",   status: "bidding",  statusLabel: "Bidding" },
      ],
    },
    summary: {
      metrics: [
        { label: "Revised Budget",          value: "$185M",    variant: "normal" },
        { label: "Approved Budget Changes",  value: "$0.00",    variant: "normal" },
        { label: "Projected Costs",          value: "$22.2M",   variant: "normal" },
        { label: "% Projected/Forecast",     value: "12.00%",   variant: "normal" },
        { label: "Est. Cost at Completion",  value: "$185M",    variant: "normal" },
        { label: "% Forecast",              value: "12.00%",   variant: "normal" },
        { label: "Projected Over Under",     value: "$0.00",    variant: "normal" },
        { label: "% Forecast/Budget",        value: "100.00%",  variant: "normal" },
      ],
    },
    changeReasons: [
      { label: "Allowance",           count: 5,  color: "var(--color-chart-2)" },
      { label: "Design Change",       count: 3,  color: "var(--color-chart-1)" },
      { label: "Owner Request",       count: 2,  color: "var(--color-border-strong)" },
      { label: "Scope Addition",      count: 1,  color: "#111827" },
    ],
    openItems: [
      { id: "1", typeIcon: "RFI",  description: "#RFI-01: Foundation depth clarification",  date: "Dec 02, 2024", statusLabel: "OPEN",             statusVariant: "open" },
      { id: "2", typeIcon: "ISSUE",description: "#1: Site boundary survey discrepancy",      date: "Dec 01, 2024", statusLabel: "IN PROGRESS",      statusVariant: "in-progress" },
      { id: "3", typeIcon: "SUB",  description: "#001: Structural steel preliminary specs",  date: "Nov 28, 2024", statusLabel: "READY FOR REVIEW", statusVariant: "ready" },
    ],
    changeEvents: [
      { id: "CE-01", title: "#CE-01: Additional Geotechnical Investigation", total: "$18,500" },
      { id: "CE-02", title: "#CE-02: Utility Relocation — East Boundary",    total: "$34,200" },
      { id: "CE-03", title: "#CE-03: Design Fee Adjustment",                 total: "$9,750"  },
    ],
  },

  "riverside-medical": {
    thumbGradient: ["#1a2a3a", "#2a4a6a"],
    thumbLabel: "Medical Center",
    address: "3201 Red River Street, Austin, TX 78705",
    weather: { temp: "79°F", high: "83°", low: "62°", icon: "🌤" },
    setup: {
      complete: 12,
      total: 20,
      nextTask: "Task 13",
      nextTaskDesc: "Complete MEP coordination drawings for floors 3–6",
    },
    timeline: {
      percentComplete: 58,
      phases: [
        { id: "1", name: "Structural Frame Complete",    status: "on-track", statusLabel: "On Track" },
        { id: "2", name: "MEP Rough-In Phase",           status: "planning", statusLabel: "Planning" },
        { id: "3", name: "Interior Fit-Out & Finishes",  status: "bidding",  statusLabel: "Bidding" },
      ],
    },
    summary: {
      metrics: [
        { label: "Revised Budget",          value: "$312M",    variant: "normal" },
        { label: "Approved Budget Changes",  value: "$4.2M",    variant: "normal" },
        { label: "Projected Costs",          value: "$195M",    variant: "normal" },
        { label: "% Projected/Forecast",     value: "62.50%",   variant: "normal" },
        { label: "Est. Cost at Completion",  value: "$316.2M",  variant: "normal" },
        { label: "% Forecast",              value: "62.50%",   variant: "normal" },
        { label: "Projected Over Under",     value: "-$4.2M",   variant: "danger" },
        { label: "% Forecast/Budget",        value: "101.35%",  variant: "danger" },
      ],
    },
    changeReasons: [
      { label: "Owner Requested Change", count: 18, color: "var(--color-chart-2)" },
      { label: "Existing Conditions",    count: 14, color: "var(--color-border-strong)" },
      { label: "Code Compliance",        count: 9,  color: "var(--color-chart-1)" },
      { label: "Design Coordination",    count: 6,  color: "#111827" },
    ],
    openItems: [
      { id: "1", typeIcon: "RFI",  description: "#RFI-42: Radiology suite shielding spec",  date: "Dec 05, 2024", statusLabel: "READY FOR REVIEW", statusVariant: "ready" },
      { id: "2", typeIcon: "ISSUE",description: "#12: HVAC duct routing conflict — L4",     date: "Dec 04, 2024", statusLabel: "IN PROGRESS",      statusVariant: "in-progress" },
      { id: "3", typeIcon: "SUB",  description: "#307-2: Medical gas system submittal",     date: "Dec 03, 2024", statusLabel: "IN PROGRESS",      statusVariant: "in-progress" },
      { id: "4", typeIcon: "OBS",  description: "#OBS-8: Fire-stop penetration deficiency", date: "Dec 01, 2024", statusLabel: "OVERDUE",          statusVariant: "overdue" },
    ],
    changeEvents: [
      { id: "CE-18", title: "#CE-18: Infection Control Zone Upgrade",   total: "$127,400" },
      { id: "CE-19", title: "#CE-19: Generator Capacity Increase",      total: "$89,000"  },
      { id: "CE-20", title: "#CE-20: Nurse Station Reconfiguration",    total: "$43,600"  },
      { id: "CE-21", title: "#CE-21: Additional Fire Suppression Work", total: "$31,200"  },
    ],
  },

  "burnham-park-planning": {
    thumbGradient: ["#2a1a4a", "#4a2a7a"],
    thumbLabel: "Phase 2 Planning",
    address: "201 East Randolph Street, Chicago, IL 60601",
    weather: { temp: "68°F", high: "71°", low: "54°", icon: "🌧" },
    setup: {
      complete: 1,
      total: 20,
      nextTask: "Task 02",
      nextTaskDesc: "Engage civil engineer for preliminary site feasibility study",
    },
    timeline: {
      percentComplete: 5,
      phases: [
        { id: "1", name: "Feasibility & Programming", status: "on-track", statusLabel: "On Track" },
        { id: "2", name: "Conceptual Design",         status: "planning", statusLabel: "Planning" },
        { id: "3", name: "Entitlements",              status: "bidding",  statusLabel: "Bidding" },
      ],
    },
    summary: {
      metrics: [
        { label: "Planned Budget",           value: "$890M",   variant: "normal" },
        { label: "Approved Budget Changes",  value: "$0.00",   variant: "normal" },
        { label: "Committed Costs",          value: "$2.1M",   variant: "normal" },
        { label: "% Budget Committed",       value: "0.24%",   variant: "normal" },
        { label: "Est. Cost at Completion",  value: "$890M",   variant: "normal" },
        { label: "% Forecast",             value: "0.24%",   variant: "normal" },
        { label: "Projected Over Under",     value: "$0.00",   variant: "normal" },
        { label: "% Forecast/Budget",        value: "100.00%", variant: "normal" },
      ],
    },
    changeReasons: [
      { label: "Scope Addition",    count: 2, color: "var(--color-chart-2)" },
      { label: "Owner Request",     count: 1, color: "var(--color-chart-1)" },
    ],
    openItems: [
      { id: "1", typeIcon: "RFI",  description: "#RFI-01: Zoning variance clarification",     date: "Dec 10, 2024", statusLabel: "OPEN",        statusVariant: "open" },
      { id: "2", typeIcon: "ISSUE",description: "#1: Utility easement conflict on north side", date: "Dec 08, 2024", statusLabel: "IN PROGRESS", statusVariant: "in-progress" },
    ],
    changeEvents: [
      { id: "CE-01", title: "#CE-01: Expanded Scope — Parking Structure", total: "$12,000" },
    ],
  },

  "metro-transit": {
    thumbGradient: ["#1a1a2a", "#2a2a4a"],
    thumbLabel: "Transit Hub",
    address: "1021 Commerce Street, San Antonio, TX 78207",
    weather: { temp: "91°F", high: "95°", low: "74°", icon: "☀️" },
    setup: {
      complete: 14,
      total: 20,
      nextTask: "Task 15",
      nextTaskDesc: "Coordinate platform canopy steel erection with TxDOT shutdown window",
    },
    timeline: {
      percentComplete: 71,
      phases: [
        { id: "1", name: "Civil & Underground Complete",   status: "on-track", statusLabel: "On Track" },
        { id: "2", name: "Platform & Canopy Structure",    status: "planning", statusLabel: "Planning" },
        { id: "3", name: "Systems Integration & Testing",  status: "bidding",  statusLabel: "Bidding" },
      ],
    },
    summary: {
      metrics: [
        { label: "Revised Budget",          value: "$540M",    variant: "normal" },
        { label: "Approved Budget Changes",  value: "$12.3M",   variant: "normal" },
        { label: "Projected Costs",          value: "$403M",    variant: "normal" },
        { label: "% Projected/Forecast",     value: "74.63%",   variant: "normal" },
        { label: "Est. Cost at Completion",  value: "$554.8M",  variant: "normal" },
        { label: "% Forecast",             value: "74.63%",   variant: "normal" },
        { label: "Projected Over Under",     value: "-$14.8M",  variant: "danger" },
        { label: "% Forecast/Budget",        value: "102.74%",  variant: "danger" },
      ],
    },
    changeReasons: [
      { label: "Differing Site Conditions", count: 31, color: "var(--color-chart-2)" },
      { label: "Design Change",             count: 22, color: "var(--color-chart-1)" },
      { label: "Regulatory Requirement",    count: 16, color: "var(--color-border-strong)" },
      { label: "Owner Request",             count: 9,  color: "#111827" },
    ],
    openItems: [
      { id: "1", typeIcon: "RFI",  description: "#RFI-88: Platform edge gap specification",   date: "Dec 06, 2024", statusLabel: "READY FOR REVIEW", statusVariant: "ready" },
      { id: "2", typeIcon: "ISSUE",description: "#34: Overhead catenary alignment deviation",  date: "Dec 05, 2024", statusLabel: "IN PROGRESS",      statusVariant: "in-progress" },
      { id: "3", typeIcon: "SUB",  description: "#512-3: Passenger information display units", date: "Dec 04, 2024", statusLabel: "IN PROGRESS",      statusVariant: "in-progress" },
      { id: "4", typeIcon: "MTG",  description: "TxDOT Coordination — Track B Closure",       date: "Dec 03, 2024", statusLabel: "IN PROGRESS",      statusVariant: "in-progress" },
      { id: "5", typeIcon: "OBS",  description: "#OBS-19: Stairwell handrail non-conformance", date: "Dec 01, 2024", statusLabel: "OVERDUE",          statusVariant: "overdue" },
    ],
    changeEvents: [
      { id: "CE-44", title: "#CE-44: Track Subbase Remediation",          total: "$2,140,000" },
      { id: "CE-45", title: "#CE-45: Electrical Vault Relocation",        total: "$890,000"   },
      { id: "CE-46", title: "#CE-46: ADA Elevator Scope Expansion",       total: "$560,000"   },
      { id: "CE-47", title: "#CE-47: Canopy Steel Gauge Upgrade",         total: "$430,000"   },
      { id: "CE-48", title: "#CE-48: Signage System Change Order",        total: "$215,000"   },
    ],
  },
}

/** Returns data for the given project ID, falling back to burnham-park-dc */
export function getProjectData(projectId: string): ProjectData {
  return PROJECT_DATA[projectId] ?? PROJECT_DATA["burnham-park-dc"]
}
