import type { ReactNode } from "react";

/**
 * Labeled rows for NGX / token refinement QA in Storybook (light + dark toolbar).
 */
export function StateMatrixShell({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
    return (
        <div className="min-h-screen w-full bg-primary p-6">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-lg font-semibold text-primary">{title}</h1>
                {description ? <p className="mt-2 max-w-2xl text-sm text-tertiary">{description}</p> : null}
                <div className="mt-6 divide-y divide-secondary border-y border-secondary">{children}</div>
            </div>
        </div>
    );
}

export function StateMatrixRow({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
    return (
        <div className="grid grid-cols-1 items-start gap-3 py-5 sm:grid-cols-[minmax(140px,180px)_1fr] sm:items-center sm:gap-6">
            <div>
                <p className="text-sm font-medium text-secondary">{label}</p>
                {hint ? <p className="mt-0.5 text-xs text-quaternary">{hint}</p> : null}
            </div>
            <div className="min-w-0">{children}</div>
        </div>
    );
}
