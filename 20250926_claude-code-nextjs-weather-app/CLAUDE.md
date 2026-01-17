# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build production application
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run Jest tests
npm run test:watch   # Run Jest in watch mode
npm run test:coverage # Generate test coverage report
```

## Architecture

Weather forecast application using OpenWeatherMap API with Next.js 15.5.0 App Router.

### Core Stack
- **Framework**: Next.js 15.5.0 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 with PostCSS
- **Testing**: Jest + React Testing Library
- **API**: OpenWeatherMap (free tier, 60 calls/minute)

### Data Flow Architecture
```
User Input → SearchBar → page.tsx → API Routes → OpenWeatherMap API
                             ↓
                    State Management
                             ↓
         CurrentWeather + ForecastList (UI Components)
```

### API Layer
- **API Routes** (`src/app/api/`): Server-side proxy to protect API keys
  - `/api/weather/[city]`: Current weather with 5-minute caching
  - `/api/forecast/[city]`: 5-day forecast with 5-minute caching
- **Client Functions** (`src/lib/weather.ts`): Typed API client functions
- **City Translation** (`src/lib/cityMapping.ts`): Japanese → English city name mapping
- **Weather Emoji** (`src/lib/weatherEmoji.ts`): Icon code → emoji conversion

### Component Architecture
- **Page Component** (`page.tsx`): Main orchestrator with data fetching and state management
- **SearchBar**: City input with loading state
- **CurrentWeather**: Large emoji display with temperature and details
- **ForecastList**: Container for 5-day forecast cards
- **WeatherCard**: Individual day forecast with emoji
- **LoadingSpinner**: Animated loading indicator
- **ErrorBoundary**: Error handling wrapper

### State Management Pattern
- Client-side state in `page.tsx` using React hooks
- Parallel data fetching with `Promise.all()`
- Error states with Japanese user messages
- Loading states during API calls

### Caching Strategy
- In-memory cache with 5-minute TTL
- Prevents API rate limit issues (60 calls/minute)
- Cache key: city name (case-insensitive)

### Environment Configuration
```env
OPEN_WEATHER_API_KEY=your_api_key_here  # Required in .env.local
```

### Testing Structure
- Component tests in `__tests__/components/`
- API route tests in `__tests__/api/`
- Mock OpenWeatherMap responses in tests
- Coverage target: 80% for components

### Type System
- Strict TypeScript configuration
- Path alias: `@/*` → `./src/*`
- Shared types in `src/types/weather.ts`:
  - `Weather`: Current weather data
  - `Forecast`: Daily forecast data
  - `WeatherResponse/ForecastResponse`: API responses

### Japanese Localization
- All user-facing text in Japanese
- City name translation for common Japanese cities
- Error messages in Japanese
- Date formatting with Japanese weekday names