# Angular 20.1 Unit Testing Guide

> Comprehensive guide for writing unit tests using Angular 20.1's new testing API with `inputBinding()` and `outputBinding()`

---

## Table of Contents

1. [Overview](#overview)
2. [Core Principles](#core-principles)
3. [Setup and Imports](#setup-and-imports)
4. [Basic Component Test Structure](#basic-component-test-structure)
5. [Test Builders (Recommended)](#test-builders-recommended)
6. [Testing Inputs](#testing-inputs)
7. [Testing Outputs](#testing-outputs)
8. [Testing User Interactions](#testing-user-interactions)
9. [Testing Services](#testing-services)
10. [Common Patterns](#common-patterns)
11. [Common Pitfalls](#common-pitfalls)
12. [Quick Reference](#quick-reference)

---

## Overview

Angular 20.1 introduces a new testing API that works seamlessly with:
- Zoneless change detection
- Signal-based reactive state
- Standalone components
- TypeScript strict mode

### Key Changes from Previous Pattern

| Old Pattern | New Pattern |
|-------------|-------------|
| `render()` from @testing-library/angular | `TestBed.createComponent()` |
| Component props in render config | `inputBinding()` from @angular/core |
| `@Output()` spy functions | `outputBinding()` with signals |
| `fixture.detectChanges()` | `TestBed.tick()` |
| `screen.getByRole()` | `within(fixture.nativeElement).getByRole()` |
| `beforeEach()` for component creation | Test builders for setup reuse |

---

## Core Principles

### 1. Test Independence

Each test should be completely independent. Use **Test Builders** for shared configuration, but create components in each test.

```typescript
// ❌ BAD - Shared component state
let fixture: ComponentFixture<MyComponent>;

beforeEach(() => {
  fixture = TestBed.createComponent(MyComponent);
});

// ✅ GOOD - Test builder for configuration
let builder: MyComponentTestBuilder;

beforeEach(() => {
  builder = new MyComponentTestBuilder()
    .withDefaults();
});

it('test', () => {
  const fixture = builder.build(); // Creates component in each test
});
```

### 2. Arrange / Act / Assert Pattern

Always structure tests with explicit comments:

```typescript
it('should update count when button clicked', () => {
  // Arrange - Setup test data, fixtures, and mocks
  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(CounterComponent);
  TestBed.tick();
  const queries = within(fixture.nativeElement);

  // Act - Perform the action being tested
  const button = queries.getByRole('button', { name: /increment/i });
  button.click();
  TestBed.tick();

  // Assert - Verify the expected outcome
  expect(queries.getByText('Count: 1')).toBeTruthy();
});
```

### 3. Input Immutability

Inputs bound with `inputBinding()` are **read-only** and cannot be modified after binding.

```typescript
// ❌ BAD - Cannot modify inputs
const fixture = TestBed.createComponent(MyComponent, {
  bindings: [inputBinding('value', () => 5)],
});
fixture.componentInstance.value.set(10); // ERROR: .set is not a function

// ✅ GOOD - Create separate fixtures for different values
it('works with value 5', () => {
  const fixture = TestBed.createComponent(MyComponent, {
    bindings: [inputBinding('value', () => 5)],
  });
  // Test with value 5
});

it('works with value 10', () => {
  const fixture = TestBed.createComponent(MyComponent, {
    bindings: [inputBinding('value', () => 10)],
  });
  // Test with value 10
});
```

---

## Setup and Imports

### Required Imports

```typescript
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

// Vitest
import { describe, it, expect, vi } from 'vitest';

// Component under test
import { MyComponent } from './my-component';
```

---

## Basic Component Test Structure

### Simple Component Test

```typescript
describe('ButtonComponent', () => {
  it('creates the component', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(ButtonComponent);
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders with default label', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(ButtonComponent);
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    expect(queries.getByRole('button')).toBeTruthy();
  });
});
```

---

## Test Builders (Recommended)

Use **Test Builders** to reduce code duplication while maintaining test independence.

### Using ComponentTestBuilder

```typescript
import { ComponentTestBuilder } from '@loan/shared/testing';

describe('MyComponent', () => {
  let builder: ComponentTestBuilder<MyComponent>;

  beforeEach(() => {
    builder = new ComponentTestBuilder(MyComponent)
      .withInput('title', 'Default Title')
      .withInput('enabled', true);
  });

  it('should display default title', () => {
    // Arrange
    const fixture = builder.build(); // Auto-clones + creates component
    const queries = within(fixture.nativeElement);

    // Assert
    expect(queries.getByText('Default Title')).toBeTruthy();
  });

  it('should override title', () => {
    // Arrange
    const fixture = builder
      .withInput('title', 'Custom Title')
      .build();
    const queries = within(fixture.nativeElement);

    // Assert
    expect(queries.getByText('Custom Title')).toBeTruthy();
  });
});
```

### Using Specialized Builders

For frequently tested components, use specialized builders:

```typescript
import { AlertTestBuilder } from '@loan/shared/testing';

describe('Alert', () => {
  let builder: AlertTestBuilder;

  beforeEach(() => {
    builder = new AlertTestBuilder()
      .withMessage('Default message')
      .asDismissible();
  });

  it('should render info variant', () => {
    // Arrange
    const fixture = builder.withInfoVariant().build();
    const queries = within(fixture.nativeElement);

    // Assert
    const alertEl = queries.getByRole('alert');
    expect(alertEl.className).toContain('bg-accent/10');
  });

  it('should render success variant', () => {
    // Arrange
    const fixture = builder.withSuccessVariant().build();
    const queries = within(fixture.nativeElement);

    // Assert
    const alertEl = queries.getByRole('alert');
    expect(alertEl.className).toContain('bg-success/10');
  });

  it('should emit dismissed event', () => {
    // Arrange
    const fixture = builder.build();
    const dismissedSignal = builder.getDismissedSignal();
    const queries = within(fixture.nativeElement);

    // Act
    const closeButton = queries.getByRole('button', { name: /close/i });
    closeButton.click();
    TestBed.tick();

    // Assert
    expect(dismissedSignal()).toBeUndefined();
  });
});
```

**Benefits:**
- 44% less code in tests
- Guaranteed test independence (auto-clone)
- Type-safe configuration
- Better readability

**See:** `src/app/shared/testing/README.md` for complete guide

---

## Testing Inputs

### Single Input

```typescript
it('displays custom label', () => {
  // Arrange
  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(ButtonComponent, {
    bindings: [
      inputBinding('label', () => 'Custom Label'),
    ],
  });
  TestBed.tick();
  const queries = within(fixture.nativeElement);

  // Assert
  expect(queries.getByText('Custom Label')).toBeTruthy();
});
```

### Multiple Inputs

```typescript
it('displays user profile with all fields', () => {
  // Arrange
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
  };

  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(UserProfileComponent, {
    bindings: [
      inputBinding('user', () => mockUser),
      inputBinding('showEmail', () => true),
      inputBinding('editable', () => false),
    ],
  });
  TestBed.tick();
  const queries = within(fixture.nativeElement);

  // Assert
  expect(queries.getByText('John Doe')).toBeTruthy();
  expect(queries.getByText('john@example.com')).toBeTruthy();
  expect(queries.getByText('admin')).toBeTruthy();
});
```

---

## Testing Outputs

### Basic Output Test

```typescript
it('emits click event', () => {
  // Arrange
  const clickedSignal = signal(false);

  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(ButtonComponent, {
    bindings: [
      outputBinding('clicked', () => clickedSignal.set(true)),
    ],
  });
  TestBed.tick();
  const button = fixture.nativeElement.querySelector('button');

  // Act
  button.click();
  TestBed.tick();

  // Assert
  expect(clickedSignal()).toBe(true);
});
```

### Output with Emitted Value

```typescript
it('emits selected item when clicked', () => {
  // Arrange
  const selectedItemSignal = signal<Item | null>(null);
  const mockItems = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ];

  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(ItemListComponent, {
    bindings: [
      inputBinding('items', () => mockItems),
      outputBinding('itemSelected', (item: Item) => selectedItemSignal.set(item)),
    ],
  });
  TestBed.tick();
  const queries = within(fixture.nativeElement);
  const firstItem = queries.getByText('Item 1');

  // Act
  firstItem.click();
  TestBed.tick();

  // Assert
  expect(selectedItemSignal()).toEqual(mockItems[0]);
});
```

### Testing Multiple Emissions

```typescript
it('emits multiple times for multiple clicks', () => {
  // Arrange
  let clickCount = 0;

  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(ButtonComponent, {
    bindings: [
      outputBinding('clicked', () => clickCount++),
    ],
  });
  TestBed.tick();
  const button = fixture.nativeElement.querySelector('button');

  // Act
  button.click();
  button.click();
  button.click();
  TestBed.tick();

  // Assert
  expect(clickCount).toBe(3);
});
```

---

## Testing User Interactions

### Click Events

```typescript
it('increments counter when button clicked', () => {
  // Arrange
  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(CounterComponent);
  TestBed.tick();
  const queries = within(fixture.nativeElement);

  // Act
  const button = queries.getByRole('button', { name: /increment/i });
  button.click();
  TestBed.tick();

  // Assert
  expect(queries.getByText('Count: 1')).toBeTruthy();
});
```

### Form Input (Simple)

```typescript
it('updates search results when typing', () => {
  // Arrange
  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(SearchComponent, {
    bindings: [
      inputBinding('items', () => ['Apple', 'Banana', 'Cherry']),
    ],
  });
  TestBed.tick();
  const queries = within(fixture.nativeElement);
  const input = queries.getByRole('textbox') as HTMLInputElement;

  // Act
  input.value = 'Ban';
  input.dispatchEvent(new Event('input'));
  TestBed.tick();

  // Assert
  expect(queries.getByText('Banana')).toBeTruthy();
  expect(queries.queryByText('Apple')).toBeFalsy();
});
```

### Keyboard Events

```typescript
it('submits form on Enter key', () => {
  // Arrange
  const submitSignal = signal(false);
  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(FormComponent, {
    bindings: [
      outputBinding('formSubmit', () => submitSignal.set(true)),
    ],
  });
  TestBed.tick();
  const queries = within(fixture.nativeElement);
  const input = queries.getByRole('textbox');

  // Act
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  TestBed.tick();

  // Assert
  expect(submitSignal()).toBe(true);
});
```

### Checkbox Interactions

```typescript
it('toggles checkbox selection', () => {
  // Arrange
  const selectionSignal = signal(false);
  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(CheckboxComponent, {
    bindings: [
      outputBinding('selectionChange', (value: boolean) => selectionSignal.set(value)),
    ],
  });
  TestBed.tick();
  const queries = within(fixture.nativeElement);
  const checkbox = queries.getByRole('checkbox') as HTMLInputElement;

  // Act
  checkbox.click();
  TestBed.tick();

  // Assert
  expect(selectionSignal()).toBe(true);
});
```

### Hover and Focus Events

```typescript
it('shows tooltip on hover', () => {
  // Arrange
  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(TooltipComponent, {
    bindings: [
      inputBinding('text', () => 'Hover me'),
      inputBinding('tooltip', () => 'Tooltip text'),
    ],
  });
  TestBed.tick();
  const queries = within(fixture.nativeElement);
  const element = queries.getByText('Hover me');

  // Act
  element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  TestBed.tick();

  // Assert
  expect(queries.getByText('Tooltip text')).toBeTruthy();
});
```

### Complex Interactions

For complex user interactions like **drag and drop**, **text selection**, or **complex keyboard sequences**, consider using `@testing-library/user-event`.

**See:** [Testing Library User Event Documentation](https://testing-library.com/docs/user-event/intro)

---

## Testing Services

### Basic Service Test

```typescript
describe('DataService', () => {
  it('fetches data successfully', () => {
    // Arrange
    const service = TestBed.configureTestingModule({
      providers: [
        DataService,
        provideZonelessChangeDetection(),
      ],
    }).inject(DataService);

    // Act
    const result = service.getData();

    // Assert
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });
});
```

### Service with HTTP

```typescript
describe('ApiService', () => {
  it('fetches users from API', (done) => {
    // Arrange
    const mockUsers = [{ id: 1, name: 'John' }];
    const service = TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ],
    }).inject(ApiService);

    const httpTesting = TestBed.inject(HttpTestingController);

    // Act
    service.getUsers().subscribe((users) => {
      // Assert
      expect(users).toEqual(mockUsers);
      done();
    });

    const req = httpTesting.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
```

### Service with Mocked Dependencies

```typescript
describe('UserService', () => {
  it('creates user with auth token', () => {
    // Arrange
    const mockAuthService = {
      getToken: vi.fn().mockReturnValue('mock-token'),
    };

    const service = TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: AuthService, useValue: mockAuthService },
        provideZonelessChangeDetection(),
      ],
    }).inject(UserService);

    // Act
    service.createUser({ name: 'John' });

    // Assert
    expect(mockAuthService.getToken).toHaveBeenCalled();
  });
});
```

---

## Common Patterns

### Pattern 1: Testing Component with Router

```typescript
describe('NavigationComponent', () => {
  it('navigates to dashboard on click', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
      ],
    }).createComponent(NavigationComponent);
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const dashboardLink = queries.getByRole('link', { name: /dashboard/i });

    // Assert
    expect(dashboardLink.getAttribute('href')).toContain('/dashboard');
  });
});
```

### Pattern 2: Testing Conditional Rendering

```typescript
it('shows loading state when loading', () => {
  // Arrange
  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(DataComponent, {
    bindings: [
      inputBinding('isLoading', () => true),
    ],
  });
  TestBed.tick();
  const queries = within(fixture.nativeElement);

  // Assert
  expect(queries.getByText(/loading/i)).toBeTruthy();
});

it('shows data when not loading', () => {
  // Arrange
  const mockData = [{ id: 1, name: 'Item 1' }];
  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(DataComponent, {
    bindings: [
      inputBinding('isLoading', () => false),
      inputBinding('data', () => mockData),
    ],
  });
  TestBed.tick();
  const queries = within(fixture.nativeElement);

  // Assert
  expect(queries.getByText('Item 1')).toBeTruthy();
});
```

### Pattern 3: Testing Lists with @for

```typescript
it('renders all items in list', () => {
  // Arrange
  const mockItems = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ];

  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(ListComponent, {
    bindings: [
      inputBinding('items', () => mockItems),
    ],
  });
  TestBed.tick();
  const items = fixture.nativeElement.querySelectorAll('.list-item');

  // Assert
  expect(items.length).toBe(3);
  expect(items[0].textContent).toContain('Item 1');
  expect(items[1].textContent).toContain('Item 2');
  expect(items[2].textContent).toContain('Item 3');
});
```

### Pattern 4: Testing Accessibility

```typescript
it('has proper ARIA attributes', () => {
  // Arrange
  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(DialogComponent, {
    bindings: [
      inputBinding('title', () => 'Confirm Action'),
      inputBinding('isOpen', () => true),
    ],
  });
  TestBed.tick();
  const dialog = fixture.nativeElement.querySelector('[role="dialog"]');

  // Assert
  expect(dialog).toBeTruthy();
  expect(dialog?.getAttribute('aria-label')).toBe('Confirm Action');
  expect(dialog?.getAttribute('aria-modal')).toBe('true');
});
```

### Pattern 5: Testing data-testid Attributes

```typescript
it('generates correct test IDs', () => {
  // Arrange
  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(FormComponent, {
    bindings: [
      inputBinding('dataTestId', () => 'login-form'),
    ],
  });
  TestBed.tick();

  // Assert
  expect(fixture.nativeElement.querySelector('[data-testid="login-form"]')).toBeTruthy();
  expect(fixture.nativeElement.querySelector('[data-testid="login-form-input"]')).toBeTruthy();
  expect(fixture.nativeElement.querySelector('[data-testid="login-form-button"]')).toBeTruthy();
});
```

---

## Common Pitfalls

### ❌ Pitfall 1: Trying to Modify Inputs After Binding

```typescript
// ❌ BAD - This will throw an error
it('updates when input changes', () => {
  const fixture = TestBed.createComponent(MyComponent, {
    bindings: [inputBinding('count', () => 5)],
  });

  fixture.componentInstance.count.set(10); // ERROR: .set is not a function
});

// ✅ GOOD - Create separate tests
it('displays count of 5', () => {
  const fixture = TestBed.createComponent(MyComponent, {
    bindings: [inputBinding('count', () => 5)],
  });
  expect(fixture.componentInstance.count()).toBe(5);
});

it('displays count of 10', () => {
  const fixture = TestBed.createComponent(MyComponent, {
    bindings: [inputBinding('count', () => 10)],
  });
  expect(fixture.componentInstance.count()).toBe(10);
});
```

### ❌ Pitfall 2: Using render() from @testing-library/angular

```typescript
// ❌ BAD - Don't use render()
import { render } from '@testing-library/angular';

it('test', async () => {
  await render(MyComponent, {
    componentInputs: { value: 5 },
  });
});

// ✅ GOOD - Use TestBed.createComponent()
it('test', () => {
  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(MyComponent, {
    bindings: [inputBinding('value', () => 5)],
  });
  TestBed.tick();
});
```

### ❌ Pitfall 3: Using fixture.detectChanges()

```typescript
// ❌ BAD - Don't use fixture.detectChanges()
it('test', () => {
  const fixture = TestBed.createComponent(MyComponent);
  fixture.detectChanges(); // Old API
});

// ✅ GOOD - Use TestBed.tick()
it('test', () => {
  const fixture = TestBed.createComponent(MyComponent);
  TestBed.tick(); // New API for zoneless
});
```

### ❌ Pitfall 4: Creating Components in beforeEach

```typescript
// ❌ BAD - Shared component state can cause test pollution
describe('MyComponent', () => {
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyComponent);
  });

  it('test 1', () => {
    // Uses shared fixture
  });
});

// ✅ GOOD - Use test builder for configuration
describe('MyComponent', () => {
  let builder: ComponentTestBuilder<MyComponent>;

  beforeEach(() => {
    builder = new ComponentTestBuilder(MyComponent)
      .withInput('title', 'Default');
  });

  it('test 1', () => {
    const fixture = builder.build(); // Creates component in test
    // Test logic
  });
});
```

### ❌ Pitfall 5: Forgetting provideRouter for Routing Components

```typescript
// ❌ BAD - Missing router provider
it('test navigation', () => {
  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(NavComponent);
  // Will throw routing errors
});

// ✅ GOOD - Include provideRouter
it('test navigation', () => {
  const fixture = TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      provideRouter([]),
    ],
  }).createComponent(NavComponent);
  TestBed.tick();
});
```

### ❌ Pitfall 6: Forgetting TestBed.tick() After Signal Changes

```typescript
// ❌ BAD - Signal change won't propagate
it('updates on signal change', () => {
  const fixture = TestBed.createComponent(MyComponent);
  TestBed.tick();

  fixture.componentInstance.mySignal.set('new value');
  // Missing TestBed.tick()!

  expect(fixture.nativeElement.textContent).toContain('new value'); // FAILS
});

// ✅ GOOD - Call TestBed.tick() after signal changes
it('updates on signal change', () => {
  const fixture = TestBed.createComponent(MyComponent);
  TestBed.tick();

  fixture.componentInstance.mySignal.set('new value');
  TestBed.tick(); // Propagate signal change

  expect(fixture.nativeElement.textContent).toContain('new value'); // PASSES
});
```

---

## Quick Reference

### Component Test Template

```typescript
import { TestBed } from '@angular/core/testing';
import {
  provideZonelessChangeDetection,
  inputBinding,
  outputBinding,
  signal,
} from '@angular/core';
import { within } from '@testing-library/dom';
import { describe, it, expect } from 'vitest';

import { MyComponent } from './my-component';

describe('MyComponent', () => {
  it('should create', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(MyComponent);
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display input value', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(MyComponent, {
      bindings: [
        inputBinding('title', () => 'Test Title'),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    expect(queries.getByText('Test Title')).toBeTruthy();
  });

  it('should emit output on interaction', () => {
    // Arrange
    const emittedSignal = signal(false);
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(MyComponent, {
      bindings: [
        outputBinding('action', () => emittedSignal.set(true)),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Act
    const button = queries.getByRole('button');
    button.click();
    TestBed.tick();

    // Assert
    expect(emittedSignal()).toBe(true);
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
    builder = new ComponentTestBuilder(MyComponent)
      .withInput('title', 'Default Title');
  });

  it('should use defaults', () => {
    const fixture = builder.build();
    expect(fixture.componentInstance.title()).toBe('Default Title');
  });

  it('should override defaults', () => {
    const fixture = builder
      .withInput('title', 'Custom')
      .build();
    expect(fixture.componentInstance.title()).toBe('Custom');
  });
});
```

### Service Test Template

```typescript
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { describe, it, expect, vi } from 'vitest';

import { MyService } from './my-service';

describe('MyService', () => {
  it('should be created', () => {
    // Arrange
    const service = TestBed.configureTestingModule({
      providers: [
        MyService,
        provideZonelessChangeDetection(),
      ],
    }).inject(MyService);

    // Assert
    expect(service).toBeDefined();
  });

  it('should process data', () => {
    // Arrange
    const service = TestBed.configureTestingModule({
      providers: [
        MyService,
        provideZonelessChangeDetection(),
      ],
    }).inject(MyService);

    // Act
    const result = service.processData({ value: 5 });

    // Assert
    expect(result).toEqual({ processed: true, value: 5 });
  });
});
```

---

## Conclusion

This guide covers the essential patterns for writing unit tests with Angular 20.1's new testing API. Remember:

- **Use Test Builders** to reduce duplication (see `src/app/shared/testing/README.md`)
- **Use TestBed.createComponent()** instead of render()
- **Use inputBinding() and outputBinding()** from @angular/core
- **Capture outputs with signals** for type-safe testing
- **Configure in beforeEach, create in tests** - no shared component state
- **Follow Arrange/Act/Assert pattern** with explicit comments
- **Use TestBed.tick()** instead of fixture.detectChanges()
- **Remember inputs are read-only** after binding
- **Use native events** (click(), dispatchEvent()) for most interactions

For examples, refer to the test files in:
- `src/app/shared/components/*/**.spec.ts` - Component tests
- `src/app/shared/testing/README.md` - Test Builder guide

Happy testing! 🚀
