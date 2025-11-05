# Angular 20 Best Practices & Style Guide

> Unified guide combining [Angular.dev Style Guide](https://angular.dev/style-guide) with project-specific conventions.
> Applies to this codebase: **Angular 20** app with a **semantic design system on Tailwind CSS v4**, using **standalone components**, **zoneless change detection**, **signals**, and **strict TypeScript**.

---

## 1. Introduction

This document defines the team’s coding and structural conventions for Angular 20 applications.
It ensures consistency, readability, and maintainability across all projects.

When rules seem to conflict, **prefer consistency within a file** over strict adherence to guidelines.

---

## 2. TypeScript Essentials

* Enable `"strict": true` in `tsconfig.json`.
* Prefer **type inference** when obvious; be explicit otherwise.
* Avoid `any`; use `unknown` for uncertain types.
* Use **readonly**, `const`, and interfaces for clear, immutable contracts.
* Follow [Google’s TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html).
* Keep code **lint-clean** and **formatted** (ESLint + Prettier).

---

## 3. Angular Core Principles

* Use **standalone components** — no NgModules.
* Enable **zoneless change detection** via `provideZonelessChangeDetection()`.
* Manage state with **signals** and `computed()`.
* Implement **lazy loading** for feature routes.
* Prefer `inject()` over constructor DI for better readability and tree-shaking.
* Favor **composition over inheritance**.
* Define host bindings in the `host` object, not via decorators.

---

## 4. Components

* Keep components **focused, small, and reusable**.
* Use `input()` / `output()` functions instead of decorators.
* Always enable:

  ```ts
  changeDetection: ChangeDetectionStrategy.OnPush
  ```
* Prefer **inline templates/styles** for small UI units.
* Use **Reactive Forms**; avoid template-driven ones.
* Replace `ngClass` / `ngStyle` with `[class.foo]` / `[style.prop]`.
* Use **NgOptimizedImage** for static images (not base64).
* Apply **semantic HTML** and accessibility roles.

📘 Before creating new components, read [`components-styles.md`](components-styles.md).

---

## 5. Tailwind CSS v4 Guidelines

* **Use Tailwind utilities as much as possible.**
* Only write plain CSS for **complex or low-level visual logic**.
* Centralize theme tokens (`--color-bg-primary`, `--color-text-secondary`, etc.).
* Maintain consistent **spacing, typography, and color scale**.
* Support **dark/light themes** via CSS variables.
* Use **grid** and **flex** utilities — avoid unnecessary wrappers.

### Required CSS Variables

Every custom CSS file must use the following standard design tokens (no hardcoded colors):

```css
/* Backgrounds */
--color-bg-primary: var(--bg-primary);
--color-bg-secondary: var(--bg-secondary);
--color-bg-surface: var(--bg-surface);

/* Text */
--color-text-primary: var(--text-primary);
--color-text-secondary: var(--text-secondary);

/* Borders */
--color-border: var(--border);

/* Brand */
--color-accent: var(--accent);
--color-accent-hover: var(--accent-hover);

/* States */
--color-success: var(--success);
--color-warning: var(--warning);
--color-error: var(--error);

/* Overlay */
--color-overlay: var(--overlay);
```

**Usage Example**

```html
<!-- Tailwind-based -->
<div class="bg-bg-primary text-text-primary p-4 rounded-md">
  Example using Tailwind color tokens
</div>
```

```css
/* CSS-based */
.card {
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
```

---

## 6. Templates

* Keep templates **simple and declarative**.
* Use **new control flow** (`@if`, `@for`, `@switch`) instead of `*ngIf`/`*ngFor`.
* Avoid complex inline logic — move to `computed()` or functions.
* Use the **async pipe** for observables.
* Avoid direct DOM manipulation.

---

## 7. State Management

* Use **signals** for both local and shared state.
* Derive values with `computed()` and update via `set()` or `update()`.
* Keep updates **pure and predictable**.
* Avoid side effects in reactive flows.

---

## 8. Naming & Project Structure

### File Naming

According to the official Angular 20 style guide:

| Element   | File Name              | Class / Identifier |
| --------- | ---------------------- | ------------------ |
| Component | `user-profile.ts`      | `UserProfile`      |
| Template  | `user-profile.html`    | —                  |
| Styles    | `user-profile.css`     | —                  |
| Unit Test | `user-profile.spec.ts` | —                  |

**Rules**

* Use **hyphens (-)** to separate words in file names.
* File names mirror the **TypeScript class name** (kebab-case ↔ PascalCase).
* Related files share the same name base.
* Group files by **feature**, not by type.
* Keep one primary concept per file.

**Example**

```
src/
├─ user-profile/
│  ├─ user-profile.ts
│  ├─ user-profile.html
│  ├─ user-profile.css
│  ├─ user-profile.spec.ts
```

### Folder Structure

* All application code lives under `src/`.
* Bootstrap entry point: `src/main.ts`.
* Group related files together.
* Organize by **feature area**, not by type (`components`, `services`, etc.).
* Place tests next to the code under test.
* Avoid overly large directories; split further when needed.

---

## 9. Dependency Injection

* Prefer the **`inject()`** function over constructor parameters.

  * Easier comments and readability for multiple dependencies.
  * Better type inference and cleaner class fields.

---

## 10. Components & Directives Guidelines

* Use `protected` for members only accessed by templates.
* Use `readonly` for `input`, `output`, and query properties.
* Keep logic **presentation-focused**; extract utilities or business logic to services or pure functions.
* Keep lifecycle hooks short — call well-named helper methods.
* Implement lifecycle hook interfaces (`OnInit`, `OnDestroy`, etc.).
* Name event handlers for **what they do**, not for the event:

  ```html
  <button (click)="saveUser()">Save</button>
  ```
* Prefer `[class]` / `[style]` bindings over `ngClass` / `ngStyle`.

---

## 11. Performance & Accessibility

* Always use **OnPush** change detection.
* Use **pure pipes** and `trackBy` in lists.
* Optimize images (`NgOptimizedImage` + lazy loading).
* Maintain **ARIA roles**, labels, and keyboard navigation.
* Avoid unnecessary re-rendering by using **signals** and **computed** values efficiently.

---

## 12. Testing & Documentation

### 🧪 Unit Tests

* Use **Vitest** or **Jasmine**.
* Test **signals**, **computed**, and **inject()** logic directly.
* Read [`unit-test.md`](unit-test.md) before writing new tests.

### 🎭 Playwright

* Use **Playwright** for end-to-end and visual tests.
* Keep tests small and idempotent.
* Read [`playwright.md`](playwright.md) before adding or updating tests.

### 📖 Storybook

* Use **Storybook** for component docs and visual regression.
* Read [`stories.md`](stories.md) before creating or editing stories.

---

## 13. Internal Docs Policy

* Each feature folder must include a short `README.md`.
* Document all **public APIs**, **inputs/outputs**, and **signals**.
* Keep Storybook and testing documentation in sync with implementation.

---

## ✅ Summary

> Build Angular 20 apps with **signals**, **zoneless change detection**, and **Tailwind CSS v4**.
> Use Tailwind for everything possible, CSS only for complex edge cases.
> Follow the naming and structural conventions from Angular.dev.
> Always read the relevant internal doc before creating:
>
> * Components → `components-styles.md`
> * Stories → `docs/stories.md`
> * Unit tests → `unit-test.md`
> * Playwright tests → `playwright.md`
>
> Keep the codebase **semantic**, **strict-typed**, **performant**, and **maintainable**.
