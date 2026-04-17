"use client"

import * as React from "react"
import { Button, Disclosure, DisclosurePanel, Heading } from "react-aria-components"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

function Collapsible({
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  className,
  children,
  ...props
}: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
} & Omit<React.ComponentProps<typeof Disclosure>, "isExpanded" | "defaultExpanded" | "onExpandedChange" | "children">) {
  return (
    <Disclosure
      data-slot="collapsible"
      className={cn("group w-full min-w-0", className)}
      isExpanded={open}
      defaultExpanded={defaultOpen}
      onExpandedChange={onOpenChange}
      isDisabled={disabled}
      {...props}
    >
      {children}
    </Disclosure>
  )
}

function CollapsibleTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Heading className="flex w-full min-w-0">
      <Button
        slot="trigger"
        data-slot="collapsible-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex w-full min-w-0 flex-1 items-center justify-start gap-[4px] rounded-md py-2 text-left text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <span className="min-w-0 truncate">{children}</span>
        <ChevronDown
          aria-hidden
          className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200 ease-out group-data-[expanded]:rotate-180"
        />
      </Button>
    </Heading>
  )
}

function CollapsibleContent({ className, children, ...props }: React.ComponentProps<typeof DisclosurePanel>) {
  return (
    <DisclosurePanel data-slot="collapsible-content" className={cn("min-w-0", className)} {...props}>
      {children}
    </DisclosurePanel>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
