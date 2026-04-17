"use client"

import * as React from "react"
import {
  Header,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Popover,
  Separator,
  SubmenuTrigger,
} from "react-aria-components"
import { ChevronRightIcon, CircleIcon } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

/** Avoid stacked browser outline + RAC focus visuals on menu rows (NGX uses hover/fill only). */
const MENU_ITEM_FOCUS =
  "ring-0 shadow-none outline-none [outline-style:none] focus:outline-none focus-visible:outline-none data-[focus-visible]:outline-none data-[focus-visible]:shadow-none"

export function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === "function") ref(node)
      else (ref as React.MutableRefObject<T | null>).current = node
    }
  }
}

export function placementFromSideAlign(
  side: "top" | "right" | "bottom" | "left" = "bottom",
  align: "start" | "center" | "end" = "center",
) {
  if (align === "center") return side
  return `${side} ${align}` as
    | "bottom start"
    | "bottom end"
    | "top start"
    | "top end"
    | "left start"
    | "left end"
    | "right start"
    | "right end"
}

/* --- Marker components (parsed by DropdownMenu / used for prop typing) --- */

function DropdownMenuTrigger(_props: {
  asChild?: boolean
  children?: React.ReactNode
}): React.ReactNode {
  return null
}
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

function DropdownMenuContent(_props: {
  className?: string
  sideOffset?: number
  align?: "start" | "center" | "end"
  side?: "top" | "right" | "bottom" | "left"
  children?: React.ReactNode
} & Pick<React.HTMLAttributes<HTMLDivElement>, "onClick" | "onPointerDown">): React.ReactNode {
  return null
}
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuRadioContext = React.createContext<{
  value?: string
  onValueChange?: (v: string) => void
} | null>(null)

function DropdownMenuItem(
  _props: Omit<React.ComponentProps<typeof MenuItem>, "onAction"> & {
    inset?: boolean
    onClick?: () => void
    /** Radix-style alias; forwarded to RAC `MenuItem` via `onAction`. */
    onSelect?: () => void
    /** Matches destructive button palette; under legacy theme see `app/legacy-theme.css` `[data-slot="menu-item"][data-variant="destructive"]`. */
    variant?: "default" | "destructive"
  },
): React.ReactNode {
  return null
}
DropdownMenuItem.displayName = "DropdownMenuItem"

function DropdownMenuCheckboxItem(
  _props: {
    className?: string
    children?: React.ReactNode
    checked?: boolean
    disabled?: boolean
    onCheckedChange?: (checked: boolean) => void
    onSelect?: (e: Event) => void
    textValue?: string
  },
): React.ReactNode {
  return null
}
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"

function DropdownMenuRadioItem(
  _props: {
    className?: string
    children?: React.ReactNode
    value: string
    disabled?: boolean
    onSelect?: (e: Event) => void
    textValue?: string
  },
): React.ReactNode {
  return null
}
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"

function DropdownMenuLabel(
  _props: { className?: string; inset?: boolean; children?: React.ReactNode },
): React.ReactNode {
  return null
}
DropdownMenuLabel.displayName = "DropdownMenuLabel"

function DropdownMenuSeparator(_props: { className?: string }): React.ReactNode {
  return null
}
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

function DropdownMenuShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

function DropdownMenuGroup(_props: { children?: React.ReactNode }): React.ReactNode {
  return null
}
DropdownMenuGroup.displayName = "DropdownMenuGroup"

function DropdownMenuPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

function DropdownMenuSub(_props: { children?: React.ReactNode }): React.ReactNode {
  return null
}
DropdownMenuSub.displayName = "DropdownMenuSub"

function DropdownMenuSubTrigger(
  _props: {
    className?: string
    inset?: boolean
    children?: React.ReactNode
    disabled?: boolean
    textValue?: string
  },
): React.ReactNode {
  return null
}
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger"

function DropdownMenuSubContent(_props: { className?: string; children?: React.ReactNode }): React.ReactNode {
  return null
}
DropdownMenuSubContent.displayName = "DropdownMenuSubContent"

function DropdownMenuRadioGroup(
  _props: {
    value?: string
    onValueChange?: (v: string) => void
    children?: React.ReactNode
  },
): React.ReactNode {
  return null
}
DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup"

function isMarkerElement(
  child: React.ReactElement,
  Marker: React.ComponentType<unknown>,
): boolean {
  if (child.type === Marker) return true
  const markerName = Marker.displayName
  if (!markerName) return false
  const T = child.type as { displayName?: string; name?: string }
  if (typeof T === "function") {
    return T.displayName === markerName || T.name === markerName
  }
  return false
}

/**
 * Find Trigger / Content markers anywhere under `DropdownMenu` (e.g. wrapped in Tooltip,
 * Fragment, or `DropdownMenuPortal`). When searching for the trigger, do not descend into
 * `DropdownMenuContent` so item rows cannot be mistaken for the root trigger.
 */
function findMenuMarker(
  node: React.ReactNode,
  target: React.ComponentType<unknown>,
  contentMarker: React.ComponentType<unknown>,
  role: "trigger" | "content",
): React.ReactElement | undefined {
  let found: React.ReactElement | undefined
  React.Children.forEach(node, child => {
    if (found) return
    if (!React.isValidElement(child)) return
    if (isMarkerElement(child, target)) {
      found = child
      return
    }
    if (role === "trigger" && isMarkerElement(child, contentMarker)) return
    const inner = findMenuMarker(
      (child.props as { children?: React.ReactNode }).children,
      target,
      contentMarker,
      role,
    )
    if (inner) found = inner
  })
  return found
}

export function parseMenuRootChildren(
  children: React.ReactNode,
  TriggerMarker: React.ComponentType<{ children?: React.ReactNode }>,
  ContentMarker: React.ComponentType<{ children?: React.ReactNode }>,
) {
  let trigger: React.ReactElement | undefined
  let content: React.ReactElement | undefined

  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) return
    if (isMarkerElement(child, TriggerMarker)) trigger = child
    if (isMarkerElement(child, ContentMarker)) content = child
  })

  if (!trigger) {
    trigger = findMenuMarker(children, TriggerMarker, ContentMarker, "trigger")
  }
  if (!content) {
    content = findMenuMarker(children, ContentMarker, ContentMarker, "content")
  }

  return { trigger, content }
}

export function renderComposedMenuTree(node: React.ReactNode, keyPrefix = ""): React.ReactNode[] {
  const out: React.ReactNode[] = []
  let i = 0
  const key = () => `${keyPrefix}-${i++}`

  React.Children.forEach(node, child => {
    if (child == null || child === false) return
    if (!React.isValidElement(child)) {
      out.push(<React.Fragment key={key()}>{child}</React.Fragment>)
      return
    }

    if (child.type === DropdownMenuItem) {
      const p = child.props as Omit<React.ComponentProps<typeof MenuItem>, "onAction"> & {
        inset?: boolean
        onClick?: () => void
        onSelect?: () => void
        variant?: "default" | "destructive"
      }
      const { className, inset, onClick, onSelect, children, variant = "default", ...rest } = p
      const isDestructive = variant === "destructive"
      out.push(
        <MenuItem
          key={key()}
          data-slot="menu-item"
          data-variant={variant}
          className={cn(
            "relative flex min-w-0 cursor-default flex-row flex-nowrap select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm font-semibold transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
            MENU_ITEM_FOCUS,
            inset && "pl-8",
            !isDestructive &&
              "text-secondary data-[focused]:bg-primary_hover hover:bg-primary_hover focus:bg-primary_hover",
            isDestructive &&
              "text-destructive hover:bg-destructive hover:text-destructive-foreground data-[focused]:bg-destructive data-[focused]:text-destructive-foreground",
            className,
          )}
          onAction={() => {
            onClick?.()
            onSelect?.()
          }}
          {...rest}
        >
          {children}
        </MenuItem>,
      )
      return
    }

    if (child.type === DropdownMenuCheckboxItem) {
      const p = child.props as React.ComponentProps<typeof DropdownMenuCheckboxItem>
      const { className, children, checked, disabled, onCheckedChange, onSelect, textValue } = p
      out.push(
        <MenuItem
          key={key()}
          textValue={textValue}
          isDisabled={disabled}
          className={cn(
            "text-secondary data-[focused]:bg-primary_hover relative flex min-w-0 cursor-default flex-row flex-nowrap select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm font-semibold transition-colors hover:bg-primary_hover focus:bg-primary_hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            MENU_ITEM_FOCUS,
            className,
          )}
          onAction={() => {
            onCheckedChange?.(!checked)
            onSelect?.(new Event("select"))
          }}
        >
          <span className="flex shrink-0 items-center pointer-events-none" aria-hidden>
            <Checkbox
              checked={!!checked}
              disabled={!!disabled}
              onCheckedChange={() => {}}
              tabIndex={-1}
              className="items-center gap-0"
            />
          </span>
          <span className="flex min-w-0 flex-1 items-center">{children}</span>
        </MenuItem>,
      )
      return
    }

    if (child.type === DropdownMenuRadioItem) {
      const p = child.props as React.ComponentProps<typeof DropdownMenuRadioItem>
      const { className, children, value, disabled, onSelect, textValue } = p
      out.push(
        <DropdownMenuRadioItemInner
          key={key()}
          className={className}
          value={value}
          disabled={disabled}
          onSelect={onSelect}
          textValue={textValue}
        >
          {children}
        </DropdownMenuRadioItemInner>,
      )
      return
    }

    if (child.type === DropdownMenuRadioGroup) {
      const p = child.props as React.ComponentProps<typeof DropdownMenuRadioGroup>
      out.push(
        <DropdownMenuRadioContext.Provider
          key={key()}
          value={{ value: p.value, onValueChange: p.onValueChange }}
        >
          {renderComposedMenuTree(p.children, keyPrefix + "rg")}
        </DropdownMenuRadioContext.Provider>,
      )
      return
    }

    if (child.type === DropdownMenuSeparator) {
      const p = child.props as { className?: string }
      out.push(
        <Separator key={key()} className={cn("bg-border-secondary my-1 h-px w-full", p.className)} />,
      )
      return
    }

    if (child.type === DropdownMenuLabel) {
      const p = child.props as { className?: string; inset?: boolean; children?: React.ReactNode }
      out.push(
        <MenuSection key={key()}>
          <Header
            className={cn("px-2 py-1.5 text-sm font-semibold", p.inset && "pl-8", p.className)}
          >
            {p.children}
          </Header>
        </MenuSection>,
      )
      return
    }

    if (child.type === DropdownMenuGroup) {
      const p = child.props as { children?: React.ReactNode }
      out.push(
        <MenuSection key={key()} className="p-0">
          {renderComposedMenuTree(p.children, keyPrefix + "gr")}
        </MenuSection>,
      )
      return
    }

    if (child.type === DropdownMenuSub) {
      const p = child.props as { children?: React.ReactNode }
      let subTrigger: React.ReactElement | undefined
      let subContent: React.ReactElement | undefined
      React.Children.forEach(p.children, c => {
        if (!React.isValidElement(c)) return
        if (c.type === DropdownMenuSubTrigger) subTrigger = c
        if (c.type === DropdownMenuSubContent) subContent = c
      })
      if (!subTrigger || !subContent) return

      const st = subTrigger.props as React.ComponentProps<typeof DropdownMenuSubTrigger>
      const sc = subContent.props as { className?: string; children?: React.ReactNode }

      out.push(
        <SubmenuTrigger key={key()}>
          <MenuItem
            className={cn(
              "text-secondary data-[focused]:bg-primary_hover flex cursor-default select-none items-center rounded-md px-2.5 py-2 text-sm font-semibold hover:bg-primary_hover focus:bg-primary_hover data-[open]:bg-primary_hover",
              MENU_ITEM_FOCUS,
              st.inset && "pl-8",
              st.className,
            )}
            isDisabled={st.disabled}
            textValue={st.textValue}
          >
            {st.children}
            <ChevronRightIcon className="ml-auto size-4" />
          </MenuItem>
          <Popover
            data-slot="dropdown-menu-content"
            isNonModal
            className={({ isEntering, isExiting }) =>
              cn(
                "bg-primary text-secondary ring-secondary_alt z-50 min-w-[8rem] overflow-hidden rounded-lg p-1 shadow-lg ring-1 outline-none",
                isEntering && "animate-in fade-in-0 zoom-in-95",
                isExiting && "animate-out fade-out-0 zoom-out-95",
                sc.className,
              )
            }
          >
            <Menu className="h-min max-h-[inherit] overflow-y-auto py-1 outline-none select-none">
              {renderComposedMenuTree(sc.children, keyPrefix + "sub")}
            </Menu>
          </Popover>
        </SubmenuTrigger>,
      )
      return
    }

    if (child.type === React.Fragment) {
      out.push(...renderComposedMenuTree((child.props as { children?: React.ReactNode }).children, keyPrefix))
      return
    }

    out.push(<React.Fragment key={key()}>{child}</React.Fragment>)
  })

  return out
}

function DropdownMenuRadioItemInner({
  className,
  children,
  value,
  disabled,
  onSelect,
  textValue,
}: {
  className?: string
  children?: React.ReactNode
  value: string
  disabled?: boolean
  onSelect?: (e: Event) => void
  textValue?: string
}) {
  const ctx = React.useContext(DropdownMenuRadioContext)
  const selected = ctx?.value === value
  return (
    <MenuItem
      textValue={textValue}
      isDisabled={disabled}
      className={cn(
        "text-secondary data-[focused]:bg-primary_hover relative flex cursor-default select-none items-center rounded-md py-2 pr-2 pl-8 text-sm font-semibold transition-colors hover:bg-primary_hover focus:bg-primary_hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        MENU_ITEM_FOCUS,
        className,
      )}
      onAction={() => {
        ctx?.onValueChange?.(value)
        onSelect?.(new Event("select"))
      }}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {selected ? <CircleIcon className="h-2 w-2 fill-current" /> : null}
      </span>
      {children}
    </MenuItem>
  )
}

export function buildMenuTrigger(triggerEl: React.ReactElement | undefined) {
  if (!triggerEl) {
    return (
      <button type="button" className="rounded-sm border px-2 py-1 text-sm">
        Menu
      </button>
    )
  }
  const { asChild, children, ...rest } = triggerEl.props as {
    asChild?: boolean
    children?: React.ReactNode
  } & React.HTMLAttributes<HTMLElement>
  if (asChild && React.isValidElement(children)) {
    const c = children as React.ReactElement<{ ref?: React.Ref<HTMLElement> }>
    return React.cloneElement(c, {
      ...rest,
      ref: mergeRefs(
        c.props.ref as React.Ref<HTMLElement> | undefined,
        (rest as { ref?: React.Ref<HTMLElement> }).ref,
      ),
      className: cn(c.props.className, (rest as { className?: string }).className),
    } as never)
  }
  return (
    <button type="button" {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}

function DropdownMenu({
  children,
  open,
  defaultOpen,
  onOpenChange,
}: {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { trigger, content } = React.useMemo(
    () => parseMenuRootChildren(children, DropdownMenuTrigger, DropdownMenuContent),
    [children],
  )

  if (!content) {
    return buildMenuTrigger(trigger)
  }

  const cp = content.props as React.ComponentProps<typeof DropdownMenuContent> &
    React.HTMLAttributes<HTMLDivElement>
  const {
    className,
    sideOffset = 4,
    align = "center",
    side = "bottom",
    children: menuChildren,
    onClick,
    onPointerDown,
    ..._rest
  } = cp

  const placement = placementFromSideAlign(side, align)

  return (
    <MenuTrigger isOpen={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {buildMenuTrigger(trigger)}
      <Popover
        data-slot="dropdown-menu-content"
        isNonModal
        offset={sideOffset}
        placement={placement}
        onClick={onClick}
        onPointerDown={onPointerDown}
        className={({ isEntering, isExiting }) =>
          cn(
            "bg-primary text-secondary ring-secondary_alt z-50 min-w-[8rem] overflow-hidden rounded-lg p-1 shadow-lg ring-1 outline-none",
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
    </MenuTrigger>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
