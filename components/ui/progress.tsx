"use client"

import * as React from "react"
import { ProgressBarBase } from "@untitledui/react/components/base/progress-indicators/progress-indicators"

import { cn } from "@/lib/utils"

function Progress({ className, value }: { className?: string; value?: number | null }) {
  return (
    <div data-slot="progress" className={cn("w-full", className)}>
      <ProgressBarBase
        value={value ?? 0}
        min={0}
        max={100}
        className="bg-primary/20"
        progressClassName="bg-primary"
      />
    </div>
  )
}

export { Progress }
