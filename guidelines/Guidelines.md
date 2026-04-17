# System Guidelines

This document outlines the Interaction Model Charter rules and design system execution guidelines for the NGX Design System application.

> **Document Role:** This is the master rulebook governing all NGX Design System development. It is one of three complementary enforcement documents:
> - **[Interaction-Model-Architecture.md](/guidelines/Interaction-Model-Architecture.md)** — Foundational workspace constraints, layout rules, shell dimensions, and the canonical z-index hierarchy
> - **[Pattern-Component-Library.md](/guidelines/Pattern-Component-Library.md)** — Base React components all tools must import and extend (see Rule 0.4)
> - **This document** — Pre-implementation checklists, interaction model patterns, and all numbered rules (Rule 0.1–1.13)
>
> **All three documents must be read together before any implementation work begins.**

**📋 Quick Links:**
- **[AI-Assisted Development Index](/AI_ASSISTED_DEVELOPMENT_INDEX.md)** - Complete guide for AI-assisted code generation (START HERE for AI prompting)
- **[Form Creation Checklist](/guidelines/Form-Creation-Checklist.md)** - Comprehensive form generation rules for Quick Create and Guided Create patterns
- **[Filter System Implementation Guide](/guidelines/Filter-System-Implementation.md)** - Filter logic, UI patterns, saved views, and TableActionRow integration
- **[Pattern Component Library](/guidelines/Pattern-Component-Library.md)** - MANDATORY pattern-enforcing components for consistent UI (Rule 1.12)
- **[Popover and Slide-Out Pattern Library](#popover-and-slide-out-pattern-library-rule-113---critical)** - MANDATORY layering system and interaction patterns for popovers and slide-outs (Rule 1.13 - CRITICAL)
- **[Document Index Table - GOLD STANDARD](/DOCUMENT_INDEX_TABLE_GOLD_STANDARD.md)** - ⭐ COMPLETE reference implementation for ALL data tables (Rule 0.9 - CRITICAL)
- **[Table Creation Protocol](#table-creation-protocol-rule-05---critical)** - MANDATORY 5-phase protocol for building tables (Rule 0.5)
- **[Dashboard Grid Layout Rules](#dashboard-grid-layout-rules-rule-07---critical)** - MANDATORY smart reordering logic for dashboard card grids (Rule 0.7)
- **[App Sidebar Drag & Drop Logic](#app-sidebar-drag--drop-logic-rule-08---critical)** - MANDATORY react-dnd implementation for sidebar reordering (Rule 0.8)

---

# CRITICAL: Pre-Implementation Checklist

**BEFORE starting ANY implementation, you MUST:**

1. **Check Design System Theme** (`/src/styles/theme.css`)
   - Review semantic color tokens (foreground, background, border)
   - Review input border tokens (border-input-default, hover, focus)
   - Review spacing and typography tokens
   - NEVER use hex codes or RGB values directly - always use CSS variables

2. **Default to Page Templates** (`/src/app/components/shared/templates/`)
   - Use `HomeViewTemplate` for dashboard-style pages
   - Use `AnchorViewTemplate` for grid/list views
   - Use `DetailViewTemplate` for detail pages
   - Templates ensure consistency with design system and interaction model
   - Only deviate from templates when explicitly required

3. **Review Interaction Model Patterns**
   - Split-View Drill-Down (Pattern 1)
   - Full-Workspace Drill-Down (Pattern 2)
   - Slide-Out Detail View (Pattern 3)
   - Context Shift (Pattern 4)

4. **NEVER Build Ad-Hoc Components** (Rule 0.1 - CRITICAL)
   - ⛔ DO NOT create custom component patterns, views, or UI elements outside the design system
   - ⛔ DO NOT bypass semantic tokens by using raw color values (e.g., `asphalt-950`, `white`)
   - ⛔ DO NOT style components without checking if dedicated semantic tokens exist
   - ✅ ALWAYS check Design System Token Reference for component-specific tokens (Badge, Button, Card, etc.)
   - ✅ If an element is needed but not in the system: **PAUSE BUILD**
   - ✅ Notify designer with proposed solution that maintains UX consistency
   - ✅ Wait for design system approval before implementation

**Why This Matters:**
- Ad-hoc components break dark mode theming
- Bypassing semantic tokens creates maintenance debt
- Custom patterns fragment the user experience
- Design system exists to prevent these exact problems

**Example Violations:**
```tsx
❌ WRONG: <Badge className="bg-asphalt-950 text-white">
❌ WRONG: <div className="bg-[#111111] text-[#FFFFFF]">
❌ WRONG: Creating custom button variant without design system approval

✅ CORRECT: <Badge className="bg-badge-primary-bg text-badge-primary-text">
✅ CORRECT: Check token reference → Use semantic tokens → Maintain consistency
```

5. **CRITICAL: NO HARDCODED VALUES** (Rule 0.1.1 - CRITICAL)
   - ⛔ NEVER hardcode colors on Button components (e.g., `bg-asphalt-900`, `bg-foreground-primary`, `bg-copilot-600`)
   - ⛔ NEVER override Button's default variant styling - let the theme handle it
   - ⛔ NEVER use inline color values that bypass CSS custom properties
   - ✅ ALWAYS use Button's built-in variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
   - ✅ ALWAYS rely on the theme's `--primary`, `--primary-foreground` tokens for primary buttons
   - ✅ ALWAYS use semantic sizes from the Button component: `default` (maps to Untitled `md`), `sm`, `lg`, `xl`, `icon`

**Primary `<Button>` (legacy theme, `variant="default"`):**
- Background: `var(--primary)` → #FF5200 (orange)
- Hover: `var(--color-brand-600)` → #E64900
- Active: `var(--color-brand-700)` → #CC3F00
- Text: `var(--primary-foreground)` → white
- Border radius: 4px (`rounded-sm` / `--border-radius-md`)
- Vertical size: Untitled size scale (`py` / typography), not fixed `--height-button` on `[data-slot="button"]`

**Example Violations:**
```tsx
❌ WRONG: <Button className="bg-asphalt-900 hover:bg-asphalt-800 text-white">
❌ WRONG: <Button className="bg-foreground-primary text-background-primary">
❌ WRONG: <Button className="bg-copilot-600 text-white hover:bg-copilot-700">

✅ CORRECT: <Button>Primary Action</Button>
✅ CORRECT: <Button size="sm">Small Primary</Button>
✅ CORRECT: <Button variant="outline">Secondary Action</Button>
```

5. **Check Parent Page Context Before Building** (Rule 0.2 - CRITICAL)
   - ⛔ DO NOT build new tabs/sections/components in isolation
   - ⛔ DO NOT assume "standard" spacing or styling without checking parent
   - ⛔ DO NOT add borders or shadows without matching existing cards
   - ✅ ALWAYS read parent page/component file first
   - ✅ ALWAYS match existing spacing patterns (`gap-2` vs `gap-4`)
   - ✅ ALWAYS match existing card styling (borders, shadows, radius)
   - ✅ ALWAYS inherit visual consistency from parent context

**Why This Matters:**
- Tabs on same page should feel cohesive
- Visual inconsistency breaks user experience
- Parent page sets the "design language" for all children
- Matching patterns creates seamless navigation

**Example Violations:**
```tsx
// Parent page uses gap-2, space-y-2
<div className="p-2 space-y-2">
  <div className="grid gap-2">...</div>
</div>

// ❌ WRONG: New tab uses gap-4, space-y-4 (inconsistent)
<div className="space-y-4">
  <div className="grid gap-4">...</div>
</div>

// ✅ CORRECT: New tab matches parent's gap-2, space-y-2
<div className="space-y-2">
  <div className="grid gap-2">...</div>
</div>

// Parent cards: NO border, only shadow-sm
<div className="bg-white rounded-sm shadow-sm">

// ❌ WRONG: New cards add border (inconsistent)
<Card className="border border-border-default shadow-sm">

// ✅ CORRECT: New cards match parent (no border)
<Card className="shadow-sm rounded-sm">
```

**Context Inheritance Checklist:**
- [ ] Read parent page/component file before starting
- [ ] Identify spacing patterns (gap, space-y, padding)
- [ ] Identify card styling (border, shadow, radius)
- [ ] Match ALL styling decisions from parent
- [ ] Only deviate if explicitly designing a new page

---

# Application Integrity and Design Consistency (Rule 0.3 - CRITICAL)

## Navigation and Tool Architecture

**CRITICAL PRINCIPLE**: Every view, page, or feature in the application MUST be connected to the App Sidebar navigation. No orphaned pages or features are allowed.

### The Single Source of Truth: App Sidebar

The App Sidebar (`/src/app/components/shell/app-sidebar-new.tsx`) is the **ONLY** definitive list of all tools and features available in the application. All development work must respect this navigation hierarchy.

### Complete Tool Inventory

#### Top-Level Navigation
- **Template Home** - Application template reference and getting started
- **Portfolio** - Portfolio dashboard and project overview
- **Conversations** - Communication hub

#### Project Management (Accordion)
- Action Plans
- Coordination Issues
- Daily Log
- Incidents
- Observations
- Inspections
- **RFIs**
- Punch List
- Submittals
- Meetings
- Photos
- Transmittals

#### Financials (Accordion)
- Prime Contracts
- Budget
- Direct Costs
- Commitments
- Change Orders
- Invoices
- Pricing Management

#### BID Management (Accordion)
- Bids
- Estimating
- Tendering
- Bid Board
- Pre-Qualification

#### Company Tools (Accordion)
- Directory
- Workflows
- Timesheets
- Documents
- Equipment
- Crews

#### Files and Specs (Accordion)
- Documents
- Forms
- Drawings
- Photos
- Specifications
- Models

#### Admin (Accordion)
- App Settings
- User Management
- Permissions
- Templates
- Configuration Manager
- Integrations

### Critical Navigation Rules

**Rule 0.3.1: Parent-Child Relationship**
- **Parent**: Tool in App Sidebar (navigation entry point)
- **Child**: Views built for that tool (Home View, Anchor View, Detail View)
- **Law**: NO view can exist without a parent tool in sidebar
- **Reason**: Ensures every page is accessible and maintains template integrity

**Rule 0.3.2: Favorite Tools Integration**
- Favorite Tools menu can ONLY contain tools that exist in the main sidebar
- No orphaned favorites allowed
- Favorites are shortcuts to existing tools, not independent features

**Rule 0.3.3: View Creation Decision Tree**

```
Designer prompts to build a view (Home/Anchor/Detail)
         ↓
Does the tool exist in App Sidebar?
         ↓
    ┌────┴────┐
   YES       NO/UNCLEAR
    ↓          ↓
✅ PROCEED    ⛔ BLOCK
             ↓
       Ask for clarification:
       "Which tool is this for?"
       Show tool list (if needed)
             ↓
       Designer clarifies:
             ↓
    ┌──────────┴──────────┐
"It's for           "It's a completely
existing tool X"     new tool"
    ↓                      ↓
✅ PROCEED            1. Add tool to sidebar
Link to tool X        2. THEN proceed with view
                      Link to new tool
```

**Rule 0.3.4: When Designer Intent is Unclear**

⛔ **BLOCK and ASK**:
1. "I see you want to build [X view]. Which tool from the sidebar is this related to?"
2. If unclear, show the complete tool inventory above
3. Wait for designer to specify the parent tool
4. Do NOT proceed until parent tool is confirmed

**Rule 0.3.5: Creating New Tools**

If designer confirms this is a NEW tool (not in sidebar):
1. ✅ Determine the appropriate accordion category (Project Management, Financials, etc.)
2. ✅ Add the tool to the sidebar's accordion menu
3. ✅ Update routing logic in App.tsx
4. ✅ THEN proceed to build the requested view
5. ✅ Link the view to the new sidebar tool

### Example Scenarios

**✅ CORRECT Flow - Existing Tool**
```
Designer: "Build an RFI detail view"
AI Check: RFI exists in Project Management accordion
Action: Proceed to build RFI Detail View
Result: View linked to RFIs tool in sidebar
```

**✅ CORRECT Flow - New Tool**
```
Designer: "Build a Permits tool with anchor view"
AI Check: Permits does NOT exist in sidebar
AI Response: "Permits is not currently in the sidebar. Should I add it as a new tool?"
Designer: "Yes, add to Project Management"
Action: 
  1. Add "Permits" to Project Management accordion in app-sidebar-new.tsx
  2. Add routing logic in App.tsx
  3. Build Permits Anchor View
  4. Link view to new Permits tool
Result: Accessible via Sidebar → Project Management → Permits
```

**⛔ BLOCKED Flow - Unclear**
```
Designer: "Build a review workflow page"
AI Check: Unclear which tool this relates to
AI Response: "Which tool is this for? Here are the available tools:
  - Workflows (Company Tools)
  - Action Plans (Project Management)
  - Or is this a new tool?"
Designer clarifies: "It's part of Submittals"
Action: Proceed to build as part of Submittals tool
Result: View linked to Submittals tool in sidebar
```

### Why This Matters

- ✅ **Discoverability**: Users can find all features through navigation
- ✅ **Consistency**: All tools follow same access patterns
- ✅ **Maintainability**: Clear parent-child relationships
- ✅ **Template Integrity**: No rogue pages outside architecture
- ✅ **Navigation History**: Browser back/forward works correctly
- ✅ **Shareability**: URLs map to navigation structure

### Red Flags - Never Do These

- ⛔ Building a page without confirming parent tool
- ⛔ Creating "standalone" pages that bypass sidebar
- ⛔ Adding favorites for tools that don't exist in sidebar
- ⛔ Assuming which tool a feature belongs to
- ⛔ Proceeding when unclear - ALWAYS ask for clarification

---

# Pattern Component Reusability (Rule 0.4 - CRITICAL)

## Import and Extend, Don't Duplicate

**CRITICAL PRINCIPLE**: Tools must IMPORT shared pattern components and EXTEND them with tool-specific features. Creating tool-specific duplicates of pattern components is forbidden.

### The Pattern Component Library

Pattern components (`/src/app/components/shared/patterns/`) are BASE implementations that ALL tools must use:

**Available Pattern Components:**
- `TableActionRow` - Base tabs + controls row above tables
- `TableRow` / `TableCell` - Enforces active state (`bg-asphalt-100`)
- `SplitViewDetail` - Complete split-view detail pane anatomy (header + content + footer)
- `ManualSaveFooter` / `FixedActionFooter` - Save workflow footers

### Critical Rules (Rule 0.4.1)

**✅ CORRECT - Import and Extend:**
```tsx
// Tool file: /src/app/components/my-tool/my-tool-page.tsx
import { TableActionRow } from '@/app/components/shared/patterns'

function MyToolPage() {
  return (
    <TableActionRow tabs={tabs} activeTab={tab} onTabChange={setTab}>
      {/* Add tool-specific controls as children */}
      <MyToolSearch />
      <MyToolFilter />
    </TableActionRow>
  )
}
```

**⛔ WRONG - Creating Tool-Specific Duplicates:**
```tsx
// ❌ DON'T create /my-tool/table-action-row.tsx
// ❌ DON'T duplicate pattern component in tool folder
// ❌ DON'T create custom implementations that bypass shared patterns
```

### Why This Matters (Rule 0.4.2)

- **Pattern Drift Prevention**: Shared components ensure visual consistency
- **Single Source of Truth**: Updates to patterns apply to all tools automatically
- **Reduced Code Duplication**: ~300+ lines saved per tool
- **Faster Development**: Import and extend is faster than building from scratch
- **Easier Maintenance**: Fix once, fixes everywhere

### Component Hierarchy (Rule 0.4.3)

```
Level 1: Templates (full page structure)
  ↓ /src/app/components/shared/templates
  ↓ HomeViewTemplate, AnchorViewTemplate, DetailViewTemplate
  ↓
Level 2: Page Headers (page-level components)
  ↓ /src/app/components/shared/page-header.tsx
  ↓ DashboardPageHeader, AnchorViewHeader, DetailViewHeader
  ↓
Level 3: Pattern Components (element-level components)
  ↓ /src/app/components/shared/patterns
  ↓ TableActionRow, TableRow, SplitViewHeader, ManualSaveFooter
  ↓
Level 4: Tool Customization (extend patterns via props/children)
  ↓ Tool adds custom controls, logic, integrations
  ↓ NEVER replaces base pattern component
```

### Extension Patterns (Rule 0.4.4)

**Pattern 1: Children Slot (Recommended)**
```tsx
import { TableActionRow } from '@/app/components/shared/patterns'

<TableActionRow tabs={tabs} activeTab={tab} onTabChange={setTab}>
  <ConfigureViewsButton />
  <SearchInput />
  <FilterButton />
</TableActionRow>
```

**Pattern 2: Wrapper Component (For Complex Logic)**
```tsx
import { TableActionRow as BaseTableActionRow } from '@/app/components/shared/patterns'

export function RFITableActionRow({ activeTab, onTabChange, isSplitViewOpen }) {
  const [search, setSearch] = useState('')
  const [views, setViews] = useState([])
  
  return (
    <BaseTableActionRow 
      tabs={TABS} 
      activeTab={activeTab} 
      onTabChange={onTabChange}
      isSplitViewOpen={isSplitViewOpen}
    >
      {/* Tool-specific controls with local state */}
      <ConfigureViews onSave={handleSaveView} />
      <SearchInput value={search} onChange={setSearch} />
    </BaseTableActionRow>
  )
}
```

### Gold Standard Reference (Rule 0.4.5)

**RFI Implementation** is the reference for how to extend patterns correctly:
- File: `/src/app/components/rfis/table-action-row.tsx`
- Imports base: `TableActionRow as BaseTableActionRow`
- Extends with RFI-specific controls (Configure Views, Search, Filter)
- No duplication of base styling or layout logic

### Red Flags - Never Do These

- ⛔ Creating `/my-tool/table-action-row.tsx` that duplicates shared pattern
- ⛔ Copy-pasting pattern component code into tool folder
- ⛔ Building custom table rows without using `TableRow` pattern
- ⛔ Creating custom save footers without using `ManualSaveFooter`
- ⛔ Bypassing pattern components because "my tool is special"
- ⛔ Not checking `/shared/patterns` before building new component

---

# Table Creation Protocol (Rule 0.5 - CRITICAL)

## CRITICAL PRINCIPLE

All tables MUST follow the Gold Standard Reference Implementation (RFI Table). NO table can be built without completing this 5-phase protocol.

---

## Phase 1: Pre-Build Discovery (MANDATORY - DO NOT SKIP)

**Before writing ANY table code:**

### Read Gold Standard Implementation

✅ Open `/src/app/components/rfis/rfi-table.tsx`  
✅ Study COMPLETE structure (container → header → body → rows)  
✅ Identify ALL architectural components used

### Verify Pattern Components

✅ Read `/src/app/components/shared/patterns/table-row.tsx`  
✅ **CRITICAL CHECK**: What HTML element does TableRow render? (Answer: `<div>`)  
✅ **CRITICAL CHECK**: What HTML element does TableCell render? (Answer: `<div>`)  
✅ **CRITICAL CHECK**: Is there a TableHeader pattern component? (Answer: NO - header is manual DIV structure)

### Document Column Requirements

✅ List all columns needed for your table  
✅ Define fixed widths for each column (w-32, w-48, w-96, etc.)  
✅ Map columns to RFI table equivalents (similar data types)

### 🚨 CHECKPOINT 1: Can you answer these questions?

- [ ] What HTML element does TableRow render?
- [ ] Does a TableHeader pattern component exist?
- [ ] What is the RFI table's container structure?
- [ ] How does RFI table handle horizontal scrolling?

**If you cannot answer all questions → STOP and re-read reference implementation**

---

## Phase 2: Architectural Cloning (COPY, DON'T INVENT)

**Clone the exact structure from RFI table:**

### Container Structure

✅ **CORRECT PATTERN** (from RFI):
```tsx
<div className="overflow-x-auto">
  {/* Header Row */}
  <div className="flex items-center gap-0 min-w-max bg-background-primary border-b border-border-default">
    {/* Manual DIV columns */}
  </div>
  
  {/* Body Rows */}
  <div>
    <TableRow>
      <TableCell>...</TableCell>
    </TableRow>
  </div>
</div>
```

❌ **FORBIDDEN**:
```tsx
<table>
  <thead>...</thead>
  <tbody>...</tbody>
</table>
```

### Header Row Structure

✅ **CORRECT** (Manual DIV structure):
```tsx
<div className="flex items-center gap-0 min-w-max">
  <div className="w-32 flex-shrink-0 px-3 py-2 border-r border-border-default">
    <button className="flex items-center gap-1 text-xs font-medium">
      Column Name
      <RiArrowUpDownLine className="w-3 h-3" />
    </button>
  </div>
</div>
```

❌ **FORBIDDEN**:
```tsx
<thead><tr><th>Column Name</th></tr></thead>
```

### Body Row Structure

✅ **CORRECT** (Use pattern components):
```tsx
<TableRow isActive={selected} onClick={handleClick}>
  <TableCell width="w-32">...</TableCell>
  <TableCell width="w-48">...</TableCell>
</TableRow>
```

### 🚨 CHECKPOINT 2: Structural validation

- [ ] Container uses `<div className="overflow-x-auto">`?
- [ ] Header is manual DIV structure (not `<thead>`)?
- [ ] Body uses TableRow and TableCell pattern components?
- [ ] NO semantic HTML table elements (`<table>`, `<tr>`, `<td>`) used?

---

## Phase 3: Column Width Synchronization (SINGLE SOURCE OF TRUTH)

**Define column widths ONCE, use EVERYWHERE:**

### Create Column Configuration

```tsx
// At top of file, BEFORE component
const COLUMN_WIDTHS = {
  checkbox: 'w-12',
  submittalNumber: 'w-32',
  status: 'w-28',
  title: 'w-96',
  specSection: 'w-32',
  submittedBy: 'w-36',
  reviewer: 'w-36',
  dueDate: 'w-32',
  attachments: 'w-12',
} as const
```

### Use Configuration in Header

```tsx
<div className={`${COLUMN_WIDTHS.submittalNumber} flex-shrink-0 px-3 py-2 border-r`}>
  <button>Submittal #</button>
</div>
```

### Use Configuration in Body

```tsx
<TableCell width={COLUMN_WIDTHS.submittalNumber}>
  {submittal.submittalNumber}
</TableCell>
```

### 🚨 CHECKPOINT 3: Width consistency

- [ ] Column widths defined as constants?
- [ ] Same width variable used in header AND body?
- [ ] NO hardcoded widths in multiple places?
- [ ] All columns have explicit widths (no "auto")?

---

## Phase 4: Pattern Component Compliance (IMPORT, DON'T DUPLICATE)

**Verify correct usage of shared patterns:**

### Required Imports

```tsx
import { TableRow, TableCell } from '@/app/components/shared/patterns'
```

### TableRow Usage

✅ **CORRECT**:
```tsx
<TableRow 
  isActive={selectedId === item.id}
  onClick={() => handleRowClick(item)}
>
  {/* cells */}
</TableRow>
```

❌ **FORBIDDEN**:
```tsx
<tr onClick={...}>  // Don't use semantic HTML
<div className="custom-row-class">  // Don't bypass pattern component
```

### TableCell Usage

✅ **CORRECT**:
```tsx
<TableCell width="w-32">
  {content}
</TableCell>
```

❌ **FORBIDDEN**:
```tsx
<td className="w-32">  // Don't use semantic HTML
<div className="px-3 py-3 w-32">  // Don't bypass pattern component
```

### 🚨 CHECKPOINT 4: Pattern compliance

- [ ] Importing TableRow and TableCell from shared/patterns?
- [ ] Using TableRow for body rows (not custom divs)?
- [ ] Using TableCell for body cells (not custom divs)?
- [ ] NOT creating table-specific row/cell components?

---

## Phase 5: Visual Validation (TEST BEFORE COMMITTING)

**Render the table and verify:**

### Header Row Visibility

- [ ] Header row is visible with gray background
- [ ] All column labels are readable
- [ ] Sort icons (arrows) are visible on sortable columns

### Column Alignment

- [ ] Header columns align PERFECTLY with body columns
- [ ] Vertical borders line up between header and body
- [ ] NO offset or misalignment between rows

### Active State

- [ ] Clicking a row shows bg-asphalt-100 background
- [ ] Active row is visually distinct from other rows

### Horizontal Scroll

- [ ] Table scrolls horizontally when viewport is narrow
- [ ] Header scrolls WITH body (stays aligned)
- [ ] No columns hidden or cut off

### 🚨 CHECKPOINT 5: Screenshot comparison

- [ ] Take screenshot of new table
- [ ] Compare side-by-side with RFI table screenshot
- [ ] Visual structure matches exactly?
- [ ] Header row matches RFI header styling?

---

## Mandatory Checklist Summary

**Before declaring a table "complete", ALL items must be checked:**

### PHASE 1: PRE-BUILD DISCOVERY
- [ ] Read RFI table implementation completely
- [ ] Verified TableRow/TableCell render as DIVs
- [ ] Confirmed NO TableHeader pattern component exists
- [ ] Documented all required columns with widths

### PHASE 2: ARCHITECTURAL CLONING
- [ ] Container uses `<div className="overflow-x-auto">`
- [ ] Header is manual DIV structure (not `<thead>`)
- [ ] Body uses TableRow/TableCell pattern components
- [ ] NO semantic HTML table elements used

### PHASE 3: COLUMN WIDTH SYNCHRONIZATION
- [ ] Column widths defined as constants
- [ ] Same width constants used in header AND body
- [ ] NO width mismatches between header and body
- [ ] All columns have explicit fixed widths

### PHASE 4: PATTERN COMPONENT COMPLIANCE
- [ ] Importing TableRow and TableCell from shared/patterns
- [ ] Using pattern components (not custom implementations)
- [ ] NOT duplicating pattern logic in tool-specific files

### PHASE 5: VISUAL VALIDATION
- [ ] Header row is visible
- [ ] Columns align perfectly between header and body
- [ ] Active state works (bg-asphalt-100)
- [ ] Horizontal scroll works correctly
- [ ] Screenshot comparison with RFI table confirms match

---

## Red Flags - Immediate Bug Indicators

**If you see ANY of these while building a table → STOP IMMEDIATELY:**

- 🚨 Using `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, or `<td>` elements
- 🚨 Creating custom TableRow or TableCell components in tool folder
- 🚨 Header columns have different widths than body columns
- 🚨 Hardcoding widths like `className="w-32"` in multiple places without constants
- 🚨 Header row not visible after rendering
- 🚨 Columns don't align between header and body
- 🚨 Not importing pattern components from `@/app/components/shared/patterns`

---

## Reference Implementation

**Gold Standard**: `/src/app/components/rfis/rfi-table.tsx`

**Pattern Components**:
- `/src/app/components/shared/patterns/table-row.tsx`
- `/src/app/components/shared/patterns/table-action-row.tsx`

**Additional Documentation**:
- [TABLE_SPLIT_VIEW_SPEC.md](/TABLE_SPLIT_VIEW_SPEC.md) - Complete table specification
- [RFI_REFACTOR_COMPLETE.md](/RFI_REFACTOR_COMPLETE.md) - RFI implementation details
- [BUG_FIX_SPLIT_VIEW_SLIDE_OUT.md](/BUG_FIX_SPLIT_VIEW_SLIDE_OUT.md) - Split-view and slide-out interaction rules

---

## Phase 6: Split-View and Slide-Out Interaction Rules (CRITICAL)

**CRITICAL PRINCIPLE**: Split-view and Slide-out are MUTUALLY EXCLUSIVE - NEVER both visible at the same time.

### The 2-Pane Maximum Rule (Rule 0.6)

**Maximum workspace panes:** 2 ONLY (exceptions: App Sidebar, Assist Panel)

**Allowed Combinations:**
- ✅ Table (100%) = 1 pane
- ✅ Table (37%) + Split-View Detail (63%) = 2 panes
- ✅ Table (100%) + Slide-Out (480px) = 2 panes
- ❌ Table (37%) + Split-View (63%) + Slide-Out (480px) = 3 panes **FORBIDDEN**

### Implementation Requirements

#### Required State Variables

```tsx
const [selectedRfi, setSelectedRfi] = useState<RFIData | null>(null)
const [isSlideoutOpen, setIsSlideoutOpen] = useState(false)
```

**Critical:** `selectedRfi` serves DUAL PURPOSE:
1. **Visual Selection**: Highlights row with `bg-asphalt-100` in table
2. **Split-View Trigger**: Opens detail pane ONLY when slide-out is closed

#### Conditional selectedItem Prop (MANDATORY)

**File:** Page component (e.g., `/src/app/rfis/page.tsx`)

```tsx
<SplitViewLayout
  items={filteredData}
  selectedItem={isSlideoutOpen ? null : selectedRfi}  // ← CRITICAL: Pass null when slide-out open
  onItemSelect={handleRowClick}
  onClose={handleCloseDetail}
  ...
/>
```

**Logic Breakdown:**

| `selectedRfi` | `isSlideoutOpen` | `selectedItem` Passed | Split-View Visible? | Pane Count |
|---------------|------------------|-----------------------|---------------------|------------|
| `null` | `false` | `null` | ❌ No | 1 (Table) |
| `item` | `false` | `item` | ✅ Yes | 2 (Table + Detail) |
| `draft` | `true` | **`null`** | ❌ No | 2 (Table + Slide-out) |
| `item` | `true` | **`null`** | ❌ No | 2 (Table + Slide-out) |

**Key:** When `isSlideoutOpen = true`, ALWAYS pass `null` to prevent split-view from rendering.

#### TableActionRow isSplitViewOpen Prop (MANDATORY)

**File:** Page component (e.g., `/src/app/rfis/page.tsx`)

```tsx
<TableActionRow
  activeTab={activeTab}
  onTabChange={setActiveTab}
  isSplitViewOpen={!isSlideoutOpen && !!selectedRfi}  // ← CRITICAL: Only true when actually visible
/>
```

**Logic:** Split-view is only visible when slide-out is closed AND an item is selected.

#### Row Click Handler with 2-Pane Enforcement

```tsx
const handleRowClick = (item: ItemData) => {
  // Enforce 2-pane maximum: Do NOT open split-view if slide-out is active
  if (isSlideoutOpen) {
    // Update selection visually (bg-asphalt-100) but do NOT open split-view
    setSelectedItem(item)
    return  // ← Early return prevents split-view from opening
  }
  
  // Slide-out is closed, open split-view normally
  setSelectedItem(item)
  setViewMode('split')
}
```

#### Create Button Handler with Split-View Closure

```tsx
const handleCreateClick = () => {
  // STEP 1: Close split-view FIRST (if open) - enforces 2-pane maximum
  if (selectedItem) {
    setSelectedItem(null)  // ← Closes split-view
    setViewMode('split')
  }
  
  // STEP 2: Create draft row
  const newDraft = createDraftItem()
  setItemData(prev => [newDraft, ...prev])
  
  // STEP 3: Auto-select draft (visual highlight only, split-view stays closed)
  setSelectedItem(newDraft)
  setDraftItem(newDraft)
  
  // STEP 4: Open slide-out (split-view does NOT open due to conditional prop)
  setIsSlideoutOpen(true)
}
```

### Visual Behavior Flow

#### Scenario A: Create with Split-View Open

**Initial State:**
```
┌──────────────┬─────────────────────────────┐
│ Table (37%)  │ Split-View Detail (63%)     │
│ Item-001 ◀   │ [Item-001 Details]          │
└──────────────┴─────────────────────────────┘
```

**User clicks "+ Create":**

1. `handleCreateClick()` executes
2. `setSelectedItem(null)` closes split-view
3. Draft created and auto-selected
4. `setIsSlideoutOpen(true)` opens slide-out
5. `selectedItem = isSlideoutOpen ? null : draft` → `selectedItem = null`

**Result:**
```
┌────────────────────────────┬─────────────┐
│ Table (100%)               │ Slide-Out   │
│ ┌────────────────────────┐ │ (480px)     │
│ │ DRAFT-001 ◀            │ │             │
│ │ Item-001               │ │             │
│ └────────────────────────┘ │             │
└────────────────────────────┴─────────────┘
2 PANES ✅
```

#### Scenario B: Click Rows While Slide-Out Open

**Initial State:**
```
┌────────────────────────────┬─────────────┐
│ Table (100%)               │ Slide-Out   │
│ DRAFT-001 ◀                │             │
└────────────────────────────┴─────────────┘
```

**User clicks Item-002:**

1. `handleRowClick(Item-002)` executes
2. `isSlideoutOpen = true` → Early return
3. `setSelectedItem(Item-002)` updates selection
4. Split-view does NOT open (early return prevents it)

**Result:**
```
┌────────────────────────────┬─────────────┐
│ Table (100%)               │ Slide-Out   │
│ Item-002 ◀ (highlighted)   │             │
└────────────────────────────┴─────────────┘
2 PANES ✅
```

#### Scenario C: Close Slide-Out, Then Click Row

**Initial State:**
```
┌────────────────────────────┬─────────────┐
│ Table (100%)               │ Slide-Out   │
│ DRAFT-001 ◀                │             │
└────────────────────────────┴─────────────┘
```

**User closes slide-out:**

1. `setIsSlideoutOpen(false)` closes slide-out
2. `selectedItem` still set to draft (row remains highlighted)
3. Split-view does NOT open yet (table at 100%)

**User clicks draft row again:**

1. `handleRowClick(draft)` executes
2. `isSlideoutOpen = false` → No early return
3. `setSelectedItem(draft)` and `setViewMode('split')`
4. `selectedItem = isSlideoutOpen ? null : draft` → `selectedItem = draft`
5. Split-view opens normally

**Result:**
```
┌──────────────┬─────��───────────────────────┐
│ Table (37%)  │ Split-View Detail (63%)     │
│ DRAFT-001 ◀  │ [DRAFT-001 Details]         │
└──────────────┴─────────────────────────────┘
2 PANES ✅
```

### 🚨 CHECKPOINT 6: Split-View and Slide-Out Compliance

**Before declaring table implementation complete:**

- [ ] `SplitViewLayout` receives `selectedItem={isSlideoutOpen ? null : selectedItem}`
- [ ] `TableActionRow` receives `isSplitViewOpen={!isSlideoutOpen && !!selectedItem}`
- [ ] `handleRowClick` has early return when `isSlideoutOpen = true`
- [ ] `handleCreateClick` sets `selectedItem = null` BEFORE opening slide-out
- [ ] Draft row highlights (`bg-asphalt-100`) when slide-out is open
- [ ] Split-view does NOT render when slide-out is open
- [ ] Maximum 2 panes visible at all times
- [ ] Clicking rows while slide-out open updates visual selection only
- [ ] Closing slide-out allows split-view to open on next row click

### Red Flags - Split-View and Slide-Out Violations

**If you see ANY of these → STOP IMMEDIATELY:**

- 🚨 Split-view detail pane visible while slide-out is open (3 panes!)
- 🚨 `selectedItem` prop always passes `selectedItem` (not conditional on `isSlideoutOpen`)
- 🚨 `handleRowClick` does NOT check `isSlideoutOpen` before opening split-view
- 🚨 `handleCreateClick` does NOT close split-view before opening slide-out
- 🚨 `isSplitViewOpen` prop only checks `!!selectedItem` (ignores `isSlideoutOpen`)
- 🚨 Draft row does NOT highlight when slide-out is open
- 🚨 More than 2 panes visible in workspace

### Testing Verification Checklist

✅ **Test 1: Create with Split-View Open**
- [ ] Split-view open → Click "+ Create"
- [ ] Verify split-view closes
- [ ] Verify table expands to 100%
- [ ] Verify slide-out opens
- [ ] Verify only 2 panes visible

✅ **Test 2: Row Selection While Slide-Out Open**
- [ ] Slide-out open → Click any row
- [ ] Verify row highlights (`bg-asphalt-100`)
- [ ] Verify split-view does NOT open
- [ ] Verify table remains at 100%
- [ ] Verify only 2 panes visible

✅ **Test 3: Close Slide-Out, Reopen Split-View**
- [ ] Close slide-out (draft row still selected)
- [ ] Click draft row again
- [ ] Verify split-view opens (37% / 63%)
- [ ] Verify draft detail shows in right pane
- [ ] Verify only 2 panes visible

✅ **Test 4: TableActionRow Visibility**
- [ ] Split-view open → Verify controls hidden (only tabs visible)
- [ ] Slide-out open → Verify full controls visible
- [ ] Both closed → Verify full controls visible

### Reference Implementation Files

**Gold Standard Page Component:** `/src/app/rfis/page.tsx`
- Lines 154-167: `handleRowClick` with 2-pane enforcement
- Lines 187-230: `handleCreateClick` with split-view closure
- Line 340: Conditional `selectedItem` prop
- Line 352: Conditional `isSplitViewOpen` prop

**Bug Fix Documentation:** `/BUG_FIX_SPLIT_VIEW_SLIDE_OUT.md`
- Complete analysis of bug and fix
- State transition tables
- Visual behavior flows
- Testing scenarios

---

# Dashboard Grid Layout Rules (Rule 0.7 - CRITICAL)

## CRITICAL PRINCIPLE

Dashboard card grids MUST follow smart reordering logic that automatically redistributes cards when blocks are deleted, maintaining priority order while filling gaps from top-to-bottom across rows.

---

## Purpose (Rule 0.7.1)

**Use When**: Building Home View / Dashboard pages with multi-row card layouts where cards have different width requirements across rows.

**Benefits**:
- ✅ No empty slots in grid (cards reflow intelligently)
- ✅ Maintains visual hierarchy and priority order
- ✅ Supports card-specific width requirements (e.g., 2/3 span for data-heavy cards)
- ✅ Dynamic deletion with automatic reflow
- ✅ Consistent with design system spacing (`gap-2`)

---

## Row-Specific Grid Rules (Rule 0.7.2)

### **Row 1: 50/50 Split**
- **2 cards**: `grid-cols-2` (each card 50% width)
- **1 card**: Full width (no grid class)

### **Row 2: 2/3 + 1/3 Split (Conditional)**
- **2 cards with priority card**: `grid-cols-3` with first card `col-span-2` (66.63% + 33.37%)
- **2 cards without priority card**: `grid-cols-2` (each card 50% width)
- **1 card**: Full width (no grid class)

**Priority Card Example**: "My Open Items" needs 2/3 width for data table visibility

### **Row 3+: Thirds Split**
- **3 cards**: `grid-cols-3` (each card 33.37% width)
- **2 cards**: `grid-cols-2` (each card 50% width)
- **1 card**: Full width (no grid class)

---

## Smart Reordering Algorithm (Rule 0.7.3)

### **Card Priority Order**
Define cards in priority order (top-to-bottom, left-to-right):

```tsx
const CARD_ORDER = [
  'financial-summary',    // Row 1, Position 1
  'project-health',       // Row 1, Position 2
  'my-open-items',        // Row 2, Position 1 (2/3 width)
  'project-timeline',     // Row 2, Position 2 (1/3 width)
  'inspections-chart',    // Row 3, Full width
  'safety-docs',          // Row 4, Position 1
  'crews',                // Row 4, Position 2
  'schedule',             // Row 4, Position 3
]
```

### **Visible Cards State**
Track which cards are currently visible:

```tsx
const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set([
  'financial-summary',
  'project-health',
  'my-open-items',
  'project-timeline',
  'inspections-chart',
  'safety-docs',
  'crews',
  'schedule',
]))
```

### **Distribution Function**
Distribute visible cards across rows following row-specific rules:

```tsx
const distributeCards = () => {
  const cards = CARD_ORDER.filter(cardId => visibleCards.has(cardId))
  const rows: string[][] = []
  
  let i = 0
  
  // Row 1: Try to fit 2 cards (50/50)
  if (i < cards.length) {
    const row1 = []
    row1.push(cards[i++])
    if (i < cards.length) row1.push(cards[i++])
    rows.push(row1)
  }
  
  // Row 2: Try to fit 2 cards (2/3 + 1/3 if priority card present)
  if (i < cards.length) {
    const row2 = []
    row2.push(cards[i++])
    if (i < cards.length) row2.push(cards[i++])
    rows.push(row2)
  }
  
  // Row 3+: Group remaining cards in sets of 3 (33/33/33)
  while (i < cards.length) {
    const row = []
    row.push(cards[i++])
    if (i < cards.length) row.push(cards[i++])
    if (i < cards.length) row.push(cards[i++])
    rows.push(row)
  }
  
  return rows
}
```

---

## CSS Grid col-span Rule (Rule 0.7.4 - CRITICAL)

### **CRITICAL: Direct Grid Child Requirement**

⚠️ **The `col-span-*` class MUST be on the DIRECT CHILD of the grid container, NOT on nested components.**

### **Wrong Implementation (Bug):**
```tsx
<div className="grid grid-cols-3 gap-2">  {/* ← Grid container */}
  <div key={cardId}>  {/* ← Direct grid child (NO span class) */}
    <DashboardCard className="col-span-2">  {/* ← WRONG! Nested component */}
      ...
    </DashboardCard>
  </div>
</div>
```
❌ **Result**: Card renders at 1/3 width (default single column)

### **Correct Implementation:**
```tsx
<div className="grid grid-cols-3 gap-2">  {/* ← Grid container */}
  <div key={cardId} className="col-span-2">  {/* ← CORRECT! Direct grid child */}
    <DashboardCard>  {/* ← Clean component, no span class */}
      ...
    </DashboardCard>
  </div>
</div>
```
✅ **Result**: Card renders at 2/3 width (spans 2 columns)

---

## Complete Rendering Implementation (Rule 0.7.5)

### **Render Logic with Row-Specific Rules:**

```tsx
<div className="p-2 space-y-2">
  {distributeCards().map((rowCards, rowIndex) => {
    const cardCount = rowCards.length
    
    // Row 1: 2 cards = grid-cols-2 (50/50), 1 card = full width
    if (rowIndex === 0) {
      return (
        <div 
          key={`row-${rowIndex}`}
          className={cn(cardCount === 2 ? "grid grid-cols-2 gap-2" : "")}
        >
          {rowCards.map((cardId) => (
            <div key={cardId}>
              {renderCard(cardId)}
            </div>
          ))}
        </div>
      )
    }
    
    // Row 2: 2 cards = grid-cols-3 (2/3 + 1/3 if priority card), 1 card = full width
    if (rowIndex === 1) {
      const hasPriorityCard = rowCards.includes('my-open-items')
      return (
        <div 
          key={`row-${rowIndex}`}
          className={cn(
            cardCount === 2 && hasPriorityCard 
              ? "grid grid-cols-3 gap-2" 
              : cardCount === 2 
              ? "grid grid-cols-2 gap-2" 
              : ""
          )}
        >
          {rowCards.map((cardId) => {
            // Priority card spans 2/3 when in Row 2 with 2 cards
            const spanClass = hasPriorityCard && cardCount === 2 && cardId === 'my-open-items' 
              ? "col-span-2" 
              : ""
            return (
              <div key={cardId} className={spanClass}>
                {renderCard(cardId)}
              </div>
            )
          })}
        </div>
      )
    }
    
    // Row 3+: 3 cards = grid-cols-3, 2 cards = grid-cols-2, 1 card = full width
    const gridClass = cardCount === 3 
      ? "grid grid-cols-3 gap-2" 
      : cardCount === 2 
      ? "grid grid-cols-2 gap-2" 
      : ""
    
    return (
      <div key={`row-${rowIndex}`} className={gridClass}>
        {rowCards.map((cardId) => (
          <div key={cardId}>
            {renderCard(cardId)}
          </div>
        ))}
      </div>
    )
  })}
</div>
```

---

## Delete Card Workflow (Rule 0.7.6)

### **Delete Handler:**

```tsx
const handleDeleteCard = (cardId: string) => {
  setCardToDelete(cardId)
  setIsDeleteModalOpen(true)
}

const handleConfirmDelete = () => {
  if (cardToDelete) {
    setVisibleCards(prev => {
      const newSet = new Set(prev)
      newSet.delete(cardToDelete)
      return newSet
    })
  }
  setIsDeleteModalOpen(false)
  setCardToDelete(null)
}
```

### **Automatic Reflow Behavior:**

**Before Delete:**
```
Row 1: [Financial Summary 50%] [Project Health 50%]
Row 2: [My Open Items 66%          ] [Timeline 37%]
Row 3: [Inspections Chart 100%                    ]
Row 4: [Safety Docs 37%] [Crews 37%] [Schedule 37%]
```

**User deletes "Project Health":**

**After Delete (Automatic Reflow):**
```
Row 1: [Financial Summary 50%] [My Open Items 50%]
Row 2: [Timeline 50%         ] [Inspections 50%  ]
Row 3: [Safety Docs 37%] [Crews 37%] [Schedule 37%]
```

✅ **Cards automatically redistribute to fill gaps**
✅ **Priority order maintained (Financial → My Open → Timeline → Inspections → Safety → Crews → Schedule)**
✅ **No empty slots in grid**

---

## Validation Checklist (Rule 0.7.7)

**Before declaring dashboard layout complete:**

- [ ] Card priority order defined in `CARD_ORDER` array
- [ ] `visibleCards` state tracks currently visible cards
- [ ] `distributeCards()` function distributes cards across rows
- [ ] Row 1 uses `grid-cols-2` for 2 cards (50/50 split)
- [ ] Row 2 uses `grid-cols-3` when priority card present with 2 cards
- [ ] Row 2 priority card has `col-span-2` on **wrapper div**, not nested component
- [ ] Row 3+ uses `grid-cols-3` for 3 cards (33/33/33 split)
- [ ] All rows use `gap-2` for spacing (consistent with parent page)
- [ ] Delete handler removes card from `visibleCards` Set
- [ ] Cards automatically reflow when deleted (no manual redistribution needed)
- [ ] `cn()` utility used for conditional className logic
- [ ] No hardcoded grid structures (all generated from `distributeCards()`)

---

## Red Flags - Never Do These

- ⛔ Applying `col-span-*` to nested component instead of wrapper div
- ⛔ Hardcoding row structures instead of using distribution algorithm
- ⛔ Using `gap-4` or other spacing that doesn't match parent page
- ⛔ Forgetting to check for priority card in Row 2
- ⛔ Not removing card from `visibleCards` state on delete
- ⛔ Creating empty slots in grid (cards should always reflow)
- ⛔ Using array indices instead of unique card IDs for keys
- ⛔ Mixing `grid-cols-2` and `grid-cols-3` without conditional logic
- ⛔ Not using `cn()` utility for conditional className merging
- ⛔ Building static grid layouts that don't adapt to card deletion

---

## Reference Implementation (Rule 0.7.8)

**Gold Standard**: `/src/app/portfolio/page.tsx`
- Lines 104-130: `CARD_ORDER` and `visibleCards` state
- Lines 132-168: `distributeCards()` smart reordering algorithm
- Lines 170-180: `handleDeleteCard()` and `handleConfirmDelete()`
- Lines 552-625: Complete rendering implementation with row-specific logic

**Key Features Demonstrated:**
- Smart card redistribution across rows
- Priority card (My Open Items) with 2/3 width in Row 2
- CSS Grid `col-span-2` on direct grid child (not nested component)
- Automatic reflow on card deletion
- Consistent spacing with parent page context (`gap-2`)
- Delete confirmation modal with AlertDialog component

---

# Document Index Table - Gold Standard for All Tables (Rule 0.9 - CRITICAL)

## CRITICAL PRINCIPLE

The **Document Index Table** (`/src/app/components/documents/document-index-table.tsx`) is the GOLD STANDARD reference implementation for ALL data tables in the NGX Design System. NO table can be built without following this complete specification.

---

## Why This is the Gold Standard (Rule 0.9.1)

The Document Index Table demonstrates **enterprise-grade table functionality** that ALL tables in the application must replicate:

✅ **Dual View Modes** - List view (semantic HTML table) + Grid view (CSS Grid cards)  
✅ **Advanced Filtering** - AND/OR logic with dynamic filter tokens (me, my_company)  
✅ **Column Configuration** - Toggle visibility, drag-to-reorder, locked columns  
✅ **Sorting System** - Click headers to sort with visual indicators  
✅ **Row Selection** - Multi-select with bulk actions bar  
✅ **Split-View Integration** - 37%/63% detail pane with resize handle  
✅ **State Persistence** - localStorage per saved view  
✅ **Change Tracking** - Major vs minor changes detection  
✅ **Saved Views System** - Standard, personal, shared views with unsaved indicator  
✅ **Empty States** - Contextual messaging based on filter state  
✅ **Keyboard Navigation** - Full accessibility support

**This is NOT optional.** Every table must implement these features or explicitly document why they are excluded.

---

## Mandatory Reading Before Building Tables (Rule 0.9.2)

**📋 Complete Documentation**: [/DOCUMENT_INDEX_TABLE_GOLD_STANDARD.md](/DOCUMENT_INDEX_TABLE_GOLD_STANDARD.md)

This 1,500+ line specification documents:
- Complete architecture and file structure
- Visual specifications (spacing, colors, typography)
- Component hierarchy and responsibilities
- View mode implementations (list + grid)
- Filtering system with AND/OR logic
- Column configuration with drag-to-reorder
- Sorting logic and visual indicators
- Row selection and bulk actions
- Split-view integration patterns
- State management (local + parent)
- Change tracking (major/minor/none)
- Saved views integration
- Empty states
- Accessibility requirements
- Complete implementation checklist

---

## When to Use This Standard (Rule 0.9.3)

**Use the Document Index Table pattern when building:**

- ✅ Any data table with sortable columns
- ✅ Any list/grid view of records (Submittals, RFIs, Change Orders, etc.)
- ✅ Any view that needs filtering or search
- ✅ Any view with column customization
- ✅ Any view with row selection and bulk actions
- ✅ Any view that opens a detail pane (split-view)
- ✅ Any view that integrates with saved views system

**In other words: ALL tables in the application.**

---

## Key Differences from Basic Tables (Rule 0.9.4)

| Feature | Basic Table (Old) | Document Index Table (Gold Standard) |
|---------|------------------|--------------------------------------|
| **View Modes** | List only | List + Grid (toggle) |
| **Filtering** | Simple search | Advanced filters with AND/OR logic + dynamic tokens |
| **Columns** | Fixed columns | Configurable (show/hide, reorder, locked) |
| **Sorting** | Manual or none | Click-to-sort with visual indicators |
| **Selection** | None or basic | Multi-select with bulk actions bar |
| **State** | Local only | Persisted per saved view (localStorage) |
| **Change Tracking** | None | Major/minor change detection + unsaved banner |
| **Saved Views** | None | Full integration with tab system |
| **Split-View** | Manual implementation | Standardized 37%/63% pattern |
| **Empty States** | Generic message | Contextual based on filters |

---

## Critical Integration Points (Rule 0.9.5)

### **Parent Page Responsibilities**

The parent page (e.g., `/src/app/documents/page.tsx`) MUST handle:

1. **Active Tab Tracking**: `activeTabId` state
2. **Primary Filters**: `activeFilters: ViewFilter[]` from selected tab
3. **Change Detection**: Compare saved vs current view state
4. **Change Type**: Classify as major, minor, or none
5. **Unsaved Banner**: Show when major changes detected
6. **Save Workflows**: Handle "Save Changes" vs "Save as New View"
7. **Split-View Coordination**: Hide saved views when detail pane opens

### **Table Component Responsibilities**

The table component MUST handle:

1. **View Mode**: Toggle between list and grid
2. **Search**: Text filtering across multiple fields
3. **Advanced Filters**: FilterValue[] with AND/OR logic
4. **Column Config**: Visibility, order, locked state
5. **Sorting**: Column + direction state
6. **Row Selection**: Multi-select with bulk actions
7. **Split-View**: Selected document state
8. **State Reporting**: Notify parent of changes via `onStateChange`

### **SavedViewsManager Responsibilities**

The saved views component MUST handle:

1. **Tab List**: Render standard + custom view tabs
2. **Active Tab**: Visual indicator on selected tab
3. **Unsaved Indicator**: Orange pulse dot on tabs with unsaved changes
4. **Add View Button**: Dynamic label/styling based on state
5. **Drag-to-Reorder**: Custom tabs can be reordered
6. **View Dialogs**: Create/Edit/Share view modals

---

## Filter Application Order (Rule 0.9.6 - CRITICAL)

**This order is MANDATORY and cannot be changed:**

```
1. Search Query (text matching)
   ↓
2. Primary Tab Filters (ViewFilter[] from active tab)
   ↓
3. Advanced Filters (FilterValue[] from filter panel)
   ↓
4. Sorting (by column + direction)
   ↓
5. Render Results
```

**Why this order matters:**
- Search narrows dataset first (fastest filter)
- Tab filters define the base view (locked, cannot be dismissed)
- Advanced filters refine within the tab's scope
- Sorting is cosmetic (doesn't filter data)

**Example:**
```tsx
const filteredDocuments = (() => {
  let docs = [...documents]
  
  // 1. Search
  if (searchQuery.trim()) {
    docs = docs.filter(/* search logic */)
  }
  
  // 2. Primary tab filters (AND across filters)
  activeFilters?.forEach(filter => {
    docs = docs.filter(doc => doc[filter.key] === filter.value)
  })
  
  // 3. Advanced filters (AND across fields, OR within field)
  if (filters.length > 0) {
    const grouped = groupBy(filters, 'field')
    Object.entries(grouped).forEach(([field, fieldFilters]) => {
      const values = fieldFilters.flatMap(f => f.values)
      docs = docs.filter(doc => values.includes(doc[field]))
    })
  }
  
  // 4. Sort
  if (sortColumn) {
    docs.sort(/* sort logic */)
  }
  
  return docs
})()
```

---

## Change Tracking Rules (Rule 0.9.7)

### **Major Changes** (Show Unsaved Banner)
- Adding/removing/editing filters
- Changing view mode (list ↔ grid)
- Changing display type or grouping

### **Minor Changes** (Auto-save for Personal Views)
- Changing sort column or direction
- Showing/hiding columns
- Reordering columns

### **Detection Logic**
```tsx
const hasMajorChanges = 
  JSON.stringify(savedViewState.filters) !== JSON.stringify(currentViewState.filters) ||
  savedViewState.viewMode !== currentViewState.viewMode

const hasMinorChanges =
  savedViewState.sortColumn !== currentViewState.sortColumn ||
  savedViewState.sortDirection !== currentViewState.sortDirection ||
  JSON.stringify(savedViewState.visibleColumns) !== JSON.stringify(currentViewState.visibleColumns)
```

---

## Validation Checklist for New Tables (Rule 0.9.8)

**Before declaring a table "complete", ALL items must be checked:**

### **Architecture**
- [ ] Parent page manages active tab and filters
- [ ] Table receives `activeTabId` and `activeFilters` props
- [ ] Table reports state changes via `onStateChange` callback
- [ ] Split-view coordinated via `onSplitViewChange` callback

### **View Modes**
- [ ] List view uses semantic HTML `<table>` (not divs)
- [ ] Grid view uses CSS Grid with responsive breakpoints
- [ ] Toggle button switches between modes
- [ ] View mode persists to localStorage per view

### **Filtering**
- [ ] Search input filters across multiple fields
- [ ] Primary tab filters (ViewFilter[]) applied correctly
- [ ] Advanced filters (FilterValue[]) with AND/OR logic
- [ ] Dynamic tokens (me, my_company) resolve at runtime
- [ ] Filter pills show active filters (dismissible)
- [ ] "Clear All Filters" button present

### **Column Configuration**
- [ ] Toggle visibility (switch control)
- [ ] Drag-to-reorder with grab handle
- [ ] Locked columns cannot be hidden
- [ ] Reset to default button
- [ ] Config persists to localStorage per view

### **Sorting**
- [ ] Click header to sort column
- [ ] Toggle direction on same column click
- [ ] Visual indicators (up/down arrows)
- [ ] Hover shows neutral arrow on unsorted columns

### **Row Selection**
- [ ] Header checkbox (select all/none/indeterminate)
- [ ] Row checkboxes (individual selection)
- [ ] Bulk actions bar appears when rows selected
- [ ] Actions: Export, Share, Move, Delete, Clear

### **Split-View**
- [ ] Row click opens detail pane (37%/63% split)
- [ ] Active row shows `bg-asphalt-100`
- [ ] Resize handle between panes
- [ ] Close button in detail pane
- [ ] Saved views hidden when split-view open

### **State Management**
- [ ] Column config persisted per view
- [ ] Sort state persisted per view
- [ ] View mode persisted per view
- [ ] Filter state tracked correctly

### **Change Tracking**
- [ ] Major changes show unsaved banner
- [ ] Minor changes auto-save (personal views only)
- [ ] Save button varies by view type
- [ ] Clear changes has time-based confirmation

### **Saved Views**
- [ ] Add View button with dynamic states
- [ ] Unsaved indicator on tabs
- [ ] Save dialog implementation
- [ ] Tab switching with unsaved warning

### **Empty States**
- [ ] Conditional messaging (with/without filters)
- [ ] Clear filters button (if filters active)
- [ ] Import/Create button (if no filters)

### **Accessibility**
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation support
- [ ] Focus trap in modals/popovers

---

## Red Flags - Never Do These (Rule 0.9.9)

**Table Structure:**
- ⛔ Using divs instead of semantic HTML `<table>` for list view
- ⛔ Creating custom table row/cell components (use pattern components)
- ⛔ Mixing TableRow pattern with semantic `<tr>` elements

**Filtering:**
- ⛔ Applying filters in wrong order (must follow 1→2→3→4 sequence)
- ⛔ Ignoring primary tab filters (ViewFilter[])
- ⛔ Not implementing AND/OR logic correctly
- ⛔ Hardcoding dynamic tokens instead of resolving at runtime

**State Management:**
- ⛔ Not persisting config to localStorage
- ⛔ Not tracking major vs minor changes
- ⛔ Not coordinating with parent page
- ⛔ Storing state in wrong component layer

**Integration:**
- ⛔ Building table without saved views integration
- ⛔ Not showing unsaved changes banner
- ⛔ Not implementing split-view pattern
- ⛔ Skipping change tracking logic

**Visual:**
- ⛔ Using different spacing than gold standard
- ⛔ Not showing active row indicator (`bg-asphalt-100`)
- ⛔ Creating inconsistent empty states
- ⛔ Missing bulk actions bar for selection

---

## Migration Path for Existing Tables (Rule 0.9.10)

**If you have an existing table that doesn't follow this standard:**

1. ✅ **Read the complete specification**: [/DOCUMENT_INDEX_TABLE_GOLD_STANDARD.md](/DOCUMENT_INDEX_TABLE_GOLD_STANDARD.md)
2. ✅ **Audit against the checklist**: Use Rule 0.9.8 validation checklist
3. ✅ **Identify gaps**: List missing features
4. ✅ **Plan migration**: Prioritize by user impact
5. ✅ **Implement incrementally**: Add features one phase at a time
6. ✅ **Test thoroughly**: Verify all interactions work

**Do NOT rebuild from scratch unless table is fundamentally broken.**

---

## Reference Implementation Files (Rule 0.9.11)

**Gold Standard Files:**
- **Table Component**: `/src/app/components/documents/document-index-table.tsx`
- **Parent Page**: `/src/app/documents/page.tsx`
- **Saved Views Manager**: `/src/app/components/documents/saved-views-manager.tsx`
- **Filters Panel**: `/src/app/components/documents/document-filters-popover.tsx`
- **Column Config**: `/src/app/components/documents/column-config-popover.tsx`
- **Detail View**: `/src/app/components/documents/document-detail-view.tsx`

**Complete Documentation**: `/DOCUMENT_INDEX_TABLE_GOLD_STANDARD.md`

---

## Saved Views System (Rule 0.9.12 - CRITICAL)

### **CRITICAL PRINCIPLE**

The Saved Views System provides tab-based view management with state persistence, change tracking, and unsaved change detection. This is a MANDATORY feature for all data tables that implement filtering, sorting, or column configuration.

---

### **Purpose (Rule 0.9.12.1)**

Saved Views allow users to:
- ✅ Save custom filter combinations as reusable views
- ✅ Switch between different data perspectives via tabs
- ✅ Share views with team members
- ✅ Track unsaved changes with visual indicators
- ✅ Persist view state (filters, sort, columns) across sessions

---

### **View Types (Rule 0.9.12.2)**

| Type | Creator | Editable? | Shareable? | Deletable? | Badge Color |
|------|---------|-----------|------------|------------|-------------|
| **Standard** | System | ❌ No | ❌ No | ❌ No | None (default tabs) |
| **Personal** | Current user | ✅ Yes | ✅ Yes (with permission) | ✅ Yes | None |
| **Shared (Received)** | Another user | ❌ No | ❌ No | ✅ Yes | None |
| **Shared (Owned)** | Current user (shared out) | ✅ Yes | ✅ Yes | ✅ Yes | People icon badge |

**Standard Views** are pre-defined by the system and cannot be modified or deleted.

**Personal Views** are created by the user and belong only to them unless shared.

**Shared Views** can be received from others (read-only) or owned by you (editable).

---

### **Tab Visual Specifications (Rule 0.9.12.3)**

#### **Tab Structure**
```tsx
<button className="relative flex items-center gap-2 px-4 h-10 border-b-2 transition-colors">
  {/* View name */}
  <span className="text-sm font-medium">All RFIs</span>
  
  {/* Shared badge (if owned and shared) */}
  {view.isShared && view.ownedByMe && (
    <Users className="w-3 h-3 text-foreground-tertiary" />
  )}
  
  {/* Unsaved indicator (orange pulse dot) */}
  {view.hasUnsavedChanges && (
    <span className="w-1.5 h-1.5 rounded-full bg-core-orange animate-pulse" />
  )}
  
  {/* Dropdown trigger (personal/shared-owned only) */}
  {view.type !== 'standard' && view.ownedByMe && (
    <ChevronDown className="w-3 h-3 text-foreground-tertiary" />
  )}
</button>
```

#### **Tab States**

| State | Border Color | Text Color | Background | Visual Cue |
|-------|--------------|------------|------------|------------|
| **Inactive** | `transparent` | `text-foreground-secondary` | `transparent` | None |
| **Inactive (Hover)** | `transparent` | `text-foreground-primary` | `bg-background-tertiary` | Hover background |
| **Active** | `border-foreground-primary` (2px) | `text-foreground-primary` | `transparent` | Bold bottom border |
| **Active + Unsaved** | `border-core-orange` (2px) | `text-foreground-primary` | `transparent` | Orange border + pulse dot |

#### **Unsaved Changes Indicator**

**When to Show:**
- Major changes made to current view (filters added/removed, view mode changed)
- Changes NOT auto-saved (manual save required)

**Visual:**
```tsx
<span className="w-1.5 h-1.5 rounded-full bg-core-orange animate-pulse" />
```

**Position:** Right side of tab label, before dropdown chevron

**Animation:** `animate-pulse` (Tailwind default pulse)

---

### **Add View Button States (Rule 0.9.12.4)**

The "+ Add View" button changes appearance based on context:

#### **State 1: Default**
**When:** No unsaved changes, no new shared views
```tsx
<button className="flex items-center gap-2 px-4 h-10 border border-dashed border-border-default rounded-sm">
  <Plus className="w-4 h-4" />
  <span className="text-sm">Add View</span>
</button>
```

**Visual:**
- Border: `border border-dashed border-border-default` (thin dashed gray)
- Background: `transparent`
- Text: `text-foreground-secondary`

#### **State 2: Beacon (New Shared Views)**
**When:** New shared views received from team members (notification beacon)
```tsx
<button className="flex items-center gap-2 px-4 h-10 border-2 border-dashed border-core-orange rounded-sm animate-pulse">
  <Plus className="w-4 h-4" />
  <span className="text-sm">Add View</span>
</button>
```

**Visual:**
- Border: `border-2 border-dashed border-core-orange` (thick dashed orange)
- Background: `transparent`
- Text: `text-foreground-primary`
- Animation: `animate-pulse`

**Behavior:** Beacon clears when dropdown opens (user acknowledges new views)

#### **State 3: Unsaved Changes**
**When:** Major changes applied to current view (prompts save)
```tsx
<button className="flex items-center gap-2 px-4 h-10 border-2 border-core-orange rounded-sm bg-attention-25 hover:bg-attention-50">
  <Save className="w-4 h-4" />
  <span className="text-sm font-medium">Save View</span>
</button>
```

**Visual:**
- Border: `border-2 border-core-orange` (solid thick orange)
- Background: `bg-attention-25` (light orange tint)
- Hover: `hover:bg-attention-50` (darker orange tint)
- Text: `text-foreground-primary font-medium` (bold)
- Icon: Changes from Plus to Save

**Behavior:** Clicking opens save dialog with current view state pre-filled

---

### **Create/Edit View Dialog (Rule 0.9.12.5)**

#### **Dialog Fields**

| Field | Type | Required? | Validation | Max Length |
|-------|------|-----------|------------|------------|
| **View Name** | Text input | ✅ Yes | Must be unique | 50 chars |
| **Description** | Textarea | ❌ No | None | 200 chars |
| **Share With** | Select dropdown | ✅ Yes | Must select option | N/A |
| **Category** | Select dropdown | ❌ No | Optional grouping | N/A |

#### **Share With Options**

```tsx
const SHARE_OPTIONS = [
  { value: 'private', label: 'Private (Only Me)' },
  { value: 'specific-roles', label: 'Specific Roles', requiresSelection: true },
  { value: 'specific-users', label: 'Specific Users', requiresSelection: true },
  { value: 'all-project-users', label: 'All Project Users' },
]
```

**Conditional UI:**
- If "Specific Roles" selected → Show multi-select with role checkboxes
- If "Specific Users" selected → Show user search + multi-select

#### **Dialog Actions**

```tsx
<div className="flex items-center justify-between pt-4 border-t">
  <Button variant="outline" onClick={handleCancel}>
    Cancel
  </Button>
  
  <div className="flex items-center gap-2">
    {/* Delete button (edit mode only, personal/shared-owned views) */}
    {isEditMode && canDelete && (
      <Button variant="destructive" onClick={handleDelete}>
        Delete View
      </Button>
    )}
    
    {/* Save button */}
    <Button 
      variant="default" 
      onClick={handleSave}
      disabled={!viewName.trim()}
    >
      {isEditMode ? 'Save Changes' : 'Create View'}
    </Button>
  </div>
</div>
```

---

### **Tab Dropdown Menu (Rule 0.9.12.6)**

**Available for:** Personal views and Shared (Owned) views only

**Trigger:** Click chevron icon on tab

**Menu Items:**

| Action | Icon | Availability | Behavior |
|--------|------|--------------|----------|
| **Edit View** | Edit | Personal, Shared (Owned) | Opens edit dialog |
| **Duplicate View** | Copy | All types | Creates new personal view with same filters |
| **Share View** | Share | Personal, Shared (Owned) | Opens share dialog |
| **Delete View** | Trash | Personal, Shared (Received), Shared (Owned) | Two-click confirmation |

#### **Delete Confirmation**

**Method:** Two-click confirmation (no modal)

```tsx
const [deleteConfirmation, setDeleteConfirmation] = useState(false)

const handleDelete = () => {
  if (!deleteConfirmation) {
    // First click - show confirmation
    setDeleteConfirmation(true)
    
    // Reset after 3 seconds
    setTimeout(() => setDeleteConfirmation(false), 3000)
  } else {
    // Second click - confirm delete
    deleteView(viewId)
    setDeleteConfirmation(false)
  }
}

// Button label changes
<Button variant="destructive">
  {deleteConfirmation ? 'Confirm Delete?' : 'Delete View'}
</Button>
```

---

### **Change Tracking (Rule 0.9.12.7)**

#### **Change Types**

| Type | Triggers | Behavior | Auto-Save? | Shows Banner? |
|------|----------|----------|------------|---------------|
| **None** | No changes | Default state | N/A | ❌ No |
| **Minor** | Sort column/direction, Column show/hide, Column reorder | Silent for personal views | ✅ Yes (personal only) | ❌ No |
| **Major** | Filters added/removed, View mode changed, Display type changed | Requires save | ❌ No | ✅ Yes |

#### **Detection Logic**

```tsx
useEffect(() => {
  if (!savedViewState || !currentViewState) {
    setChangeType('none')
    return
  }

  // Check for major changes
  const hasMajorChanges = 
    JSON.stringify(savedViewState.filters) !== JSON.stringify(currentViewState.filters) ||
    savedViewState.viewMode !== currentViewState.viewMode ||
    savedViewState.displayType !== currentViewState.displayType

  // Check for minor changes
  const hasMinorChanges =
    savedViewState.sortColumn !== currentViewState.sortColumn ||
    savedViewState.sortDirection !== currentViewState.sortDirection ||
    JSON.stringify(savedViewState.visibleColumns) !== JSON.stringify(currentViewState.visibleColumns) ||
    JSON.stringify(savedViewState.columnOrder) !== JSON.stringify(currentViewState.columnOrder)

  if (hasMajorChanges) {
    setChangeType('major')
    setUnsavedChangesStartTime(new Date()) // Track for time-based clear
  } else if (hasMinorChanges && activeViewType !== 'standard') {
    setChangeType('minor')
    // Auto-save for personal views (silent, no banner)
  } else {
    setChangeType('none')
  }
}, [savedViewState, currentViewState, activeViewType])
```

---

### **Unsaved Changes Banner (Rule 0.9.12.8)**

**When to Show:** `changeType === 'major'`

**Position:** Below saved views tabs, above table content

**Structure:**
```tsx
<div className="flex items-center justify-between px-6 py-3 border-b bg-attention-25">
  {/* Left: Warning message */}
  <div className="flex items-center gap-2">
    <AlertCircle className="w-4 h-4 text-attention-900" />
    <span className="text-sm font-medium text-attention-900">
      You have unsaved changes
    </span>
  </div>
  
  {/* Right: Actions */}
  <div className="flex items-center gap-2">
    {/* Clear changes button */}
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleClearChanges}
    >
      {clearConfirmation ? 'Confirm Clear?' : 'Clear Changes'}
    </Button>
    
    {/* Save button (varies by view type) */}
    {activeViewType === 'standard' ? (
      <Button size="sm" onClick={handleSaveAsNew}>
        Save as New View
      </Button>
    ) : (
      <SplitButton 
        primaryLabel="Save Changes"
        primaryAction={handleSaveChanges}
        secondaryLabel="Save as New View"
        secondaryAction={handleSaveAsNew}
      />
    )}
  </div>
</div>
```

#### **Clear Changes Logic**

**Time-based confirmation:**
- **< 2 minutes:** Immediate clear (no confirmation)
- **≥ 2 minutes:** Requires two-click confirmation

```tsx
const handleClearChanges = () => {
  const timeElapsed = Date.now() - unsavedChangesStartTime.getTime()
  const twoMinutes = 2 * 60 * 1000

  if (timeElapsed < twoMinutes) {
    // Immediate clear
    revertToSavedState()
    setChangeType('none')
  } else {
    // Two-click confirmation
    if (!clearConfirmation) {
      setClearConfirmation(true)
      setTimeout(() => setClearConfirmation(false), 3000)
    } else {
      revertToSavedState()
      setChangeType('none')
      setClearConfirmation(false)
    }
  }
}
```

#### **Save Button Logic**

**For Standard Views:**
- Only option: "Save as New View" (cannot modify standard views)

**For Personal/Shared-Owned Views:**
- Primary action: "Save Changes" (updates existing view)
- Secondary action: "Save as New View" (creates new view)
- Uses split button component

---

### **State Persistence (Rule 0.9.12.9)**

#### **What Gets Persisted**

Per saved view, store:
```tsx
interface ViewState {
  // View metadata
  id: string
  name: string
  type: 'standard' | 'personal' | 'shared'
  
  // View configuration
  filters: FilterValue[]  // Advanced filters (not primary tab filters)
  viewMode: 'list' | 'grid'
  displayType?: string    // Optional (e.g., 'compact', 'detailed')
  
  // Column configuration
  visibleColumns: string[]
  columnOrder: string[]
  
  // Sort state
  sortColumn: string | null
  sortDirection: 'asc' | 'desc'
  
  // Metadata
  createdAt: string
  updatedAt: string
  createdBy: string
  sharedWith?: string[]
}
```

#### **Storage Strategy**

**localStorage** (temporary, for demo/prototyping):
```tsx
const storageKey = `table-view-${viewId}`
localStorage.setItem(storageKey, JSON.stringify(viewState))
```

**API** (production):
```tsx
// Save view to backend
await api.saveView({ viewId, viewState })

// Load view from backend
const viewState = await api.loadView(viewId)
```

---

### **Tab Reordering (Rule 0.9.12.10)**

**Available for:** Personal and Shared (Owned) views only (NOT standard views)

**Implementation:** Use react-dnd for drag-and-drop

```tsx
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function SavedViewTab({ view, index, moveTab }) {
  const ref = useRef<HTMLDivElement>(null)
  
  const [{ isDragging }, drag] = useDrag({
    type: 'VIEW_TAB',
    item: { index },
    canDrag: view.type !== 'standard', // Can't drag standard views
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  
  const [{ isOver }, drop] = useDrop({
    accept: 'VIEW_TAB',
    hover(item: { index: number }, monitor) {
      if (!ref.current) return
      
      const dragIndex = item.index
      const hoverIndex = index
      
      if (dragIndex === hoverIndex) return
      
      moveTab(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })
  
  // Only attach drag/drop if not a standard view
  if (view.type !== 'standard') {
    drag(drop(ref))
  }
  
  return (
    <div 
      ref={ref}
      className={cn(
        'transition-opacity',
        isDragging && 'opacity-50'
      )}
    >
      {/* Tab content */}
    </div>
  )
}
```

**Persist Order:**
Store tab order in user preferences:
```tsx
const tabOrder = ['all', 'my-rfis', 'overdue', 'custom-view-1']
localStorage.setItem('saved-views-order', JSON.stringify(tabOrder))
```

---

### **Integration with Table (Rule 0.9.12.11)**

#### **Parent Page Responsibilities**

```tsx
function DocumentsPage() {
  // View management
  const [activeTabId, setActiveTabId] = useState('all')
  const [activeFilters, setActiveFilters] = useState<ViewFilter[]>([])
  const [savedViewState, setSavedViewState] = useState<ViewState | null>(null)
  const [currentViewState, setCurrentViewState] = useState<ViewState | null>(null)
  
  // Change detection
  const [changeType, setChangeType] = useState<'none' | 'minor' | 'major'>('none')
  const [unsavedChangesStartTime, setUnsavedChangesStartTime] = useState<Date>(new Date())
  
  // Callbacks from table
  const handleTableStateChange = (updates: Partial<ViewState>) => {
    setCurrentViewState(prev => ({ ...prev, ...updates }))
  }
  
  // Tab change handler
  const handleTabChange = (tabId: string, filters: ViewFilter[]) => {
    setActiveTabId(tabId)
    setActiveFilters(filters)
    
    // Load saved state for this view
    const savedState = loadViewState(tabId)
    setSavedViewState(savedState)
    setCurrentViewState(savedState)
  }
  
  return (
    <>
      <SavedViewsManager
        activeTabId={activeTabId}
        onTabChange={handleTabChange}
        hasUnsavedChanges={changeType === 'major'}
      />
      
      {changeType === 'major' && (
        <UnsavedChangesBanner
          onClear={handleClearChanges}
          onSave={handleSaveChanges}
        />
      )}
      
      <DocumentIndexTable
        activeTabId={activeTabId}
        activeFilters={activeFilters}
        onStateChange={handleTableStateChange}
      />
    </>
  )
}
```

---

### **Implementation Checklist (Rule 0.9.12.12)**

**Before declaring saved views complete:**

#### **Tab Bar**
- [ ] Standard views render as default tabs (cannot edit/delete)
- [ ] Personal views render with dropdown menu (edit/share/delete)
- [ ] Shared (Owned) views render with people badge + dropdown
- [ ] Shared (Received) views render with dropdown (duplicate/delete only)
- [ ] Active tab shows 2px bottom border (`border-foreground-primary`)
- [ ] Unsaved indicator (orange pulse dot) shows on tabs with major changes
- [ ] Tab reordering works for personal/shared-owned views (not standard)

#### **Add View Button**
- [ ] Default state: Thin dashed gray border, transparent background
- [ ] Beacon state: Thick dashed orange border, pulse animation
- [ ] Unsaved state: Solid orange border, light orange background, "Save View" label

#### **Create/Edit Dialog**
- [ ] View Name field (required, unique validation, 50 char max)
- [ ] Description field (optional, 200 char max)
- [ ] Share With dropdown with all options
- [ ] Conditional role/user selection UI
- [ ] Save button disabled when name is empty
- [ ] Delete button only shows in edit mode for deletable views

#### **Change Tracking**
- [ ] Major changes trigger unsaved banner
- [ ] Minor changes auto-save for personal views (silent)
- [ ] Change detection compares saved vs current state
- [ ] Unsaved indicator appears on tab immediately when changes occur

#### **Unsaved Banner**
- [ ] Shows only when `changeType === 'major'`
- [ ] Clear Changes button has time-based confirmation
- [ ] Save button varies by view type (split button for personal/shared-owned)
- [ ] Standard views only show "Save as New View"

#### **State Persistence**
- [ ] View state saves to localStorage (or API)
- [ ] View state loads when tab selected
- [ ] Tab order persists across sessions
- [ ] Column configuration persists per view
- [ ] Sort state persists per view

#### **Dropdown Menu**
- [ ] Edit option opens edit dialog
- [ ] Duplicate creates new personal view
- [ ] Share opens share dialog (personal/shared-owned only)
- [ ] Delete requires two-click confirmation
- [ ] Menu positioned correctly (no overflow issues)

---

### **Red Flags - Never Do These (Rule 0.9.12.13)**

**Tab Styling:**
- ⛔ Using borders on inactive tabs (only active tab has border)
- ⛔ Making unsaved indicator too large (1.5px dot only)
- ⛔ Forgetting pulse animation on unsaved dot
- ⛔ Using wrong border color for active tab (must be foreground-primary or core-orange)

**Add View Button:**
- ⛔ Not changing label to "Save View" when unsaved changes exist
- ⛔ Using solid border in default state (must be dashed)
- ⛔ Forgetting beacon state for new shared views
- ⛔ Missing background tint in unsaved state

**Change Tracking:**
- ⛔ Not distinguishing between major and minor changes
- ⛔ Auto-saving major changes (requires manual save)
- ⛔ Not tracking unsaved changes start time (needed for clear confirmation)
- ⛔ Showing unsaved banner for minor changes

**State Management:**
- ⛔ Not persisting view state to localStorage/API
- ⛔ Mixing saved state and current state (must track separately)
- ⛔ Not loading saved state when tab changes
- ⛔ Forgetting to include all table state in ViewState object

**Dialog:**
- ⛔ Allowing empty view names (must validate)
- ⛔ Not checking for duplicate view names
- ⛔ Missing conditional UI for role/user selection
- ⛔ Showing delete button for standard views (cannot delete)

---

### **Reference Implementation (Rule 0.9.12.14)**

**Gold Standard Files:**
- **Tab Bar Component**: `/src/app/components/documents/saved-views-manager.tsx`
- **Parent Page**: `/src/app/documents/page.tsx` (lines 45-120: Change tracking logic)
- **Create View Dialog**: `/src/app/components/documents/create-view-dialog.tsx`
- **Unsaved Banner**: Inline in parent page (conditionally rendered)

**Complete Documentation**: `/DOCUMENT_INDEX_TABLE_GOLD_STANDARD.md` (Section 13: Saved Views Integration)

**Key Patterns:**
- Tab state management (active, unsaved, shared badges)
- Change detection (major vs minor)
- Two-click confirmation for destructive actions
- Time-based clear confirmation
- Split button for save options

---

# General guidelines

* **Maximum of two panes in the workspace - never create a third pane** (Rule 0.6 - see [Phase 6: Split-View and Slide-Out Interaction Rules](#phase-6-split-view-and-slide-out-interaction-rules-critical))
* **Split-view and Slide-out are MUTUALLY EXCLUSIVE** - NEVER both visible at the same time (Rule 0.6)
* Grids MUST always be placed in the LEFT pane only
* Details can appear in LEFT or RIGHT pane depending on pattern
* Context content (activity feeds, comments) appears in RIGHT pane only
* All workspace state MUST be tracked via Stateful Navigation for browser history support (see [Stateful Navigation Documentation](/STATEFUL_NAVIGATION_LOGIC.md))
* Both panes remain fully interactive when visible - no blocking between panes
* Use responsive layouts that collapse to single pane on mobile
* Prefer flexbox and grid layouts over absolute positioning
* Keep file sizes small and put helper functions in their own files

---

# Design system guidelines

## Color System
* Use CSS variables ONLY - never use hex codes or RGB values directly
* Format: `var(--background-primary)` not `#000000`
* Dark mode auto-switches via CSS variables
* Use semantic token suffixes: `bg-background-primary`, not `bg-background`
* Color hierarchy: `foreground-primary`, `foreground-secondary`, `foreground-muted`

## Typography
* Use design tokens for all typography
* Base font-size: 16px
* Use Tailwind typography utilities from design system

## Spacing
* Use Tailwind spacing classes: `p-4`, `m-6`, etc.
* Never use pixel values directly: `p-[16px]` is incorrect
* Use consistent spacing scale throughout

## Icons
* Import icons from `react-icons/ri` (Remix icons) only
* Use consistent icon sizing: `h-5 w-5` for standard, `h-6 w-6` for larger

## Components
* Use base components from `@/components/ui`
* Use `cn()` utility for className merging
* Loading states use Loader component from `@/components/ui/loader`
* ⚠️ **NEVER render horizontal dividers in headers** (border-b, border-t) unless explicitly requested
* Headers use white background (`bg-white`) for consistency across all components

## Page Templates
* **ALWAYS use page templates as starting point** (`/src/app/components/shared/templates/`)
* Three primary templates available:
  1. **HomeViewTemplate** - Dashboard pages with tabs and card blocks
  2. **AnchorViewTemplate** - Grid/list/table views with optional tabs
  3. **DetailViewTemplate** - Detail pages with breadcrumbs
* Templates include proper page headers, empty states, and design system styling
* Only create custom layouts when templates cannot accommodate requirements
* Templates automatically ensure consistency with interaction model patterns

### HomeViewTemplate Usage
```tsx
import { HomeViewTemplate } from '@/app/components/shared/templates'

<HomeViewTemplate
  title="Portfolio Dashboard"
  subheading="Overview of all projects"
  tabs={[
    { label: 'Overview', isActive: true, onClick: () => {} },
    { label: 'Projects', isActive: false, onClick: () => {} },
  ]}
  onCreateClick={handleCreate}
>
  <YourContentHere />
</HomeViewTemplate>
```

### AnchorViewTemplate Usage
```tsx
import { AnchorViewTemplate } from '@/app/components/shared/templates'

<AnchorViewTemplate
  title="Submittals"
  subheading="Manage project submittals"
  showTabs={true}
  tabs={[
    { label: 'Active', isActive: true, onClick: () => {} },
    { label: 'Pending', isActive: false, onClick: () => {} },
  ]}
  onImportClick={handleImport}
  onExportClick={handleExport}
  onCreateClick={handleCreate}
>
  <YourGridOrListHere />
</AnchorViewTemplate>
```

### DetailViewTemplate Usage
```tsx
import { DetailViewTemplate } from '@/app/components/shared/templates'

<DetailViewTemplate
  breadcrumbs={[
    { label: 'Submittals', href: '/submittals' },
    { label: 'Submittal #456', href: '/submittals/456' },
    { label: 'Details' }
  ]}
  title="Structural Steel Submittal"
  subheading="Review and approve structural components"
  onImportClick={handleImport}
  onExportClick={handleExport}
  onCreateClick={handleCreate}
>
  <YourDetailContentHere />
</DetailViewTemplate>
```

---

# Global Header Logic

## Context Switching and Breadcrumb Behavior (Rule 1.5 - CRITICAL)

**CRITICAL PRINCIPLE**: When users switch context (Portfolio ↔ Project) via the breadcrumb/project selector, the current page/tool MUST remain open with data refreshed for the new context. The application MUST NOT navigate away from the current page.

**Complete Documentation**: [CONTEXT_SWITCHING_BREADCRUMB_LOGIC.md](/CONTEXT_SWITCHING_BREADCRUMB_LOGIC.md)

### **Key Rules:**

1. **Stay on Current Page**: Context switching refreshes data but does NOT navigate away
2. **Scenario 1**: User on RFIs (project-only) → Selects project from breadcrumb → RFI page refreshes with that project's data (does NOT go to home)
3. **Scenario 2**: User on Documents (context-agnostic) → Switches Portfolio ↔ Project → Documents page refreshes to show all documents OR project documents (does NOT go to home)
4. **Scenario 3**: User on RFIs (project-only) → Tries to switch to Portfolio → System shows warning with navigation options (does NOT silently navigate)

### **Breadcrumb Visual States:**

| Context | Display | Active Element | Clickable Action |
|---------|---------|----------------|------------------|
| Portfolio | "Portfolio" | Portfolio (white, bold) | Opens project selector |
| Project | "Portfolio > Skyline Tower" | Project name (white, bold), Portfolio (gray) | Project name opens selector, Portfolio switches to Portfolio context |

**See complete scenarios, code examples, and implementation checklist in**: [CONTEXT_SWITCHING_BREADCRUMB_LOGIC.md](/CONTEXT_SWITCHING_BREADCRUMB_LOGIC.md)

---

## Panel Mutual Exclusion (Rule 1.6)
* **ONLY ONE PANEL** can be open at a time - either Sidebar OR Assist Panel, never both
* Opening Sidebar automatically closes Assist Panel
* Opening Assist Panel automatically closes Sidebar
* This prevents header element overlap and maintains proper spacing

## Element Priority System (Rule 1.7)
The Global Header uses a priority-based responsive system where elements hide progressively based on available space. Elements MUST follow this priority order:

| Priority | Element | Breakpoint | Additional Hide Conditions |
|----------|---------|------------|---------------------------|
| **P1** | Menu Icon | Never hides | Always visible (highest priority) |
| **P2** | Project Menu | < 400px | Hide only at extreme constraint |
| **P3** | Ask Assist Button | < 640px (sm) | - |
| **P4** | Favorite Tools | < 1024px (lg) | - |
| **P5** | Search Bar | < 1280px (xl) | **Also hides when Sidebar is open** |
| **P6** | Notifications, Help, Apps | < 768px (md) | **Also hide when Assist Panel is open** |

## Anti-Overlap Rules (Rule 1.8)
* All text elements MUST use `whitespace-nowrap` to prevent wrapping
* Long project names MUST use `truncate` with `min-w-0` and `max-w-full`
* Critical elements (icons, buttons) MUST use `flex-shrink-0`
* No element should visually overlap another element
* Text should never wrap to two lines in the header

## Implementation Requirements (Rule 1.9)
* Use conditional hiding with `cn()` utility for state-based visibility
* Search bar uses absolute positioning but respects sidebar state
* P6 elements (Notifications, Help, Apps) hide completely when Assist Panel opens
* All elements must have proper `flex-shrink` values to prevent overflow

## Responsive Behavior Examples

**Full Width (> 1280px, no panels):**
```
[☰] [Project Selector] | [Favorite Tools]    [Search]    [🔔][?][⚙][Ask Assist]
```

**Sidebar Open:**
```
[☰] [Project Selector] | [Favorite Tools]               [🔔][?][⚙][Ask Assist]
                                              ↑ Search hidden (P5)
```

**Assist Panel Open:**
```
[☰] [Project Selector] | [Favorite Tools]    [Search]              [Ask Assist]
                                                        ↑ P6 icons hidden
```

**Medium (768-1024px):**
```
[☰] [Project Selector]                      [Search]    [🔔][?][⚙][Ask Assist]
                       ↑ Favorite Tools hidden (P4)
```

**Small (640-768px):**
```
[☰] [Project Selector]                                  [Ask Assist]
                       ↑ P4, P5, P6 all hidden
```

**Very Small (400-640px):**
```
[☰] [Project Selector]
     ↑ Only P1 and P2 visible, P3 (Ask Assist) hidden
```

**Extreme (< 400px):**
```
[☰]
     ↑ Only Menu Icon (P1) visible
```

---

# Favorite Tools Logic

## Purpose (Rule 1.11)
* Favorite Tools menu provides quick access to user's most frequently used tools
* Functions exactly like app sidebar navigation
* Shows active state with visual indicator
* Supports navigation to both dedicated and generic tool pages

## Design Specifications (Rule 1.11.1)

### Visual Style
* **Trigger Button**: Two-line layout similar to Project Selector
  * Top line: "Favorite Tools" label (`text-xs text-asphalt-400`)
  * Bottom line: Selected tool name or "Select Tool" placeholder
  * Dropdown arrow: `RiArrowDownSLine` (`w-4 h-4 text-asphalt-400`)
* **Selected Tool Text**: 
  * Active (tool selected): `text-white font-medium` (bold and white)
  * Inactive (no tool): `text-asphalt-300 font-normal` (gray and normal)
* **Dropdown Menu**: 
  * Width: `w-64` (256px)
  * Padding: `p-2` (8px)
  * Background: `bg-background-primary`
* **Menu Items**:
  * Icon: Tool-specific icon (`w-4 h-4 text-foreground-secondary`)
  * Label: Tool name (`text-sm text-foreground-primary`)
  * Active indicator: Orange checkmark (`RiCheckLine`, `text-core-orange`)
  * Hover: `hover:bg-background-secondary`

### Spacing
* Button padding: `px-3 py-1.5`
* Menu item padding: `px-3 py-2`
* Gap between icon and label: `gap-3`
* Space between items: `space-y-1`

## Navigation Behavior (Rule 1.11.2)

### Active State Logic
```tsx
// Find currently active tool based on activeView prop
const activeTool = ALL_TOOLS.find(tool => tool.name === activeView)

// Show checkmark for active tool
const isActive = activeTool?.id === tool.id
{isActive && <RiCheckLine className="w-4 h-4 text-core-orange ml-auto" />}
```

### Navigation Flow
1. User clicks favorite tool in dropdown
2. `handleToolSelect(tool)` is called
3. `onNavigate(tool.name)` triggers navigation
4. App.tsx updates `currentView` state
5. Active tool indicator updates automatically

### Tool Page Routing
```tsx
// In App.tsx
{(() => {
  const tool = ALL_TOOLS.find(t => t.name === currentView)
  if (tool) {
    // Check if we have a dedicated page for this tool
    if (currentView === 'RFIs') {
      return <RFIsPage />
    }
    // For tools without dedicated pages, show generic page
    return <GenericToolPage toolName={tool.name} toolDescription={tool.description} />
  }
  return null
})()}
```

## Text Styling Rules (Rule 1.11.3)

### Trigger Button Text
* **MUST use conditional styling** with `cn()` utility
* **Selected state**: `text-white font-medium` (matches Project selector)
* **Unselected state**: `text-asphalt-300 font-normal`
* **Example**:
```tsx
<span className={cn(
  "text-sm leading-tight truncate whitespace-nowrap",
  selectedTool ? "text-white font-medium" : "text-asphalt-300 font-normal"
)}>
  {selectedTool ? selectedTool.name : 'Select Tool'}
</span>
```

### Menu Item Text
* All items use consistent styling: `text-sm text-foreground-primary`
* No bold/medium weight in menu items
* Active state shown ONLY via orange checkmark, not text style

## Responsive Behavior (Rule 1.11.4)

### Visibility
* **Priority**: P4 (Favorite Tools)
* **Breakpoint**: Hide below `lg` (1024px)
* **CSS Class**: `hidden lg:flex`
* **No additional hide conditions** (unlike Search or P6 elements)

### Layout Constraints
* Uses `flex-shrink` to prevent overflow
* Text uses `truncate whitespace-nowrap` for long tool names
* Button uses `min-w-0` for proper flex behavior
* Dropdown arrow uses `flex-shrink-0` to always remain visible

## Generic Tool Page (Rule 1.11.5)

### When to Use
* For any tool in `ALL_TOOLS` that doesn't have a dedicated page
* Provides consistent empty state experience
* Ready-to-use template for future development

### Component Structure
```tsx
<GenericToolPage 
  toolName={tool.name} 
  toolDescription={tool.description} 
/>
```

### Features
* Uses `AnchorViewHeader` with standard tabs
* Empty state with tool icon and description
* "Create" button placeholder
* Consistent with NGX Design System

### Example Empty State
* Icon: `RiFileList3Line` in circular background
* Heading: "No {toolName} Yet"
* Description: "This tool is ready to use. Get started by creating your first {toolName.toLowerCase()} entry."
* Action: "Create {toolName}" button

## Integration Requirements (Rule 1.11.6)

### GlobalHeader Props
```tsx
interface GlobalHeaderProps {
  isSidebarOpen: boolean
  onMenuClick: () => void
  onAssistClick: () => void
  isAssistOpen: boolean
  onNavigate?: (view: string) => void  // Required for navigation
  activeView?: string                   // Required for active state
}
```

### App.tsx Integration
```tsx
<GlobalHeader 
  isSidebarOpen={isSidebarOpen} 
  onMenuClick={handleSidebarToggle}
  onAssistClick={handleAssistToggle}
  isAssistOpen={isAssistOpen}
  onNavigate={handleNavigation}      // Pass navigation handler
  activeView={currentView}            // Pass current view for active state
/>
```

## Consistency with Sidebar (Rule 1.11.7)

### Matching Behaviors
* ✅ Both use orange checkmark for active state
* ✅ Both navigate to same pages
* ✅ Both update active state automatically
* ✅ Both support dynamic page creation

### Visual Parity
* Sidebar: Dark theme with white text on active
* Favorite Tools: Dark theme (global header) with white text on selected
* Both use same orange accent color (`text-core-orange`)

## Red Flags - Never Do These

* ⛔ Don't use `selectedTool` state for active indicator (use `activeView` prop)
* ⛔ Don't mix `font-bold` and `font-normal` classes on same element
* ⛔ Don't forget to pass `onNavigate` to GlobalHeader
* ⛔ Don't create dedicated pages without adding to routing logic
* ⛔ Don't style menu item text differently for active state (use checkmark only)
* ⛔ Don't show Favorite Tools below lg breakpoint
* ⛔ Don't make text wrappable (always use `whitespace-nowrap`)

---

# Page Header Logic

## Purpose (Rule 1.10)
* Page Headers render **under the Global Header** for all page views
* Provides page-level context, navigation, and actions
* Creates visual hierarchy between global navigation and page content
* Available in three primary variants based on page type and needs

## Design Specifications (Rule 1.10.1)

### Visual Style
* **Background**: `bg-white` - All page headers use white background
* **Border Bottom**: `border-border-default` - Single bottom border separates header from content
* **No Top Border**: No divider line above tabs (tabs flow from title row)
* **Typography**: 
  * Title: `text-xl font-bold` (20px, bold)
  * Subheading: `text-sm` (14px, secondary color)
  * Tabs: `text-sm font-medium` (14px, medium weight)

### Layout Structure
* **Two-Row Layout**:
  1. Title & Actions Row: Title/Subheading (left) + Action Buttons (right)
  2. Tabs Row (optional): Tab navigation with active indicator

### Spacing
* Horizontal padding: `px-6` (24px)
* Title row vertical: `pt-4 pb-3` (16px top, 12px bottom)
* Tab height: `h-10` (40px)
* Action buttons: `@/components/ui/button` default size (Untitled `md`); avoid hard-coding `h-8` unless a legacy layout spec still requires it
* Gap between actions: `gap-2` (8px)

## Page Header Variants (Rule 1.10.2)

### 1. Dashboard Page Header
**Use When**: Homepage or dashboard views with multiple tab sections

**Features**:
* Title + Subheading
* Tab navigation with "More" dropdown for overflow tabs
* Primary "Create" button with dropdown
* More menu (3 dots)

**Component**: `DashboardPageHeader`

**Example**:
```tsx
<DashboardPageHeader
  title="Portfolio Dashboard"
  subheading="Overview of all projects"
  tabs={[
    { label: 'Overview', isActive: true },
    { label: 'Projects', isActive: false },
    { label: 'Reports', isActive: false },
  ]}
  onCreateClick={handleCreate}
/>
```

**Visual Structure**:
```
┌─────────────────────────────────────────────────────┐
│ Dashboard Title                      [Create ▼] [...] │
│ Subheading                                          │
│ Overview  Projects  Reports  More ▼                 │
│ ────────                                            │
└─────────────────────────────────────────────────────┘
```

### 2. Anchor View Header (with tabs)
**Use When**: Grid/list views with multiple tab sections and data management actions

**Features**:
* Title + Subheading
* Tab navigation (no "More" dropdown)
* Import/Export/Create action buttons
* More menu (3 dots)

**Component**: `AnchorViewHeader`

**Example**:
```tsx
<AnchorViewHeader
  title="Submittals"
  subheading="Manage project submittals"
  tabs={[
    { label: 'Active', isActive: true },
    { label: 'Pending', isActive: false },
    { label: 'Closed', isActive: false },
  ]}
  onImportClick={handleImport}
  onExportClick={handleExport}
  onCreateClick={handleCreate}
/>
```

**Visual Structure**:
```
┌────────────────────────────────────────────────────────────┐
│ Submittals            [Import] [Export ▼] [+ Create] [...] │
│ Manage project submittals                                   │
│ Active  Pending  Closed                                     │
│ ──────                                                      │
└─────────────────────────────────────────────────────────────┘
```

### 3. Anchor View Header (no tabs)
**Use When**: Single-view pages without tab navigation (settings, simple lists)

**Features**:
* Title + Subheading
* Import/Export/Create action buttons
* More menu (3 dots)
* No tabs row

**Component**: `AnchorViewHeaderNoTabs`

**Example**:
```tsx
<AnchorViewHeaderNoTabs
  title="Project Settings"
  subheading="Configure project preferences"
  onImportClick={handleImport}
  onExportClick={handleExport}
  onCreateClick={handleCreate}
/>
```

**Visual Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ Project Settings      [Import] [Export ▼] [+ Create] [...] │
│ Configure project preferences                               │
└─────────────────────────────────────────────────────────────┘
```

## Action Button Specifications (Rule 1.10.3)

### Button variants (`@/components/ui/button`)
* **Primary / default action**: `<Button>` or `variant="default"` — theme `--primary` / `--primary-foreground` under legacy
* **Outline**: `variant="outline"` — `var(--input)` border, transparent fill (legacy rules)
* **Secondary**: `variant="secondary"` — gray secondary ramp (`--color-bg-btn-secondary` family)
* **Destructive**: `variant="destructive"` — danger tokens per legacy `[data-variant="destructive"]` rules
* **Ghost / link**: `variant="ghost"` | `variant="link"` as needed

### Button features
* **Dropdown indicator**: `hasDropdown: true` (or equivalent pattern) where the spec requires a chevron
* **Icon support**: Leading/trailing icons via `Button` children slots or icon props per facade
* **Height**: Driven by Untitled size + legacy horizontal padding (`--space-2`); do not assume a single fixed `h-8` for all actions
* **Whitespace**: `whitespace-nowrap` where labels must not wrap

### Common Actions
* **Create**: Primary action, often with dropdown for multiple create types
* **Import**: Outline variant, data input action
* **Export**: Outline variant with dropdown for export formats
* **More Menu**: 3-dot icon button for overflow actions

## Tab Navigation (Rule 1.10.4)

### Tab Behavior
* **Active State**: 
  * Text: `text-foreground-primary` (dark)
  * Bottom border: 2px solid bar (`h-0.5 bg-foreground-primary`)
* **Inactive State**: 
  * Text: `text-foreground-secondary` (gray)
  * Hover: `hover:text-foreground-primary`
* **Height**: Consistent `h-10` (40px) for all tabs
* **Spacing**: `gap-1` between tabs

### Tab Overflow
* Dashboard headers can show "More" dropdown for additional tabs
* Anchor view headers show all tabs inline (design for 3-5 tabs max)

## Layout Hierarchy (Rule 1.10.5)

The Page Header fits into the application shell structure:

```
Application Shell
├���─ Global Header (56px, dark background)
│   ├── Menu Icon / Project Selector
│   ├── Favorite Tools / Search
│   └── Notifications / Help / Ask Assist
├── Page Header (variable height, white background)
│   ├── Title & Actions Row (48-56px)
│   └── Tabs Row (40px, optional)
└── Content Area (scrollable, gray background)
    └── Cards / Grids / Details
```

**Height Calculations**:
* Page Header (no tabs): ~52px (16px + 20px + 14px + 12px)
* Page Header (with tabs): ~92px (52px + 40px)

## Responsive Behavior (Rule 1.10.6)

### Mobile Adaptations
* Action buttons may stack or hide at smaller breakpoints
* Tab labels should use `whitespace-nowrap` to prevent wrapping
* Consider "More" dropdown for tab overflow on narrow screens
* Maintain minimum touch target sizes (44px × 44px)

### Desktop Optimizations
* Action buttons aligned right for easy access
* Tabs flow horizontally with ample spacing
* Hover states provide clear interaction feedback

## Implementation Requirements (Rule 1.10.7)

### Base Component
Use the flexible `PageHeader` component for custom configurations:

```tsx
<PageHeader
  title="Custom Page"
  subheading="Optional description"
  tabs={[...]}
  actions={[...]}
  showMoreTabs={false}
  showMoreMenu={true}
/>
```

### Pre-configured Variants
Use pre-built variants for common patterns:
* `DashboardPageHeader` - Dashboard views
* `AnchorViewHeader` - Grid/list views with tabs
* `AnchorViewHeaderNoTabs` - Simple views without tabs

### State Management
* Tab active states managed by parent component
* Action button click handlers passed as props
* Component is stateless and controlled by parent

## Selection Matrix (Rule 1.10.8)

| Page Type | Has Tabs? | Multiple Create Types? | Use Component |
|-----------|-----------|------------------------|---------------|
| Dashboard | Yes | Yes | `DashboardPageHeader` |
| Grid/List | Yes | No | `AnchorViewHeader` |
| Grid/List | No | No | `AnchorViewHeaderNoTabs` |
| Settings | No | Yes/No | `AnchorViewHeaderNoTabs` |
| Detail View | Depends | Depends | Custom `PageHeader` |

## Red Flags - Never Do These

* ⛔ Use colored backgrounds (only white allowed)
* ⛔ Add top border/divider above tabs
* ⛔ Mix Page Header with custom headers
* ⛔ Place Page Header above Global Header
* ⛔ Use more than two rows in Page Header
* ⛔ Omit bottom border on Page Header
* ⛔ Wrap text in title or buttons (use truncate/nowrap)
* ⛔ Use inconsistent spacing (follow 8px grid)

---

# App Sidebar Drag & Drop Logic (Rule 0.8 - CRITICAL)

## CRITICAL PRINCIPLE

The App Sidebar accordion menus MUST support drag-and-drop reordering using react-dnd with proper state management to prevent reordering resets.

---

## Purpose (Rule 0.8.1)

**Use When**: Building or modifying the App Sidebar navigation structure

**Benefits**:
- ✅ User customization of tool order
- ✅ Persistent reordering across page navigation
- ✅ Visual feedback during drag operations
- ✅ Smooth interaction with hover indicators

---

## Critical Implementation Pattern (Rule 0.8.2)

### **MANDATORY: Define Menu Items Outside Component**

⚠️ **The menu items array MUST be defined as a module-level constant, NOT inside the component function.**

**Why**: Prevents unnecessary re-creation on every render, which would trigger useEffect dependencies and reset user's custom order.

### **Correct Implementation:**

```tsx
// ✅ CORRECT: Define BEFORE component function
const DEFAULT_MENU_ITEMS: AccordionMenuItem[] = [
  {
    id: 'project-management',
    icon: <RiProjectorLine className="w-5 h-5" />,
    label: 'Project Management',
    items: [...]
  },
  // ... rest of menu items
]

function SidebarContent({ isOpen, onClose, ... }: SidebarProps) {
  // Initialize state with constant reference
  const [menuItems, setMenuItems] = useState<AccordionMenuItem[]>(DEFAULT_MENU_ITEMS)
  
  // No useEffect needed - state persists naturally
  const moveMenu = useCallback((dragIndex: number, hoverIndex: number) => {
    setMenuItems((prevItems) => {
      const newItems = [...prevItems]
      const draggedItem = newItems[dragIndex]
      newItems.splice(dragIndex, 1)
      newItems.splice(hoverIndex, 0, draggedItem)
      return newItems
    })
  }, [])
  
  // ...
}
```

### **Wrong Implementation (CAUSES BUG):**

```tsx
// ❌ WRONG: Defined INSIDE component function
function SidebarContent({ isOpen, onClose, ... }: SidebarProps) {
  // This array is recreated on every render (new reference each time)
  const defaultMenuItems: AccordionMenuItem[] = [
    {
      id: 'project-management',
      icon: <RiProjectorLine className="w-5 h-5" />,
      label: 'Project Management',
      items: [...]
    },
    // ...
  ]
  
  const [menuItems, setMenuItems] = useState<AccordionMenuItem[]>(defaultMenuItems)
  
  // ❌ BUG: This useEffect fires on every render
  useEffect(() => {
    const defaultIds = defaultMenuItems.map(m => m.id).join(',')
    const currentIds = menuItems.map(m => m.id).join(',')
    
    // ❌ BUG: This checks ORDER, not just presence
    // User drags → order changes → strings don't match → RESETS!
    if (defaultIds !== currentIds) {
      setMenuItems(defaultMenuItems)  // ← Resets to original order
    }
  }, [defaultMenuItems])  // ← Fires every render (new reference each time)
}
```

**What Goes Wrong:**
1. User drags "Financials" above "Project Management"
2. `moveMenu` updates state → items reorder ✓
3. Component re-renders with new order
4. `defaultMenuItems` is recreated (new array reference)
5. `useEffect` fires because dependency changed
6. Comparison: `"project-management,financials,..."` ≠ `"financials,project-management,..."` 
7. **RESETS to original order** ❌

---

## Drag & Drop Implementation (Rule 0.8.3)

### **AccordionMenu Component with useDrag and useDrop:**

```tsx
function AccordionMenu({ menuItem, isExpanded, onToggle, index, moveMenu, onItemClick }: AccordionMenuProps) {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Drag source configuration
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },  // Current index in array
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  // Drop target configuration
  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover(item: { index: number }, monitor) {
      if (!ref.current) return
      
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      // Perform the move
      moveMenu(dragIndex, hoverIndex)
      
      // Update the dragged item's index for next comparison
      item.index = hoverIndex
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  // ✅ CRITICAL: Attach both drag and drop to same ref
  drag(drop(ref))

  return (
    <div 
      ref={ref}  // ← Single ref receives both drag and drop connectors
      className={cn(
        "relative transition-opacity cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual indicator when hovering during drag */}
      {isOver && (
        <div className="absolute inset-0 bg-asphalt-700 rounded-sm opacity-50 pointer-events-none" />
      )}
      
      {/* Menu content with drag handle on hover */}
      <div onClick={onToggle} className="...">
        <span className="w-5 h-5 flex items-center justify-center">
          {isHovered ? (
            <RiDraggable className="w-4 h-4 text-asphalt-400 rotate-90" />
          ) : (
            <span className="text-asphalt-400">{menuItem.icon}</span>
          )}
        </span>
        <span className="flex-1">{menuItem.label}</span>
        {/* Arrow icon */}
      </div>
      
      {/* Nested items (if expanded) */}
    </div>
  )
}
```

---

## Visual Feedback Rules (Rule 0.8.4)

### **Hover State:**
- **Normal**: Menu icon visible
- **Hover**: Icon swaps to `RiDraggable` (rotated 90°)
- **Cursor**: Changes to `cursor-grab`

### **Dragging State:**
- **Opacity**: Dragged item becomes `opacity-50`
- **Cursor**: Changes to `cursor-grabbing` during active drag
- **Hover Indicator**: Target items show `bg-asphalt-700` overlay at 50% opacity

### **Drop State:**
- **Position Update**: Items swap positions immediately
- **Visual Confirmation**: Hover overlay disappears
- **State Persistence**: New order persists in `menuItems` state

---

## DndProvider Setup (Rule 0.8.5)

### **Wrap Sidebar with DndProvider:**

```tsx
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export function AppSidebar(props: SidebarProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <SidebarContent {...props} />
    </DndProvider>
  )
}
```

**Why Separate Component:**
- DndProvider must wrap all drag/drop components
- Keeps provider logic separate from sidebar content
- Allows SidebarContent to access DnD context

---

## moveMenu Callback Logic (Rule 0.8.6)

### **State Update Function:**

```tsx
const moveMenu = useCallback((dragIndex: number, hoverIndex: number) => {
  setMenuItems((prevItems) => {
    const newItems = [...prevItems]           // Create shallow copy
    const draggedItem = newItems[dragIndex]   // Get dragged item
    newItems.splice(dragIndex, 1)              // Remove from old position
    newItems.splice(hoverIndex, 0, draggedItem) // Insert at new position
    return newItems
  })
}, [])
```

**Example Flow:**
```
Initial: [A, B, C, D, E]
Drag A (index 0) over C (index 2):
  dragIndex = 0, hoverIndex = 2
  newItems = [A, B, C, D, E]
  draggedItem = A
  After splice(0, 1): [B, C, D, E]
  After splice(2, 0, A): [B, C, A, D, E]
  Result: [B, C, A, D, E] ✓
```

---

## Validation Checklist (Rule 0.8.7)

**Before declaring drag & drop implementation complete:**

- [ ] Menu items defined as module-level constant (outside component)
- [ ] State initialized with constant: `useState(DEFAULT_MENU_ITEMS)`
- [ ] NO useEffect that compares and resets menu order
- [ ] `moveMenu` uses `useCallback` with empty dependency array
- [ ] `useDrag` configured with `type` and `item: { index }`
- [ ] `useDrop` configured with `accept` and `hover` callback
- [ ] Single ref used: `drag(drop(ref))`
- [ ] Ref attached to container div (not button)
- [ ] Hover state toggles drag handle icon
- [ ] Visual feedback: `isDragging` shows opacity-50
- [ ] Visual feedback: `isOver` shows overlay indicator
- [ ] `item.index` updated in hover callback after move
- [ ] DndProvider wraps entire sidebar component
- [ ] HTML5Backend imported and used

---

## Common Bugs & Fixes (Rule 0.8.8)

### **Bug 1: Items Snap Back After Drag**

**Symptom**: Items reorder during drag but return to original position on drop

**Cause**: Menu items array defined inside component + useEffect resetting order

**Fix**: Move array outside component as module-level constant

---

### **Bug 2: Drag Handle Doesn't Work**

**Symptom**: Can't grab items to drag them

**Cause**: Ref not properly attached or drag/drop connectors separated

**Fix**: Use single ref with `drag(drop(ref))` pattern

---

### **Bug 3: Visual Feedback Missing**

**Symptom**: No opacity change or hover indicator during drag

**Cause**: Missing `isDragging` or `isOver` checks in render

**Fix**: Use collected values in className with `cn()` utility

---

## Reference Implementation (Rule 0.8.9)

**Gold Standard**: `/src/app/components/shell/app-sidebar-new.tsx`

**Key Features Demonstrated:**
- Module-level constant for menu items (lines 59-149)
- Single ref pattern for drag and drop (line 129)
- Hover state with icon swap (lines 155-161)
- Visual feedback during drag (lines 134-144)
- moveMenu with proper array manipulation (lines 293-301)
- DndProvider wrapper pattern (lines 441-447)

---

## Red Flags - Never Do These

- ⛔ Defining menu items array inside component function
- ⛔ Using useEffect to "sync" with default items (causes reset bug)
- ⛔ Comparing joined ID strings to detect changes (fails on reorder)
- ⛔ Separating drag and drop refs (use single ref)
- ⛔ Attaching ref to button instead of container div
- ⛔ Forgetting to update `item.index` in hover callback
- ⛔ Missing DndProvider wrapper
- ⛔ Using wrong backend (must be HTML5Backend)
- ⛔ Not using `useCallback` for moveMenu (causes unnecessary re-renders)
- ⛔ Forgetting visual feedback (opacity, hover indicators)

---
## Foundation Reference

 TEMPLATE HOME frame loaded for shell specifications
 Current frame type identified (Home View, Anchor View, Detail View, Settings, Unified Viewer)
 Target pattern confirmed (Pattern 1, 2, 3, or 4)
 Token rules and architecture constraints active


📐 View Type Nomenclature
Primary Application Views
View NamePrevious NameDescriptionPattern UsageHome ViewDashboardOverview page with stats, activity, quick actionsPattern 2 (Full-Workspace)Anchor ViewGrid List / Item ListData table with search, filters, bulk actionsPattern 1 (33/67 split) + Pattern 3 (create)Detail ViewItem DetailIn-depth view of single record/entityPattern 2 → Pattern 4 (context shift)Settings ViewSettingsConfiguration with internal navigationPattern 2 (internal sidebar)Unified ViewerUnified ViewerFull-screen immersive viewer for BIM/documentsz-80 layer
View Selection Guide
Home View (Pattern 2):

Use for: Dashboards, overview pages, monitoring screens
Layout: Single pane, 100% width
Content: Stats cards, activity feeds, quick actions, charts
Example: Project dashboard with key metrics

Anchor View (Pattern 1 + 3):

Use for: Searchable data tables, list management, CRUD operations
Layout: 100% → Splits to 33/67 when item selected
Content: Grid with toolbar, filters, pagination
Patterns: Pattern 1 for review/edit, Pattern 3 for create
Example: Submittals list, RFI list, Budget items

Detail View (Pattern 2 → 4):

Use for: Complex single-record views with rich content
Layout: 100% → Can shift to 67/33 for context
Content: Tabs, sections, forms, related data
Pattern: Pattern 4 for adding context panel (comments, activity)
Example: Project detail page, User profile

Settings View (Pattern 2):

Use for: Application configuration, user preferences
Layout: 240px internal sidebar + flex content area
Content: Form-heavy, multiple sections
Pattern: Pattern 2 with manual save workflow
Example: User settings, Project defaults, Team permissions


🏗️ View Layer Hierarchy (Z-Index System)
Complete Layer Stack
┌─────────────────────────────────────────┐
│ Unified Viewer (z-80)                   │ Feature-rich collaboration
│ Full-screen immersive                   │ environment for in-depth
│ Replaces entire application             │ actions (BIM, documents)
├──────────────────��──────────────────────┤
│ Modal (z-50)                            │ Confirming critical/
│ Blocking confirmation or                │ destructive actions,
│ system-wide workflow                    │ system workflows
├─────────────────────────────────────────┤
│ Slide-Out (z-30)                        │ Focused, self-contained
│ Create workflows with autosave          │ sub-task (create new)
├─────────────────────────────────────────┤
│ Popover (z-20)                          │ Quick, contextual
│ Contextual actions                      │ in-context tasks
├─────────────────────────────────────────┤
│ Tooltip (z-10)                          │ Static, supplementary
│ Read-only help text                     │ data (read-only)
├─────────────────────────────────────────┤
│ Workspace (z-00)                        │ Application Shell:
│ Base application layer                  │ Sidebar, Header,
│                                         │ Workspace, Assist
└─────────────────────────────────────────┘
Layer Rules by Z-Index
Workspace (z-00) - Base Layer:

 Contains: Sidebar, Global Header, Workspace content, Assist panel (optional; fixed under header when open — see Interaction-Model-Architecture.md)
 Shell chrome is always present; Assist toggles open/closed and reserves workspace margin when open
 Background: bg-background-primary
 All other layers appear on top of this

Tooltip (z-10) - Highest Context Preservation:

 Size: Small, concise text only
 Scrim: None (non-blocking)
 Trigger: Hover on element
 Dismissal: Mouse out
 Use case: Help text, field descriptions, icon explanations
 Context preserved: 100% (everything visible)

Popover (z-20) - High Context Preservation:

 Size: 280-400px width
 Scrim: None (non-blocking)
 Trigger: Click on element
 Dismissal: Outside click, ESC
 Tethered: Visual arrow to trigger element
 Use case: Quick actions (change status, assign user, filter options)
 Context preserved: 95% (background fully visible)

Slide-Out (z-30) - Medium Context Preservation:

 Size: 480px default (resizable 37%-63% of workspace)
 Scrim: bg-white/30 on workspace area only (not Global Header)
 Trigger: "+ New" button or "Create" action
 Dismissal: X button, scrim click, ESC
 Position: Slides from right edge of workspace
 Use case: Creating new records with autosave
 Context preserved: 50% (background dimmed but visible)
 CRITICAL: NO Save/Cancel buttons (autosave workflow)

Modal (z-50) - Interrupt (Blocking):

 Size: 400-600px width (centered)
 Scrim: bg-black/50 covers entire application (including Assist)
 Trigger: Destructive action, system-wide workflow
 Dismissal: Explicit action (Confirm/Cancel), X button
 Position: Centered in viewport
 Use case: Delete confirmations, critical alerts, multi-step workflows
 Context preserved: 20% (background darkened significantly)

Unified Viewer (z-80) - Immersive Collaboration:

 Size: Full viewport (100vw × 100vh)
 Scrim: None (complete replacement, not overlay)
 Trigger: "View in 3D", "Open Full Screen", double-click content
 Dismissal: Close (X) button in Global Header
 Position: Replaces entire application
 Use case: BIM models, CAD drawings, documents, spreadsheets, images
 Context preserved: 0% (application completely hidden)
 CRITICAL: Light theme, docked panels resize Viewable Area
---
## Interaction Pattern System
Interaction Pattern System
Pattern Decision Tree
START: What is the user trying to do?
┌─────────────────────────────────────────┐
│ Creating NEW record?                    │
├─────────────────────────────────────────┤
│ YES → Pattern 3 (Slide-Out, autosave)  │
│ NO  → Continue to next question         │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ Does content need full workspace width? │
├─────────────────────────────────────────┤
│ YES → Pattern 2 (Full-Workspace, 100%)  │
│ NO  → Continue to next question         │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ Is second pane SUPPLEMENTAL or EQUAL?   │
├────────────────────────────────���────────┤
��� SUPPLEMENTAL → Pattern 4 (67/33)        │
│ EQUAL        → Pattern 1 (33/67)        │
└─────────────────────────────────────────┘

Pattern 1: Split-View (Review/Edit Existing + Draft Continuation)
Use Case: Reviewing and editing existing records OR continuing draft creation
Workspace Flow: Grid (100%) → Grid (37%) | Detail (63%)
Save Workflow: Manual save with Save/Cancel buttons
Z-Index: Workspace (z-00)

**📋 MANDATORY:** Use `SplitViewDetail` component from `/src/app/components/shared/patterns`
**📋 See Also:** [Form Creation Checklist](/guidelines/Form-Creation-Checklist.md) for comprehensive form generation and validation rules

**GOLD STANDARD REFERENCE:** `/src/app/components/rfis/rfi-detail-view.tsx`

**🎯 Draft Editing Support:**
- When user clicks "+ Create" (Pattern 3), draft row auto-selects and split-view opens at 63%
- Draft rows can be clicked to re-open split-view detail for continued editing
- Draft status badge in status column indicates completion state
- Draft can be edited in split-view OR opened in full detail page (Pattern 2)

Split-View Detail MANDATORY Requirements:

 MUST use `SplitViewDetail` component (NO custom implementations)
 MUST include utility buttons:
   - Edit button (RiEditLine) - Enter edit mode
   - Open Full View button (RiExternalLinkLine) - Navigate to full page
   - Close button (RiCloseLine) - Dismiss split view
 MUST include sticky footer:
   - Edit mode: ManualSaveFooter (Save/Cancel buttons)
   - View mode: FixedActionFooter (contextual actions)
 SHOULD include navigation arrows (up/down) for list-based views

Validation Checklist:

 Left Pane: Grid Content at 37% (475px)
 Right Pane: Detail Content at 63% (965px) using SplitViewDetail component
 Both panes fully interactive (NO dimming, NO scrim)
 Clicked row shows active state:

Background: bg-asphalt-100 (neutral gray, NO borders)
Reference: TABLE_SPLIT_VIEW_SPEC.md line 709


 Pane separator with resize handle present
 Detail pane structure (enforced by SplitViewDetail):

Three sections: Header (flex-shrink-0) | Content (flex-1 overflow-y-auto) | Footer (flex-shrink-0)
Utility buttons always present (Edit, Open Full View, Close)
Footer always present (ManualSaveFooter OR FixedActionFooter)
Dirty state indicators on changed fields (border-2 border-asphalt-900)


 Save button: bg-asphalt-950 text-white
 Cancel button: bg-background-secondary text-foreground-primary

Dirty State Indicators:

 Option A: Orange dot (6px, bg-core-orange) next to field label
 Option B: Input border changes to border-2 border-asphalt-900
 Both options acceptable, be consistent within frame

Edit Mode Focus State:

 Edit mode input borders: border-2 border-asphalt-900 (NOT blue)
 Focus state: focus:outline-none focus:border-asphalt-900
 Applies to: input, textarea, select elements in edit mode
 Reasoning: Subtle, professional dark border maintains visual hierarchy

Examples:

✅ Submittals Anchor View → Select submittal → Review/edit in Detail pane
✅ RFI Anchor View → Select RFI → Edit response in Detail pane
✅ Budget Anchor View → Select cost code → Edit budget in Detail pane


Pattern 2: Full-Workspace (Complex Detail + Draft Editing)
Use Case: Complex information display, dashboards, overview pages, OR editing drafts in full-page view
Workspace Flow: Previous page (100%) → Detail page (100%)
Save Workflow: Manual save (if editable) OR read-only
Z-Index: Workspace (z-00)

**🎯 Draft Editing Support:**
- Draft rows can be opened in full detail page via "Open Full View" button from split-view
- Draft status badge visible in page header
- Manual save workflow applies to draft editing
- Draft can be submitted to change status from "Draft" to active state

Validation Checklist:

 Content occupies 100% of 1440px workspace width
 NO split panes (single pane only)
 Breadcrumb OR back navigation present (if drilled down)
 May have tabs for organizing content sections
 May have internal navigation (e.g., Settings sidebar at 240px)
 Can transition to Pattern 4 (open context panel at 37%)

View Type Applications:

 Home View: Dashboard with stats, activity, quick actions
 Detail View: Full project/record detail (before context shift)
 Settings View: Configuration pages with internal sidebar
 Complex forms or multi-section content

Examples:

✅ Home View: Project dashboard with 4 stat cards + 2-column content
✅ Detail View: Full project detail with tabs (Team, Schedule, Budget)
✅ Settings View: User profile settings with internal nav sidebar


Pattern 3: Slide-Out (Create New with Autosave)
Use Case: Creating new records
Workspace Flow: Grid (100%) → Grid (dimmed, inert) + Slide-Out (480px)
Save Workflow: AUTOSAVE (NO Save/Cancel buttons)
Z-Index: Slide-Out (z-30)

**📋 See Also:** [Form Creation Checklist](/guidelines/Form-Creation-Checklist.md) for comprehensive form generation rules

**🎯 CRITICAL: Draft Creation Flow (NEW):**

When user clicks "+ Create" button:
1. ✅ Slide-out opens immediately (480px, right side)
2. ✅ **Draft row is IMMEDIATELY created** in parent table/grid (left pane)
3. ✅ **Draft row is AUTO-SELECTED** (highlighted with active state)
4. ✅ **Split-view detail opens automatically** at 63% width (if using Pattern 1)
5. ✅ All autosave content from slide-out **updates draft row in REAL-TIME**
6. ✅ Draft row shows status badge in status column:
   - **"Incomplete"** (red/error badge) when required fields missing
   - **"Draft"** (gray/neutral badge) when all required fields complete
7. ✅ Draft **persists in table** when slide-out closes (even if incomplete)
8. ✅ User can click draft row to continue editing (split-view or full detail page)

**Example Flow (RFI Create):**
```
User on RFI Landing Page clicks "+ Create"
         ↓
Slide-out opens → Draft row "RFI-DRAFT-001" appears in table
         ↓
Draft row auto-selected → Split-view detail opens (63%)
         ↓
User types "Subject: Steel Clarification" in slide-out
         ↓
Draft row updates in real-time → Subject visible in table
         ↓
Status badge shows "Incomplete" (required field "Assigned To" missing)
         ↓
User selects "Assigned To: John Smith"
         ↓
Status badge updates to "Draft" (all required fields complete)
         ↓
User closes slide-out → Draft persists in table
         ↓
User clicks draft row later → Continues editing
```

Validation Checklist:

 Background content dimmed with scrim (bg-white/30 in light mode)
 Background content is INERT (cannot interact, visual only)
 Scrim covers workspace area only — does NOT cover Global Header or Sidebar (positioned absolute within workspace container)
 Slide-Out panel renders within workspace bounds (below Global Header), not above it
 Slide-Out width: 480px default (resizable 37%-63% of workspace)
 Slide-Out shadow: shadow-lg (standard elevation)
 Slide-Out background: bg-background-primary
 Slide-Out header (64px):

Background: bg-background-primary
Border: border-b border-border-default
Title with icon (left)
Close button X (right, 40px × 40px)


 CRITICAL: NO Save or Cancel buttons anywhere
 **Draft row created immediately on slide-out open**
 **Draft row auto-selected with active state (bg-asphalt-100)**
 **Split-view detail opens at 63% automatically (Pattern 1 only)**
 **Status badge in draft row updates based on required field validation**
 **Draft persists in table when slide-out closes**
 Autosave indicators present:

"Saving..." → text-xs text-foreground-tertiary with spinner
"Saved" → text-xs text-success-800 with checkmark


 Required fields marked with red asterisk (text-danger-500)
 Close mechanisms: X button, scrim click, ESC key
 Resize handle on left edge of Slide-Out (4px hit area)

**CRITICAL SLIDE-OUT STYLING RULES:**
 ⚠️ **Scrim**: ALWAYS use `bg-white/30` (white at 30% opacity) in light mode
 ⚠️ **Shadow**: ALWAYS use `shadow-lg` (never shadow-xl or shadow-2xl)
 ⚠️ **Scrim Coverage**: Workspace area ONLY — does NOT cover Global Header or Sidebar. Use `absolute inset-0` within the workspace container, not `fixed inset-0` across the viewport.
 ⚠️ **Panel Positioning**: Panel renders within workspace bounds, below Global Header (top-14 / 56px offset from top). NOT `fixed top-0`.
 ⚠️ **Z-Index**: Scrim and Panel both use `z-30` (Pattern 3 layer)
 ⚠️ These rules apply to ALL slide-out components across the application

Examples:

✅ "+ New Submittal" → Opens slide-out for creating submittal
✅ "+ New RFI" → Opens slide-out for creating RFI
✅ "Add Team Member" → Opens slide-out for adding user to project


Pattern 4: Context Shift (Supplemental Information)
Use Case: Viewing supplemental info while maintaining detail prominence
Workspace Flow: Detail (100%) → Detail (63%) | Context (37%)
Save Workflow: None (context typically read-only)
Z-Index: Workspace (z-00)
Validation Checklist:

 Left Pane: Detail Content at 63% (965px) - maintains prominence
 Right Pane: Context Content at 37% (475px) - supplemental
 Ratio is 67/33 (REVERSED from Pattern 1's 33/67)
 Both panes scroll independently
 Context panel triggered by button in detail header:

Examples: "Comments", "Activity", "History", "Related Items"
Button shows active state when context panel open


 Context panel header (56px):

Title + optional badge (item count)
Close button X (right)
Background: bg-background-primary


 Pane separator with resize handle
 Detail content remains primary (larger, more important)

Context Content Types:

 Comments thread (with new comment input)
 Activity/history feed (timeline, read-only)
 Related items list (read-only or minimal interaction)
 Version history (read-only)
 Metadata/properties (read-only display)

Examples:

✅ Project Detail View → Click "Comments" → Opens comments panel (37%)
✅ Submittal Detail → Click "Activity" → Opens activity feed (37%)
✅ Drawing Detail → Click "Related" → Opens related drawings list (37%)


💾 Save Workflow Rules
Manual Save Workflow (Patterns 1, 2, Settings)
When to Use: Editing existing records, settings, complex forms
Required Elements:

 Save and Cancel buttons present (footer OR header actions)
 Dirty state tracking on changed fields
 Sticky footer appears ONLY when form has unsaved changes

Button Specifications:

 Save button:

Background: bg-asphalt-950
Text: text-white
Label: "Save Changes" or "Save"
Position: Right side of footer


 Cancel button:

Background: bg-background-secondary
Text: text-foreground-primary
Label: "Cancel" or "Discard"
Position: Left of Save button



Dirty State Indicators:

 Option A: Orange dot (6px circle, bg-core-orange, mr-2 before label)
 Option B: Input border changes to border-2 border-border-focus
 Indicator appears immediately when field changes
 Indicator clears after successful save

Footer Structure (when dirty):
┌────────────────────────────────────────────────┐
│ bg-white, border-t, shadow-lg (upward)        │
│ px-6 py-4, height: 64px                       │
│                                               │
│ Left: "Unsaved changes" (text-sm tertiary)   │
│ Right: [Cancel] [Save Changes]               │
└────────────���───���───────────────────────────────┘

Autosave Workflow (Pattern 3 - Slide-Out ONLY)
When to Use: Creating new records via Slide-Out
CRITICAL RULES:

 NO Save or Cancel buttons anywhere in the Slide-Out
 Autosave indicators shown near each field
 Only close mechanism is X button (autosave is automatic)

Autosave Indicator States:
Saving State:

 Icon: Spinner (rotating, 12px)
 Text: "Saving..."
 Color: text-foreground-tertiary
 Size: text-xs
 Position: Below or beside input field (mt-1)

Saved State:

 Icon: Checkmark (12px)
 Text: "Saved"
 Color: text-success-800
 Size: text-xs
 Position: Below or beside input field (mt-1)

Indicator Behavior:

 Shows "Saving..." on field blur or change
 Updates to "Saved" after successful save (0.5-1s delay)
 Each field can have independent save state
 Required fields still marked but no "Save" action needed

---

# Popover and Slide-Out Pattern Library (Rule 1.13 - CRITICAL)

## Overview: The Role of Layering in UI Interaction

**CRITICAL PRINCIPLE**: The application uses a strict layering system to manage user attention and context. Popovers and Slide-Outs are specialized interaction layers that sit above the workspace while maintaining different levels of context preservation.

### The Two-Pane Maximum Rule

The workspace itself maintains a strict **two-pane maximum** (Rule 0.6). Popovers and Slide-Outs provide additional interaction capability without violating this rule by existing in separate z-index layers above the workspace.

---

## Z-Index Layering System (Rule 1.13.1)

### Complete Layer Stack

```
┌─────────────────────────────────────────┐
│ Unified Viewer (z-80)                   │ Feature-rich collaboration
│ Full-screen immersive                   │ environment for in-depth
│ Replaces entire application             │ actions (BIM, documents)
├────────────────���────────────────────────┤
│ Modal (z-50)                            │ Confirming critical/
│ Blocking confirmation or                │ destructive actions,
│ system-wide workflow                    │ system workflows
├─────────────────────────────────────────┤
│ Slide-Out (z-30)                        │ Focused, self-contained
│ Create workflows with autosave          │ sub-task (create new)
├─────────────────────────────────────────┤
│ Popover (z-20)                          │ Quick, contextual
│ Contextual actions                      │ in-context tasks
├─────────────────────────────────────────┤
│ Tooltip (z-10)                          │ Static, supplementary
│ Read-only help text                     │ data (read-only)
├─────────────────────────────────────────┤
│ Workspace (z-00)                        │ Application Shell:
│ Base application layer                  │ Sidebar, Header,
│                                         │ Workspace, Assist
└─────────────────────────────────────────┘
```

### Layer Rules by Z-Index

| Layer | Z-Index | Pattern Types | Scrim | Focus Trap | Dismissal | Context Preserved |
|-------|---------|---------------|-------|------------|-----------|-------------------|
| **Workspace** | z-00 | Grid, Detail, Context | None | No | Navigation | 100% (baseline) |
| **Tooltip** | z-10 | Read-only info | None | No | Hover out, ESC | 100% |
| **Popover** | z-20 | Selection, Configuration, Utility, Drafting | None | No | Click out, ESC | 95% |
| **Slide-Out** | z-30 | Data Entry, File Mgmt, Contextual View, System Config | bg-white/30 (workspace only) | No | Close button, Click workspace | 50% |
| **Modal** | z-50 | Confirmation, Destructive Action, System Workflow | bg-black/50 (entire app) | Yes | Action or Cancel | 20% |
| **Unified Viewer** | z-80 | Document/Drawing/Model/Photo Viewer | Yes (new baseline) | No | Close button | 0% (replaces app) |

---

## The Role of the Popover (Rule 1.13.2)

**Purpose**: Handle brief, in-context interactions within a pane without creating a third pane or breaking the two-pane maximum rule.

### Behavior and Appearance

✅ **Always visually tethered** to a trigger element (button, icon, row action)  
✅ **Appears immediately on click** (no delay)  
✅ **Does not use a scrim** - rest of UI remains visible  
✅ **Non-modal** - underlying UI is inert but not visually disabled  

### Interaction Model

**Dismissal Methods:**
- Clicking outside the popover's boundary
- Pressing the ESC key
- Interacting with another element on the page

**CRITICAL**: While the popover is open, the underlying UI is inert but **not visually disabled** (no dimming, no opacity change).

---

## Popover Pattern Library (Rule 1.13.3)

### Type 1: Selection Popover

**Pattern ID**: PL-Popover-Selection-1.1

**Purpose**: Resource picking and multi-item selection tasks

**Use Cases:**
- Adding resources to projects
- Assigning crew members
- Connecting projects or related entities
- Multi-select from searchable lists

**Content Structure:**
- Search/filter input (when list exceeds 8 items)
- Checkbox list with visual indicators
- Clear selection affordance
- Optional "Select All" / "Clear All" actions

**Interaction Rules:**
- Minimum 3 items, maximum 20 items before requiring search
- Selection persists until explicitly saved or cancelled
- Visual count of selected items
- Supports keyboard navigation (arrow keys + space to select)

**Size Constraints:**
- Width: 280-320px
- Height: Auto, max 400px before scroll

---

### Type 2: Configuration Popover

**Pattern ID**: PL-Popover-Configuration-2.1

**Purpose**: View and display customization

**Use Cases:**
- Configuring table columns (show/hide)
- Setting filters (2-3 conditions maximum)
- Adjusting display density
- Sorting options
- View preferences

**Content Structure:**
- Configuration header with "Reset" option
- Grouped settings (if multiple categories)
- Toggle or checkbox controls
- Immediate visual feedback in underlying UI

**Interaction Rules:**
- Changes apply immediately (live preview) OR require "Apply" button
- "Reset" returns to default configuration
- Maximum 15 configurable items
- Group related settings under headers

**Size Constraints:**
- Width: 280-360px
- Height: Auto, max 400px before scroll

---

### Type 3: Utility Popover

**Pattern ID**: PL-Popover-Utility-3.1

**Purpose**: Single-file or single-link management without leaving context

**Use Cases:**
- Attaching a file to a row
- Downloading a single attachment
- Updating a link
- Quick file preview
- Progress indicator for uploads

**Content Structure:**
- File name or link preview
- Action affordances (attach, download, remove)
- Progress indicator (for uploads/downloads)
- File metadata (size, type, date)

**Interaction Rules:**
- Single file/link operation only
- Progress shown inline (percentage or loading bar)
- Success/error states clearly indicated
- Auto-dismiss on successful completion OR manual close

**Size Constraints:**
- Width: 280-320px
- Height: Auto, compact (100-200px typical)

---

### Type 4: Drafting Popover

**Pattern ID**: PL-Popover-Drafting-4.1

**Purpose**: Collaborative note-taking and status management

**Use Cases:**
- Managing draft states for multi-owner records
- Collaborative notes (Change Orders, Lien Waivers)
- Status change comments
- Quick annotations
- Multi-page note editing

**Content Structure:**
- Text input area (expandable)
- Pagination controls (if multi-page: "1 of 2")
- Draft state indicator
- Author/timestamp metadata
- Save/Cancel actions

**Interaction Rules:**
- Auto-save to draft state (every 3-5 seconds)
- Pagination for multi-page content
- Character limit indicator (if applicable)
- Supports rich text formatting (bold, italic, lists)
- Clear ownership indication for collaborative contexts

**Size Constraints:**
- Width: 320-400px
- Height: 200-350px (expandable for longer content)

---

## Popover Decision Matrix (Rule 1.13.4)

| Popover Type | Primary Action | Content Complexity | Persistence | Typical Duration |
|--------------|----------------|-------------------|-------------|------------------|
| **Selection** | Multi-select | Medium (searchable list) | Until saved | 10-30 seconds |
| **Configuration** | Adjust settings | Low-Medium (toggles/checkboxes) | Immediate or on Apply | 15-45 seconds |
| **Utility** | File/link action | Low (single item) | Immediate | 5-15 seconds |
| **Drafting** | Text input | Medium (rich text) | Auto-save | 30-120 seconds |

---

## The Role of the Slide-Out (Rule 1.13.5)

**Purpose**: Allow users to engage in significant workflow without losing context of their primary task in the workspace.

### Behavior and Appearance

✅ **Appears from the right edge** of the workspace, partially overlaying the current view  
✅ **Does not overlay** the global header or Assist panel  
✅ **Must have a clear header** with task title and explicit "Close" control  
✅ **Must have a footer** for primary actions (context-dependent)  
✅ **Workspace becomes inert** (dimmed, non-interactive) while slide-out is open  

### Interaction Model

**Non-Blocking (Global)**: The global header and Assist panel remain fully interactive.

**Dismissal**: The slide-out is dismissed via:
- Its "Close" button (X in header)
- Clicking anywhere on the inactive workspace area outside the slide-out
- ESC key

**Layering**: It sits above the workspace (z-30) but below modals (z-50). A modal can be triggered from and appear on top of a slide-out.

---

## Slide-Out Pattern Library (Rule 1.13.6)

### Type 1: Simple Data Entry Slide-Out

**Pattern ID**: PL-Simple-Slide-Out-1.1

**Purpose**: Complex data entry for creating new entities

**Use Cases:**
- "Create New [Entity]" workflows
- Forms with 5-15 fields
- Standard CRUD operations
- Multi-section forms

**Structural Components:**

**Header:**
- Entity type and action title ("Create New Task")
- Utility actions menu (•••) for additional options
- Close button (✕)

**Body:**
- Scrollable content area
- Forms organized in logical sections
- Lists or tabbed content (2-3 tabs maximum)
- Field validation and error states
- Helper text and tooltips

**Footer (Sticky):**
- Secondary action: "Cancel" or "Save as Draft" (left-aligned)
- Primary action: "Create" or "Save" (right-aligned)
- Clear visual hierarchy between actions

**Interaction Rules:**
- Form validation on blur (individual fields)
- Comprehensive validation on submit attempt
- "Unsaved changes" warning on close if form is dirty
- Auto-save to draft (optional, for long forms)
- Footer remains visible while scrolling

**Size:**
- Width: 480-640px (1/3 of typical viewport)
- Expandable to 960px (1/2 viewport) for complex forms

**Implementation Reference:**
- See `/src/app/components/rfis/rfi-create-slideout.tsx` for gold standard implementation
- See [Form Creation Checklist](/guidelines/Form-Creation-Checklist.md) for comprehensive form rules

---

### Type 2: File Management Slide-Out

**Pattern ID**: PL-Simple-Slide-Out-1.2

**Purpose**: Form submission with integrated file upload/management

**Use Cases:**
- Creating entities that require file attachments
- Document upload workflows
- Multi-file management
- Folder/category selection for uploads

**Structural Components:**

**Header:**
- Task title and context
- Utility actions menu (•••)
- Close button (✕)

**Body:**
- Form fields (upper section)
- **Folder Selection Model**: Hierarchical path selector
  - Example: "Computer → Documents → Photos"
  - Example: "Drawings → Formats"
- **Drop-zone Area**: Drag-and-drop file upload region
  - Upload button alternative
  - File type and size requirements
- **File List**: Uploaded/attached files with:
  - File name and icon
  - File size
  - Upload progress bar (active uploads)
  - Remove action per file
- Scrollable body area

**Footer (Sticky):**
- Cancel (left)
- Primary action: "Upload" or "Attach & Save" (right)

**Interaction Rules:**
- Drag-and-drop zone accepts multiple files
- File validation (type, size) before upload begins
- Progress indicators per file (percentage or spinner)
- Folder path shows current selection context
- Can remove files before final submit
- "Attaching..." state disables primary action until complete

**Size:**
- Width: 640-800px (1/2 viewport recommended)
- Height: Full height to accommodate file lists

---

### Type 3: Contextual Deep-Dive Slide-Out

**Pattern ID**: PL-Contextual-View-2.1

**Purpose**: Viewing detailed information or engaging with messages/activity

**Use Cases:**
- Deep-dive into Project Details
- Message threads or conversations
- Activity feeds with rich content
- Reviewing multi-tab detailed views
- Viewing without editing

**Structural Components:**

**Header:**
- Title (entity name or context)
- **Page-level tabs** for secondary navigation
  - Example: "Details" | "Activity" | "Related"
- Utility actions menu (•••)
- Close button (✕)

**Body:**
- Tab content (changes based on active tab)
- **Rich Content Areas:**
  - Activity feeds with avatars and timestamps
  - Message threads
  - Detailed metadata and properties
  - Related items and associations
  - Comments and annotations
- Secondary navigation within tabs
- Scrollable content

**Footer (Sticky):**
- Context-dependent actions
- Common: "Done" or "Close"
- May include quick actions: "Reply", "Comment", etc.

**Interaction Rules:**
- Tabs switch content without closing slide-out
- Activity feeds load incrementally (infinite scroll or pagination)
- Can link out to Full Detail View from slide-out
- "View Full Details" option for complex items
- Read-focused (editing should open different pattern)

**Size:**
- Width: 640-800px (1/2 viewport)
- Can expand to 960-1280px (2/3 viewport) for rich content

---

### Type 4: System Configuration Slide-Out

**Pattern ID**: PL-System-Config-3.1

**Purpose**: Settings, preferences, and system-level configurations

**Use Cases:**
- User preferences and settings
- Notification configurations
- Calendar event settings
- Feature toggles and permissions
- Grouped configuration options

**Structural Components:**

**Header:**
- Configuration context title ("Settings", "Notifications")
- Utility actions menu (•••)
- Close button (✕)

**Body:**
- **Select/Filter Controls**: Dropdowns to filter configuration groups
- **Grouped Configuration Items:**
  - Section headers for logical grouping
  - Toggle switches for on/off settings
  - Dropdowns for multi-option settings
  - Radio buttons for mutually exclusive options
  - Nested groups with expand/collapse
- High-density information display
- Scrollable body area

**Footer (Sticky):**
- "Reset to Defaults" (left, secondary)
- "Cancel" (center-left)
- "Save Settings" (right, primary)

**Interaction Rules:**
- Changes preview in real-time (when possible)
- "Reset to Defaults" prompts confirmation
- Unsaved changes warning on close
- Settings organized in collapsible groups
- Search/filter to find specific settings (for 20+ options)
- Keyboard shortcuts displayed where applicable

**Size:**
- Width: 480-640px (1/3 viewport) for simple configs
- Width: 640-800px (1/2 viewport) for complex configs

---

## Slide-Out Decision Matrix (Rule 1.13.7)

| Slide-Out Type | Primary Purpose | Content Complexity | User Goal | Typical Duration |
|----------------|-----------------|-------------------|-----------|------------------|
| **Simple Data Entry** | Create/Edit | Medium (5-15 fields) | Complete form | 2-5 minutes |
| **File Management** | Upload/Attach | Medium (form + files) | Submit with files | 3-7 minutes |
| **Contextual View** | Review/Explore | High (tabs + rich content) | Understand context | 1-5 minutes |
| **System Config** | Configure/Set | High (grouped settings) | Customize system | 2-10 minutes |

---

## Popover vs. Slide-Out Decision Framework (Rule 1.13.8)

### Choose Popover When:

**Task Granularity**: Seconds to complete
- Quick edits
- Status changes
- Single-field updates
- Viewing small data sets
- Configuration toggles

**Visual Association**: Tethered to a specific UI element
- Action is contextual to a button, row, or field
- Clear "owner" element exists
- Temporary, dismissible interaction

**Content Scope**: Minimal
- 1-4 fields maximum
- Single list (< 20 items)
- Read-only information (< 10 data points)
- No multi-step workflows

### Choose Slide-Out When:

**Task Granularity**: Minutes to complete
- Creating new entities
- Complex forms (5-15 fields)
- Multi-section workflows
- File upload and management
- Reviewing detailed content
- System configuration

**Visual Association**: Related to workspace, not a specific element
- Slides from workspace edge
- Not attached to a single trigger
- Part of larger workflow

**Content Scope**: Significant
- 5-15 form fields
- Multi-tab content
- File management interfaces
- Rich activity feeds
- Grouped configuration options
- Content requiring scrolling

### Guiding Principle

**Popovers are for in-context tasks tethered to a UI element.**

**Slide-Outs are for sub-tasks that are part of a larger workflow.**

**Rule of Thumb:**
- If the task requires more than 30 seconds → Use **Slide-Out**
- If the task takes the user away from their immediate context → Use **Slide-Out**
- If the task involves complex data entry → Use **Slide-Out**
- If the task is quick, contextual to a specific element, and completes in seconds → Use **Popover**

---

## Engineering Implementation Notes (Rule 1.13.9)

### Popover Variants

All popover types share:
- Common dismissal logic (click outside, ESC key)
- Smart positioning (flip if viewport constrained)
- Keyboard navigation support (Tab, Arrow keys, ESC)
- ARIA roles and labels
- Non-blocking interaction model

**Variant-specific attributes stored in component props:**
```tsx
interface PopoverProps {
  variant: 'selection' | 'configuration' | 'utility' | 'drafting'
  maxHeight?: number // Default: 400px
  width?: number // 280-400px based on variant
  searchable?: boolean // For selection/configuration with 8+ items
  // ... other props
}
```

### Slide-Out Variants

All slide-out types share:
- Slide-in animation from right (300ms ease-out)
- Sticky header and footer
- Scrollable body
- Workspace inert state while open
- Close confirmation if dirty state
- Utility actions menu pattern

**Variant-specific attributes:**
```tsx
interface SlideOutProps {
  variant: 'dataEntry' | 'fileManagement' | 'contextualView' | 'systemConfig'
  width: '1/3' | '1/2' | '2/3' // Viewport percentage
  expandable?: boolean
  tabs?: TabConfig[] // For contextual view
  stickyFooter?: boolean // Default true
  // ... other props
}
```

### Shared Slide-Out Component Reference

Use the base `SlideOut` component from `/src/app/components/shared/slide-out.tsx`:

```tsx
import { SlideOut } from '@/app/components/shared/slide-out'

<SlideOut
  isOpen={isOpen}
  onClose={onClose}
  title="Create New RFI"
  width="1/2"
  variant="dataEntry"
>
  {/* Your content here */}
</SlideOut>
```

---

## Validation Checklist (Rule 1.13.10)

### Popover Implementation Checklist

**Before declaring a popover complete:**

- [ ] Visually tethered to trigger element
- [ ] Opens immediately on click (no delay)
- [ ] No scrim (underlying UI visible)
- [ ] Underlying UI is inert (non-interactive)
- [ ] Dismisses on click outside
- [ ] Dismisses on ESC key
- [ ] Smart positioning (flips if constrained)
- [ ] Correct width for variant (280-400px)
- [ ] Max height respected (400px before scroll)
- [ ] ARIA labels and roles present
- [ ] Keyboard navigation support

### Slide-Out Implementation Checklist

**Before declaring a slide-out complete:**

- [ ] Slides from right edge of workspace
- [ ] Does NOT overlay global header
- [ ] Does NOT overlay Assist panel
- [ ] Workspace shows scrim (bg-white/30)
- [ ] Workspace becomes inert (non-interactive)
- [ ] Header present with title and close button
- [ ] Body is scrollable
- [ ] Footer is sticky (remains visible while scrolling)
- [ ] Slide-in animation (300ms ease-out)
- [ ] Dismisses on close button click
- [ ] Dismisses on workspace click (outside slide-out)
- [ ] Dismisses on ESC key
- [ ] Unsaved changes warning (if dirty)
- [ ] Correct width for variant (480-1280px)
- [ ] Z-index: z-30

---

## Red Flags - Never Do These (Rule 1.13.11)

### Popover Red Flags

- ⛔ Using a scrim with popovers (only slide-outs and modals use scrims)
- ⛔ Creating popovers that are not tethered to a trigger element
- ⛔ Building popovers wider than 400px (use slide-out instead)
- ⛔ Putting complex forms (5+ fields) in popovers (use slide-out)
- ⛔ Forgetting smart positioning (popovers should flip if constrained)
- ⛔ Missing dismissal logic (click outside, ESC key)
- ⛔ Not making underlying UI inert while popover is open

### Slide-Out Red Flags

- ⛔ Overlaying global header (slide-out must stay below header)
- ⛔ Overlaying Assist panel (slide-out must stay within workspace bounds)
- ⛔ Using wrong scrim color (must be bg-white/30, not bg-black)
- ⛔ Using wrong z-index (must be z-30, not z-20 or z-40)
- ⛔ Forgetting sticky footer (footer must remain visible while scrolling)
- ⛔ Missing close button in header
- ⛔ Missing workspace inert state (workspace must be non-interactive)
- ⛔ Building slide-outs narrower than 480px (use popover instead)
- ⛔ Forgetting slide-in animation (300ms ease-out from right)

---
# Design System Token Reference

## Foreground Color Tokens
Text colors that automatically adapt to light/dark mode.

| Token | Tailwind Class | Light Mode | Dark Mode | Usage |
|-------|---------------|------------|-----------|-------|
| --foreground-primary | text-foreground-primary | #1D1D1D | #FFFFFF | Primary text, headings |
| --foreground-secondary | text-foreground-secondary | #5A5A5A | #C2C2C2 | Secondary text, descriptions |
| --foreground-tertiary | text-foreground-tertiary | #707070 | #949494 | Tertiary text, metadata |
| --foreground-disabled | text-foreground-disabled | #949494 | #707070 | Disabled text, placeholders |
| --foreground-inverse | text-foreground-inverse | #FFFFFF | #1D1D1D | Text on colored backgrounds |
| --foreground-active | text-foreground-active | #1D1D1D | #FFFFFF | Active text, selected items |
| --foreground-active-hover | text-foreground-active-hover | #3F3F3F | #C2C2C2 | Active hover text |
| --foreground-danger | text-foreground-danger | #F13A40 | #FA6868 | Error text, validation messages |

## Background Color Tokens
Background colors that automatically adapt to light/dark mode.

| Token | Tailwind Class | Light Mode | Dark Mode | Usage |
|-------|---------------|------------|-----------|-------|
| --background-primary | bg-background-primary | #FFFFFF | #111111 | Cards, panels, **page + table chrome** (see `app/legacy-theme.css` §02) |
| --background-secondary | bg-background-secondary | #F5F5F5 | #2D2D2D | Workspace canvas, row hover/zebra, cancel buttons, muted strips |
| --background-tertiary | bg-background-tertiary | #E7E7E7 | #3F3F3F | Inset toolbars, tertiary chrome |

## Border Color Tokens
Border colors for different states that adapt to light/dark mode.

| Token | Tailwind Class | Light Mode | Dark Mode | Usage |
|-------|---------------|------------|-----------|-------|
| --border-default | border-border-default | #D5D5D5 | #3F3F3F | Default borders, dividers |
| --border-hover | border-border-hover | #1D1D1D | #FFFFFF | Hover state borders |
| --border-focus | border-border-focus | #1D1D1D | #FFFFFF | Focus state borders, inputs |
| --border-active | border-border-active | #1D1D1D | #FFFFFF | Active state borders |
| --border-danger | border-border-danger | #F13A3D | #D62427 | Error state borders |
| --border-inactive | border-border-inactive | #D5D5D5 | #2D2D2D | Inactive state borders |

## Grayscale (Asphalt) Tokens

| Token | Hex Value | Usage |
|-------|-----------|-------|
| --asphalt-25 | #FCFCFC | Subtle backgrounds |
| --asphalt-50 | #F5F5F5 | Secondary backgrounds |
| --asphalt-100 | #E7E7E7 | Tertiary backgrounds |
| --asphalt-200 | #D5D5D5 | Borders, dividers |
| --asphalt-300 | #C2C2C2 | Subtle borders |
| --asphalt-400 | #949494 | Disabled text |
| --asphalt-500 | #707070 | Tertiary text |
| --asphalt-600 | #5A5A5A | Secondary text |
| --asphalt-700 | #3F3F3F | Dark backgrounds |
| --asphalt-800 | #2D2D2D | Dark backgrounds |
| --asphalt-900 | #1D1D1D | Primary text (dark mode) |
| --asphalt-950 | #111111 | Maximum contrast |

## Semantic Color Tokens

### Success Colors
| Token | Hex Value | Usage |
|-------|-----------|-------|
| --success-25 | #EFFCED | Success backgrounds, alerts |
| --success-400 | #488C42 | Success icons, indicators |
| --success-800 | #1B5319 | Success badges, dark text |

### Attention/Warning Colors
| Token | Hex Value | Usage |
|-------|-----------|-------|
| --attention-25 | #FFF6E8 | Warning backgrounds, alerts |
| --attention-50 | #FFEDD1 | Warning backgrounds (alternative) |
| --attention-700 | #B87C25 | Warning badges, buttons |
| --attention-900 | #6F480D | Warning dark text |

### Danger Colors
| Token | Hex Value | Usage |
|-------|-----------|-------|
| --danger-25 | #FFF0F0 | Error backgrounds, alerts |
| --danger-50 | #FDE3E3 | Error backgrounds (alternative) |
| --danger-400 | #F96668 | Error text (dark mode) |
| --danger-500 | #F13A3D | Error text (light mode), danger borders |
| --danger-600 | #D62427 | Danger badges, critical actions |
| --danger-800 | #91191B | Danger dark text |

### Informative Colors
| Token | Hex Value | Usage |
|-------|-----------|-------|
| --informative-25 | #F3F7FC | Info backgrounds, alerts |
| --informative-50 | #E1EEFF | Info backgrounds (alternative) |
| --informative-600 | #4878CA | Info badges, links |
| --informative-800 | #26406F | Info dark text |

## Brand Color Tokens

### Core Brand Colors
| Token | Tailwind Class | Hex Value | Usage |
|-------|---------------|-----------|-------|
| --core-orange | bg-core-orange | #FF5200 | Reserved brand accent (use only when specified) |
| --helix-500 | bg-helix-500 | #FF5200 | Helix variant, primary CTAs |
| --helix-600 | bg-helix-600 | #CB4100 | Helix dark variant, hover states |

### Brand Palette (Charts & Avatars)
| Token | Hex Value | Usage |
|-------|-----------|-------|
| --brand-tractor | #5E7677 | Chart color 1, avatar backgrounds |
| --brand-stone | #ECE0D6 | Chart color 2, avatar backgrounds |
| --brand-lumber | #CEC4A1 | Chart color 3, avatar backgrounds |
| --brand-earth | #8D6E5B | Chart color 4, avatar backgrounds |
| --brand-metal | #566578 | Chart color 5, avatar backgrounds |

## Typography Tokens

### Font Families
| Token | CSS Variable | Tailwind Class |
|-------|-------------|---------------|
| --font-inter | --font-inter | font-sans |
| --font-geist-mono | --font-geist-mono | font-mono |

### Display Typography
| Token | Font Size | Line Height | Font Weight | Tailwind Class |
|-------|-----------|-------------|-------------|---------------|
| typography.display.extraLarge | 3.75rem (60px) | 1rem | 700 (Bold) | text-6xl font-bold |
| typography.display.large | 3rem (48px) | 1rem | 700 (Bold) | text-5xl font-bold |

### Heading Typography
| Token | Font Size | Line Height | Font Weight | Tailwind Class |
|-------|-----------|-------------|-------------|---------------|
| typography.heading.h1 | 2.25rem (36px) | 2.5rem (40px) | 700 (Bold) | text-4xl font-bold |
| typography.heading.h2 | 1.875rem (30px) | 2.25rem (36px) | 700 (Bold) | text-3xl font-bold |
| typography.heading.h3 | 1.5rem (24px) | 2rem (32px) | 700 (Bold) | text-2xl font-bold |
| typography.heading.h4 | 1.25rem (20px) | 1.75rem (28px) | 700 (Bold) | text-xl font-bold |

### Body Typography
| Token | Font Size | Line Height | Font Weight | Tailwind Class |
|-------|-----------|-------------|-------------|---------------|
| typography.body.large | 1.125rem (18px) | 1.75rem (28px) | 400 (Normal) | text-lg font-normal |
| typography.body.base | 1rem (16px) | 1.5rem (24px) | 400 (Normal) | text-base font-normal |
| typography.body.small | 0.875rem (14px) | 1.25rem (20px) | 400 (Normal) | text-sm font-normal |
| typography.body.tiny | 0.75rem (12px) | 1rem (16px) | 400 (Normal) | text-xs font-normal |

### Label Typography
| Token | Font Size | Line Height | Font Weight | Tailwind Class |
|-------|-----------|-------------|-------------|---------------|
| typography.label.large | 1.125rem (18px) | 1.75rem (28px) | 500 (Medium) | text-lg font-medium |
| typography.label.base | 1rem (16px) | 1.5rem (24px) | 500 (Medium) | text-base font-medium |
| typography.label.small | 0.875rem (14px) | 1.25rem (20px) | 500 (Medium) | text-sm font-medium |
| typography.label.tiny | 0.75rem (12px) | 1rem (16px) | 500 (Medium) | text-xs font-medium |

## Spacing Tokens
Consistent spacing scale based on 8px base unit.

| Token | Value | Tailwind Classes | Usage |
|-------|-------|-----------------|-------|
| spacing.xs | 4px | p-1, m-1, gap-1 | Tight spacing, icons |
| spacing.s | 6px | p-1.5, m-1.5, gap-1.5 | Small spacing |
| spacing.base | 8px | p-2, m-2, gap-2 | Base spacing unit |
| spacing.lg | 12px | p-3, m-3, gap-3 | Medium spacing |
| spacing.xl | 16px | p-4, m-4, gap-4 | Standard spacing |
| spacing.2xl | 24px | p-6, m-6, gap-6 | Large spacing |
| spacing.3xl | 32px | p-8, m-8, gap-8 | Extra large spacing |
| spacing.4xl | 40px | p-10, m-10, gap-10 | Section spacing |
| spacing.5xl | 48px | p-12, m-12, gap-12 | Page spacing |
| spacing.6xl | 64px | p-16, m-16, gap-16 | Maximum spacing |

## Border Radius Tokens

| Token | Value | Tailwind Class | Usage |
|-------|-------|---------------|-------|
| --radius-sm | 2px | rounded-sm | Small radius, badges |
| --radius-md | 4px | rounded-md | Medium radius, buttons |
| --radius-lg | 8px | rounded-lg | Large radius, cards |
| --radius-xl | 12px | rounded-xl | Extra large radius, modals |
| --radius-2xl | 16px | rounded-2xl | 2XL radius, large cards |
| --radius-3xl | 24px | rounded-3xl | 3XL radius, hero sections |
| --radius-full | 9999px | rounded-full | Full circle, avatars |

## Elevation (Shadow) Tokens

| Token | Tailwind Class | Usage |
|-------|---------------|-------|
| elevation.none | shadow-none | No elevation - flat surfaces |
| elevation.xs | shadow-xs | Minimal elevation - buttons, inputs |
| elevation.sm | shadow-sm | Small elevation - cards, panels |
| elevation.md | shadow-md | Medium elevation - dropdowns, popovers |
| elevation.lg | shadow-lg | Large elevation - modals, dialogs |
| elevation.xl | shadow-xl | Extra large elevation - floating menus |
| elevation.2xl | shadow-2xl | Maximum elevation - top-level overlays |
| elevation.card | shadow-card | Card-specific elevation |

## Badge Tokens

| Token | Tailwind Class | Light Mode | Dark Mode | Usage |
|-------|---------------|------------|-----------|-------|
| --badge-primary-bg | bg-badge-primary-bg | #000000 | #000000 | Primary badge background |
| --badge-primary-text | text-badge-primary-text | #ffffff | #ffffff | Primary badge text |
| --badge-secondary-bg | bg-badge-secondary-bg | #ECE0D6 | #2F2F2F | Secondary badge background |
| --badge-secondary-text | text-badge-secondary-text | #1D1D1D | #FFFFFF | Secondary badge text |
| --badge-information-bg | bg-badge-information-bg | #4878CA | #4878CA | Information badge background |
| --badge-information-text | text-badge-information-text | #ffffff | #ffffff | Information badge text |
| --badge-success-bg | bg-badge-success-bg | #1B5319 | #1B5319 | Success badge background |
| --badge-success-text | text-badge-success-text | #ffffff | #ffffff | Success badge text |
| --badge-critical-bg | bg-badge-critical-bg | #D62427 | #D62427 | Critical badge background |
| --badge-critical-text | text-badge-critical-text | #ffffff | #ffffff | Critical badge text |
| --badge-warning-bg | bg-badge-warning-bg | #B87C25 | #B87C25 | Warning badge background |
| --badge-warning-text | text-badge-warning-text | #ffffff | #ffffff | Warning badge text |

## Chart Color Tokens

| Token | Mapped To | Hex Value | Usage |
|-------|-----------|-----------|-------|
| --chart-1 | --brand-tractor | #5E7677 | Chart series 1 |
| --chart-2 | --brand-stone | #ECE0D6 | Chart series 2 |
| --chart-3 | --brand-lumber | #CEC4A1 | Chart series 3 |
| --chart-4 | --brand-earth | #8D6E5B | Chart series 4 |
| --chart-5 | --brand-metal | #566578 | Chart series 5 |
| --chart-6 | --pilot-700 | #2C645E | Chart series 6 |
| --chart-7 | --beta-700 | #963E7C | Chart series 7 |

---

## Chart Building Guidelines

### Donut Chart Architecture (Rule 1.11)

**Purpose**: Donut charts display proportional data with a center hole for value/label display using Recharts library.

#### **Critical Rule: Use Flexbox Overlay for Center Labels**

⚠️ **NEVER use SVG `<text>` elements with `dy` offsets for center content** - they cause overlap issues and are difficult to maintain.

✅ **ALWAYS use absolute positioned flexbox overlay** - provides precise control and prevents overlap.

#### **Component Architecture**

```tsx
export function DonutChartCard({ centerValue, centerLabel, data }: Props) {
  return (
    <div className="h-full p-6">
      <div className="relative h-full">
        {/* Background Layer: Chart with Legend */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"     // 60% creates adequate center space
              outerRadius="78%"     // 78% keeps ring visible and readable
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={50}              // Reserves 50px at bottom
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Foreground Layer: Center Label Overlay */}
        {(centerValue || centerLabel) && (
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ paddingBottom: '50px' }} // Account for legend height
          >
            <div className="flex flex-col items-center gap-1">
              {centerValue && (
                <span className="text-3xl font-bold text-foreground-primary">
                  {centerValue}
                </span>
              )}
              {centerLabel && (
                <span className="text-xs text-foreground-secondary">
                  {centerLabel}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

#### **Key Specifications**

| Element | Value | Reasoning |
|---------|-------|-----------|
| **innerRadius** | `60%` | Creates adequate center hole for text without overlap |
| **outerRadius** | `78%` | Ring remains visible and readable while maximizing space |
| **Legend height** | `50px` | Reserves bottom space for legend items |
| **Center overlay paddingBottom** | `50px` | Compensates for legend offset to center text on donut visual center |
| **Center value font** | `text-3xl font-bold` | 32px, bold - prominent primary metric |
| **Center label font** | `text-xs` | 12px - secondary descriptor text |
| **Flexbox gap** | `gap-1` | 4px between value and label (precise control) |

#### **Why Flexbox Overlay Works**

**Problem with SVG Text + dy Offsets:**
```tsx
❌ WRONG APPROACH:
<text y="50%" dy="-10">128</text>      // Hard to calculate
<text y="50%" dy="14">Projects</text>  // Overlaps with ring
// Issues: Math-heavy, overlap prone, no design system tokens
```

**Solution with Flexbox Overlay:**
```tsx
✅ CORRECT APPROACH:
<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
  <div className="flex flex-col items-center gap-1">
    <span className="text-3xl font-bold">128</span>
    <span className="text-xs">Projects</span>
  </div>
</div>
// Benefits: No math, design tokens, no overlap, maintainable
```

#### **Layering Strategy**

```
┌──────────────────────────────────���──────┐
│  Foreground: Absolute Flexbox Overlay   │  ← z-index higher
│  (pointer-events-none for click-through)│
│                                         │
│  ┌─────────────────────┐               │
│  │   Center Content    │               │
│  │  Value + Label      │               │
│  └─────────────────────┘               │
├─��───────────────────────────────────────┤
│  Background: ResponsiveContainer        │  ← Base layer
│  ╱────────────────────╲                │
│ │   Donut Ring         │               │
│  ╲────────────────────╱                │
│  [Legend Below]                         │
└─────────────────────────────────────────┘
```

#### **Advantages of This Approach**

| Benefit | Description |
|---------|-------------|
| ✅ **No Overlap** | Flexbox naturally prevents content from touching ring |
| ✅ **Design System Compliance** | Uses Tailwind classes and semantic tokens |
| ✅ **Precise Spacing** | `gap-1`, `gap-2` instead of `dy="14"` magic numbers |
| ✅ **Maintainable** | Standard flexbox patterns everyone understands |
| ✅ **Responsive** | Text adapts naturally to container size |
| ✅ **Typography Control** | Proper font rendering with design system tokens |
| ✅ **Click-Through** | `pointer-events-none` allows chart interaction |

#### **Legend Offset Compensation**

The legend reserves 50px at the bottom, which shifts the visual center of the donut upward. The overlay compensates with `paddingBottom: '50px'` to align center text with the donut's visual center.

**Without Compensation:**
```
     ╱──────╲
    │  128   │  ← Too low (aligned to geometric center)
    │Projects│
     ╲──────╱
[Legend]
```

**With Compensation:**
```
     ╱──────╲
    │  128   │  ← Perfectly centered on donut visual center
    │Projects│
     ╲──────╱
     
[Legend]
```

#### **Implementation Checklist**

- [ ] Use `relative` container for layering
- [ ] Chart layer uses `ResponsiveContainer` at 100% width/height
- [ ] `innerRadius="60%"` and `outerRadius="78%"` for optimal proportions
- [ ] Legend set to `verticalAlign="bottom"` with `height={50}`
- [ ] Overlay uses `absolute inset-0` positioning
- [ ] Overlay has `flex items-center justify-center` for centering
- [ ] Overlay includes `pointer-events-none` for click-through
- [ ] Overlay has `paddingBottom: '50px'` to account for legend
- [ ] Center content uses `flex flex-col items-center gap-1`
- [ ] Value uses `text-3xl font-bold text-foreground-primary`
- [ ] Label uses `text-xs text-foreground-secondary`
- [ ] Conditional rendering: only show overlay if centerValue or centerLabel exist

#### **Red Flags - Never Do These**

- ⛔ Don't use SVG `<text>` elements with `dy` offsets for center content
- ⛔ Don't use `innerRadius` below 55% (too small, causes overlap)
- ⛔ Don't use `innerRadius` above 70% (ring too thin, hard to read)
- ⛔ Don't forget `pointer-events-none` on overlay (blocks chart interaction)
- ⛔ Don't forget `paddingBottom: '50px'` on overlay (misaligned center)
- ⛔ Don't use magic number spacing (use Tailwind gap utilities)
- ⛔ Don't use hardcoded colors (use semantic tokens)

---

## Avatar Tokens

| Token | Tailwind Class | Hex Value | Usage |
|-------|---------------|-----------|-------|
| --avatar-text-dark | text-avatar-text-dark | #1D1D1D | Dark text on light backgrounds |
| --avatar-text-light | text-avatar-text-light | #FCFCFC | Light text on dark backgrounds |

---

## Best Practices

* Always use design tokens instead of hard-coded values
* Use TypeScript helpers for type safety and autocomplete
* Prefer semantic tokens over raw colors (e.g., bg-background-primary not bg-white)
* Combine tokens using the cn utility function
* Test in both light and dark mode to ensure proper contrast
* Use appropriate spacing scale for consistent layouts
* Follow component patterns for consistent UI elements
* Respect z-index hierarchy when layering components

---
## Pre-generation Final Check List
Before Generating Frame
Foundation & Reference:

 TEMPLATE HOME frame referenced (not recreating shell)
 Frame type identified (Home View, Anchor View, Detail View, Settings, Unified Viewer)
 Pattern confirmed (1, 2, 3, or 4)
 Target dimensions correct (1440 × 844px for workspace, 1440 × 900px for Unified Viewer)

Token Compliance:

 Using semantic tokens (not hex values)
 Token names correct (not invented)
 Dark theme only for sidebar (and Unified Viewer header if dark needed)
 All token references valid from token list

Architecture Compliance:

 Pane count ≤ 2 in workspace
 Content types in correct panes (Grid left, Context right)
 Split ratios exact (33/67 or 67/33, not approximated)
 Z-index layer appropriate for view type

Spacing Compliance:

 All spacing follows 8px grid
 Component heights correct (header 56px, toolbar 56px, etc.)
 Padding consistent (cards p-6, buttons px-4 py-2)
 Gaps appropriate (gap-4, gap-6, gap-8)

Pattern Compliance:

 Pattern selection appropriate for use case
 Save workflow matches pattern (manual vs autosave)
 Pattern-specific elements present (e.g., dirty indicators for Pattern 1)

Content Quality:

 Using Skyline Tower Project data (or specified project)
 Realistic and varied data shown
 Construction terminology accurate
 Multiple states demonstrated where applicable

Documentation:

 Annotations explain frame purpose
 Key measurements labeled
 Token names shown on components
 Pattern reference clear


🚨 Critical Mistakes Reference
Top 15 Mistakes to Avoid

❌ Recreating shell components instead of referencing TEMPLATE HOME
❌ Using hex values (#FFFFFF) instead of semantic tokens (bg-background-primary)
❌ Wrong split ratios (40/60, 50/50) instead of exact 33/67 or 67/33
❌ Confusing Pattern 1 (33/67) with Pattern 4 (67/33)
❌ Adding Save/Cancel to Pattern 3 (Slide-Out uses autosave, NO Save buttons)
❌ Using dark theme in Unified Viewer (should be LIGHT theme)
❌ Overlaying Docked Panels instead of resizing Viewable Area in Unified Viewer
❌ Grid content in Right Pane (Grid Content must be in Left Pane only)
❌ Slide-Out covering Assist (Slide-Out must stay within workspace bounds)
❌ No annotations on generated frames
❌ Inconsistent spacing (not following 8px grid)
❌ Missing active state on clicked Anchor View row (must show bg-asphalt-100)
❌ Wrong z-index values (using old values instead of updated: z-0, z-10, z-20, z-30, z-50, z-80)
❌ Scrim on wrong layer (Slide-Out scrim on workspace only, Modal scrim on entire app)
❌ No dirty state indicators in manual save workflows (Pattern 1, Settings)


📚 TEMPLATE HOME Quick Reference
Internal Frame Names:

TEMPLATE HOME → Foundation reference (Section 1: Shell closed, Section 2: Shell open, Section 3: Component specs, Section 4: Assist panel, Section 5: Spacing system)
Pattern-1-Split-View → 33/67 review/edit example
Pattern-2-Full-Workspace → 100% single pane example
Pattern-3-Slide-Out → Autosave create example
Pattern-4-Context-Shift → 67/33 context example
Home-View-Dashboard → Dashboard page template
Anchor-View-Submittals → Grid list with split-view
Detail-View-Project → Detail page with context shift
Settings-View-Profile → Settings with internal nav
Unified-Viewer-Basic → Minimal viewer (no panels)
Unified-Viewer-With-Panels → Docked panels example


✅ CHECKLIST COMPLETE
✅ Ready to generate design frame
✅ Will validate against this checklist after generation

---
