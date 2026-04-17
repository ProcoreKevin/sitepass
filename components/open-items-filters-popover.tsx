'use client'

import { useState } from 'react'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface OpenItemFilterValue {
  field: string
  label: string
  operator: string
  values: string[]
}

interface FilterFieldConfig {
  field: string
  label: string
  options: { value: string; label: string }[]
}

const OPEN_ITEM_FILTER_FIELDS: FilterFieldConfig[] = [
  {
    field: 'type',
    label: 'Item Type',
    options: [
      { value: 'RFI', label: 'RFI' },
      { value: 'Submittal', label: 'Submittal' },
      { value: 'Inspection', label: 'Inspection' },
      { value: 'Change Order', label: 'Change Order' },
      { value: 'Daily Log', label: 'Daily Log' },
      { value: 'Observation', label: 'Observation' },
      { value: 'Meeting', label: 'Meeting' },
    ],
  },
  {
    field: 'status',
    label: 'Status',
    options: [
      { value: 'Open', label: 'Open' },
      { value: 'Pending Review', label: 'Pending Review' },
      { value: 'In Progress', label: 'In Progress' },
    ],
  },
  {
    field: 'assignee',
    label: 'Assignee',
    options: [
      { value: 'Sarah Chen', label: 'Sarah Chen' },
      { value: 'Mike Rodriguez', label: 'Mike Rodriguez' },
      { value: 'Emily Watson', label: 'Emily Watson' },
      { value: 'David Kim', label: 'David Kim' },
    ],
  },
  {
    field: 'overdue',
    label: 'Overdue',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
]

interface OpenItemsFiltersPopoverProps {
  filters: OpenItemFilterValue[]
  onFiltersChange: (filters: OpenItemFilterValue[]) => void
  activeCount?: number
}

export function OpenItemsFiltersPopover({
  filters,
  onFiltersChange,
  activeCount = 0,
}: OpenItemsFiltersPopoverProps) {
  const [open, setOpen] = useState(false)
  const [expandedField, setExpandedField] = useState<string | null>('type')

  const getFieldValues = (field: string): string[] => {
    return filters.find(f => f.field === field)?.values ?? []
  }

  const toggleValue = (field: string, label: string, value: string) => {
    const current = getFieldValues(field)
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]

    if (next.length === 0) {
      onFiltersChange(filters.filter(f => f.field !== field))
    } else {
      const existing = filters.find(f => f.field === field)
      if (existing) {
        onFiltersChange(filters.map(f => f.field === field ? { ...f, values: next } : f))
      } else {
        onFiltersChange([...filters, { field, label, operator: 'is_any_of', values: next }])
      }
    }
  }

  const clearAll = () => onFiltersChange([])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('gap-2 h-9', activeCount > 0 && 'border-foreground-primary')}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground-primary text-[10px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
          <span className="text-sm font-semibold text-foreground-primary">Filters</span>
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-foreground-tertiary hover:text-foreground-primary transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>
        <div className="divide-y divide-border-default">
          {OPEN_ITEM_FILTER_FIELDS.map(field => {
            const selectedValues = getFieldValues(field.field)
            const isExpanded = expandedField === field.field
            return (
              <div key={field.field}>
                <button
                  className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-foreground-primary hover:bg-background-secondary transition-colors"
                  onClick={() => setExpandedField(isExpanded ? null : field.field)}
                >
                  <span className="flex items-center gap-2">
                    {field.label}
                    {selectedValues.length > 0 && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground-primary text-[10px] font-semibold text-white">
                        {selectedValues.length}
                      </span>
                    )}
                  </span>
                  <ChevronDown className={cn('w-3.5 h-3.5 text-foreground-tertiary transition-transform', isExpanded && 'rotate-180')} />
                </button>
                {isExpanded && (
                  <div className="px-4 pb-3 flex flex-col gap-2">
                    {field.options.map(opt => (
                      <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                        <Checkbox
                          checked={selectedValues.includes(opt.value)}
                          onCheckedChange={() => toggleValue(field.field, field.label, opt.value)}
                        />
                        <span className="text-sm text-foreground-secondary">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
