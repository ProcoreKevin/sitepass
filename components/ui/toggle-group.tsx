"use client"

import * as React from "react"
import { ToggleButton, ToggleButtonGroup, type Selection } from "react-aria-components"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: "default",
  variant: "default",
})

function selectionToStrings(keys: Selection): string[] {
  if (keys === "all") return []
  return [...keys].map(String)
}

type ToggleGroupProps = Omit<
  React.ComponentProps<typeof ToggleButtonGroup>,
  "selectedKeys" | "defaultSelectedKeys" | "onSelectionChange"
> &
  VariantProps<typeof toggleVariants> & {
    type?: "single" | "multiple"
    value?: string | string[]
    defaultValue?: string | string[]
    onValueChange?: (value: string | string[]) => void
  }

function ToggleGroup({
  className,
  variant,
  size,
  children,
  type = "single",
  value,
  defaultValue,
  onValueChange,
  ...props
}: ToggleGroupProps) {
  const selectionMode = type === "multiple" ? "multiple" : "single"

  const selectedKeys = React.useMemo(() => {
    if (value === undefined) return undefined
    if (type === "multiple") {
      const arr = Array.isArray(value) ? value : []
      return new Set(arr)
    }
    return new Set(value ? [value] : [])
  }, [value, type])

  const defaultSelectedKeys = React.useMemo(() => {
    if (defaultValue === undefined) return undefined
    if (type === "multiple") {
      const arr = Array.isArray(defaultValue) ? defaultValue : []
      return new Set(arr)
    }
    return new Set(defaultValue ? [defaultValue] : [])
  }, [defaultValue, type])

  return (
    <ToggleButtonGroup
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      selectionMode={selectionMode}
      selectedKeys={selectedKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      onSelectionChange={keys => {
        const arr = selectionToStrings(keys)
        if (type === "multiple") {
          ;(onValueChange as ((v: string[]) => void) | undefined)?.(arr)
        } else {
          ;(onValueChange as ((v: string) => void) | undefined)?.(arr[0] ?? "")
        }
      }}
      className={cn("group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs", className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
    </ToggleButtonGroup>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  value,
  ...props
}: Omit<React.ComponentProps<typeof ToggleButton>, "id"> &
  VariantProps<typeof toggleVariants> & { value: string }) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleButton
      data-slot="toggle-group-item"
      id={value}
      data-variant={context.variant || variant}
      data-size={context.size || size}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        className,
      )}
      {...props}
    >
      {children}
    </ToggleButton>
  )
}

export { ToggleGroup, ToggleGroupItem }
