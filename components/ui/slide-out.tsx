"use client"

import * as React from "react"
import { ModalOverlay as RACModalOverlay } from "react-aria-components"

import {
  Dialog as SlideoutDialog,
  Modal as SlideoutPanel,
  ModalOverlay as SlideoutOverlay,
} from "@/components/application/slideout-menus/slideout-menu"
import { cn } from "@/lib/utils"

/**
 * Slide-Out (z-30): partial workspace scrim per `guidelines/Interaction-Model-Architecture.md`
 * — white at 20% opacity (modals use full-app dark scrim; slide-outs use light workspace scrim).
 */
const SLIDE_OUT_SCRIM = "bg-white/20"

type SlideOutCtx = { open: boolean; onOpenChange: (v: boolean) => void }
const SlideOutContext = React.createContext<SlideOutCtx | null>(null)

function useSlideOutContext() {
  const c = React.useContext(SlideOutContext)
  if (!c) throw new Error("SlideOut components must be used within <SlideOut>")
  return c
}

function SlideOut({
  children,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  shouldScaleBackground,
  ...props
}: {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** @deprecated No-op (legacy vaul API compatibility). */
  shouldScaleBackground?: boolean
} & React.HTMLAttributes<HTMLDivElement>) {
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
  return (
    <SlideOutContext.Provider value={value}>
      <div data-slot="slide-out" {...props}>
        {children}
      </div>
    </SlideOutContext.Provider>
  )
}

function SlideOutTrigger({
  asChild,
  children,
  ...rest
}: React.HTMLAttributes<HTMLElement> & { asChild?: boolean }) {
  const { onOpenChange } = useSlideOutContext()
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>, {
      onClick: (e: React.MouseEvent) => {
        ;(children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>).props.onClick?.(e)
        onOpenChange(true)
      },
    })
  }
  return (
    <button type="button" data-slot="slide-out-trigger" {...rest} onClick={() => onOpenChange(true)}>
      {children}
    </button>
  )
}

function SlideOutPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

function SlideOutClose({
  asChild,
  children,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { onOpenChange } = useSlideOutContext()
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>, {
      onClick: (e: React.MouseEvent) => {
        ;(children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>).props.onClick?.(e)
        onOpenChange(false)
      },
    })
  }
  return (
    <button type="button" data-slot="slide-out-close" {...props} onClick={() => onOpenChange(false)}>
      {children}
    </button>
  )
}

const overlayMotion =
  "z-[30] outline-hidden ease-linear data-[entering]:animate-in data-[entering]:duration-300 data-[entering]:fade-in-0 data-[exiting]:animate-out data-[exiting]:duration-500 data-[exiting]:fade-out-0"

/** @deprecated Prefer the overlay included in `SlideOutContent`; kept for API compatibility. */
function SlideOutOverlay({ className, ...props }: React.ComponentProps<typeof RACModalOverlay>) {
  const { open, onOpenChange } = useSlideOutContext()
  return (
    <RACModalOverlay
      data-slot="slide-out-overlay"
      isOpen={open}
      onOpenChange={onOpenChange}
      className={cn("fixed inset-0", SLIDE_OUT_SCRIM, overlayMotion, className)}
      {...props}
    />
  )
}

const slideOutContentGroup = "group/slide-out-content"

function SlideOutContent({ className, children, ...props }: React.ComponentProps<typeof SlideoutDialog>) {
  const { open, onOpenChange } = useSlideOutContext()

  return (
    <SlideOutPortal>
      <SlideoutOverlay
        isOpen={open}
        onOpenChange={onOpenChange}
        className={cn(
          "z-[30] overflow-x-hidden pl-0 md:pl-0",
          SLIDE_OUT_SCRIM,
        )}
      >
        <SlideoutPanel
          className={(state) =>
            cn(
              /* ~37% viewport; use 100% not 100vw — avoids horizontal overflow / right-edge clip with scrollbars */
              "inset-y-0 right-0 left-auto box-border h-full min-h-0 w-[min(100%,max(320px,37vw))] max-w-full shrink-0 shadow-2xl transition",
              state.isEntering && "duration-300 animate-in slide-in-from-right",
              state.isExiting && "duration-500 animate-out slide-out-to-right",
            )
          }
        >
          <SlideoutDialog
            data-slot="slide-out-content"
            data-side="right"
            className={cn(
              slideOutContentGroup,
              /* `items-start` on DS Dialog leaves horizontal gap; stretch so slide-out body fills panel width */
              "h-full min-h-0 w-full min-w-0 max-w-none flex-col items-stretch gap-0",
              className,
            )}
            {...props}
          >
            {children}
          </SlideoutDialog>
        </SlideoutPanel>
      </SlideoutOverlay>
    </SlideOutPortal>
  )
}

function SlideOutHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="slide-out-header"
      className={cn("flex flex-col gap-0.5 p-4 md:gap-1.5", className)}
      {...props}
    />
  )
}

function SlideOutFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="slide-out-footer"
      className={cn("mt-auto flex min-w-0 flex-col gap-2 p-4 sm:flex-row sm:justify-end sm:gap-2", className)}
      {...props}
    />
  )
}

function SlideOutTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2 data-slot="slide-out-title" className={cn("text-foreground font-semibold", className)} {...props} />
  )
}

function SlideOutDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p data-slot="slide-out-description" className={cn("text-muted-foreground text-sm", className)} {...props} />
  )
}

export {
  SlideOut,
  SlideOutPortal,
  SlideOutOverlay,
  SlideOutTrigger,
  SlideOutClose,
  SlideOutContent,
  SlideOutHeader,
  SlideOutFooter,
  SlideOutTitle,
  SlideOutDescription,
}
