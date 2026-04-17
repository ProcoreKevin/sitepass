# Untitled UI + React Aria migration status (NGX legacy shell)

**Last updated:** March 2026 (NGX legacy + Untitled mandate, app dark mode, tool template tabs)

## Summary

The app keeps **`@/components/ui/*` as the stable import surface**. Primitives increasingly use **`@untitledui/react`** (local [Design-System/](../Design-System/)) or **NGX semantic styling** aligned with Untitled surfaces. **Legacy theme** remains on `[data-theme="legacy"]` via [app/legacy-theme.css](../app/legacy-theme.css). **Brand colors** for Untitled utilities are reinforced by [app/uui-ngx-token-bridge.css](../app/uui-ngx-token-bridge.css) after `theme.css`.

**Progress toward “UUI + NGX” goal (weighted): ~90%** — see [uui-facade-inventory.md](./uui-facade-inventory.md). **Radix is removed** from app dependencies; `context-menu` is RAC-based. Remaining: full **RAC `Table`** collection on Open Items (optional), sidebar → deeper `app-navigation`.

**Safe integration (ADR-style):** which facade uses **Untitled vs RAC** and how **reference (Storybook) vs product shell** differ — [primitive-facade-defaults.md](./primitive-facade-defaults.md).

### Dev-only UUI studio (migration + facades + redirects)

- **`/dev/uui-studio`** (development only; production **404**): overview with migration summary stats, **token bridge** counts (from `lib/uui-studio/token-bridge-registry.ts`), and links to the **migration table** and **facade gallery**. Bookmark URLs **`/dev/uui-studio/tokens`** and **`/dev/uui-studio/components`** **redirect** to the overview and facade gallery respectively (see [`token-refinement-workflow.md`](./token-refinement-workflow.md)).
- **`/dev/uui-studio/migration`**: compact **h-10** data table (NGX list density): every `app/**/page.tsx` route, **tool-registry** context, **ToolPageTemplate** (Tpl), **Kind** chips (Dev, Dyn, Shell), **icon actions** with tooltips (open / copy route / copy file / migration doc for mixed·legacy), **QA** popover per row shows **route + file** (with copy links) and the optional **localStorage** checklist. **Open** disabled for dynamic `[param]` patterns. Company vs project shell toggle applies to **Open**.
- **`/dev/uui-migration`** redirects to **`/dev/uui-studio/migration`** (same dev-only guard).
- Data file: [`lib/generated/uui-migration-manifest.json`](../lib/generated/uui-migration-manifest.json), produced by **`pnpm uui:migration-manifest`** (run after adding or renaming routes). Generator: [`scripts/generate-uui-migration-manifest.mjs`](../scripts/generate-uui-migration-manifest.mjs).
- Token / refinement workflow: [`docs/token-refinement-workflow.md`](./token-refinement-workflow.md).
- **Per-route UUI score (0–100)** and **tier** (`integrated` / `mixed` / `legacy`) are heuristics computed from each route’s **`page.tsx` only** (facade imports, `ToolPageTemplate`, raw `<button>` / `<input>` / `<select>` / `<textarea>`, direct `@untitledui/react` or other **non-facade headless** imports the scanner flags, inline/quoted color tokens, `bg-white`, thin server shells that delegate to `@/components/*` or relative client modules). **Child components are not scanned** — low scores on delegate-only pages mean “inspect the imported module,” not necessarily outdated UI.

## Done in this repo

| Area | Change |
|------|--------|
| **Token bridge** | [docs/token-bridge-uui-ngx.md](./token-bridge-uui-ngx.md), [app/uui-ngx-token-bridge.css](../app/uui-ngx-token-bridge.css) imported from [app/globals.css](../app/globals.css) in `untitled-ui` layer. |
| **Theme** | [app/layout.tsx](../app/layout.tsx): `ThemeProvider` **`enableSystem`** for OS light/dark. [components/theme-provider.tsx](../components/theme-provider.tsx): `.dark-mode` sync for Untitled. |
| **Dependencies** | `react-aria-components`, `react-aria`, `react-stately`. **`@untitledui/react`** from [Design-System/](../Design-System/). **No Radix** — composition uses `@/lib/ui-slot` where `asChild` is required. |
| **CSS** | [app/globals.css](../app/globals.css): `@layer base, react-aria, untitled-ui, legacy-theme`; Untitled theme + typography; `tailwindcss-react-aria-components`. |
| **Button / inputs** | Untitled + RAC via [components/ui-next/](components/ui-next/) and [components/ui/button.tsx](../components/ui/button.tsx), [input.tsx](../components/ui/input.tsx), etc. |
| **Date** | [components/ui/date-picker.tsx](../components/ui/date-picker.tsx) re-exports DS `DatePicker`, `DateRangePicker`, `Calendar`. |
| **Overlays (UUI-aligned chrome)** | [dialog.tsx](../components/ui/dialog.tsx), [alert-dialog.tsx](../components/ui/alert-dialog.tsx): modal scrim `bg-black/50`, backdrop blur, `bg-card` panels. [sheet.tsx](../components/ui/sheet.tsx): slide-out layer `z-[30]`, scrim `bg-black/40`, `bg-card` panel (NGX z-30). [popover.tsx](../components/ui/popover.tsx) `z-20`. [tooltip.tsx](../components/ui/tooltip.tsx): **`bg-primary-solid` / `text-white`**, `z-20`. [hover-card.tsx](../components/ui/hover-card.tsx): **`bg-primary` / `ring-secondary_alt`** like [dropdown-menu.tsx](../components/ui/dropdown-menu.tsx). [tooltip-uui.tsx](../components/ui/tooltip-uui.tsx) → DS `UntitledTooltip` (`title` API). [context-menu.tsx](../components/ui/context-menu.tsx): RAC `Popover` + `Menu` (right-click), Untitled surfaces. |
| **Table** | [table.tsx](../components/ui/table.tsx): NGX row hover / selection `bg-asphalt-100`, semantic text/borders (HTML table API preserved). **Collection / RAC grid:** [table-collection.tsx](../components/ui/table-collection.tsx) → DS `Table` + `TableCard` (**in use:** [commitments/page.tsx](../app/commitments/page.tsx), **Open Items list** [open-items-tab.tsx](../app/(company)/open-items-tab.tsx) uses `TableCard.Root` + HTML `Table`). |
| **Tabs** | [tabs.tsx](../components/ui/tabs.tsx): strip + triggers aligned with DS **`application/tabs`** **`button-border` (sm)** (`bg-secondary_alt`, `ring-secondary`, `primary_alt` selected/hover); stable `TabsTrigger` / `TabsContent` API. |
| **Sonner** | [sonner.tsx](../components/ui/sonner.tsx): `--normal-*` → `card` / `card-foreground`. |
| **Sidebar** | [components/sidebar.tsx](../components/sidebar.tsx): **Untitled** [CloseButton](../Design-System/components/base/buttons/close-button.tsx) (`theme="dark"`). |
| **Badge** | [badge.tsx](../components/ui/badge.tsx): **Untitled** `filledColors` + CVA pill shell; `variant` API unchanged; **`asChild`** via `@/lib/ui-slot`. Extended DS patterns: [badges-untitled.tsx](../components/ui/badges-untitled.tsx) → `UntitledBadge`, `BadgeWithDot`, `BadgeWithIcon`, … |
| **Dropdown / select** | [dropdown-menu.tsx](../components/ui/dropdown-menu.tsx) and [select.tsx](../components/ui/select.tsx) use **Untitled-aligned** surfaces (`bg-primary`, `ring-secondary_alt`, `primary_hover`, `z-20`). Optional **DS** import: [uui-dropdown.tsx](../components/ui/uui-dropdown.tsx) → `UuiDropdown`. |
| **SlideOut** | [slide-out.tsx](../components/ui/slide-out.tsx): **right edge only** — [slideout-menus](../Design-System/components/application/slideout-menus/slideout-menu.tsx) `ModalOverlay` / `Modal` / `Dialog`. Workspace scrim **`bg-white/20`** at **`z-[30]`** per Interaction Model (use [sheet.tsx](../components/ui/sheet.tsx) for left/other edges or bottom/top). |
| **Toast** | Implementation: [hooks/use-toast.ts](../hooks/use-toast.ts) → **sonner**. **Import** `toast` / `useToast` from **`@/lib/toast`** ([lib/toast.ts](../lib/toast.ts)); do **not** use `@/hooks/use-toast` in app code (`@/hooks/*` aliases **Design-System** only). [toaster.tsx](../components/ui/toaster.tsx) → [sonner.tsx](../components/ui/sonner.tsx). Types: [lib/toast-types.ts](../lib/toast-types.ts); [toast.tsx](../components/ui/toast.tsx) re-exports types only. **`<Toaster />`** in [workspace-shell.tsx](../components/workspace-shell.tsx). |
| **Tooltip barrel** | [tooltip.tsx](../components/ui/tooltip.tsx) also exports **`UntitledTooltip` / `UntitledTooltipTrigger`** from Design-System; [tooltip-uui.tsx](../components/ui/tooltip-uui.tsx) re-exports from `tooltip` (single import surface). |
| **Pagination** | [pagination-uui.tsx](../components/ui/pagination-uui.tsx) re-exports DS **application/pagination** (`Pagination` headless root, `PaginationPageMinimalCenter`, `PaginationCardMinimal`, …). **In use:** [rfis/page.tsx](../app/rfis/page.tsx) list footer uses `Pagination.Root` + ellipsis. [pagination.tsx](../components/ui/pagination.tsx) remains for `<PaginationLink>` patterns where needed. |
| **Compliance** | `bash .cursor/skills/ngx-design-system/scripts/check-compliance.sh components/ui` — **passing** after sheet z-index adjustment. |

## Exceptions / follow-ups

1. **Sidebar** — Procore tool rail; integrate more of [app-navigation](../Design-System/components/application/app-navigation/) (nav list, headers) incrementally.
2. **Dropdown / select** — Optional drift toward DS [base/dropdown](../Design-System/components/base/dropdown/dropdown.tsx) / [base/select](../Design-System/components/base/select/select.tsx) while keeping stable `@/components/ui` APIs.
3. **Command palette** — restore via RAC `Dialog` + `ListBox` or cmdk when needed.
4. Run **check-compliance.sh** on touched paths after future token/layout edits.

See also [migration-inventory-uui-facades.md](./migration-inventory-uui-facades.md), [uui-facade-inventory.md](./uui-facade-inventory.md), [frontend-ngx-untitled-mandate.md](./frontend-ngx-untitled-mandate.md).
