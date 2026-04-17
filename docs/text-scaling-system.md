# NGEX Text Scaling System

## Overview

The NGEX design system includes a dynamic text scaling feature that allows users to adjust the size of all text throughout the application based on their density preference. This system provides two modes:

- **Compact Mode**: Default text sizing (100% scale)
- **Comfortable Mode**: Enlarged text sizing (110% scale)

## Architecture

### CSS Custom Properties

The system uses CSS custom properties (CSS variables) to implement scalable text sizing:

\`\`\`css
:root {
  /* Base scale factor - default is 1 (compact mode) */
  --text-scale: 1;
  
  /* Scaled font sizes using calc() */
  --font-size-xs: calc(0.75rem * var(--text-scale));   /* 12px → 13.2px */
  --font-size-sm: calc(0.875rem * var(--text-scale));  /* 14px → 15.4px */
  --font-size-base: calc(1rem * var(--text-scale));    /* 16px → 17.6px */
  --font-size-lg: calc(1.125rem * var(--text-scale));  /* 18px → 19.8px */
  /* ... and so on for all text sizes */
}

/* Comfortable mode increases scale by 10% */
[data-density="comfortable"] {
  --text-scale: 1.1;
}
\`\`\`

### Data Attribute Control

The system uses a `data-density` attribute on the `<html>` element to control which scale factor is active:

\`\`\`html
<!-- Compact mode (default) -->
<html data-density="compact">

<!-- Comfortable mode -->
<html data-density="comfortable">
\`\`\`

### State Management

The density preference is managed through:

1. **localStorage**: Persists user preference across sessions
   - Key: `ngx_ui_density`
   - Values: `"compact"` | `"comfortable"`

2. **ThemeProvider**: Initializes and listens for density changes
   - Reads from localStorage on mount
   - Applies `data-density` attribute to `document.documentElement`
   - Listens for `density-changed` custom events

3. **ThemeSettingsPopover**: User interface for changing density
   - Provides toggle buttons for compact/comfortable
   - Saves preference to localStorage
   - Dispatches `density-changed` event

## Usage in Components

### Automatic Scaling

All components automatically benefit from text scaling when using Tailwind's text utility classes:

\`\`\`tsx
// ✅ Good - Automatically scales
<p className="text-sm">This text scales automatically</p>
<h1 className="text-4xl font-bold">This heading scales too</h1>

// ❌ Bad - Won't scale
<p style={{ fontSize: '14px' }}>This won't scale</p>
\`\`\`

### Using Typography Tokens

The design system provides semantic typography tokens in `lib/design-tokens.ts`:

\`\`\`tsx
import { typography } from '@/lib/design-tokens'

// Use semantic tokens for consistent styling
<h1 className={typography.heading.h1}>Page Title</h1>
<p className={typography.body.base}>Body text</p>
<span className={typography.label.small}>Label</span>
\`\`\`

### Custom Event Handling

If your component needs to respond to density changes (e.g., for layout adjustments):

\`\`\`tsx
useEffect(() => {
  const handleDensityChange = (event: CustomEvent) => {
    const { density } = event.detail
    console.log('Density changed to:', density)
    // Perform any necessary layout adjustments
  }

  window.addEventListener('density-changed', handleDensityChange as EventListener)
  
  return () => {
    window.removeEventListener('density-changed', handleDensityChange as EventListener)
  }
}, [])
\`\`\`

## Best Practices

### 1. Always Use Tailwind Text Classes

\`\`\`tsx
// ✅ Good
<div className="text-sm text-foreground-primary">Content</div>

// ❌ Bad
<div style={{ fontSize: '14px', color: '#171717' }}>Content</div>
\`\`\`

### 2. Avoid Hardcoded Font Sizes

\`\`\`tsx
// ✅ Good
<Button className="text-base">Click me</Button>

// ❌ Bad
<Button style={{ fontSize: '16px' }}>Click me</Button>
\`\`\`

### 3. Test in Both Modes

Always test your components in both compact and comfortable modes to ensure:
- Text doesn't overflow containers
- Spacing remains appropriate
- Layout doesn't break with larger text

### 4. Consider Line Height

When text scales up, ensure adequate line-height for readability:

\`\`\`tsx
// ✅ Good - Includes line-height utility
<p className="text-base leading-relaxed">
  Long paragraph text that needs good line spacing...
</p>
\`\`\`

### 5. Use Semantic Spacing

Pair text scaling with appropriate spacing tokens:

\`\`\`tsx
// ✅ Good - Spacing scales with content
<div className="space-y-4">
  <h2 className="text-2xl">Heading</h2>
  <p className="text-base">Paragraph</p>
</div>
\`\`\`

## Implementation Details

### Scale Factor Calculation

The 10% increase in comfortable mode was chosen because:
- It's noticeable but not jarring
- Maintains visual hierarchy between text sizes
- Doesn't require significant layout adjustments
- Aligns with WCAG accessibility guidelines for text resizing

### Browser Compatibility

The system uses modern CSS features:
- CSS Custom Properties (CSS Variables)
- `calc()` function
- Data attributes

These are supported in all modern browsers (Chrome, Firefox, Safari, Edge).

### Performance

The text scaling system has minimal performance impact:
- CSS variables are computed once per render
- No JavaScript calculations for text sizing
- No re-renders triggered by density changes
- Smooth transitions handled by CSS

## Accessibility

The text scaling system supports accessibility by:
- Allowing users to increase text size without zooming
- Maintaining relative sizing relationships
- Working alongside browser zoom
- Supporting users with visual impairments

## Migration Guide

### For Existing Components

Most existing components will automatically work with text scaling if they use Tailwind classes. However, check for:

1. **Inline styles with font-size**
   \`\`\`tsx
   // Before
   <div style={{ fontSize: '14px' }}>Text</div>
   
   // After
   <div className="text-sm">Text</div>
   \`\`\`

2. **Fixed-height containers**
   \`\`\`tsx
   // Before
   <div className="h-10">Content</div>
   
   // After
   <div className="min-h-10">Content</div>
   \`\`\`

3. **Truncated text**
   \`\`\`tsx
   // Ensure truncation still works with larger text
   <div className="truncate text-sm max-w-[200px]">Long text...</div>
   \`\`\`

### For New Components

When building new components:
1. Use Tailwind text classes exclusively
2. Test in both density modes during development
3. Use semantic typography tokens from design-tokens.ts
4. Ensure containers can accommodate larger text
5. Document any density-specific behavior

## Troubleshooting

### Text Overflowing Containers

If text overflows in comfortable mode:
\`\`\`tsx
// Add overflow handling
<div className="overflow-hidden text-ellipsis">
  Long text content...
</div>
\`\`\`

### Layout Breaking

If layout breaks with larger text:
\`\`\`tsx
// Use min-height instead of fixed height
<div className="min-h-[100px]">Content</div>

// Or use flex with appropriate wrapping
<div className="flex flex-wrap gap-2">Items</div>
\`\`\`

### Text Not Scaling

If text isn't scaling, check:
1. Are you using Tailwind text classes? (not inline styles)
2. Is the data-density attribute set on <html>?
3. Are CSS variables properly defined in globals.css?
4. Is ThemeProvider wrapping your app?

## Future Enhancements

Potential future improvements to the text scaling system:
- Additional density levels (extra-compact, extra-comfortable)
- Per-component density overrides
- Animated transitions between density modes
- User-defined custom scale factors
- Integration with browser accessibility settings
