'use client'

import { ReactNode } from 'react'
import { Search, Download, LayoutList, LayoutGrid, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { FilterValue } from './BaseFiltersPopover'

/**
 * BaseGridToolbar - Shared toolbar pattern for grid/table views
 * 
 * This is the TableActionRow equivalent from /guidelines/Pattern-Component-Library.md
 * Implements the filter toolbar controls: search input, Filters button, filter chips row
 * 
 * Tools IMPORT and EXTEND this component, they do NOT duplicate it.
 * See: /guidelines/Pattern-Component-Library.md Rule 0.4
 */

export type ViewMode = 'list' | 'grid'

export interface BaseGridToolbarProps {
  /** Search query value */
  searchQuery: string
  /** Search query change callback */
  onSearchChange: (query: string) => void
  /** Search placeholder text */
  searchPlaceholder?: string
  /** Current view mode */
  viewMode?: ViewMode
  /** View mode change callback */
  onViewModeChange?: (mode: ViewMode) => void
  /** Show view mode toggle */
  showViewToggle?: boolean
  /** Active filters for chip display */
  filters?: FilterValue[]
  /** Remove filter callback */
  onRemoveFilter?: (filter: FilterValue) => void
  /** Clear all filters callback */
  onClearAllFilters?: () => void
  /** Selected row count (for bulk actions) */
  selectedCount?: number
  /** Bulk action buttons */
  bulkActions?: ReactNode
  /** Clear selection callback */
  onClearSelection?: () => void
  /** Export callback */
  onExport?: () => void
  /** Show export button */
  showExport?: boolean
  /** Left side controls (filters, configure views, etc.) */
  leftControls?: ReactNode
  /** Right side controls (add button, etc.) */
  rightControls?: ReactNode
  /** Additional class names */
  className?: string
  /** Hide toolbar when split view is open */
  isSplitViewOpen?: boolean
  /** Hide controls in split view */
  hideControlsWhenSplit?: boolean
}

export function BaseGridToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  viewMode = 'list',
  onViewModeChange,
  showViewToggle = false,
  filters = [],
  onRemoveFilter,
  onClearAllFilters,
  selectedCount = 0,
  bulkActions,
  onClearSelection,
  onExport,
  showExport = false,
  leftControls,
  rightControls,
  className,
  isSplitViewOpen = false,
  hideControlsWhenSplit = false,
}: BaseGridToolbarProps) {
  const showControls = !isSplitViewOpen || !hideControlsWhenSplit
  const hasActiveFilters = filters.length > 0
  const hasBulkSelection = selectedCount > 0

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Main Toolbar Row */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-background-primary">
        {/* Left Side */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 w-64 h-9"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Left Controls (Filters, Configure Views, etc.) */}
          {showControls && leftControls}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {showControls && (
            <>
              {/* View Toggle */}
              {showViewToggle && onViewModeChange && (
                <div className="flex items-center border border-border rounded-md">
                  <button
                    onClick={() => onViewModeChange('list')}
                    className={cn(
                      'p-2 transition-colors',
                      viewMode === 'list'
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    aria-label="List view"
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onViewModeChange('grid')}
                    className={cn(
                      'p-2 transition-colors',
                      viewMode === 'grid'
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Export */}
              {showExport && onExport && (
                <Button type="button" variant="outline" size="sm" onClick={onExport} className="h-9" iconLeading={Download}>
                  Export
                </Button>
              )}

              {/* Right Controls (Add button, etc.) */}
              {rightControls}
            </>
          )}
        </div>
      </div>

      {/* Filter Chips Row */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border-default bg-background-primary">
          <span className="text-xs text-muted-foreground">Filters:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {filters.map((filter, index) => (
              <FilterChip
                key={`${filter.field}-${index}`}
                filter={filter}
                onRemove={onRemoveFilter ? () => onRemoveFilter(filter) : undefined}
              />
            ))}
          </div>
          {onClearAllFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearAllFilters}
              className="text-xs h-6 ml-2"
            >
              Clear All
            </Button>
          )}
        </div>
      )}

      {/* Bulk Actions Row */}
      {hasBulkSelection && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border-default bg-asphalt-100">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">
              {selectedCount} selected
            </span>
            {onClearSelection && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="text-xs h-7"
              >
                Clear Selection
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {bulkActions}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * FilterChip - Display active filter as removable chip
 */
interface FilterChipProps {
  filter: FilterValue
  onRemove?: () => void
}

function FilterChip({ filter, onRemove }: FilterChipProps) {
  const displayValue = filter.values.length === 1
    ? filter.values[0]
    : `${filter.values.length} selected`

  return (
    <Badge
      variant="secondary"
      className={cn(
        'flex items-center gap-1 pr-1',
        filter.isLocked && 'opacity-60'
      )}
    >
      <span className="text-xs">
        {filter.label}: {displayValue}
      </span>
      {onRemove && !filter.isLocked && (
        <button
          onClick={onRemove}
          className="p-0.5 hover:bg-black/10 rounded-full"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </Badge>
  )
}

/**
 * Utility: Format filter for display
 */
export function formatFilterDisplay(filter: FilterValue): string {
  if (filter.values.length === 1) {
    return `${filter.label}: ${filter.values[0]}`
  }
  return `${filter.label}: ${filter.values.length} selected`
}
