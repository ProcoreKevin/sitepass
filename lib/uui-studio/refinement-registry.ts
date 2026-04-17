/**
 * Headless Untitled primitives — paths, states, and AI/human refinement prompts.
 * Used by dev studio and (optionally) Storybook via relative import.
 */

export interface RefinementRegistryEntry {
  id: string
  title: string
  category: string
  untitledSource: string
  facadePath: string
  storybookPath: string
  states: string[]
  tokenChecklist: string[]
}

export const REFINEMENT_REGISTRY: RefinementRegistryEntry[] = [
  {
    id: "button",
    title: "Button",
    category: "base/buttons",
    untitledSource: "Design-System/components/base/buttons/button.tsx",
    facadePath: "components/ui/button.tsx",
    storybookPath: "Base components/Buttons",
    states: ["rest", "hover", "focus-visible", "disabled", "loading", "pressed"],
    tokenChecklist: [
      "Primary uses brand solid + hover token chain to --ds-brand-*",
      "Disabled uses disabled:bg-disabled / fg-disabled, not raw gray hex",
      "Focus ring uses outline-brand / --ds-border-input-focus alignment",
    ],
  },
  {
    id: "input",
    title: "Input / TextField",
    category: "base/input",
    untitledSource: "Design-System/components/base/input/input.tsx",
    facadePath: "components/ui/input.tsx (via ui-next rac-input)",
    storybookPath: "Base components/Inputs",
    states: ["rest", "focus", "invalid", "disabled", "readonly"],
    tokenChecklist: [
      "Border/focus map to --ds-border-input-default / --ds-border-input-focus",
      "Background uses bg-primary / text-secondary per Untitled input group",
    ],
  },
  {
    id: "checkbox",
    title: "Checkbox",
    category: "base/checkbox",
    untitledSource: "Design-System/components/base/checkbox/checkbox.tsx",
    facadePath: "components/ui/checkbox.tsx",
    storybookPath: "Base components/Checkboxes",
    states: ["unchecked", "checked", "indeterminate", "disabled", "focus-visible"],
    tokenChecklist: [
      "Control surface uses semantic bg/border; checked state uses brand ramp",
    ],
  },
  {
    id: "select",
    title: "Select",
    category: "base/select",
    untitledSource: "Design-System/components/base/select/select.tsx",
    facadePath: "components/ui/select.tsx",
    storybookPath: "Base components/Select",
    states: ["closed", "open", "focus", "disabled", "invalid"],
    tokenChecklist: [
      "Trigger and listbox use bg-primary / ring-secondary_alt per mandate",
    ],
  },
]

const MANDATE_SNIPPET = `Mandate (summary):
- App code uses @/components/ui/* only; do not import @untitledui/react in app routes.
- Token spine: --ds-* in Design-System/styles/ngx-canonical-tokens.css; see docs/token-contract.md.
- No raw #hex / bg-white for product chrome; use NGX semantic utilities.`

export function buildRefinementPrompt(entry: RefinementRegistryEntry): string {
  return `## UUI refinement: ${entry.title} (${entry.id})

${MANDATE_SNIPPET}

### Files
- **Untitled (headless source):** \`${entry.untitledSource}\`
- **App facade:** \`${entry.facadePath}\`

### Interactive states to verify
${entry.states.map(s => `- ${s}`).join("\n")}

### Token / class checklist
${entry.tokenChecklist.map(s => `- ${s}`).join("\n")}

### Storybook
Open Design-System Storybook → **${entry.storybookPath}** (cd Design-System && pnpm storybook). Also open **State matrix → NGX refinement matrix** under the same Base components section for labeled rows (light/dark toolbar).

### Tasks
1. Compare each state in Storybook (light + dark) against legacy shell theme.
2. Adjust Untitled \`sortCx\` / classes to resolve through --ds-* via theme CSS.
3. Keep facade API stable; update facade only if public props or className contract changes.
4. Run: bash .cursor/skills/ngx-design-system/scripts/check-compliance.sh on touched paths.
`
}
