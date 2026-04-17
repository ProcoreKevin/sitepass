"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Responsive square sizes (fluid between min/max via viewport):
 * - sm:  89px  → 144px
 * - mid: 144px → 233px
 * - lg:  233px → 377px
 */
export const publicIllustrationSizeClass = {
  sm: "aspect-square w-[clamp(5.5625rem,25vw,9rem)] h-[clamp(5.5625rem,25vw,9rem)]",
  mid: "aspect-square w-[clamp(9rem,22vw,14.5625rem)] h-[clamp(9rem,22vw,14.5625rem)]",
  lg: "aspect-square w-[clamp(14.5625rem,28vw,23.5625rem)] h-[clamp(14.5625rem,28vw,23.5625rem)]",
} as const

export type PublicIllustrationSize = keyof typeof publicIllustrationSizeClass

/**
 * SVG nnnoise-style stack — matches global illustration treatment:
 * fractalNoise → specularLighting → desaturate, over a theme-tinted base (#7957A8 / --primary).
 */
function IllustrationNoiseOverlay({ filterId }: { filterId: string }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full text-[var(--primary)] opacity-100 mix-blend-soft-light"
      aria-hidden
      preserveAspectRatio="none"
    >
      <defs>
        <filter
          id={filterId}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
          colorInterpolationFilters="linearRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.2"
            numOctaves={4}
            seed={15}
            stitchTiles="stitch"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="turbulence"
          />
          <feSpecularLighting
            in="turbulence"
            surfaceScale={8}
            specularConstant={0.7}
            specularExponent={20}
            lightingColor="currentColor"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="specularLighting"
          >
            <feDistantLight azimuth={3} elevation={108} />
          </feSpecularLighting>
          <feColorMatrix
            in="specularLighting"
            type="saturate"
            values="0"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="colormatrix"
          />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="transparent" />
      <rect width="100%" height="100%" fill="currentColor" filter={`url(#${filterId})`} />
    </svg>
  )
}

export interface PublicIllustrationProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string
  /** When true, image is decorative (empty alt + aria-hidden). */
  decorative?: boolean
  /** Accessible name when decorative is false. */
  alt: string
  size?: PublicIllustrationSize
  /** Optional card frame (border/fill). Default off — illustrations sit on transparent background. */
  framed?: boolean
  /** Fractal noise + specular overlay on top of the artwork (shared filter, theme tint). */
  noiseOverlay?: boolean
  imgClassName?: string
}

export function PublicIllustration({
  src,
  alt,
  decorative = false,
  size = "sm",
  framed = false,
  noiseOverlay = true,
  className,
  imgClassName,
  ...rest
}: PublicIllustrationProps) {
  const reactId = React.useId()
  const noiseFilterId = `nnnoise-${reactId.replace(/:/g, "")}`

  return (
    <div
      className={cn(
        "relative flex max-w-full shrink-0 items-center justify-center overflow-hidden",
        publicIllustrationSizeClass[size],
        framed &&
          cn(
            "rounded-lg border border-border-default bg-background-primary",
            "p-[clamp(0.25rem,1.2vw,0.75rem)] shadow-sm",
          ),
        className,
      )}
      {...rest}
    >
      <img
        src={src}
        alt={decorative ? "" : alt}
        aria-hidden={decorative ? true : undefined}
        className={cn("relative z-0 h-full w-full object-contain object-center", imgClassName)}
        decoding="async"
      />
      {noiseOverlay ? <IllustrationNoiseOverlay filterId={noiseFilterId} /> : null}
    </div>
  )
}
