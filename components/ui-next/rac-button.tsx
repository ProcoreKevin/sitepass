"use client"

import * as React from "react"
import { Button as RACButton } from "react-aria-components"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/** Shared variants with [components/ui/button.tsx](components/ui/button.tsx) for drop-in parity. */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[var(--spacing-inline-gap)] whitespace-nowrap rounded-[var(--radius-sm)] text-[length:var(--text-body-size)] font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-[var(--ring)] focus-visible:ring-[var(--ring)]/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-primary text-primary-foreground shadow-none hover:bg-primary hover:shadow-sm active:border-black active:bg-[var(--color-brand-700)] active:shadow-none",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[var(--shadow-sm)] hover:bg-[color-mix(in_srgb,var(--destructive)_82%,black)] focus-visible:ring-destructive/20",
        outline:
          "border border-[var(--input)] bg-transparent text-[var(--color-text-primary)] shadow-none hover:border-black hover:bg-transparent active:border-[#9CA3AF] active:bg-transparent",
        secondary:
          "border border-transparent bg-[#F2F2F2] text-[var(--color-text-primary)] shadow-none hover:bg-[#E5E7EB] active:border-black active:bg-[#D1D5DB] disabled:bg-[var(--color-bg-btn-secondary-disabled)] disabled:text-[var(--color-text-disabled)]",
        ghost: "hover:bg-[var(--accent)] hover:text-accent-foreground",
        link: "text-[var(--color-text-link)] underline underline-offset-4 hover:text-[var(--color-text-link-hover)] transition-colors",
      },
      size: {
        default:
          "gap-1 px-[var(--spacing-card-padding)] py-2.5 text-sm has-[>svg]:px-[var(--spacing-stack-gap)]",
        sm: "gap-1 px-[var(--spacing-stack-gap)] py-2 text-sm has-[>svg]:px-[var(--spacing-inline-gap)]",
        lg: "gap-1.5 px-[var(--spacing-section-gap)] py-2.5 text-base has-[>svg]:px-[var(--spacing-card-padding)]",
        xl: "gap-1.5 px-[var(--spacing-section-gap)] py-3 text-base has-[>svg]:px-[var(--spacing-card-padding)]",
        icon: "aspect-square p-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export type RacButtonProps = Omit<React.ComponentProps<typeof RACButton>, "isDisabled"> &
  VariantProps<typeof buttonVariants> & {
    /** HTML parity — forwarded to React Aria as `isDisabled`. */
    disabled?: boolean
  }

export function RacButton({ className, variant, size, disabled, isDisabled, ...props }: RacButtonProps) {
  return (
    <RACButton
      data-slot="button"
      data-variant={variant ?? "default"}
      data-size={size ?? "default"}
      isDisabled={disabled ?? isDisabled}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
