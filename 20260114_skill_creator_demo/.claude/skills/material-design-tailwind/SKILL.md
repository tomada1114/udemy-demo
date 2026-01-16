---
name: material-design-tailwind
description: |
  Create UI components following Google Material Design 3 guidelines using Tailwind CSS.
  Use when building Material Design compliant interfaces, generating color themes,
  creating MD3 components (buttons, cards, dialogs, chips), or implementing responsive layouts.
  Triggers: "Material Design", "MD3", "Material UI with Tailwind", "Google design system",
  "create Material button/card/dialog", "Material color palette", "Material theme".
---

# Material Design with Tailwind CSS

Build Material Design 3 compliant UI using Tailwind CSS utility classes.

## Quick Reference

| Task | Reference |
|------|-----------|
| Color system & themes | [references/colors.md](references/colors.md) |
| Component patterns | [references/components.md](references/components.md) |
| Layout & spacing | [references/layout.md](references/layout.md) |

## Core Principles

### Material Design 3 Foundations

1. **Dynamic Color** - Generate harmonious palettes from a single seed color
2. **Elevation** - Use shadows and surface tints to create depth
3. **Shape** - Apply consistent corner radius (small: 8px, medium: 12px, large: 16px)
4. **Motion** - Emphasize easing curves for natural transitions

### Tailwind Integration Pattern

```html
<!-- Material Button - Filled -->
<button class="
  bg-primary text-on-primary
  px-6 py-2.5
  rounded-full
  font-medium text-sm
  shadow-md hover:shadow-lg
  transition-all duration-200 ease-out
  hover:bg-primary/90
  focus:outline-none focus:ring-2 focus:ring-primary/50
  active:scale-[0.98]
">
  Button
</button>
```

## Workflow

### 1. Setup Tailwind Config

Extend `tailwind.config.js` with MD3 color tokens:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--md-sys-color-primary)',
        'on-primary': 'var(--md-sys-color-on-primary)',
        'primary-container': 'var(--md-sys-color-primary-container)',
        'on-primary-container': 'var(--md-sys-color-on-primary-container)',
        secondary: 'var(--md-sys-color-secondary)',
        'on-secondary': 'var(--md-sys-color-on-secondary)',
        surface: 'var(--md-sys-color-surface)',
        'on-surface': 'var(--md-sys-color-on-surface)',
        'surface-variant': 'var(--md-sys-color-surface-variant)',
        outline: 'var(--md-sys-color-outline)',
        error: 'var(--md-sys-color-error)',
        'on-error': 'var(--md-sys-color-on-error)',
      },
      borderRadius: {
        'md3-sm': '8px',
        'md3-md': '12px',
        'md3-lg': '16px',
        'md3-xl': '28px',
      },
      boxShadow: {
        'md3-1': '0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)',
        'md3-2': '0 1px 2px rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)',
        'md3-3': '0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.3)',
      },
    },
  },
}
```

### 2. Define CSS Variables

Add MD3 color tokens as CSS custom properties:

```css
:root {
  /* Light theme */
  --md-sys-color-primary: #6750A4;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #EADDFF;
  --md-sys-color-on-primary-container: #21005D;
  --md-sys-color-secondary: #625B71;
  --md-sys-color-on-secondary: #FFFFFF;
  --md-sys-color-surface: #FFFBFE;
  --md-sys-color-on-surface: #1C1B1F;
  --md-sys-color-surface-variant: #E7E0EC;
  --md-sys-color-outline: #79747E;
  --md-sys-color-error: #B3261E;
  --md-sys-color-on-error: #FFFFFF;
}

.dark {
  /* Dark theme */
  --md-sys-color-primary: #D0BCFF;
  --md-sys-color-on-primary: #381E72;
  --md-sys-color-primary-container: #4F378B;
  --md-sys-color-on-primary-container: #EADDFF;
  --md-sys-color-secondary: #CCC2DC;
  --md-sys-color-on-secondary: #332D41;
  --md-sys-color-surface: #1C1B1F;
  --md-sys-color-on-surface: #E6E1E5;
  --md-sys-color-surface-variant: #49454F;
  --md-sys-color-outline: #938F99;
  --md-sys-color-error: #F2B8B5;
  --md-sys-color-on-error: #601410;
}
```

### 3. Build Components

See [references/components.md](references/components.md) for complete component patterns.

## Common Patterns

### Elevation Levels

| Level | Use Case | Tailwind Classes |
|-------|----------|------------------|
| 0 | Flat surface | `shadow-none` |
| 1 | Cards, buttons | `shadow-md3-1` |
| 2 | Elevated cards | `shadow-md3-2` |
| 3 | FAB, dialogs | `shadow-md3-3` |

### State Layers

Apply opacity overlays for interactive states:

```html
<button class="relative overflow-hidden group">
  <span class="
    absolute inset-0
    bg-on-primary opacity-0
    group-hover:opacity-[0.08]
    group-focus:opacity-[0.12]
    group-active:opacity-[0.12]
    transition-opacity
  "></span>
  Button Text
</button>
```

### Typography Scale

```javascript
// tailwind.config.js extension
fontSize: {
  'display-lg': ['57px', { lineHeight: '64px', letterSpacing: '-0.25px' }],
  'display-md': ['45px', { lineHeight: '52px', letterSpacing: '0px' }],
  'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '0px' }],
  'headline-md': ['28px', { lineHeight: '36px', letterSpacing: '0px' }],
  'title-lg': ['22px', { lineHeight: '28px', letterSpacing: '0px' }],
  'title-md': ['16px', { lineHeight: '24px', letterSpacing: '0.15px' }],
  'body-lg': ['16px', { lineHeight: '24px', letterSpacing: '0.5px' }],
  'body-md': ['14px', { lineHeight: '20px', letterSpacing: '0.25px' }],
  'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.1px' }],
  'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.5px' }],
}
```
