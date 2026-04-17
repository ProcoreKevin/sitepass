---
name: ngx-layout
description: >
  NGX Design System layout and visual design skill. Use when making any
  spacing, grid, type hierarchy, zone anatomy, color economy, density, or
  composition decision in Procore NGX components. Covers Z1–Z4 zone rules,
  8px grid, token-to-Tailwind mappings, Gantt canvas layout, component
  alignment contracts, and primitive facade choice (Untitled vs RAC) for the
  NGX stack (React 18, Tailwind v4, Untitled UI, React Aria,
  react-resizable-panels, motion). Invoke as /ngx-layout.
license: Proprietary
metadata:
  project: procore-ngx-scheduling
---

# NGX Layout Skill

This skill is the synthesis of visual design expertise applied to the
Procore NGX Design System. It does not explain design principles — it
encodes their output as concrete, binding decisions for this codebase.
Every rule below is a direct prescription. Apply it without interpretation.

---

## How to Use This Skill

Before writing any layout-affecting code, work through these six steps in order.
Do not skip steps. Do not proceed to code before completing the checklist.

1. **Name the zone.** Which of Z1 / Z2 / Z3 / Z4 is being built or modified?
2. **Name the context.** Is the view `full` / `split` / `popover` / `list` / `grid`?
3. **Name the density mode.** Is the component Compact / Default / Spacious?
4. **Confirm the grid.** Every spacing value must be on the 8px grid — verify before use.
5. **Count the colors.** Maximum 2 non-neutral semantic colors per component — check now.
6. **Run the gotchas.** Scan the Gotchas section before finalizing any component.

---

## 01 — Grid

The grid unit is 8px. Every spacing value is a multiple of 8px.
4px and 2px are permitted only for tight inline padding — never for layout gaps or margins.
Arbitrary Tailwind values (`p-[13px]`, `mt-[22px]`) are never acceptable.
If a value does not land on the grid, the layout needs to be reconsidered — not patched.

| Layout decision                   | px   | Tailwind  |
|-----------------------------------|------|-----------|
| Page-level horizontal padding     | 32px | px-8      |
| Panel / card internal padding     | 24px | p-6       |
| Section gap                       | 32px | gap-8     |
| Form field gap                    | 16px | gap-4     |
| Inline element gap (icon + label) | 8px  | gap-2     |
| Tight inline gap (badge clusters) | 4px  | gap-1     |
| Section divider space above       | 32px | mt-8      |
| Section divider space below       | 16px | mb-4      |

---

## 02 — Type Hierarchy

Typography carries structural load. Size and color define hierarchy — weight alone does not.
Do not skip levels. Do not apply `font-semibold` or `font-bold` to routine labels.

**Scale (apply in strict order):**

| Role                        | Size           | Weight       |
|-----------------------------|----------------|--------------|
| Page / tool title           | text-2xl       | font-medium  |
| Section heading             | text-xl        | font-medium  |
| Sub-section / panel heading | text-lg        | font-medium  |
| Component label / card title| text-base      | font-medium  |
| Body / field value          | text-base      | font-normal  |
| Supporting / metadata       | text-sm        | font-normal  |
| Caption / timestamp / badge | text-xs        | font-medium  |

**Color by level:**

| Level            | Token                 | Use                                     |
|------------------|-----------------------|-----------------------------------------|
| Primary content  | foreground-primary    | Titles, values, actionable text         |
| Supporting       | foreground-secondary  | Labels, descriptions, field names       |
| Metadata         | foreground-tertiary   | Timestamps, WBS codes, IDs, counts      |
| Disabled / empty | foreground-disabled   | Empty states, inactive fields           |
| Danger           | foreground-danger     | Error text, overdue dates               |

**Weight reservations** — `font-semibold` and `font-bold` are reserved for:

- Status badge text
- Z1 tool name (ALL CAPS label)
- Empty state headlines

Everything else uses `font-normal` or `font-medium`.

---

## 03 — Color Economy

Color communicates state, not visual interest. Every color applied must answer:
"What does this tell the user?" If there is no answer, the color is removed.

**Budget:** Maximum 2 non-neutral semantic colors per component.
Neutrals (asphalt scale, background tokens, border tokens) do not count toward the budget.
`core-orange` is reserved for: the Gantt today-line, primary CTA buttons, active states.
No gradients. No colorful headers. No decorative fills.

**Semantic color map:**

| Situation                  | Background      | Text / Border    | Badge             |
|----------------------------|-----------------|------------------|-------------------|
| On track / complete        | success-25      | success-800      | badge-success     |
| At Risk                    | attention-25    | attention-700    | badge-warning     |
| Critical / failed / overdue| danger-25       | danger-600       | badge-critical    |
| In Review / informational  | informative-25  | informative-600  | badge-information |
| Not Started / neutral      | background-secondary | foreground-secondary | badge-secondary |
| Void / archived            | —               | foreground-disabled  | badge-primary     |
| Brand accent               | orange-25       | core-orange      | —                 |

**Gantt bar precedence (apply top-to-bottom, first match wins):**

1. Critical path AND Delayed → `bg-danger-500 border-l-4 border-danger-600`
2. Critical path only → `bg-danger-25 border-l-2 border-danger-500`
3. Delayed → `bg-attention-700`
4. At Risk → `bg-attention-700 opacity-80`
5. On Hold → `bg-asphalt-400`
6. Complete → `bg-brand-metal`
7. In Progress → `bg-brand-tractor`
8. Not Started → `bg-asphalt-300`
9. Baseline ghost → `bg-brand-stone opacity-70`

**Shadow budget:**

| Use case                    | Token      | When              |
|-----------------------------|------------|-------------------|
| Lookahead cards (default)   | shadow-xs  | Always            |
| Lookahead cards (hover)     | shadow-md  | :hover only       |
| Floating panels / slide-outs | shadow-2xl | Overlay z-contexts |
| Gantt bar while dragging    | shadow-md  | Drag active only  |
| Everything else             | shadow-none| Default           |

**Border budget:**

| Use case           | Token                | Class                    |
|--------------------|----------------------|--------------------------|
| Zone separators    | border-border-default| border-b or border-r     |
| Selected row/item  | border-border-active | border-l-2               |
| Input default      | border-input-default | border                   |
| Input focus        | border-input-focus   | ring-2 ring-ring         |
| Card default       | border-border-default| border rounded-md        |
| Danger state       | border-border-danger | border-danger-500        |

---

## 04 — Alignment

Every element aligns to a defined column, baseline, or edge.
Deviations from the fixed dimension table below are defects, not preferences.

**Fixed dimensions — never override:**

| Element                      | Rule                                          |
|------------------------------|-----------------------------------------------|
| Z1 height                    | h-14 (56px) — always                         |
| Z4 height                    | h-14 (56px) — always, matches Z1             |
| Z3 default width             | 280px — resize range min 240px / max 480px   |
| Gantt row height             | h-10 (40px) — all rows, no exceptions        |
| Table / list header row      | h-10 (40px) — matches data rows              |
| Button height (Z4 / inline)  | h-9 (36px)                                   |
| Input height                 | h-10 (40px) — matches row height             |
| Icon (inline)                | w-4 h-4 (16px)                               |
| Icon (standalone display)    | w-6 h-6 (24px)                               |
| Avatar (inline)              | w-6 h-6 (24px), stack overlap -ml-1          |
| Badge height                 | h-5 (20px) — consistent across all variants  |
| Popover / dropdown min-width | min-w-[200px]                                 |
| Modal default width          | max-w-lg (512px)                              |

**Flex defaults:**

- Row containers: `flex items-center`
- Column containers: `flex flex-col`
- Z1 group spacing: `justify-between`
- Z4 CTA group: `justify-end`

**`absolute` positioning is permitted only for:**

- Gantt today-line (decorative overlay)
- SVG dependency arrows (canvas overlay)
- Facade Tooltip / Popover triggers (RAC / Untitled)

---

## 05 — Space

Space is allocated proportionally to content importance.
More important content receives more space around it.

**Z1 — Identity Strip**

- Visual boundary: `border-b border-border-default`
- Between left / center / right groups: `gap-6`
- Between items within a group: `gap-3`
- Maximum 6 interactive elements — collapse the rest into a DropdownMenu

**Z2 — Content Canvas**

- Dense (Gantt, List): row height `h-10` is the vertical rhythm unit — no additional row spacing
- Sectioned (forms, detail): `gap-8` between sections, `gap-4` between fields
- Always `pb-20` at the bottom of all Z2 scroll containers — Z4 is fixed and overlaps

**Z3 — Context Panel**

- Tab content padding: `px-4 py-3`
- Sub-header spacing: `mt-6 mb-2`
- Comment thread gap: `gap-3`
- Never reduce padding to fit more content — the panel is resizable

**Z4 — Action Bar**

- Left group (secondary): `gap-3`
- Right group (primary): `gap-2`
- Horizontal padding: `px-6` — matches Z2 page padding

---

## 06 — Hierarchy Through Structure, Not Decoration

Hierarchy is communicated by size, weight, and position.
It is never communicated by gradients, decorative borders, illustrations, or colorful fills.

If you are considering adding a visual decoration to signal importance —
a colored header band, a gradient background, an icon cluster — stop.
Achieve the same hierarchy through scale or spacing instead.

---

## Zone-by-Zone Layout Reference

### Z1 — Identity Strip

The only element that persists across all scroll positions (Tier 3+, sticky).
No editable controls. Read-only at all times.

**Structure:**

```
[Left group]              [Center group]         [Right group]
tool-label · project      ViewModeSwitcher       date-range · filters · badges
```

- Left group: max ~40% viewport width. Project name truncates at 1 line.
- Center group: `absolute left-1/2 -translate-x-1/2` or `flex-1 flex justify-center`
- Right group: `flex items-center gap-3`. Max 4 items — collapse beyond 4 into DropdownMenu.
- Height: `h-14`. Background: `bg-background-primary`. Border: `border-b border-border-default`. z-index: `z-50`.
- Z1 never wraps to a second line under any viewport condition.

---

### Z2 — Primary Content (Gantt)

Two-pane layout. Left pane is a fixed-column data table. Right pane is a proportional timeline.
Both panes share vertical scroll via a `scrollRef` — imperative `scrollTop` sync.

**Left pane (activity list):**

- Min-width 320px. Default 380px. Resizable via `react-resizable-panels`.
- All columns have fixed minimum widths. Header text never wraps.
- Header row: `h-10 bg-background-primary border-b border-border-default text-xs font-semibold text-foreground-tertiary uppercase tracking-wider`
- Data rows: `h-10 border-b border-border-default`
- Row alternation: odd rows `bg-background-primary`, even rows `bg-background-secondary/40`

**Right pane (timeline):**

- Width: `flex-1`. Time scale header height: `h-10` — matches left pane exactly.
- Column stripes: CSS `background-image: repeating-linear-gradient` — not DOM dividers.
- Today-line: `absolute w-px h-full bg-core-orange z-10`
- Horizontal scroll: `overflow-x-auto`. Vertical scroll: synced with left pane.

---

### Z3 — Context Panel

Secondary surface. The left border communicates hierarchy — no background change needed.

- Background: `bg-background-primary`
- Left border: `border-l border-border-default`
- Tab bar: `border-b border-border-default h-10 flex items-end px-1`
- Tab items: `px-3 py-2 text-sm`. Active: `border-b-2 border-foreground-active`. Inactive: `text-foreground-tertiary`
- No background fill on tabs — the underline alone signals active state
- Content area: `flex-1 overflow-y-auto px-4 py-3 scrollbar-hide`

**18px icon strip (Split View):**

- Width: `w-[18px]` exactly. Background: `bg-background-primary`.
- Left border: `border-l border-border-default`
- Icons: `w-4 h-4 text-foreground-tertiary`, stacked `flex flex-col items-center gap-4 pt-3`
- Active icon: `text-foreground-active`
- Click → `SlideOut` (or sheet for bottom/top), width per pattern, `animate-slide-in-right`. Dismiss: outside click or Escape.

---

### Z4 — Action Bar

Fixed to viewport bottom. Renders exactly the actions available for this role and state — no more.

- Position: `fixed bottom-0 left-0 right-0 z-40`
- Height: `h-14`. Background: `bg-background-primary`. Border: `border-t border-border-default`
- Layout: `flex items-center justify-between px-6`

**Button classes:**

Primary (max 2 simultaneous):

```
h-9 px-4 text-sm font-medium rounded-md
bg-foreground-primary text-foreground-inverse
hover:bg-foreground-active-hover transition-colors duration-150
```

Secondary:

```
h-9 px-4 text-sm font-medium rounded-md bg-transparent
text-foreground-primary border border-border-default
hover:bg-background-secondary transition-colors duration-150
```

Danger / destructive:

```
h-9 px-4 text-sm font-medium rounded-md
bg-danger-600 text-foreground-inverse hover:bg-danger-800
```

Consumer role: `text-sm text-foreground-tertiary` — no buttons.

---

## Density Modes

Identify the density mode before writing layout code.
Never mix density modes inside the same scrollable container.
Use an accordion row to expand detail inside a compact list — do not alter row height.

### Compact

*Data tables, Gantt list pane, List view rows*

- Row height: `h-10`
- Cell padding: `px-3 py-0`
- Font: `text-sm font-normal`
- No card borders — use row background alternation
- Badges inline, no extra margin

### Default

*Activity detail in Z3, form fields, card content*

- Input / block height: `h-10` for inputs, flexible for content
- Padding: `px-3 py-2` or `p-4`
- Font: `text-base font-normal`
- Card borders: `border rounded-md`

### Spacious

*Lookahead cards, empty states*

- Block padding: `p-6`
- Item gap: `gap-4` or `gap-6`
- Font: `text-base` or `text-lg`
- Shadow: `shadow-xs`

---

## Component Decision Table

| Need                        | Component                               | Rule                                  |
|-----------------------------|-----------------------------------------|---------------------------------------|
| Inline date edit            | react-day-picker in Popover facade      | Never a plain text input              |
| Status select               | Select facade (`@/components/ui/select`) | Show badge preview in trigger      |
| Activity search / link      | cmdk Command in Dialog facade           | Not input + dropdown                  |
| Destructive confirmation    | Alert-dialog facade                     | Never generic Dialog for destructive flows |
| Side panels / slide-outs    | Sheet / slide-out facades               | animate-slide-in-right                |
| Assist panel (app shell)    | `AssistPanel` `dock="global-header"`    | Fixed `top-14`, slide `translateX`; ease-out open / ease-in close; workspace `margin-right` = `ASSIST_PANEL_WIDTH_PX` |
| Icon-only button tooltip    | Tooltip facade                          | Required — accessibility              |
| Overflow actions (>2 in Z4) | DropdownMenu facade + RiMoreLine        | Never >2 primary CTAs                 |
| Progress bars               | div with width=%                        | Never `<progress>` or recharts        |
| Dependency arrows           | SVG quadratic bezier                    | Never div-based connectors            |
| Status / risk badge         | badge-* token classes                   | Never inline custom color             |
| Empty state                 | Icon + text-sm centered, see pattern    | One icon, one headline, one line      |
| Staggered list entrance     | motion.div staggerChildren              | Not CSS transition                    |
| Panel resize handle         | react-resizable-panels ResizeHandle     | 4px wide, invisible until hover       |

---

## Empty State Pattern

One icon. One headline. One supporting line. One optional CTA. Nothing else.

```tsx
<div className="flex flex-col items-center justify-center h-full py-16 px-8">
  <RiIconName className="w-10 h-10 text-foreground-disabled mb-4" />
  <p className="text-sm font-medium text-foreground-primary text-center">
    {headline}
  </p>
  <p className="text-xs text-foreground-tertiary text-center mt-1 max-w-[240px]">
    {supportingText}
  </p>
  {cta && (
    <button className="mt-6 h-9 px-4 text-sm font-medium rounded-md
      border border-border-default text-foreground-primary
      hover:bg-background-secondary transition-colors duration-150">
      {cta}
    </button>
  )}
</div>
```

---

## Responsive Behavior

Desktop-first. Minimum supported viewport: 1280px.

| Viewport     | Behavior                                                              |
|--------------|-----------------------------------------------------------------------|
| ≥ 1440px     | Z3 visible at 280px default                                           |
| 1280–1439px  | Z3 visible, may auto-collapse to 240px                               |
| 1024–1279px  | Z3 collapses to 18px icon strip                                       |
| < 1024px     | Out of scope — mobile workstream separate                             |

Z1 at 1280px: ViewModeSwitcher becomes icon-only. Project name truncates to 24 chars.
Date range collapses to icon + short format `MMM d – d`.
Z4: no responsive change — always full width, always `h-14`.

---

## Gotchas

**Never:**

- `rounded-full` on non-circular elements — use `rounded-md` or `rounded`
- Arbitrary Tailwind values — recalculate to the 8px grid
- Raw hex colors (`#FF5200`) — use `bg-core-orange` or `text-core-orange`
- `text-gray-*` or `text-slate-*` — Tailwind defaults, not NGX tokens
- `shadow-lg` or `shadow-xl` on inline components — floating z-layers only
- `border-2` except for selected / active states
- `font-bold` on UI labels — `font-medium` for labels, `font-semibold` for badges only
- `absolute` for layout — decorative overlays and overlay triggers only
- `overflow-hidden` on Z2 — breaks sticky children and Gantt scroll sync
- `z-index` above 50, except `z-[60]` for modal overlays and `z-[100]` for toasts

**Always:**

- `pb-20` on every Z2 scrollable container — Z4 is fixed and overlaps
- `scrollbar-hide` on all Z3 internal scroll containers
- `transition-colors duration-150` on all hover color changes
- `aria-label` on every icon-only button
- Tooltip facade wrapping every icon in the Z3 icon strip
- `tabIndex={-1}` on non-focusable decorative elements
- `animate-fade-in` on any component that mounts from a user action
- `motion.div` with `layoutId` for tab indicators, active state pills, sliding highlights
- Test at 1280px, 1440px, and 1920px before finalizing

---

## Relationship to Other Project Skills

- **`ngx-design-system`**: Broader NGX patterns, compliance, and document hierarchy. Use **ngx-layout** for spacing, zones, density, typography scale, and Gantt-specific layout; use **ngx-design-system** for component choice, CRUD flows, and filter patterns.
- **Primitive alignment (this template):** Which facade wraps **Untitled** vs **React Aria** is fixed per module — see **`docs/primitive-facade-defaults.md`**. Layout contracts (flex, `min-w-0`, `data-slot`) still apply; do not swap headless libraries for layout convenience without updating the facade and docs.
- **`legacy-theme`**: This template’s legacy shell and token bridge. When this repo is not the scheduling product, still apply ngx-layout **principles** where they match existing tokens (e.g. `foreground-primary`, `border-border-default`); adapt zone heights if the shell differs.

---

## Related Files (scheduling product)

| File                                | Purpose                                                    |
|-------------------------------------|------------------------------------------------------------|
| `globals.css`                       | Keyframe animation classes, CSS variable definitions       |
| `tailwind.config.js`                | Full token → Tailwind class mapping                        |
| `procore-scheduling-llm-prompts.txt`| Zone shell specs, component contracts, Prompt 01–09        |
| `ngx-interaction-model-prd.docx`    | Full Interaction Model — §03 Zone Architecture, §05 Degradation, §09 Engineering Contracts |
