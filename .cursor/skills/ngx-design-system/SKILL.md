---
name: ngx-design-system
description: >
  Use this skill for ANY task involving the NGX Design System — building views,
  pages, components, or features for the Procore construction management platform.
  Triggers include: designing or implementing any UI view (Home, Anchor, Detail,
  Settings, Unified Viewer), building forms or tables, adding Slide-Outs, Popovers,
  or Modals, creating or editing pattern components, implementing filter systems,
  reviewing code or designs for design system compliance, planning a new tool or
  feature, or any time the user references NGX, Procore tools, RFIs, Submittals,
  Change Orders, or construction domain UI. Also triggers for: "does this follow
  the design system", "build me a [tool] view", "is this the right pattern",
  "add a create flow", "implement a filter", "check compliance", Untitled UI,
  UUI facades, token bridge, primitive alignment, Untitled vs RAC, facade defaults,
  or broken button/select layout in the shell.
---

# NGX Design System — Agent Skill

You are a design and engineering partner for the NGX Design System at Procore Technologies. Your role is to design and implement construction management software that is architecturally correct, visually consistent, and semantically compliant.

You enforce **five governing documents**. Every implementation decision must trace back to one of them. When they conflict, the hierarchy below resolves it.

---

## Document Hierarchy (Conflict Resolution Order)

| Priority | Document | Governs |
|----------|----------|---------|
| 1 | `Guidelines.md` | Master rulebook · Rules 0.1–1.13 · All numbered rules · Token mandate |
| 2 | `Interaction-Model-Architecture.md` | Workspace layout · Z-index hierarchy · Shell dimensions |
| 3 | `Pattern-Component-Library.md` | Base React components · Import & Extend mandate |
| 4 | `Form-Creation-Checklist.md` | Form field rules · Zone architecture · CRUD patterns · Destructive actions |
| 5 | `Filter-System-Implementation.md` | Filter logic · Filter UI · Saved views · TableActionRow integration |

When you cite a rule, reference its document and rule number (e.g., "Guidelines Rule 0.4", "Architecture RULE 1").

---

## Protocol: Before Writing Any Code

Run this checklist mentally before generating a single line. Block if any step cannot be answered.

```
1. IDENTIFY VIEW TYPE
   What is the output? → Home View / Anchor View / Detail View / Settings / Unified Viewer
   If unclear → ASK which type before proceeding

2. IDENTIFY TOOL PARENT
   Does this tool exist in the App Sidebar? (Guidelines Rule 0.3)
   If NO or unclear → BLOCK. "Which sidebar tool does this belong to?"
   If new tool → add to sidebar first, then build view

3. IDENTIFY INTERACTION PATTERN
   Pattern 1 (Split-View 33/67)   — Review & edit existing records
   Pattern 2 (Full-Workspace)     — Dashboards, complex detail, read-heavy
   Pattern 3 (Slide-Out)          — Create new records, autosave, NO Save/Cancel
   Pattern 4 (Context-Shift 67/33) — Detail + supplemental context panel
   → See REFERENCE.md Pattern Decision Tree

4. CHECK TOKEN MANDATE (Guidelines Rule 0.1)
   NO hex codes. NO bg-white. NO raw color values.
   ALL colors → semantic CSS variables (e.g., bg-background-primary, text-foreground-secondary)
   → See REFERENCE.md Token Quick Reference

5. CHECK COMPONENT MANDATE (Guidelines Rule 0.4)
   Does a base pattern component exist for this element?
   TableActionRow · TableRow/TableCell · SplitViewDetail · ManualSaveFooter · StatusBadge
   If YES → IMPORT and EXTEND. NEVER duplicate. NEVER build custom from scratch.

6. CHECK PANE COUNT (Architecture RULE 1 = Guidelines Rule 0.6)
   Workspace MAXIMUM = 2 panes. Never 3.
   Slide-Outs, Popovers, Modals → z-index layers above workspace, NOT panes.

7. CHECK UUI / UNTITLED SHELL (app integration)
   See **Untitled UI + customer tokens** below — layout, slots, and CSS layers.
```

---

## Untitled UI + customer tokens (no broken chrome)

The app uses **local `@untitledui/react` (Design-System)** primitives with **NGX / legacy customer tokens** (`--ds-*`, `[data-theme="legacy"]`, `app/globals.css`, `app/legacy-theme.css`, `app/uui-ngx-token-bridge.css`). **Do not fork Untitled component internals** to “fix” color — map tokens in CSS layers instead. **Do** fix **composition and layout** so controls render correctly everywhere (tool pages, flex/grid shells, `/dev/uui-studio/facades`).

### Token and layer rules

- **Brand ramp:** `--color-brand-*` must come from **`uui-ngx-token-bridge`** + **`legacy-theme`** / **`ngx-canonical-tokens`**. Never redefine `--color-brand-*` on **unlayered** `:root` in a way that **cycles** with `--primary` (that invalidates fills and reads as “white on white”).
- **Semantic surfaces:** Prefer **`--color-bg-primary`**, **`--color-text-primary`**, **`--input`**, **`border-border-*`**, **`--radius-*`**, **`--spacing-*`**, **`--height-button*`** over raw hex in app code (Guidelines Rule 0.1 still applies).
- **Keep Untitled intact:** Theme **color, spacing, radius, size, padding** via CSS variables and Tailwind `@theme` / legacy overrides — not by replacing Untitled `Button`/`Select` with one-off divs unless the pattern library explicitly allows it.

### `Button` (`@/components/ui/button` → `UuiAppButton`)

- **Icons beside labels:** Use **`iconLeading={Icon}`** and/or **`iconTrailing={Icon}`** (component reference or element). Shadcn-style **`<Button><Plus />Label</Button>`** is auto-promoted when possible, but **explicit slots are preferred** for compound triggers (e.g. label + **trailing chevron** + badge).
- **Never rely** on sibling icon + text **inside** Untitled’s **`data-text`** span without **`inline-flex`** on that span (handled in Design-System `button.tsx`) or without **`iconLeading`/`iconTrailing`**.
- **Toolbar / header actions:** Prefer **`whitespace-nowrap`**, **`shrink-0`**, and **`min-w-0`** on the **parent row** so buttons are not squeezed into a column.

### `Select` (`@/components/ui/select`)

- **`SelectValue` must expose `data-slot="select-value"`** so trigger styles (`truncate`, `min-w-0`, `flex-1`) apply; otherwise the value and chevron **stack vertically** in narrow flex layouts.
- Triggers already use **`w-full min-w-0`** on the root; keep that when wrapping in grids.

### `DropdownMenu` / `DropdownMenuItem`

- Default menu rows use **horizontal flex** (`flex-row flex-nowrap`, `items-center`, `gap-2`, `min-w-0`). For **icon + label** items, either rely on that row or wrap content in **`<span className="inline-flex min-w-0 items-center gap-2">`** when mixing icons with conditional nodes.

### Accordion (`AccordionTrigger`)

- Trigger uses **one chevron slot** (Plus/Minus overlaid) and **`min-w-0 flex-1`** on the title wrapper so the label and control stay **one horizontal row** with **`items-center`**.

### Facade review (`/dev/uui-studio/facades`)

- Previews run under **real app CSS** (legacy on `<html>`). After token or shell changes, **spot-check** facades for **Button**, **Select**, and **forms** — the gallery is the fast path for “unstyled or broken” regressions.

### Primitive alignment (Untitled vs RAC — this template)

The app uses a **hybrid headless stack**: some facades wrap **`@untitledui/react`**, others **`react-aria-components`**, and some **`components/ui-next`**. **Do not guess** which primitive backs a control — consult the matrix and rules:

- **Authoritative doc:** `docs/primitive-facade-defaults.md` — reference (Storybook / OOTB Untitled) vs product shell, per-facade UUI/RAC/DOM, rules for new work, layer + bridge reminders.
- **Migration context:** `docs/migration-uui-rac-status.md` — toast/tooltip convergence, facade barrel notes.
- **Mandate:** `docs/frontend-ngx-untitled-mandate.md` — `@/components/ui/*` import surface; ESLint blocks direct `@untitledui/react` outside allowed folders.

**Imports (app routes under `app/`):**

- **`toast` / `useToast`** → **`@/lib/toast`** only. **`@/hooks/*`** in `tsconfig` maps to **Design-System** — never `import … from "@/hooks/use-toast"` in app code.
- **ESLint:** `.eslintrc.json` — `app/**/*.{ts,tsx}` uses `no-restricted-imports` for `@/hooks/use-toast` (and Untitled direct-import patterns). New app code should not trigger these.

**Checks before merging facade or token work:**

- `pnpm run lint` (includes restricted-import rules for `app/`).
- `pnpm run lint:compliance` when `app/` or `components/ui/` changed.
- Spot-check **`/dev/uui-studio/facades`** for the primitives you touched.

---

## Implementing Views

### Home View (Pattern 2)
- Full workspace width · Dashboard layout
- Stats cards, activity feeds, quick actions
- NO split panes

### Anchor View (Pattern 1 or Pattern 3 for create)
- Left pane: Grid/Table at 37% (475px)
- Right pane: Detail at 63% (965px) — uses `SplitViewDetail` component
- Create action: Pattern 3 Slide-Out (480px, z-30, autosave)
- Table MUST use `TableActionRow` + `TableRow` + `TableCell` pattern components
- Active row state: `bg-asphalt-100` — no borders, no color overrides

### Detail View (Pattern 2 → Pattern 4)
- Starts full-width (Pattern 2)
- Opens context panel at 37% on right (Pattern 4)
- MUST implement Zone Architecture (see below)

### Settings View (Pattern 2)
- Internal sidebar at 240px for section navigation
- Content area full width minus sidebar

---

## Zone Architecture (Form Detail Pages)

Every form detail page uses four invariant zones. Apply these regardless of form type.

```
┌─────────────────────────────────────────────────────┐
│  ZONE 1 — Identity Strip                            │
│  Form type · Number (never truncate) · Title        │
│  StatusBadge · Key timestamps                       │
│  STICKY on scroll for Tier 3, 4, 5 forms            │
├──────────────────────────────────┬──────────────────┤
│  ZONE 2 — Primary Content        │  ZONE 3          │
│  Decision-relevance field order  │  Context Panel   │
│  Primary → Secondary → Tertiary  │  Conversations   │
│  (Tertiary hidden by default)    │  Related Items   │
│  Single column only              │  Workflow log    │
│  8px grid spacing                │  Audit trail     │
│  Labels: text-sm font-medium     │  Opens INLINE    │
│  text-foreground-secondary       │  (no navigation) │
├──────────────────────────────────┴──────────────────┤
│  ZONE 4 — Action Bar (fixed bottom)                 │
│  Role-aware · Lifecycle-aware · Max 2 visible        │
└─────────────────────────────────────────────────────┘
```

**Field ordering in Zone 2 — decision relevance, not schema order:**
- Primary: Status · Due Date · Assigned To · Total Amount · Description · Schedule Impact
- Secondary: Submitter · Submitted Date · Spec Section · Drawing Reference
- Tertiary: Created By · Created Date · System IDs (hidden behind "Show more")

**Zone 4 actions are role-aware:**
Author sees different primary action than Reviewer, Controller, or Consumer.
Consumer role = read-only, no action button.

---

## Building Forms (Slide-Out Create Flow)

```
1. Form opens as Pattern 3 Slide-Out (z-30, 480px, bg-background-primary)
2. Draft row IMMEDIATELY created in parent table (left pane)
3. Draft row AUTO-SELECTED → split-view detail opens at 63%
4. StatusBadge shows "Incomplete" until required fields complete → "Draft"
5. Autosave syncs to draft row in real-time
6. NO Save/Cancel buttons — X button and ESC only
7. Scrim: bg-white/30 on workspace area ONLY (absolute, not fixed; below Global Header)
```

**Field ordering in Slide-Out:** Lead with the identification field (Name/Title/Number) to reduce first-entry friction. Decision-relevance ordering governs the full detail page, not the Slide-Out create form.

**Labels:** `text-sm font-medium text-foreground-secondary` — sentence case — ALWAYS.

---

## Destructive Actions (Three-Tier Model)

Never apply a flat modal to all deletions. Match friction to consequence.

| Tier | Risk Level | Implementation |
|------|-----------|----------------|
| **1** | Low-risk, reversible | Undo toast 5–7s · NO modal |
| **2** | High-risk, irreversible, bounded | Modal (z-50) · verb + object CTA · enumerate consequences |
| **3** | Critical, cascading | Modal + typed confirmation · enumerate all downstream impact · authority check |

**Role permissions on destructive actions:**
- Author → delete own drafts only
- Controller → void/archive within managed set
- Reviewer/Consumer → NO destructive actions
- Popovers → NEVER contain destructive actions

---

## Z-Index Layer System

| Layer | Class | Used For | Scrim |
|-------|-------|----------|-------|
| Shell | `z-0` | Sidebar, Header, Workspace, Assist | None |
| Tooltip | `z-10` | Read-only hover info | None |
| Popover | `z-20` | Quick contextual interactions | None |
| Slide-Out | `z-30` | Create/edit/filter workflows | `bg-white/30` workspace only |
| Modal | `z-50` | Destructive confirmations | `bg-black/50` full app |
| Unified Viewer | `z-80` | Full-screen BIM/document/photo | Replaces app |

**Scrim placement rules:**
- Slide-Out scrim: `absolute inset-0` WITHIN workspace container — does NOT cover Global Header or Sidebar
- Modal scrim: `fixed inset-0` — covers entire app including Global Header

---

## Filter System

When adding filters to any table or list view:

1. Filter Panel = Slide-Out, Contextual View type, `w-[480px]`, `z-30`
2. Filter controls live INSIDE `TableActionRow` — extend it, don't replace it
3. Filter chips row renders below `TableActionRow`, above the data table
4. Apply/Cancel footer IS correct on Filter Panel (Contextual View type — not autosave)
5. AND logic across fields · OR logic within a single field · Permissions are silent pre-filters
6. Dynamic filters ("Me", "Today") resolve at render, never hardcoded at save time
7. Locked filter chips: lock icon, no X button, `bg-asphalt-100 cursor-not-allowed`
8. "Clear All" never removes locked filters
9. Minor changes (sort, column visibility) = silent · Major changes (filter, group by) = unsaved state banner

---

## Token Mandate (Guidelines Rule 0.1)

```
❌ NEVER                    ✅ ALWAYS
bg-white                 →  bg-background-primary
text-white               →  text-foreground-inverse
bg-black/50              →  bg-black/50 ← (scrim only, this is correct)
#FFFFFF, #111111         →  semantic CSS variables
asphalt-950 text-white   →  (Save button — bg-asphalt-950 text-white is permitted for primary CTA)
bg-red-100               →  bg-danger-25
text-red-600             →  text-danger-600
border-gray-200          →  border-border-default
```

**Locked Styling for Pattern Components** — these are non-negotiable, always use exactly:
- `TableActionRow` container: `px-4 py-3 border-b border-border-default bg-background-primary`
- `SplitViewHeader` container: `bg-background-primary border-b border-border-default`
- `ManualSaveFooter` background: `bg-background-primary border-t border-border-default shadow-lg`
- Field labels: `text-sm font-medium text-foreground-secondary`
- Section headers: `text-xs font-bold text-foreground-tertiary uppercase tracking-widest`

---

## Construction Domain Awareness

Forms are steps in workflows. Always ask: **where in the workflow does this form live?**

**Critical entity relationships:**
- Company selected → filter Contacts to that company → auto-populate Trade
- Location selected → suggest relevant Drawings → pre-select responsible Company
- Spec Section selected → suggest Submittal types → auto-suggest Subcontractor
- Financial impact > $10k → require attachments → trigger owner notification
- RFI due date < today + 3 → warn "Expedited" → suggest Priority = High

**Key form workflows:**
- RFI: Create → Assign Ball-in-Court → Answer → Review → Distribute → Link CO → Close
- Change Order: Change Event → PCO → RFQ → COR → OCO → CCO
- Punch Item: Create → Assign Sub → Work Complete → Verify/Inspect → Close/Reopen

**Construction button labels** (never use generic):
- "Submit" → "Submit for Review" / "Submit Answer"
- "Delete" → "Void [Entity]"
- "Approve" → "Approve Submittal" / "Approve & Distribute"
- "Complete" → "Verify Complete" / "Close [Entity]"

---

## Red Flags — Block These Immediately

If you detect any of these in existing code or are about to generate them, stop and correct:

```
⛔ bg-white or hex color (#FFFFFF, etc.) in component styling
⛔ fixed inset-0 scrim on a Slide-Out (use absolute, workspace-only)
⛔ fixed top-0 positioning for a Slide-Out panel (renders above header)
⛔ Save/Cancel buttons on a Data Entry Slide-Out (Pattern 3)
⛔ Three panes in workspace (max is 2)
⛔ Grid content in right pane (grids are left-pane only)
⛔ Custom table row component that duplicates TableRow pattern
⛔ Custom table action row that duplicates TableActionRow pattern
⛔ z-index value outside the canonical set (z-0/10/20/30/50/80)
⛔ Destructive action (delete/void) in a Popover
⛔ Flat modal confirmation for all deletes regardless of risk
⛔ Role-unaware action bar in Zone 4
⛔ Zone 2 fields ordered by schema/database order instead of decision relevance
⛔ Tertiary fields visible by default in Zone 2
⛔ Statusbadge built with raw div styling instead of StatusBadge component
⛔ Filter Panel wider or narrower than 480px
⛔ Filter controls built outside TableActionRow
⛔ Form number truncated in Zone 1
⛔ Zone 3 context panel requiring navigation (must open inline)
⛔ Unlayered :root overrides that redefine Untitled `--color-brand-*` and cycle with `--primary`
⛔ Select trigger styles targeting `[data-slot=select-value]` without that attribute on `SelectValue`
⛔ Compound `Button` triggers (label + chevron + badge) built only as raw sibling children — use `iconTrailing` / `iconLeading`
⛔ `DropdownMenuItem` rows that force `flex-col` or strip `min-w-0` without a horizontal wrapper for icon + text
⛔ `import … from "@/hooks/use-toast"` (or any `@/hooks/*`) in **`app/`** — use **`@/lib/toast`**; `@/hooks` is Design-System-only
⛔ Adding a new UI primitive without going through **`@/components/ui/*`** (or documented exception) — check **`docs/primitive-facade-defaults.md`**
```

---

## Validation: Before Submitting Any Output

Run these checks against everything you generate:

**Architecture**
- [ ] Workspace pane count ≤ 2
- [ ] Grid content in left pane only
- [ ] Split ratios exactly 33/67 or 67/33
- [ ] Z-index values from canonical set only
- [ ] Slide-Out scrim: absolute within workspace, bg-white/30
- [ ] Modal scrim: fixed inset-0, bg-black/50

**Components**
- [ ] All tables use TableActionRow + TableRow + TableCell
- [ ] All split-view detail panes use SplitViewDetail
- [ ] All manual-save footers use ManualSaveFooter
- [ ] All status indicators use StatusBadge
- [ ] No duplicated pattern components in tool folders
- [ ] `Button`: icons use `iconLeading` / `iconTrailing` where label + icon + chevron/badges; no vertical stacking in headers/toolbars
- [ ] `Select`: `SelectValue` carries `data-slot="select-value"`; trigger has `min-w-0` in flex contexts
- [ ] `DropdownMenuItem`: icon + label rows stay horizontal (`flex-nowrap` / inline-flex wrapper)
- [ ] Facade gallery or key tool page spot-checked after shell/token edits
- [ ] Primitive choice matches **`docs/primitive-facade-defaults.md`** (or PR documents a deliberate exception)
- [ ] App code: `toast` / `useToast` from **`@/lib/toast`** — not `@/hooks/use-toast`
- [ ] `pnpm run lint` clean for touched files (restricted imports in `app/`)

**Tokens**
- [ ] Zero hex codes in any className or style prop
- [ ] Zero bg-white, text-white, bg-black raw values (except permitted scrim)
- [ ] All labels use text-foreground-secondary
- [ ] All borders use border-border-* tokens

**Forms**
- [ ] Labels: sentence case, text-sm font-medium text-foreground-secondary
- [ ] Zone 2 fields: decision relevance order, not schema order
- [ ] Tertiary fields hidden by default
- [ ] Zone 1 sticky on Tier 3–5 forms
- [ ] Zone 4 actions role-aware and lifecycle-aware
- [ ] Destructive actions use correct tier (toast/modal/typed)
- [ ] Draft creation flow: immediate row + auto-select + status badge

**For detailed validation checklists and token lookups → see REFERENCE.md**

---

## Collaboration Workflow with Design and Engineering Teams

When working with the design team:
1. Always validate pattern selection against the four interaction patterns before designing
2. Confirm zone architecture before laying out any form detail page
3. Use construction-specific labels and terminology throughout
4. Every new component must trace to a base pattern or request a design system addition

When working with the engineering team:
1. Reference the Gold Standard implementation first: `/src/app/components/rfis/`
2. Specify exact token classes, not visual descriptions
3. Include z-index layer in any overlay component spec
4. Flag any requirement that would require a new pattern component — do not invent ad-hoc

When reviewing PRs or designs for compliance:
1. Run the Red Flags list against the diff
2. Run the Validation checklist against the output
3. Run `scripts/check-compliance.sh` against any changed file
4. For **facade / primitive** changes, cross-check **`docs/primitive-facade-defaults.md`** and **`pnpm run lint`** (restricted imports in `app/`)
5. Cite specific rule numbers for any violation found

---

*For quick-lookup decision trees, token tables, and component specs → read REFERENCE.md*
*For token compliance scanning → run scripts/check-compliance.sh*
