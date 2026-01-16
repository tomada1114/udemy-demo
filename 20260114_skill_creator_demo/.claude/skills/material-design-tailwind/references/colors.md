# Material Design 3 Color System

## Table of Contents

- [Color Roles](#color-roles)
- [Tonal Palettes](#tonal-palettes)
- [Custom Theme Generation](#custom-theme-generation)
- [Dark Theme](#dark-theme)

## Color Roles

MD3 uses semantic color roles instead of raw colors:

| Role | Purpose | Light | Dark |
|------|---------|-------|------|
| `primary` | Key actions, active states | Tone 40 | Tone 80 |
| `on-primary` | Text/icons on primary | Tone 100 | Tone 20 |
| `primary-container` | Standout containers | Tone 90 | Tone 30 |
| `on-primary-container` | Text on primary container | Tone 10 | Tone 90 |
| `secondary` | Less prominent actions | Tone 40 | Tone 80 |
| `on-secondary` | Text/icons on secondary | Tone 100 | Tone 20 |
| `tertiary` | Contrast accents | Tone 40 | Tone 80 |
| `surface` | Background surfaces | Tone 99 | Tone 10 |
| `on-surface` | Text on surfaces | Tone 10 | Tone 90 |
| `surface-variant` | Decorative containers | Tone 90 | Tone 30 |
| `outline` | Borders, dividers | Tone 50 | Tone 60 |
| `outline-variant` | Decorative outlines | Tone 80 | Tone 30 |
| `error` | Error states | #B3261E | #F2B8B5 |

## Tonal Palettes

Generate a 13-tone palette from any seed color:

```
Tone 0   - Black
Tone 10  - Darkest
Tone 20  -
Tone 30  -
Tone 40  - Primary (light theme)
Tone 50  -
Tone 60  -
Tone 70  -
Tone 80  - Primary (dark theme)
Tone 90  - Container (light theme)
Tone 95  -
Tone 99  - Surface (light theme)
Tone 100 - White
```

## Custom Theme Generation

### From Seed Color

Generate complete theme from a single hex color:

```css
/* Seed: #6750A4 (Purple) */
:root {
  /* Primary */
  --md-sys-color-primary: #6750A4;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #EADDFF;
  --md-sys-color-on-primary-container: #21005D;

  /* Secondary (derived from primary) */
  --md-sys-color-secondary: #625B71;
  --md-sys-color-on-secondary: #FFFFFF;
  --md-sys-color-secondary-container: #E8DEF8;
  --md-sys-color-on-secondary-container: #1D192B;

  /* Tertiary (complementary) */
  --md-sys-color-tertiary: #7D5260;
  --md-sys-color-on-tertiary: #FFFFFF;
  --md-sys-color-tertiary-container: #FFD8E4;
  --md-sys-color-on-tertiary-container: #31111D;

  /* Neutral */
  --md-sys-color-surface: #FFFBFE;
  --md-sys-color-on-surface: #1C1B1F;
  --md-sys-color-surface-variant: #E7E0EC;
  --md-sys-color-on-surface-variant: #49454F;
  --md-sys-color-outline: #79747E;
  --md-sys-color-outline-variant: #CAC4D0;

  /* Error */
  --md-sys-color-error: #B3261E;
  --md-sys-color-on-error: #FFFFFF;
  --md-sys-color-error-container: #F9DEDC;
  --md-sys-color-on-error-container: #410E0B;

  /* Surface levels */
  --md-sys-color-surface-dim: #DED8E1;
  --md-sys-color-surface-bright: #FFFBFE;
  --md-sys-color-surface-container-lowest: #FFFFFF;
  --md-sys-color-surface-container-low: #F7F2FA;
  --md-sys-color-surface-container: #F3EDF7;
  --md-sys-color-surface-container-high: #ECE6F0;
  --md-sys-color-surface-container-highest: #E6E0E9;
}
```

### Preset Palettes

#### Ocean Blue
```css
--md-sys-color-primary: #0061A4;
--md-sys-color-primary-container: #D1E4FF;
```

#### Forest Green
```css
--md-sys-color-primary: #006D3B;
--md-sys-color-primary-container: #98F7B5;
```

#### Sunset Orange
```css
--md-sys-color-primary: #9C4400;
--md-sys-color-primary-container: #FFDBC9;
```

#### Berry Red
```css
--md-sys-color-primary: #BE0027;
--md-sys-color-primary-container: #FFDAD7;
```

## Dark Theme

Apply `.dark` class to root element:

```html
<html class="dark">
```

```css
.dark {
  /* Primary shifts to lighter tones */
  --md-sys-color-primary: #D0BCFF;
  --md-sys-color-on-primary: #381E72;
  --md-sys-color-primary-container: #4F378B;
  --md-sys-color-on-primary-container: #EADDFF;

  /* Secondary */
  --md-sys-color-secondary: #CCC2DC;
  --md-sys-color-on-secondary: #332D41;
  --md-sys-color-secondary-container: #4A4458;
  --md-sys-color-on-secondary-container: #E8DEF8;

  /* Surfaces darken */
  --md-sys-color-surface: #1C1B1F;
  --md-sys-color-on-surface: #E6E1E5;
  --md-sys-color-surface-variant: #49454F;
  --md-sys-color-on-surface-variant: #CAC4D0;
  --md-sys-color-outline: #938F99;
  --md-sys-color-outline-variant: #49454F;

  /* Error lightens */
  --md-sys-color-error: #F2B8B5;
  --md-sys-color-on-error: #601410;
  --md-sys-color-error-container: #8C1D18;
  --md-sys-color-on-error-container: #F9DEDC;

  /* Surface levels */
  --md-sys-color-surface-dim: #141218;
  --md-sys-color-surface-bright: #3B383E;
  --md-sys-color-surface-container-lowest: #0F0D13;
  --md-sys-color-surface-container-low: #1D1B20;
  --md-sys-color-surface-container: #211F26;
  --md-sys-color-surface-container-high: #2B2930;
  --md-sys-color-surface-container-highest: #36343B;
}
```

### Theme Toggle with JavaScript

```javascript
function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme',
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
}

// Initialize on load
if (localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') &&
     window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
}
```
