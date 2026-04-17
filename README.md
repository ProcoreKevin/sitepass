# Core UX Template (NGX / UUI shell)

Next.js reference application for the **Procore NGX** interaction model: **legacy theme** tokens, **Untitled UI** primitives (vendored), **React Aria**, unified global header, workspace layout, assist panel, and slide-out patterns.

Package name: `core-ux-template-uui` (`package.json`).

## Stack

| Layer | Details |
|--------|---------|
| Framework | **Next.js 14** (App Router), **React 18** |
| Styling | **Tailwind CSS v4** (`@tailwindcss/postcss`), `app/globals.css` + **`app/legacy-theme.css`** under `[data-theme="legacy"]` |
| UI kit | **`@untitledui/react`** → [`Design-System/`](./Design-System/) (`file:./Design-System`) |
| Accessibility / behavior | **React Aria** (`react-aria`, `react-aria-components`, `react-stately`) |
| Charts / 3D (demos) | Recharts, Three.js (`@react-three/fiber`) |
| AI (Assist) | `ai`, `@ai-sdk/react` (see [`docs/assist-setup.md`](./docs/assist-setup.md)) |

Root layout (`app/layout.tsx`) sets `data-theme="legacy"` and `data-design-system="ngx-legacy-uui"` on `<html>` and wraps the app in **`WorkspaceLayout`**.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npm run lint:compliance`, and UUI manifest helpers (`uui:*` in `package.json`).

## Documentation

| Resource | Purpose |
|----------|---------|
| [`docs/README.md`](./docs/README.md) | Index of local docs + pointers to `/guidelines` |
| [`guidelines/Guidelines.md`](./guidelines/Guidelines.md) | Master interaction / compliance rules |
| [`guidelines/Interaction-Model-Architecture.md`](./guidelines/Interaction-Model-Architecture.md) | Shell, z-index, assist, panes |
| [`docs/design-system.md`](./docs/design-system.md) | Token and component notes |
| [`docs/token-contract.md`](./docs/token-contract.md) | Legacy / canonical token contract |
| [`.cursor/skills/`](./.cursor/skills/) | Cursor agent skills (NGX layout, legacy theme, design system) |

## Design system highlights

- Semantic tokens via CSS variables; legacy shell maps **`--ds-*`** → **`--color-*`** / Tailwind bridge in `legacy-theme.css`.
- Workspace chrome: global header (`UnifiedHeader`), optional **Assist** (fixed under header + workspace margin), slide-out / split-view patterns.
- Table and primary surfaces follow NGX legacy semantics (`bg-background-primary`, etc.); see token docs above.

## Analytics dependency

`@vercel/analytics` is listed in `package.json` and **`<Analytics />`** is mounted in `app/layout.tsx`. It is only useful when the app runs behind **Vercel Web Analytics** for that project. This repository does **not** include `vercel.json` or a guaranteed deployment target—treat hosting and analytics as **your** environment configuration.
