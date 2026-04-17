"use client"

/**
 * Presentation-only menubar primitives (no Radix). Prefer `DropdownMenu` for real menus.
 * @see docs/migration-uui-rac-status.md
 */

import * as React from "react"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Menubar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="menubar"
      data-slot="menubar"
      className={cn("bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs", className)}
      {...props}
    />
  )
}

function MenubarMenu({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="menubar-menu" className={cn("relative", className)} {...props} />
}

function MenubarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="menubar-group" role="group" className={className} {...props} />
}

function MenubarPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

function MenubarTrigger({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="menubar-trigger"
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        className,
      )}
      {...props}
    />
  )
}

function MenubarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="menubar-content"
      role="menu"
      className={cn(
        "bg-popover text-popover-foreground z-50 min-w-[12rem] rounded-md border p-1 shadow-md outline-none",
        className,
      )}
      {...props}
    />
  )
}

function MenubarItem({ className, inset, ...props }: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      role="menuitem"
      data-slot="menubar-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<"div"> & { checked?: boolean }) {
  return (
    <div
      role="menuitemcheckbox"
      data-slot="menubar-checkbox-item"
      aria-checked={checked}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked ? <CheckIcon className="h-4 w-4" /> : null}
      </span>
      {children}
    </div>
  )
}

function MenubarRadioGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="menubar-radio-group" role="radiogroup" className={className} {...props} />
}

function MenubarRadioItem({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="menuitemradio"
      data-slot="menubar-radio-item"
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <CircleIcon className="h-2 w-2 fill-current" />
      </span>
      {children}
    </div>
  )
}

function MenubarLabel({ className, inset, ...props }: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="menubar-label"
      className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
      {...props}
    />
  )
}

function MenubarSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="menubar-separator" role="separator" className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
}

function MenubarShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
      {...props}
    />
  )
}

function MenubarSub({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="menubar-sub" className={className} {...props} />
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[inset]:pl-8",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </div>
  )
}

function MenubarSubContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="menubar-sub-content"
      className={cn(
        "bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg",
        className,
      )}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
