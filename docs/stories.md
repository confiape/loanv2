# STORYBOOK.md – Storybook Documentation Guide

> Applies to: **Angular 20 (Zoneless)** application with **Tailwind CSS v4** and **standalone components**.
> Goal: keep every UI component documented with consistent, accessible, and themed stories.

---

## 1. Purpose

Storybook documents reusable UI components in isolation so that teams can review Light/Dark states, responsive breakpoints, and QA notes without running the full app. Treat every story as living documentation that mirrors production behavior.

---

## 2. Folder Structure

All stories live under `src/stories`. Group files by feature (`ui/button/button.stories.ts`, `forms/input.stories.ts`, etc.) so discoverability matches the design system. Global decorators and parameters remain in `src/stories/themes`. The legacy `story-helpers.ts` file stays in the directory for backward compatibility only and must not be referenced by new stories.

---

## 3. Theming and Layout

- [`@storybook/addon-themes`](https://storybook.js.org/addons/@storybook/addon-themes) is applied globally, so individual stories do **not** need to manage theme toggles or helper wrappers.
- Even though switching is automatic, components must look correct for Light/Dark because QA will flip the toolbar themes while reviewing.
- Keep layouts minimal: prefer the `padded` or `fullscreen` Storybook layout parameter when extra space is required, and avoid custom iframes or helper wrappers.

---

## 4. Meta Configuration

Every `.stories.ts` file defines a strongly typed `Meta` export with:

- `title`: follows `Domain/Subdomain/Component` so navigation matches Figma files.
- `component`: direct reference to the standalone Angular component.
- `tags`: include `['autodocs']` for automatic docs pages.
- `parameters`: set `layout` (`'padded'` for inline components, `'fullscreen'` for layouts) plus any controls for the themes addon.
- `argTypes`: describe every public input, output, and variant to keep controls self-documented.

---

## 5. Story Coverage

Provide 5–10 stories per component covering at minimum the default view, each visual variant, size differences, loading/disabled/error states, edge cases (overflow, empty data), and any interactive flows. When state combinations explode, prioritize what designers list as critical and document rationale in a `description` parameter.

---

## 6. ArgTypes and Controls

- Map enums (`variant`, `size`, `tone`) to `select` controls.
- Use `boolean` for toggles such as `disabled`, `open`, `loading`.
- Limit `text` controls to content slots or free-form labels.
- `number` controls cover quantities (progress, step indexes, counts).
- For event outputs, use `fn()` from `@storybook/test` so docs pages surface interactions.

---

## 7. Deprecations

`src/stories/story-helpers.ts` and all of its exports (`createLightDarkComparison`, `createVariantComparison`, `wrapInLightDarkComparison`, `generateBindings`, `createLightDarkRender`) are deprecated. Do not import them in future stories; extend the themes addon configuration instead when you need custom Light/Dark previews.

---
