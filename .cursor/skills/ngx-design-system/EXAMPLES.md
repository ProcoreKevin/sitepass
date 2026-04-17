# NGX Design System — Agent Examples

These are canonical worked examples. When the agent generates code, these are the templates it should match — not invent from scratch.

---

## Example 1 — Anchor View with Slide-Out Create

**Scenario:** User says "Build a Punch List anchor view with create flow"

**Pre-check:**
- View type: Anchor View ✓
- Tool parent: Punch List exists in Project Management accordion ✓
- Pattern: Pattern 1 (Anchor) + Pattern 3 (Create) ✓
- Components needed: TableActionRow, TableRow, TableCell, StatusBadge, Slide-Out ✓

```tsx
// src/app/components/punch-list/punch-list-page.tsx
import { TableActionRow } from '@/app/components/shared/patterns'
import { TableRow, TableCell } from '@/app/components/shared/patterns'
import { StatusBadge } from '@/app/components/shared/patterns'
import { SplitViewDetail } from '@/app/components/shared/patterns'

const TABS = [
  { id: 'all', label: 'All', count: 47 },
  { id: 'open', label: 'Open', count: 31 },
  { id: 'complete', label: 'Complete', count: 16 },
]

export function PunchListPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const isSplitViewOpen = !!selectedId

  return (
    <div className="flex h-full">
      {/* Left Pane: Grid (37% = 475px) */}
      <div className={cn('flex flex-col', isSplitViewOpen ? 'w-[475px]' : 'flex-1')}>
        
        {/* PATTERN COMPONENT — TableActionRow */}
        <TableActionRow
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isSplitViewOpen={isSplitViewOpen}
        >
          <Button onClick={() => setIsCreateOpen(true)}>+ New Item</Button>
          <FilterButton />
        </TableActionRow>

        {/* Table rows use PATTERN COMPONENTS — TableRow + TableCell */}
        <div className="flex-1 overflow-y-auto">
          {items.map((item) => (
            <TableRow
              key={item.id}
              isActive={selectedId === item.id}
              onClick={() => setSelectedId(item.id)}
            >
              <TableCell width="w-12">
                <Checkbox />
              </TableCell>
              <TableCell width="w-48">
                <span className="text-sm font-medium text-foreground-primary">
                  {item.title}
                </span>
              </TableCell>
              <TableCell width="w-32">
                {/* PATTERN COMPONENT — StatusBadge */}
                <StatusBadge status={item.status} label={item.statusLabel} />
              </TableCell>
              <TableCell width="w-28">
                <span className="text-sm text-foreground-secondary">
                  {item.assignee}
                </span>
              </TableCell>
              <TableCell width="w-28">
                {/* Overdue date gets danger color */}
                <span className={cn(
                  'text-sm',
                  item.isOverdue
                    ? 'text-danger-600 font-medium'
                    : 'text-foreground-secondary'
                )}>
                  {item.dueDate}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </div>
      </div>

      {/* Right Pane: Detail (63% = 965px) — PATTERN COMPONENT */}
      {isSplitViewOpen && (
        <SplitViewDetail
          title={`PUNCH-${selectedItem?.number}`}
          onClose={() => setSelectedId(null)}
          onOpenFullView={() => router.push(`/punch-list/${selectedId}`)}
        >
          {/* Detail content */}
        </SplitViewDetail>
      )}

      {/* Slide-Out: Create — Pattern 3 (z-30, autosave, NO Save/Cancel) */}
      {isCreateOpen && (
        <>
          {/* Scrim: absolute within workspace, NOT fixed across viewport */}
          <div
            className="absolute inset-0 bg-white/30 z-30"
            onClick={() => setIsCreateOpen(false)}
          />
          {/* Panel: within workspace bounds, below header */}
          <div className="absolute right-0 top-0 bottom-0 w-[480px] bg-background-primary border-l border-border-default shadow-lg z-30">
            <PunchListCreateForm onClose={() => setIsCreateOpen(false)} />
          </div>
        </>
      )}
    </div>
  )
}
```

---

## Example 2 — Form Detail Page with Zone Architecture

**Scenario:** User says "Build the RFI detail page"

**Pre-check:**
- View type: Detail View ✓
- Pattern: Pattern 2 → Pattern 4 ✓
- Zone architecture required: Yes (Tier 3 Routed Document) ✓
- Zone 1 sticky: Required (Tier 3) ✓

```tsx
// src/app/components/rfis/rfi-detail-page.tsx

export function RFIDetailPage({ rfi, currentUserRole }: Props) {
  const [contextPanelOpen, setContextPanelOpen] = useState(false)

  return (
    <div className="flex flex-col h-full">

      {/* ── ZONE 1: Identity Strip (sticky, Tier 3 requirement) ─────────── */}
      <div className="sticky top-0 z-10 bg-background-primary border-b border-border-default px-6 py-4 flex-shrink-0">
        {/* Form type label */}
        <span className="text-xs font-medium text-foreground-tertiary uppercase tracking-wider">
          Request for Information
        </span>
        
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-4">
            {/* Form number — NEVER truncate */}
            <h1 className="text-2xl font-extrabold text-foreground-primary whitespace-nowrap">
              RFI-{rfi.number}
            </h1>
            {/* Status badge — PATTERN COMPONENT */}
            <StatusBadge status={rfi.status} label={rfi.statusLabel} />
          </div>
          
          <div className="flex items-center gap-3 text-sm text-foreground-secondary">
            {/* Overdue date — danger token */}
            <span className={rfi.isOverdue ? 'text-danger-600 font-medium' : ''}>
              Due: {rfi.dueDate}
            </span>
          </div>
        </div>
        
        {/* Title below number row */}
        <h2 className="text-base font-medium text-foreground-primary mt-1 truncate">
          {rfi.title}
        </h2>
      </div>

      {/* ── ZONES 2 + 3: Content + Context (flex row) ──────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ZONE 2: Primary Content — single column, decision-relevance order */}
        <div className="flex-1 overflow-y-auto px-6 py-6">

          {/* Primary fields — decision-driving, shown first */}
          <div className="flex flex-col gap-2">

            {/* Status */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground-secondary">
                Status
              </label>
              <StatusSelector value={rfi.status} onChange={handleStatusChange} />
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground-secondary">
                Due date
              </label>
              <DatePicker value={rfi.dueDate} />
            </div>

            {/* Assigned to */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground-secondary">
                Assigned to
              </label>
              <UserSelector value={rfi.assignedTo} />
            </div>

            {/* Question / Description */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground-secondary">
                Question
              </label>
              <Textarea value={rfi.question} rows={4} />
            </div>

          </div>

          {/* Secondary fields section */}
          <div className="mt-6 flex flex-col gap-2">
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mt-0 mb-3">
              Reference Information
            </h3>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground-secondary">
                Spec section
              </label>
              <SpecSectionSelector value={rfi.specSection} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground-secondary">
                Drawing reference
              </label>
              <DrawingSelector value={rfi.drawingRef} />
            </div>
          </div>

          {/* Tertiary fields — hidden by default */}
          <button
            className="mt-6 text-sm text-foreground-tertiary hover:text-foreground-secondary"
            onClick={() => setShowTertiary(!showTertiary)}
          >
            {showTertiary ? '▲ Hide details' : '▼ Show more details'}
          </button>
          {showTertiary && (
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground-secondary">
                  Created by
                </label>
                <span className="text-sm text-foreground-secondary">{rfi.createdBy}</span>
              </div>
              {/* ...more tertiary fields */}
            </div>
          )}
        </div>

        {/* ZONE 3: Context Panel — inline, no navigation, collapsible */}
        {contextPanelOpen && (
          <div className="w-80 border-l border-border-default flex-shrink-0 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-4">
                Activity & Context
              </h3>
              <AuditTrail entityId={rfi.id} entityType="rfi" />
              <RelatedItems rfiId={rfi.id} />
            </div>
          </div>
        )}
      </div>

      {/* ── ZONE 4: Action Bar (fixed bottom, role-aware) ──────────────── */}
      <div className="flex-shrink-0 bg-background-primary border-t border-border-default px-6 py-4 flex items-center justify-between">
        <button
          className="text-sm text-foreground-secondary hover:text-foreground-primary"
          onClick={() => setContextPanelOpen(!contextPanelOpen)}
        >
          {contextPanelOpen ? 'Hide context' : 'Show context'}
        </button>

        {/* Role-aware primary action — max 2 visible */}
        <div className="flex gap-3">
          {currentUserRole === 'author' && rfi.status === 'open' && (
            <Button variant="ghost">Follow Up</Button>
          )}
          {currentUserRole === 'controller' && (
            <Button variant="ghost">Reassign</Button>
          )}
          {currentUserRole === 'reviewer' && rfi.status === 'open' && (
            <Button className="bg-foreground-primary text-foreground-inverse">
              Respond to RFI
            </Button>
          )}
          {/* Consumer = read-only, no action button */}
        </div>
      </div>
    </div>
  )
}
```

---

## Example 3 — Destructive Action: Three-Tier Model

**Scenario:** Delete actions across three risk levels

```tsx
// ── TIER 1: Low-risk, reversible — Undo toast, NO modal ─────────────────────

function handleRemoveAttachment(id: string) {
  removeAttachment(id)  // immediate removal
  showToast({
    message: 'Attachment removed',
    action: { label: 'Undo', onClick: () => restoreAttachment(id) },
    duration: 6000,  // 5–7 seconds
  })
  // NO modal. NO confirmation dialog.
}

// ── TIER 2: Irreversible, bounded — Modal with verb + object CTA ─────────────

function DeleteRFIButton({ rfi }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Button variant="ghost" onClick={() => setShowModal(true)}>
        Void RFI
      </Button>

      {showModal && (
        // Modal at z-50, full-app scrim
        <Modal
          title="Void this RFI?"
          description={`RFI-${rfi.number} will be permanently voided and removed from active tracking.`}
          onClose={() => setShowModal(false)}
        >
          {/* Enumerate specific consequences */}
          <ul className="text-sm text-foreground-secondary space-y-1 my-4">
            <li>• All linked submittals will be unlinked</li>
            <li>• Active ball-in-court assignments will be cleared</li>
            <li>• This action cannot be undone</li>
          </ul>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            {/* CTA = verb + object, text-danger-600 */}
            <Button
              className="bg-danger-600 text-white hover:bg-danger-700"
              onClick={handleVoid}
            >
              Void RFI-{rfi.number}
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ── TIER 3: Critical, cascading — Typed confirmation ─────────────────────────

function DeleteProjectModal({ project }) {
  const [typedName, setTypedName] = useState('')
  const confirmed = typedName === project.name

  return (
    <Modal title="Delete this project?" className="max-w-lg">
      {/* Enumerate ALL downstream consequences */}
      <div className="bg-danger-25 border border-danger-200 rounded p-4 my-4">
        <p className="text-sm font-medium text-danger-700">
          This will permanently delete:
        </p>
        <ul className="text-sm text-danger-600 mt-2 space-y-1">
          <li>• {project.rfiCount} RFIs and all responses</li>
          <li>• {project.submittalCount} Submittals and approval logs</li>
          <li>• {project.documentCount} Documents and version history</li>
          <li>• All financial records including {project.commitmentCount} commitments</li>
        </ul>
      </div>

      <label className="text-sm font-medium text-foreground-secondary">
        Type <strong>{project.name}</strong> to confirm
      </label>
      <input
        className="mt-1 w-full border border-border-input-default rounded px-3 py-2 text-sm"
        value={typedName}
        onChange={e => setTypedName(e.target.value)}
        placeholder={project.name}
      />

      <div className="flex gap-3 justify-end mt-6">
        <Button variant="ghost">Cancel</Button>
        <Button
          className="bg-danger-600 text-white"
          disabled={!confirmed}
          onClick={handleDeleteProject}
        >
          Delete {project.name}
        </Button>
      </div>
    </Modal>
  )
}
```

---

## Example 4 — Filter Panel (Slide-Out, Contextual View)

**Scenario:** Add a filter panel to Submittals

```tsx
// Filter Panel = Slide-Out, Contextual View type
// Apply/Cancel footer is CORRECT here (deliberate commit)
// Width: w-[480px] — non-negotiable
// z-30 — matches canonical hierarchy

export function SubmittalFilterPanel({ onApply, onClose, currentFilters }) {
  const [pendingFilters, setPendingFilters] = useState(currentFilters)

  return (
    <>
      {/* Scrim: workspace-only, absolute */}
      <div
        className="absolute inset-0 bg-white/30 z-30"
        onClick={onClose}
      />

      {/* Panel: 480px, z-30 */}
      <div className="absolute right-0 top-0 bottom-0 w-[480px] bg-background-primary border-l border-border-default shadow-lg z-30 flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between flex-shrink-0">
          <h2 className="text-base font-medium text-foreground-primary">Filters</h2>
          <button onClick={onClose} className="text-foreground-secondary hover:text-foreground-primary">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Filter body — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">

          {/* Filter group: Status — OR logic within group */}
          <div>
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-3">
              Status
            </h3>
            <div className="flex flex-col gap-2">
              {STATUS_OPTIONS.map(status => (
                <label key={status.value} className="flex items-center gap-2">
                  <Checkbox
                    checked={pendingFilters.status?.includes(status.value)}
                    onChange={() => toggleFilter('status', status.value)}
                  />
                  <StatusBadge status={status.value} label={status.label} />
                </label>
              ))}
            </div>
          </div>

          {/* Filter group: Assigned To */}
          <div>
            <h3 className="text-xs font-bold text-foreground-tertiary uppercase tracking-widest mb-3">
              Assigned To
            </h3>
            {/* Dynamic filter — "Me" resolves at render */}
            <label className="flex items-center gap-2">
              <Checkbox
                checked={pendingFilters.assignedTo === 'me'}
                onChange={() => setFilter('assignedTo', 'me')}
              />
              <span className="text-sm text-foreground-primary">Me</span>
            </label>
            <UserSelector
              placeholder="Select person..."
              value={pendingFilters.assignedTo !== 'me' ? pendingFilters.assignedTo : null}
              onChange={val => setFilter('assignedTo', val)}
            />
          </div>

        </div>

        {/* Footer: Apply/Cancel — CORRECT for Contextual View type */}
        <div className="px-6 py-4 border-t border-border-default flex gap-3 justify-end flex-shrink-0 bg-background-primary">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            className="bg-foreground-primary text-foreground-inverse"
            onClick={() => { onApply(pendingFilters); onClose() }}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  )
}
```

---

## Example 5 — TableActionRow Extension (Filter Integration)

**Scenario:** Adding filter button and chips to any tool's TableActionRow

```tsx
// Filter controls EXTEND TableActionRow — they do not replace it
// Filter chips row is SEPARATE, rendered below TableActionRow

import { TableActionRow as BaseTableActionRow } from '@/app/components/shared/patterns'

export function SubmittalsTableActionRow({ activeTab, onTabChange, isSplitViewOpen }) {
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  const { activeFilters, lockedFilters, removeFilter, clearAll } = useFilters()

  const hasFilters = activeFilters.length > 0

  return (
    <>
      {/* Extend the base — never replace it */}
      <BaseTableActionRow
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={onTabChange}
        isSplitViewOpen={isSplitViewOpen}
      >
        <SearchInput />
        {/* Filter trigger lives inside TableActionRow */}
        <Button
          variant={hasFilters ? 'active' : 'ghost'}
          onClick={() => setFilterPanelOpen(true)}
        >
          <FilterIcon /> Filters {hasFilters && `(${activeFilters.length})`}
        </Button>
      </BaseTableActionRow>

      {/* Filter chips: below TableActionRow, above data — separate row */}
      {(activeFilters.length > 0 || lockedFilters.length > 0) && (
        <div className="px-4 py-2 flex flex-wrap gap-2 bg-background-primary border-b border-border-default">
          {/* Locked chips — cannot be removed */}
          {lockedFilters.map(filter => (
            <span
              key={filter.id}
              className="inline-flex items-center gap-1 rounded-full bg-asphalt-100 text-foreground-tertiary border border-border-inactive px-3 py-1 text-xs cursor-not-allowed"
            >
              <LockIcon className="w-3 h-3" />
              {filter.label}
            </span>
          ))}
          {/* Active chips — can be removed */}
          {activeFilters.map(filter => (
            <span
              key={filter.id}
              className="inline-flex items-center gap-1 rounded-full bg-background-primary border border-border-default px-3 py-1 text-xs"
            >
              {filter.label}
              <button onClick={() => removeFilter(filter.id)}>
                <XIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          {/* Clear All — never removes locked filters */}
          {activeFilters.length > 0 && (
            <button
              className="text-xs text-foreground-secondary hover:text-foreground-primary px-2"
              onClick={clearAll}
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Filter Panel Slide-Out */}
      {filterPanelOpen && (
        <SubmittalFilterPanel
          onClose={() => setFilterPanelOpen(false)}
          onApply={handleApplyFilters}
          currentFilters={activeFilters}
        />
      )}
    </>
  )
}
```

---

*These examples are templates, not starting points for creativity. Deviate only with explicit design system approval.*
