"use client"

import { Modal } from "@/components/modal"

interface DeleteRFIModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rfiNumber: number
  onConfirm: () => void
}

export function DeleteRFIModal({ open, onOpenChange, rfiNumber, onConfirm }: DeleteRFIModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Are you absolutely sure?"
      description={`This action cannot be undone. This will permanently delete RFI #${rfiNumber} and remove all associated data from our servers.`}
      cancelText="Cancel"
      continueText="Delete RFI"
      variant="destructive"
      onContinue={onConfirm}
    />
  )
}
