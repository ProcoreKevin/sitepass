'use client'

import { useState, useEffect, ReactNode } from 'react'
import {
  ChevronUp,
  ChevronDown,
  Pencil,
  ExternalLink,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

/**
 * BaseDetailPane - Shared detail pane pattern for split-view layouts
 * 
 * Implements Zone Architecture from /guidelines/Form-Creation-Checklist.md:
 * - Header Zone: Navigation, utility actions, title/status
 * - Body Zone: Tabbed content areas (scrollable)
 * - Footer Zone: Save/Cancel or contextual actions
 * 
 * Tools IMPORT and EXTEND this component, they do NOT duplicate it.
 * See: /guidelines/Pattern-Component-Library.md Rule 0.4
 */

export interface DetailPaneTab {
  id: string
  label: string
  content: ReactNode
}

export interface BaseDetailPaneProps {
  /** Unique identifier display (e.g., "RFI-234") */
  identifier?: string
  /** Title/subject of the record */
  title: string
  /** Status badge component */
  statusBadge?: ReactNode
  /** Tab configuration */
  tabs: DetailPaneTab[]
  /** Active tab ID */
  activeTab: string
  /** Tab change callback */
  onTabChange: (tabId: string) => void
  /** Close pane callback */
  onClose: () => void
  /** Open full page view callback */
  onOpenFullView?: () => void
  /** Navigate to previous record */
  onNavigateUp?: () => void
  /** Navigate to next record */
  onNavigateDown?: () => void
  /** Can navigate up */
  canNavigateUp?: boolean
  /** Can navigate down */
  canNavigateDown?: boolean
  /** Edit mode state */
  isEditMode?: boolean
  /** Edit mode toggle callback */
  onEditModeChange?: (isEdit: boolean) => void
  /** Dirty state (unsaved changes) */
  isDirty?: boolean
  /** Save callback */
  onSave?: () => void
  /** Cancel callback */
  onCancel?: () => void
  /** Footer content (overrides default footer) */
  footer?: ReactNode
  /** Additional header actions */
  headerActions?: ReactNode
  /** Additional class names */
  className?: string
}

export function BaseDetailPane({
  identifier,
  title,
  statusBadge,
  tabs,
  activeTab,
  onTabChange,
  onClose,
  onOpenFullView,
  onNavigateUp,
  onNavigateDown,
  canNavigateUp = false,
  canNavigateDown = false,
  isEditMode = false,
  onEditModeChange,
  isDirty = false,
  onSave,
  onCancel,
  footer,
  headerActions,
  className,
}: BaseDetailPaneProps) {
  const activeTabContent = tabs.find(t => t.id === activeTab)?.content

  return (
    <div className={cn('flex flex-col h-full bg-white', className)}>
      {/* Header Zone */}
      <div className="flex-shrink-0 border-b border-border">
        {/* Navigation + Utility Row */}
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-1">
            <button
              onClick={onNavigateUp}
              disabled={!canNavigateUp}
              className={cn(
                'p-1.5 rounded hover:bg-accent transition-colors',
                !canNavigateUp && 'opacity-30 cursor-not-allowed'
              )}
              aria-label="Previous"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateDown}
              disabled={!canNavigateDown}
              className={cn(
                'p-1.5 rounded hover:bg-accent transition-colors',
                !canNavigateDown && 'opacity-30 cursor-not-allowed'
              )}
              aria-label="Next"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            {headerActions}
            {onEditModeChange && (
              <button
                onClick={() => onEditModeChange(true)}
                disabled={isEditMode}
                className={cn(
                  'p-2 hover:bg-accent rounded transition-colors',
                  isEditMode && 'opacity-50 cursor-not-allowed'
                )}
                aria-label="Edit"
              >
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            {onOpenFullView && (
              <button
                className="p-2 hover:bg-accent rounded transition-colors"
                aria-label="Open full page view"
                onClick={onOpenFullView}
              >
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded transition-colors"
              aria-label="Close detail view"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Title Area */}
        <div className="px-4 pb-3">
          {(identifier || statusBadge) && (
            <div className="flex items-center gap-2 mb-1">
              {identifier && (
                <span className="text-xs font-medium text-muted-foreground">
                  {identifier}
                </span>
              )}
              {statusBadge}
            </div>
          )}
          <h2 className="text-base font-semibold text-foreground leading-snug">
            {title}
          </h2>
        </div>

        {/* Tabs */}
        {tabs.length > 1 && (
          <div className="flex px-4 gap-4 border-t border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
                  activeTab === tab.id
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Body Zone - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {activeTabContent}
        </div>
      </div>

      {/* Footer Zone */}
      <div className="flex-shrink-0 border-t border-border px-4 py-3 bg-white">
        {footer ? (
          footer
        ) : isEditMode ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {isDirty ? 'Unsaved changes' : 'Edit mode'}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={onSave} disabled={!isDirty}>
                Save Changes
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

/**
 * DetailField - Reusable field display component for detail panes
 */
export interface DetailFieldProps {
  label: string
  value: string | ReactNode
  isMono?: boolean
  isEditing?: boolean
  editValue?: string
  onEditChange?: (value: string) => void
  editInputClassName?: string
}

export function DetailField({
  label,
  value,
  isMono,
  isEditing,
  editValue,
  onEditChange,
  editInputClassName = 'w-full text-sm border-2 border-foreground rounded px-2 py-1 focus:outline-none',
}: DetailFieldProps) {
  return (
    <div>
      <span className="text-xs text-muted-foreground block mb-1">{label}</span>
      {isEditing && onEditChange ? (
        <input
          type="text"
          value={editValue || ''}
          onChange={(e) => onEditChange(e.target.value)}
          className={editInputClassName}
        />
      ) : (
        <span className={cn('text-sm text-foreground', isMono && 'font-mono')}>
          {value || '\u2014'}
        </span>
      )}
    </div>
  )
}

/**
 * DetailSection - Group related fields with a heading
 */
export interface DetailSectionProps {
  title: string
  children: ReactNode
  className?: string
}

export function DetailSection({ title, children, className }: DetailSectionProps) {
  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        {title}
      </h3>
      {children}
    </div>
  )
}
