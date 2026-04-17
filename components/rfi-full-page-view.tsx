'use client'

import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Pencil,
  X as XIcon,
  Plus,
  Paperclip,
  MoreHorizontal,
  Trash2,
  Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import type { RFIData } from '@/components/rfi-types'

interface RFIFullPageViewProps {
  rfiData: RFIData
  onBack: () => void
}

const MOCK_ATTACHMENTS = [
  { id: '1', name: 'Beam-Detail-Photo.jpg', size: '2.4 MB' },
  { id: '2', name: 'Structural-Calc.pdf', size: '1.2 MB' },
  { id: '3', name: 'Level-5-Plan.pdf', size: '3.8 MB' },
  { id: '4', name: 'Load-Analysis.xlsx', size: '856 KB' },
]

export function RFIFullPageView({ rfiData, onBack }: RFIFullPageViewProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'responses'>('general')
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [formData, setFormData] = useState(rfiData)

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
    'border-2 border-foreground rounded px-3 py-2',
    'focus:outline-none focus:border-foreground'
  )

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Bar */}
      <div className="flex-shrink-0 border-b border-border">
        {/* Back + Title Row */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-1.5 rounded hover:bg-accent transition-colors"
              aria-label="Back to RFIs"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <StatusBadge status={rfiData.status} />
              <span className="text-sm font-medium text-muted-foreground">
                {rfiData.rfiNumber}
              </span>
              <h1 className="text-lg font-semibold text-foreground">
                {rfiData.subject}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditMode(true)}
              disabled={isEditMode}
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button size="sm">
              <XIcon className="w-4 h-4 mr-1" />
              Close RFI
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-6 gap-6">
          <button
            onClick={() => setActiveTab('general')}
            className={cn(
              'py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
              activeTab === 'general'
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('responses')}
            className={cn(
              'py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
              activeTab === 'responses'
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            Responses
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-[var(--spacing-page-margin)]">
        {/* Main Content */}
        <div className="flex gap-[var(--spacing-card-padding)]">
          {activeTab === 'general' && (
            <>
              <div className="flex-1 flex flex-col gap-[var(--spacing-card-padding)] min-w-0">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Description
                  </h3>
                  {isEditMode ? (
                    <textarea
                      value={formData.subject}
                      onChange={(e) => handleFieldChange('subject', e.target.value)}
                      rows={4}
                      className={editInputClass}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We need clarification on the load capacity requirements for the transfer beams
                      on Level 5. The structural drawings show W24x84 beams, but the specifications
                      call out W24x94. Please confirm which beam size should be used and provide
                      updated calculations if necessary.
                    </p>
                  )}
                </div>

                {/* Attachments */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Attachments
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {MOCK_ATTACHMENTS.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-start gap-3 p-3 border border-border rounded-sm hover:bg-accent transition-colors cursor-pointer"
                      >
                        <Paperclip className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {attachment.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {attachment.size}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Official Response */}
                {rfiData.officialResponse && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">
                      Official Response
                    </h3>
                    <div className="p-4 bg-accent rounded-sm border border-border">
                      {isEditMode ? (
                        <textarea
                          value={formData.officialResponse}
                          onChange={(e) => handleFieldChange('officialResponse', e.target.value)}
                          rows={3}
                          className={editInputClass}
                        />
                      ) : (
                        <p className="text-sm text-foreground leading-relaxed">
                          {rfiData.officialResponse}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Correspondence
                  </Button>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Create Change Event
                  </Button>
                </div>
              </div>

              {/* Right Sidebar - Details */}
              <div className="w-72 flex-shrink-0">
                <h3 className="text-sm font-semibold text-foreground mb-4">Details</h3>
                <div className="flex flex-col gap-4">
                  <SideDetail label="Location" value={rfiData.location} />
                  <SideDetail label="Created By" value={rfiData.createdBy} />
                  <SideDetail label="RFI Manager" value={rfiData.rfiManager} />
                  <SideDetail label="Ball in Court" value={rfiData.assignee || '\u2014'} />
                  <SideDetail label="Date Submitted" value={rfiData.creationDate} />
                  <SideDetail label="Due Date" value={rfiData.dueDate || '\u2014'} />
                  <SideDetail label="Cost Impact" value={rfiData.costImpact} />
                  <SideDetail label="Cost Code" value={rfiData.costCode} isMono />
                  <SideDetail label="Schedule Impact" value={rfiData.scheduleImpact} />
                  <SideDetail
                    label="Schedule Days"
                    value={rfiData.scheduleDays ? `${rfiData.scheduleDays} days` : '\u2014'}
                  />
                  <SideDetail label="Responsible Contractor" value={rfiData.responsibleContractor} />
                </div>
              </div>
            </>
          )}

          {activeTab === 'responses' && (
            <div className="flex-1 flex items-center justify-center h-64">
              <p className="text-sm text-muted-foreground">
                No responses yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Mode Footer */}
      {isEditMode && (
        <div className="flex-shrink-0 border-t border-border px-6 py-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {isDirty ? 'Unsaved changes' : 'Edit mode'}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={!isDirty}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SideDetail({
  label,
  value,
  isMono,
}: {
  label: string
  value: string
  isMono?: boolean
}) {
  return (
    <div>
      <span className="text-xs text-muted-foreground block mb-0.5">{label}</span>
      <span className={cn('text-sm text-foreground', isMono && 'font-mono')}>
        {value || '\u2014'}
      </span>
    </div>
  )
}
