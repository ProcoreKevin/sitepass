---
name: legacy-theme
description: >-
  Apply the Procore Legacy Theme when designing or building any UI that must
  visually blend with the existing Procore application. Triggers on: "legacy
  theme", "match the legacy app", "build a view", "design a component",
  "implement a form", "create a table", "add a slide-out", "NGX design system",
  "Procore UI", "RFI", "Submittal", "Change Order", "Punch List", "Inspections",
  or any request to design or build UI for the Procore construction platform
  during the Legacy-to-NGX transition period. Also triggers on: primitive alignment,
  Untitled vs RAC facades, facade defaults, `data-slot` token overrides, or
  `docs/primitive-facade-defaults.md`.
license: Proprietary. See LICENSE.txt for complete terms.
compatibility: >-
  Procore NGX Design System. Requires Next.js 15+ or Vite 5+, Tailwind CSS
  v4.1, React 19, TypeScript 5.8, React Aria, Untitled UI React v4.1.
  CSS @layer order must be declared before all imports — see CSS Layer
  Enforcement section.
metadata:
  author: Nathan Hardy
  role: Principal Product Designer, Procore Technologies
  version: "2.0"
  updated: "March 2026"
  theme-file: app/legacy-theme.css
  theme-status: production
  wcag: non-compliant (stopgap — see NGX Light theme for AA)
  changelog: >-
    v2.0: CSS @layer enforcement section added for UUI and React Aria.
    Token namespace updated (--color-bg-*, --color-text-*, --color-border-*).
    Card: no border, shadow-sm. Secondary button: gray ramp #EEF0F1, no border.
    --spacing: 0.25rem multiplier guard documented.
---

# Legacy Theme Skill — Procore NGX Design System

You are a design and engineering partner for the Procore NGX Design System
during the Legacy-to-NGX transition period. Your role is to design and
implement construction management UI that is **visually indistinguishable**
from the existing Procore application on every page that uses the Legacy theme.

Every token, component, and pattern decision traces back to one of five
governing documents. When they conflict, resolve in priority order below.

---

## Document Hierarchy

| Priority | Document | Governs |
|----------|----------|---------|
| 1 | `guidelines/Guidelines.md` | Master rulebook · Rules 0.1–1.13 |
| 2 | `guidelines/Interaction-Model-Architecture.md` | Layout · Z-index · Shell dimensions |
| 3 | `guidelines/Pattern-Component-Library.md` | Base React components · Import & Extend |
| 4 | `guidelines/Form-Creation-Checklist.md` | Form rules · Zone architecture · CRUD |
| 5 | `guidelines/Filter-System-Implementation.md` | Filter logic · Saved views |

→ Read `references/REFERENCE.md` for quick-lookup tables during implementation.
→ Read `references/EXAMPLES.md` for canonical code templates before writing any component.

---

## CSS Layer Enforcement

Untitled UI and React Aria both ship default component styles that silently
override theme tokens unless the CSS cascade layer order is explicitly declared.
Without enforcement: UUI button radius defaults to 8px (not 4px), React Aria
focus rings clobber `--shadow-focus`, and the `--spacing` multiplier can be
reset. This is the most common source of visual regressions on the legacy theme.

### Step 1 — declare layer order at the very top of globals.css

This single line must appear BEFORE any `@import` statement, including Tailwind.

```css
/* globals.css — line 1, before everything */
@layer base, react-aria, untitled-ui, legacy-theme;
```

Later-declared layers always win over earlier layers, regardless of selector
specificity or source order. `legacy-theme` is last, so its token overrides
always beat UUI and React Aria defaults.

### Step 2 — import in the correct order

```css
@layer base, react-aria, untitled-ui, legacy-theme;

/* 1. Tailwind (auto-generates into @layer base) */
@import 'tailwindcss';

/* 2. React Aria component styles — explicitly assigned to its layer */
@import '@react-aria/components/dist/styles.css' layer(react-aria);

/* 3. Untitled UI base styles — explicitly assigned to its layer */
@import '@untitledui/react/styles.css' layer(untitled-ui);

/* 4. Legacy theme — declared into @layer base internally, wins over all above */
@import './legacy-theme.css';
```

If your bundler does not support `@import ... layer()` syntax, use a wrapper:

```css
@layer untitled-ui {
  @import '@untitledui/react/styles.css';
}
@layer react-aria {
  @import '@react-aria/components/dist/styles.css';
}
```

### Why each layer matters

**untitled-ui layer:** UUI defines `--border-radius-md: 8px` in its `@theme`
block (unlayered, highest cascade priority by default). The legacy theme
overrides `--border-radius-md: 4px` in `@layer base`. Assigning UUI to its
own named layer drops it below `legacy-theme`, so 4px wins.

**react-aria layer:** React Aria ships `[data-focus-visible]` rules that
override focus ring appearance. The legacy theme's `*:focus-visible { box-shadow: var(--shadow-focus) }` must win. The `react-aria` layer below `legacy-theme` ensures this. React Aria also manages `[data-disabled]` attribute states — do not add competing `:disabled` selectors.

**base layer:** Tailwind's reset and base styles live here. The `--spacing`
multiplier (`0.25rem`) is consumed by all Tailwind utilities. It must never
be overridden to a `px` value in any layer — see the spacing section below.

### React Aria component usage rules

React Aria manages interactive state via data attributes, not CSS pseudo-classes.
Always use the React Aria prop API, not manual HTML attribute overrides.

```tsx
// CORRECT — React Aria handles disabled, focus, hover state
<Button variant="secondary" isDisabled>
  Label
</Button>
<TextField isReadOnly label="Status" />

// WRONG — competes with React Aria's [data-disabled] and [data-focus-visible]
<button disabled className="opacity-50 cursor-not-allowed">
  Label
</button>
<input readOnly className="focus:ring-0" />
```

### Tailwind v4 spacing multiplier — never override

`--spacing: 0.25rem` is Tailwind v4's base multiplier. Every utility
(`p-4`, `gap-2`, `h-8`) computes as `var(--spacing) × N`.
Setting `--spacing: 8px` doubles every UUI component's spacing.

```css
/* NEVER — doubles all UUI component padding and gaps */
--spacing: 8px;

/* CORRECT — 4px per unit. p-4 = 1rem = 16px. */
--spacing: 0.25rem;
```

The legacy theme explicitly sets `--spacing: 0.25rem` in Sections 08 and 13
as a guard. Do not override it anywhere in your project CSS.

→ Load `references/CSS-LAYER-GUIDE.md` when debugging UUI or React Aria
override conflicts. It contains diagnostic steps and known conflict patterns.

---

## Pre-Flight Checklist

Run this before writing a single line. Block if any item cannot be answered.

```
□ 1. LAYER ORDER    @layer declaration present in globals.css line 1?
                    React Aria and UUI imports wrapped in their layers?

□ 2. VIEW TYPE      Home / Anchor / Detail / Settings / Unified Viewer?
                    If unclear → ask before proceeding.

□ 3. SIDEBAR PARENT Does this tool exist in the App Sidebar?
                    If no → add to sidebar first (Guidelines Rule 0.3).

□ 4. PATTERN        Pattern 1 (Split 37/63) · 2 (Full) · 3 (Slide-Out) · 4 (67/33)?
                    → See REFERENCE.md Pattern Decision Tree.

□ 5. TOKENS         Zero hex codes. Zero bg-white. All colors via
                    --color-* from app/legacy-theme.css ([data-theme="legacy"]).
                    Values authored once as --ds-* in ngx-canonical-tokens.css.
                    All token names use v1.3.3 namespace.

□ 6. COMPONENTS     Does a base pattern component exist?
                    TableActionRow · TableRow · TableCell · SplitViewDetail ·
                    ManualSaveFooter · StatusBadge → IMPORT, never duplicate.

□ 7. PANE COUNT     Workspace max = 2 panes. Slide-Outs/Popovers/Modals are
                    z-index layers, not panes.

□ 8. PRIMITIVE MAP  Before overriding a control in legacy CSS, confirm which
                    headless backs it (Untitled vs RAC) — see repo
                    `docs/primitive-facade-defaults.md`. Prefer narrow
                    `[data-theme="legacy"]` + `data-slot` / role selectors;
                    do not re-skin the wrong primitive stack.
```

---

## Token Mandate

All legacy chrome colors resolve through **`app/legacy-theme.css`** (`[data-theme="legacy"]`)
and canonical **`--ds-*`** in `Design-System/styles/ngx-canonical-tokens.css` (see `docs/token-contract.md`).
Never use raw hex, Tailwind color primitives, or `bg-white`.

**v1.3.3 token namespace — use these names:**

```css
/* NEVER                         ALWAYS */
bg-white                  →     bg-[var(--color-bg-primary)]
text-white                →     text-[var(--color-text-inverse)]
bg-blue-700               →     bg-[var(--color-badge-draft-bg)]
#FF5200 inline            →     var(--color-brand-500)
border-gray-200           →     border-[var(--color-border-default)]
text-blue-700             →     text-[var(--color-text-link)]

/* Old v1.0 names → correct v1.3.3 names (agent: correct these on sight) */
--color-background-primary     →  --color-bg-primary
--color-background-secondary   →  --color-bg-secondary
--color-background-tertiary    →  --color-bg-tertiary
--color-foreground-primary     →  --color-text-primary
--color-foreground-secondary   →  --color-text-secondary
--color-foreground-inverse     →  --color-text-inverse
--color-foreground-link        →  --color-text-link
--color-nav-background         →  --color-bg-nav
--color-background-row-active  →  --color-bg-row-active
--color-border-active-row      →  --color-border-row-active
```

**Critical confirmed values:**

| Token | Value | Use |
|-------|-------|-----|
| `--color-brand-500` | #FF5200 | Primary CTA background |
| `--color-brand-600` | #E64900 | CTA hover (Legacy — not NGX #CB4100) |
| `--color-bg-nav` | #000000 | Global nav — pure black confirmed |
| `--color-text-link` | #1D5CC9 | All hyperlinks |
| `--color-border-input-focus` | #2066DF | Input focus ring |
| `--color-bg-row-active` | #FEF9F0 | Selected table row tint |
| `--color-border-row-active` | #FF5200 | Left stripe on active row |
| `--color-bg-btn-secondary` | #EEF0F1 | `Button variant="secondary"` / secondary ramp |
| `--border-radius-md` | 4px | UUI bridge — buttons, inputs |
| `--border-radius-lg` | 8px | UUI bridge — cards, panels |

---

## Typography Rules

Font: Inter. All text uses exactly these five steps.

| Style | Size | Weight | Line Height | Letter Spacing | Color |
|-------|------|--------|-------------|----------------|-------|
| H1 | 24px | 700 | 32px | 0.15px | `--color-text-primary` |
| H2 | 20px | 600 | 28px | 0.15px | `--color-text-primary` |
| H3 | 16px | 600 | 24px | 0.15px | `--color-text-primary` |
| H4 | 14px | 600 | 20px | 0.15px | `--color-text-primary` |
| Body | 14px | 400 | 20px | 0.15px | `--color-text-primary` |
| Small | 12px | 400 | 16px | 0.25px | `--color-text-secondary` |

Legacy body is **14px** — not 16px. NGX Light uses 16px. Do not cross-apply.

---

## Spacing Contract

- **Page margin:** 8px (`p-2`)
- **Card padding:** 16px (`p-4`)
- **`--spacing`:** `0.25rem` — never override (see CSS Layer Enforcement)

```tsx
<div className="p-2 bg-[var(--color-bg-canvas)]">
  {/* Cards: no border, shadow-sm (v1.3.2+) */}
  <div className="bg-[var(--color-bg-primary)] rounded-lg p-4
                  shadow-[var(--shadow-sm)]">
```

---

## Border Radius Contract

| Surface | Value | Token | Tailwind |
|---------|-------|-------|----------|
| Buttons, inputs, dropdowns | 4px | `--border-radius-md` | `rounded` |
| Cards, panels, modals | 8px | `--border-radius-lg` | `rounded-lg` |
| Badges, pills, tags | pill | `--border-radius-full` | `rounded-full` |

---

## Component Patterns

### Buttons — use the facade, not hand-built `.btn-*` or raw `<button>` chrome

```tsx
import { Button } from "@/components/ui/button"

<Button type="button">+ Create</Button>
<Button type="button" variant="secondary">
  View
</Button>
<Button type="button" variant="outline">
  Cancel
</Button>
```

Legacy theme maps `[data-slot="button"]` + `data-variant` / `data-size` to tokens. Do not add `.btn-primary`, `.btn-secondary`, etc., in new JSX.

### Card / Panel — no border, shadow-sm (v1.3.2)

```tsx
<div className="bg-[var(--color-bg-primary)] rounded-lg p-4
                shadow-[var(--shadow-sm)]">
  {/* optional card header with internal divider */}
  <div className="pb-3 mb-3 border-b border-[var(--color-border-default)]">
    <h3 className="text-base font-semibold tracking-[0.15px]
                   text-[var(--color-text-primary)] font-['Inter']">
      Card Title
    </h3>
  </div>
</div>
```

### Active Table Row

```tsx
<TableRow isActive={selectedId === item.id} onClick={() => setSelectedId(item.id)}>
  {/* TableRow applies: bg-[var(--color-bg-row-active)]
                        border-l-[3px] border-[var(--color-border-row-active)] */}
```

### Input with Focus Ring

```tsx
<input className="border border-[var(--color-border-input-default)]
                  hover:border-[var(--color-border-input-hover)]
                  focus:border-[var(--color-border-input-focus)]
                  focus:outline-none focus:ring-2 focus:ring-[#2066DF]/25
                  rounded h-8 px-3 text-sm font-['Inter'] tracking-[0.15px]
                  bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]" />
```

### Status Badges

```tsx
import { StatusBadge } from '@/app/components/shared/patterns'
<StatusBadge status="draft" label="Draft" />
<StatusBadge status="active" label="Open" />
```

---

## Z-Index Layer System

```
z-80  Unified Viewer   Full-screen BIM/document — shell only
z-50  Modal            Destructive confirmations — fixed inset-0 scrim
z-30  Slide-Out        Create/filter workflows — absolute workspace scrim
z-20  Popover          Quick contextual — no scrim
z-10  Tooltip          Read-only hover — no scrim
z-0   Shell            Sidebar, Header, Workspace, Assist
```

Slide-Out scrim = `absolute inset-0 bg-white/30` inside workspace only.
Never `fixed inset-0` on a Slide-Out.

---

## Form Zone Architecture

```
┌──────────────────────────────────────────┐
│  Z1 — Identity Strip (sticky on Tier 3+) │
├────────────────────────┬─────────────────┤
│  Z2 — Primary Content  │  Z3 — Context   │
├────────────────────────┴─────────────────┤
│  Z4 — Action Bar (role-aware, lifecycle) │
└──────────────────────────────────────────┘
```

Z2 field order: Status → Due Date → Assigned To → Total Amount →
Description → Schedule Impact → (secondary) → (tertiary hidden by default)

---

## Construction Domain — Button Labels

| Generic | Procore-specific |
|---------|-----------------|
| Submit | Submit for Review · Submit Answer |
| Approve | Approve Submittal · Approve & Distribute |
| Delete | Void [Entity] (with confirmation) |
| Complete | Verify Complete · Close [Entity] |
| Reject | Revise & Resubmit · Reject with Comments |

---

## Red Flags — Stop and Correct Immediately

```
⛔ @layer declaration missing from globals.css line 1
⛔ UUI or React Aria imported without layer assignment
⛔ --spacing set to any px value (must be 0.25rem)
⛔ Manual :disabled styling competing with React Aria [data-disabled]
⛔ Any old v1.0 token name: --color-background-*, --color-foreground-*, --color-nav-background
⛔ bg-white or hex color in className or style prop
⛔ Cards with explicit border — shadow-sm only (v1.3.2+)
⛔ Secondary button with border — gray ramp, no border (v1.3.3+)
⛔ fixed inset-0 scrim on a Slide-Out (must be absolute, workspace-only)
⛔ Save/Cancel buttons on a Data Entry Slide-Out
⛔ Three panes in workspace
⛔ Grid/table content in right pane
⛔ Duplicate TableActionRow or TableRow outside shared/patterns
⛔ Z-index value outside z-0/10/20/30/50/80
⛔ Destructive action inside a Popover
⛔ Zone 2 fields in schema/database order
⛔ Tertiary fields visible by default in Zone 2
⛔ StatusBadge built with raw div
⛔ Border radius not matching contract (btn=4px, card=8px, badge=pill)
⛔ Body text size 16px — legacy uses 14px
```

---

## Validation Before Output

```
CSS Layer Enforcement
□ @layer declaration at line 1 of globals.css
□ React Aria styles wrapped in layer(react-aria)
□ UUI styles wrapped in layer(untitled-ui)
□ legacy-theme.css imported last
□ --spacing: 0.25rem — not overridden anywhere in project

Architecture
□ Pane count ≤ 2
□ Grid content in left pane only
□ Split ratios exactly 37/63 or 63/37
□ Z-index from canonical set only
□ Slide-Out scrim: absolute, bg-white/30, workspace-only

Tokens
□ Zero hex codes in className or style
□ All names use v1.3.3 namespace (--color-bg-*, --color-text-*, --color-border-*)
□ No old v1.0 token names

Typography
□ Inter only · 5 ramp steps only · Body = 14px (not 16px)

Spacing
□ Page margin 8px (p-2) · Card padding 16px (p-4) · --spacing 0.25rem

Components
□ Cards: no border, shadow-[var(--shadow-sm)]
□ Secondary buttons: gray ramp, no border
□ React Aria disabled via isDisabled prop — no manual :disabled
□ Tables, badges, status chips use shared pattern components
□ Legacy overrides target the correct facade (see `docs/primitive-facade-defaults.md` — UUI vs RAC)

Forms
□ Labels: sentence case, text-sm font-medium text-[var(--color-text-secondary)]
□ Z2 fields: decision-relevance order · Tertiary fields hidden
□ Z4 actions: role-aware and lifecycle-aware
```

→ Run `scripts/check-compliance.sh` (defaults: repo root + `styles/globals.css`) or pass explicit paths before submitting any output.

---

## Reference Files — Load on Demand

| File | Load when |
|------|-----------|
| `docs/primitive-facade-defaults.md` (repo root) | Untitled vs RAC per facade; safe integration rules before editing `legacy-theme` for a specific control |
| `references/REFERENCE.md` | Quick token lookup, pattern decision tree, role matrix |
| `references/EXAMPLES.md` | Need a full code template for a view or component |
| `references/CONTRAST-AUDIT.md` | Asked about accessibility or WCAG status |
| `references/CSS-LAYER-GUIDE.md` | Debugging UUI or React Aria override conflicts |
| `app/legacy-theme.css` | Verify exact token name, state, or Tailwind surface bridge (§13) |
| `guidelines/Guidelines.md` | Unclear which rule applies or rules conflict |
| `guidelines/Form-Creation-Checklist.md` | Building any form, Zone architecture, CRUD |
| `guidelines/Filter-System-Implementation.md` | Adding filters, saved views, filter chips |
| `guidelines/Pattern-Component-Library.md` | Checking if a base component exists |
| `guidelines/Interaction-Model-Architecture.md` | Z-index, pane layout, shell dimensions |
