# Angular 20.1 Unit Testing Guide

> Quick reference for Angular 20.1's new testing API with `inputBinding()`, `outputBinding()`, and Test Builders

---

## Overview

Angular 20.1 introduces a new testing API for:

- Zoneless change detection
- Signal-based reactive state
- Standalone components

**Key Changes:**

| Old                                      | New                                       |
| ---------------------------------------- | ----------------------------------------- |
| `render()` from @testing-library/angular | `TestBed.createComponent()`               |
| Component props                          | `inputBinding()` / `outputBinding()`      |
| `fixture.detectChanges()`                | `TestBed.tick()`                          |
| Component creation in `beforeEach`       | Test builders for config, create in tests |

---

## Core Principles

1. **Test Independence** - Use builders for config, create components in each test
2. **Arrange/Act/Assert** - Always use comments to separate sections
3. **Input Immutability** - Inputs via `inputBinding()` are read-only, create separate tests for different values

---

## Angular 20.1 New Testing API

### Required Imports

```typescript
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, inputBinding, outputBinding, signal } from '@angular/core';
import { within } from '@testing-library/dom';
import { describe, it, expect, vi } from 'vitest';
```

### Basic Component Test

```typescript
describe('MyComponent', () => {
  it('should render with inputs and emit outputs', () => {
    // Arrange
    const outputSignal = signal<string | null>(null);
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(MyComponent, {
      bindings: [
        inputBinding('title', () => 'Test Title'),
        inputBinding('count', () => 5),
        outputBinding('action', (value: string) => outputSignal.set(value)),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Act
    const button = queries.getByRole('button');
    button.click();
    TestBed.tick();

    // Assert
    expect(queries.getByText('Test Title')).toBeTruthy();
    expect(outputSignal()).toBe('expected-value');
  });
});
```

**Important:**

- Always call `TestBed.tick()` after creating component
- Always call `TestBed.tick()` after signal changes or user interactions
- Inputs are **read-only** - cannot use `.set()` after binding
- Use signals to capture output emissions

---

## Test Builders (Recommended)

Reduce code duplication while maintaining test independence.

### Generic Builder

```typescript
import { ComponentTestBuilder } from '@loan/shared/testing';

describe('MyComponent', () => {
  let builder: ComponentTestBuilder<MyComponent>;

  beforeEach(() => {
    // Configure defaults, don't create component
    builder = new ComponentTestBuilder(MyComponent)
      .withInput('title', 'Default Title')
      .withInput('enabled', true);
  });

  it('should use defaults', () => {
    const fixture = builder.build(); // Auto-clones + creates
    expect(fixture.componentInstance.title()).toBe('Default Title');
  });

  it('should override defaults', () => {
    const fixture = builder.withInput('title', 'Custom').build();
    expect(fixture.componentInstance.title()).toBe('Custom');
  });
});
```

### Specialized Builder (e.g., AlertTestBuilder)

```typescript
import { AlertTestBuilder } from '@loan/shared/testing';

describe('Alert', () => {
  let builder: AlertTestBuilder;

  beforeEach(() => {
    builder = new AlertTestBuilder().withMessage('Default').asDismissible();
  });

  it('should render info variant', () => {
    const fixture = builder.withInfoVariant().build();
    const alertEl = within(fixture.nativeElement).getByRole('alert');
    expect(alertEl.className).toContain('bg-accent/10');
  });

  it('should emit dismissed event', () => {
    const fixture = builder.build();
    const dismissedSignal = builder.getDismissedSignal();

    const closeButton = within(fixture.nativeElement).getByRole('button', { name: /close/i });
    closeButton.click();
    TestBed.tick();

    expect(dismissedSignal()).toBeUndefined();
  });
});
```

**Benefits:** 44% less code, guaranteed test independence, type-safe

**See:** `src/app/shared/testing/README.md` for full guide

---

## Testing Patterns

### User Interactions

Use native events for most cases:

```typescript
it('should handle user interaction', () => {
  const fixture = builder.build();
  const queries = within(fixture.nativeElement);

  // Click
  const button = queries.getByRole('button');
  button.click();

  // Form input
  const input = queries.getByRole('textbox') as HTMLInputElement;
  input.value = 'new value';
  input.dispatchEvent(new Event('input'));

  // Keyboard
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

  // Hover
  const element = queries.getByText('Hover me');
  element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

  TestBed.tick();

  // Assertions...
});
```

**Note:** For complex interactions (drag & drop, text selection), see [@testing-library/user-event docs](https://testing-library.com/docs/user-event/intro)

### Testing Services

```typescript
describe('MyService', () => {
  it('should process data', () => {
    // Arrange
    const mockDep = { getData: vi.fn().mockReturnValue([1, 2, 3]) };
    const service = TestBed.configureTestingModule({
      providers: [
        MyService,
        { provide: DataService, useValue: mockDep },
        provideZonelessChangeDetection(),
      ],
    }).inject(MyService);

    // Act
    const result = service.process();

    // Assert
    expect(result).toBeDefined();
    expect(mockDep.getData).toHaveBeenCalled();
  });
});
```

### Routing Components

```typescript
it('should have navigation links', () => {
  const fixture = TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      provideRouter([]), // Required for routing
    ],
  }).createComponent(NavComponent);
  TestBed.tick();

  const link = within(fixture.nativeElement).getByRole('link', { name: /dashboard/i });
  expect(link.getAttribute('href')).toContain('/dashboard');
});
```

### Conditional Rendering

```typescript
it('shows loading then data', () => {
  // Loading state
  const loadingFixture = builder.withInput('isLoading', true).build();
  expect(within(loadingFixture.nativeElement).getByText(/loading/i)).toBeTruthy();

  // Data state
  const dataFixture = builder
    .withInput('isLoading', false)
    .withInput('data', [{ id: 1, name: 'Item 1' }])
    .build();
  expect(within(dataFixture.nativeElement).getByText('Item 1')).toBeTruthy();
});
```

---

## Common Pitfalls

### ❌ Cannot modify inputs after binding

```typescript
// ❌ BAD
const fixture = TestBed.createComponent(MyComponent, {
  bindings: [inputBinding('count', () => 5)],
});
fixture.componentInstance.count.set(10); // ERROR

// ✅ GOOD - Create separate e2e
it('with count 5', () => {
  const fixture = builder.withInput('count', 5).build();
});

it('with count 10', () => {
  const fixture = builder.withInput('count', 10).build();
});
```

### ❌ Don't use render() from @testing-library/angular

```typescript
// ❌ BAD
import { render } from '@testing-library/angular';
await render(MyComponent, { componentInputs: { value: 5 } });

// ✅ GOOD
TestBed.createComponent(MyComponent, {
  bindings: [inputBinding('value', () => 5)],
});
```

### ❌ Don't use fixture.detectChanges()

```typescript
// ❌ BAD
fixture.detectChanges();

// ✅ GOOD
TestBed.tick();
```

### ❌ Don't create components in beforeEach

```typescript
// ❌ BAD - Shared state
let fixture: ComponentFixture<MyComponent>;
beforeEach(() => {
  fixture = TestBed.createComponent(MyComponent);
});

// ✅ GOOD - Use builder
let builder: ComponentTestBuilder<MyComponent>;
beforeEach(() => {
  builder = new ComponentTestBuilder(MyComponent);
});
it('test', () => {
  const fixture = builder.build();
});
```

### ❌ Forgetting TestBed.tick() after signal changes

```typescript
// ❌ BAD
fixture.componentInstance.mySignal.set('new value');
expect(fixture.nativeElement.textContent).toContain('new value'); // FAILS

// ✅ GOOD
fixture.componentInstance.mySignal.set('new value');
TestBed.tick(); // Propagate signal change
expect(fixture.nativeElement.textContent).toContain('new value'); // PASSES
```

---

## Quick Reference

### Component Test Template

```typescript
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, inputBinding, outputBinding, signal } from '@angular/core';
import { within } from '@testing-library/dom';
import { describe, it, expect } from 'vitest';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  it('should work', () => {
    // Arrange
    const outputSignal = signal(false);
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(MyComponent, {
      bindings: [
        inputBinding('title', () => 'Test'),
        outputBinding('action', () => outputSignal.set(true)),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Act
    queries.getByRole('button').click();
    TestBed.tick();

    // Assert
    expect(outputSignal()).toBe(true);
  });
});
```

### Test Builder Template

```typescript
import { ComponentTestBuilder } from '@loan/shared/testing';
import { describe, it, expect, beforeEach } from 'vitest';

describe('MyComponent', () => {
  let builder: ComponentTestBuilder<MyComponent>;

  beforeEach(() => {
    builder = new ComponentTestBuilder(MyComponent).withInput('title', 'Default');
  });

  it('should work', () => {
    const fixture = builder.build();
    expect(fixture.componentInstance.title()).toBe('Default');
  });
});
```

### Service Test Template

```typescript
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { describe, it, expect } from 'vitest';
import { MyService } from './my-service';

describe('MyService', () => {
  it('should work', () => {
    const service = TestBed.configureTestingModule({
      providers: [MyService, provideZonelessChangeDetection()],
    }).inject(MyService);

    const result = service.process();

    expect(result).toBeDefined();
  });
});
```

---

## Summary

**Key Points:**

- Use `TestBed.createComponent()` with `inputBinding()` / `outputBinding()`
- Use Test Builders to reduce duplication (44% less code)
- Use `TestBed.tick()` after component creation and signal changes
- Use native events (`click()`, `dispatchEvent()`) for interactions
- Inputs are read-only after binding
- Configure in `beforeEach`, create in tests

**References:**

- `src/app/shared/testing/README.md` - Test Builder guide
- `src/app/shared/components/*/**.spec.ts` - Component test examples
