'use client'

import { useState, useEffect } from 'react'
import {
  X,
  Maximize2,
  ChevronUp,
  ChevronDown,
  Pencil,
  Check,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { OpenItem } from '@/lib/open-items-types'

interface OpenItemsDetailViewProps {
  item: OpenItem
  onClose: () => void
  onNavigateUp?: () => void
  onNavigateDown?: () => void
  canNavigateUp?: boolean
  canNavigateDown?: boolean
}

function DetailField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <span className="text-xs text-foreground-tertiary block mb-0.5">{label}</span>
      <span className={cn('text-sm text-foreground-primary', mono && 'font-mono')}>{value || '\u2014'}</span>
    </div>
  )
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-semibold text-foreground-tertiary uppercase tracking-wider">{title}</h4>
      {children}
    </div>
  )
}

const STATUS_STYLES: Record<string, string> = {
  'Open':           'bg-success-25 text-success-800',
  'Pending Review': 'bg-asphalt-100 text-asphalt-500',
  'In Progress':    'bg-asphalt-50 text-asphalt-800',
}

export function OpenItemsDetailView({
  item,
  onClose,
  onNavigateUp,
  onNavigateDown,
  canNavigateUp = false,
  canNavigateDown = false,
}: OpenItemsDetailViewProps) {
  const [activeTab, setActiveTab] = useState('general')

  // Reset tab when switching items
  useEffect(() => {
    setActiveTab('general')
  }, [item.id])

  const statusStyle = STATUS_STYLES[item.status] ?? 'bg-asphalt-100 text-asphalt-600'

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'activity', label: 'Activity' },
    { id: 'attachments', label: 'Attachments' },
  ]

  return (
    <div className="flex flex-col h-full bg-white" data-theme="legacy">
      {/* ── Header ── */}
      <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-border-default flex-shrink-0">
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-foreground-tertiary uppercase tracking-wide">{item.type}</span>
            <span className={cn('inline-flex items-center px-2 py-0.5 text-xs font-medium rounded', statusStyle)}>
              {item.status}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-foreground-primary leading-snug line-clamp-2">
            {item.description}
          </h3>
        </div>

        {/* Nav + Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost" size="icon" className="h-7 w-7"
            onClick={onNavigateUp}
            disabled={!canNavigateUp}
            aria-label="Previous item"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost" size="icon" className="h-7 w-7"
            onClick={onNavigateDown}
            disabled={!canNavigateDown}
            aria-label="Next item"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Open full view">
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose} aria-label="Close">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-border-default px-5 flex-shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'py-2.5 mr-5 text-xs font-medium border-b-2 transition-colors -mb-px',
              activeTab === tab.id
                ? 'border-foreground-primary text-foreground-primary'
                : 'border-transparent text-foreground-tertiary hover:text-foreground-primary'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {activeTab === 'general' && (
          <div className="flex flex-col gap-6">
            <DetailSection title="Details">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <DetailField label="Type" value={item.type} />
                <DetailField label="Status" value={item.status} />
                <DetailField label="Assignee" value={item.assignee} />
                <DetailField label="Due Date" value={item.dueDate} />
                <DetailField label="Project" value={item.project ?? 'Universal Construction'} />
                <DetailField label="Created" value={item.date} />
              </div>
            </DetailSection>

            <DetailSection title="Description">
              <p className="text-sm text-foreground-primary leading-relaxed">{item.description}</p>
            </DetailSection>

            {item.overdue && (
              <div className="rounded bg-destructive/10 border border-destructive/20 px-3 py-2">
                <p className="text-xs font-medium text-destructive">This item is overdue.</p>
              </div>
            )}

            <DetailSection title="Related Item">
              <button className="flex items-center gap-1.5 text-sm text-foreground-primary hover:underline">
                <ExternalLink className="w-3.5 h-3.5 text-foreground-tertiary" />
                {item.type} — {item.description.split(' ').slice(0, 4).join(' ')}...
              </button>
            </DetailSection>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="text-center py-12">
            <p className="text-sm text-foreground-tertiary">No activity recorded yet.</p>
          </div>
        )}

        {activeTab === 'attachments' && (
          <div className="text-center py-12">
            <p className="text-sm text-foreground-tertiary">No attachments.</p>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border-default flex-shrink-0">
        <Button variant="outline" size="sm">
          <Pencil className="w-3.5 h-3.5 mr-1.5" />
          Edit
        </Button>
        <Button size="sm" className="bg-foreground-primary text-foreground-inverse hover:bg-foreground-primary/90">
          <Check className="w-3.5 h-3.5 mr-1.5" />
          Mark Resolved
        </Button>
      </div>
    </div>
  )
}
