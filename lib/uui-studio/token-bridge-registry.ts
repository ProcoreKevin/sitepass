/**
 * Curated Legacy / app-facing → canonical `--ds-*` → Untitled semantic hints.
 * SoT for values: Design-System/styles/ngx-canonical-tokens.css + docs/token-contract.md
 * This table powers the dev studio Token map UI (read-only).
 */

export type TokenBridgeStatus = "mapped" | "partial" | "gap" | "deprecated"

export type TokenBridgeLayer = "canvas" | "surface" | "text" | "border" | "brand" | "input" | "motion" | "other"

export interface TokenBridgeRow {
  id: string
  layer: TokenBridgeLayer
  dsCanonical: string
  legacyAlias: string
  appTailwind: string
  untitledSemanticHint: string
  status: TokenBridgeStatus
  notes?: string
}

export const TOKEN_BRIDGE_ROWS: TokenBridgeRow[] = [
  {
    id: "bg-canvas",
    layer: "canvas",
    dsCanonical: "--ds-bg-canvas",
    legacyAlias: "--color-bg-canvas",
    appTailwind: "bg-background-secondary",
    untitledSemanticHint: "bg-secondary / canvas surfaces",
    notes: "Gray workspace canvas in shell; legacy token is --ds-bg-canvas / --color-bg-canvas (#F5F5F5). See docs/token-contract.md.",
    status: "mapped",
  },
  {
    id: "bg-primary",
    layer: "surface",
    dsCanonical: "--ds-bg-primary",
    legacyAlias: "--color-bg-primary",
    appTailwind: "bg-background-primary",
    untitledSemanticHint: "bg-primary (cards, panels)",
    status: "mapped",
  },
  {
    id: "bg-secondary",
    layer: "surface",
    dsCanonical: "--ds-bg-secondary",
    legacyAlias: "--color-bg-secondary",
    appTailwind: "bg-background-secondary",
    untitledSemanticHint: "hover, zebra, muted strips — not static headers",
    notes: "Do not use for page headers or table thead; use bg-background-primary. See app/legacy-theme.css §02.",
    status: "mapped",
  },
  {
    id: "bg-tertiary",
    layer: "surface",
    dsCanonical: "--ds-bg-tertiary",
    legacyAlias: "--color-bg-tertiary",
    appTailwind: "toolbars, inset",
    untitledSemanticHint: "tertiary / inset toolbars",
    status: "mapped",
  },
  {
    id: "text-primary",
    layer: "text",
    dsCanonical: "--ds-text-primary",
    legacyAlias: "--color-text-primary",
    appTailwind: "text-foreground-primary",
    untitledSemanticHint: "text-primary / fg tokens",
    status: "mapped",
  },
  {
    id: "text-secondary",
    layer: "text",
    dsCanonical: "--ds-text-secondary",
    legacyAlias: "--color-text-secondary",
    appTailwind: "text-foreground-secondary",
    untitledSemanticHint: "text-secondary / fg-secondary",
    status: "mapped",
  },
  {
    id: "text-tertiary",
    layer: "text",
    dsCanonical: "--ds-text-tertiary",
    legacyAlias: "--color-text-tertiary",
    appTailwind: "text-foreground-tertiary",
    untitledSemanticHint: "text-tertiary / quaternary fg",
    status: "mapped",
  },
  {
    id: "border-default",
    layer: "border",
    dsCanonical: "--ds-border-default",
    legacyAlias: "--color-border-default",
    appTailwind: "border-border-default",
    untitledSemanticHint: "border-primary / ring-secondary",
    status: "mapped",
  },
  {
    id: "border-input-default",
    layer: "input",
    dsCanonical: "--ds-border-input-default",
    legacyAlias: "--color-border-input-default",
    appTailwind: "input borders",
    untitledSemanticHint: "input wrapper / border-input",
    status: "mapped",
  },
  {
    id: "border-input-focus",
    layer: "input",
    dsCanonical: "--ds-border-input-focus",
    legacyAlias: "--color-border-input-focus",
    appTailwind: "focus ring",
    untitledSemanticHint: "focus-visible:outline-brand",
    status: "mapped",
  },
  {
    id: "brand-500",
    layer: "brand",
    dsCanonical: "--ds-brand-500",
    legacyAlias: "--color-brand-500 (+ ramp)",
    appTailwind: "primary CTA",
    untitledSemanticHint: "bg-brand-solid, text on brand",
    status: "mapped",
  },
  {
    id: "motion-short",
    layer: "motion",
    dsCanonical: "--ds-motion-duration-short",
    legacyAlias: "--motion-duration-short",
    appTailwind: "duration-ds-short",
    untitledSemanticHint: "transition duration (buttons)",
    status: "mapped",
  },
  {
    id: "motion-medium",
    layer: "motion",
    dsCanonical: "--ds-motion-duration-medium",
    legacyAlias: "--motion-duration-medium",
    appTailwind: "duration-ds-medium",
    untitledSemanticHint: "default motion",
    status: "mapped",
  },
  {
    id: "tailwind-surface-bridge",
    layer: "other",
    dsCanonical: "(via --color-* → --ds-*)",
    legacyAlias: "--background, --foreground, --card, …",
    appTailwind: "Tailwind theme keys (Untitled utilities)",
    untitledSemanticHint: "legacy-theme §13 maps to --ds-*",
    status: "mapped",
    notes: "See docs/token-contract.md — Tailwind/Untitled surface keys under [data-theme=legacy].",
  },
]

export function tokenBridgeStats(rows: TokenBridgeRow[] = TOKEN_BRIDGE_ROWS) {
  const byStatus = (s: TokenBridgeStatus) => rows.filter(r => r.status === s).length
  return {
    total: rows.length,
    mapped: byStatus("mapped"),
    partial: byStatus("partial"),
    gap: byStatus("gap"),
    deprecated: byStatus("deprecated"),
  }
}
