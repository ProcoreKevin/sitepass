# NGX Design System — Reference Cheat Sheet

Quick-lookup tables for use during implementation. For full rules, see the governing documents.

---

## Pattern Decision Tree

```
START: What is the user doing?
│
├─ Creating a NEW record?
│    └─ Pattern 3 — Slide-Out (480px, z-30, autosave, no Save/Cancel)
│
├─ Reviewing or editing an EXISTING record alongside a list?
│    └─ Pattern 1 — Split-View (Grid 37% LEFT, Detail 63% RIGHT)
│
├─ Viewing complex info that needs full width?
│    └─ Pattern 2 — Full-Workspace (single pane, 100%)
│         └─ When context panel opens → shifts to Pattern 4
│
└─ Detail + supplemental context (comments, activity)?
     └─ Pattern 4 — Context-Shift (Detail 63% LEFT, Context 37% RIGHT)
```

---

## View Type → Pattern Mapping

| View Type | Default Pattern | Create Action |
|-----------|----------------|---------------|
| Home View | Pattern 2 | N/A |
| Anchor View | Pattern 1 (after row select) | Pattern 3 Slide-Out |
| Detail View | Pattern 2 → Pattern 4 | N/A (edit in-place) |
| Settings View | Pattern 2 (internal sidebar) | N/A |
| Unified Viewer | z-80 (full takeover) | N/A |

---

## Z-Index Canonical Stack

```
z-80   Unified Viewer    Full-screen BIM/document/photo
z-50   Modal             Destructive confirmations — scrim: bg-black/50 fixed inset-0
z-30   Slide-Out         Create/filter workflows — scrim: bg-white/30 absolute (workspace)
z-20   Popover           Quick contextual interactions — NO scrim
z-10   Tooltip           Read-only hover info — NO scrim
z-0    Shell             Sidebar, Header, Workspace, Assist — always present
```

**Scrim positioning:**
- `z-30` Slide-Out scrim → `absolute inset-0` inside workspace container only
- `z-50` Modal scrim → `fixed inset-0` covers entire viewport including header

---

## Slide-Out Types and Footer Rules

| Type | Example | Footer Rule |
|------|---------|-------------|
| Data Entry | Create RFI, Create Submittal | NO Save/Cancel — autosave only |
| File Management | Attach documents | NO Save/Cancel — autosave only |
| Contextual View | Filter Panel, View Details | Apply/Cancel buttons — deliberate commit |
| System Config | Notification preferences | Apply/Cancel buttons — deliberate commit |

---

## Popover Types (all at z-20, no scrim)

| Type | Use Case | Max Width |
|------|----------|-----------|
| Selection Popover | Status change, assignee picker | 320px |
| Configuration Popover | Column visibility, sort options | 360px |
| Utility Popover | Bulk action menu, export options | 280px |
| Drafting Popover | Inline text entry, quick note | 400px |

**Popovers NEVER contain:** delete actions, destructive buttons, form-level Save.

---

## Token Quick Reference

### Background
| Semantic Token | Use Case |
|---------------|----------|
| `bg-background-primary` | Main surface, cards, panels, page headers, table thead / sticky chrome, filter chips row |
| `bg-background-secondary` | Row hover, zebra, muted strips — not static headers (`app/legacy-theme.css` §02) |
| `bg-background-tertiary` | Selected state on table rows |
| `bg-background-disabled` | Disabled input fields |
| `bg-asphalt-100` | Active (clicked) table row — non-negotiable |
| `bg-asphalt-900` | Sidebar (dark) |

### Text
| Semantic Token | Use Case |
|---------------|----------|
| `text-foreground-primary` | Body text, values, primary content |
| `text-foreground-secondary` | Labels, helper text, table headers |
| `text-foreground-tertiary` | Timestamps, metadata, secondary hints |
| `text-foreground-inverse` | Text on dark backgrounds |
| `text-danger-600` | Error text, overdue indicators |
| `text-success-800` | Success states ("Saved" autosave indicator) |

### Border
| Semantic Token | Use Case |
|---------------|----------|
| `border-border-default` | Standard dividers, card borders |
| `border-border-hover` | Interactive border on hover |
| `border-border-input-default` | Input field border (default) |
| `border-border-input-hover` | Input field border (hover) |
| `border-border-input-focus` | Input field border (focus) |
| `border-border-inactive` | Locked/disabled chips |

### Status Colors
| Semantic Token | Use Case |
|---------------|----------|
| `bg-danger-25 text-danger-600` | Incomplete/error status badge |
| `bg-badge-secondary-bg text-badge-secondary-text` | Draft status badge |
| `bg-informative-600 text-white` | Active/info status badge |
| `text-danger-600` | Overdue due date indicator |

---

## Locked Component Styling (Non-Customizable)

These values are enforced by the Pattern Component Library and must not be overridden:

```
TableActionRow container:
  px-4 py-3 border-b border-border-default bg-background-primary

SplitViewHeader container:
  bg-background-primary border-b border-border-default

ManualSaveFooter:
  bg-background-primary border-t border-border-default shadow-lg

Save button: bg-asphalt-950 text-white
Cancel button: bg-background-secondary text-foreground-primary

TableRow active: bg-asphalt-100 (NO borders, NO other bg override)
TableRow hover: bg-background-secondary
TableRow selected (checkbox): bg-background-tertiary
```

---

## Form Zone Architecture — Quick Spec

### Zone 1 — Identity Strip
```
bg-background-primary · border-b border-border-default
Form type:     text-xs font-medium text-foreground-tertiary uppercase tracking-wider
Form number:   text-2xl font-extrabold text-foreground-primary — NEVER truncate
Status badge:  StatusBadge component — never custom
Overdue date:  text-danger-600 + explicit indicator
Sticky:        Required on Tier 3, 4, 5 forms
```

### Zone 2 — Primary Content
```
Single column ONLY
Field-to-field: gap-2 (8px)
Label to input: gap-1 (4px)
Above section header: mt-6 (24px)
Below section header: mt-3 (12px)

Field label:  text-sm font-medium text-foreground-secondary · sentence case
Field value:  text-sm font-medium text-foreground-primary (primary)
              text-sm font-normal text-foreground-secondary (secondary)
Section hdr:  text-xs font-bold text-foreground-tertiary uppercase tracking-widest

Field order:
  Primary:   Status · Due Date · Assigned To · Total Amount · Question/Description
  Secondary: Submitter · Submitted Date · Spec Section · Drawing Reference
  Tertiary:  Created By · Created Date · System IDs → hidden behind "Show more"
```

### Zone 3 — Context Panel
```
Desktop: w-80 (320px) right rail
Tablet:  bottom sheet trigger always visible
Mobile:  sheet trigger only
Collapsible — user can dismiss to expand Zone 2
NEVER requires navigation to access
```

### Zone 4 — Action Bar
```
bg-background-primary border-t border-border-default
Primary action: right-aligned · bg-foreground-primary text-foreground-inverse
Secondary:      left-aligned · outlined/ghost
Max 2 visible actions — overflow to "..." menu
Role-aware: same status = different CTA for each role
```

---

## Form Complexity Tiers

| Tier | Field Count | Zone 1 Sticky | Notes |
|------|------------|--------------|-------|
| 1 — Quick Capture | 3–8 | Static | Pattern A |
| 2 — Structured Record | 8–20 | Static | Pattern B |
| 3 — Routed Document | 15–30 | **Required** | Pattern C · RFIs, Submittals |
| 4 — Financial Form | 20–40 | **Required** | Pattern D · Change Orders, Budgets |
| 5 — Guided Process | 40+ | **Required** | Pattern E · Multi-step |

Quick Create / Guided Create (Slide-Out entry point): Tier 1–2 = Quick Create · Tier 5 = Guided Create

---

## Destructive Action Tiers

| Tier | Risk | UI | Duration |
|------|------|-----|----------|
| 1 | Low-risk, reversible | Undo toast only — no modal | 5–7s |
| 2 | Irreversible, bounded | Modal (z-50) · [Cancel] [Delete Entity] | — |
| 3 | Critical, cascading | Modal + typed confirmation + enumerate consequences | — |

**Role scope:** Author=own drafts · Controller=managed set · Reviewer/Consumer=none

---

## Filter Panel Spec

```
Component type:  Slide-Out — Contextual View
Width:           w-[480px]
Z-index:         z-30
Trigger:         "Filters" button inside TableActionRow
Footer:          Apply Filters + Cancel (deliberate commit — Contextual View type)
Chips row:       below TableActionRow, above data table
Chip style:      rounded-full bg-background-primary border border-border-default
Locked chip:     bg-asphalt-100 text-foreground-tertiary border-border-inactive cursor-not-allowed

Logic:
  AND across different fields (intersection)
  OR within same field (union)
  Permissions = silent pre-filter (always applied before view filters)

Dynamic values ("Me", "Today") → resolve at render · never hardcode at save time
Clear All → never removes locked filters
Major changes (filter add/remove) → triggers "unsaved changes" state
Minor changes (sort, column show/hide) → silent, no save prompt
```

---

## Construction Domain — Entity Associations

| When this is selected | Auto-populate / validate |
|----------------------|--------------------------|
| Company | Filter Contacts to that company · Auto-fill Trade · Show insurance warnings |
| Location | Suggest Drawings for that area · Pre-select responsible Company |
| Spec Section | Suggest Submittal types · Auto-suggest Subcontractor · Link Cost Codes |
| Cost Code | Validate against remaining budget |
| Financial impact > $10k | Require attachments · Trigger owner notification |
| RFI due date < today+3 | Warn "Expedited" · Suggest Priority = High |
| Schedule Task linked | Show float · Warn on delay · Suggest related tasks |

---

## Construction Button Labels

| Generic | Construction-Specific |
|---------|----------------------|
| Submit | Submit for Review · Submit Answer |
| Reject | Revise & Resubmit · Reject with Comments |
| Approve | Approve Submittal · Approve & Distribute |
| Delete | Void [Entity] (with confirmation) |
| Complete | Verify Complete · Close [Entity] |

---

## User Role × Action Matrix (Zone 4)

| Role | RFI "Open" | Submittal "In Review" | Change Order "Pending" |
|------|-----------|----------------------|----------------------|
| **Author** | Follow Up | Follow Up | Edit |
| **Controller** | Reassign | Assign Reviewer | Approve / Reject |
| **Reviewer** | Respond | Approve / Return | Review |
| **Consumer** | *(none — read-only)* | *(none — read-only)* | *(none — read-only)* |

Full matrix → see Form-Based Detail Page PRD Section 03.

---

## Gold Standard Reference Implementations

| Reference | Location | Demonstrates |
|-----------|----------|-------------|
| RFI table | `/src/app/components/rfis/rfi-table.tsx` | TableRow active state, TableCell, horizontal scroll |
| RFI action row | `/src/app/components/rfis/table-action-row.tsx` | TableActionRow extension pattern |
| RFI detail view | `/src/app/components/rfis/rfi-detail-view.tsx` | SplitViewDetail, ManualSaveFooter, dirty state |
| Document index table | `/DOCUMENT_INDEX_TABLE_GOLD_STANDARD.md` | Filter chips, locked filters, Clear All |

---

*Full rules in governing documents. This reference covers the 80% case.*
*Run `scripts/check-compliance.sh [file-or-directory]` to scan for token and pattern violations.*
