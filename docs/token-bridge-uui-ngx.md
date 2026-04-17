# Untitled UI ↔ NGX token bridge

This document describes how **Design-System** ([Untitled UI React](https://www.untitledui.com/react/docs/introduction)) tokens align with **NGX** rules in [.cursor/skills/ngx-design-system/SKILL.md](../.cursor/skills/ngx-design-system/SKILL.md).

## Layer order

Defined in [app/globals.css](../app/globals.css):

`base` → `react-aria` → `untitled-ui` → `legacy-theme`

- **untitled-ui** (in order): [ngx-canonical-tokens.css](../Design-System/styles/ngx-canonical-tokens.css) (`--ds-*` spine) → [Design-System/styles/theme.css](../Design-System/styles/theme.css) → [uui-ngx-token-bridge.css](../app/uui-ngx-token-bridge.css) (thin `--color-brand-*` → `--ds-brand-*`) → typography.
- **legacy-theme**: [app/legacy-theme.css](../app/legacy-theme.css) scoped to `[data-theme="legacy"]` — Procore legacy **aliases** (`--color-*` → `var(--ds-*)`) plus **Tailwind semantic keys** (`--primary`, `--background`, `--muted`, etc.) for Untitled utility classes.

Canonical contract: [token-contract.md](./token-contract.md).

## Cascade strategy (chosen)

**Bridge + legacy coexistence**

1. [app/uui-ngx-token-bridge.css](../app/uui-ngx-token-bridge.css) is imported **inside** the `untitled-ui` layer **after** `theme.css`. It re-points Untitled’s **`--color-brand-*`** and key **`--color-utility-brand-*`** aliases to **`var(--primary, …)`** and the NGX brand ramp already defined on `:root` in `globals.css` (copilot / orange). That way `@untitledui/react` components using `bg-brand-*`, `text-brand-*`, and utility brand classes pick up **NGX primary**, not Untitled’s default purple.

2. **legacy-theme** remains the source of **`--primary`, `--background`, `--card`, `--muted-*`, sidebar tokens** for Tailwind / Untitled utility classes under `[data-theme="legacy"]`.

3. **NGX semantic tokens** (`--foreground-primary`, `--background-primary`, `--border-default`, badge tokens, etc.) stay on `:root` / `.dark` in `globals.css` and are exposed to Tailwind via `@theme inline`.

4. **Narrowing legacy-theme** to “shell only” is deferred: the app root uses `data-theme="legacy"` today; removing it would change every screen. Future work: optional `data-theme="ngx"` without legacy overrides for greenfield views.

## Mapping reference

| NGX / app semantic | Typical use | Untitled / UUI hook |
|--------------------|------------|---------------------|
| `--primary`, `--primary-foreground` | CTA, links | `--color-brand-600`, buttons, links in DS |
| `--background`, `--card` | Surfaces | `bg-primary`, `bg-secondary` in DS map to theme |
| `--foreground`, `--muted-foreground` | Text | `text-primary`, `text-secondary`, `text-tertiary` |
| `--border`, `--input`, `--ring` | Borders / focus | `ring-primary`, `border-secondary` |
| `--uui-*` bridge vars | RAC adapters in `components/ui` | Same names consumed by `@theme inline` |
| Guidelines z-index | tooltip `z-10`, popover `z-20`, slide-out `z-30`, modal `z-50` | Apply in facades (`tooltip`, `sheet`, `dialog`) |

## Theme runtime

- [components/theme-provider.tsx](../components/theme-provider.tsx): **next-themes** (`class` on `<html>`) + **`.dark-mode`** on `documentElement` for Untitled’s dark variable set.
- **`data-density`**: `compact` | `comfortable` drives `--text-scale` in `globals.css`.
- **System preference**: `enableSystem` on `ThemeProvider` so theme can follow OS light/dark when the user selects “system” (if exposed in UI).

## Compliance

After changing tokens or layers, run:

`.cursor/skills/ngx-design-system/scripts/check-compliance.sh`
