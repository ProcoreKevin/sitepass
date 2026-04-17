"use client"

import * as React from "react"
import {
  Button,
  Header,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  Popover,
  Select as RACSelect,
  SelectValue,
  Separator,
} from "react-aria-components"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

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

function SelectTrigger(_props: {
  className?: string
  children?: React.ReactNode
  size?: "sm" | "default"
}): null {
  return null
}
SelectTrigger.displayName = "SelectTrigger"

function SelectValueMarker(_props: { placeholder?: string }): null {
  return null
}
SelectValueMarker.displayName = "SelectValue"

function SelectContent(_props: {
  className?: string
  children?: React.ReactNode
  position?: "popper" | "item-aligned"
}): null {
  return null
}
SelectContent.displayName = "SelectContent"

function SelectItem(
  _props: {
    className?: string
    value: string
    children?: React.ReactNode
    disabled?: boolean
    textValue?: string
  },
): null {
  return null
}
SelectItem.displayName = "SelectItem"

function SelectGroup(_props: { children?: React.ReactNode }): null {
  return null
}
SelectGroup.displayName = "SelectGroup"

function SelectLabel(_props: { className?: string; children?: React.ReactNode }): null {
  return null
}
SelectLabel.displayName = "SelectLabel"

function SelectSeparator(_props: { className?: string }): null {
  return null
}
SelectSeparator.displayName = "SelectSeparator"

function SelectScrollUpButton(_props: { className?: string }): null {
  return null
}
SelectScrollUpButton.displayName = "SelectScrollUpButton"

function SelectScrollDownButton(_props: { className?: string }): null {
  return null
}
SelectScrollDownButton.displayName = "SelectScrollDownButton"

/** RAC ListBoxItem needs explicit text when children are not plain text (e.g. render props). */
function selectItemTextValue(children: React.ReactNode, explicit?: string): string | undefined {
  if (explicit != null && explicit !== "") return explicit
  if (typeof children === "string" || typeof children === "number") return String(children)
  return undefined
}

function parseSelectChildren(children: React.ReactNode) {
  let trigger: React.ReactElement | undefined
  let content: React.ReactElement | undefined

  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) return
    if (child.type === SelectTrigger) trigger = child
    if (child.type === SelectContent) content = child
  })

  let placeholder: string | undefined
  if (trigger) {
    React.Children.forEach((trigger.props as { children?: React.ReactNode }).children, c => {
      if (React.isValidElement(c) && c.type === SelectValueMarker) {
        placeholder = (c.props as { placeholder?: string }).placeholder
      }
    })
  }

  return { trigger, content, placeholder }
}

function renderListChildren(node: React.ReactNode): React.ReactNode[] {
  const out: React.ReactNode[] = []
  let i = 0
  const key = () => `opt-${i++}`

  React.Children.forEach(node, child => {
    if (child == null || child === false) return
    if (!React.isValidElement(child)) return

    if (child.type === SelectScrollUpButton) {
      out.push(
        <div key={key()} className="flex cursor-default items-center justify-center py-1">
          <ChevronUpIcon className="h-4 w-4" />
        </div>,
      )
      return
    }
    if (child.type === SelectScrollDownButton) {
      out.push(
        <div key={key()} className="flex cursor-default items-center justify-center py-1">
          <ChevronDownIcon className="h-4 w-4" />
        </div>,
      )
      return
    }

    if (child.type === SelectSeparator) {
      const p = child.props as { className?: string }
      out.push(<Separator key={key()} className={cn("bg-border-secondary my-1 h-px w-full", p.className)} />)
      return
    }

    if (child.type === SelectGroup) {
      const p = child.props as { children?: React.ReactNode }
      let label: React.ReactNode
      const items: React.ReactNode[] = []
      React.Children.forEach(p.children, gc => {
        if (!React.isValidElement(gc)) return
        if (gc.type === SelectLabel) {
          label = (gc.props as { children?: React.ReactNode }).children
        } else {
          items.push(...renderListChildren(gc))
        }
      })
      out.push(
        <ListBoxSection key={key()} className="p-0">
          {label ? (
            <Header className="px-2 py-1.5 text-sm font-semibold">{label}</Header>
          ) : null}
          {items}
        </ListBoxSection>,
      )
      return
    }

    if (child.type === SelectItem) {
      const p = child.props as {
        className?: string
        value: string
        children?: React.ReactNode
        disabled?: boolean
        textValue?: string
      }
      // React key must match stable collection id — positional keys (opt-0, opt-1) break when items
      // reorder (e.g. filtered lists) and trigger "Cannot change the id of an item" in @react-aria/collections.
      out.push(
        <ListBoxItem
          key={p.value}
          id={p.value}
          data-slot="select-item"
          textValue={selectItemTextValue(p.children, p.textValue)}
          isDisabled={p.disabled}
          className={cn(
            "text-secondary hover:bg-primary_hover data-[focused]:bg-primary_hover data-[focus-visible]:ring-0 relative flex w-full cursor-default select-none items-center rounded-md py-2 pr-8 pl-2 text-sm font-medium outline-none focus:bg-primary_hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            p.className,
          )}
        >
          {({ isSelected }) => (
            <>
              <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                {isSelected ? <CheckIcon className="h-4 w-4" /> : null}
              </span>
              {p.children}
            </>
          )}
        </ListBoxItem>,
      )
    }
  })

  return out
}

function Select({
  children,
  value,
  defaultValue,
  onValueChange,
  disabled,
  required,
  name,
  open,
  defaultOpen,
  onOpenChange,
  className,
  ...rootProps
}: {
  children?: React.ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  name?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "defaultValue">) {
  const { trigger, content, placeholder } = React.useMemo(() => parseSelectChildren(children), [children])

  const tp = (trigger?.props ?? {}) as {
    className?: string
    children?: React.ReactNode
    size?: "sm" | "default"
  }
  const cp = (content?.props ?? {}) as {
    className?: string
    children?: React.ReactNode
    position?: "popper" | "item-aligned"
  }

  const triggerClass = cn(
    "border-border-default bg-primary text-secondary flex h-9 w-full max-w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm shadow-xs",
    "data-[placeholder]:text-fg-quaternary",
    "outline-focus-ring focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
    /* min-w-0 only on the value slot so text truncates; trigger floor last so it wins over consumer min-w-0 */
    "[&_[data-slot=select-value]]:min-w-0 [&_[data-slot=select-value]]:flex-1 [&_[data-slot=select-value]]:truncate [&_[data-slot=select-value]]:text-left",
    tp.size === "sm" && "h-8",
    tp.className,
    "min-w-[min(100%,12rem)] max-w-full",
  )

  const listClass = cn(
    "bg-primary text-secondary ring-secondary_alt max-h-96 min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-lg p-1 py-1 shadow-lg ring-1 outline-none select-none",
    cp.className,
  )

  return (
    <RACSelect
      {...rootProps}
      name={name}
      /* Empty string is not a valid key; treat as uncontrolled-clear so React Stately matches items. */
      selectedKey={value != null && value !== "" ? value : null}
      defaultSelectedKey={defaultValue ?? undefined}
      onSelectionChange={key => {
        onValueChange?.(key == null ? "" : String(key))
      }}
      isDisabled={disabled}
      isRequired={required}
      isOpen={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      placeholder={placeholder}
      className={cn("block w-full min-w-[min(100%,12rem)] max-w-full", className)}
    >
      <Button className={triggerClass} data-slot="select-trigger">
        {/*
          Always show plain selectedText in the trigger. Rendering ListBoxItem children here
          duplicates multi-line markup (labels + meta), which overflows and overlaps adjacent UI
          (e.g. uui-studio facade jump list).
        */}
        <SelectValue className="min-w-0 flex-1 truncate text-left" data-slot="select-value">
          {({ isPlaceholder, selectedText, selectedItem }) => (
            <span className="block min-w-0 flex-1 truncate text-left">
              {isPlaceholder ? (
                placeholder ?? "Select…"
              ) : (
                selectedText ||
                (typeof selectedItem === "string" || typeof selectedItem === "number" ? String(selectedItem) : "")
              )}
            </span>
          )}
        </SelectValue>
        <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
      </Button>
      <Popover
        offset={4}
        className={({ isEntering, isExiting }) =>
          cn(
            "z-20 min-w-[var(--trigger-width)]",
            /* Avoid scale transforms — they skew overlay anchor math vs. the trigger. */
            isEntering && "animate-in fade-in-0",
            isExiting && "animate-out fade-out-0",
          )
        }
      >
        <ListBox className={listClass} data-slot="select-content">
          {renderListChildren(cp.children)}
        </ListBox>
      </Popover>
    </RACSelect>
  )
}

const SelectValueExport = SelectValueMarker

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValueExport as SelectValue,
}
