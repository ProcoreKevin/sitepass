"use client"

import * as React from "react"
import { Tooltip as RACTooltip, TooltipTrigger as RACTooltipTrigger } from "react-aria-components"

import { cn } from "@/lib/utils"

const TooltipDelayContext = React.createContext(0)

function TooltipProvider({
  children,
  delayDuration = 0,
}: {
  children: React.ReactNode
  delayDuration?: number
}) {
  return <TooltipDelayContext.Provider value={delayDuration}>{children}</TooltipDelayContext.Provider>
}

function TooltipTrigger(_props: { asChild?: boolean; children?: React.ReactNode }): null {
  return null
}
TooltipTrigger.displayName = "TooltipTrigger"

function TooltipContent(_props: { className?: string; children?: React.ReactNode; sideOffset?: number }): null {
  return null
}
TooltipContent.displayName = "TooltipContent"

function parseTooltipChildren(children: React.ReactNode) {
  let trigger: React.ReactNode
  let asChild = false
  let contentClassName: string | undefined
  let content: React.ReactNode
  let sideOffset = 4

  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) return
    if (child.type === TooltipTrigger) {
      const p = child.props as { asChild?: boolean; children?: React.ReactNode }
      asChild = !!p.asChild
      trigger = p.children
    }
    if (child.type === TooltipContent) {
      const p = child.props as { className?: string; children?: React.ReactNode; sideOffset?: number }
      contentClassName = p.className
      content = p.children
      if (p.sideOffset != null) sideOffset = p.sideOffset
    }
  })

  return { trigger, asChild, content, contentClassName, sideOffset }
}

function Tooltip({ children, delayDuration: delayDurationProp, ...rest }: { children?: React.ReactNode; delayDuration?: number }) {
  const delayFromProvider = React.useContext(TooltipDelayContext)
  const delayDuration = delayDurationProp ?? delayFromProvider ?? 0
  const { trigger, asChild, content, contentClassName, sideOffset } = React.useMemo(
    () => parseTooltipChildren(children),
    [children],
  )

  const triggerNode =
    asChild && React.isValidElement(trigger) ? trigger : <span className="inline-flex">{trigger}</span>

  return (
    <RACTooltipTrigger delay={delayDuration} {...rest}>
      {triggerNode}
      <RACTooltip
        data-slot="tooltip-content"
        offset={sideOffset}
        className={({ isEntering, isExiting }) =>
          cn(
            "z-20 max-w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-lg px-3 py-1.5 text-xs font-medium shadow-lg outline-none",
            /* Base contrast; `[data-theme="legacy"] [data-slot="tooltip-content"]` in legacy-theme.css refines */
            "bg-[var(--color-chart-tooltip-bg)] text-[var(--color-chart-tooltip-fg)] [&_p]:text-inherit",
            isEntering && "animate-in fade-in-0 zoom-in-95",
            isExiting && "animate-out fade-out-0 zoom-out-95",
            contentClassName,
          )
        }
      >
        {content}
      </RACTooltip>
    </RACTooltipTrigger>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

/** Design-System Untitled tooltip (`title` / `description` / `arrow` API on `Tooltip`). */
export {
  Tooltip as UntitledTooltip,
  TooltipTrigger as UntitledTooltipTrigger,
} from "@/components/base/tooltip/tooltip"
