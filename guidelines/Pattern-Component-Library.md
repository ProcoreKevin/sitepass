# Pattern Component Library - Scalable Pattern Enforcement

**Last Updated**: Current  
**Purpose**: BASE pattern components for tools to IMPORT and EXTEND  
**Critical Rule**: Tools import and extend patterns, they do NOT create their own versions

> **Document Role:** This is the component governance reference for the NGX Design System. It is one of three complementary enforcement documents:
> - **[Interaction-Model-Architecture.md](/guidelines/Interaction-Model-Architecture.md)** — Workspace architecture, layout rules, shell dimensions, and canonical z-index hierarchy
> - **[Guidelines.md](/guidelines/Guidelines.md)** — Master rulebook with pre-implementation checklists and all numbered rules. Rule 0.4 governs the Import & Extend mandate defined in this document.
> - **This document** — Base React component API, usage examples, and anti-patterns
>
> **Before using any component in this library, read the Pre-Implementation Checklist in Guidelines.md.**

---

## 🎯 Core Principle: Import & Extend, Don't Duplicate (≡ Guidelines Rule 0.4)

**SCALABILITY RULE**: Each pattern component is a BASE implementation. Tools customize by:
1. Importing the base component
2. Adding tool-specific features via props or children
3. NEVER duplicating the base implementation in tool folders

> This principle is the component-level enforcement of **Guidelines.md Rule 0.4 (Pattern Component Reusability)**. If there is ever a conflict between guidance in this document and Rule 0.4 in Guidelines.md, Guidelines.md takes precedence.

**Why This Matters**:
- ✅ Single source of truth prevents pattern drift
- ✅ Updates to patterns automatically apply to all tools
- ✅ Reduces code duplication (~300+ lines per tool)
- ✅ Faster development (import vs build from scratch)
- ✅ Easier maintenance (fix once, fixes everywhere)

---

## 📚 Pattern Component Inventory

All pattern components located in: `/src/app/components/shared/patterns/`

| Component | Purpose | Gold Standard | Status |
|-----------|---------|---------------|--------|
| **TableActionRow** | Tabs + controls above tables | RFI table | ✅ Base + Example |
| **TableRow / TableCell** | Enforces active state styling | RFI table | ✅ Base Ready |
| **SplitViewHeader** | Detail pane headers | RFI detail | ✅ Base Ready |
| **SplitViewDetail** | Complete split-view detail anatomy | RFI detail | ✅ Base Ready |
| **ManualSaveFooter** | Save workflow footers | RFI detail | ✅ Base Ready |
| **FixedActionFooter** | Sticky action footer | Generic | ✅ Base Ready |
| **StatusBadge** | Draft status indicators | Draft flow | ✅ Base Ready |
| **DraftManager** | Draft creation & sync logic | Draft flow | 🚧 Planned |

---

## 🔧 Component Details

### **1. TableActionRow Component**

**Gold Standard**: RFI table (`/src/app/components/rfis/table-action-row.tsx`)

**Purpose**: Provides tabs for filtering + customizable controls slot above table

**Base Component** (`/shared/patterns/table-action-row.tsx`):
```tsx
interface TableActionTab {
  id: string
  label: string
  count?: number
}

interface TableActionRowProps {
  tabs: TableActionTab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  isSplitViewOpen?: boolean
  hideControlsWhenSplit?: boolean
  children?: ReactNode  // Custom controls slot
}
```

**Locked Styling (Non-Customizable)**:
- Container: `px-4 py-3 border-b border-border-default bg-background-primary`
- Tab active: `bg-background-tertiary text-foreground-primary`
- Tab inactive: `text-foreground-secondary hover:text-foreground-primary`
- Controls hidden when `isSplitViewOpen && hideControlsWhenSplit`

**✅ CORRECT Usage - Import and Extend**:
```tsx
import { TableActionRow } from '@/app/components/shared/patterns'

function MyToolPage() {
  return (
    <TableActionRow
      tabs={[
        { id: 'all', label: 'All', count: 24 },
        { id: 'open', label: 'Open', count: 12 }
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      isSplitViewOpen={isSplitViewOpen}
    >
      {/* Add tool-specific controls as children */}
      <SearchInput />
      <FilterButton />
      <SortButton />
    </TableActionRow>
  )
}
```

**✅ CORRECT Usage - Wrapper with Local State**:
```tsx
import { TableActionRow as BaseTableActionRow } from '@/app/components/shared/patterns'

export function MyToolActionRow({ activeTab, onTabChange, isSplitViewOpen }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [savedViews, setSavedViews] = useState([])

  return (
    <BaseTableActionRow
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={onTabChange}
      isSplitViewOpen={isSplitViewOpen}
    >
      <ConfigureViewsButton onSave={handleSaveView} />
      <SearchInput value={searchQuery} onChange={setSearchQuery} />
      <FilterButton onApply={handleFilter} />
    </BaseTableActionRow>
  )
}
```

**⛔ WRONG - Creating Tool-Specific Duplicate**:
```tsx
// ❌ DON'T create /my-tool/table-action-row.tsx
// ❌ DON'T copy-paste base component code
// ❌ DON'T bypass shared pattern

// This creates pattern drift and maintenance burden!
```

**Reference Implementation**:
See `/src/app/components/rfis/table-action-row.tsx` for complete example of how to extend base component.

---

### **2. TableRow & TableCell Components**

**Gold Standard**: RFI table (`/src/app/components/rfis/rfi-table.tsx`)

**Purpose**: Enforces consistent table row styling with correct active state

**Critical Specification**:
- **Active state**: `bg-asphalt-100` (neutral gray, NO borders)
- **Selected state**: `bg-background-tertiary` (checkbox multi-select)
- **Hover state**: `bg-background-secondary`
- **Reference**: TABLE_SPLIT_VIEW_SPEC.md line 709

**Base Components** (`/shared/patterns/table-row.tsx`):
```tsx
interface TableRowProps {
  children: ReactNode
  isActive?: boolean      // Row clicked to open detail pane
  isSelected?: boolean    // Row checkbox selected
  onClick?: () => void
  className?: string
}

interface TableCellProps {
  children: ReactNode
  width?: string         // e.g., 'w-32', 'w-48', 'flex-1'
  className?: string
}
```

**Locked Styling**:
- Row base: `flex items-center gap-0 min-w-max`
- Row hover: `hover:bg-background-secondary`
- Row selected: `bg-background-tertiary`
- Row active: `bg-asphalt-100` (NO orange border!)
- Cell padding: `px-3 py-3`
- Cell border: `border-r border-border-default`

**✅ CORRECT Usage**:
```tsx
import { TableRow, TableCell } from '@/app/components/shared/patterns'

{data.map((item) => {
  const isActive = selectedId === item.id
  const isSelected = selectedRows.includes(item.id)
  
  return (
    <TableRow
      key={item.id}
      isActive={isActive}
      isSelected={isSelected}
      onClick={() => handleRowClick(item)}
    >
      <TableCell width="w-12">
        <Checkbox checked={isSelected} />
      </TableCell>
      <TableCell width="w-48">
        <span className="text-sm font-medium">{item.title}</span>
      </TableCell>
      <TableCell width="w-32">
        <StatusBadge status={item.status} />
      </TableCell>
    </TableRow>
  )
})}
```

**⛔ WRONG - Incorrect Active State**:
```tsx
// ❌ WRONG: Adding orange border
<div className={cn(
  'flex items-center',
  isActive && 'bg-background-tertiary border-l-4 border-core-orange'
)}>

// ✅ CORRECT: Use TableRow pattern
<TableRow isActive={isActive}>
  {/* Automatically applies bg-asphalt-100 */}
</TableRow>
```

---

### **3. SplitViewHeader Component**

**Gold Standard**: RFI detail pane header

**Purpose**: Consistent header for detail panes in split-view layouts

**Base Component** (`/shared/patterns/split-view-header.tsx`):
```tsx
interface SplitViewHeaderTab {
  id: string
  label: string
  isActive: boolean
  onClick: () => void
}

interface SplitViewHeaderProps {
  title: string | ReactNode
  subtitle?: string | ReactNode
  titleRow?: ReactNode          // Custom title row content
  navigationRow?: ReactNode      // Breadcrumbs, back button
  utilityButtons?: ReactNode     // Edit, Delete, More menu
  tabs?: SplitViewHeaderTab[]   // Tabs (e.g., Details, Activity)
  isEditMode?: boolean
  onFieldChange?: (value: string) => void
}
```

**Locked Styling**:
- Container: `bg-background-primary border-b border-border-default`
- Title row: `px-6 py-4 flex items-start justify-between`
- Tab active: Bottom border indicator `h-0.5 bg-foreground-primary`
- Tab inactive: `text-foreground-secondary hover:text-foreground-primary`

**✅ CORRECT Usage**:
```tsx
import { SplitViewHeader } from '@/app/components/shared/patterns'

<SplitViewHeader
  title="RFI-001: Structural Steel Submittal"
  subtitle="Created by John Smith • 2 days ago"
  navigationRow={
    <button onClick={handleBack}>← Back to RFIs</button>
  }
  utilityButtons={
    <>
      <button>Edit</button>
      <button>Delete</button>
      <button>More</button>
    </>
  }
  tabs={[
    { id: 'details', label: 'Details', isActive: true, onClick: () => {} },
    { id: 'activity', label: 'Activity', isActive: false, onClick: () => {} }
  ]}
/>
```

---

### **4. ManualSaveFooter & FixedActionFooter Components**

**Gold Standard**: RFI detail pane (Pattern 1 save workflow)

**Purpose**: Enforces manual save workflow for edit modes

**Base Components** (`/shared/patterns/manual-save-footer.tsx`):
```tsx
interface ManualSaveFooterProps {
  isDirty: boolean              // Show footer only when dirty
  onSave: () => void
  onCancel: () => void
  isSaving?: boolean
  saveLabel?: string            // Default: "Save Changes"
  cancelLabel?: string          // Default: "Cancel"
}

interface FixedActionFooterProps {
  children: ReactNode
  className?: string
}
```

**Locked Styling**:
- Container: `fixed bottom-0 left-0 right-0 z-10`
- Background: `bg-background-primary border-t border-border-default shadow-lg`
- Padding: `px-6 py-4`
- Save button: `bg-asphalt-950 text-white`
- Cancel button: `bg-background-secondary text-foreground-primary`

**✅ CORRECT Usage - ManualSaveFooter**:
```tsx
import { ManualSaveFooter } from '@/app/components/shared/patterns'

function MyDetailView() {
  const [isDirty, setIsDirty] = useState(false)
  
  return (
    <>
      <form onChange={() => setIsDirty(true)}>
        {/* Form fields */}
      </form>
      
      <ManualSaveFooter
        isDirty={isDirty}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
      />
    </>
  )
}
```

**✅ CORRECT Usage - FixedActionFooter (Custom)**:
```tsx
import { FixedActionFooter } from '@/app/components/shared/patterns'

<FixedActionFooter>
  <div className="flex items-center justify-between w-full">
    <span className="text-sm text-foreground-tertiary">
      Unsaved changes
    </span>
    <div className="flex gap-2">
      <button onClick={handleCustomAction}>Custom Action</button>
      <button onClick={handleSave}>Save</button>
    </div>
  </div>
</FixedActionFooter>
```

---

## 🚀 Scalability Strategy

### **How Tools Should Use Patterns**

**Step 1: Check Pattern Library**
```
Before building ANY component, check:
  /src/app/components/shared/patterns/
  
Does a base pattern exist for this element?
```

**Step 2: Import Base Component**
```tsx
import { TableActionRow, TableRow, SplitViewHeader } from '@/app/components/shared/patterns'
```

**Step 3: Extend with Tool-Specific Features**
```tsx
// Option A: Children Slot
<TableActionRow tabs={tabs} activeTab={tab} onTabChange={setTab}>
  <MyCustomControls />
</TableActionRow>

// Option B: Wrapper Component
export function MyToolActionRow(props) {
  const [localState] = useState()
  
  return (
    <BaseTableActionRow {...props}>
      <MyControlsWithState state={localState} />
    </BaseTableActionRow>
  )
}
```

**Step 4: NEVER Duplicate Base Implementation**
```
⛔ DON'T create /my-tool/table-action-row.tsx
⛔ DON'T copy-paste pattern component code
✅ DO import and extend via props/children
```

---

## 📊 Benefits of This Approach

| Benefit | Impact |
|---------|--------|
| **Single Source of Truth** | Fix pattern once → fixes all tools |
| **Reduced Duplication** | ~300 lines saved per tool |
| **Faster Development** | Import vs build from scratch |
| **Consistent UI** | Same base styling everywhere |
| **Easier Maintenance** | Pattern updates auto-apply |
| **Scale Friendly** | Adding 100 tools doesn't multiply code |

---

## 🎓 Gold Standard Reference: RFI Page

**Location**: `/src/app/components/rfis/`

**What RFI Does Right**:
1. **table-action-row.tsx**: Imports base, extends with RFI-specific controls
2. **rfi-table.tsx**: Uses correct active state (`bg-asphalt-100`)
3. **rfi-detail-view.tsx**: Uses split-view header pattern

**Files to Study**:
```
/src/app/components/rfis/table-action-row.tsx    ← Extension pattern
/src/app/components/rfis/rfi-table.tsx            ← Active state pattern
/src/app/rfis/page.tsx                            ← Full integration
```

---

## ⚠️ Anti-Patterns to Avoid

### **Anti-Pattern 1: Tool-Specific Duplicates**
```tsx
// ❌ WRONG
/src/app/components/submittals/table-action-row.tsx  // Duplicate!
/src/app/components/daily-logs/table-action-row.tsx  // Duplicate!
/src/app/components/inspections/table-action-row.tsx // Duplicate!

// Each tool creates their own version → pattern drift + maintenance nightmare
```

### **Anti-Pattern 2: Copy-Paste Development**
```tsx
// ❌ WRONG: Copying pattern component code into tool file
// Causes: Out-of-sync styling, missed bug fixes, divergence over time
```

### **Anti-Pattern 3: "My Tool is Special" Syndrome**
```tsx
// ❌ WRONG: Bypassing patterns because "my requirements are unique"
// Reality: 99% of requirements can be handled via props/children
```

### **Anti-Pattern 4: Styling Override Wars**
```tsx
// ❌ WRONG: Overriding base pattern styles with custom classes
<TableRow className="!bg-blue-500 !border-red-500">
  // Breaks design system, creates inconsistency
</TableRow>
```

---

## ✅ Migration Checklist for Existing Tools

If a tool has custom components that duplicate patterns:

- [ ] Identify duplicated pattern (table action row, table row, header, footer)
- [ ] Import base pattern component from `/shared/patterns`
- [ ] Refactor to extend base via props/children
- [ ] Remove custom component file (if now redundant)
- [ ] Test that functionality is preserved
- [ ] Verify visual consistency with design system

---

## 🔍 Quick Reference

**Import Statement**:
```tsx
import { 
  TableActionRow, 
  TableRow, 
  TableCell,
  SplitViewHeader,
  SplitViewDetail,
  ManualSaveFooter,
  FixedActionFooter,
  StatusBadge
} from '@/app/components/shared/patterns'
```

**Component Locations**:
```
/src/app/components/shared/patterns/
  ├── table-action-row.tsx       (Base tabs + controls)
  ├── table-row.tsx              (TableRow + TableCell)
  ├── split-view-header.tsx      (Detail pane headers)
  ├── split-view-detail.tsx      (Complete split-view anatomy)
  ├── manual-save-footer.tsx     (Save workflow footers)
  └── status-badge.tsx           (Draft status indicators)
```

**Documentation**:
- **[Guidelines.md Rule 0.4](/guidelines/Guidelines.md#pattern-component-reusability-rule-04---critical)** — Pattern Component Reusability mandate (Import & Extend)
- **[Guidelines.md Rule 0.5](/guidelines/Guidelines.md#table-creation-protocol-rule-05---critical)** — Table Creation Protocol (5-phase process using TableRow/TableCell)
- **[Guidelines.md Rule 1.13](/guidelines/Guidelines.md#popover-and-slide-out-pattern-library-rule-113---critical)** — Popover and Slide-Out z-index rules affecting overlay components
- **[Interaction-Model-Architecture.md](/guidelines/Interaction-Model-Architecture.md)** — Z-index hierarchy (z-0/10/20/30/50/80) that governs Slide-Out (z-30) and Popover (z-20) components
- **TABLE_SPLIT_VIEW_SPEC.md** — Active state specification (line 709: `bg-asphalt-100` for TableRow)

---

## 📞 Need Help?

**Before creating a new component**, ask:
1. Does a base pattern exist in `/shared/patterns`?
2. Can I extend the base via props/children?
3. Have I checked the RFI implementation for reference?

**If unsure**: Reference RFI page implementation or consult design system docs.

---

## 6. StatusBadge Component (NEW - Draft Creation Flow)

**Purpose**: Display draft status indicators with consistent styling

**Base Component** (`/shared/patterns/status-badge.tsx`):
```tsx
interface StatusBadgeProps {
  status: 'incomplete' | 'draft' | 'active'
  label?: string
  variant?: 'danger' | 'secondary' | 'info'
  icon?: ReactNode
  className?: string
}
```

**Locked Styling**:
- Incomplete: `bg-danger-25 text-danger-600` with warning icon
- Draft: `bg-badge-secondary-bg text-badge-secondary-text`
- Active: `bg-informative-600 text-white` (or context-appropriate)
- Consistent: `text-xs rounded-sm px-2 py-1`

**✅ CORRECT Usage**:
```tsx
import { StatusBadge } from '@/app/components/shared/patterns'

// Incomplete draft (required fields missing)
<StatusBadge 
  status="incomplete" 
  label="Incomplete"
  icon={<RiAlertLine className="w-3 h-3" />}
/>

// Valid draft (all required fields complete)
<StatusBadge 
  status="draft" 
  label="Draft"
/>

// Active record (submitted)
<StatusBadge 
  status="active" 
  label="Open"
  variant="info"
/>
```

**Draft Creation Integration**:
```tsx
// In table row - status column
function DraftTableRow({ draft }) {
  const missingFields = draft.requiredFields.filter(
    field => !draft[field]
  )
  
  return (
    <TableRow isActive={draft.isSelected}>
      <TableCell width="w-32">{draft.number}</TableCell>
      <TableCell width="w-48">{draft.subject}</TableCell>
      <TableCell width="w-28">
        <StatusBadge 
          status={missingFields.length > 0 ? 'incomplete' : 'draft'}
          label={missingFields.length > 0 ? 'Incomplete' : 'Draft'}
          icon={missingFields.length > 0 && <RiAlertLine className="w-3 h-3" />}
        />
      </TableCell>
    </TableRow>
  )
}
```

**⛔ WRONG - Custom Status Badges**:
```tsx
// ❌ DON'T create custom badge styling
<div className="bg-red-100 text-red-600 px-2 py-1 rounded">
  Incomplete
</div>

// ✅ USE StatusBadge pattern component
<StatusBadge status="incomplete" label="Incomplete" />
```

---

## 7. DraftManager Component (Planned)

**Purpose**: Coordinate draft creation, synchronization, and status updates

**Planned Features**:
- Create draft row on slide-out open
- Auto-select draft row and open split-view
- Sync autosave data to draft row in real-time
- Update status badge based on required field validation
- Persist draft when slide-out closes
- Handle draft deletion and submission

> **Z-Index Note**: The Slide-Out used during draft creation operates at **z-30** per the canonical hierarchy defined in Interaction-Model-Architecture.md and Guidelines.md Rule 1.13.1. DraftManager must coordinate state between the z-0 workspace (table row) and the z-30 Slide-Out layer without violating the two-pane maximum (Guidelines Rule 0.6).

**Status**: 🚧 In Planning - See [DRAFT_CREATION_FLOW.md](/DRAFT_CREATION_FLOW.md) for specification

---
