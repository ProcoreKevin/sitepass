# NGX Interaction Model — documentation index

This directory contains supporting documentation for the **NGX interaction model** and design-system implementation in this Next.js app.

## Canonical Guidelines (Source of Truth)

The following documents in `/guidelines/` are the authoritative source for all design system rules:

- **[Guidelines.md](/guidelines/Guidelines.md)** - Master rulebook with pre-implementation checklists (Rules 0.1-1.13)
- **[Interaction-Model-Architecture.md](/guidelines/Interaction-Model-Architecture.md)** - Workspace layout, z-index hierarchy, pane rules
- **[Pattern-Component-Library.md](/guidelines/Pattern-Component-Library.md)** - Base React components all tools must import and extend
- **[Filter-System-Implementation.md](/guidelines/Filter-System-Implementation.md)** - Filter logic, UI patterns, and saved views
- **[Form-Creation-Checklist.md](/guidelines/Form-Creation-Checklist.md)** - Form field rules, validation, zone architecture

**Read Guidelines, Interaction-Model-Architecture, and Pattern-Component-Library together before major UI work; add Filter and Form checklists when relevant.**

## Local Documentation

- **[Component Checklist](./component-checklist.md)** - Quick pre-prompt checklist for Interaction Model compliance
- **[Interaction Model Audit](./interaction-model-audit.md)** - Audit report of current implementation
- **[Design System](./design-system.md)** - Component-specific token documentation
- **[Untitled UI, Tailwind, React Aria](./untitled-tailwind-rac-stack.md)** - Canonical stack links and layer order for this repo
- **[NGX + Untitled mandate](./frontend-ngx-untitled-mandate.md)** - `@/components/ui/*` import surface; compliance expectations
- **[Token contract](./token-contract.md)** - `--ds-*` spine, Tailwind bridge, semantic token rules
- **[Primitive facade defaults](./primitive-facade-defaults.md)** - Untitled vs RAC per facade; reference vs product shell
- **[UUI facade inventory](./uui-facade-inventory.md)** - Per-facade coverage and review tiers
- **[UUI / RAC migration status](./migration-uui-rac-status.md)** - Rollout status, dev studio URLs, score heuristics
- **[Migration inventory (facades)](./migration-inventory-uui-facades.md)** - Pointers to current UUI/RAC facade docs (replaces legacy mapping table)
- **[Token bridge (UUI ↔ NGX)](./token-bridge-uui-ngx.md)** - Bridge CSS and token alignment notes
- **[Token refinement workflow](./token-refinement-workflow.md)** - Studio redirects and refinement process
- **[Navigation architecture](./navigation-architecture.md)** - Menus, route alignment, shell navigation (see also mandate)

### Additional references

- **[Assist setup](./assist-setup.md)** - AI / Assist wiring (linked from repo root README)
- **[Assist voice & tone](./assist-voice-and-tone.md)** - Copy guidelines for Assist
- **[Text scaling](./text-scaling-system.md)** - Compact vs comfortable text scaling
- **[Sidebar animation](./sidebar-animation-behavior.md)** - Sidebar open/close and persistence rules

## Quick Reference

### Architecture Rules (See: /guidelines/Interaction-Model-Architecture.md)
- Maximum 2 panes (Left/Right) - Rule 0.6
- Grids only in LEFT pane
- Details in either pane
- Context only in RIGHT pane
- Workspace fixed at 1440px

### Z-Index Layer Hierarchy (Canonical)
- `z-0`: Shell (Sidebar, Header, Workspace, Assist)
- `z-10`: Tooltip (read-only info, tethered)
- `z-20`: Popover (quick actions, NO scrim)
- `z-30`: Slide-Out (sub-tasks, workspace scrim `bg-white/30`)
- `z-50`: Modal (blocking, full-app scrim `bg-black/50`)
- `z-80`: Unified Viewer (full-screen immersive)

### Design System
- Colors: CSS variables / semantic tokens (avoid raw hex in new UI) — Rule 0.1
- Icons: prefer `lucide-react`; `react-icons` used in parts of the shell (e.g. header)
- Components: `@/components/ui` (UUI / RAC facades)
- Spacing: Tailwind classes (no arbitrary values)
- Pattern Components: Import from `/shared/patterns/` - Rule 0.4

### Filter System Principles (See: /guidelines/Filter-System-Implementation.md)
- **Principle 1**: AND across fields (narrows results)
- **Principle 2**: OR within fields (broadens results)
- **Principle 3**: Permissions are silent pre-filters

### TypeScript Integration
- Z-index constants: `import { Z_INDEX } from '@/lib/design-tokens'`
- Workspace constants: `import { WORKSPACE } from '@/lib/design-tokens'`
- Filter types: `import { FilterValue, FilterOperator } from '@/lib/sop-definitions'`
- Form roles: `import { FORM_ROLE_PERMISSIONS } from '@/lib/sop-definitions'`

---

For detailed checklists and validation scripts, see [Component Checklist](./component-checklist.md).
