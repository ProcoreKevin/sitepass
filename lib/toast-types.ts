import type * as React from "react"

/** Action slot for the optional `action` prop on `toast()` (Sonner maps it to a button). */
export type ToastActionElement = React.ReactElement<{ altText: string }>

export type ToastProps = React.HTMLAttributes<HTMLDivElement> & {
  id?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: "default" | "destructive"
}
