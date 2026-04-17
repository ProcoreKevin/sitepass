"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { type ReactNode, useId } from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

/** Max-width content column + page padding (8px grid: 32px horizontal). */
export function StudioPageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-0 w-full min-w-0 max-w-none flex-1 flex-col gap-8 px-8 py-8",
        /* Optional cap: pass e.g. max-w-7xl — default is full-width responsive shell */
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Sub-page title block: back link, H1, optional description. */
export function StudioSubpageHeader({ title, description }: { title: string; description?: ReactNode }) {
  return (
    <header className="border-border-default flex flex-col gap-2 border-b pb-6">
      <p className="text-sm font-normal text-foreground-secondary">
        <Link
          href="/dev/uui-studio"
          className="text-foreground-primary font-medium underline-offset-4 transition-colors duration-150 hover:underline"
        >
          ← Studio overview
        </Link>
      </p>
      <h2 className="text-foreground-primary text-xl font-medium tracking-tight">{title}</h2>
      {description ? (
        <div className="text-foreground-secondary w-full min-w-0 max-w-none text-sm font-normal leading-relaxed">
          {description}
        </div>
      ) : null}
    </header>
  )
}

/** Bordered surface for stats or summary blocks (panel padding p-6). */
export function StudioCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "border-border-default bg-background-primary rounded-lg border shadow-none",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function StudioCardHeader({ title, description }: { title: string; description?: ReactNode }) {
  return (
    <div className="border-border-default border-b px-6 py-4">
      <h2 className="text-foreground-primary text-base font-medium">{title}</h2>
      {description ? <p className="text-foreground-secondary mt-1 text-sm font-normal">{description}</p> : null}
    </div>
  )
}

export function StudioCardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-6", className)}>{children}</div>
}

/** Filter / control row: secondary surface, 16px gaps between fields. */
export function StudioToolbar({ children }: { children: ReactNode }) {
  return (
    <div className="border-border-default bg-background-primary min-w-0 w-full rounded-lg border p-6 shadow-none">
      {/* min-w-0 + basis-full on meta lines (see facade gallery) so flex-1 fields keep width */}
      <div className="flex min-w-0 w-full flex-wrap items-end gap-x-4 gap-y-3">{children}</div>
    </div>
  )
}

export function StudioField({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-[160px] flex-1 flex-col gap-2", className)}>
      <span className="text-foreground-secondary text-xs font-medium">{label}</span>
      {children}
    </div>
  )
}

/** Full-width search with leading icon + optional hint (legacy-safe padding via data-icon-start). */
export function StudioSearchControl({
  hint,
  className,
  inputClassName,
  ...inputProps
}: React.ComponentProps<typeof Input> & {
  hint?: string
  inputClassName?: string
}) {
  const hintId = useId()
  return (
    <div className={cn("min-w-0 w-full", className)}>
      <div className="relative min-w-[12rem] w-full max-w-none">
        <Search
          className="text-foreground-tertiary pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden
        />
        <Input
          data-icon-start=""
          type="search"
          className={cn("w-full pl-9", inputClassName)}
          aria-describedby={hint ? hintId : undefined}
          {...inputProps}
        />
      </div>
      {hint ? (
        <p id={hintId} className="text-foreground-tertiary mt-1.5 text-xs font-normal leading-relaxed">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/** Table wrapper: border + radius; scroll lives in parent. */
export function StudioTablePanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "border-border-default bg-background-primary min-h-0 min-w-0 flex-1 overflow-auto rounded-lg border shadow-none",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function StudioFooterMeta({ children }: { children: ReactNode }) {
  return <div className="text-foreground-tertiary text-xs font-medium">{children}</div>
}
