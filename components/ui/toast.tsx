"use client"

/**
 * Toast surface is **Sonner** (`@/components/ui/sonner`, `<Toaster />` in the shell).
 * This module only exposes **types** for `toast()` in `@/lib/toast` / `hooks/use-toast` (shim API).
 *
 * Do not add Radix/shadcn viewport primitives here — use `sonner` only.
 */
export type { ToastActionElement, ToastProps } from "@/lib/toast-types"
