"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === "function") ref(node)
      else (ref as React.MutableRefObject<T | null>).current = node
    }
  }
}

/**
 * Merges props onto a single child for `asChild` patterns (Untitled / NGX facades).
 */
export const Slot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }>(
  function Slot({ children, ...slotProps }, forwardedRef) {
    if (!React.isValidElement(children)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Slot: expected a single valid React element child.")
      }
      return null
    }
    const child = children as React.ReactElement<{
      className?: string
      style?: React.CSSProperties
      ref?: React.Ref<HTMLElement>
    }>
    return React.cloneElement(child, {
      ...child.props,
      ...slotProps,
      className: cn(child.props.className, slotProps.className as string | undefined),
      style: { ...child.props.style, ...(slotProps as { style?: React.CSSProperties }).style },
      ref: mergeRefs(forwardedRef as React.Ref<HTMLElement>, child.props.ref as React.Ref<HTMLElement>),
    } as never)
  },
)

Slot.displayName = "Slot"
