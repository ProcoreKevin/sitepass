"use client"

import * as React from "react"
import { Input as UuiInput } from "@untitledui/react/components/base/input/input"

export type UuiAppInputProps = Omit<React.ComponentProps<typeof UuiInput>, "isDisabled"> & {
  disabled?: boolean
}

/** Untitled `Input` (TextField + InputBase); maps `disabled` → `isDisabled`. */
export function UuiAppInput({ disabled, isDisabled, ...props }: UuiAppInputProps) {
  return <UuiInput {...props} isDisabled={disabled ?? isDisabled} />
}
