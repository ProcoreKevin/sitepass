# NGX Design System — Cursor Agent Skill

**Version:** 1.1 · March 2026  
**Owner:** Nathan Hardy, Principal Product Designer, Procore Technologies  
**Scope:** All NGX Design System work — views, forms, tables, components, compliance, **Untitled UI (UUI) shell + customer tokens**

---

## What This Skill Does

This Cursor Agent skill makes the agent a credentialed design and engineering partner for the NGX Design System. It loads five governing documents into the agent's decision-making context dynamically — only when working on NGX-related tasks — keeping non-relevant sessions clean.

When invoked, the agent:
- Enforces all design system rules without being prompted
- Selects the correct interaction pattern (1–4) for every view
- Uses only semantic design tokens — never raw colors
- Imports pattern components instead of rebuilding them
- Applies four-zone architecture to every form detail page
- Implements role-aware action bars and three-tier destructive action models
- Understands Procore's construction domain (RFIs, Submittals, Change Orders, etc.)
- Runs compliance checks against generated code before presenting output
- Keeps **Untitled UI** primitives intact while applying **customer tokens** (color, spacing, radius, size) so UI is **not broken or unstyled** in app pages or **`/dev/uui-studio/facades`** review
- Aligns **Untitled vs RAC** facade choices with **`docs/primitive-facade-defaults.md`**, **`pnpm run lint`** (restricted imports in `app/`), and **`@/lib/toast`** for app toasts

---

## Installation

### 1. Place this skill in your project

```bash
# Inside your repository root
mkdir -p .cursor/skills/ngx-design-system
cp -r path/to/ngx-design-system/* .cursor/skills/ngx-design-system/
```

Your final structure should look like:

```
.cursor/
└── skills/
    └── ngx-design-system/
        ├── SKILL.md          ← Agent instructions (loaded by Cursor)
        ├── REFERENCE.md      ← Quick-lookup tables the agent reads mid-task
        ├── EXAMPLES.md       ← Canonical code templates
        ├── README.md         ← This file
        └── scripts/
            └── check-compliance.sh  ← Token + pattern violation scanner
```

> ⚠️ Do NOT place skills in `~/.cursor/skills-cursor/` — that is Cursor's reserved built-in directory.

### 2. Make the compliance script executable

```bash
chmod +x .cursor/skills/ngx-design-system/scripts/check-compliance.sh
```

### 3. Restart Cursor

Cursor scans for new skills on startup. After restarting, the skill will be available to the agent.

### 4. Verify it loaded

Open the Cursor agent chat and type:
```
What NGX Design System skills do you have available?
```
The agent should describe its design system enforcement role.

---

## Usage — For Designers

### Ask the agent to build a new view

```
Build an Inspections anchor view with create flow.
Follow the NGX Design System interaction model.
```

The agent will:
1. Confirm the tool exists in the App Sidebar
2. Select Pattern 1 (Anchor) + Pattern 3 (Slide-Out create)
3. Use `TableActionRow`, `TableRow`, `TableCell` pattern components
4. Generate draft creation flow with `StatusBadge`
5. Apply workspace scrim correctly (workspace-only, not full-viewport)

### Ask the agent to design a form detail page

```
Design the Change Order detail page.
This is a Tier 4 Financial Form.
```

The agent will:
1. Apply the four-zone architecture (Identity Strip, Primary Content, Context Panel, Action Bar)
2. Order Zone 2 fields by decision relevance (Status → Due Date → Total Amount → ...)
3. Make Zone 1 sticky (required for Tier 4)
4. Build a role-aware Zone 4 action bar

### Ask the agent to review a design for compliance

```
Review this design for NGX Design System compliance.
[attach screenshot or share Figma link]
```

The agent will check against:
- Correct interaction pattern selection
- Token compliance (no raw colors)
- Zone architecture on forms
- Label case and typography
- Role-aware action logic

---

## Usage — For Engineers

### Ask the agent to implement a component

```
Implement the Punch List table with filter support.
```

The agent will:
1. Import `TableActionRow` and extend it — not duplicate it
2. Use `TableRow` + `TableCell` for all rows
3. Add Filter Panel as Slide-Out (Contextual View, Apply/Cancel footer)
4. Place filter chips row below `TableActionRow`, above data
5. Use only semantic tokens throughout

### Run the compliance scanner on your code

```bash
# Scan your entire src/ directory
.cursor/skills/ngx-design-system/scripts/check-compliance.sh

# Scan a specific feature
.cursor/skills/ngx-design-system/scripts/check-compliance.sh src/app/components/punch-list
```

The scanner checks for:
- Raw hex colors and `bg-white` token violations (Rule 0.1)
- Duplicated pattern components (Rule 0.4)
- Non-canonical z-index values
- Slide-Out scrim using `fixed` instead of `absolute`
- Destructive actions inside Popovers
- Grid content in right pane
- Orphaned pages not connected to sidebar

**Not covered by the scanner (agent + human QA):** Untitled **layout contracts** — e.g. `Button` **`iconLeading` / `iconTrailing`**, `SelectValue` **`data-slot="select-value"`**, **`min-w-0` / `flex-nowrap`** in toolbar rows, accordion trigger structure. Those are documented in **`SKILL.md` → “Untitled UI + customer tokens”** and **`REFERENCE.md` → “UUI shell checklist”**. After token or shell changes, spot-check **facade previews** and one dense tool page (e.g. RFIs).

Exit code `1` = violations found (blocks merge in CI). Exit code `0` = clean.

### Add the scanner to CI

```yaml
# .github/workflows/ngx-compliance.yml
name: NGX Design System Compliance
on: [pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run NGX Compliance Scanner
        run: |
          chmod +x .cursor/skills/ngx-design-system/scripts/check-compliance.sh
          .cursor/skills/ngx-design-system/scripts/check-compliance.sh src/
```

---

## Governing Documents

The skill reads these five documents. They live in your design system guidelines folder and are referenced by the agent during task execution.

| Document | Location | Governs |
|----------|----------|---------|
| `Guidelines.md` | `/guidelines/Guidelines.md` | Master rulebook · Rules 0.1–1.13 |
| `Interaction-Model-Architecture.md` | `/guidelines/Interaction-Model-Architecture.md` | Workspace layout · Z-index hierarchy |
| `Pattern-Component-Library.md` | `/guidelines/Pattern-Component-Library.md` | Base React components |
| `Form-Creation-Checklist.md` | `/guidelines/Form-Creation-Checklist.md` | Form rules · Zone architecture |
| `Filter-System-Implementation.md` | `/guidelines/Filter-System-Implementation.md` | Filter logic · Saved views |

**When documents conflict**, the agent resolves in the order above. Guidelines.md wins.

---

## Updating This Skill

When the design system evolves, update this skill to match:

1. **New rule added to Guidelines.md** → Add it to SKILL.md's relevant section and the Red Flags or Validation checklist
2. **New pattern component added to PCL** → Add import example to EXAMPLES.md
3. **New token added** → Add to REFERENCE.md Token Quick Reference
4. **New form pattern documented in FCC** → Add zone spec and example to REFERENCE.md + EXAMPLES.md
5. **Compliance scanner needs a new check** → Add to `scripts/check-compliance.sh`
6. **UUI shell / token bridge behavior changes** → Update `SKILL.md` (“Untitled UI + customer tokens”) and `REFERENCE.md` (“UUI shell checklist”)

The agent writing code for the design system is itself governed by the design system. This skill is that enforcement layer.

---

## Team Collaboration Notes

**Designers:** Use the agent for pattern validation before Figma hand-off. Ask "Is this the right pattern?" before designing a new view. Reference the Zone Architecture section when laying out form detail pages.

**Engineers:** Run the compliance scanner before opening a PR. When the agent generates code, review every className for token compliance — the agent is good but the scanner is the source of truth.

**Design + Engineering together:** Use Plan Mode (`Shift+Tab`) when starting a new tool. Ask the agent to produce the implementation plan first, confirm the pattern selection, then proceed. This catches pattern errors before any code is written.

---

## Related skills in this repo

- **[ngx-layout](../ngx-layout/)** — Z1–Z4 layout, 8px grid, typography scale, density, Gantt canvas, color/shadow budgets.

---

*Built on Cursor Agent Skills specification (nightly channel, March 2026)*  
*Skill format: SKILL.md + supplementary reference files + utility scripts*
