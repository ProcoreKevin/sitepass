"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"

interface RFIRowMenuProps {
  onViewDetails?: () => void
  onEdit?: () => void
  onAddResponse?: () => void
  onChangeStatus?: () => void
  onAssign?: () => void
  onDownload?: () => void
  onDelete?: () => void
}

export function RFIRowMenu({
  onViewDetails,
  onEdit,
  onAddResponse,
  onChangeStatus,
  onAssign,
  onDownload,
  onDelete,
}: RFIRowMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-lg shadow-2xl" sideOffset={8}>
        <DropdownMenuItem
          onClick={onViewDetails}
          className="cursor-pointer rounded-md px-4 py-3 text-base font-normal hover:bg-muted focus:bg-muted"
        >
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onEdit}
          className="cursor-pointer rounded-md px-4 py-3 text-base font-normal hover:bg-muted focus:bg-muted"
        >
          Edit RFI
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onAddResponse}
          className="cursor-pointer rounded-md px-4 py-3 text-base font-normal hover:bg-muted focus:bg-muted"
        >
          Add Response
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onChangeStatus}
          className="cursor-pointer rounded-md px-4 py-3 text-base font-normal hover:bg-muted focus:bg-muted"
        >
          Change Status
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onAssign}
          className="cursor-pointer rounded-md px-4 py-3 text-base font-normal hover:bg-muted focus:bg-muted"
        >
          Assign To
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDownload}
          className="cursor-pointer rounded-md px-4 py-3 text-base font-normal hover:bg-muted focus:bg-muted"
        >
          Download
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="cursor-pointer rounded-md px-4 py-3 text-base font-normal text-destructive hover:bg-muted focus:bg-muted"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
