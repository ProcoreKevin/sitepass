"use client"

import * as React from "react"
import { Tooltip, TooltipTrigger } from "react-aria-components"

import { cn } from "@/lib/utils"

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === "function") ref(node)
      else (ref as React.MutableRefObject<T | null>).current = node
    }
  }
}

function HoverCardTrigger(_props: { asChild?: boolean; children?: React.ReactNode }): null {
  return null
}
HoverCardTrigger.displayName = "HoverCardTrigger"

function HoverCardContent(
  _props: {
    className?: string
    align?: "start" | "center" | "end"
    sideOffset?: number
    children?: React.ReactNode
  },
): null {
  return null
}
HoverCardContent.displayName = "HoverCardContent"

function parseHoverCardChildren(children: React.ReactNode) {
  let trigger: React.ReactElement | undefined
  let content: React.ReactElement | undefined
  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) return
    if (child.type === HoverCardTrigger) trigger = child
    if (child.type === HoverCardContent) content = child
  })
  return { trigger, content }
}

function buildTrigger(
  el: React.ReactElement<{ asChild?: boolean; children?: React.ReactNode }> | undefined,
) {
  if (!el) return <span />
  const { asChild, children, ...rest } = el.props
  if (asChild && React.isValidElement(children)) {
    const c = children as React.ReactElement<{ ref?: React.Ref<HTMLElement>; className?: string }>
    return React.cloneElement(c, {
      ...rest,
      ref: mergeRefs(c.props.ref, (rest as { ref?: React.Ref<HTMLElement> }).ref),
      className: cn(c.props.className, (rest as { className?: string }).className),
    } as never)
  }
  return (
    <button type="button" {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}

function HoverCard({
  openDelay = 700,
  closeDelay,
  children,
}: {
  openDelay?: number
  closeDelay?: number
  children?: React.ReactNode
}) {
  const { trigger, content } = React.useMemo(() => parseHoverCardChildren(children), [children])
  const cp = (content?.props ?? {}) as React.ComponentProps<typeof HoverCardContent>
  const placement =
    cp.align === "start"
      ? ("bottom start" as const)
      : cp.align === "end"
        ? ("bottom end" as const)
        : ("bottom" as const)

  return (
    <TooltipTrigger delay={openDelay} closeDelay={closeDelay}>
      {buildTrigger(trigger)}
      <Tooltip
        data-slot="hover-card-content"
        offset={cp.sideOffset ?? 4}
        placement={placement}
        className={({ isEntering, isExiting }) =>
          cn(
            "bg-primary text-secondary ring-secondary_alt z-20 w-64 rounded-lg p-3 shadow-lg ring-1 outline-none",
            isEntering && "animate-in fade-in-0 zoom-in-95",
            isExiting && "animate-out fade-out-0 zoom-out-95",
            cp.className,
          )
        }
      >
        {cp.children}
      </Tooltip>
    </TooltipTrigger>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
