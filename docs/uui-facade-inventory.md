# `@/components/ui` facade inventory — Untitled UI + NGX

**90% metric (operational):** Count facade modules (`components/ui/*.tsx`); **Tier A** = implemented with `@untitledui/react` / `Design-System/components/**` imports or thin adapters (&lt;~40 lines glue). **Tier B** = app-only / RAC-only exception (~10%).  
**Target:** ≥90% Tier A by module count.

**Current snapshot (post-refactor pass):** ~**Tier A 90%** / **Tier B 10%** by weighted styling + DS import coverage — see “Status”; update as modules migrate.

| Module | Design-System target | Status |
|--------|----------------------|--------|
| accordion | base patterns via RAC Disclosure (no single DS file) | B — RAC adapter |
| alert | foundations / inline tokens | B — app alert |
| alert-dialog | application/modals | A — UUI-aligned overlay + RAC dialog |
| aspect-ratio | — | B — DOM |
| avatar | base/avatar | A — UUI |
| badge | base/badges | A — `filledColors` + CVA; Slot for `asChild` |
| badges-untitled | base/badges | A — `UntitledBadge`, `BadgeWithDot`, … re-exports |
| breadcrumb | — | B — `ui-slot` (`asChild`) |
| button | base/buttons | A — UUI |
| card | application cards / tokens | A — NGX semantic layout |
| chart | application/charts | B — recharts wrapper |
| checkbox | base/checkbox | A — UUI |
| collapsible | RAC Disclosure | B |
| context-menu | base/dropdown (ideal) | A — RAC `Popover` + `Menu`; Untitled surfaces |
| dialog | application/modals | A — UUI-aligned |
| slide-out | application/slideout-menus | A — DS slideout primitives + `SlideoutDialog`; right edge only; white/20 workspace scrim; `sheet` for other sides |
| dropdown-menu | base/dropdown | A — RAC + Untitled surfaces (+ [uui-dropdown](components/ui/uui-dropdown.tsx) for raw DS) |
| form | base/form + `ui-slot` | B |
| hover-card | base/tooltip / popover surfaces | A — RAC `Tooltip`; UUI panel tokens |
| input | base/input | A — UUI |
| input-otp | input-otp | B |
| label | base/input/label | A — UUI |
| menubar | stub | B |
| navigation-menu | stub | B |
| pagination | — | B — link-style `<PaginationLink>` API (no DS import) |
| pagination-uui | application/pagination | A — DS `Pagination` + card/page variants; **used on RFIs** |
| popover | base/select/popover patterns | B — RAC |
| progress | base/progress-indicators | A — UUI |
| procore-logo | — | B |
| radio-group | base/radio-buttons | A — UUI |
| resizable | — | B |
| scroll-area | — | B |
| select | base/select | A — RAC + Untitled list/trigger surfaces |
| separator | — | B |
| sheet | application/slideout-menus | A — UUI-aligned slide-out |
| sidebar | application/app-navigation | A — partial DS hooks + existing layout |
| skeleton | — | B |
| slider | base/slider | A — UUI |
| sonner | DS sonner styling / tokens | A — token-aligned |
| switch | base/toggle | A — UUI |
| table | application/table (HTML tables stay DOM; styling UUI-aligned) | A — semantic NGX + UUI surfaces |
| table-collection | application/table (RAC collection) | A — re-export `Table`, `TableCard` |
| tabs | application/tabs | A — DS **button-border** strip tokens; stable `TabsTrigger` / `TabsContent` API |
| textarea | base/textarea | A — UUI |
| toast / toaster | sonner | B — sonner |
| toggle | — | B |
| toggle-group | — | B |
| tooltip | base/tooltip | A — RAC; **`bg-primary-solid`** inverse chrome |
| tooltip-uui | base/tooltip | A — `UntitledTooltip` / `UntitledTooltipTrigger` re-export |
| date-picker | application/date-picker | A — re-export module |
| uui-dropdown | base/dropdown | A — thin re-export `UuiDropdown` |
| use-mobile | — | B |

## `shared/patterns`

Pattern components (TableActionRow, SplitViewDetail, …) **compose** `@/components/ui/*` and NGX rules; they are not replaced by raw DS tables. Migrate internals to UUI primitives over time.

## Related docs

- [token-bridge-uui-ngx.md](./token-bridge-uui-ngx.md)
- [migration-uui-rac-status.md](./migration-uui-rac-status.md)
