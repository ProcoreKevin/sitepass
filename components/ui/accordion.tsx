"use client"

import * as React from "react"
import { Button, Disclosure, DisclosureGroup, DisclosurePanel, Heading } from "react-aria-components"
import { Minus, Plus } from "lucide-react"

import { cn } from "@/lib/utils"

function toSet(v: string | string[] | undefined): Set<string> | undefined {
  if (v === undefined) return undefined
  return new Set(Array.isArray(v) ? v : [v])
}

function fromExpandedKeys(keys: Set<string>, multiple: boolean): string | string[] | undefined {
  if (keys.size === 0) return undefined
  if (multiple) return [...keys]
  return [...keys][0]
}

function Accordion({
  className,
  type = "single",
  collapsible = false,
  value,
  defaultValue,
  onValueChange,
  children,
  ...props
}: React.ComponentProps<typeof DisclosureGroup> & {
  type?: "single" | "multiple"
  collapsible?: boolean
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (v: string | string[] | undefined) => void
}) {
  const multiple = type === "multiple"
  const isControlled = value !== undefined
  const expandedKeys = isControlled
    ? new Set(
        !value || (Array.isArray(value) && value.length === 0)
          ? []
          : Array.isArray(value)
            ? value
            : [value],
      )
    : undefined
  const defaultExpandedKeys = !isControlled ? toSet(defaultValue) : undefined

  return (
    <DisclosureGroup
      data-slot="accordion"
      className={cn("w-full min-w-0", className)}
      allowsMultipleExpanded={multiple}
      disallowEmptySelection={type === "single" && !collapsible}
      expandedKeys={expandedKeys}
      defaultExpandedKeys={defaultExpandedKeys}
      onExpandedChange={keys => {
        onValueChange?.(fromExpandedKeys(keys, multiple))
      }}
      {...props}
    >
      {children}
    </DisclosureGroup>
  )
}

function AccordionItem({
  className,
  value,
  children,
  ...props
}: { className?: string; value: string; children?: React.ReactNode } & Omit<
  React.ComponentProps<typeof Disclosure>,
  "id" | "children"
>) {
  return (
    <Disclosure
      id={value}
      data-slot="accordion-item"
      className={cn("group w-full min-w-0 border-b last:border-b-0", className)}
      {...props}
    >
      {children}
    </Disclosure>
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Heading className="flex w-full min-w-0">
      <Button
        slot="trigger"
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 group flex w-full min-w-0 flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <span className="min-w-0 flex-1">{children}</span>
        <span className="relative size-4 shrink-0">
          <Plus className="text-muted-foreground pointer-events-none absolute inset-0 size-4 transition-transform duration-200 group-data-[expanded]:hidden" />
          <Minus className="text-muted-foreground pointer-events-none absolute inset-0 hidden size-4 transition-transform duration-200 group-data-[expanded]:block" />
        </span>
      </Button>
    </Heading>
  )
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof DisclosurePanel>) {
  return (
    <DisclosurePanel
      data-slot="accordion-content"
      className={cn(
        "min-w-0 overflow-hidden text-sm data-[entering]:animate-accordion-down data-[exiting]:animate-accordion-up",
      )}
      {...props}
    >
      <div className={cn("min-w-0 pt-0 pb-4", className)}>{children}</div>
    </DisclosurePanel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
