# Token contract — single spine (`--ds-*`) + mappings

**Authoritative values** for Procore NGX + Untitled live in [`Design-System/styles/ngx-canonical-tokens.css`](../Design-System/styles/ngx-canonical-tokens.css) as **`--ds-*`** custom properties. Everything else **aliases** them.

## Rules

1. **Do not** add new raw `rgb()` / `#hex` for product chrome in [`app/legacy-theme.css`](../app/legacy-theme.css) or feature TSX — extend `--ds-*` or use Tailwind semantic utilities (`bg-background-primary`, etc.).
2. **Light / dark**: `:root` defines light `--ds-*`; `html.dark[data-theme="legacy"]` and `html.dark-mode[data-theme="legacy"]` override the same names (see canonical file).
3. **Density**: [`[data-density="comfortable"]`](../app/globals.css) scales typography via `--text-scale` (unchanged).
4. **Components**: App code uses [`@/components/ui/*`](../components/ui/); Untitled imports stay inside facades and Design-System.

## Canonical → legacy `--color-*` (inside `[data-theme="legacy"]`)

| Canonical (`--ds-*`) | Legacy alias | Typical Tailwind (app) |
|---------------------|--------------|-------------------------|
| `--ds-bg-canvas` | `--color-bg-canvas` | page canvas (e.g. `var(--color-bg-canvas)` / workspace shell behind tools) |
| `--ds-bg-primary` | `--color-bg-primary` | `bg-background-primary` — cards, panels, **page headers, table thead / sticky chrome** |
| `--ds-bg-secondary` | `--color-bg-secondary` | row hover, zebra, muted strips, ghost hover — **not** static headers |
| `--ds-bg-tertiary` | `--color-bg-tertiary` | toolbars, inset |
| `--ds-text-primary` | `--color-text-primary` | `text-foreground-primary` |
| `--ds-text-secondary` | `--color-text-secondary` | `text-foreground-secondary` |
| `--ds-text-tertiary` | `--color-text-tertiary` | `text-foreground-tertiary` |
| `--ds-border-default` | `--color-border-default` | `border-border-default` |
| `--ds-border-input-default` | `--color-border-input-default` | inputs |
| `--ds-border-checkbox` | `--color-border-checkbox` | checkbox / tick-box resting border (NGX asphalt-400 light) |
| `--ds-border-input-focus` | `--color-border-input-focus` | focus ring blue |
| `--ds-brand-500` | `--color-brand-500` (with ramp) | primary CTA |

Legacy file maps `--color-*` → `var(--ds-*)` so Procore parity rules keep the same **names** while values are authored once.

## Canonical → Tailwind surface keys (section 13 in legacy-theme)

`--background`, `--foreground`, `--card`, `--muted`, `--border`, `--primary`, etc. are **Tailwind / Untitled utility keys** under `[data-theme="legacy"]`; they resolve via `var(--color-*)` → `var(--ds-*)`.

## Motion

| Token | Alias | Tailwind utility |
|-------|-------|------------------|
| `--ds-motion-duration-short` | `--motion-duration-short` | `duration-ds-short` |
| `--ds-motion-duration-medium` | `--motion-duration-medium` | `duration-ds-medium` |
| `--ds-motion-duration-long` | `--motion-duration-long` | `duration-ds-long` |
| `--ds-motion-easing-standard` | `--motion-easing-standard` | `ease-ds-standard` |
| `--ds-motion-easing-emphasized` | `--motion-easing-emphasized` | `ease-ds-emphasized` |

`app/globals.css` sets `--tw-duration` / `--tw-ease` from the medium / standard tokens for **tw-animate** defaults. You can still use arbitrary values, e.g. `duration-[var(--ds-motion-duration-short)]`.

## NGX semantic (`globals.css`)

`--foreground-primary`, `--background-primary`, etc. remain the **app-facing** names for Tailwind `@theme inline`. They should continue to track the same ramps as `--ds-*` / legacy (already bridged via legacy + globals).

## Related docs

- [token-bridge-uui-ngx.md](./token-bridge-uui-ngx.md)  
- [frontend-ngx-untitled-mandate.md](./frontend-ngx-untitled-mandate.md)  
- [migration-uui-rac-status.md](./migration-uui-rac-status.md)
