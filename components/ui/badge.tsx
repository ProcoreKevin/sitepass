"use client"

import type * as React from "react"
import { Slot } from "@/lib/ui-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/** Legacy DS: pill, 20px, `--color-badge-*` pairs (see `app/legacy-theme.css` §06). No Untitled utility rings. */
const badgeShell =
  "size-max inline-flex items-center justify-center rounded-full border border-transparent px-3 py-0 h-5 min-h-5 max-h-5 text-xs font-medium leading-none w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:size-3 [&>svg]:pointer-events-none outline-none transition-colors ring-0 shadow-none"

const badgeVariants = cva(badgeShell, {
  variants: {
    variant: {
      /** Gray chip — `badge-neutral` */
      default: "bg-[var(--color-badge-neutral-bg)] text-[var(--color-badge-neutral-text)]",
      secondary: "bg-[var(--color-badge-neutral-bg)] text-[var(--color-badge-neutral-text)]",
      /** Blue info — `badge-draft` / `badge-bidding` */
      primary: "bg-[var(--color-badge-draft-bg)] text-[var(--color-badge-draft-text)]",
      information: "bg-[var(--color-badge-draft-bg)] text-[var(--color-badge-draft-text)]",
      /** Green — `badge-construction` */
      success: "bg-[var(--color-badge-construct-bg)] text-[var(--color-badge-construct-text)]",
      /** Purple — `badge-warranty` */
      warranty: "bg-[var(--color-badge-warranty-bg)] text-[var(--color-badge-warranty-text)]",
      /** Red — `badge-danger` */
      critical: "bg-[var(--color-badge-danger-bg)] text-[var(--color-badge-danger-text)]",
      destructive: "bg-[var(--color-badge-danger-bg)] text-[var(--color-badge-danger-text)]",
      /** Amber — `badge-warning` */
      warning: "bg-[var(--color-badge-warning-bg)] text-[var(--color-badge-warning-text)]",
      /** Bordered muted label */
      outline:
        "border-[var(--color-border-default)] bg-transparent text-[var(--color-text-secondary)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"
  const v = variant ?? "default"

  return (
    <Comp data-slot="badge" data-variant={v} className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
