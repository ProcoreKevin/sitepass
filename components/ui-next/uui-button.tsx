"use client"

import * as React from "react"
import {
  Button as UuiButton,
  type ButtonProps as UuiButtonProps,
} from "@untitledui/react/components/base/buttons/button"
import type { VariantProps } from "class-variance-authority"

import { buttonVariants } from "@/components/ui-next/rac-button"

const variantToColor = {
  default: "primary",
  destructive: "primary-destructive",
  outline: "outline",
  secondary: "secondary",
  ghost: "tertiary",
  link: "link-gray",
} as const

const sizeToUui = {
  default: "md",
  sm: "sm",
  lg: "lg",
  xl: "xl",
  icon: "md",
} as const

type LegacyVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>
type LegacySize = NonNullable<VariantProps<typeof buttonVariants>["size"]>

export type UuiAppButtonProps = Omit<UuiButtonProps, "color" | "size"> & {
  variant?: LegacyVariant
  size?: LegacySize
  /** HTML parity — forwarded to Untitled / React Aria as `isDisabled`. */
  disabled?: boolean
}

/**
 * Shadcn-era `<Button><Plus />Label</Button>` puts icon+text inside Untitled's single `data-text`
 * span, which stacks when width is tight. Promote first/last element child to iconLeading /
 * iconTrailing so the DS lays them out as proper icon slots.
 */
function promoteShadcnIconChildren(
  children: React.ReactNode,
  size: LegacySize,
  iconLeading: UuiAppButtonProps["iconLeading"],
  iconTrailing: UuiAppButtonProps["iconTrailing"],
): {
  leading: UuiAppButtonProps["iconLeading"]
  trailing: UuiAppButtonProps["iconTrailing"]
  rest: React.ReactNode
} {
  if (iconLeading != null || iconTrailing != null) {
    return { leading: iconLeading, trailing: iconTrailing, rest: children }
  }

  const nodes = React.Children.toArray(children).filter(c => c != null)

  if (size === "icon") {
    if (nodes.length === 1 && React.isValidElement(nodes[0])) {
      return { leading: nodes[0], trailing: undefined, rest: undefined }
    }
    return { leading: undefined, trailing: undefined, rest: children }
  }

  if (nodes.length >= 2) {
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    if (React.isValidElement(first)) {
      return {
        leading: first,
        trailing: undefined,
        rest: nodes.length === 2 ? nodes[1] : <>{nodes.slice(1)}</>,
      }
    }
    if (React.isValidElement(last)) {
      return {
        leading: undefined,
        trailing: last,
        rest: nodes.length === 2 ? nodes[0] : <>{nodes.slice(0, -1)}</>,
      }
    }
  }

  return { leading: undefined, trailing: undefined, rest: children }
}

/**
 * Untitled resolves to Design-System, whose @types/react can disagree with the app’s React 18 types.
 * Relay as `any` so ref + props type-check here while runtime behavior stays correct.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- cross-package React types (DS vs app)
const UuiButtonRelay: any = UuiButton

export const UuiAppButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, UuiAppButtonProps>(
  function UuiAppButton(
    {
      variant = "default",
      size = "default",
      disabled,
      isDisabled,
      className,
      children,
      iconLeading,
      iconTrailing,
      ...props
    },
    ref,
  ) {
    const { leading, trailing, rest } = React.useMemo(
      () => promoteShadcnIconChildren(children as React.ReactNode, size, iconLeading, iconTrailing),
      [children, size, iconLeading, iconTrailing],
    )

    return (
      <UuiButtonRelay
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        color={variantToColor[variant]}
        size={sizeToUui[size]}
        isDisabled={disabled ?? isDisabled}
        className={className}
        iconLeading={leading}
        iconTrailing={trailing}
        {...props}
      >
        {rest}
      </UuiButtonRelay>
    )
  },
)

UuiAppButton.displayName = "UuiAppButton"
