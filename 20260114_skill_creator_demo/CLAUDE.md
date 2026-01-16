# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a demonstration repository for Claude Code skills. It showcases the `material-design-tailwind` skill, which provides guidance for building Material Design 3 compliant UI components using Tailwind CSS.

## Project Structure

```
.claude/
├── settings.local.json    # Local Claude Code settings
└── skills/
    └── material-design-tailwind/
        ├── SKILL.md       # Main skill definition with YAML frontmatter
        └── references/    # Supporting documentation
            ├── colors.md      # MD3 color system and theming
            ├── components.md  # Component patterns (buttons, cards, dialogs, etc.)
            └── layout.md      # Responsive layouts and spacing
```

## Skill Activation

The `material-design-tailwind` skill activates when users mention:
- "Material Design", "MD3", "Material UI with Tailwind"
- "Google design system"
- "create Material button/card/dialog"
- "Material color palette", "Material theme"

## Key Concepts

### Material Design 3 with Tailwind

The skill maps MD3 design tokens to Tailwind CSS:
- CSS custom properties (`--md-sys-color-*`) for dynamic theming
- Custom Tailwind config extensions for MD3 colors, border-radius, and shadows
- Responsive breakpoints following MD3 window size classes (compact/medium/expanded/large)

### Theme System

- Light/dark theme switching via `.dark` class on root element
- Semantic color roles (`primary`, `on-primary`, `surface`, etc.) instead of raw colors
- Tonal palette generation from seed colors
