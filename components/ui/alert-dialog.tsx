"use client"

import * as React from "react"
import { Dialog as RACDialog, Heading, Modal, ModalOverlay } from "react-aria-components"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

type Ctx = { open: boolean; onOpenChange: (v: boolean) => void }
const AlertDialogContext = React.createContext<Ctx | null>(null)

function useAlertDialog() {
  const c = React.useContext(AlertDialogContext)
  if (!c) throw new Error("Alert dialog components must be used within <AlertDialog>")
  return c
}

function AlertDialog({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [u, setU] = React.useState(defaultOpen)
  const controlled = controlledOpen !== undefined
  const open = controlled ? !!controlledOpen : u
  const setOpen = React.useCallback(
    (v: boolean) => {
      onOpenChange?.(v)
      if (!controlled) setU(v)
    },
    [controlled, onOpenChange],
  )
  const value = React.useMemo(() => ({ open, onOpenChange: setOpen }), [open, setOpen])
  return <AlertDialogContext.Provider value={value}>{children}</AlertDialogContext.Provider>
}

function AlertDialogTrigger({
  asChild,
  children,
  ...rest
}: React.HTMLAttributes<HTMLElement> & { asChild?: boolean }) {
  const { onOpenChange } = useAlertDialog()
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>, {
      onClick: (e: React.MouseEvent) => {
        ;(children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>).props.onClick?.(e)
        onOpenChange(true)
      },
    })
  }
  return (
    <button type="button" {...rest} onClick={() => onOpenChange(true)}>
      {children}
    </button>
  )
}

function AlertDialogPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

function AlertDialogOverlay(_props: React.ComponentProps<typeof ModalOverlay>) {
  return null
}

function AlertDialogContent({ className, children, ...props }: React.ComponentProps<typeof RACDialog>) {
  const { open, onOpenChange } = useAlertDialog()
  return (
    <ModalOverlay
      isOpen={open}
      onOpenChange={onOpenChange}
      isDismissable={false}
      className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-[6px] data-[entering]:animate-in data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[entering]:fade-in-0"
    >
      <Modal className="mx-auto box-border max-h-full w-[min(100%,32rem)] min-w-[min(100%,17.5rem)] shrink-0 outline-none data-[entering]:animate-in data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[entering]:fade-in-0 data-[exiting]:zoom-out-95 data-[entering]:zoom-in-95">
        <RACDialog
          {...props}
          data-slot="dialog-content"
          className={cn(
            "bg-card text-card-foreground border-border grid w-full min-w-0 max-w-full gap-4 rounded-xl border p-6 shadow-xl duration-200",
            className,
          )}
        >
          {children}
        </RACDialog>
      </Modal>
    </ModalOverlay>
  )
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-header" className={cn("flex flex-col gap-2 text-center sm:text-left", className)} {...props} />
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof Heading>) {
  return (
    <Heading
      slot="title"
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p data-slot="alert-dialog-description" className={cn("text-muted-foreground text-sm", className)} {...props} />
  )
}

function AlertDialogAction({ className, onClick, ...props }: React.ComponentProps<"button">) {
  const { onOpenChange } = useAlertDialog()
  return (
    <button
      type="button"
      className={cn(buttonVariants(), className)}
      onClick={e => {
        onClick?.(e)
        onOpenChange(false)
      }}
      {...props}
    />
  )
}

function AlertDialogCancel({ className, onClick, ...props }: React.ComponentProps<"button">) {
  const { onOpenChange } = useAlertDialog()
  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant: "outline" }), className)}
      onClick={e => {
        onClick?.(e)
        onOpenChange(false)
      }}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
