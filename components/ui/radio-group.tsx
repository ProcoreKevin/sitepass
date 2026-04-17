"use client"

import * as React from "react"
import {
  RadioButton as UuiRadioButton,
  RadioGroup as UuiRadioGroup,
} from "@untitledui/react/components/base/radio-buttons/radio-buttons"

import { cn } from "@/lib/utils"

type RadioGroupProps = Omit<React.ComponentProps<typeof UuiRadioGroup>, "onChange"> & {
  onValueChange?: (value: string) => void
}

function RadioGroup({ className, onValueChange, ...props }: RadioGroupProps) {
  return (
    <UuiRadioGroup
      data-slot="radio-group"
      className={cn("flex w-full min-w-0 flex-col gap-3", className)}
      onChange={onValueChange}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof UuiRadioButton>) {
  return <UuiRadioButton data-slot="radio-group-item" className={className} {...props} />
}

export { RadioGroup, RadioGroupItem }
