"use client"

import * as React from "react"
import { Slider as UuiSlider } from "@untitledui/react/components/base/slider/slider"

import { cn } from "@/lib/utils"

type SliderFacadeProps = Omit<
  React.ComponentProps<typeof UuiSlider>,
  "value" | "defaultValue" | "onChange" | "minValue" | "maxValue"
> & {
  value?: number[] | number
  defaultValue?: number[] | number
  onValueChange?: (v: number[]) => void
  min?: number
  max?: number
}

function toRacValue(v: number[] | number | undefined): number | undefined {
  if (v === undefined) return undefined
  return Array.isArray(v) ? v[0] : v
}

function Slider({ className, defaultValue, value, min = 0, max = 100, onValueChange, step, ...props }: SliderFacadeProps) {
  return (
    <UuiSlider
      data-slot="slider"
      minValue={min}
      maxValue={max}
      step={step}
      value={toRacValue(value)}
      defaultValue={toRacValue(defaultValue)}
      onChange={v => {
        const n = typeof v === "number" ? v : v[0] ?? min
        onValueChange?.([n])
      }}
      className={cn("w-full", className)}
      {...props}
    />
  )
}

export { Slider }
