# Token and component refinement workflow

Use this when aligning **Untitled** primitives with the **NGX `--ds-*` spine** and app facades.

## Where things live

| Concern | Source of truth |
|--------|------------------|
| Canonical CSS variables | `Design-System/styles/ngx-canonical-tokens.css` |
| Mapping rules and naming | `docs/token-contract.md` |
| App import surface | `@/components/ui/*` only (see `docs/frontend-ngx-untitled-mandate.md`) |
| Curated token table (dev UI) | `lib/uui-studio/token-bridge-registry.ts` |
| Headless refinement registry | `lib/uui-studio/refinement-registry.ts` |

## Dev studio

When `NODE_ENV === "development"`:

- **`/dev/uui-studio`** — overview, links to sub-views.
- **`/dev/uui-studio/migration`** — route manifest, UUI scores, QA checklists (`pnpm uui:migration-manifest` to refresh data).
- **`/dev/uui-studio/facades`** — all `components/ui` facades: in-app previews (best-effort), Storybook links, prev/next, and per-facade review status in **localStorage** (`pnpm uui:facade-manifest` to refresh the list).

Token bridge rows are maintained in **`lib/uui-studio/token-bridge-registry.ts`** (no separate studio table page). **`/dev/uui-studio/tokens`** and **`/dev/uui-studio/components`** redirect to overview / facades for old bookmarks.

**`/dev/uui-migration`** redirects to **`/dev/uui-studio/migration`** (bookmark update recommended).

## Storybook

From `Design-System/`: `pnpm storybook` (port **6006**). Use the **toolbar theme** (light / dark) when comparing to the legacy shell.

### State matrix stories (NGX refinement)

Single-canvas rows for static + a few interactive states (aligned with `lib/uui-studio/refinement-registry.ts`):

| Area | Storybook sidebar |
|------|---------------------|
| Button | **Base components → Buttons → State matrix → NGX refinement matrix** |
| Input | **Base components → Inputs → State matrix → NGX refinement matrix** |
| Checkbox | **Base components → Checkboxes → State matrix → NGX refinement matrix** |
| Select | **Base components → Select → State matrix → NGX refinement matrix** |

Source: `Design-System/components/base/**/*.state-matrix.story.tsx` and `components/base/ngx-refinement/state-matrix-layout.tsx`.

Browse the rest of **Base components** for variant galleries (primary, secondary, etc.). The dev studio still links to `localhost:6006` for convenience.

## Validation

After editing `refinement-registry.ts` paths:

```bash
pnpm uui:validate-studio-registry
```

## Compliance

On touched app or facade files:

```bash
bash .cursor/skills/ngx-design-system/scripts/check-compliance.sh app
bash .cursor/skills/ngx-design-system/scripts/check-compliance.sh components/ui
```
