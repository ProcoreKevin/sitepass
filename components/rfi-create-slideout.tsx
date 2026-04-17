'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BaseCreateSlideout,
  FormField,
  AutosaveIndicator,
} from '@/shared/patterns'
import type { RFIData } from '@/components/rfi-types'

/**
 * RFI Create Slideout
 * 
 * Extends BaseCreateSlideout with RFI-specific form fields.
 * See: /guidelines/Pattern-Component-Library.md Rule 0.4 (Import & Extend)
 */

interface RFICreateSlideoutProps {
  isOpen: boolean
  onClose: () => void
  draftData?: Partial<RFIData>
  onDraftUpdate: (data: Partial<RFIData>) => void
}

/**
 * RFI-specific select options
 */
const RFI_MANAGERS = [
  { value: 'sarah-chen', label: 'Sarah Chen' },
  { value: 'mike-torres', label: 'Mike Torres' },
  { value: 'jennifer-lee', label: 'Jennifer Lee' },
  { value: 'david-kim', label: 'David Kim' },
]

const ASSIGNEES = [
  { value: 'sarah-chen', label: 'Sarah Chen' },
  { value: 'mike-torres', label: 'Mike Torres' },
  { value: 'jennifer-lee', label: 'Jennifer Lee' },
  { value: 'robert-martinez', label: 'Robert Martinez' },
  { value: 'david-kim', label: 'David Kim' },
  { value: 'amanda-rodriguez', label: 'Amanda Rodriguez' },
  { value: 'tom-wilson', label: 'Tom Wilson' },
]

/**
 * Required fields for RFI creation
 */
const REQUIRED_FIELDS = ['subject', 'assignee', 'dueDate', 'rfiManager'] as const

export function RFICreateSlideout({
  isOpen,
  onClose,
  draftData,
  onDraftUpdate,
}: RFICreateSlideoutProps) {
  const [formData, setFormData] = useState<Partial<RFIData>>(draftData || {})
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Sync with external draft data
  useEffect(() => {
    if (draftData) {
      setFormData(draftData)
    }
  }, [draftData])

  const handleFieldChange = (field: keyof RFIData, value: string) => {
    const updatedData = { ...formData, [field]: value }
    setFormData(updatedData)
    setIsSaving(true)

    // Simulate autosave
    setTimeout(() => {
      onDraftUpdate(updatedData)
      setIsSaving(false)
      setLastSaved(new Date())
    }, 300)
  }

  // Calculate completion status
  const missingFields = REQUIRED_FIELDS.filter(field => !formData[field])
  const isComplete = missingFields.length === 0

  // Format missing field names for display
  const missingFieldLabels = missingFields.map(field => {
    const labels: Record<string, string> = {
      subject: 'Subject',
      assignee: 'Assigned To',
      dueDate: 'Due Date',
      rfiManager: 'RFI Manager',
    }
    return labels[field] || field
  })

  return (
    <BaseCreateSlideout
      isOpen={isOpen}
      onClose={onClose}
      title="New RFI"
      isComplete={isComplete}
      missingFields={missingFieldLabels}
      isSaving={isSaving}
      lastSaved={lastSaved}
      width={480}
      footer={
        <div className="flex items-center justify-between">
          <AutosaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
          <p className="text-xs text-foreground-tertiary">
            Changes are automatically saved as you type. Close this panel to continue editing later.
          </p>
        </div>
      }
    >
      {/* Subject */}
      <FormField label="Subject" required>
        <Input
          value={formData.subject || ''}
          onChange={(e) => handleFieldChange('subject', e.target.value)}
          placeholder="Enter RFI subject"
          autoFocus
        />
      </FormField>

      {/* RFI Manager */}
      <FormField label="RFI Manager" required>
        <Select
          value={formData.rfiManager || ''}
          onValueChange={(value) => handleFieldChange('rfiManager', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select RFI Manager" />
          </SelectTrigger>
          <SelectContent>
            {RFI_MANAGERS.map((manager) => (
              <SelectItem key={manager.value} value={manager.label}>
                {manager.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      {/* Assigned To */}
      <FormField label="Assigned To" required>
        <Select
          value={formData.assignee || ''}
          onValueChange={(value) => handleFieldChange('assignee', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Assignee" />
          </SelectTrigger>
          <SelectContent>
            {ASSIGNEES.map((assignee) => (
              <SelectItem key={assignee.value} value={assignee.label}>
                {assignee.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      {/* Due Date */}
      <FormField label="Due Date" required>
        <Input
          type="date"
          value={formData.dueDate || ''}
          onChange={(e) => handleFieldChange('dueDate', e.target.value)}
        />
      </FormField>

      {/* Location */}
      <FormField label="Location">
        <Input
          value={formData.location || ''}
          onChange={(e) => handleFieldChange('location', e.target.value)}
          placeholder="Enter location"
        />
      </FormField>

      {/* Cost Code */}
      <FormField label="Cost Code">
        <Input
          value={formData.costCode || ''}
          onChange={(e) => handleFieldChange('costCode', e.target.value)}
          placeholder="Enter cost code"
        />
      </FormField>

      {/* Responsible Contractor */}
      <FormField label="Responsible Contractor">
        <Input
          value={formData.responsibleContractor || ''}
          onChange={(e) => handleFieldChange('responsibleContractor', e.target.value)}
          placeholder="Enter contractor name"
        />
      </FormField>
    </BaseCreateSlideout>
  )
}
