# Interaction Model Architecture Rules

This document defines the foundational architectural constraints for the NGX Design System workspace and application shell.

> **Document Role:** This is the structural constitution of the NGX Design System. It defines hard layout rules, shell dimensions, z-index hierarchy, and workspace constraints. It is one of three complementary enforcement documents:
> - **This document** — Workspace architecture, layout rules, z-index hierarchy
> - **[Guidelines.md](/guidelines/Guidelines.md)** — Interaction model charter, pattern rules, and pre-implementation checklists (Rule 0.1–1.13)
> - **[Pattern-Component-Library.md](/guidelines/Pattern-Component-Library.md)** — Base React components all tools must import and extend
>
> **All three documents must be read together.** When a rule appears in multiple documents, the rule number from Guidelines.md is the canonical reference (e.g., RULE 1 in this document = Rule 0.6 in Guidelines.md).

---

## Table of Contents

1. [Workspace Core Constraints](#workspace-core-constraints)
2. [Application Shell Components](#application-shell-components)
3. [Z-Index Layer Hierarchy](#z-index-layer-hierarchy)
4. [Layout Configurations](#layout-configurations)
5. [Implementation Guidelines](#implementation-guidelines)

---

## Workspace Core Constraints

### RULE 1: Maximum 2 Panes in Workspace

**Constraint:**
- The workspace MUST contain a maximum of **2 panes** at any time
- Panes are vertical divisions within the 1440px workspace area
- This does NOT include sidebar or assist panel (they are outside workspace boundaries)

**Rationale:**
- Prevents cognitive overload from too many simultaneous views
- Maintains focus on primary task and one supporting context
- Ensures adequate space for each pane's content

**Implementation:**
```typescript
// Workspace can be in one of these states:
type WorkspaceState = 
  | { type: 'single-pane', content: PaneContent }
  | { type: 'split-panes', left: PaneContent, right: PaneContent }

// NEVER create a third pane
// ❌ INVALID: { left, center, right }
```

**Visual Examples:**
- ✅ Valid: Single pane (100%)
- ✅ Valid: Left pane (37%) + Right pane (63%)
- ✅ Valid: Left pane (63%) + Right pane (37%)
- ❌ Invalid: Three panes of any configuration

---

### RULE 2: Workspace Width = 1440px (Fixed)

**Constraint:**
- Workspace is **always 1440px wide** in standard state
- Width remains 1440px when sidebar or assist panel open
- Position shifts (via padding/margin), but width stays constant

**Behavior:**
- **Sidebar closed, Assist closed:** Workspace at x:0, width 1440px
- **Sidebar open (240px):** Workspace shifts to x:240px, width still 1440px
- **Assist open (400px):** Workspace shifts left, width still 1440px
- **Both open:** Workspace centered between sidebar and assist, width still 1440px

**Why Fixed Width:**
- Consistent layout calculations (37% = 475px, 63% = 965px)
- Predictable component sizing
- Prevents content reflow when panels open/close
- Maintains designed information density

**Implementation:**
```css
.workspace {
  width: 1440px;
  /* Position changes, width does not */
  margin-left: var(--sidebar-width, 0px);
  margin-right: var(--assist-width, 0px);
}
```

---

### RULE 3: Content Type Placement

**Strict Placement Rules:**

| Content Type | Allowed Panes | Reasoning |
|--------------|---------------|-----------|
| **Grid Content** | LEFT pane ONLY | Grids are foundation/anchor - always leftmost for consistency |
| **Detail Content** | LEFT OR RIGHT pane | Depends on pattern (full-width detail in left, split-view detail in right) |
| **Context Content** | RIGHT pane ONLY | Supplemental info (comments, activity) always on the side |

**Examples:**

**✅ VALID Configurations:**
- Single pane: Detail (full-width in left)
- Split: Grid (left 37%) + Detail (right 63%)
- Split: Detail (left 63%) + Context (right 37%)

**❌ INVALID Configurations:**
- Grid in right pane
- Context in left pane
- Any grid not in leftmost position when multiple panes exist

**Why These Rules:**
- **Grids as anchor:** Users expect data lists on the left (similar to email clients, file explorers)
- **Detail flexibility:** Can be full-width or side-by-side depending on pattern
- **Context as supplement:** Comments/activity are always secondary, thus rightmost

**Implementation:**
```typescript
type PaneContent = 
  | { type: 'grid', data: GridData }
  | { type: 'detail', data: DetailData }
  | { type: 'context', data: ContextData }

// Validation function
function validatePaneLayout(
  left: PaneContent | null, 
  right: PaneContent | null
): boolean {
  // Grid can only be in left pane
  if (right?.type === 'grid') return false
  
  // Context can only be in right pane
  if (left?.type === 'context') return false
  
  // If both panes exist and left is grid, right must be detail
  if (left?.type === 'grid' && right && right.type !== 'detail') return false
  
  return true
}
```

---

### RULE 4: Split Ratios

**Defined Ratios:**

| Pattern | Left Pane | Right Pane | Left Width | Right Width |
|---------|-----------|------------|------------|-------------|
| **Pattern 1** (Grid → Detail) | 37% | 63% | 475px | 965px |
| **Pattern 4** (Detail → Context) | 63% | 37% | 965px | 475px |

**Ratio Precision:**
- 37% of 1440px = **475.2px** (round to 475px)
- 63% of 1440px = **964.8px** (round to 965px)
- Total: 475px + 965px = 1440px ✓

**Why These Specific Ratios:**
- **33/67:** New detail gets focus (larger pane), grid provides context
- **67/33:** Detail stays primary, context is supplemental
- **Not 50/50:** Prevents equal visual weight (one pane should be primary)

**Resizability:**
- Users CAN resize panes via draggable separator
- **Minimum pane width:** 320px (ensures usability)
- **Maximum pane width:** 1120px (ensures other pane is at least 320px)

**Implementation:**
```typescript
const WORKSPACE_WIDTH = 1440
const MIN_PANE_WIDTH = 320
const MAX_PANE_WIDTH = WORKSPACE_WIDTH - MIN_PANE_WIDTH // 1120px

interface SplitRatio {
  left: number  // pixels
  right: number // pixels
}

const PATTERN_1_RATIO: SplitRatio = { left: 475, right: 965 }
const PATTERN_4_RATIO: SplitRatio = { left: 965, right: 475 }

function validatePaneWidth(width: number): boolean {
  return width >= MIN_PANE_WIDTH && width <= MAX_PANE_WIDTH
}
```

---

## Application Shell Components

These components exist **outside the workspace boundaries** but affect workspace positioning.

### Sidebar (Left Edge)

**Dimensions:**
- **Open:** 240px wide (spacing-60)
- **Closed:** 0px (completely hidden, not icon-only 48px version)
- **Height:** 100vh (full viewport height)
- **Position:** Fixed to left edge (x: 0)

**Behavior:**
- **Opens:** Pushes workspace to the right by 240px
- **Closes:** Workspace shifts back to x: 0
- **Toggles:** Via hamburger menu icon in global header
- **State persists:** Across navigation (user preference)

**Visual Hierarchy:**
- **Background:** `bg-asphalt-900` (dark theme for contrast)
- **Default items:** `text-asphalt-300` (muted)
- **Hover items:** `bg-asphalt-800` + `text-asphalt-200`
- **Active item:** `bg-asphalt-800` + `text-white` + `border-l-4 border-core-orange`

**Content Structure:**
```
┌─────────────────────┐
│ Logo (NGX)          │ ← Top, mb-8
├─────────────────────┤
│ Navigation Items:   │
│ • Home (active)     │ ← border-l-4 orange
│ • Portfolio         │
│ • Developer Studio  │
│ • Conversations     │
│ • 360 Reporting     │
├─────────────────────┤ ← Divider
│ Company Tools ▼     │ ← Expandable
│   • Workflows       │ ← Nested (pl-9)
│   • Timesheets      │
│   • Forms           │
│ Admin ▼             │ ← Expandable
├─────────────────────┤
│ Resources           │ ← Bottom (mt-auto)
└─────────────────────┘
```

**Implementation:**
```tsx
<aside className={cn(
  "fixed left-0 top-0 h-screen",
  "bg-asphalt-900 border-r border-asphalt-800",
  isOpen ? "w-60" : "w-0",
  "transition-all duration-300 ease-in-out z-0"
</aside>
```

---

### Global Header (Top Edge)

**Dimensions:**
- **Height:** 56px (fixed)
- **Width:** 100vw (full viewport width)
- **Position:** Fixed to top (y: 0)

**Layout Sections:**

```
┌──────────────────────────────────────────────────────────────┐
│ [☰] | [Company▼ Project▼] [Tools▼] ... [🔍][🔔³][?][⊞][Assist]│
└──────────────────────────────────────────────────────────────┘
   1        2              3                  4
```

1. **Menu Toggle** (40×40px button)
   - Hamburger icon (RiMenuLine, 20px)
   - Opens/closes sidebar
   
2. **Project Context** (two-line layout)
   - Line 1: Company name (text-xs text-foreground-tertiary)
   - Line 2: Project name (text-sm font-medium text-foreground-primary)
   - Dropdown indicator (RiArrowDownSLine, 16px)
   
3. **Favorite Tools Selector**
   - Similar to project selector
   - Star icon (RiStarLine, 16px)
   
4. **Utility Actions** (right-aligned)
   - Search (RiSearchLine)
   - Notifications (RiBellLine) with badge
   - Help (RiQuestionLine)
   - Grid (RiGridLine)
   - Ask Assist (bg-helix-500 text-white button)

**Visual Styling:**
- **Background:** `bg-background-primary`
- **Border:** `border-b border-border-default`
- **Icons:** 20px in 40×40px buttons
- **Gaps:** `gap-2` (8px) between utility icons
- **Hover:** `bg-background-secondary` on icon buttons

**Implementation:**
```tsx
<header className="fixed top-0 left-0 right-0 h-14 bg-background-primary border-b border-border-default z-0">
  <div className="flex items-center justify-between h-full px-4">
    {/* Left section */}
    <div className="flex items-center gap-4">
      <MenuToggle />
      <Divider />
      <ProjectSelector />
      <FavoriteToolsSelector />
    </div>
    
    {/* Right section */}
    <div className="flex items-center gap-2">
      <IconButton icon={RiSearchLine} />
      <IconButton icon={RiBellLine} badge={3} />
      <IconButton icon={RiQuestionLine} />
      <IconButton icon={RiGridLine} />
      <Button className="bg-helix-500 text-white">Ask Assist</Button>
    </div>
  </div>
</header>
```

---

### Assist Panel (Right Edge)

**Dimensions:**
- **Open:** 400px wide
- **Closed:** 0px (completely hidden)
- **Height:** calc(100vh - 56px) (full height minus global header)
- **Position:** Fixed to right edge

**Behavior:**
- **Opens:** Slides in from the right (`translateX`) with **ease-out** timing; workspace main area gains **right margin** equal to panel width (400px) so content does not sit under the panel.
- **Closes:** Slides off-screen to the right with **ease-in** timing; margin returns to 0.
- **Toggles:** Via "Ask Assist" / assist search in global header
- **Persists:** Across navigation until user closes
- **Docking:** Default implementation is **`fixed`**, `top-14` (below global header), `z-0` (shell layer). Full-screen routes without the unified header (e.g. BIM viewer) may use an **`embedded`** dock where the panel remains a flex child under that surface’s local header.

**Visual Structure:**
```
┌─────────────────────┐
│ ✨ Assist      [×]  │ ← Header (56px)
├─────────────────────┤
│ Tabs:               │ ← Tab bar (underline style)
│ Current | History   │
├─────────────────────┤
│                     │
│ Chat Content        │ ← Scrollable area
│ (messages)          │
│                     │
├─────────────────────┤
│ [Input field]  [→] │ ← Sticky footer
└─────────────────────┘
```

**Styling:**
- **Background:** `bg-background` (same as workspace, NOT secondary)
- **Border:** `border-l border-border-default`
- **Header:** No border-bottom (clean separation via spacing)
- **Tabs:** Underline style (`border-b-2` for active)

**Chat Bubbles:**
- **User messages:** `bg-asphalt-800 text-white` (dark bubbles, right-aligned)
- **Assistant messages:** `bg-asphalt-100 border border-asphalt-200` (light bubbles, left-aligned)
- **Send button:** `bg-helix-500 text-white` (40×40px circle)

**Implementation (workspace shell):**
- Panel: `fixed right-0 top-14 z-0`, width **400px**, height **`calc(100dvh - 3.5rem)`** (matches `h-14` header).
- Visibility: `transform: translate3d(100%,0,0)` when closed, `translate3d(0,0,0)` when open; **`transition: transform 300ms`** with **`cubic-bezier(0, 0, 0.2, 1)`** on open and **`cubic-bezier(0.4, 0, 1, 1)`** on close.
- Workspace: apply **`margin-right: 400px`** on `<main>` (or the scrollable workspace column) while open; combine with split-view margin via **`calc(...)`** when both are open.
- Source of truth: `AssistPanel` with `dock="global-header"` (default) and `ASSIST_PANEL_WIDTH_PX` exported from `components/assist-panel.tsx`.

```tsx
// Illustrative — see AssistPanel in repo for full markup
<aside
  className="fixed right-0 top-14 z-0 flex w-[400px] max-w-full flex-col overflow-hidden border-l border-border-default bg-background"
  style={{
    height: "calc(100dvh - 3.5rem)",
    transform: isOpen ? "translate3d(0,0,0)" : "translate3d(100%,0,0)",
    transition: `transform 300ms ${isOpen ? "cubic-bezier(0, 0, 0.2, 1)" : "cubic-bezier(0.4, 0, 1, 1)"}`,
    pointerEvents: isOpen ? "auto" : "none",
  }}
>
  …
</aside>
```

---

## Z-Index Layer Hierarchy

**Strict Layering System:**

```
z-[80] ─────────────────────────► Unified Viewer (full-screen immersive)
                                   - Covers everything
                                   - Full viewport takeover
                                   - Minutes duration

z-50 ───────────────────────────► Modal (blocking dialogs)
                                   - WITH full-app scrim (bg-black/50)
                                   - Blocks all interaction
                                   - Seconds duration
                                   - ONLY for: destructive actions, system workflows

z-30 ───────────────────────────► Slide-Out (focused sub-tasks)
                                   - Partial workspace scrim (bg-white/30)
                                   - Overlays workspace only
                                   - Minutes duration
                                   - ONLY for: create/edit workflows

z-20 ───────────────────────────► Popover (quick actions)
                                   - Tethered to trigger
                                   - NO scrim
                                   - Seconds duration
                                   - For: filters, quick edits

z-10 ───────────────────────────► Tooltip (read-only info)
                                   - Tethered to element
                                   - NO scrim, no actions
                                   - Seconds duration

z-0 ────────────────────────────► Application Shell
                                   - Sidebar, Header, Workspace, Assist
                                   - Base interactive layer
                                   - Always present
```

**Key Rules:**

1. **Modals use full-app scrims; Slide-Outs use partial workspace scrims** — Modals: `bg-black/50` covering the entire application. Slide-Outs: `bg-white/30` covering the workspace only. Popovers and Tooltips: no scrim.
2. **Slide-Outs at z-30** (above workspace, below modals)
3. **Popovers at z-20** (tethered, below slide-outs)
4. **Unified Viewer highest** (z-80, full takeover)
5. **Shell components at z-0** (base layer)

**Why This Matters:**
- **Predictable stacking:** Developers know exact layer for each component
- **Visual consistency:** Users understand blocking vs non-blocking
- **Accessibility:** Focus management follows z-index order
- **No conflicts:** No overlapping z-index ranges between component types

**Implementation:**
```typescript
export const Z_INDEX = {
  SHELL: 0,            // Sidebar, Header, Workspace, Assist (base layer)
  TOOLTIP: 10,         // Read-only info
  POPOVER: 20,         // Quick in-context interactions
  SLIDE_OUT: 30,       // Create/edit workflows (workspace scrim)
  MODAL: 50,           // Blocking confirmations (full-app scrim)
  UNIFIED_VIEWER: 80,  // Full-screen viewer
} as const

// Usage
<div className="z-30">Slide-Out</div>
<div className="z-50">Modal</div>
```

> **Cross-reference:** These values are the canonical z-index system for the NGX Design System. They are also documented in Guidelines.md Rule 1.13.1. The values above (z-0 through z-80) supersede any older references using z-10/20/50/100/120.

---

## Layout Configurations

**All Possible Workspace Configurations:**

### Configuration 1: Minimal (Default)
```
┌─────────────────────────────────┐
│         Workspace               │
│         (1440px)                │
└─────────────────────────────────┘
Total Width: 1440px
Sections: 1 (workspace only)
```
- Sidebar: Closed (0px)
- Workspace: 1440px
- Assist: Closed (0px)

### Configuration 2: Sidebar Open
```
┌───────┬─────────────────────────┐
│Sidebar│    Workspace            │
│240px  │    (1440px)             │
└───────┴─────────────────────────┘
Total Width: 1680px
Sections: 2 (sidebar + workspace)
```
- Sidebar: Open (240px)
- Workspace: 1440px (shifted right)
- Assist: Closed (0px)

### Configuration 3: Assist Open
```
┌─────────────────────────┬───────┐
│    Workspace            │Assist │
│    (1440px)             │400px  │
└─────────────────────────┴───────┘
Total Width: 1840px
Sections: 2 (workspace + assist)
```
- Sidebar: Closed (0px)
- Workspace: 1440px (shifted left)
- Assist: Open (400px)

### Configuration 4: Both Open
```
┌───────┬─────────────────┬───────┐
│Sidebar│   Workspace     │Assist │
│240px  │   (1440px)      │400px  │
└───────┴─────────────────┴───────┘
Total Width: 2080px
Sections: 3 (sidebar + workspace + assist)
```
- Sidebar: Open (240px)
- Workspace: 1440px (centered)
- Assist: Open (400px)

### Workspace Internal Splits

**Plus any of the above can have workspace split into 2 panes:**

**Split Pattern 1 (33/67):**
```
┌───────┬────────┬──────────────┬───────┐
│Sidebar│ Grid   │   Detail     │Assist │
│240px  │ 475px  │   965px      │400px  │
└───────┴────────┴──────────────┴───────┘
```

**Split Pattern 4 (67/33):**
```
┌───────┬──────────────┬────────┬───────┐
│Sidebar│   Detail     │Context │Assist │
│240px  │   965px      │ 475px  │400px  │
└───────┴──────────────┴────────┴───────┘
```

**Maximum Complexity:**
- 4 vertical sections: Sidebar (240) + Left Pane (475/965) + Right Pane (965/475) + Assist (400)
- Total possible width: 2080px (requires wide monitor or horizontal scroll)

---

## Implementation Guidelines

### Responsive Behavior

**Desktop (≥1440px):**
- Full workspace architecture as described
- All configurations available

**Tablet (768px - 1439px):**
- Workspace scales down proportionally
- Sidebar becomes overlay (doesn't push workspace)
- Assist becomes overlay
- Split panes may collapse to single pane

**Mobile (<768px):**
- Single pane only
- Sidebar becomes full-screen overlay
- Assist becomes full-screen overlay
- No split-view patterns

### State Management

**URL Synchronization:**
All workspace state MUST be reflected in URL:

```typescript
// Example URL patterns
/projects/001SW/submittals                    // Grid view
/projects/001SW/submittals?detail=S-00125     // Split view (grid + detail)
/projects/001SW/submittals/S-00125            // Full-width detail
/projects/001SW/submittals/S-00125?context=comments  // Detail + context
```

**React State:**
```typescript
interface WorkspaceState {
  sidebarOpen: boolean
  assistOpen: boolean
  layout: 'single' | 'split'
  leftPane: PaneConfig | null
  rightPane: PaneConfig | null
  splitRatio: { left: number; right: number }
}
```

### Accessibility

**Focus Management:**
- Focus follows z-index hierarchy
- Trap focus within modals (z-50)
- Allow background focus in slide-outs (z-30)
- Announce layout changes to screen readers

**Keyboard Navigation:**
- Tab order follows visual order
- Escape closes overlays (popovers, modals, slide-outs)
- Cmd/Ctrl + [ for back navigation
- Cmd/Ctrl + ] for forward navigation
- Cmd/Ctrl + K for command palette

### Performance Considerations

**Transitions:**
```css
/* Smooth but performant */
.sidebar, .assist, .workspace {
  transition: transform 300ms ease-in-out;
  /* Use transform instead of width for better performance */
}
```

**Lazy Loading:**
- Load pane content only when visible
- Unmount hidden panes to save memory
- Preserve scroll position when switching panes

---

## Validation Checklist

Use this checklist to ensure compliance with architectural rules:

- [ ] Workspace never has more than 2 panes (≡ Guidelines Rule 0.6)
- [ ] Workspace width is always 1440px
- [ ] Grid content only appears in left pane
- [ ] Context content only appears in right pane
- [ ] Split ratios are exactly 33/67 or 67/33
- [ ] Sidebar is 240px when open, 0px when closed
- [ ] Global header is 56px tall
- [ ] Assist panel is 400px when open
- [ ] Z-index values match canonical hierarchy (z-0/10/20/30/50/80) — see Guidelines Rule 1.13.1
- [ ] Modals use full-app scrim (bg-black/50); Slide-Outs use workspace-only scrim (bg-white/30)
- [ ] Popovers and Tooltips have no scrim
- [ ] Workspace state is reflected in URL
- [ ] Both panes remain interactive when split
- [ ] Minimum pane width is 320px
- [ ] Components use design tokens (no hex codes)

---

## Questions & Clarifications

**Q: Can workspace be wider than 1440px on large monitors?**
A: No. Workspace is fixed at 1440px. On larger screens, it should be centered or left-aligned, not stretched.

**Q: What if sidebar + workspace + assist exceed viewport width?**
A: The layout can extend beyond viewport (horizontal scroll) or panels can become overlays on smaller screens.

**Q: Can panes have different ratios than 33/67 or 67/33?**
A: Users can resize panes via draggable separator, but default ratios must be 33/67 or 67/33. Minimum width is always 320px.

**Q: Why is workspace width fixed at 1440px?**
A: Consistent layout calculations, predictable content density, and prevents reflow when panels open/close.

**Q: Can slide-outs have different widths?**
A: Yes. Slide-outs can be 480px (default) or resizable between 33-63% of workspace width (475px - 965px).

**Q: What happens to split panes on mobile?**
A: Split panes collapse to single pane. Users navigate between panes via back/forward or tabs.

---

## Summary

**Core Principles:**
1. ✅ Maximum 2 panes in workspace (never 3+) — Guidelines Rule 0.6
2. ✅ Fixed 1440px workspace width
3. ✅ Strict content placement (Grid LEFT, Context RIGHT, Detail EITHER)
4. ✅ Exact split ratios (33/67 or 67/33)
5. ✅ Shell components outside workspace (Sidebar, Header, Assist)
6. ✅ Canonical z-index hierarchy (z-0 / z-10 / z-20 / z-30 / z-50 / z-80) — Guidelines Rule 1.13.1
7. ✅ URL-driven state for shareability
8. ✅ Both panes remain interactive when split

**Red Flags:**
- ❌ Three panes in workspace
- ❌ Grid in right pane
- ❌ Context in left pane
- ❌ Workspace width other than 1440px
- ❌ Z-index values outside defined hierarchy (e.g., old values z-10/20/50/100/120 for overlays)
- ❌ Modal without full-app scrim
- ❌ Slide-out with full-app scrim (workspace-only scrim is correct)
- ❌ Popover or Tooltip with any scrim

This architecture ensures a predictable, scalable, and user-friendly workspace system.
