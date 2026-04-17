"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"

interface ProcoreLogoProps {
  variant?: "light" | "dark"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ProcoreLogo({ variant = "dark", size = "md", className }: ProcoreLogoProps) {
  const sizeClasses = {
    sm: "h-4 w-auto",
    md: "h-6 w-auto",
    lg: "h-8 w-auto",
  }

  const colorClasses = {
    light: "brightness-0 invert", // White logo for light backgrounds
    dark: "", // Original logo colors for dark backgrounds
  }

  return (
    <Image
      src="/procore-logo.svg"
      alt="Procore"
      width={120}
      height={32}
      className={cn(sizeClasses[size], colorClasses[variant], className)}
      priority
    />
  )
}
