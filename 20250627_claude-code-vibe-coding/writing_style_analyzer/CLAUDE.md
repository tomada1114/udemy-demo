# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing
```bash
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Open Vitest UI
```

### Single Test Execution
```bash
npx vitest run src/test/hooks/useAnalysis.test.ts     # Run specific test file
npx vitest run --grep "analyze function"              # Run tests matching pattern
```

## Architecture Overview

### Core Application Flow
This is an AI-powered writing style analyzer that processes user text through Google Gemini AI and returns formatted markdown analysis. The application follows a client-server architecture with Next.js App Router.

**Data Flow:**
1. User input → `TextInputArea` (2000 char limit, validation)
2. `useAnalysis` hook → `/api/analyze` endpoint
3. API sanitizes input → `GeminiApiClient` → Gemini AI
4. Response processed → `AnalysisResult` displayed as markdown
5. Results stored in `useHistory` (localStorage, 5 items max)

### Design System Architecture
The app uses a comprehensive Apple-inspired design system located in `src/lib/design-system.ts`:

- **8-color theme system**: `THEME_COLORS` array with predefined themes (sunshine, ocean, forest, etc.)
- **Glassmorphism effects**: `GLASSMORPHISM_STYLES` with backdrop-blur and transparency
- **3-layer background gradients**: `BACKGROUND_LAYERS` for depth
- **Theme switching**: `useThemeColor` hook manages theme state

### State Management Pattern
Uses custom hooks for state management without external libraries:

- `useAnalysis`: Main analysis flow (status, error, result, progress)
- `useHistory`: localStorage-based history (5 items, CRUD operations) 
- `useLocalStorage`: Generic localStorage hook with SSR safety
- `useClipboard`: Copy functionality with user feedback

### API Security Model
- **Server-side only**: API key stored as `GEMINI_API_KEY` (not `NEXT_PUBLIC_`)
- **Input sanitization**: Removes HTML tags and JavaScript URLs
- **Security headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- **Error handling**: Status-specific error messages, network error detection

### Component Architecture
**Feature-based organization** in `src/components/features/`:
- `TextInput/`: Input handling with character counter and validation
- `Analysis/`: Result display with markdown rendering and copy functionality  
- `History/`: History management with view/delete actions

**Layout components** in `src/components/layout/`:
- `AppLayout`: Main layout wrapper with background layers
- `Header`: Navigation with glassmorphism styling
- `BackgroundLayers`: 3-layer gradient background system

### Type System
Centralized in `src/types/`:
- `app.ts`: Core business logic types (AnalysisResult, HistoryItem, etc.)
- `design.ts`: Design system types (ThemeColor, etc.)

## Critical Implementation Details

### Environment Setup
Required environment variable in `.env.local`:
```bash
GEMINI_API_KEY=your_actual_gemini_api_key
```
**Security Note**: Never use `NEXT_PUBLIC_` prefix for API keys - it exposes them to the client.

### Tailwind CSS 4.x Configuration
Uses the new Tailwind CSS 4.x format with `@import "tailwindcss"` in globals.css instead of traditional config files.

### Test Configuration
- Vitest with jsdom environment
- Setup file: `src/test/setup.ts`
- Path alias `@` points to `src/`
- React Testing Library for component tests

### Markdown Security
Uses `react-markdown` with `remarkGfm` plugin. The library automatically sanitizes HTML to prevent XSS attacks. Custom component styling is applied through the `components` prop.

### API Rate Limiting Considerations
The Gemini API client includes AbortController support for request cancellation. The `useAnalysis` hook provides progress simulation and cancellation capabilities for better UX.

### Accessibility Implementation
- ARIA attributes on interactive elements
- Keyboard navigation support (Cmd/Ctrl + Enter for analysis)
- Screen reader support with proper labels and descriptions
- WCAG 2.1 AA compliance considerations

### Performance Optimizations
- React.memo for component optimization (check existing usage patterns)
- Tailwind CSS purging in production builds
- Next.js 15.3.4 with Turbopack for fast development
- AbortController for request cancellation to prevent race conditions