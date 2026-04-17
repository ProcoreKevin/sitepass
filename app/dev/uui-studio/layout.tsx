import { notFound } from "next/navigation"

import { StudioNav } from "./studio-nav"

export default function UuiStudioLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== "development") notFound()

  return (
    <div
      className="bg-background-secondary text-foreground-primary flex min-h-0 min-w-0 w-full flex-1 flex-col"
      data-uui-studio
    >
      <header className="border-border-default bg-background-primary border-b">
        <div className="w-full min-w-0 px-8 py-6">
          <div className="min-w-0 w-full">
            <div className="flex flex-wrap items-center gap-3">
              <span className="border-border-default bg-background-primary text-foreground-secondary inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium tracking-wide uppercase">
                Development only
              </span>
              <h1 className="text-foreground-primary text-2xl font-medium tracking-tight">UUI headless studio</h1>
            </div>
            <p className="text-foreground-secondary mt-4 text-sm font-normal leading-relaxed">
              NGX / legacy <code className="text-foreground-primary bg-background-primary rounded border border-border-default px-1.5 py-0.5 text-xs">--ds-*</code>{" "}
              tokens, Untitled surfaces, route migration scores, and primitive refinement — aggregated for local QA. Canonical sources stay in Git.
            </p>
            <p className="text-foreground-tertiary mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-normal">
              <span className="font-medium">SoT files:</span>
              <code className="text-foreground-secondary bg-background-primary rounded border border-border-default px-1.5 py-0.5">
                Design-System/styles/ngx-canonical-tokens.css
              </code>
              <span aria-hidden="true">·</span>
              <code className="text-foreground-secondary bg-background-primary rounded border border-border-default px-1.5 py-0.5">docs/token-contract.md</code>
            </p>
            <p className="text-foreground-tertiary mt-2 text-xs">
              Visual SoT: Untitled primitives in{" "}
              <code className="text-foreground-secondary bg-background-primary rounded border border-border-default px-1 py-0.5">Design-System</code> — use{" "}
              <span className="text-foreground-secondary font-medium">Storybook</span> in the tab bar (localhost:6006).
            </p>
          </div>
        </div>
      </header>
      <StudioNav />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
