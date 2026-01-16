# Material Design 3 Layout System

## Table of Contents

- [Responsive Breakpoints](#responsive-breakpoints)
- [Layout Grid](#layout-grid)
- [Spacing](#spacing)
- [Adaptive Layouts](#adaptive-layouts)

## Responsive Breakpoints

MD3 defines four window size classes:

| Class | Range | Columns | Margins | Body |
|-------|-------|---------|---------|------|
| Compact | 0-599px | 4 | 16px | Stretch |
| Medium | 600-839px | 8 | 24px | Stretch |
| Expanded | 840-1199px | 12 | 24px | Stretch |
| Large | 1200-1599px | 12 | 24px | Max 1040px |
| Extra-large | 1600px+ | 12 | 24px | Max 1040px |

### Tailwind Breakpoint Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'compact': '0px',
      'medium': '600px',
      'expanded': '840px',
      'large': '1200px',
      'xl': '1600px',
    },
  },
}
```

## Layout Grid

### 12-Column Grid

```html
<div class="
  grid
  grid-cols-4 medium:grid-cols-8 expanded:grid-cols-12
  gap-4 medium:gap-6
  px-4 medium:px-6
  max-w-[1040px] large:mx-auto
">
  <!-- Full width on compact, half on medium, third on expanded -->
  <div class="col-span-4 medium:col-span-4 expanded:col-span-4">
    Content
  </div>
  <div class="col-span-4 medium:col-span-4 expanded:col-span-4">
    Content
  </div>
  <div class="col-span-4 medium:col-span-8 expanded:col-span-4">
    Content
  </div>
</div>
```

### Margin and Gutter

```html
<!-- Container with responsive margins -->
<div class="
  mx-4 medium:mx-6
  max-w-[1040px] large:mx-auto large:px-6
">
  <!-- Gutter between items -->
  <div class="grid gap-4 medium:gap-6">
    <!-- content -->
  </div>
</div>
```

## Spacing

### MD3 Spacing Scale

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        // MD3 uses 4px base unit
        'md3-1': '4px',
        'md3-2': '8px',
        'md3-3': '12px',
        'md3-4': '16px',
        'md3-5': '20px',
        'md3-6': '24px',
        'md3-7': '28px',
        'md3-8': '32px',
        'md3-9': '36px',
        'md3-10': '40px',
        'md3-12': '48px',
        'md3-14': '56px',
        'md3-16': '64px',
      },
    },
  },
}
```

### Common Spacing Patterns

| Context | Spacing | Tailwind |
|---------|---------|----------|
| Card padding | 16px | `p-4` |
| List item height | 56-72px | `h-14` / `h-[72px]` |
| Icon button touch target | 48px | `w-12 h-12` |
| Button touch target | 48px height | `min-h-12` |
| FAB | 56px | `w-14 h-14` |
| App bar height | 64px | `h-16` |
| Navigation bar height | 80px | `h-20` |
| Navigation rail width | 80px | `w-20` |
| Dialog margin | 24px | `mx-6` |

## Adaptive Layouts

### List-Detail Pattern

```html
<div class="flex h-screen">
  <!-- List pane: full width on compact, fixed on expanded -->
  <aside class="
    w-full expanded:w-80
    bg-surface
    border-r border-outline-variant
    expanded:block
    hidden expanded:flex flex-col
  ">
    <header class="h-16 px-4 flex items-center border-b border-outline-variant">
      <h1 class="text-title-lg">Items</h1>
    </header>
    <nav class="flex-1 overflow-y-auto">
      <!-- List items -->
    </nav>
  </aside>

  <!-- Detail pane: hidden on compact, grows on expanded -->
  <main class="flex-1 bg-surface-container-low">
    <!-- Detail content -->
  </main>
</div>
```

### Feed Layout

```html
<div class="
  grid
  grid-cols-1 medium:grid-cols-2 expanded:grid-cols-3
  gap-4
  p-4 medium:p-6
">
  <article class="bg-surface rounded-md3-md shadow-md3-1">
    <!-- Card content -->
  </article>
  <!-- Repeat -->
</div>
```

### Supporting Pane Layout

```html
<div class="flex h-screen">
  <!-- Main content -->
  <main class="flex-1 overflow-y-auto">
    <!-- Primary content -->
  </main>

  <!-- Supporting pane: hidden on compact/medium -->
  <aside class="
    hidden expanded:block
    w-80
    bg-surface-container
    border-l border-outline-variant
  ">
    <!-- Supporting content -->
  </aside>
</div>
```

### Canonical Layouts Summary

| Layout | Compact | Medium | Expanded |
|--------|---------|--------|----------|
| List-Detail | List only | List only | List + Detail |
| Feed | 1 column | 2 columns | 3 columns |
| Supporting Pane | Main only | Main only | Main + Pane |

### Responsive Navigation

```html
<!-- Navigation Bar on compact, Rail on expanded -->
<nav class="
  fixed
  bottom-0 inset-x-0 expanded:bottom-auto expanded:inset-y-0 expanded:left-0
  w-full expanded:w-20
  h-20 expanded:h-full
  bg-surface-container expanded:bg-surface
  flex expanded:flex-col
  justify-around expanded:justify-start expanded:pt-12 expanded:gap-3
">
  <!-- Nav items -->
</nav>

<!-- Main content with responsive padding -->
<main class="
  pb-20 expanded:pb-0 expanded:pl-20
">
  <!-- Content -->
</main>
```
