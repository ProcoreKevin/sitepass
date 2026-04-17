'use client'

import { useState } from 'react'
import { SlidersHorizontal, GripVertical, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

/**
 * BaseConfigureViewsPopover - Shared column configuration pattern
 * 
 * Implements column visibility and reordering per:
 * /guidelines/Filter-System-Implementation.md (Minor vs Major Change Classification)
 * 
 * Column changes are "minor" changes - they persist silently without
 * triggering unsaved changes banners.
 * 
 * Tools IMPORT and EXTEND this component, they do NOT duplicate it.
 * See: /guidelines/Pattern-Component-Library.md Rule 0.4
 */

export interface ColumnConfig {
  id: string
  label: string
  visible: boolean
  locked?: boolean  // Locked columns cannot be hidden or reordered
  width?: string    // Optional width specification
}

export interface BaseConfigureViewsPopoverProps {
  /** Current column configuration */
  columns: ColumnConfig[]
  /** Callback when columns change */
  onConfigChange: (columns: ColumnConfig[]) => void
  /** Reset to default configuration */
  onReset: () => void
  /** Controlled open state (optional) */
  open?: boolean
  /** Controlled open state callback (optional) */
  onOpenChange?: (open: boolean) => void
  /** Custom trigger button (optional) */
  trigger?: React.ReactNode
  /** Popover alignment */
  align?: 'start' | 'center' | 'end'
  /** Title for the popover header */
  title?: string
  /** Additional class names for popover content */
  className?: string
}

export function BaseConfigureViewsPopover({
  columns,
  onConfigChange,
  onReset,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
  align = 'end',
  title = 'Configure Columns',
  className,
}: BaseConfigureViewsPopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = controlledOnOpenChange || setInternalOpen

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleToggleVisibility = (columnId: string) => {
    const column = columns.find(c => c.id === columnId)
    if (column?.locked) return

    const updated = columns.map(col =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    )
    onConfigChange(updated)
  }

  const handleDragStart = (index: number) => {
    const column = columns[index]
    if (column?.locked) return
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    // Don't allow dragging over locked columns
    const targetColumn = columns[index]
    if (targetColumn?.locked) return

    const reordered = [...columns]
    const draggedItem = reordered[draggedIndex]
    reordered.splice(draggedIndex, 1)
    reordered.splice(index, 0, draggedItem)

    onConfigChange(reordered)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const visibleCount = columns.filter(c => c.visible).length

  const defaultTrigger = (
    <Button type="button" variant="ghost" size="icon" className="h-9 w-9">
      <SlidersHorizontal className="w-4 h-4" />
    </Button>
  )

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {trigger || defaultTrigger}
      </PopoverTrigger>
      <PopoverContent
        className={cn('w-80 p-0', className)}
        align={align}
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground-primary">
                {title}
              </h4>
              <p className="text-xs text-foreground-tertiary mt-0.5">
                {visibleCount} of {columns.length} columns visible
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-xs h-7"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        {/* Column List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {columns.map((column, index) => (
            <div
              key={column.id}
              draggable={!column.locked}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors',
                column.locked
                  ? 'opacity-60 cursor-not-allowed'
                  : 'cursor-grab active:cursor-grabbing hover:bg-background-secondary',
                draggedIndex === index && 'opacity-50'
              )}
            >
              {/* Drag Handle */}
              {!column.locked ? (
                <GripVertical className="w-4 h-4 text-foreground-tertiary flex-shrink-0" />
              ) : (
                <div className="w-4 flex-shrink-0" />
              )}

              {/* Label */}
              <div className="flex-1 min-w-0">
                <Label
                  htmlFor={`col-toggle-${column.id}`}
                  className={cn(
                    'text-sm font-normal cursor-pointer truncate block',
                    !column.visible && 'text-foreground-tertiary'
                  )}
                >
                  {column.label}
                  {column.locked && (
                    <span className="text-xs text-foreground-tertiary ml-2">
                      (Required)
                    </span>
                  )}
                </Label>
              </div>

              {/* Toggle */}
              <Switch
                id={`col-toggle-${column.id}`}
                checked={column.visible}
                onCheckedChange={() => handleToggleVisibility(column.id)}
                disabled={column.locked}
              />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Utility: Get default column configuration for a tool
 */
export function getDefaultColumns(
  columnDefs: Array<{ id: string; label: string; locked?: boolean; defaultVisible?: boolean }>
): ColumnConfig[] {
  return columnDefs.map(def => ({
    id: def.id,
    label: def.label,
    visible: def.defaultVisible !== false,
    locked: def.locked,
  }))
}

/**
 * Utility: Get visible column IDs in order
 */
export function getVisibleColumnIds(columns: ColumnConfig[]): string[] {
  return columns.filter(c => c.visible).map(c => c.id)
}
