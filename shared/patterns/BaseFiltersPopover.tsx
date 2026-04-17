'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'

/**
 * BaseFiltersPopover - Shared filter popover pattern
 * 
 * Implements Filter Principles from /guidelines/Filter-System-Implementation.md:
 * - Principle 1: AND Across Fields (narrows results)
 * - Principle 2: OR Within Fields (broadens results)
 * 
 * Tools IMPORT and EXTEND this component, they do NOT duplicate it.
 * See: /guidelines/Pattern-Component-Library.md Rule 0.4
 */

export interface FilterValue {
  field: string
  label: string
  values: string[]
  isDynamic?: boolean
  isLocked?: boolean
}

export interface FilterFieldConfig {
  field: string
  label: string
  options: { value: string; label: string }[]
  type?: 'multi-select' | 'user-select' | 'date' | 'boolean'
}

export interface BaseFiltersPopoverProps {
  /** Current active filters */
  filters: FilterValue[]
  /** Callback when filters change */
  onFiltersChange: (filters: FilterValue[]) => void
  /** Field configuration for this tool */
  fieldConfigs: FilterFieldConfig[]
  /** Number of active filters (for badge display) */
  activeCount?: number
  /** Custom trigger button (optional) */
  trigger?: React.ReactNode
  /** Popover alignment */
  align?: 'start' | 'center' | 'end'
  /** Additional class names for popover content */
  className?: string
  /** Title for the popover header */
  title?: string
}

export function BaseFiltersPopover({
  filters,
  onFiltersChange,
  fieldConfigs,
  activeCount = 0,
  trigger,
  align = 'start',
  className,
  title = 'Advanced Filters',
}: BaseFiltersPopoverProps) {
  const [open, setOpen] = useState(false)

  const isValueSelected = (field: string, value: string): boolean => {
    const fieldFilter = filters.find(f => f.field === field)
    return fieldFilter?.values.includes(value) || false
  }

  const handleToggleValue = (field: string, label: string, value: string) => {
    const existingFilter = filters.find(f => f.field === field)

    if (existingFilter) {
      if (existingFilter.values.includes(value)) {
        // Remove value from filter
        const newValues = existingFilter.values.filter(v => v !== value)
        if (newValues.length === 0) {
          // Remove entire filter if no values left
          onFiltersChange(filters.filter(f => f.field !== field))
        } else {
          onFiltersChange(
            filters.map(f =>
              f.field === field ? { ...f, values: newValues } : f
            )
          )
        }
      } else {
        // Add value to existing filter (OR within field)
        onFiltersChange(
          filters.map(f =>
            f.field === field
              ? { ...f, values: [...f.values, value] }
              : f
          )
        )
      }
    } else {
      // Create new filter for this field
      onFiltersChange([...filters, { field, label, values: [value] }])
    }
  }

  const handleClearAll = () => {
    // Only clear non-locked filters
    onFiltersChange(filters.filter(f => f.isLocked))
  }

  const handleClearField = (field: string) => {
    const filter = filters.find(f => f.field === field)
    if (filter?.isLocked) return
    onFiltersChange(filters.filter(f => f.field !== field))
  }

  const defaultTrigger = (
    <Button type="button" variant="outline" size="sm" className="relative h-9" iconLeading={SlidersHorizontal}>
      Filters
      {activeCount > 0 ? (
        <span className="ml-1.5 rounded-sm bg-asphalt-950 px-1.5 py-0.5 text-xs leading-none text-white">
          {activeCount}
        </span>
      ) : null}
    </Button>
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || defaultTrigger}
      </PopoverTrigger>
      <PopoverContent
        className={cn('w-96 p-0', className)}
        align={align}
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">
              {title}
            </h4>
            {activeCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs h-7"
              >
                Clear All
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {activeCount > 0
              ? `${activeCount} filter${activeCount > 1 ? 's' : ''} applied`
              : 'No filters applied'}
          </p>
        </div>

        {/* Filter Groups */}
        <div className="max-h-96 overflow-y-auto p-2">
          {fieldConfigs.map((fieldConfig) => {
            const fieldFilter = filters.find(f => f.field === fieldConfig.field)
            const fieldFilterCount = fieldFilter?.values.length || 0
            const isLocked = fieldFilter?.isLocked

            return (
              <div key={fieldConfig.field} className="mb-4 last:mb-0">
                <div className="px-3 py-2 flex items-center justify-between">
                  <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {fieldConfig.label}
                    {fieldFilterCount > 0 && (
                      <span className="ml-2 text-asphalt-700 normal-case">
                        ({fieldFilterCount})
                      </span>
                    )}
                    {isLocked && (
                      <span className="ml-2 text-muted-foreground normal-case text-[10px]">
                        (Locked)
                      </span>
                    )}
                  </h5>
                  {fieldFilterCount > 0 && !isLocked && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleClearField(fieldConfig.field)}
                      className="text-xs h-6 px-2"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="flex flex-col">
                  {fieldConfig.options.map((option) => {
                    const isChecked = isValueSelected(fieldConfig.field, option.value)

                    return (
                      <label
                        key={option.value}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-accent cursor-pointer',
                          isLocked && 'opacity-60 cursor-not-allowed'
                        )}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => 
                            !isLocked && handleToggleValue(fieldConfig.field, fieldConfig.label, option.value)
                          }
                          disabled={isLocked}
                        />
                        <span className="text-sm font-normal flex-1">
                          {option.label}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Utility: Count active filters
 */
export function countActiveFilters(filters: FilterValue[]): number {
  return filters.reduce((count, filter) => count + filter.values.length, 0)
}

/**
 * Utility: Apply filters to data array
 * Implements AND across fields, OR within fields
 */
export function applyFilters<T extends Record<string, unknown>>(
  data: T[],
  filters: FilterValue[],
  fieldAccessor?: (item: T, field: string) => unknown
): T[] {
  if (filters.length === 0) return data

  return data.filter(item => {
    // AND across fields - item must match ALL field filters
    return filters.every(filter => {
      const itemValue = fieldAccessor 
        ? fieldAccessor(item, filter.field)
        : item[filter.field]
      
      // OR within field - item value must match ANY of the filter values
      if (Array.isArray(itemValue)) {
        return filter.values.some(v => itemValue.includes(v))
      }
      return filter.values.includes(String(itemValue))
    })
  })
}
