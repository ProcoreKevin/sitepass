'use client'

import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'Open' | 'Closed' | 'Draft' | string
  className?: string
}

/**
 * NGX-styled status badges using semantic color tokens:
 * - Open   -> success (green): success-25 bg, success-800 text
 * - Closed -> neutral (gray):  asphalt-100 bg, asphalt-600 text
 * - Draft  -> neutral (gray):  asphalt-100 bg, asphalt-500 text
 */
const STATUS_STYLES: Record<string, string> = {
  Open: 'bg-success-25 text-success-800',
  Closed: 'bg-asphalt-100 text-asphalt-600',
  Draft: 'bg-asphalt-100 text-asphalt-500',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] || 'bg-asphalt-100 text-asphalt-600'

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded',
        style,
        className
      )}
    >
      {status}
    </span>
  )
}
