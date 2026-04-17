"use client"

/**
 * Context menu — React Aria Components + Untitled-aligned surfaces (no Radix).
 * Item markers are aliases of dropdown-menu markers so renderComposedMenuTree matches.
 *
 * **Legacy theme:** `[data-theme="legacy"]` on `<html>` — menu panel uses semantic surfaces; destructive
 * rows use the same tokens as destructive buttons (`app/legacy-theme.css`, search `menu-item` + `destructive`).
 *
 * **Destructive actions:** set `variant="destructive"` on `ContextMenuItem` (mirrors `components/ui-next/rac-button.tsx` destructive).
 *
 * **Checkbox rows:** composed tree renders `@/components/ui/checkbox` so legacy `legacy-theme.css` rules apply (`[data-slot="checkbox"]` / indicator).
 */

import * as React from "react"
import { Menu, Popover } from "react-aria-components"

import {
  buildMenuTrigger,
  parseMenuRootChildren,
  placementFromSideAlign,
  renderComposedMenuTree,
  DropdownMenuCheckboxItem as ContextMenuCheckboxItem,
  DropdownMenuGroup as ContextMenuGroup,
  DropdownMenuItem as ContextMenuItem,
  DropdownMenuLabel as ContextMenuLabel,
  DropdownMenuPortal as ContextMenuPortal,
  DropdownMenuRadioGroup as ContextMenuRadioGroup,
  DropdownMenuRadioItem as ContextMenuRadioItem,
  DropdownMenuSeparator as ContextMenuSeparator,
  DropdownMenuShortcut as ContextMenuShortcut,
  DropdownMenuSub as ContextMenuSub,
  DropdownMenuSubContent as ContextMenuSubContent,
  DropdownMenuSubTrigger as ContextMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

function ContextMenuTrigger(_props: { asChild?: boolean; children?: React.ReactNode }): React.ReactNode {
  return null
}
ContextMenuTrigger.displayName = "ContextMenuTrigger"

function ContextMenuContent(
  _props: {
    className?: string
    sideOffset?: number
    align?: "start" | "center" | "end"
    side?: "top" | "right" | "bottom" | "left"
    children?: React.ReactNode
  } & Pick<React.HTMLAttributes<HTMLDivElement>, "onClick" | "onPointerDown">,
): React.ReactNode {
  return null
}
ContextMenuContent.displayName = "ContextMenuContent"

function wrapContextMenuHandler(node: React.ReactElement, onContextMenu: (e: React.MouseEvent) => void) {
  const prev = (node.props as { onContextMenu?: (e: React.MouseEvent) => void }).onContextMenu
  return React.cloneElement(node, {
    onContextMenu: (e: React.MouseEvent) => {
      prev?.(e)
      onContextMenu(e)
    },
  } as never)
}

function ContextMenu({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
}: {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { trigger, content } = React.useMemo(
    () => parseMenuRootChildren(children, ContextMenuTrigger, ContextMenuContent),
    [children],
  )

  const anchorRef = React.useRef<HTMLDivElement>(null)
  const [point, setPoint] = React.useState({ x: 0, y: 0 })
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = open !== undefined
  const isOpen = isControlled ? !!open : uncontrolledOpen

  const setOpen = React.useCallback(
    (next: boolean) => {
      onOpenChange?.(next)
      if (!isControlled) setUncontrolledOpen(next)
    },
    [isControlled, onOpenChange],
  )

  React.useLayoutEffect(() => {
    const el = anchorRef.current
    if (!el || !isOpen) return
    el.style.left = `${point.x}px`
    el.style.top = `${point.y}px`
  }, [point.x, point.y, isOpen])

  const onContextMenu = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setPoint({ x: e.clientX, y: e.clientY })
      setOpen(true)
    },
    [setOpen],
  )

  if (!content) {
    return buildMenuTrigger(trigger)
  }

  const built = buildMenuTrigger(trigger)
  const triggerNode = React.isValidElement(built) ? wrapContextMenuHandler(built, onContextMenu) : built

  const cp = content.props as React.ComponentProps<typeof ContextMenuContent> & React.HTMLAttributes<HTMLDivElement>
  const {
    className,
    sideOffset = 4,
    align = "start",
    side = "bottom",
    children: menuChildren,
    onClick,
    onPointerDown,
  } = cp

  const placement = placementFromSideAlign(side, align)

  return (
    <>
      {triggerNode}
      <div
        ref={anchorRef}
        aria-hidden
        className="pointer-events-none fixed z-[100] m-0 h-px w-px border-0 p-0"
      />
      <Popover
        triggerRef={anchorRef}
        isOpen={isOpen}
        onOpenChange={setOpen}
        offset={sideOffset}
        placement={placement}
        onClick={onClick}
        onPointerDown={onPointerDown}
        className={({ isEntering, isExiting }) =>
          cn(
            "bg-primary text-secondary ring-secondary_alt z-[100] max-h-[min(24rem,80vh)] min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-lg p-1 shadow-lg ring-1 outline-none",
            isEntering && "animate-in fade-in-0 zoom-in-95",
            isExiting && "animate-out fade-out-0 zoom-out-95",
            className,
          )
        }
      >
        <Menu className="h-min max-h-[inherit] overflow-y-auto py-1 outline-none select-none">
          {renderComposedMenuTree(menuChildren)}
        </Menu>
      </Popover>
    </>
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
