# Frontend mandate — NGX Legacy theme + Untitled UI (headless RAC)

This app is **one surface**: **Procore NGX Legacy tokens** (`app/legacy-theme.css`, `[data-theme="legacy"]`) **over** **Untitled UI** primitives from the local package `@untitledui/react` ([Design-System/](../Design-System/)). Do not compose parallel styling systems on the same control.

## Non‑negotiables

1. **Root** — `app/layout.tsx` sets `data-theme="legacy"` and `data-design-system="ngx-legacy-uui"` on `<html>`. Keep **ThemeProvider** (`next-themes` + `.dark-mode` sync for Untitled) wrapping the tree.
2. **Imports** — Use **`@/components/ui/*`** for app code. Those modules re-export or adapt **Untitled / RAC** (see [migration-uui-rac-status.md](./migration-uui-rac-status.md)). Avoid importing `@untitledui/react/...` directly in app routes unless building a new facade.
3. **No raw controls** — Prefer **`Button`**, **`Input`**, **`Tabs`**, **`Checkbox`**, **`Select`**, etc., over native `<button>` / `<input>` for interactive chrome. (Header `[data-header="global"]` is the documented exception for legacy `!important` overrides.)
4. **Tokens** — Prefer NGX semantic utilities: `bg-background-primary`, `text-foreground-primary`, `border-border-default`, not raw `bg-white` / hex, so **light + dark** stay aligned with `globals.css` and legacy bridge variables.
5. **Dark mode** — `html.dark` (next-themes) + `html.dark-mode` (Untitled sync) both apply **`html.*[data-theme="legacy"]`** overrides in `legacy-theme.css` §21 for legacy `--color-*` and Tailwind surface keys (`--background`, `--card`, …).

## Tool routes

Stub tools should use **[`ToolPageTemplate`](../components/tool-page-template.tsx)** — Untitled **Button** + RAC **Tabs** (`components/ui/tabs.tsx`), NGX surfaces.

## CSS load order

See `app/globals.css`: layers **`base` → `react-aria` → `untitled-ui` → `legacy-theme`**. Legacy wins for Procore parity; Untitled supplies structure and motion.

## Further reading

- [primitive-facade-defaults.md](./primitive-facade-defaults.md) — **Untitled vs RAC** per `components/ui` facade; reference vs product shell; rules for new work  
- [token-contract.md](./token-contract.md) — **`--ds-*`** single spine, mappings to legacy/Tailwind  
- [token-refinement-workflow.md](./token-refinement-workflow.md) — dev studio, token map, refinement prompts  
- [navigation-architecture.md](./navigation-architecture.md) — menus, route alignment, context menu status  
- [token-bridge-uui-ngx.md](./token-bridge-uui-ngx.md)  
- [uui-facade-inventory.md](./uui-facade-inventory.md)  
- `.cursor/skills/ngx-design-system/SKILL.md`

## Tooling

- **ESLint**: `.eslintrc.json` **`no-restricted-imports`** blocks **`@untitledui/react`** everywhere except **`components/ui/*`**, **`components/ui-next/*`**, and **`Design-System/*`**. App routes, **`shared/`**, **`lib/`**, and other leaf **`components/*`** must use **`@/components/ui/*`** (e.g. [`close-button`](../components/ui/close-button.tsx) for DS `CloseButton`).
- **Compliance**: `pnpm run lint:compliance` runs `.cursor/skills/ngx-design-system/scripts/check-compliance.sh` on `app/` and `components/ui/`; PRs also run [`.github/workflows/compliance.yml`](../.github/workflows/compliance.yml) when those paths change.
- **Global header**: [app/legacy-theme.css](../app/legacy-theme.css) (section **22. GLOBAL HEADER**) — native `<button>` + `header-icon-btn` remain the documented exception for `[data-header="global"]` `!important` chrome.
