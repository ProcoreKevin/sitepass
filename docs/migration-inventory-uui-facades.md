# Migration inventory — Untitled UI facades (`@/components/ui`)

**Supersedes** the old per-file Radix → RAC mapping table. The app **does not** ship Radix primitives; composition uses **`@untitledui/react`**, **React Aria Components**, and **`@/lib/ui-slot`** where `asChild` is needed.

## Where to look

| Topic | Document |
|-------|----------|
| Current facade coverage and tiering | [uui-facade-inventory.md](./uui-facade-inventory.md) |
| RAC / Untitled rollout status | [migration-uui-rac-status.md](./migration-uui-rac-status.md) |
| Stack and CSS layers | [untitled-tailwind-rac-stack.md](./untitled-tailwind-rac-stack.md) |
| Token contract | [token-contract.md](./token-contract.md) |
| Dev migration heuristics | `/dev/uui-studio/migration` + `pnpm uui:migration-manifest` |

## Rule of thumb

**New and refactored UI** imports from **`@/components/ui/*`** (or pattern components), uses **Untitled** surfaces and **Tailwind** theme keys, and keeps **legacy** styling under **`[data-theme="legacy"]`** via `app/legacy-theme.css`.
