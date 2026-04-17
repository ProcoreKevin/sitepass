"use client"

import * as React from "react"
import { Checkbox as UuiCheckbox } from "@untitledui/react/components/base/checkbox/checkbox"

type LegacyChecked = boolean | "indeterminate"

export type CheckboxProps = Omit<
  React.ComponentProps<typeof UuiCheckbox>,
  "isSelected" | "defaultSelected" | "onChange" | "isIndeterminate" | "defaultIndeterminate"
> & {
  checked?: LegacyChecked
  defaultChecked?: LegacyChecked
  onCheckedChange?: (v: LegacyChecked) => void
}

function Checkbox({ className, checked, defaultChecked, onCheckedChange, ...rest }: CheckboxProps) {
  const isControlled = checked !== undefined
  const isIndeterminate =
    checked === "indeterminate" || (!isControlled && defaultChecked === "indeterminate")
  const isSelected = isControlled ? checked === true : undefined
  const defaultSelected =
    isControlled || defaultChecked === undefined || defaultChecked === "indeterminate"
      ? undefined
      : defaultChecked === true

  return (
    <UuiCheckbox
      data-slot="checkbox"
      isIndeterminate={isIndeterminate || undefined}
      isSelected={isSelected}
      defaultSelected={defaultSelected}
      onChange={v => {
        onCheckedChange?.(v)
      }}
      className={className}
      {...rest}
    />
  )
}

export { Checkbox }
