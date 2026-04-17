# Filter System Implementation Guide

## Overview

This document defines the complete filter system architecture for the NGX Design System, including filter logic, UI patterns, state management, and integration with saved views.

> **Document Role:** This guide governs filter logic, filter UI components, and saved view integration. It is part of the NGX Design System enforcement contract and must be read alongside:
> - **[Guidelines.md](/guidelines/Guidelines.md)** — Master rulebook. Rule 0.1 governs the token mandate enforced throughout this document. Rule 0.9.12 defines the canonical Saved Views system — the "Minor/Major Change Distinction" and "Saved View Filter Display" sections here must remain consistent with it.
> - **[Interaction-Model-Architecture.md](/guidelines/Interaction-Model-Architecture.md)** — Z-index hierarchy. The Filter Panel is a Slide-Out (z-30); its layer assignment is governed by the Architecture doc's canonical stack.
> - **[Pattern-Component-Library.md](/guidelines/Pattern-Component-Library.md)** — The filter toolbar controls (search input, Filters button, filter chips row) live within the `TableActionRow` component. Filter UI must extend `TableActionRow`, not replace it.
> - **[Form-Creation-Checklist.md](/guidelines/Form-Creation-Checklist.md)** — Defines Slide-Out type behavior and footer rules. Filter Principle 3 (Permissions) interacts with the role-aware action model in the FCC Zone Architecture section.

---

## Core Filter Principles (MANDATORY)

> **Rule registration:** These principles govern filter logic and are formally scoped as sub-rules under **Guidelines Rule 0.9** (Table & Data Display behavior). They use the "Filter Principle" prefix to distinguish them from the master Guidelines rule numbering (Rules 0.1–1.13). When a conflict arises between a Filter Principle and a parent Guidelines rule, the Guidelines rule takes precedence.

### **Filter Principle 1: AND Across Fields**
Adding filters from different fields **narrows** results (intersection logic).

**Example:**
```
Status: In Review AND Discipline: Structural
→ Returns only documents that are BOTH "In Review" AND "Structural"
```

### **Filter Principle 2: OR Within Fields**
Selecting multiple values in the same field **broadens** results (union logic).

**Example:**
```
Status: In Review OR Approved
→ Returns documents that are EITHER "In Review" OR "Approved"
```

### **Filter Principle 3: Permissions Are Silent Pre-Filters**
User permission groups run **before** any saved view filter. A view defined as `Type: Drawing, Status: Approved` will return different row counts for different user roles. The view definition is the same; the permission layer is invisible but always applied first.

---

## Filter Categories & Types

### **Universal Filters (Available on All Tools)**

| Filter | Type | Operators | Notes |
|--------|------|-----------|-------|
| **Type** | Multi-select | Is any of, Is none of | Grouped by category in picker |
| **Status** | Multi-select | Is any of, Is none of | Tool-specific status values |
| **Author / Uploaded By** | User select | Is, Is me, Is my company, Is any of | "Me" resolves dynamically at render |
| **Last Updated** | Date | Is today, This week, This month, Before, After, Between, Is overdue | Relative options recalculate on each view load |
| **Upload Date** | Date | Same as Last Updated | - |
| **Ball in Court** | User/Company select | Is, Is me, Is my company, Is any of | - |
| **Has Workflow** | Boolean | Yes / No | Filters for items inside an approval workflow |
| **Workflow Status** | Multi-select | Is any of | Active, Complete, Overdue, Not Started |

### **Type-Specific Filters**

Filters that only appear when relevant document types are selected:

#### **Drawings**
- Drawing Number: Contains, Starts with, Exactly matches
- Discipline: Is any of (Arch, Structural, MEP, Civil, Landscape, General)
- Revision: Is, Is greater than, Is latest only
- Sheet Size: Is any of
- Issued for: Is any of (Construction, Review, Record, Coordination)

#### **RFIs**
- RFI Number: Contains, Between (range)
- Assigned To: Is, Is me, Is my company
- Due Date: Before, After, Is overdue, Is this week
- Days Open: Greater than, Less than, Between
- Cost Impact: Yes / No
- Schedule Impact: Yes / No
- Spec Section: Is any of

#### **Submittals**
- Spec Section / Division: Is any of (CSI MasterFormat)
- Submittal Type: Shop Drawing, Product Data, Sample, O&M Manual
- Required on Site Date: Before, After, Is overdue
- Revision: Is, Is latest only
- Subcontractor: Is any of

#### **Change Orders**
- Contract: Is any of (linked contracts)
- Amount: Greater than, Less than, Between
- CO Type: PCO, COR, OCO, SCO
- Approved Amount: Greater than, Less than
- Affects Schedule: Yes / No

#### **COIs (Certificates of Insurance)**
- Policy Type: General Liability, Workers Comp, Auto, Umbrella
- Holder / Insured: Is, Is any of
- Expiration Date: Before, After, Is today, Expires within 30/60/90 days
- Coverage Amount: Greater than, Less than
- Status: Compliant, Expiring Soon, Expired

---

## Filter State Management

### **TypeScript Interface**

```tsx
export type FilterOperator = 
  | 'is_any_of' 
  | 'is_none_of' 
  | 'is' 
  | 'is_me' 
  | 'is_my_company' 
  | 'before' 
  | 'after' 
  | 'between' 
  | 'is_today' 
  | 'this_week' 
  | 'this_month' 
  | 'is_overdue'

export interface FilterValue {
  field: string           // e.g., 'type', 'status', 'discipline'
  label: string           // Human-readable: 'Type', 'Status', 'Discipline'
  operator: FilterOperator
  values: string[]        // Selected values: ['Drawing', 'RFI']
  isDynamic?: boolean     // For filters like "Me", "Today"
  isLocked?: boolean      // For Standard View locked filters
}
```

### **Filter State Hook Pattern**

```tsx
const [filters, setFilters] = useState<FilterValue[]>([])

// Add/Update filter
const updateFilter = (field: string, label: string, values: string[], isDynamic = false) => {
  const newFilters = filters.filter(f => f.field !== field)
  
  if (values.length > 0) {
    newFilters.push({
      field,
      label,
      operator: 'is_any_of',
      values,
      isDynamic,
    })
  }
  
  setFilters(newFilters)
}

// Remove filter chip
const removeFilter = (filterToRemove: FilterValue) => {
  setFilters(prev => prev.filter(f => 
    !(f.field === filterToRemove.field && 
      f.values.join(',') === filterToRemove.values.join(','))
  ))
}

// Clear all filters
const clearAllFilters = () => {
  setFilters([])
}
```

---

## Filter Application Logic (AND/OR Rules)

```tsx
const filteredData = (() => {
  let items = [...originalData]
  
  if (filters.length > 0) {
    // Group filters by field (for OR within field)
    const filtersByField: Record<string, FilterValue[]> = {}
    filters.forEach(filter => {
      if (!filtersByField[filter.field]) {
        filtersByField[filter.field] = []
      }
      filtersByField[filter.field].push(filter)
    })
    
    // Apply each field's filters (AND across fields)
    Object.entries(filtersByField).forEach(([field, fieldFilters]) => {
      // Within a field, it's OR (any value matches)
      const allValuesForField = fieldFilters.flatMap(f => f.values)
      
      if (field === 'type') {
        items = items.filter(item => allValuesForField.includes(item.type))
      } else if (field === 'status') {
        items = items.filter(item => allValuesForField.includes(item.status))
      } else if (field === 'author') {
        items = items.filter(item => {
          // Handle dynamic filters
          if (allValuesForField.includes('me')) {
            return item.author === currentUser.name
          }
          if (allValuesForField.includes('my_company')) {
            return companyMembers.includes(item.author)
          }
          // Regular author matching
          return allValuesForField.includes(item.author)
        })
      }
      // ... other fields
    })
  }
  
  return items
})()
```

---

## Dynamic Filters (Resolve at Render Time)

Some filter values should not be hardcoded at save time—they should resolve to the current user or current date when the view loads.

| Filter Value | Resolves To | UI Indicator |
|--------------|-------------|--------------|
| **Me** | Currently logged-in user | "Dynamic" badge |
| **My Company** | Company associated with current user | "Dynamic" badge |
| **Today** | Current calendar date | "Dynamic" badge |
| **This Week** | Current Mon–Sun window | "Dynamic" badge |
| **Overdue** | Due Date < today AND Status ≠ Approved | "Dynamic" badge |
| **Expiring Soon** | Expiration Date within N days of today | "Dynamic" badge |

### **Dynamic Filter UI Example**

```tsx
<div className="flex items-center gap-2">
  <Checkbox
    id="author-me"
    checked={getFilterValues('author').includes('me')}
    onCheckedChange={() => toggleFilterValue('author', 'Author', 'me', true)}
  />
  <label htmlFor="author-me" className="flex items-center gap-2">
    Me
    <Badge variant="secondary" className="text-xs px-1.5 py-0">
      Dynamic
    </Badge>
  </label>
</div>
```

---

## Filter UI Components

### **Filter Panel (Slide-Out — Contextual View type)**

**Design system term:** Slide-Out. Implement with the app **sheet / slide-out facade** (`@/components/ui/sheet` and related pattern components); describe and document this surface as a Slide-Out in all design system language.

**Layer assignment:** `z-30` — Slide-Out layer per [Interaction-Model-Architecture.md](/guidelines/Interaction-Model-Architecture.md) canonical z-index stack. Must sit above workspace content (`z-0`) and below Modal (`z-50`).

**Slide-Out type:** Contextual View — this panel exposes filter controls for an existing data surface. It does not create a new record. This distinction governs its footer behavior (see Footer Rule below).

**Location:** Right-side Slide-Out, `w-[480px]`
**Trigger:** "Filters" button in `TableActionRow` toolbar ([Pattern-Component-Library.md](/guidelines/Pattern-Component-Library.md))
**Components:** Checkboxes for multi-select, radio for single-select, date pickers

> **Footer Rule — Apply/Cancel on Contextual View Slide-Outs:** [Form-Creation-Checklist.md](/guidelines/Form-Creation-Checklist.md) Rule 6.1 prohibits Save/Cancel buttons on Pattern 3 (Data Entry) Slide-Outs, which use autosave. That rule applies to record-creation forms. The Filter Panel is a **Contextual View** Slide-Out — it does not write a new record; it configures the display state of an existing list. Apply/Cancel buttons are correct here because the user is explicitly committing a view state change, not saving a domain object. Autosave would apply filters as the user interacts, which breaks the deliberate filter-setting UX. This exception is governed by Slide-Out type classification, not a conflict with the autosave rule.

**Structure:**
```tsx
<Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
  <SheetContent className="w-[480px] overflow-y-auto">
    <SheetHeader>
      <SheetTitle>Filter Documents</SheetTitle>
      <SheetDescription>Refine your list by applying filters</SheetDescription>
    </SheetHeader>

    <div className="mt-6 space-y-6">
      {/* Active filter count + Clear All */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pb-4 border-b">
          <span className="text-sm text-foreground-secondary">
            {filters.length} active filter{filters.length !== 1 ? 's' : ''}
          </span>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* Filter sections */}
      {/* Type, Status, Discipline, etc. */}
    </div>

    {/* Footer — Apply/Cancel: Contextual View Slide-Out type (not autosave). See Footer Rule above. */}
    <div className="sticky bottom-0 bg-background-primary border-t pt-6">
      <div className="flex gap-2">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button onClick={onClose} className="flex-1">
          Apply Filters
        </Button>
      </div>
    </div>
  </SheetContent>
</Sheet>
```

### **Filter Chips (Active Filters Row)**

**Location:** Below toolbar, above data table  
**Visibility:** Only shown when `filters.length > 0`  
**Background:** `bg-background-primary` (same primary surface as toolbar + table chrome; see `app/legacy-theme.css` §02)

**Structure:**
```tsx
{filters.length > 0 && (
  <div className="flex items-center gap-2 px-6 py-2.5 border-b border-border-default bg-background-primary flex-wrap">
    <span className="text-xs font-medium text-foreground-secondary mr-1">
      Active Filters:
    </span>
    
    {/* Filter Chips */}
    {filters.map((filter, index) => (
      <div
        key={`${filter.field}-${index}`}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors",
          filter.isLocked 
            ? "bg-asphalt-100 text-foreground-tertiary border border-border-inactive cursor-not-allowed"
            : "bg-background-primary border border-border-default hover:border-border-hover"
        )}
      >
        {/* Locked indicator */}
        {filter.isLocked && (
          <Lock className="w-3 h-3 text-foreground-tertiary" />
        )}
        
        {/* Filter label and values */}
        <span className="text-foreground-secondary">{filter.label}:</span>
        <span className="text-foreground-primary font-medium">
          {filter.values.join(', ')}
        </span>
        
        {/* Dynamic badge */}
        {filter.isDynamic && (
          <Badge variant="secondary" className="text-xs px-1.5 py-0 ml-1">
            Dynamic
          </Badge>
        )}
        
        {/* Remove button (only if not locked) */}
        {!filter.isLocked && (
          <button
            onClick={() => removeFilter(filter)}
            className="ml-1 hover:bg-background-tertiary rounded-full p-0.5 transition-colors"
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="w-3.5 h-3.5 text-foreground-tertiary hover:text-foreground-primary" />
          </button>
        )}
      </div>
    ))}
    
    {/* Clear All button */}
    {filters.some(f => !f.isLocked) && (
      <Button
        variant="ghost"
        size="sm"
        onClick={clearAllFilters}
        className="h-7 text-xs ml-2"
      >
        Clear all
      </Button>
    )}
  </div>
)}
```

---

## Locked Filters (Standard Views)

Some Standard Views have filters that are structurally required—removing them would break the view's meaning. These are rendered as **read-only chips** that cannot be dismissed.

### **Examples:**
- "Open RFIs" Standard View has `Status: Open` locked
- "Drawings" Standard View has `Type: Drawing` locked
- "Expired COIs" view has `Expiration Date: Before Today` locked

### **Visual Treatment:**
```tsx
{
  field: 'status',
  label: 'Status',
  operator: 'is_any_of',
  values: ['Open'],
  isLocked: true  // ← Locked filter
}
```

**Locked chips render with:**
- Lock icon (`<Lock className="w-3 h-3" />`)
- No X dismiss button
- Muted background: `bg-asphalt-100 text-foreground-tertiary`
- Border: `border-border-inactive`
- Cursor: `cursor-not-allowed`

---

## Filter Behavior Rules

### **Minor/Major Change Distinction**

**Minor changes** (applied silently, no save prompt, persist on Standard Views):
- Sort column change
- Sort direction change
- Column show/hide
- Column reorder

**Major changes** (trigger unsaved changes banner, do not persist unless saved):
- Any filter added, removed, or modified
- Display type change (List → Calendar → Resource Scheduler)
- Group by change

**Rationale:** Sort and column changes are cosmetic preferences. Filter changes change what data the user sees — that's a meaningful state change that deserves an explicit save decision. This aligns with **Guidelines Rule 0.9.12** (Saved Views system), where filter state is part of the saved view definition and column/sort state is not.

---

## Filter Conflicts & Validation

| Conflict | Behavior |
|----------|----------|
| `Status: Approved AND Status: Void` (logically exclusive multi-select) | Allowed—returns documents that are either; no warning needed |
| `Due Date: Before Jan 1 AND Due Date: After Dec 31` (same year) | Show inline warning: "This date range returns no results" |
| `Type: Drawing AND Spec Section filter active` | Show warning: "Spec Section only applies to Submittals—this filter has no effect on Drawings" |
| Expiration Date filter on RFIs (no expiration field) | Filter not available—type-specific filters only appear when selected Type supports them |
| `Assigned To: Me AND Ball in Court: My Company` simultaneously | Allowed, returns union—these are different fields |

---

## Saved View Filter Display

> **Cross-reference:** This section implements a subset of the canonical Saved Views system defined in **[Guidelines.md](/guidelines/Guidelines.md) Rule 0.9.12**. The behaviors described here — locked filters, dynamic value resolution, view ownership, and the Minor/Major change model — must remain consistent with Rule 0.9.12. If a conflict arises, Rule 0.9.12 governs.

When a view is saved, its active filters should be readable in two places:

### **1. Tab Bar Tooltip**
Hovering a saved view tab shows a compact summary:
```
Status: In Review · Discipline: Structural · Ball in Court: Me
```

### **2. View Details Panel**
The full filter set is displayed as read-only chips, grouped by field, with dynamic values labeled explicitly:
```
Ball in Court: Me (dynamic)
```
This clarifies that it will resolve differently for each viewer.

---

## Integration with Toolbar

> **Component base:** Filter controls (search input, Filters button, active filter chips row) are part of the `TableActionRow` component defined in **[Pattern-Component-Library.md](/guidelines/Pattern-Component-Library.md)**. Filter UI must extend `TableActionRow` — do not build a parallel toolbar or replace the base component. The filter chip row renders as a sub-row directly below `TableActionRow`, between the toolbar and the data table.

### **Filters Button**

```tsx
<Button variant="outline" size="sm" className="h-9" onClick={() => setIsFiltersOpen(true)}>
  <SlidersHorizontal className="w-4 h-4 mr-2" />
  Filters
  {filters.length > 0 && (
    <span className="ml-1 text-foreground-tertiary">· {filters.length}</span>
  )}
</Button>
```

**Behavior:**
- Shows active filter count when filters are applied
- Opens filter panel sheet on click
- Count updates in real-time as filters change

---

## Empty States with Filters

When filters return 0 results, distinguish between:

### **1. "No items match these filters"**
The data doesn't exist with these criteria.

```tsx
<EmptyState
  icon={<FileText className="w-12 h-12 text-foreground-tertiary" />}
  title="No documents match these filters"
  description="Try adjusting your filters or clearing them to see all documents."
  action={
    <Button onClick={clearAllFilters}>Clear Filters</Button>
  }
/>
```

### **2. "Permission restricted"**
The data exists but is outside the user's permission group.

```tsx
<EmptyState
  icon={<Lock className="w-12 h-12 text-foreground-tertiary" />}
  title="Some documents may be restricted"
  description="Contact your Project Admin to adjust your permissions if you need access to additional documents."
/>
```

---

## Reference Implementation

**Gold Standard:** `/src/app/components/documents/`
- `document-filters-panel.tsx` - Filter panel component
- `document-index-table.tsx` - Integration with table, chip display, filter logic

**Key Features Demonstrated:**
- AND/OR filter logic (lines 450-500)
- Dynamic filter resolution (lines 480-495)
- Filter chip display with removal (lines 650-720)
- Locked filter support (lines 680-685)
- Clear All functionality (lines 710-715)

---

## Checklist for Filter Implementation

- [ ] **Filter state management:** `useState<FilterValue[]>([])`
- [ ] **AND/OR logic:** Group by field, OR within, AND across
- [ ] **Dynamic filters:** "Me", "My Company", "Today" resolve at render
- [ ] **Filter panel:** Slide-Out (Contextual View type), `w-[480px]`, `z-30`, extends `TableActionRow`
- [ ] **Filter chips:** Display below toolbar with remove buttons
- [ ] **Clear All:** Remove all non-locked filters at once
- [ ] **Locked filters:** Read-only chips with lock icon, no dismiss button
- [ ] **Filter count:** Display in toolbar button (e.g., "Filters · 3")
- [ ] **Empty states:** Distinguish no results vs. permission restricted
- [ ] **Type-specific filters:** Only show relevant filters based on selected types
- [ ] **Validation warnings:** Warn when conflicting filters applied
- [ ] **Save behavior:** Filters trigger "unsaved changes" state

---

## Red Flags - Never Do These

- ⛔ Don't use OR logic across different fields (breaks Filter Principle 1)
- ⛔ Don't hardcode dynamic values like "Me" to specific user IDs at save time
- ⛔ Don't allow locked filter chips to be dismissed
- ⛔ Don't show type-specific filters when irrelevant types selected
- ⛔ Don't apply filters silently without showing active chips
- ⛔ Don't forget to include "Dynamic" badge on runtime-resolved filters
- ⛔ Don't use raw color values (`bg-white`, hex codes) in chip or panel styling — use semantic tokens (`bg-background-primary`, `border-border-default`)
- ⛔ Don't place filter chips above toolbar (they go below, between toolbar and table)
- ⛔ Don't forget accessibility (aria-labels on remove buttons)
- ⛔ Don't allow "Clear All" to remove locked filters
- ⛔ Don't refer to the Filter Panel as a "Sheet" or "Slide-Out Sheet" in design docs — it is a Slide-Out (Contextual View type); `<Sheet>` is the implementation component only
- ⛔ Don't assign the Filter Panel a z-index other than `z-30` — it is a Slide-Out and must sit at the Slide-Out layer
- ⛔ Don't build custom toolbar components for filter controls — extend `TableActionRow` from the Pattern Component Library

---

## Future Enhancements

### **Advanced Operators (Phase 2)**
- Date range pickers (Between operator)
- Numeric range filters (Amount: $1,000-$5,000)
- Text search operators (Contains, Starts with, Exactly matches)
- Negation operators (Is none of, Is not)

### **Filter Presets (Phase 3)**
- Save filter combinations as quick presets
- Share filter presets across team
- Default filters per user role

### **Filter Analytics (Phase 4)**
- Track most-used filters
- Suggest filters based on user behavior
- Auto-apply common filter patterns
