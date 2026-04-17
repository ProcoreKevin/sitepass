"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  cancelText?: string
  continueText?: string
  onCancel?: () => void
  onContinue?: () => void
  variant?: "default" | "destructive"
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  cancelText = "Cancel",
  continueText = "Continue",
  onCancel,
  onContinue,
  variant = "default",
}: ModalProps) {
  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const handleContinue = () => {
    onContinue?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] gap-6 rounded-2xl p-8">
        <DialogHeader className="space-y-4 text-left">
          <DialogTitle className="text-3xl font-semibold leading-tight">{title}</DialogTitle>
          <DialogDescription className="text-base leading-relaxed text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 sm:gap-3">
          <Button variant="outline" onClick={handleCancel} className="min-w-[100px] bg-transparent">
            {cancelText}
          </Button>
          <Button
            onClick={handleContinue}
            className={cn(
              "min-w-[100px]",
              variant === "destructive"
                ? "bg-destructive text-background-primary hover:bg-destructive/90"
                : "bg-foreground text-background hover:bg-foreground/90",
            )}
          >
            {continueText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
