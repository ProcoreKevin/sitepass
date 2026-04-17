"use client"

import * as React from "react"
import { Avatar as UuiAvatar, type AvatarProps as UuiAvatarProps } from "@untitledui/react/components/base/avatar/avatar"

import { cn } from "@/lib/utils"

type AvatarSize = NonNullable<UuiAvatarProps["size"]>

function classNameToUuiSize(className?: string): AvatarSize {
  if (!className) return "sm"
  if (className.includes("size-[72px]") || className.includes("h-[72px]")) return "xl"
  if (className.includes("h-10") || className.includes("w-10") || className.includes("size-10")) return "md"
  if (className.includes("h-7") || className.includes("w-7") || className.includes("size-7")) return "xs"
  if (className.includes("h-6") || className.includes("w-6")) return "xs"
  return "sm"
}

function fallbackToInitials(node: React.ReactNode): string | undefined {
  if (node == null) return undefined
  if (typeof node === "string" || typeof node === "number") return String(node).slice(0, 3)
  if (Array.isArray(node)) {
    const s = node.map(fallbackToInitials).filter(Boolean).join("")
    return s.slice(0, 3) || undefined
  }
  return undefined
}

function AvatarImage(_props: { src?: string; alt?: string; className?: string }) {
  return null
}
AvatarImage.displayName = "AvatarImage"

function AvatarFallback(_props: { className?: string; children?: React.ReactNode }) {
  return null
}
AvatarFallback.displayName = "AvatarFallback"

function parseAvatarChildren(children: React.ReactNode): Pick<UuiAvatarProps, "src" | "alt" | "initials"> {
  let src: string | undefined
  let alt: string | undefined
  let initials: string | undefined

  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) return
    if (child.type === AvatarImage) {
      const p = child.props as { src?: string; alt?: string }
      src = p.src ?? undefined
      alt = p.alt
    }
    if (child.type === AvatarFallback) {
      initials = fallbackToInitials((child.props as { children?: React.ReactNode }).children)
    }
  })

  return { src, alt, initials }
}

function Avatar({ className, children }: { className?: string; children?: React.ReactNode }) {
  const parsed = React.useMemo(() => parseAvatarChildren(children), [children])
  return (
    <UuiAvatar
      data-slot="avatar"
      contrastBorder={false}
      size={classNameToUuiSize(className)}
      className={className}
      src={parsed.src}
      alt={parsed.alt}
      initials={parsed.initials}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
