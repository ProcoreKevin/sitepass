'use client'

import { SlidersHorizontal, GripVertical, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface OpenItemColumnConfig {
  id: string
  label: string
  visible: boolean
  locked?: boolean
}

export const DEFAULT_OPEN_ITEM_COLUMNS: OpenItemColumnConfig[] = [
  { id: 'type',        label: 'Item Type',  visible: true,  locked: true },
  { id: 'description', label: 'Details',    visible: true,  locked: true },
  { id: 'status',      label: 'Status',     visible: true },
  { id: 'dueDate',     label: 'Due Date',   visible: true },
  { id: 'assignee',    label: 'Assignee',   visible: true },
  { id: 'project',     label: 'Project',    visible: false },
  { id: 'overdue',     label: 'Overdue',    visible: false },
]

interface OpenItemsConfigureViewsPopoverProps {
  columns: OpenItemColumnConfig[]
  onConfigChange: (columns: OpenItemColumnConfig[]) => void
  onReset: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function OpenItemsConfigureViewsPopover({
  columns,
  onConfigChange,
  onReset,
  open,
  onOpenChange,
}: OpenItemsConfigureViewsPopoverProps) {
  const toggleColumn = (id: string) => {
    onConfigChange(columns.map(c => c.id === id ? { ...c, visible: !c.visible } : c))
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Configure columns">
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
          <span className="text-sm font-semibold text-foreground-primary">Configure Columns</span>
          <button
            onClick={onReset}
            className="text-xs text-foreground-tertiary hover:text-foreground-primary transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
        <div className="py-2">
          {columns.map(col => (
            <div
              key={col.id}
              className={cn(
                'flex items-center justify-between px-4 py-2 gap-3',
                col.locked && 'opacity-50 pointer-events-none'
              )}
            >
              <div className="flex items-center gap-2">
                <GripVertical className="w-3.5 h-3.5 text-foreground-tertiary" />
                <span className="text-sm text-foreground-secondary">{col.label}</span>
              </div>
              <Switch
                checked={col.visible}
                onCheckedChange={() => toggleColumn(col.id)}
                disabled={col.locked}
                aria-label={`Toggle ${col.label}`}
              />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
