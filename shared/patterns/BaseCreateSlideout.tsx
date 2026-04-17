'use client'

import { ReactNode } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Z_INDEX } from '@/lib/design-tokens'

/**
 * BaseCreateSlideout - Shared slide-out panel pattern for create/edit forms
 * 
 * Implements Slide-Out layer from /guidelines/Interaction-Model-Architecture.md:
 * - z-30: Slide-Out (focused sub-tasks)
 * - Scrim: bg-white/30 (workspace only)
 * 
 * Zone Architecture from /guidelines/Form-Creation-Checklist.md:
 * - Header Zone: Title, status indicator, close button
 * - Body Zone: Form fields (scrollable)
 * - Footer Zone: Save status, action buttons
 * 
 * Tools IMPORT and EXTEND this component, they do NOT duplicate it.
 * See: /guidelines/Pattern-Component-Library.md Rule 0.4
 */

export interface FormFieldConfig {
  id: string
  label: string
  required?: boolean
  type?: 'text' | 'textarea' | 'select' | 'date' | 'number'
}

export interface BaseCreateSlideoutProps {
  /** Whether the slideout is visible */
  isOpen: boolean
  /** Close callback */
  onClose: () => void
  /** Title for the slideout header */
  title: string
  /** Form content (rendered in body zone) */
  children: ReactNode
  /** Whether the form is complete (all required fields filled) */
  isComplete?: boolean
  /** Missing required fields (for warning display) */
  missingFields?: string[]
  /** Whether currently saving */
  isSaving?: boolean
  /** Last saved timestamp */
  lastSaved?: Date | null
  /** Footer content (overrides default) */
  footer?: ReactNode
  /** Width of the slideout panel */
  width?: number | string
  /** Additional class names for the panel */
  className?: string
  /** Show incomplete warning */
  showIncompleteWarning?: boolean
}

export function BaseCreateSlideout({
  isOpen,
  onClose,
  title,
  children,
  isComplete = true,
  missingFields = [],
  isSaving = false,
  lastSaved = null,
  footer,
  width = 480,
  className,
  showIncompleteWarning = true,
}: BaseCreateSlideoutProps) {
  if (!isOpen) return null

  const panelWidth = typeof width === 'number' ? `${width}px` : width

  return (
    <>
      {/* Scrim - workspace only, bg-white/30 per Architecture doc */}
      <div
        className="fixed inset-0 bg-white/30"
        style={{ zIndex: Z_INDEX.SLIDE_OUT }}
        onClick={onClose}
      />

      {/* Slide-Out Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full bg-background-primary shadow-lg flex flex-col border-l border-border-default',
          className
        )}
        style={{ 
          zIndex: Z_INDEX.SLIDE_OUT,
          width: panelWidth,
        }}
      >
        {/* Header Zone */}
        <div className="flex-shrink-0 h-14 px-6 flex items-center justify-between bg-background-primary border-b border-border-default">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-foreground-primary">{title}</h2>
            {!isComplete && showIncompleteWarning && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-attention-100 text-attention-700 text-xs font-medium">
                <AlertTriangle className="w-3 h-3" />
                <span>Incomplete</span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Body Zone - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 flex flex-col gap-5">
            {children}

            {/* Missing Fields Warning */}
            {!isComplete && missingFields.length > 0 && showIncompleteWarning && (
              <div className="p-4 bg-attention-50 border border-attention-200 rounded-md">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-attention-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-attention-800">Required fields missing</p>
                    <p className="text-xs text-attention-700 mt-1">
                      Complete all required fields to save.
                    </p>
                    <ul className="text-xs text-attention-700 mt-2 flex flex-col gap-0.5">
                      {missingFields.map(field => (
                        <li key={field}>- {field}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Zone */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-border-default bg-background-primary">
          {footer || (
            <div className="flex items-center justify-between">
              <AutosaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
              <p className="text-xs text-foreground-tertiary">
                Changes are automatically saved as you type.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

/**
 * AutosaveIndicator - Shows save status
 */
export interface AutosaveIndicatorProps {
  isSaving: boolean
  lastSaved: Date | null
}

export function AutosaveIndicator({ isSaving, lastSaved }: AutosaveIndicatorProps) {
  if (isSaving) {
    return (
      <div className="flex items-center gap-1 text-xs text-foreground-tertiary">
        <div className="w-3 h-3 border-2 border-foreground-tertiary border-t-transparent rounded-full animate-spin" />
        <span>Saving...</span>
      </div>
    )
  }
  if (lastSaved) {
    return (
      <div className="flex items-center gap-1 text-xs text-success-700">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span>Saved</span>
      </div>
    )
  }
  return null
}

/**
 * FormField - Reusable form field wrapper with label and required indicator
 */
export interface FormFieldProps {
  label: string
  required?: boolean
  children: ReactNode
  error?: string
  hint?: string
  className?: string
}

export function FormField({
  label,
  required,
  children,
  error,
  hint,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-sm font-medium text-foreground-primary">
        {label}
        {required && <span className="text-attention-600 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <span className="text-xs text-danger-600">{error}</span>
      )}
      {hint && !error && (
        <span className="text-xs text-foreground-tertiary">{hint}</span>
      )}
    </div>
  )
}
