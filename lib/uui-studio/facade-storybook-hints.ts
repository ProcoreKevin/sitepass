import { REFINEMENT_REGISTRY } from "./refinement-registry"

export const FACADE_STORYBOOK_BASE = "http://localhost:6006"

/** Verified Storybook 8 story ids (`?path=/story/<id>`). */
const SLUG_TO_STORY_ID: Partial<Record<string, string>> = {
  button: "base-components-buttons-state-matrix--ngx-refinement-matrix",
  input: "base-components-inputs-state-matrix--ngx-refinement-matrix",
  checkbox: "base-components-checkboxes-state-matrix--ngx-refinement-matrix",
  select: "base-components-select-state-matrix--ngx-refinement-matrix",
  tabs: "core-ux-template-uui-tabs--button-brand-horizontal",
  textarea: "base-components-inputs-textarea--textarea",
  avatar: "base-components-avatars--default",
  tooltip: "base-components-tooltips--tooltip",
  "tooltip-uui": "base-components-tooltips--tooltip",
  slider: "base-components-sliders--default",
  "radio-group": "base-components-radio-buttons--radio-buttons",
  toggle: "base-components-toggles--toggle-base",
  "toggle-group": "base-components-toggles--toggles",
  "input-otp": "base-components-inputs-verification-code-input--verification-code-input-sm",
  progress: "base-components-progress-indicators--default",
  table: "core-ux-template-uui-tables--table-01-divider-line",
  "table-collection": "core-ux-template-uui-tables--table-01-divider-line",
  "date-picker": "core-ux-template-uui-date-pickers--calendar",
  pagination: "core-ux-template-uui-pagination--pagination-page-default",
  "pagination-uui": "core-ux-template-uui-pagination--pagination-page-default",
  chart: "core-ux-template-uui-charts-bar-charts--bar-chart",
  badge: "base-components-badges--pill-color",
  "badges-untitled": "base-components-badges--badge-modern",
  "dropdown-menu": "base-components-dropdowns--dropdown-button",
  "uui-dropdown": "base-components-dropdowns--dropdown-button",
  "context-menu": "base-components-dropdowns--dropdown-icon",
  "navigation-menu": "core-ux-template-uui-navigation--header-navigation-simple",
  menubar: "core-ux-template-uui-navigation--header-navigation-dual-tier",
  sidebar: "core-ux-template-uui-navigation--sidebar-navigation-simple",
  "file-upload": "core-ux-template-uui-file-upload--file-upload-progress-bar",
  "procore-logo": "core-ux-template-uui-navigation--header-navigation-simple",
}

/** Extra sidebar copy when there is no deep link. */
const SLUG_TO_SIDEBAR_HINT: Partial<Record<string, string>> = {
  dialog: "Overlays: compare with Base components / modals in Untitled demos (Storybook search: modal).",
  "alert-dialog": "Alert / confirm patterns: search Storybook for “alert” or “modal”.",
  "slide-out": "Slide-outs (z-30, workspace scrim): application slideout-menu / Navigation patterns.",
  sheet: "Sheets / panels: search Storybook sidebars or compare Navigation stories.",
  popover: "Base components / Dropdowns (anchored overlays).",
  "hover-card": "Base components / Tooltips or Dropdowns.",
  accordion: "Application tabs / disclosure patterns — search “accordion” or use Tabs stories as reference.",
  collapsible: "Disclosure patterns — search “collapsible” or see Tabs / Navigation.",
  card: "Layout surfaces — search “card” in Application or Base demos.",
  alert: "Feedback — search “alert” or Badges / inline messaging in Storybook.",
  sonner: "Toasts — search “toast” or Application loading patterns.",
  toast: "Toasts — Base components / legacy toast demos if present; search Storybook.",
  toaster: "Toasts — same as toast.",
  resizable: "Layout — react-resizable-panels; search Storybook for “split” or “panel”.",
  "close-button": "Base components / Buttons (close affordance).",
}

const refinementSidebarById = Object.fromEntries(REFINEMENT_REGISTRY.map(e => [e.id, e.storybookPath])) as Record<
  string,
  string
>

export type FacadeStorybookLink = {
  href: string
  sidebarHint: string
  isDeepLink: boolean
}

export function getFacadeStorybookLink(slug: string): FacadeStorybookLink {
  const storyId = SLUG_TO_STORY_ID[slug]
  const sidebarFromRegistry = refinementSidebarById[slug]
  const extraHint = SLUG_TO_SIDEBAR_HINT[slug]

  if (storyId) {
    return {
      href: `${FACADE_STORYBOOK_BASE}/?path=/story/${storyId}`,
      sidebarHint: sidebarFromRegistry ?? extraHint ?? `Storybook → ${storyId.split("--")[0]?.replace(/-/g, " ") ?? slug}`,
      isDeepLink: true,
    }
  }

  const hint =
    extraHint ??
    sidebarFromRegistry ??
    `Untitled Storybook (localhost:6006) → search “${slug.replace(/-/g, " ")}” under Base components or Core UX Template UUI.`

  return {
    href: FACADE_STORYBOOK_BASE,
    sidebarHint: hint,
    isDeepLink: false,
  }
}
