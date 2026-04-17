"use client"

import * as React from "react"
import { Dialog as RACDialog, Modal, ModalOverlay } from "react-aria-components"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type SheetCtx = { open: boolean; onOpenChange: (v: boolean) => void }
const SheetContext = React.createContext<SheetCtx | null>(null)

function useSheetContext() {
  const c = React.useContext(SheetContext)
  if (!c) throw new Error("Sheet components must be used within <Sheet>")
  return c
}

function Sheet({
  children,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
}: {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [u, setU] = React.useState(!!defaultOpen)
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
  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
}

function SheetTrigger({
  asChild,
  children,
  ...rest
}: React.HTMLAttributes<HTMLElement> & { asChild?: boolean }) {
  const { onOpenChange } = useSheetContext()
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

function SheetClose({
  asChild,
  children,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { onOpenChange } = useSheetContext()
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

const SheetPortal = ({ children }: { children?: React.ReactNode }) => <>{children}</>

function SheetOverlay(_props: React.ComponentProps<typeof ModalOverlay>) {
  return null
}

const sideClasses = {
  right:
    "inset-y-0 right-0 h-full w-3/4 border-l data-[entering]:slide-in-from-right data-[exiting]:slide-out-to-right sm:max-w-sm",
  left: "inset-y-0 left-0 h-full w-3/4 border-r data-[entering]:slide-in-from-left data-[exiting]:slide-out-to-left sm:max-w-sm",
  top: "inset-x-0 top-0 h-auto border-b data-[entering]:slide-in-from-top data-[exiting]:slide-out-to-top",
  bottom:
    "inset-x-0 bottom-0 h-auto border-t data-[entering]:slide-in-from-bottom data-[exiting]:slide-out-to-bottom",
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof RACDialog> & {
  side?: keyof typeof sideClasses
}) {
  const { open, onOpenChange } = useSheetContext()

  return (
    <ModalOverlay
      isOpen={open}
      onOpenChange={onOpenChange}
      className="fixed inset-0 z-[30] bg-black/40 backdrop-blur-[2px] data-[entering]:animate-in data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[entering]:fade-in-0"
    >
      <Modal className="fixed inset-0 z-[30] flex h-[--visual-viewport-height] w-full items-end justify-end p-0 outline-none sm:items-stretch">
        <RACDialog
          {...props}
          className={cn(
            "bg-card text-card-foreground border-border fixed z-[30] flex flex-col gap-4 shadow-xl transition ease-in-out data-[exiting]:duration-300 data-[entering]:duration-500 data-[entering]:animate-in data-[exiting]:animate-out",
            sideClasses[side],
            className,
          )}
        >
          {children}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="ring-offset-background focus:ring-ring data-[entering]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
          >
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </button>
        </RACDialog>
      </Modal>
    </ModalOverlay>
  )
}

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("text-foreground font-semibold", className)} {...props} />
  ),
)
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-foreground-secondary text-sm", className)} {...props} />
  ),
)
SheetDescription.displayName = "SheetDescription"

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
