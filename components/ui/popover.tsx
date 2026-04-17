"use client"

import * as React from "react"
import { Pressable } from "react-aria"
import { DialogTrigger, Popover as RACPopover } from "react-aria-components"

import { cn } from "@/lib/utils"

/** Bridges DialogTrigger's PressResponder (onPress) to native DOM triggers. */
function PopoverPressBridge({ children }: { children: React.ReactElement }) {
  return <Pressable>{children}</Pressable>
}

function PopoverTrigger(_props: { asChild?: boolean; children?: React.ReactNode }): null {
  return null
}
PopoverTrigger.displayName = "PopoverTrigger"

function PopoverAnchor(_props: { children?: React.ReactNode }): null {
  return null
}
PopoverAnchor.displayName = "PopoverAnchor"

function PopoverContent(
  _props: {
    className?: string
    children?: React.ReactNode
    align?: "start" | "center" | "end"
    /** Default `bottom`. Use `top` for menus that should open above the trigger (e.g. assist tray). */
    side?: "top" | "bottom"
    sideOffset?: number
  },
): null {
  return null
}
PopoverContent.displayName = "PopoverContent"

function parsePopoverChildren(children: React.ReactNode) {
  let trigger: React.ReactNode
  let asChild = false
  let anchor: React.ReactNode
  let contentClassName: string | undefined
  let content: React.ReactNode
  let align: "start" | "center" | "end" = "center"
  let side: "top" | "bottom" = "bottom"
  let sideOffset = 4

  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) return
    if (child.type === PopoverTrigger) {
      const p = child.props as { asChild?: boolean; children?: React.ReactNode }
      asChild = !!p.asChild
      trigger = p.children
    }
    if (child.type === PopoverAnchor) {
      anchor = (child.props as { children?: React.ReactNode }).children
    }
    if (child.type === PopoverContent) {
      const p = child.props as {
        className?: string
        children?: React.ReactNode
        align?: "start" | "center" | "end"
        side?: "top" | "bottom"
        sideOffset?: number
      }
      contentClassName = p.className
      content = p.children
      if (p.align) align = p.align
      if (p.side != null) side = p.side
      if (p.sideOffset != null) sideOffset = p.sideOffset
    }
  })

  return { trigger, asChild, anchor, content, contentClassName, align, side, sideOffset }
}

const alignToPlacement = (a: "start" | "center" | "end", side: "top" | "bottom") => {
  if (side === "top") {
    if (a === "start") return "top start" as const
    if (a === "end") return "top end" as const
    return "top" as const
  }
  if (a === "start") return "bottom start" as const
  if (a === "end") return "bottom end" as const
  return "bottom" as const
}

function Popover({
  children,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
}: {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { trigger, asChild, content, contentClassName, align, side, sideOffset } = React.useMemo(
    () => parsePopoverChildren(children),
    [children],
  )

  const triggerNode =
    asChild && React.isValidElement(trigger) ? (
      typeof trigger.type === "string" ? (
        <PopoverPressBridge>{trigger}</PopoverPressBridge>
      ) : (
        trigger
      )
    ) : (
      <PopoverPressBridge>
        <button type="button" className="inline-flex">
          {trigger}
        </button>
      </PopoverPressBridge>
    )

  return (
    <DialogTrigger isOpen={controlledOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {triggerNode}
      <RACPopover
        offset={sideOffset}
        placement={alignToPlacement(align, side)}
        className={({ isEntering, isExiting }) =>
          cn(
            "border-border bg-card text-card-foreground z-50 w-72 rounded-xl border p-4 shadow-lg outline-none",
            isEntering && "animate-in fade-in-0 zoom-in-95",
            isExiting && "animate-out fade-out-0 zoom-out-95",
            contentClassName,
          )
        }
      >
        {content}
      </RACPopover>
    </DialogTrigger>
  )
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
