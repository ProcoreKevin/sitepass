"use client"

/** Default `Input` stays RAC-based so `onChange` remains `ChangeEvent` (many call sites use `e.target.value`). Use `UuiAppInput` for Untitled TextField API. */
export { RacInput as Input } from "@/components/ui-next/rac-input"
export type { RacInputProps as InputProps } from "@/components/ui-next/rac-input"
export { UuiAppInput } from "@/components/ui-next/uui-input"
export type { UuiAppInputProps } from "@/components/ui-next/uui-input"
