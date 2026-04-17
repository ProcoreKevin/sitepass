# Primitive facade defaults — Untitled vs RAC (safe integration)

**Purpose:** One place to resolve the hybrid stack: **NGX legacy tokens** + **Untitled surfaces** + **React Aria** behavior — without inventing a third pattern per screen.

**Related:** [token-contract.md](./token-contract.md) (`--ds-*` spine), [token-bridge-uui-ngx.md](./token-bridge-uui-ngx.md), [frontend-ngx-untitled-mandate.md](./frontend-ngx-untitled-mandate.md), [migration-uui-rac-status.md](./migration-uui-rac-status.md).

---

## 1. Two modes (reference vs product)

| Mode | Where | What you see |
|------|--------|----------------|
| **OOTB Untitled** | Design-System **Storybook**, optional DS demos | Stock `@untitledui/react` + `theme.css` — use as **visual/a11y reference**. |
| **Product shell** | This app, `data-theme="legacy"` | **Canonical `--ds-*`** → semantic utilities → **`@/components/ui/*` facades** styled for Procore parity; **`legacy-theme` layer** applies targeted deltas (often via `data-slot`). |

**Rule:** Do not recreate Untitled pixel-for-pixel inside `legacy-theme.css`. Map **roles** (border, fill, focus) to **tokens**; keep overrides **narrow** (selector + slot).

---

## 2. Default primitive set (`components/ui`)

**Imports in app routes:** always `@/components/ui/*` (see mandate). **Do not** import `@untitledui/react` in app except where ESLint allows (new facades in `components/ui`).

Legend:

- **UUI** — `@untitledui/react` (Design-System package path).
- **RAC** — `react-aria-components` / `react-aria` in the facade file.
- **UI-next** — `components/ui-next/*` (Untitled + RAC split for Button/Input/Textarea).
- **DOM** — Plain elements + Tailwind only (no RAC/Untitled headless in-file).
- **Other** — Third-party (Recharts, Sonner, `input-otp`, `react-resizable-panels`).

| Facade module | Headless source | Notes |
|---------------|-----------------|--------|
| `accordion` | RAC | Disclosure primitives |
| `alert-dialog` | RAC | Modal + dialog |
| `avatar` | UUI | |
| `badge` | DOM + CVA | Semantic variants; DS patterns in `badges-untitled` |
| `badges-untitled` | UUI | |
| `breadcrumb` | DOM | |
| `button` | UI-next | Default export = **Untitled** `UuiAppButton`; `buttonVariants` from RAC button |
| `card` | DOM | |
| `checkbox` | UUI | RAC label via Untitled Checkbox |
| `close-button` | UUI | |
| `collapsible` | RAC | |
| `context-menu` | RAC | Menu + Popover |
| `date-picker` | UUI | Re-exports application date picker |
| `dialog` | RAC | |
| `slide-out` | RAC | |
| `dropdown-menu` | RAC | |
| `hover-card` | RAC | Tooltip-based |
| `input` | UI-next | Default **`RacInput`**; **`UuiAppInput`** for Untitled TextField API |
| `label` | UUI | |
| `popover` | RAC | |
| `progress` | UUI | |
| `radio-group` | UUI | |
| `select` | RAC | |
| `sheet` | RAC | |
| `slider` | UUI | |
| `switch` | UUI | Toggle base |
| `tabs` | RAC | |
| `textarea` | UI-next | Default **`RacTextarea`**; **`UuiAppTextarea`** optional |
| `toggle` | RAC | ToggleButton |
| `toggle-group` | RAC | |
| `tooltip` | RAC + UUI re-exports | Compound API + `UntitledTooltip` from DS `base/tooltip` |
| Chart / OTP / resizable / sonner | Other | See module |

**Presentation-only (no RAC/Untitled headless):** `navigation-menu`, `menubar` (see migration doc).

**Tables:** `table` = DOM; `table-collection` → DS application table.

---

## 3. Rules for new work

1. **Add or change UI** through **`@/components/ui/<name>.tsx`** (or extend existing facade), not new parallel component folders for the same primitive.
2. **Tokens:** semantic utilities (`bg-background-primary`, `border-border-default`, …) and **`--ds-*`** extensions — not raw hex in features ([token-contract.md](./token-contract.md)).
3. **Choosing UUI vs RAC for a new primitive:** Prefer **existing parity** in this table; if both exist in DS, default to **UUI** for form controls that must match Untitled docs **unless** you need RAC-only APIs already used elsewhere — then document in a PR and add a row here.
4. **Legacy overrides:** target **`[data-theme="legacy"]`** + **`data-slot`** / role when possible; avoid global utility nukes unless necessary.

---

## 4. Bridge + layers (reminder)

- **Layer order:** `base` → `react-aria` → `untitled-ui` → **`legacy-theme` last** ([globals.css](../app/globals.css)).
- **Brand alignment:** [uui-ngx-token-bridge.css](../app/uui-ngx-token-bridge.css) keeps Untitled **brand utilities** on NGX ramps without reskinning every component.

---

## 5. Changelog

| Date | Change |
|------|--------|
| 2026-03 | Initial matrix + integration rules (safe plan). |
