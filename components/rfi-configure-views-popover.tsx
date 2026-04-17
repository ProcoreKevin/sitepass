'use client'

import {
  BaseConfigureViewsPopover,
  type ColumnConfig,
} from '@/shared/patterns'

/**
 * RFI Configure Views Popover
 * 
 * Extends BaseConfigureViewsPopover with RFI-specific column defaults.
 * See: /guidelines/Pattern-Component-Library.md Rule 0.4 (Import & Extend)
 */

// Re-export types for consumers
export type { ColumnConfig }

// Also export SavedView type for backward compatibility
export interface SavedView {
  id: string
  name: string
  description: string
  level: 'company' | 'project' | 'personal'
  columns: ColumnConfig[]
}

interface RFIConfigureViewsPopoverProps {
  columns: ColumnConfig[]
  onConfigChange: (columns: ColumnConfig[]) => void
  onReset: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * Default RFI column configuration
 * Used when resetting to defaults
 */
export const DEFAULT_RFI_COLUMNS: ColumnConfig[] = [
  { id: 'rfiNumber', label: 'RFI #', visible: true, locked: true },
  { id: 'subject', label: 'Subject', visible: true, locked: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'assignee', label: 'Ball in Court', visible: true },
  { id: 'rfiManager', label: 'RFI Manager', visible: true },
  { id: 'dueDate', label: 'Due Date', visible: true },
  { id: 'costImpact', label: 'Cost Impact', visible: true },
  { id: 'scheduleImpact', label: 'Schedule Impact', visible: true },
  { id: 'responsibleContractor', label: 'Responsible Contractor', visible: false },
  { id: 'location', label: 'Location', visible: false },
  { id: 'costCode', label: 'Cost Code', visible: false },
  { id: 'createdBy', label: 'Created By', visible: false },
  { id: 'creationDate', label: 'Creation Date', visible: false },
]

/**
 * RFI Configure Views Popover Component
 * 
 * Wraps BaseConfigureViewsPopover for RFI column configuration.
 * Column changes are "minor" changes per Guidelines - they persist silently.
 */
export function RFIConfigureViewsPopover({
  columns,
  onConfigChange,
  onReset,
  open,
  onOpenChange,
}: RFIConfigureViewsPopoverProps) {
  return (
    <BaseConfigureViewsPopover
      columns={columns}
      onConfigChange={onConfigChange}
      onReset={onReset}
      open={open}
      onOpenChange={onOpenChange}
      title="Configure RFI Columns"
      align="end"
    />
  )
}
