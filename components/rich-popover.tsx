"use client"

import * as React from "react"
import { Popover as RACPopover } from "react-aria-components"

import { cn } from "@/lib/utils"
import { useWorkspace } from "./workspace-shell"

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === "function") ref(node)
      else (ref as React.MutableRefObject<T | null>).current = node
    }
  }
}

function RichPopoverTrigger(_props: {
  asChild?: boolean
  children?: React.ReactNode
  onPositionDetected?: (align: "start" | "end") => void
}): null {
  return null
}
RichPopoverTrigger.displayName = "RichPopoverTrigger"

function RichPopoverContent(
  _props: {
    className?: string
    children?: React.ReactNode
    align?: "start" | "center" | "end"
    sideOffset?: number
    /** Applied to the scrollable inner wrapper (default `p-3`). Use `p-0` when the child handles padding (e.g. header dropdowns). */
    scrollClassName?: string
    stickyFooter?: React.ReactNode
    autoAlign?: boolean
  },
): null {
  return null
}
RichPopoverContent.displayName = "RichPopoverContent"

function findRichPopoverContent(node: React.ReactNode): React.ReactElement | undefined {
  let found: React.ReactElement | undefined
  const walk = (n: React.ReactNode) => {
    React.Children.forEach(n, child => {
      if (!React.isValidElement(child)) return
      if (child.type === RichPopoverContent) {
        found = child
        return
      }
      walk((child.props as { children?: React.ReactNode }).children)
    })
  }
  walk(node)
  return found
}

function mapRichPopoverTree(
  node: React.ReactNode,
  replaceTrigger: (el: React.ReactElement) => React.ReactNode,
): React.ReactNode {
  return React.Children.map(node, child => {
    if (child == null || child === false) return child
    if (!React.isValidElement(child)) return child
    if (child.type === RichPopoverTrigger) {
      return replaceTrigger(child)
    }
    if (child.type === RichPopoverContent) {
      return null
    }
    const inner = (child.props as { children?: React.ReactNode }).children
    if (inner !== undefined) {
      const mapped = mapRichPopoverTree(inner, replaceTrigger)
      return React.cloneElement(child, {}, mapped)
    }
    return child
  })
}

const alignToPlacement = (a: "start" | "center" | "end") => {
  if (a === "start") return "bottom start" as const
  if (a === "end") return "bottom end" as const
  return "bottom" as const
}

const RichPopover = ({
  children,
  open,
  defaultOpen,
  onOpenChange,
}: {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const workspace = useWorkspace()
  const triggerRef = React.useRef<HTMLElement | null>(null)
  const [internalOpen, setInternalOpen] = React.useState(!!defaultOpen)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  const contentEl = React.useMemo(() => findRichPopoverContent(children), [children])

  const cp = (contentEl?.props ?? {}) as React.ComponentProps<typeof RichPopoverContent>
  const {
    className: contentClassName,
    children: body,
    align: alignProp = "start",
    sideOffset = 8,
    scrollClassName,
    stickyFooter,
    autoAlign,
  } = cp

  const [dynamicAlign, setDynamicAlign] = React.useState<"start" | "end">("start")

  React.useEffect(() => {
    if (!autoAlign) return
    const noop = () => {}
    window.addEventListener("resize", noop)
    return () => window.removeEventListener("resize", noop)
  }, [autoAlign, workspace.sidebarOpen, workspace.assistOpen, workspace.splitViewOpen])

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next)
      if (!next && autoAlign) setDynamicAlign("start")
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange, autoAlign],
  )

  const finalAlign = autoAlign ? dynamicAlign : alignProp === "end" ? "end" : alignProp === "center" ? "center" : "start"
  const placement = alignToPlacement(
    finalAlign === "end" ? "end" : finalAlign === "center" ? "center" : "start",
  )

  const replaceTrigger = React.useCallback(
    (el: React.ReactElement) => {
      const { asChild, children: inner, onPositionDetected } = el.props as {
        asChild?: boolean
        children?: React.ReactNode
        onPositionDetected?: (align: "start" | "end") => void
      }

      const runPosition = () => {
        if (!onPositionDetected || !triggerRef.current) return
        const rect = triggerRef.current.getBoundingClientRect()
        const buttonCenterX = rect.left + rect.width / 2
        const sidebarWidth = 0 /* legacy shell: no left tool rail */
        const splitViewWidth = workspace.getSplitViewWidth()
        const assistWidth = workspace.getAssistWidth()
        const workspaceStartX = sidebarWidth
        const workspaceEndX = window.innerWidth - assistWidth - splitViewWidth
        const workspaceWidth = workspaceEndX - workspaceStartX
        const workspaceHalfX = workspaceStartX + workspaceWidth / 2
        onPositionDetected(buttonCenterX > workspaceHalfX ? "end" : "start")
      }

      const toggle = () => {
        runPosition()
        setOpen(!isOpen)
      }

      if (asChild && React.isValidElement(inner)) {
        const c = inner as React.ReactElement<{ ref?: React.Ref<HTMLElement>; onClick?: React.MouseEventHandler }>
        return React.cloneElement(c, {
          ref: mergeRefs(triggerRef, c.props.ref),
          onClick: (e: React.MouseEvent) => {
            toggle()
            c.props.onClick?.(e)
          },
        } as never)
      }

      return (
        <button type="button" ref={mergeRefs(triggerRef, undefined)} onClick={() => toggle()}>
          {inner}
        </button>
      )
    },
    [workspace, setOpen, isOpen],
  )

  const mainTree = React.useMemo(
    () => mapRichPopoverTree(children, replaceTrigger),
    [children, replaceTrigger],
  )

  return (
    <>
      {mainTree}
      <RACPopover
        triggerRef={triggerRef}
        isOpen={isOpen}
        onOpenChange={setOpen}
        offset={sideOffset}
        placement={placement}
        className={({ isEntering, isExiting }) =>
          cn(
            "z-50 flex max-h-[50vh] min-h-[30vh] flex-col outline-none",
            /* Default shell — callers can override to match header dropdowns (white + asphalt border + shadow-lg). */
            "rounded-[length:var(--border-radius-md)] border border-[var(--color-border-default)]",
            "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] shadow-[var(--shadow-md)]",
            isEntering && "animate-in fade-in-0 zoom-in-95",
            isExiting && "animate-out fade-out-0 zoom-out-95",
            contentClassName,
          )
        }
      >
        <div className={cn("flex-1 overflow-y-auto", scrollClassName ?? "p-3")}>{body}</div>
        {stickyFooter ? (
          <div className="sticky bottom-0 flex h-[44px] items-center border-t border-[var(--color-border-default)] bg-[var(--color-bg-primary)] p-3">
            {stickyFooter}
          </div>
        ) : null}
      </RACPopover>
    </>
  )
}

const RichPopoverWithAutoAlign = ({ children }: { children: React.ReactNode }) => {
  const [alignment, setAlignment] = React.useState<"start" | "end">("start")

  return (
    <RichPopover>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === RichPopoverTrigger) {
            return React.cloneElement(
              child as React.ReactElement<{ onPositionDetected?: (a: "start" | "end") => void }>,
              { onPositionDetected: setAlignment },
            )
          }
          if (child.type === RichPopoverContent) {
            return React.cloneElement(
              child as React.ReactElement<{ autoAlign?: boolean; align?: "start" | "end" }>,
              { autoAlign: true, align: alignment },
            )
          }
        }
        return child
      })}
    </RichPopover>
  )
}

export { RichPopover, RichPopoverTrigger, RichPopoverContent, RichPopoverWithAutoAlign }
