"use client"

import * as React from "react"
import { TextArea as UuiTextArea } from "@untitledui/react/components/base/textarea/textarea"

export type UuiAppTextareaProps = Omit<React.ComponentProps<typeof UuiTextArea>, "isDisabled" | "textAreaRef"> & {
  disabled?: boolean
}

/** Untitled `TextArea`; maps `disabled` → `isDisabled`, `ref` → `textAreaRef`. */
export const UuiAppTextarea = React.forwardRef<HTMLTextAreaElement, UuiAppTextareaProps>(function UuiAppTextarea(
  { disabled, isDisabled, ...props },
  ref,
) {
  return <UuiTextArea {...props} isDisabled={disabled ?? isDisabled} textAreaRef={ref} />
})
UuiAppTextarea.displayName = "UuiAppTextarea"
