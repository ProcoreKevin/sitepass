"use client"

import * as React from "react"
import { TextArea as RACTextArea } from "react-aria-components"

import { cn } from "@/lib/utils"

const textareaClassName =
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

export type RacTextareaProps = React.ComponentProps<typeof RACTextArea>

export const RacTextarea = React.forwardRef<HTMLTextAreaElement, RacTextareaProps>(function RacTextarea(
  { className, ...props },
  ref,
) {
  return <RACTextArea ref={ref} data-slot="textarea" className={cn(textareaClassName, className)} {...props} />
})
