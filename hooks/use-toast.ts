"use client"

import { toast as sonnerToast } from "sonner"

import type { ToastActionElement, ToastProps } from "@/lib/toast-types"

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

type Toast = Omit<ToasterToast, "id">

function toast({ title, description, variant, action }: Toast) {
  const titleText = typeof title === "string" ? title : title != null ? String(title) : ""
  const descText =
    typeof description === "string" ? description : description != null ? String(description) : undefined

  const id =
    variant === "destructive"
      ? sonnerToast.error(titleText || "Error", { description: descText })
      : sonnerToast(titleText || " ", {
          description: descText,
          action: action
            ? {
                label: "Action",
                onClick: () => {},
              }
            : undefined,
        })

  const sid = String(id)

  return {
    id: sid,
    dismiss: () => sonnerToast.dismiss(sid),
    update: (_p: Partial<ToasterToast>) => {},
  }
}

function useToast() {
  return {
    toasts: [] as ToasterToast[],
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) sonnerToast.dismiss(toastId)
      else sonnerToast.dismiss()
    },
  }
}

export { useToast, toast }
