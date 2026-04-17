/**
 * Shared Pattern Components
 * 
 * Base pattern components for tools to IMPORT and EXTEND.
 * See: /guidelines/Pattern-Component-Library.md
 * 
 * SCALABILITY RULE (Guidelines Rule 0.4):
 * Tools customize by importing base components and adding tool-specific
 * features via props or children. Tools NEVER duplicate base implementations.
 */

// Filter Popover Pattern
export {
  BaseFiltersPopover,
  countActiveFilters,
  applyFilters,
  type FilterValue,
  type FilterFieldConfig,
  type BaseFiltersPopoverProps,
} from './BaseFiltersPopover'

// Configure Views Popover Pattern
export {
  BaseConfigureViewsPopover,
  getDefaultColumns,
  getVisibleColumnIds,
  type ColumnConfig,
  type BaseConfigureViewsPopoverProps,
} from './BaseConfigureViewsPopover'

// Detail Pane Pattern
export {
  BaseDetailPane,
  DetailField,
  DetailSection,
  type DetailPaneTab,
  type BaseDetailPaneProps,
  type DetailFieldProps,
  type DetailSectionProps,
} from './BaseDetailPane'

// Create/Edit Slideout Pattern
export {
  BaseCreateSlideout,
  AutosaveIndicator,
  FormField,
  type FormFieldConfig,
  type BaseCreateSlideoutProps,
  type AutosaveIndicatorProps,
  type FormFieldProps,
} from './BaseCreateSlideout'

// Grid Toolbar Pattern
export {
  BaseGridToolbar,
  formatFilterDisplay,
  type ViewMode,
  type BaseGridToolbarProps,
} from './BaseGridToolbar'
