# Material Design 3 Components

## Table of Contents

- [Buttons](#buttons)
- [Cards](#cards)
- [Chips](#chips)
- [Dialogs](#dialogs)
- [Text Fields](#text-fields)
- [Navigation](#navigation)
- [FAB](#fab)

## Buttons

### Filled Button (Primary Action)

```html
<button class="
  bg-primary text-on-primary
  px-6 py-2.5
  rounded-full
  font-medium text-sm tracking-wide
  shadow-md3-1 hover:shadow-md3-2
  transition-all duration-200
  hover:brightness-110
  focus:outline-none focus:ring-2 focus:ring-primary/50
  active:scale-[0.98]
  disabled:bg-on-surface/12 disabled:text-on-surface/38 disabled:shadow-none
">
  Filled Button
</button>
```

### Outlined Button (Secondary Action)

```html
<button class="
  bg-transparent text-primary
  px-6 py-2.5
  rounded-full
  font-medium text-sm tracking-wide
  border border-outline
  transition-all duration-200
  hover:bg-primary/8
  focus:outline-none focus:ring-2 focus:ring-primary/50
  active:scale-[0.98]
  disabled:text-on-surface/38 disabled:border-on-surface/12
">
  Outlined Button
</button>
```

### Text Button (Low Emphasis)

```html
<button class="
  bg-transparent text-primary
  px-3 py-2.5
  rounded-full
  font-medium text-sm tracking-wide
  transition-all duration-200
  hover:bg-primary/8
  focus:outline-none focus:ring-2 focus:ring-primary/50
  active:scale-[0.98]
  disabled:text-on-surface/38
">
  Text Button
</button>
```

### Tonal Button (Medium Emphasis)

```html
<button class="
  bg-secondary-container text-on-secondary-container
  px-6 py-2.5
  rounded-full
  font-medium text-sm tracking-wide
  transition-all duration-200
  hover:shadow-md3-1
  focus:outline-none focus:ring-2 focus:ring-secondary/50
  active:scale-[0.98]
">
  Tonal Button
</button>
```

### Icon Button

```html
<button class="
  p-2 rounded-full
  text-on-surface-variant
  transition-all duration-200
  hover:bg-on-surface/8
  focus:outline-none focus:ring-2 focus:ring-primary/50
">
  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <!-- icon path -->
  </svg>
</button>
```

## Cards

### Elevated Card

```html
<div class="
  bg-surface
  rounded-md3-md
  shadow-md3-1
  overflow-hidden
  transition-shadow duration-200
  hover:shadow-md3-2
">
  <img src="..." alt="" class="w-full h-48 object-cover" />
  <div class="p-4">
    <h3 class="text-title-lg text-on-surface">Card Title</h3>
    <p class="mt-2 text-body-md text-on-surface-variant">
      Supporting text for the card content.
    </p>
    <div class="mt-4 flex gap-2">
      <button class="px-4 py-2 text-primary text-label-lg">Action</button>
    </div>
  </div>
</div>
```

### Filled Card

```html
<div class="
  bg-surface-variant
  rounded-md3-md
  overflow-hidden
">
  <div class="p-4">
    <h3 class="text-title-lg text-on-surface">Filled Card</h3>
    <p class="mt-2 text-body-md text-on-surface-variant">
      Content on surface-variant background.
    </p>
  </div>
</div>
```

### Outlined Card

```html
<div class="
  bg-surface
  rounded-md3-md
  border border-outline-variant
  overflow-hidden
">
  <div class="p-4">
    <h3 class="text-title-lg text-on-surface">Outlined Card</h3>
    <p class="mt-2 text-body-md text-on-surface-variant">
      Card with border instead of shadow.
    </p>
  </div>
</div>
```

## Chips

### Assist Chip

```html
<button class="
  inline-flex items-center gap-2
  px-4 py-1.5
  rounded-lg
  border border-outline
  text-label-lg text-on-surface
  transition-all duration-200
  hover:bg-on-surface/8
">
  <svg class="w-4 h-4" fill="currentColor"><!-- icon --></svg>
  Assist Chip
</button>
```

### Filter Chip

```html
<!-- Unselected -->
<button class="
  inline-flex items-center gap-2
  px-4 py-1.5
  rounded-lg
  border border-outline
  text-label-lg text-on-surface-variant
  transition-all duration-200
  hover:bg-on-surface/8
">
  Filter
</button>

<!-- Selected -->
<button class="
  inline-flex items-center gap-2
  px-4 py-1.5
  rounded-lg
  bg-secondary-container
  text-label-lg text-on-secondary-container
  transition-all duration-200
">
  <svg class="w-4 h-4" fill="currentColor"><!-- checkmark --></svg>
  Filter
</button>
```

### Input Chip

```html
<span class="
  inline-flex items-center gap-1
  pl-3 pr-1 py-1
  rounded-lg
  border border-outline
  text-label-lg text-on-surface-variant
">
  Input Value
  <button class="p-1 rounded-full hover:bg-on-surface/8">
    <svg class="w-4 h-4"><!-- close icon --></svg>
  </button>
</span>
```

## Dialogs

### Basic Dialog

```html
<div class="fixed inset-0 z-50 flex items-center justify-center">
  <!-- Scrim -->
  <div class="absolute inset-0 bg-black/50"></div>

  <!-- Dialog -->
  <div class="
    relative
    bg-surface
    rounded-md3-xl
    shadow-md3-3
    w-full max-w-md mx-4
    p-6
  ">
    <h2 class="text-headline-sm text-on-surface">Dialog Title</h2>
    <p class="mt-4 text-body-md text-on-surface-variant">
      Dialog supporting text explaining the content.
    </p>
    <div class="mt-6 flex justify-end gap-2">
      <button class="px-4 py-2 text-primary text-label-lg">Cancel</button>
      <button class="px-4 py-2 text-primary text-label-lg">Confirm</button>
    </div>
  </div>
</div>
```

### Full-screen Dialog (Mobile)

```html
<div class="fixed inset-0 z-50 bg-surface">
  <header class="flex items-center gap-4 px-4 h-14 border-b border-outline-variant">
    <button class="p-2 -ml-2">
      <svg class="w-6 h-6"><!-- close icon --></svg>
    </button>
    <h1 class="flex-1 text-title-lg text-on-surface">Title</h1>
    <button class="px-4 py-2 text-primary text-label-lg">Save</button>
  </header>
  <main class="p-4">
    <!-- Content -->
  </main>
</div>
```

## Text Fields

### Filled Text Field

```html
<div class="relative">
  <input
    type="text"
    placeholder=" "
    class="
      peer
      w-full
      px-4 pt-5 pb-2
      bg-surface-variant
      rounded-t-md3-sm
      border-b-2 border-on-surface-variant
      text-body-lg text-on-surface
      focus:outline-none focus:border-primary
      placeholder-shown:pt-4
    "
  />
  <label class="
    absolute left-4 top-4
    text-body-lg text-on-surface-variant
    transition-all duration-200
    peer-focus:top-1 peer-focus:text-label-sm peer-focus:text-primary
    peer-[:not(:placeholder-shown)]:top-1
    peer-[:not(:placeholder-shown)]:text-label-sm
  ">
    Label
  </label>
</div>
```

### Outlined Text Field

```html
<div class="relative">
  <input
    type="text"
    placeholder=" "
    class="
      peer
      w-full
      px-4 py-4
      bg-transparent
      border border-outline rounded-md3-sm
      text-body-lg text-on-surface
      focus:outline-none focus:border-2 focus:border-primary
    "
  />
  <label class="
    absolute left-3 -top-2.5 px-1
    bg-surface
    text-label-sm text-on-surface-variant
    peer-focus:text-primary
  ">
    Label
  </label>
</div>
```

## Navigation

### Navigation Bar (Bottom)

```html
<nav class="
  fixed bottom-0 inset-x-0
  bg-surface-container
  flex justify-around
  h-20 pt-3
  shadow-md3-2
">
  <!-- Active Item -->
  <a href="#" class="flex flex-col items-center gap-1 w-16">
    <span class="p-1 rounded-full bg-secondary-container">
      <svg class="w-6 h-6 text-on-secondary-container"><!-- icon --></svg>
    </span>
    <span class="text-label-md text-on-surface">Home</span>
  </a>

  <!-- Inactive Item -->
  <a href="#" class="flex flex-col items-center gap-1 w-16">
    <span class="p-1">
      <svg class="w-6 h-6 text-on-surface-variant"><!-- icon --></svg>
    </span>
    <span class="text-label-md text-on-surface-variant">Search</span>
  </a>
</nav>
```

### Navigation Rail (Side)

```html
<nav class="
  fixed left-0 inset-y-0
  w-20
  bg-surface
  flex flex-col items-center
  pt-12 gap-3
">
  <!-- Active Item -->
  <a href="#" class="flex flex-col items-center gap-1 p-3">
    <span class="px-4 py-1 rounded-full bg-secondary-container">
      <svg class="w-6 h-6 text-on-secondary-container"><!-- icon --></svg>
    </span>
    <span class="text-label-md text-on-surface">Home</span>
  </a>

  <!-- Inactive Item -->
  <a href="#" class="flex flex-col items-center gap-1 p-3">
    <span class="px-4 py-1">
      <svg class="w-6 h-6 text-on-surface-variant"><!-- icon --></svg>
    </span>
    <span class="text-label-md text-on-surface-variant">Search</span>
  </a>
</nav>
```

## FAB

### Standard FAB

```html
<button class="
  fixed right-4 bottom-20
  p-4
  bg-primary-container
  rounded-md3-lg
  shadow-md3-3
  transition-all duration-200
  hover:shadow-[0_6px_10px_4px_rgba(0,0,0,0.15),0_2px_3px_rgba(0,0,0,0.3)]
">
  <svg class="w-6 h-6 text-on-primary-container"><!-- add icon --></svg>
</button>
```

### Extended FAB

```html
<button class="
  fixed right-4 bottom-20
  inline-flex items-center gap-3
  px-4 py-4
  bg-primary-container
  rounded-md3-lg
  shadow-md3-3
  transition-all duration-200
  hover:shadow-[0_6px_10px_4px_rgba(0,0,0,0.15),0_2px_3px_rgba(0,0,0,0.3)]
">
  <svg class="w-6 h-6 text-on-primary-container"><!-- icon --></svg>
  <span class="text-label-lg text-on-primary-container">Create</span>
</button>
```

### Small FAB

```html
<button class="
  p-2
  bg-primary-container
  rounded-md3-md
  shadow-md3-3
">
  <svg class="w-6 h-6 text-on-primary-container"><!-- icon --></svg>
</button>
```
