# Navigation architecture

## Surfaces

| Surface | Data source | Linked to routes? |
|---------|---------------|-------------------|
| **Jumbo menu** (apps grid / company vs project) | [`lib/tool-registry.ts`](../lib/tool-registry.ts) `COMPANY_TOOLS`, `PROJECT_TOOLS`, menu sections | Yes — paths are curated with real `app/**/page.tsx` routes. |
| **Sidebar** (tool rail) | Hardcoded `NAVIGATION_CATEGORIES` in [`components/sidebar.tsx`](../components/sidebar.tsx) | Was partially out of sync; **updated** to match existing app routes (see below). |
| **Global header favorites** | Hardcoded `allToolItems` in [`components/global-header.tsx`](../components/global-header.tsx) | **Updated** slug fixes (`/reporting`, `/timesheets`, `/documents`, `/quality-safety`, etc.). |
| **Context menu facade** | [`components/ui/context-menu.tsx`](../components/ui/context-menu.tsx) (RAC + Untitled) | **Not used** in app features today — no right-click navigation to audit. |

## Architectural issue (technical debt)

There are **three** navigation catalogs (tool-registry, sidebar, header favorites). Only **tool-registry** is structured for reuse. Long-term, sidebar entries should either:

- Import paths from `PROJECT_TOOLS` / `COMPANY_TOOLS` by id, or  
- Be generated from a single shared config consumed by all three.

That avoids future 404s when routes are renamed.

## Sidebar: proxy destinations

Some labels intentionally route to the **closest existing** tool until a dedicated page exists:

| Label | Route | Note |
|-------|-------|------|
| Locations | `/project-home` | No `/locations` page. |
| Conversations | `/correspondence` | No `/conversations` page. |
| Tasks | `/action-plans` | No `/tasks` page. |
| RFQ | `/bidding` | No `/rfq` page. |
| Head Contract Variations | `/change-orders` | No dedicated page. |
| Subcontract Variations | `/commitments` | No dedicated page. |
| Pay | `/invoicing` | No `/pay` page. |
| Estimating | `/budget` | No `/estimating` page. |
| Workforce / Resource Tracking | `/resource-planning` | Shared destination. |
| Day Worksheets | `/timesheets` | No `/day-worksheets` page. |

Exact renames (same feature, wrong slug): Site Instructions → `/instructions`, Reports → `/reporting`, ERP Integrations → `/erp`, App Marketplace → `/apps`, Prequalification → `/prequalifications`.

## Global header favorites: proxy destinations

| Favorite label | Route | Note |
|----------------|-------|------|
| Checklist | `/punch-list` | No `/checklist` page. |
| Head Count | `/crews` | No `/head-count` page. |
| Instructors | `/directory` | No `/instructors` page. |
| Texting | `/emails` | No `/texting` page. |

## Related

- [frontend-ngx-untitled-mandate.md](./frontend-ngx-untitled-mandate.md)  
- [migration-uui-rac-status.md](./migration-uui-rac-status.md) (context menu = RAC facade; not wired in nav yet)
