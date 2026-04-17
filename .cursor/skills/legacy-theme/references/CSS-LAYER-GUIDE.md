# CSS Layer Guide — Legacy Theme / Untitled UI / React Aria

**Load this file when:** debugging visual overrides, mismatched radius or
spacing, focus ring conflicts, or any case where UUI or React Aria component
styles are beating the legacy theme tokens.

---

## The Core Problem

Untitled UI v4 and React Aria both ship stylesheets with component defaults.
CSS `@layer` cascade rules determine who wins when two rules target the same
property. Without explicit layer declaration:

- UUI's `@theme` block is **unlayered** → highest cascade priority by default
- React Aria's `[data-focus-visible]` rules are **unlayered** → beat `@layer base`
- Legacy theme tokens live in `@layer base` → lose to both by default

**Result:** UUI buttons render at 8px radius (not 4px), React Aria focus rings
override `--shadow-focus`, `--border-radius-*` overrides silently fail.

---

## Required Layer Declaration

```css
/* globals.css — MUST be the first line, before all @import statements */
@layer base, react-aria, untitled-ui, legacy-theme;
```

Layer cascade priority (highest wins): `legacy-theme` > `untitled-ui` >
`react-aria` > `base`.

---

## Required Import Order

```css
@layer base, react-aria, untitled-ui, legacy-theme;

@import 'tailwindcss';
@import '@react-aria/components/dist/styles.css' layer(react-aria);
@import '@untitledui/react/styles.css'           layer(untitled-ui);
@import './legacy-theme.css';
```

### Bundler alternative (if `@import ... layer()` is unsupported)

```css
@layer base, react-aria, untitled-ui, legacy-theme;

@import 'tailwindcss';

@layer react-aria {
  @import '@react-aria/components/dist/styles.css';
}

@layer untitled-ui {
  @import '@untitledui/react/styles.css';
}

@import './legacy-theme.css';
```

### Next.js layout.tsx import order

When importing via TypeScript, the assignment to a layer must still happen
in CSS. Ensure your CSS entry point (`globals.css`) uses the layer declaration,
and import it before the UUI stylesheet.

```ts
// app/layout.tsx
import '@/styles/globals.css'   // must contain @layer declaration + UUI @import
```

---

## Known Conflict Patterns

### 1. Button radius rendering at 8px instead of 4px

**Cause:** UUI defines `--border-radius-md: 8px` in its `@theme` block.
`@theme` declarations are unlayered and beat `@layer base` by default.

**Fix:** Confirm `@layer` declaration exists. Confirm UUI import is inside
`layer(untitled-ui)`. The legacy theme sets `--border-radius-md: 4px` in
`@layer base` AND again in `@layer base` Section 13 (UUI bridge) — both must
be present for belt-and-suspenders override.

**Diagnosis:**
```css
/* In DevTools — inspect [data-slot="button"] (app <Button>) */
/* You should see --border-radius-md: 4px from legacy-theme */
/* If you see 8px, the layer order is wrong */
```

### 2. Card radius rendering at 12px instead of 8px

**Cause:** Same as above. UUI defaults `--border-radius-lg: 12px`. Legacy
theme sets 8px. Layer order fixes this.

### 3. Focus rings not matching #2066DF

**Cause:** React Aria ships `[data-focus-visible]` rules that set
`outline-color` and `box-shadow` on focused components.

**Fix:** Confirm React Aria import is in `layer(react-aria)`. The legacy
theme's `*:focus-visible { box-shadow: var(--shadow-focus) }` in
`@layer base` should then win.

**Check:** Inspect `--shadow-focus` in DevTools. Should be:
`0 0 0 3px rgb(32 102 223 / 0.25)`. If the value is correct but the visual
ring is wrong, React Aria's `[data-focus-visible]` selector may have higher
specificity — add `[data-focus-visible]` to the legacy theme's focus rule.

### 4. Component spacing doubled (padding, gaps, heights too large)

**Cause:** `--spacing` has been overridden to a `px` value somewhere in the
project CSS (e.g. `--spacing: 8px`). Tailwind v4 uses `--spacing` as a
multiplier: `p-4 = calc(var(--spacing) × 4)`. At `8px`, `p-4 = 32px` (double).

**Fix:** Find and remove all `--spacing: [number]px` declarations. The correct
value is `--spacing: 0.25rem` and the legacy theme sets this explicitly.

```bash
# Find all --spacing px overrides in the project
grep -rn "--spacing: [0-9]" src/ --include="*.css" | grep -v "0\.25rem"
```

### 5. React Aria disabled state not matching theme

**Cause:** React Aria uses `[data-disabled]` attribute for disabled state,
not the CSS `:disabled` pseudo-class. Custom `:disabled` styles in the legacy
theme apply to native HTML elements but not React Aria components.

**Fix:** Use React Aria's `isDisabled` prop. React Aria adds `[data-disabled]`
to the rendered element, which the browser also maps to the accessible
disabled state. The legacy theme's component CSS uses raw `:disabled` for
HTML elements and `[data-disabled]` for React Aria components.

```tsx
// Correct — React Aria manages [data-disabled]
<Button isDisabled>Action</Button>

// Also correct for native elements
<button disabled>Action</button>
```

### 6. UUI sidebar tokens overriding nav background

**Cause:** UUI's sidebar component reads `--sidebar` and `--sidebar-foreground`
from its `@theme` block. These default to near-white values. The legacy theme
bridge sets `--sidebar: var(--color-bg-nav)` (black).

**Fix:** Confirm the layer order. If the nav is still rendering light, check
that the legacy theme's `--sidebar` override appears in `@layer base` and
that UUI is assigned to `layer(untitled-ui)`.

---

## Diagnostic Checklist

When a component is not rendering with legacy theme values:

```
□ Open DevTools → Computed tab on the affected element
□ Find the property (e.g. border-radius, background-color)
□ Check which rule is winning in the Styles cascade
□ If the winning rule is from @untitledui or @theme → layer order is wrong
□ If the winning rule is from [data-*] React Aria selector → add [data-*]
   variant to the relevant legacy theme rule
□ If --spacing is computed as 8px → find and remove --spacing: 8px override
□ Run: grep -rn "@layer" styles/ to verify declaration exists
□ Run: grep -rn "layer(" styles/ to verify UUI and React Aria assignments
```

---

## Layer Order Quick Reference

```
Priority  Layer          Source
────────  ─────────────  ────────────────────────────────
  HIGH    legacy-theme   app/legacy-theme.css (@layer legacy-theme, wins due to order)
          untitled-ui    @untitledui/react/styles.css
          react-aria     @react-aria/components/dist/styles.css
  LOW     base           Tailwind CSS reset and utilities
```

All four must be declared explicitly. Omitting a layer from the declaration
drops it to unlayered status (highest cascade priority), which defeats the
entire ordering scheme.
