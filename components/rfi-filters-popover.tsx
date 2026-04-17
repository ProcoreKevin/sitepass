'use client'

import {
  BaseFiltersPopover,
  type FilterValue,
  type FilterFieldConfig,
} from '@/shared/patterns'

/**
 * RFI Filters Popover
 * 
 * Extends BaseFiltersPopover with RFI-specific field configurations.
 * See: /guidelines/Pattern-Component-Library.md Rule 0.4 (Import & Extend)
 */

// Re-export FilterValue type for consumers
export type { FilterValue }

interface RFIFiltersPopoverProps {
  filters: FilterValue[]
  onFiltersChange: (filters: FilterValue[]) => void
  activeCount?: number
}

/**
 * RFI-specific filter field configuration
 * Defines the fields available for filtering RFIs
 */
const RFI_FILTER_FIELDS: FilterFieldConfig[] = [
  {
    field: 'status',
    label: 'Status',
    type: 'multi-select',
    options: [
      { value: 'Open', label: 'Open' },
      { value: 'Closed', label: 'Closed' },
      { value: 'Draft', label: 'Draft' },
    ],
  },
  {
    field: 'assignee',
    label: 'Ball in Court',
    type: 'user-select',
    options: [
      { value: 'Mike Torres', label: 'Mike Torres' },
      { value: 'Robert Martinez', label: 'Robert Martinez' },
      { value: 'Tom Wilson', label: 'Tom Wilson' },
      { value: 'David Kim', label: 'David Kim' },
      { value: 'Amanda Rodriguez', label: 'Amanda Rodriguez' },
      { value: 'Sarah Chen', label: 'Sarah Chen' },
    ],
  },
  {
    field: 'rfiManager',
    label: 'RFI Manager',
    type: 'user-select',
    options: [
      { value: 'Sarah Chen', label: 'Sarah Chen' },
      { value: 'Jennifer Lee', label: 'Jennifer Lee' },
      { value: 'Mike Torres', label: 'Mike Torres' },
    ],
  },
  {
    field: 'costImpact',
    label: 'Cost Impact',
    type: 'multi-select',
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
      { value: 'TBD', label: 'TBD' },
      { value: 'N/A', label: 'N/A' },
    ],
  },
  {
    field: 'scheduleImpact',
    label: 'Schedule Impact',
    type: 'multi-select',
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
      { value: 'TBD', label: 'TBD' },
      { value: 'N/A', label: 'N/A' },
    ],
  },
  {
    field: 'responsibleContractor',
    label: 'Responsible Contractor',
    type: 'multi-select',
    options: [
      { value: 'Atlas Steel', label: 'Atlas Steel' },
      { value: 'Summit HVAC', label: 'Summit HVAC' },
      { value: 'BuildRight', label: 'BuildRight' },
      { value: 'Vista Glass', label: 'Vista Glass' },
      { value: 'WaterSeal Pro', label: 'WaterSeal Pro' },
      { value: 'BrightWay Electric', label: 'BrightWay Electric' },
      { value: 'Premier Concrete', label: 'Premier Concrete' },
      { value: 'Vertical Transport Inc', label: 'Vertical Transport Inc' },
    ],
  },
]

/**
 * RFI Filters Popover Component
 * 
 * Wraps BaseFiltersPopover with RFI-specific field configuration.
 * All filter logic (AND across fields, OR within fields) is handled by the base component.
 */
export function RFIFiltersPopover({
  filters,
  onFiltersChange,
  activeCount = 0,
}: RFIFiltersPopoverProps) {
  return (
    <BaseFiltersPopover
      filters={filters}
      onFiltersChange={onFiltersChange}
      fieldConfigs={RFI_FILTER_FIELDS}
      activeCount={activeCount}
      title="RFI Filters"
      align="start"
    />
  )
}
