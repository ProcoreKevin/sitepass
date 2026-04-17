# Legacy Theme Skill — Installation & Usage

**Version:** 2.0 · March 2026  
**Owner:** Nathan Hardy, Principal Product Designer, Procore Technologies  
**Scope:** All UI work during the Procore Legacy-to-NGX transition period

**Changelog v2.0:**
- CSS `@layer` enforcement for Untitled UI and React Aria (new — required)
- Token namespace updated: `--color-bg-*`, `--color-text-*`, `--color-border-*`
- Card style: no border, `shadow-sm` elevation
- Secondary button: `#EEF0F1` gray ramp, no border
- `--spacing: 0.25rem` guard documented
- New reference: `references/CSS-LAYER-GUIDE.md`
- Compliance scanner: adds layer checks, token namespace migration, new component checks

---

## What This Skill Does

This Cursor Agent skill makes the agent a credentialed design and engineering
partner for building Procore UI that seamlessly blends with the existing
application during the Legacy-to-NGX transition. It loads the Legacy theme
token system, governing NGX design system documents, and compliance tooling
into the agent's decision-making context.

When invoked, the agent:
- Declares the correct CSS `@layer` order before any component work
- Enforces all Legacy theme tokens (no raw hex, no bg-white, v1.3.3 namespace)
- Prevents Untitled UI and React Aria from overriding theme tokens
- Guards `--spacing: 0.25rem` against accidental Tailwind utility inflation
- Applies the confirmed type ramp: Inter, 5 steps, 14px body
- Enforces 8px page margin and 16px card padding
- Uses 4px buttons, 8px cards, full-pill badges — no exceptions
- Selects the correct interaction pattern (1–4) for every view
- Imports pattern components instead of duplicating them
- Applies four-zone architecture to form detail pages
- Understands Procore's construction domain vocabulary
- Runs compliance checks against generated code before output

---

## Directory Structure

```
legacy-theme/
├── SKILL.md                          ← Agent instructions (auto-loaded by Cursor)
├── README.md                         ← This file
├── references/
│   ├── REFERENCE.md                  ← Quick-lookup tables (load on demand)
│   ├── EXAMPLES.md                   ← Canonical code templates (load on demand)
│   ├── CONTRAST-AUDIT.md             ← WCAG status and accessibility notes
│   └── CSS-LAYER-GUIDE.md            ← @layer diagnostics for UUI/React Aria conflicts
├── scripts/
│   └── check-compliance.sh           ← Token + layer + pattern violation scanner
└── assets/
    └── README.md                     ← Pointer to repo SoT (no duplicated CSS)
```

**Production CSS (single source):** `app/legacy-theme.css` (imported in `app/globals.css`). Canonical `--ds-*` values: `Design-System/styles/ngx-canonical-tokens.css`. Mapping table: `docs/token-contract.md`.

---

## Required Governing Documents

This skill references five governing documents that **must exist** at the
following paths relative to your project root. Copy or symlink them:

```
guidelines/
├── Guidelines.md                     ← REQUIRED · Master rulebook Rules 0.1–1.13
├── Interaction-Model-Architecture.md ← REQUIRED · Layout, z-index, shell dims
├── Pattern-Component-Library.md      ← REQUIRED · Base React components
├── Form-Creation-Checklist.md        ← REQUIRED · Form rules, Zone architecture
└── Filter-System-Implementation.md   ← REQUIRED · Filter logic, saved views
```

---

## Installation

### 1. Place this skill in your project

```bash
mkdir -p .cursor/skills/legacy-theme
cp -r path/to/legacy-theme/* .cursor/skills/legacy-theme/
```

### 2. Add the CSS layer declaration — CRITICAL

Add this as the **first line** of your CSS entry point, before all `@import`
statements. Without this, Untitled UI and React Aria component defaults will
silently override theme tokens.

```css
/* globals.css — line 1 */
@layer base, react-aria, untitled-ui, legacy-theme;

@import 'tailwindcss';
@import '@react-aria/components/dist/styles.css' layer(react-aria);
@import '@untitledui/react/styles.css'           layer(untitled-ui);
@import './legacy-theme.css';
```

This establishes cascade priority — `legacy-theme` wins over both UUI and
React Aria regardless of selector specificity. Without it:
- UUI button radius defaults to 8px (legacy needs 4px)
- React Aria focus rings override `--shadow-focus`
- `--border-radius-*` overrides silently fail

### 3. Apply the theme attribute

```html
<html data-theme="legacy">
```

### 4. Make the compliance script executable

```bash
chmod +x .cursor/skills/legacy-theme/scripts/check-compliance.sh
```

### 5. Restart Cursor

Cursor scans for skills on startup. After restarting, the skill is available.

### 6. Verify it loaded

```
What Legacy Theme skills do you have available?
```

The agent should describe token mandate, CSS layer enforcement, type ramp,
and compliance scope.

---

## Running the Compliance Scanner

The scanner now accepts an optional second argument for the CSS entry file path:

```bash
# Scan repo root (default) and styles/globals.css for layer declaration
.cursor/skills/legacy-theme/scripts/check-compliance.sh

# Scan a specific feature, custom CSS entry path
.cursor/skills/legacy-theme/scripts/check-compliance.sh \
  app/components/rfis \
  styles/globals.css
```

**Check sections:**
- `[0]` CSS Layer Enforcement — `@layer` declaration, UUI/React Aria layer assignment, `--spacing` guard
- `[1]` Token violations — hex codes, raw Tailwind primitives, contrast failures
- `[2]` Stale token names — old v1.0 namespace (`--color-background-*`, `--color-foreground-*`)
- `[3]` Typography — font size/weight outside ramp, 16px body on legacy pages
- `[4]` Spacing — card padding violations
- `[5]` Border radius — non-canonical values on buttons/inputs
- `[6]` Component style — cards with border (v1.3.2+), secondary buttons with border (v1.3.3+)
- `[7]` Pattern components — custom row state outside shared/patterns, Popover misuse
- `[8]` Architecture — z-index, Slide-Out fixed positioning, right-pane tables

Add to CI to block non-compliant PRs:

```yaml
# .github/workflows/legacy-theme-compliance.yml
name: Legacy Theme Compliance
on: [pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Legacy Theme Compliance Scanner
        run: |
          chmod +x .cursor/skills/legacy-theme/scripts/check-compliance.sh
          .cursor/skills/legacy-theme/scripts/check-compliance.sh . styles/globals.css
```

---

## Token Namespace Migration (v1.0 → v1.3.3)

If your project used the v1.0 token names, run a find-replace:

| Old (v1.0) | New (v1.3.3) |
|---|---|
| `--color-background-primary` | `--color-bg-primary` |
| `--color-background-secondary` | `--color-bg-secondary` |
| `--color-background-tertiary` | `--color-bg-tertiary` |
| `--color-foreground-primary` | `--color-text-primary` |
| `--color-foreground-secondary` | `--color-text-secondary` |
| `--color-foreground-inverse` | `--color-text-inverse` |
| `--color-foreground-link` | `--color-text-link` |
| `--color-nav-background` | `--color-bg-nav` |
| `--color-background-row-active` | `--color-bg-row-active` |
| `--color-border-active-row` | `--color-border-row-active` |

The compliance scanner (Section [2]) will catch any remaining old names.

---

## Relationship to the NGX Design System Skill

| Skill | Theme | WCAG | When to use |
|-------|-------|------|-------------|
| `ngx-design-system` | NGX Light / Dark / HC | AA / AAA | New tools built on NGX |
| `legacy-theme` | Legacy | Non-compliant | Tools during transition period |

Both skills share the same five governing documents and pattern component
library. The CSS layer enforcement approach is the same across both skills.

---

## Updating This Skill

| Change | Update |
|--------|--------|
| New design token confirmed | Update `Design-System/styles/ngx-canonical-tokens.css` + `app/legacy-theme.css` bridge + `docs/token-contract.md` |
| New layer conflict found | Add to `references/CSS-LAYER-GUIDE.md` conflict patterns |
| New rule in Guidelines.md | Add to SKILL.md Red Flags or Validation checklist |
| New pattern component | Add import example to `references/EXAMPLES.md` |
| New construction entity | Add to SKILL.md Construction Domain section |
| New compliance check | Add to `scripts/check-compliance.sh` |
| NGX Light finalized | Add migration instructions to `references/CONTRAST-AUDIT.md` |

---

*Built on the Agent Skills open standard (agentskills.io) · Cursor v2.4+*  
*Compatible with: Cursor, Claude Code, OpenAI Codex, Gemini CLI*
