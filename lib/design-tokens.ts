/**
 * NGEX Design Token System
 *
 * This file provides TypeScript constants and utilities for accessing
 * the comprehensive design token system defined in globals.css.
 *
 * Based on the Enterprise Application Design System specification.
 *
 * ## Text Scaling System
 *
 * The design system includes a dynamic text scaling feature controlled by
 * the density preference (compact vs comfortable). All text sizes automatically
 * scale by 10% when comfortable mode is selected.
 *
 * ### How It Works
 * - Compact mode: --text-scale = 1 (100%)
 * - Comfortable mode: --text-scale = 1.1 (110%)
 * - All font sizes use calc() with the scale factor
 * - Tailwind's text-* classes automatically inherit the scaled values
 *
 * ### Usage
 * Simply use standard Tailwind text classes in your components:
 * - text-xs, text-sm, text-base, text-lg, etc.
 * - No special handling needed - scaling is automatic
 *
 * ### Best Practices
 * 1. Always use Tailwind text classes (text-sm, text-base, etc.)
 * 2. Avoid hardcoded font-size values in inline styles
 * 3. Test components in both compact and comfortable modes
 * 4. Ensure adequate spacing for larger text in comfortable mode
 */

export const typography = {
  display: {
    extraLarge: "text-6xl font-bold tracking-tight",
    large: "text-5xl font-bold tracking-tight",
  },
  heading: {
    h1: "text-4xl font-bold tracking-tight",
    h2: "text-3xl font-bold tracking-tight",
    h3: "text-2xl font-bold tracking-tight",
    h4: "text-xl font-bold tracking-tight",
  },
  label: {
    large: "text-lg font-medium",
    base: "text-base font-medium",
    small: "text-sm font-medium",
    tiny: "text-xs font-medium",
  },
  body: {
    large: "text-lg font-normal",
    base: "text-base font-normal",
    small: "text-sm font-normal",
    tiny: "text-xs font-normal",
  },
} as const

export const spacing = {
  xs: "0.5rem", // 4px - Extra small
  sm: "1rem", // 8px - Small (base unit)
  md: "1.5rem", // 12px - Medium
  lg: "2rem", // 16px - Large
  xl: "3rem", // 24px - Extra large
  "2xl": "4rem", // 32px
  "3xl": "6rem", // 48px
  "4xl": "8rem", // 64px
  // Component-specific tokens
  componentPadding: {
    xs: "0.5rem", // 4px
    sm: "1rem", // 8px
    md: "1.5rem", // 12px - Standard for rich popovers
    lg: "2rem", // 16px
    xl: "3rem", // 24px
  },
  componentGap: {
    xs: "0.5rem", // 4px
    sm: "1rem", // 8px
    md: "1.5rem", // 12px
    lg: "2rem", // 16px
    xl: "3rem", // 24px
  },
} as const

export const elevation = {
  // Standard elevation scale
  sm: "shadow-sm", // Subtle elevation
  base: "shadow-base", // Standard card elevation
  md: "shadow-md", // Medium elevation
  lg: "shadow-lg", // High elevation (dropdowns)
  xl: "shadow-xl", // Very high (modals)
  "2xl": "shadow-2xl", // Maximum elevation
  none: "shadow-none", // No shadow
  // Semantic elevation for components
  card: "shadow-card", // Cards at rest
  cardHover: "shadow-card-hover", // Cards on hover
  dropdown: "shadow-dropdown", // Dropdown menus
  modal: "shadow-modal", // Modal dialogs
  overlay: "shadow-overlay", // Top-level overlays
} as const

export const dropShadow = {
  sm: "drop-shadow-sm",
  base: "drop-shadow-base",
  md: "drop-shadow-md",
  lg: "drop-shadow-lg",
  xl: "drop-shadow-xl",
  "2xl": "drop-shadow-2xl",
} as const

export const borderRadius = {
  none: "rounded-none",
  sm: "rounded-sm", // 2px
  base: "rounded", // 4px
  md: "rounded-md", // 6px
  lg: "rounded-lg", // 8px
  xl: "rounded-xl", // 12px
  "2xl": "rounded-2xl", // 16px
  "3xl": "rounded-3xl", // 24px
  full: "rounded-full",
} as const

export const components = {
  button: {
    small: "px-2 py-1 gap-1 text-xs rounded-sm",
    default: "px-3 py-2 gap-2 text-sm rounded",
    large: "px-4 py-3 gap-2 text-base rounded",
    variants: {
      primary:
        "bg-asphalt-900 dark:bg-white text-white dark:text-asphalt-900 hover:bg-asphalt-800 dark:hover:bg-asphalt-200",
      secondary:
        "bg-transparent border border-asphalt-200 dark:border-asphalt-700 text-asphalt-900 dark:text-white hover:border-asphalt-900 dark:hover:border-white",
      tertiary: "bg-transparent text-asphalt-900 dark:text-white hover:bg-asphalt-100 dark:hover:bg-asphalt-800",
      copilot:
        "bg-transparent border border-asphalt-400 text-asphalt-800 hover:bg-asphalt-50 dark:hover:bg-asphalt-800/40",
    },
  },
  input: {
    default:
      "px-3 py-2 text-sm rounded border border-asphalt-400 dark:border-asphalt-600 hover:border-asphalt-900 dark:hover:border-white focus:border-asphalt-900 dark:focus:border-white focus:ring-1 focus:ring-asphalt-900 dark:focus:ring-white disabled:bg-asphalt-100 disabled:border-asphalt-300",
  },
  card: {
    compact: "p-3 gap-2 rounded-lg border border-asphalt-200 dark:border-asphalt-700",
    default: "p-4 gap-3 rounded-lg border border-asphalt-200 dark:border-asphalt-700",
    large: "p-6 gap-4 rounded-lg border border-asphalt-200 dark:border-asphalt-700",
  },
  badge: {
    small: "px-1.5 py-0.5 gap-1 text-xs rounded-sm",
    default: "px-2 py-1 gap-1 text-xs rounded-sm",
    large: "px-3 py-1.5 gap-1.5 text-sm rounded-sm",
    variants: {
      primary: "bg-badge-primary-bg text-badge-primary-text border-0",
      secondary: "bg-badge-secondary-bg text-badge-secondary-text border-0",
      information: "bg-badge-information-bg text-badge-information-text border-0",
      success: "bg-badge-success-bg text-badge-success-text border-0",
      critical: "bg-badge-critical-bg text-badge-critical-text border-0",
      warning: "bg-badge-warning-bg text-badge-warning-text border-0",
      // Legacy variants kept for backward compatibility
      attention:
        "bg-attention-900 dark:bg-attention-25 text-attention-700 dark:text-attention-25 border border-white/0",
      danger: "bg-danger-800 dark:bg-danger-25 text-danger-500 dark:text-danger-25 border border-white/0",
      informative:
        "bg-informative-800 dark:bg-informative-25 text-informative-600 dark:text-informative-25 border border-white/0",
      neutral: "bg-asphalt-700 dark:bg-asphalt-25 text-asphalt-700 dark:text-asphalt-25 border border-white/0",
    },
  },
  table: {
    cell: "px-3 py-2 text-sm",
    header: "px-3 py-2 text-sm font-medium",
    compact: {
      cell: "px-3 py-1.5 text-sm",
    },
  },
  modal: {
    container: "p-6 space-y-6 rounded-xl max-w-2xl",
  },
  slideOut: {
    container: "rounded-l-2xl w-[600px]",
    header: "px-6 py-4 border-b border-asphalt-200 dark:border-asphalt-700",
    content: "px-6 py-4 space-y-4",
    footer: "px-6 py-4 gap-3 border-t border-asphalt-200 dark:border-asphalt-700",
  },
  popover: {
    container: "p-3 gap-2 rounded-lg shadow-lg border border-asphalt-200 dark:border-asphalt-700",
  },
  tooltip: {
    container: "px-2 py-1 text-xs rounded bg-asphalt-900 dark:bg-asphalt-700 text-white",
  },
  workspacePane: {
    header: "px-6 py-4 gap-3 border-b border-asphalt-200 dark:border-asphalt-700",
    content: "p-6 space-y-4",
  },
  navigation: {
    item: "px-3 py-2 gap-2 text-sm rounded",
    active: "border-l-2 border-asphalt-900 bg-asphalt-25 dark:bg-asphalt-25",
    inactive: "border-l-2 border-asphalt-100 dark:border-asphalt-900",
  },
  breadcrumbs: {
    container: "gap-2 text-sm",
    item: "text-asphalt-600 dark:text-asphalt-300 hover:text-asphalt-900 dark:hover:text-white",
    current: "text-asphalt-900 dark:text-white font-medium",
  },
  banner: {
    success: "bg-success-400 dark:bg-success-25 border-l-4 border-success-800 p-4",
    attention: "bg-attention-700 dark:bg-attention-25 border-l-4 border-attention-700 dark:border-attention-50 p-4",
    danger: "bg-danger-500 dark:bg-danger-25 border-l-4 border-danger-500 dark:border-danger-50 p-4",
    informative:
      "bg-informative-600 dark:bg-informative-25 border-l-4 border-informative-600 dark:border-informative-50 p-4",
  },
} as const

/**
 * Z-Index Layer Hierarchy
 * 
 * Canonical z-index values for the NGX Design System.
 * See: /guidelines/Interaction-Model-Architecture.md
 * 
 * z-0   - Application Shell (Sidebar, Header, Workspace, Assist)
 * z-10  - Tooltip (read-only info, tethered to element)
 * z-20  - Popover (quick actions, tethered to trigger, NO scrim)
 * z-30  - Slide-Out (focused sub-tasks, workspace-only scrim bg-white/30)
 * z-50  - Modal (blocking dialogs, full-app scrim bg-black/50)
 * z-80  - Unified Viewer (full-screen immersive, covers everything)
 */
export const Z_INDEX = {
  SHELL: 0,
  TOOLTIP: 10,
  POPOVER: 20,
  SLIDE_OUT: 30,
  MODAL: 50,
  UNIFIED_VIEWER: 80,
} as const

/**
 * Workspace Layout Constants
 * 
 * Fixed dimensions for the workspace architecture.
 * See: /guidelines/Interaction-Model-Architecture.md
 */
export const WORKSPACE = {
  // Fixed workspace width (content area)
  WIDTH: 1440,
  // Sidebar dimensions
  SIDEBAR_WIDTH: 240,
  // Assist panel dimensions
  ASSIST_WIDTH: 400,
  // Global header height
  HEADER_HEIGHT: 56,
  // Split pane ratios
  SPLIT_RATIO_33: 475, // 33% of 1440px
  SPLIT_RATIO_67: 965, // 67% of 1440px
  // Minimum pane width for resizable splits
  MIN_PANE_WIDTH: 320,
  MAX_PANE_WIDTH: 1120, // 1440 - 320
} as const

/**
 * Pane Content Types
 * 
 * Type definitions for workspace pane content placement rules.
 * - Grid content: LEFT pane ONLY
 * - Detail content: LEFT or RIGHT pane
 * - Context content: RIGHT pane ONLY
 */
export type PaneContentType = 'grid' | 'detail' | 'context'

export type WorkspaceLayoutState = 
  | { type: 'single-pane', content: PaneContentType }
  | { type: 'split-panes', left: PaneContentType, right: PaneContentType }

/**
 * Validate pane layout configuration
 * Returns true if the layout is valid per architectural rules
 */
export function validatePaneLayout(
  left: PaneContentType | null,
  right: PaneContentType | null
): boolean {
  // Grid can only be in left pane
  if (right === 'grid') return false
  
  // Context can only be in right pane
  if (left === 'context') return false
  
  // If both panes exist and left is grid, right must be detail
  if (left === 'grid' && right && right !== 'detail') return false
  
  return true
}

export const interactionPatterns = {
  workspace: {
    splitView: {
      defaultRatio: "33% / 67%",
      contextRatio: "67% / 33%",
    },
    maxPanes: 2, // Maximum 2 panes in workspace at any time
  },
  layering: {
    hierarchy: [
      "z-0: Shell (Sidebar, Header, Workspace, Assist)",
      "z-10: Tooltip (read-only info, tethered)",
      "z-20: Popover (quick actions, NO scrim)",
      "z-30: Slide-Out (sub-tasks, workspace scrim bg-white/30)",
      "z-50: Modal (blocking, full-app scrim bg-black/50)",
      "z-80: Unified Viewer (full-screen immersive)",
    ],
    scrims: {
      slideOut: "bg-white/30", // Covers workspace only
      modal: "bg-black/50", // Covers entire app
    },
  },
} as const

export const keyboardShortcuts = {
  navigation: {
    back: "Cmd/Ctrl + [",
    forward: "Cmd/Ctrl + ]",
    commandPalette: "Cmd/Ctrl + K",
  },
  layers: {
    close: "Esc",
  },
} as const
