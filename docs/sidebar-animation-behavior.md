# Sidebar Animation Behavior

## Overview
This document defines the exact behavior and animation specifications for the sidebar component across the entire application.

## Initial State
- **Default State**: Sidebar is **closed** when any page loads
- **Width**: 0px (collapsed)
- **Visibility**: Hidden via overflow

## Opening Behavior

### Trigger
- User clicks the menu button in the global header
- Sidebar state changes from `false` to `true`

### Animation
- **Duration**: 300ms
- **Timing Function**: `ease-out`
- **Property**: Width transitions from 0px to 240px
- **Effect**: Smooth slide-in from left edge

## Persistent State

### Critical Rule
Once the sidebar is open, it **MUST remain open** regardless of:
- User clicking anywhere on the page
- User scrolling
- User interacting with page content
- User resizing the window
- User pressing any keyboard keys (including Escape)

### No Auto-Close Triggers
The following behaviors are **explicitly disabled**:
- ❌ Click-outside detection
- ❌ Overlay/backdrop click to close
- ❌ Escape key to close
- ❌ Window resize auto-close
- ❌ Scroll-based auto-close

## Closing Behavior

### Only Two Ways to Close

#### 1. Manual Close
- User explicitly clicks the close button or menu toggle button
- Sidebar state changes from `true` to `false`
- Animation: 300ms ease-out transition

#### 2. Page Navigation Auto-Close
When user navigates to a different page:

1. **Navigation Occurs**: User clicks a navigation link or route changes
2. **Sidebar Persists**: Sidebar remains open during navigation and on new page load
3. **Page Loads**: New page component mounts and renders completely
4. **Delay Timer Starts**: 1.3-second countdown begins after page load
5. **Auto-Close**: After 1.3 seconds (1300ms), sidebar closes with smooth animation

**Implementation Details**:
\`\`\`typescript
// When navigation link is clicked while sidebar is open
const handleNavigation = () => {
  if (sidebarOpen) {
    sessionStorage.setItem('sidebarWasOpen', 'true')
  }
  // Navigation proceeds...
}

// On new page load
useEffect(() => {
  const wasOpen = sessionStorage.getItem('sidebarWasOpen')
  
  if (wasOpen === 'true') {
    // Show sidebar immediately on new page
    setSidebarOpen(true)
    
    // Start 1.3 second timer to auto-close
    const timer = setTimeout(() => {
      setSidebarOpen(false)
      sessionStorage.removeItem('sidebarWasOpen')
    }, 1300)
    
    return () => clearTimeout(timer)
  }
}, [pathname])
\`\`\`

## Animation Specifications

### Timing
- **Duration**: 300ms (within 300-400ms range)
- **Curve**: `ease-out` for both opening and closing
- **Auto-Close Delay**: 1300ms (1.3 seconds) after page navigation
- **Properties Animated**:
  - Width (0px ↔ 240px)
  - Opacity (for logo and content)
  - Transform (for logo scaling)

### CSS Classes
\`\`\`css
transition-all duration-300 ease-out
\`\`\`

## Interaction Model

### Sidebar Open State
- Sidebar is fully interactive
- Main content remains fully interactive
- Both areas can be used simultaneously
- No modal or blocking behavior
- No focus trap

### Z-Index and Layering
- Sidebar: Fixed position on left
- Main content: Flows naturally
- No overlay layer between them

## Global Behavior

This behavior is **consistent across the entire application**:
- All pages follow the same rules
- No page-specific exceptions
- Predictable user experience throughout

## State Persistence Across Navigation

### How It Works
1. **Before Navigation**: When user clicks a navigation link while sidebar is open, a flag is set in `sessionStorage`
2. **During Navigation**: The flag persists across the page transition
3. **After Page Load**: The new page checks for the flag and immediately shows the sidebar if it was open
4. **Auto-Close Timer**: After 1.3 seconds, the sidebar automatically closes and the flag is cleared

### Why sessionStorage?
- Persists across page navigations within the same tab
- Automatically clears when tab is closed
- Doesn't persist across browser sessions
- Perfect for temporary navigation state

## Rationale

### Why No Click-Outside Close?
- Prevents accidental closures
- Allows users to reference sidebar while working
- Reduces frustration from unintended interactions

### Why 1.3-Second Delay on Navigation?
- Gives users time to see the new page load
- Provides visual continuity during transition
- Allows users to quickly return to sidebar if needed
- Feels natural and not abrupt
- Faster than 2 seconds for improved responsiveness

### Why Ease-Out Timing?
- Creates smooth, natural motion
- Feels responsive and polished
- Matches modern UI/UX best practices

## Testing Checklist

- [ ] Sidebar closed on initial page load
- [ ] Sidebar opens smoothly when menu button clicked
- [ ] Sidebar stays open when clicking page content
- [ ] Sidebar stays open when scrolling
- [ ] Sidebar stays open when resizing window
- [ ] Sidebar stays open when pressing Escape key
- [ ] Sidebar closes when menu button clicked again
- [ ] Sidebar remains visible during page navigation
- [ ] Sidebar closes 1.3 seconds after new page loads
- [ ] Animation uses ease-out timing function
- [ ] Animation duration is 300ms
- [ ] Both sidebar and main content are interactive when sidebar is open
- [ ] sessionStorage flag is properly set and cleared
