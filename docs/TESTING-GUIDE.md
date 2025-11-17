# Angular 20.1 Unit Testing Guide

> Comprehensive guide for writing unit tests using Angular 20.1's new testing API with `inputBinding()` and `outputBinding()`

---

## Table of Contents

1. [Overview](#overview)
2. [Core Principles](#core-principles)
3. [Setup and Imports](#setup-and-imports)
4. [Basic Component Test Structure](#basic-component-test-structure)
5. [Testing Inputs](#testing-inputs)
6. [Testing Outputs](#testing-outputs)
7. [Testing User Interactions](#testing-user-interactions)
8. [Testing Services](#testing-services)
9. [Common Patterns](#common-patterns)
10. [Common Pitfalls](#common-pitfalls)
11. [Quick Reference](#quick-reference)

---

## Overview

Angular 20.1 introduces a new testing API that works seamlessly with:
- Zoneless change detection
- Signal-based reactive state
- Standalone components
- TypeScript strict mode

This guide covers the migration from `@testing-library/angular`'s `render()` to Angular's native `TestBed.createComponent()` with the new binding APIs.

### Key Changes from Previous Pattern

| Old Pattern | New Pattern |
|-------------|-------------|
| `render()` from @testing-library/angular | `TestBed.createComponent()` |
| Component props in render config | `inputBinding()` from @angular/core |
| `@Output()` spy functions | `outputBinding()` with signals |
| `fixture.detectChanges()` | `TestBed.tick()` |
| `screen.getByRole()` | `within(fixture.nativeElement).getByRole()` |
| `beforeEach()` for setup | Independent tests (NO beforeEach) |

---

## Core Principles

### 1. Test Independence
Each test should be completely independent - NO shared state, NO `beforeEach()`.

```typescript
// ❌ BAD - Shared state
let fixture: ComponentFixture<MyComponent>;

beforeEach(() => {
  fixture = TestBed.createComponent(MyComponent);
});

it('test 1', () => {
  // Uses shared fixture
});

// ✅ GOOD - Independent tests
it('test 1', () => {
  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(MyComponent);
  TestBed.tick();
  // Test logic
});
```

### 2. Arrange / Act / Assert Pattern
Always structure tests with explicit comments:

```typescript
it('should update count when button clicked', async () => {
  // Arrange - Setup test data, fixtures, and mocks
  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(CounterComponent);
  TestBed.tick();
  const queries = within(fixture.nativeElement);
  const user = userEvent.setup();

  // Act - Perform the action being tested
  const button = queries.getByRole('button', { name: /increment/i });
  await user.click(button);
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

// ✅ GOOD - Create separate fixtures for different input values
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
import userEvent from '@testing-library/user-event';

// Vitest
import { describe, it, expect, vi } from 'vitest';

// Component under test
import { MyComponent } from './my-component';
```

### Common Providers

```typescript
// Basic provider setup
const defaultProviders = [
  provideZonelessChangeDetection(),
];

// With routing
const defaultProviders = [
  provideZonelessChangeDetection(),
  provideRouter([]),
];

// With mock services
const defaultProviders = [
  provideZonelessChangeDetection(),
  { provide: AuthService, useValue: mockAuthService },
  { provide: DataService, useValue: mockDataService },
];
```

---

## Basic Component Test Structure

### Simple Component Test

```typescript
describe('ButtonComponent', () => {
  const defaultProviders = [provideZonelessChangeDetection()];

  it('creates the component', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(ButtonComponent);
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders with default label', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(ButtonComponent);
    TestBed.tick();

    const queries = within(fixture.nativeElement);

    // Assert
    expect(queries.getByRole('button')).toBeTruthy();
  });
});
```

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

### Complex Object Inputs

```typescript
it('renders table with columns and data', () => {
  // Arrange
  const mockColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
  ];

  const mockData = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
  ];

  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(TableComponent, {
    bindings: [
      inputBinding('columns', () => mockColumns),
      inputBinding('data', () => mockData),
    ],
  });
  TestBed.tick();

  // Assert
  expect(fixture.nativeElement.textContent).toContain('Alice');
  expect(fixture.nativeElement.textContent).toContain('Bob');
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

### Combining Inputs and Outputs

```typescript
it('emits correct data based on input', () => {
  // Arrange
  const emittedDataSignal = signal<string | null>(null);
  const mockUser = { name: 'John Doe', id: 123 };

  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(UserCardComponent, {
    bindings: [
      inputBinding('user', () => mockUser),
      outputBinding('userAction', (id: string) => emittedDataSignal.set(id)),
    ],
  });
  TestBed.tick();

  const queries = within(fixture.nativeElement);
  const actionButton = queries.getByRole('button', { name: /action/i });

  // Act
  actionButton.click();
  TestBed.tick();

  // Assert
  expect(emittedDataSignal()).toBe('123');
});
```

---

## Testing User Interactions

### Click Events

```typescript
it('increments counter when button clicked', async () => {
  // Arrange
  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(CounterComponent);
  TestBed.tick();

  const queries = within(fixture.nativeElement);
  const user = userEvent.setup();

  // Act
  const button = queries.getByRole('button', { name: /increment/i });
  await user.click(button);
  TestBed.tick();

  // Assert
  expect(queries.getByText('Count: 1')).toBeTruthy();
});
```

### Form Input

```typescript
it('updates search results when typing', async () => {
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
  const user = userEvent.setup();
  const input = queries.getByRole('textbox');

  // Act
  await user.type(input, 'Ban');
  TestBed.tick();

  // Assert
  expect(queries.getByText('Banana')).toBeTruthy();
  expect(queries.queryByText('Apple')).toBeFalsy();
});
```

### Keyboard Events

```typescript
it('submits form on Enter key', async () => {
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
  const user = userEvent.setup();
  const input = queries.getByRole('textbox');

  // Act
  await user.type(input, 'test{Enter}');
  TestBed.tick();

  // Assert
  expect(submitSignal()).toBe(true);
});
```

### Checkbox and Radio Interactions

```typescript
it('toggles checkbox selection', async () => {
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
  const user = userEvent.setup();
  const checkbox = queries.getByRole('checkbox');

  // Act
  await user.click(checkbox);
  TestBed.tick();

  // Assert
  expect(selectionSignal()).toBe(true);
});
```

### Hover and Focus Events

```typescript
it('shows tooltip on hover', async () => {
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
  const user = userEvent.setup();
  const element = queries.getByText('Hover me');

  // Act
  await user.hover(element);
  TestBed.tick();

  // Assert
  expect(queries.getByText('Tooltip text')).toBeTruthy();
});
```

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
  const defaultProviders = [
    provideZonelessChangeDetection(),
    provideRouter([]),
  ];

  it('navigates to dashboard on click', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
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
    hostAttributes: { 'data-testid': 'login-form' },
  });
  TestBed.tick();

  // Assert
  expect(fixture.nativeElement.getAttribute('data-testid')).toBe('login-form');
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

### ❌ Pitfall 4: Using Shared State with beforeEach

```typescript
// ❌ BAD - Shared state can cause test pollution
describe('MyComponent', () => {
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyComponent);
  });

  it('test 1', () => {
    // Modifies shared fixture
  });

  it('test 2', () => {
    // Uses modified fixture from test 1
  });
});

// ✅ GOOD - Each test is independent
describe('MyComponent', () => {
  it('test 1', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(MyComponent);
    TestBed.tick();
    // Test logic
  });

  it('test 2', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(MyComponent);
    TestBed.tick();
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
      provideRouter([]), // Add this
    ],
  }).createComponent(NavComponent);
  TestBed.tick();
});
```

### ❌ Pitfall 6: Not Using async/await with userEvent

```typescript
// ❌ BAD - Missing await
it('clicks button', () => {
  const user = userEvent.setup();
  const button = within(fixture.nativeElement).getByRole('button');
  user.click(button); // Missing await
  TestBed.tick();
});

// ✅ GOOD - Use async/await
it('clicks button', async () => {
  const user = userEvent.setup();
  const button = within(fixture.nativeElement).getByRole('button');
  await user.click(button); // Proper async handling
  TestBed.tick();
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
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

import { MyComponent } from './my-component';

describe('MyComponent', () => {
  const defaultProviders = [provideZonelessChangeDetection()];

  it('should create', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(MyComponent);
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display input value', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
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

  it('should emit output on interaction', async () => {
    // Arrange
    const emittedSignal = signal(false);
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(MyComponent, {
      bindings: [
        outputBinding('action', () => emittedSignal.set(true)),
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
    expect(emittedSignal()).toBe(true);
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

- **Always use TestBed.createComponent()** instead of render()
- **Use inputBinding() and outputBinding()** from @angular/core
- **Capture outputs with signals** for type-safe testing
- **Keep tests independent** - no beforeEach, no shared state
- **Follow Arrange/Act/Assert pattern** with explicit comments
- **Use TestBed.tick()** instead of fixture.detectChanges()
- **Remember inputs are read-only** after binding

For more examples, refer to the test files in:
- `src/app/layout/*/**.spec.ts` - Layout component tests
- `src/app/shared/ui/*/**.spec.ts` - UI component tests

Happy testing! 🚀
