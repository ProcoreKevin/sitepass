"use client"

import * as React from "react"
import { Tab, TabList, TabPanel, TabPanels, Tabs as RACTabs } from "react-aria-components"

import { cn } from "@/lib/utils"

function TabsTrigger(_props: { className?: string; value: string; children?: React.ReactNode }): null {
  return null
}
TabsTrigger.displayName = "TabsTrigger"

function TabsContent(_props: { className?: string; value: string; children?: React.ReactNode }): null {
  return null
}
TabsContent.displayName = "TabsContent"

/** Tab trigger chrome aligned with DS `application/tabs` type `button-border` (sm). */
const triggerClass = (className?: string) =>
  cn(
    "outline-focus-ring z-10 flex h-max min-h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-semibold whitespace-nowrap text-quaternary transition duration-100 ease-linear",
    "px-3 py-2",
    "data-[focus-visible]:outline-2 data-[focus-visible]:-outline-offset-2",
    "hover:bg-primary_alt hover:text-secondary hover:shadow-sm",
    "data-[selected]:bg-primary_alt data-[selected]:text-secondary data-[selected]:shadow-sm",
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )

/** Underline tabs — `[data-theme="legacy"]` styles in `legacy-theme.css` (`data-list-type="underline"`). */
const underlineTriggerClass = (className?: string) =>
  cn(
    "outline-focus-ring flex h-10 shrink-0 cursor-pointer items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors duration-150",
    "data-[focus-visible]:outline-2 data-[focus-visible]:-outline-offset-2",
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
    className,
  )

function TabsList({
  className,
  children,
  variant = "button-border",
  ...props
}: Omit<React.ComponentProps<typeof TabList>, "children"> & {
  children?: React.ReactNode
  /** `underline` = Z3-style row; styled via `[data-theme="legacy"]` in `app/legacy-theme.css`. */
  variant?: "button-border" | "underline"
}) {
  return (
    <TabList
      data-slot="tabs-list"
      data-list-type={variant}
      className={cn(
        variant === "underline"
          ? "flex h-10 w-full min-w-0 shrink-0 items-end gap-0 border-0 border-b border-[var(--color-border-default)] bg-transparent p-0 ring-0"
          : "inline-flex w-fit gap-1 rounded-[10px] bg-secondary_alt p-1 ring-1 ring-secondary ring-inset",
        className,
      )}
      {...props}
    >
      {children}
    </TabList>
  )
}

function Tabs({
  className,
  value,
  defaultValue,
  onValueChange,
  tabPanelsClassName,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof RACTabs>,
  "children" | "selectedKey" | "defaultSelectedKey" | "onSelectionChange"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (v: string) => void
  /** Classes for the `TabPanels` wrapper (e.g. `flex-1 min-h-0` for slide-outs). */
  tabPanelsClassName?: string
  children?: React.ReactNode
}) {
  const { listEl, panels } = React.useMemo(() => {
    let rawList: React.ReactElement | undefined
    const panelNodes: React.ReactNode[] = []
    React.Children.forEach(children, c => {
      if (!React.isValidElement(c)) return
      if (c.type === TabsList) rawList = c
      if (c.type === TabsContent) {
        const p = c.props as { value: string; className?: string; children?: React.ReactNode }
        panelNodes.push(
          <TabPanel
            key={p.value}
            id={p.value}
            data-slot="tabs-content"
            className={cn(
              "outline-focus-ring flex-1 focus-visible:outline-2 focus-visible:outline-offset-2",
              p.className,
            )}
          >
            {p.children}
          </TabPanel>,
        )
      }
    })

    const listVariant =
      (rawList?.props as { variant?: "button-border" | "underline" } | undefined)?.variant ?? "button-border"
    const triggerFn = listVariant === "underline" ? underlineTriggerClass : triggerClass

    const mappedList =
      rawList &&
      React.cloneElement(rawList as React.ReactElement<{ children?: React.ReactNode }>, {
        children: React.Children.map(
          (rawList.props as { children?: React.ReactNode }).children,
          ch => {
            if (React.isValidElement(ch) && ch.type === TabsTrigger) {
              const t = ch.props as { value: string; className?: string; children?: React.ReactNode }
              return (
                <Tab key={t.value} id={t.value} data-slot="tabs-trigger" className={triggerFn(t.className)}>
                  {t.children}
                </Tab>
              )
            }
            return ch
          },
        ),
      })

    return { listEl: mappedList, panels: panelNodes }
  }, [children])

  return (
    <RACTabs
      data-slot="tabs"
      className={cn("flex w-full min-w-0 flex-col gap-2", className)}
      selectedKey={value}
      defaultSelectedKey={defaultValue}
      onSelectionChange={key => onValueChange?.(String(key))}
      {...props}
    >
      {listEl}
      <TabPanels className={cn("flex min-h-0 min-w-0 flex-1 flex-col outline-none", tabPanelsClassName)}>
        {panels}
      </TabPanels>
    </RACTabs>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
