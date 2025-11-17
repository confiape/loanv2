# Angular 20 – Unified Guide (Main Agent Compact)

> Base conventions for Angular 20 apps using **Tailwind v4**, **standalone components**, **zoneless change detection**, **signals**, and **strict TypeScript**.
> Covers implementation, stories, and unit tests for a consistent design-system workflow.

---

## 1. Core Principles

- Standalone components only (no NgModules).
- Zoneless change detection → `provideZonelessChangeDetection()`.
- Reactive state via **signals** + `computed()`.
- Composition > inheritance; use `inject()` instead of constructors.
- Small, reusable, focused components with clear inputs/outputs.
- Code must be lint-clean and strictly typed.

---

## 2. TypeScript & Imports

- `"strict": true`; avoid `any`.
- Prefer inference, `readonly`, `const`.
- Use alias `@loan/...`; never relative imports.

---

## 3. Components

- `changeDetection: OnPush`.
- Use `input()` / `output()` functions.
- Inline template/style for micro-UI.
- Reactive Forms only.
- Prefer `[class]` / `[style]`.
- Semantic HTML + accessibility roles.

---

## 4. Tailwind v4

- Tailwind utilities > CSS; only use CSS for complex visuals.
- Use tokens (no hardcoded colors):
  `--color-bg-primary`, `--color-text-primary`, `--color-border`, `--color-accent`, etc.
- Maintain consistent spacing, typography, and dark/light themes.

---

## 5. Templates & State

- Use new control-flow syntax (`@if`, `@for`, `@switch`).
- Keep declarative templates.
- Use async pipe for observables.
- Manage state via **signals** and `computed()`; pure updates only.

---

## 6. Naming & Structure

- Kebab-case ↔ PascalCase.
- One concept per file.
- Organize by feature, not type.
- Tests next to code.
- Example:

  ```
  feature/
    ├─ feature.ts
    ├─ feature.html
    ├─ feature.css
    ├─ feature.spec.ts
  ```

---

## 7. Dependency & Access

- Prefer `inject()` for DI.
- `protected` = template access only.
- `readonly` for inputs/outputs.
- Extract business logic to services/pure functions.

---

## 8. Test IDs (Playwright)

- Support `data-testid` in all components.
- Read via `HostAttributeToken`; append suffixes (`-wrapper`, `-input`, `-btn`).
- Return `null` if no host ID.
- Always computed dynamically.
- Example:

  ```html
  <app-login data-testid="signup-form" />
  ```

  → generates `signup-form-login`, `signup-form-input`, `signup-form-button`.

---

## 9. Unit Tests (Vitest + Angular 20.1)

- **Framework:** Vitest + `@testing-library/dom` (NO `@testing-library/angular`).
- One `.spec.ts` per component/service.
- Co-locate tests with source.
- **NO `beforeEach`** - Each test is independent.
- Use `TestBed.configureTestingModule()` + `createComponent()` in each test.
- Use `TestBed.tick()` NOT `fixture.detectChanges()`.
- Use `inputBinding()` and `outputBinding()` from `@angular/core`.
- Use **signals** to capture output emissions.
- Use `within(fixture.nativeElement)` from `@testing-library/dom` for queries.
- Use `userEvent` from `@testing-library/user-event` for interactions.
- **Arrange / Act / Assert** pattern with comments.
- Mocks via `vi.fn()` or providers.
- Use `data-testid` selectors.

### Component Test Pattern:

```ts
// Angular testing
import { TestBed } from '@angular/core/testing';
import {
  provideZonelessChangeDetection,
  inputBinding,
  outputBinding,
  signal,
} from '@angular/core';

// Testing library
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

// Vitest
import { describe, it, expect, vi } from 'vitest';

// Component under test
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  it('should emit output when button clicked', async () => {
    // Arrange
    const emittedValue = signal<string | null>(null);
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(MyComponent, {
      bindings: [
        inputBinding('label', () => 'Click me'),
        outputBinding('clicked', (value: string) => emittedValue.set(value)),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const button = queries.getByRole('button');
    await user.click(button);
    TestBed.tick();

    // Assert
    expect(emittedValue()).toBe('clicked');
  });
});
```

### Service Test Pattern:

```ts
describe('MyService', () => {
  it('should fetch data', () => {
    // Arrange
    const service = TestBed.configureTestingModule({
      providers: [MyService, provideZonelessChangeDetection()],
    }).inject(MyService);

    // Act
    const result = service.getData();

    // Assert
    expect(result).toBeDefined();
  });
});
```

---

## 10. Storybook / Stories

- One `.stories.ts` per component.
- Use Tailwind tokens only.
- Use **CSF3**: `export default { component, title }` + named stories.
- **Render el componente directamente** (sin wrappers extras).
- **Helpers disponibles y parámetros** (no incluir su código, solo usarlos):
  - `wrapInLightDarkComparison(template: string): string` → Envuelve cualquier template para ver **Light/Dark**.
  - `createLightDarkComparison(componentTag: string, bindings?: string): string` → Light/Dark con un **tag** y **bindings**.
  - `createVariantComparison(componentTag: string, variants: string[], baseBindings?: string): string` → Grid Light/Dark con **todas las variantes**.
  - `createLightDarkRender(componentTag: string, bindings: string): (args) => { props; template }` → Genera una **función `render`** estándar Light/Dark.

**Ejemplo (usar exactamente este patrón):**

```ts
export default {
  title: 'UI/Avatar',
  component: Avatar,
};

export const Default: Story = {
  args: { variant: 'placeholder', size: 'md', shape: 'full' },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <app-avatar
        [variant]="variant"
        [size]="size"
        [shape]="shape"
      />
    `),
  }),
};
```

---

## 11. Performance & A11y

- Always OnPush + pure pipes + `trackBy`.
- Lazy-load routes/images (`NgOptimizedImage`).
- Maintain ARIA roles, labels, keyboard navigation.
- Use signals/computed to minimize re-renders.

---

## ✅ Summary

> Angular 20 + Tailwind v4 + signals + zoneless.
> Use alias imports `@loan/...`.
> Unified conventions for components, stories, and tests.
> Code must remain typed, semantic, performant, and testable.
