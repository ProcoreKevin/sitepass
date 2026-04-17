"use client"

import * as React from "react"
import { Toggle as UuiToggle } from "@untitledui/react/components/base/toggle/toggle"

export type SwitchProps = Omit<
  React.ComponentProps<typeof UuiToggle>,
  "isSelected" | "defaultSelected" | "onChange" | "isDisabled"
> & {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (v: boolean) => void
  disabled?: boolean
}

function Switch({ className, checked, defaultChecked, onCheckedChange, disabled, isDisabled, ...rest }: SwitchProps) {
  const isControlled = checked !== undefined

  return (
    <UuiToggle
      {...rest}
      data-slot="switch"
      isSelected={isControlled ? checked : undefined}
      defaultSelected={isControlled ? undefined : defaultChecked}
      isDisabled={disabled ?? isDisabled}
      onChange={v => onCheckedChange?.(v)}
      className={className}
    />
  )
}

export { Switch }
