import Link from "next/link"

import manifest from "@/lib/generated/uui-migration-manifest.json"
import { REFINEMENT_REGISTRY, tokenBridgeStats, TOKEN_BRIDGE_ROWS } from "@/lib/uui-studio"

import { StudioCard, StudioCardBody, StudioCardHeader, StudioPageShell } from "./studio-primitives"

export default function UuiStudioOverviewPage() {
  const scoreSummary = (manifest as { scoreSummary?: Record<string, number> }).scoreSummary
  const bridge = tokenBridgeStats()

  return (
    <StudioPageShell>
      <section>
        <StudioCard>
          <StudioCardHeader
            title="Application routes (migration)"
            description="Manifest scores and tier counts. Open the migration table for filters, QA checklists, and per-route actions."
          />
          <StudioCardBody>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-foreground-secondary text-xs font-medium tracking-wide uppercase">Average UUI score</p>
                <p className="text-foreground-primary mt-2 text-2xl font-medium tabular-nums">{scoreSummary?.average ?? "—"}</p>
              </div>
              <div>
                <p className="text-foreground-secondary text-xs font-medium tracking-wide uppercase">Integrated</p>
                <p className="text-[var(--color-text-success)] mt-2 text-sm font-normal tabular-nums">
                  {scoreSummary?.integrated ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-foreground-secondary text-xs font-medium tracking-wide uppercase">Mixed</p>
                <p className="text-[var(--color-text-warning)] mt-2 text-sm font-normal tabular-nums">{scoreSummary?.mixed ?? "—"}</p>
              </div>
              <div>
                <p className="text-foreground-secondary text-xs font-medium tracking-wide uppercase">Legacy</p>
                <p className="text-[var(--color-text-danger)] mt-2 text-sm font-normal tabular-nums">{scoreSummary?.legacy ?? "—"}</p>
              </div>
            </div>
            <p className="text-foreground-secondary mt-6 text-sm font-normal">
              <Link
                href="/dev/uui-studio/migration"
                className="text-foreground-primary font-medium underline-offset-4 transition-colors duration-150 hover:underline"
              >
                Open migration table →
              </Link>
              <span className="text-foreground-tertiary mx-2">·</span>
              Regenerate:{" "}
              <code className="text-foreground-primary rounded bg-background-secondary px-1.5 py-0.5 text-xs">pnpm uui:migration-manifest</code>
            </p>
          </StudioCardBody>
        </StudioCard>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <StudioCard>
          <StudioCardHeader
            title="Token bridge (curated)"
            description="Counts from the in-repo registry; not a runtime scan."
          />
          <StudioCardBody>
            <p className="text-foreground-primary text-sm font-normal leading-relaxed">
              <span className="font-medium">{bridge.mapped}</span> mapped ·{" "}
              <span className="text-[var(--color-text-warning)]">{bridge.partial}</span> partial ·{" "}
              <span className="text-[var(--color-text-danger)]">{bridge.gap}</span> gaps ·{" "}
              <span className="text-foreground-secondary">{bridge.total} rows</span>
            </p>
            <p className="text-foreground-secondary mt-4 text-sm">
              Curated rows live in{" "}
              <code className="text-foreground-primary rounded bg-background-secondary px-1 py-0.5 text-xs">lib/uui-studio/token-bridge-registry.ts</code>
              .
            </p>
          </StudioCardBody>
        </StudioCard>

        <StudioCard>
          <StudioCardHeader
            title="UI facades (app)"
            description="Every components/ui facade: preview in the app, Storybook hints, and per-facade review status (localStorage)."
          />
          <StudioCardBody>
            <p className="text-foreground-secondary text-sm font-normal leading-relaxed">
              Refinement matrices for core primitives remain in Storybook ({REFINEMENT_REGISTRY.length} tracked in{" "}
              <code className="text-foreground-primary rounded bg-background-secondary px-1 py-0.5 text-xs">refinement-registry.ts</code>
              ).
            </p>
            <p className="mt-4 text-sm">
              <Link
                href="/dev/uui-studio/facades"
                className="text-foreground-primary font-medium underline-offset-4 transition-colors duration-150 hover:underline"
              >
                Open facade gallery →
              </Link>
            </p>
          </StudioCardBody>
        </StudioCard>
      </section>

      <StudioCard>
        <StudioCardHeader title="Authoritative files" description="Edit these in Git — the studio only surfaces them." />
        <StudioCardBody className="pt-0">
          <ul className="text-foreground-secondary divide-border-default divide-y text-sm font-normal">
            <li className="py-3 first:pt-0">
              <code className="text-foreground-primary text-xs">Design-System/styles/ngx-canonical-tokens.css</code>
              <span className="text-foreground-tertiary mt-1 block text-xs">
                Canonical <code className="text-foreground-secondary text-xs">--ds-*</code>
              </span>
            </li>
            <li className="py-3">
              <code className="text-foreground-primary text-xs">docs/token-contract.md</code>
              <span className="text-foreground-tertiary mt-1 block text-xs">Mappings and rules</span>
            </li>
            <li className="py-3">
              <code className="text-foreground-primary text-xs">docs/frontend-ngx-untitled-mandate.md</code>
              <span className="text-foreground-tertiary mt-1 block text-xs">App import surface</span>
            </li>
            <li className="py-3">
              <code className="text-foreground-primary text-xs">docs/primitive-facade-defaults.md</code>
              <span className="text-foreground-tertiary mt-1 block text-xs">Untitled vs RAC per facade; safe integration rules</span>
            </li>
            <li className="py-3">
              <code className="text-foreground-primary text-xs">app/legacy-theme.css</code>
              <span className="text-foreground-tertiary mt-1 block text-xs">
                Legacy Procore look on <code className="text-foreground-secondary text-xs">[data-theme=&quot;legacy&quot;]</code>
              </span>
            </li>
            <li className="py-3">
              <code className="text-foreground-primary text-xs">lib/uui-studio/token-bridge-registry.ts</code>
              <span className="text-foreground-tertiary mt-1 block text-xs">Studio token table ({TOKEN_BRIDGE_ROWS.length} rows)</span>
            </li>
          </ul>
        </StudioCardBody>
      </StudioCard>
    </StudioPageShell>
  )
}
