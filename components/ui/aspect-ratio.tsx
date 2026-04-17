"use client"

import * as React from "react"

function AspectRatio({ ratio = 1 / 1, ...props }: React.ComponentProps<"div"> & { ratio?: number }) {
  return <div data-slot="aspect-ratio" style={{ aspectRatio: String(ratio) }} {...props} />
}

export { AspectRatio }
