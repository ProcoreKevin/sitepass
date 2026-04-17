"use client"

import * as React from "react"
import {
  Dialog as RACDialog,
  Heading,
  Modal,
  ModalOverlay,
  type ModalOverlayProps,
} from "react-aria-components"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

type DialogContextValue = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

function useDialogContext() {
  const ctx = React.useContext(DialogContext)
  if (!ctx) throw new Error("Dialog components must be used within <Dialog>")
  return ctx
}

type DialogProps = {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function Dialog({ children, open: controlledOpen, defaultOpen = false, onOpenChange }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? !!controlledOpen : uncontrolledOpen
  const setOpen = React.useCallback(
    (next: boolean) => {
      onOpenChange?.(next)
      if (!isControlled) setUncontrolledOpen(next)
    },
    [isControlled, onOpenChange],
  )

  const value = React.useMemo(() => ({ open, onOpenChange: setOpen }), [open, setOpen])

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
}

function DialogTrigger({
  asChild,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { asChild?: boolean }) {
  const { onOpenChange } = useDialogContext()

  const onClick = (e: React.MouseEvent) => {
    ;(props as React.HTMLAttributes<HTMLElement>).onClick?.(e)
    onOpenChange(true)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>, {
      onClick: (e: React.MouseEvent) => {
        ;(children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>).props.onClick?.(e)
        onOpenChange(true)
      },
    })
  }

  return (
    <button type="button" {...props} onClick={onClick}>
      {children}
    </button>
  )
}

const DialogPortal = ({ children }: { children?: React.ReactNode }) => <>{children}</>

/** @deprecated Overlay is included in `DialogContent`. No-op for API compatibility. */
function DialogOverlay(_props: React.ComponentProps<typeof ModalOverlay>) {
  return null
}

const DialogContent = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentProps<typeof RACDialog>, "children"> & {
    children?: React.ReactNode
    className?: string
    overlayClassName?: string
    modalClassName?: string
    showCloseButton?: boolean
  } & Pick<ModalOverlayProps, "isDismissable">
>(function DialogContent(
  { className, children, isDismissable = true, overlayClassName, modalClassName, showCloseButton = true, ...props },
  ref,
) {
  const { open, onOpenChange } = useDialogContext()

  return (
    <ModalOverlay
      isOpen={open}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
      className={state =>
        cn(
          "fixed inset-0 z-50 flex min-h-dvh items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-[6px] outline-hidden",
          state.isEntering && "animate-in fade-in-0",
          state.isExiting && "animate-out fade-out-0",
          overlayClassName,
        )
      }
    >
      <Modal
        className={state =>
          cn(
            /* Explicit width: avoids collapsed modal when app/components weren’t in Tailwind @source (w-full/max-w-lg missing from CSS). */
            "mx-auto box-border max-h-full w-[min(100%,32rem)] min-w-[min(100%,17.5rem)] shrink-0 outline-none",
            state.isEntering && "animate-in zoom-in-95 fade-in-0",
            state.isExiting && "animate-out zoom-out-95 fade-out-0",
            modalClassName,
          )
        }
      >
        <RACDialog
          {...props}
          ref={ref}
          data-slot="dialog-content"
          className={cn(
            "bg-card text-card-foreground border-border relative grid w-full min-w-0 max-w-full gap-4 border p-6 shadow-xl sm:rounded-xl",
            className,
          )}
        >
          {children}
          {showCloseButton && (
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-foreground-secondary hover:text-foreground-primary absolute top-4 right-4 rounded-sm opacity-80 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
        </RACDialog>
      </Modal>
    </ModalOverlay>
  )
})

function DialogClose({ children, asChild, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { onOpenChange } = useDialogContext()
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>, {
      onClick: (e: React.MouseEvent) => {
        ;(children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>).props.onClick?.(e)
        onOpenChange(false)
      },
    })
  }
  return (
    <button type="button" {...props} onClick={() => onOpenChange(false)}>
      {children}
    </button>
  )
}

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex min-w-0 flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex min-w-0 flex-col-reverse flex-wrap gap-2 sm:flex-row sm:justify-end sm:gap-2", className)}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.ComponentProps<typeof Heading>>(
  ({ className, ...props }, ref) => (
    <Heading
      ref={ref}
      slot="title"
      className={cn("min-w-0 text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  ),
)
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} slot="description" className={cn("text-foreground-secondary text-sm", className)} {...props} />
  ),
)
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
