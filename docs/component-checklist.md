# Pre-Prompt Checklist for Interaction Model Compliance

> **Canonical Source**: This checklist implements rules from:
> - **[Guidelines.md](/guidelines/Guidelines.md)** - Rules 0.1-1.13
> - **[Interaction-Model-Architecture.md](/guidelines/Interaction-Model-Architecture.md)** - Z-index, pane rules
> - **[Pattern-Component-Library.md](/guidelines/Pattern-Component-Library.md)** - Import & Extend mandate

## Before Every Response - Quick Scan

### 1️⃣ WORKSPACE CHECK (Architecture)
\`\`\`
□ Am I respecting the 2-pane maximum?
□ Is my grid going in the LEFT pane only?
□ Are details allowed in the current pane?
□ Will this maintain URL state?
\`\`\`

### 2️⃣ PATTERN CHECK (Which interaction?)
\`\`\`
□ Grid → Detail: Use Split-View (33/67)
□ Complex Detail: Use Full Takeover
□ Quick View: Use Slide-Out
□ Create/Edit: Use Slide-Out (NOT modal)
□ Delete/Confirm: Use Modal (ONLY case)
\`\`\`

### 3. LAYER CHECK (Z-Index Hierarchy - See Architecture doc)
\`\`\`
□ z-10: Tooltip (read-only info, tethered)
□ z-20: Popover (seconds task, NO scrim)
□ z-30: Slide-Out (minutes task, workspace scrim bg-white/30)
□ z-50: Modal (blocking, full-app scrim bg-black/50)
□ z-80: Unified Viewer (full-screen immersive)
□ Nothing nested (no popover in modal)
\`\`\`

### 4️⃣ STYLE CHECK (Design system)
\`\`\`
□ Using @/components/ui base component?
□ Colors via CSS variables only? (--background, --foreground)
□ Icons from lucide-react only?
□ Spacing via Tailwind classes? (p-4, not p-[16px])
□ Using cn() for className merging?
\`\`\`

### 5️⃣ INTERACTION CHECK (User actions)
\`\`\`
□ Inline editing enabled? (not separate edit page)
□ Bulk actions available? (for grids)
□ Keyboard shortcuts? (Cmd+K, Cmd+[/])
□ Next/Previous navigation? (in details)
□ Dirty state tracking? (for forms)
\`\`\`

---

## 📋 Extended Checklist (For Complex Components)

### GRID IMPLEMENTATION
\`\`\`yaml
Before creating any grid:
- Location: LEFT pane only
- Features: Bulk select, inline edit, view switchers
- Clicks: Open detail in RIGHT pane (split-view)
- Dense: Information-rich, not hidden
- Responsive: Single column on mobile
\`\`\`

### FORM IMPLEMENTATION
\`\`\`yaml
Before creating any form:
- Container: Slide-out (never modal)
- Validation: Track dirty state
- Save: Only warn if actually modified
- Position: Slides from right edge
- Background: Workspace visible but disabled
\`\`\`

### NAVIGATION IMPLEMENTATION
\`\`\`yaml
Before adding navigation:
- History: States not just URLs
- Breadcrumbs: Structural hierarchy
- Siblings: Next/Previous in details
- Search: Cmd+K global command
- Mobile: Collapse to single pane
\`\`\`

### COLOR IMPLEMENTATION
\`\`\`yaml
Before adding any color:
- Method: CSS variable only
- Format: var(--background) not #000000
- Dark mode: Auto-switches via variable
- Hierarchy: foreground/muted-foreground
- State: hover/active via Tailwind
\`\`\`

---

## 🚫 RED FLAGS - Stop If You're About To:

\`\`\`
⛔ Create a third pane
⛔ Put a grid in the RIGHT pane  
⛔ Use a modal for a form
⛔ Nest containers within panes
⛔ Hide data for "simplicity"
⛔ Navigate away for simple edits
⛔ Use hex/rgb colors directly
⛔ Import non-lucide icons
⛔ Create separate edit pages
⛔ Skip URL state management
\`\`\`

---

## ✅ Quick Validation Script

\`\`\`typescript
// Run this mental check before generating code:

const componentCheck = {
  workspace: {
    panes: <= 2,  // Never more
    leftPane: isGrid || isDetail,
    rightPane: isDetail || isContext,
    gridLocation: "LEFT_ONLY"
  },
  
  layers: {
    forms: "SLIDE_OUT",
    confirmations: "MODAL",
    quickEdits: "POPOVER",
    info: "TOOLTIP"
  },
  
  styling: {
    colors: "CSS_VARIABLES_ONLY",
    components: "@/components/ui",
    icons: "lucide-react",
    spacing: "tailwind-classes"
  },
  
  required: [
    "inline-editing",
    "bulk-actions",
    "url-state",
    "keyboard-shortcuts",
    "responsive-behavior"
  ]
}
\`\`\`

---

## 📝 Copy-Paste Starter

Before writing any component, start with:

\`\`\`jsx
// ✓ Checklist verified:
// - Location: [LEFT/RIGHT] pane
// - Pattern: [Split-View/Full/Slide-Out]
// - Colors: CSS variables only
// - Base: @/components/ui facade (Untitled UI + Tailwind)
// - Icons: lucide-react
// - Responsive: [describe behavior]

import { cn } from "@/lib/utils"
import { ComponentName } from "@/components/ui/component"
import { Cone as IconName } from 'lucide-react'
\`\`\`

---

**Use this checklist BEFORE every code generation to ensure compliance with the Interaction Model Charter.**
