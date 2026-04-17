"use client"

import { cn } from "@/lib/utils"

const NAV_ICON_PX = 32

/**
 * Jumbo menu treats section / promo art as small toolbar-style icons (Hero-icon scale), not hero illustrations.
 */
export function JumboNavIcon({
  src,
  className,
}: {
  src: string
  className?: string
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      width={NAV_ICON_PX}
      height={NAV_ICON_PX}
      className={cn("h-8 w-8 max-h-8 max-w-8 shrink-0 object-contain", className)}
      decoding="async"
    />
  )
}
