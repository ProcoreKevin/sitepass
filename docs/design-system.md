# NGEX Design System Documentation

> **Canonical Source**: For complete design system rules, see:
> - **[Guidelines.md](/guidelines/Guidelines.md)** - Rule 0.1 (Token Mandate), Rule 0.4 (Pattern Components)
> - **[Interaction-Model-Architecture.md](/guidelines/Interaction-Model-Architecture.md)** - Z-index hierarchy, workspace layout
> - **[Pattern-Component-Library.md](/guidelines/Pattern-Component-Library.md)** - Base components to import and extend
> - **Legacy visual chrome**: [`app/legacy-theme.css`](/app/legacy-theme.css) (`[data-theme="legacy"]`) + [`docs/token-contract.md`](/docs/token-contract.md)

## Table Components

### Table Headers

**Background color standard**

Table headers (`TableHead`), sticky header cells, and page-level toolbars use the **primary surface** token — `bg-background-primary` — so chrome aligns with cards/panels. **Do not** use `bg-background-secondary` for static thead or page headers; reserve secondary for hovers, zebra rows, and muted strips (see `app/legacy-theme.css` §02 and native `thead` rules).

**Design token (legacy bridge)**

- `--color-bg-primary` / `--ds-bg-primary` → white card surface (light), elevated panel (dark legacy overrides)

**Implementation**

The base `TableHead` in `components/ui/table.tsx` defaults to `bg-background-primary`.

```tsx
<TableHead>
  Column Name
</TableHead>
```

**Rationale**

Separation from body rows is handled with **typography** (`text-foreground-secondary`, font-weight) and **borders** (`border-border-default`), not a different header fill.

**Sticky headers**

Keep an explicit background on sticky cells so scroll layering stays correct:

```tsx
<TableHead className="sticky left-0 z-20 bg-background-primary">
  Column Name
</TableHead>
```

**Overrides**

Override only when a specific tool spec requires it:

```tsx
<TableHead className="bg-background-tertiary">
  Special Column
</TableHead>
```

---

## Text Links

**Color Standard**

All text links use consistent colors defined in the design system:

**Design Tokens:**
- Default: `--link` → `#111111`
- Hover: `--link-hover` → `#ff5200`

**Implementation:**

```tsx
<a className="text-link underline hover:text-link-hover transition-colors">
  Link Text
</a>
```

**Styling Rules:**
- All text links have underline by default
- Hover state changes color to `#ff5200`
- Smooth color transition on hover

---

## See also

- **Badges, forms, spacing, token mandate**: [`guidelines/Guidelines.md`](../guidelines/Guidelines.md) (Rule 0.1+)
- **Canonical `--ds-*` values + Tailwind mapping**: [`docs/token-contract.md`](./token-contract.md)
- **Tailwind surface bridge (Untitled utilities + legacy aliases)**: [`app/legacy-theme.css`](../app/legacy-theme.css) (§13+)
