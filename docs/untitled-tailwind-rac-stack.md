# Untitled UI, Tailwind, and React Aria — stack reference

This repository’s **design system surface** is **Untitled UI** (`@untitledui/react`), styled with **Tailwind CSS v4**, with **React Aria Components** for headless behavior where the facades need it. **Legacy** and **NGX** visuals are applied through **Tailwind theme keys** and scoped CSS (`app/legacy-theme.css`, `Design-System/styles/*`), not through a third-party component CLI.

## Layer order

See [app/globals.css](../app/globals.css): `base` → `react-aria` → `untitled-ui` → `legacy-theme`.

Canonical tokens: [token-contract.md](./token-contract.md), [token-bridge-uui-ngx.md](./token-bridge-uui-ngx.md).

## Primary documentation links

| Topic | Resource |
|-------|----------|
| **Untitled UI (React)** | [untitledui.com/react/docs](https://www.untitledui.com/react/docs/introduction) |
| **React Aria Components** | [react-spectrum.adobe.com/react-aria](https://react-spectrum.adobe.com/react-aria/index.html) |
| **Tailwind CSS v4** | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| **Migration / facade status** | [migration-uui-rac-status.md](./migration-uui-rac-status.md) |
| **Facade inventory** | [uui-facade-inventory.md](./uui-facade-inventory.md) |
| **NGX + Untitled mandate** | [frontend-ngx-untitled-mandate.md](./frontend-ngx-untitled-mandate.md) |

## Implementation notes

- Import UI through **`@/components/ui/*` facades** (or pattern components), not ad hoc primitives.
- Prefer **design-system language** (Slide-Out, Popover, Modal) in specs; implementation file names may still use familiar aliases (`sheet`, `dialog`) where the facade maps them to Untitled + RAC.

**Last reviewed:** March 2026.
