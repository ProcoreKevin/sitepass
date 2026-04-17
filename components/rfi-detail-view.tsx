'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import {
  BaseDetailPane,
  DetailField,
  DetailSection,
} from '@/shared/patterns'
import type { RFIData } from '@/components/rfi-types'

/**
 * RFI Detail View
 * 
 * Extends BaseDetailPane with RFI-specific content and actions.
 * See: /guidelines/Pattern-Component-Library.md Rule 0.4 (Import & Extend)
 */

interface RFIDetailViewProps {
  rfiData: RFIData
  onClose: () => void
  onOpenFullView?: () => void
  onNavigateUp?: () => void
  onNavigateDown?: () => void
  canNavigateUp?: boolean
  canNavigateDown?: boolean
}

export function RFIDetailView({
  rfiData,
  onClose,
  onOpenFullView,
  onNavigateUp,
  onNavigateDown,
  canNavigateUp = false,
  canNavigateDown = false,
}: RFIDetailViewProps) {
  const [activeTab, setActiveTab] = useState<string>('general')
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [formData, setFormData] = useState(rfiData)

  // Reset form when switching RFIs
  useEffect(() => {
    setFormData(rfiData)
    setIsDirty(false)
    setIsEditMode(false)
  }, [rfiData.id])

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
  }

  const handleSave = () => {
    setIsDirty(false)
    setIsEditMode(false)
  }

  const handleCancel = () => {
    setFormData(rfiData)
    setIsDirty(false)
    setIsEditMode(false)
  }

  const editInputClass = cn(
    'w-full text-sm text-foreground',
    'border-2 border-foreground rounded px-2 py-1',
    'focus:outline-none focus:border-foreground'
  )

  // Define tabs with their content
  const tabs = [
    {
      id: 'general',
      label: 'General',
      content: (
        <div className="flex flex-col gap-6">
          {/* Description */}
          <DetailSection title="Description">
            {isEditMode ? (
              <textarea
                value={formData.officialResponse || ''}
                onChange={(e) => handleFieldChange('officialResponse', e.target.value)}
                rows={4}
                className={editInputClass}
              />
            ) : (
              <p className="text-sm text-foreground leading-relaxed">
                The electrical panel location shown on Drawing E-201 Rev. 3 (Fire Pump Room
                Layout) conflicts with the fire pump controller installation and creates multiple
                code compliance issues.
              </p>
            )}
          </DetailSection>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <DetailField label="RFI Manager" value={rfiData.rfiManager} />
            <DetailField
              label="Ball In Court"
              value={rfiData.assignee || '\u2014'}
              isEditing={isEditMode}
              editValue={formData.assignee}
              onEditChange={(v) => handleFieldChange('assignee', v)}
              editInputClassName={editInputClass}
            />
            <DetailField label="Created By" value={rfiData.createdBy} />
            <DetailField label="Creation Date" value={rfiData.creationDate} />
            <DetailField
              label="Due Date"
              value={rfiData.dueDate || '\u2014'}
              isEditing={isEditMode}
              editValue={formData.dueDate}
              onEditChange={(v) => handleFieldChange('dueDate', v)}
              editInputClassName={editInputClass}
            />
            <DetailField
              label="Location"
              value={rfiData.location}
              isEditing={isEditMode}
              editValue={formData.location}
              onEditChange={(v) => handleFieldChange('location', v)}
              editInputClassName={editInputClass}
            />
            <DetailField label="Cost Code" value={rfiData.costCode} isMono />
            <DetailField label="Responsible Contractor" value={rfiData.responsibleContractor} />
            <div>
              <span className="text-xs text-muted-foreground block mb-1">Cost Impact</span>
              <div>
                <span className="text-sm text-foreground">{rfiData.costImpact}</span>
                {rfiData.costAmount && (
                  <span className="text-sm text-muted-foreground ml-2">({rfiData.costAmount})</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block mb-1">Schedule Impact</span>
              <div>
                <span className="text-sm text-foreground">{rfiData.scheduleImpact}</span>
                {rfiData.scheduleDays && (
                  <span className="text-sm text-muted-foreground ml-2">({rfiData.scheduleDays} days)</span>
                )}
              </div>
            </div>
          </div>

          {/* Attachments */}
          <DetailSection title="Attachments">
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-video bg-accent rounded-sm overflow-hidden border border-border"
                >
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    Image {i}
                  </div>
                </div>
              ))}
            </div>
          </DetailSection>

          {/* Official Response */}
          {rfiData.officialResponse && (
            <DetailSection title="Official Response">
              <div className="bg-accent rounded-sm p-4">
                <p className="text-sm text-foreground">
                  {rfiData.officialResponse}
                </p>
              </div>
            </DetailSection>
          )}
        </div>
      ),
    },
    {
      id: 'responses',
      label: 'Responses',
      content: (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">
            No responses yet
          </p>
        </div>
      ),
    },
  ]

  // Non-edit mode footer with RFI-specific actions
  const defaultFooter = !isEditMode ? (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Correspondence
        </Button>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Change Event
        </Button>
      </div>
      <Button size="sm">
        Close RFI
      </Button>
    </div>
  ) : undefined

  return (
    <BaseDetailPane
      identifier={rfiData.rfiNumber}
      title={rfiData.subject}
      statusBadge={<StatusBadge status={rfiData.status} />}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onClose={onClose}
      onOpenFullView={onOpenFullView}
      onNavigateUp={onNavigateUp}
      onNavigateDown={onNavigateDown}
      canNavigateUp={canNavigateUp}
      canNavigateDown={canNavigateDown}
      isEditMode={isEditMode}
      onEditModeChange={setIsEditMode}
      isDirty={isDirty}
      onSave={handleSave}
      onCancel={handleCancel}
      footer={defaultFooter}
    />
  )
}
