# Repository Guidelines

## Project Structure & Module Organization
Keep features grouped under `src/app`, co-locating components, services, and specs per feature. Shared UI primitives live under `src/stories`, with reference material in `docs/`. Always prefer the `@loan/...` import alias instead of deep relative paths to preserve clarity when files move.

## Build, Test, and Development Commands
Use `npm start` (wrapper for `ng serve`) to launch the app with live reload at http://localhost:4200. Run `npm run build` for an optimized production bundle in `dist/`. Execute `npm test` to run Karma unit tests, and `npm run watch` when you need a continually rebuilding development bundle. Storybook lives alongside the app; preview it with `npm run storybook` and generate static docs via `npm run build-storybook`.

## Coding Style & Naming Conventions
This codebase targets Angular 20 with standalone components, zoneless change detection, and signals. Default to `ChangeDetectionStrategy.OnPush`, `inject()` for DI, and `computed()` for derived state. TypeScript files use 2-space indentation, strict typing, and Prettier (`printWidth: 100`, `singleQuote: true`). Tailwind CSS v4 is the primary styling tool—reuse semantic tokens (e.g. `bg-bg-primary`, `text-text-secondary`) and avoid hard-coded colors; fall back to custom CSS only for complex layouts.

## Testing Guidelines
Place unit tests next to the code under test using the `*.spec.ts` suffix, matching the component or service name. Run `npm test` locally before opening a pull request; aim to restore or raise coverage when touching logic-heavy code. When building components, wire up Playwright-friendly `data-testid` attributes as documented in `docs/playwright-testids.md`. Update or add specs whenever behavior changes.

## Commit & Pull Request Guidelines
Follow the existing history: concise, present-tense commit messages that state the outcome (e.g., `Refactor Input component ...`). Keep related changes in a single commit and rebase before pushing. Pull requests should include a clear summary, affected areas, linked issues or tickets, and any visual diffs (screenshots/GIFs) when UI changes. Confirm that `npm test` and relevant build commands pass, and note any extra verification (e.g., Storybook smoke checks) in the PR description.

## Storybook & UI Notes
Treat Storybook as the contract for reusable UI. Component stories live in `src/stories`; follow the patterns in `docs/stories.md` for naming and controls. Every component should demonstrate both light and dark themes, expose configurable inputs, and provide accessibility notes when applicable. Update stories alongside UI changes so downstream teams and agents can validate behavior quickly.
