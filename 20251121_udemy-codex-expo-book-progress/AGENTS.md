# Repository Guidelines

This guide orients agents contributing to the Book Progress Expo app. Follow these conventions to keep the project fast to iterate and production ready.

## Project Structure & Module Organization
- `app/`: active Expo Router screens; treat each file as a route and co-locate screen-specific hooks or styles.
- `assets/`: static images, fonts, and other bundled media; keep names kebab-case and document licenses.
- `eslint.config.js`, `tsconfig.json`, `app.json`: global linting, TypeScript, and Expo config; update in lockstep with dependency upgrades.

## Build, Test, and Development Commands
- `npm install`: install dependencies after cloning or pulling changes.
- `npm run start`: launch Expo Dev Server with tunnel for remote device previews.
- `npm run web` / `npm run android` / `npm run ios`: open platform-specific previews (note: fix `--tunme;` typo in `ios` if you rely on it).
- `npm run lint`: run ESLint via `expo lint`; resolve all warnings before merging.
- `npm run typecheck`: run `tsc --noEmit`; execute after each implementation change before submitting work.
- `npm run test`: execute Jest test suite (uses `jest-expo`); run locally before raising a PR.
- `npm run test:watch`: iterate on tests with Jest watch mode during development.

## Coding Style & Naming Conventions
- Use TypeScript with strict, explicit typing; avoid `any`.
- Prefer functional React components, PascalCase filenames, camelCase hooks (`useBookProgress`), and kebab-case assets.
- Follow the 2-space indentation, single quotes in JSX literals, and keep styles inside `StyleSheet` or shared utilities.
- Screen-level state should come from the shared `BookStoreProvider`; avoid duplicate local caches of book data.

## Testing Guidelines
- Work feature changes through a Test-Driven Development (TDD) loop: write or update the failing test first, implement the minimal code to pass, then refactor while keeping the suite green.
- Adopt Jest with `@testing-library/react-native`; store specs alongside source in `__tests__` folders.
- Mock Expo modules explicitly and assert user-observable behavior rather than implementation details.
- Target at least smoke coverage for each route and regressions for bug fixes; keep tests deterministic and CI-ready.
- Use the SQL.js in-memory adapter for repository specs (`createSqlJsAdapter`) and the mocked AsyncStorage/SQLite modules provided in `jest.setup.ts` for UI tests.

## Commit & Pull Request Guidelines
- Use Conventional Commits (`feat:`, `fix:`, `chore:`) with concise scopes (e.g., `feat: add progress list screen`).
- Reference related issues in the body (`Closes #12`) and describe user-visible changes plus test evidence.
- Attach screenshots or screen recordings for UI updates and mention accessibility considerations (Dynamic Type, dark mode).
- Ensure all lint and test commands pass locally before requesting review.

## Security & Configuration Tips
- Never commit secrets; rely on Expo config plugins or `.env` guarded by `app.config.ts`.
- Validate all network inputs and sanitise user-generated content before display.
- Track exceptions or temporary workarounds in issues and retire them promptly.
- Statistics should include all `currentPages` progress, not just completed books; repository tests guard this behavior.
