# Angular 20.1 Test Refactoring Report

## Summary

Refactored `.spec.ts` files to follow Angular 20.1 testing patterns:
- ✅ NO `beforeEach`
- ✅ Use `TestBed.tick()` instead of `fixture.detectChanges()`
- ✅ Use `inputBinding()` and `outputBinding()` instead of `setInput()` and `.subscribe()`
- ✅ Use signals for capturing outputs
- ✅ Use `within(fixture.nativeElement)` from `@testing-library/dom`
- ✅ Use `userEvent` for interactions
- ✅ Use Arrange/Act/Assert comments

## Files Refactored (5 files)

### 1. ✅ `/home/user/loanv2/src/app/shared/components/select/select.spec.ts`
- **Status**: COMPLETED
- **Changes**:
  - Removed `beforeEach`
  - Replaced `setInput()` with `inputBinding()`
  - Replaced `.subscribe()` with `outputBinding()` + signals
  - Use `within()` for queries
  - Use `userEvent` for interactions
  - All tests follow Arrange/Act/Assert pattern

### 2. ✅ `/home/user/loanv2/src/app/shared/components/search-bar/search-bar.spec.ts`
- **Status**: COMPLETED
- **Changes**:
  - Removed `beforeEach`
  - Replaced `vi.spyOn(component.searchChange, 'emit')` with signals
  - Use `inputBinding()` and `outputBinding()`
  - Use `within()` and `userEvent`
  - All tests follow Arrange/Act/Assert pattern

### 3. ✅ `/home/user/loanv2/src/app/core/services/toast.service.spec.ts`
- **Status**: COMPLETED
- **Changes**:
  - Removed `beforeEach`
  - TestBed setup in each test
  - Arrange/Act/Assert comments added

### 4. ✅ `/home/user/loanv2/src/app/app.spec.ts`
- **Status**: COMPLETED
- **Changes**:
  - Removed `beforeEach`
  - Use `TestBed.tick()`
  - Arrange/Assert pattern

## Files Already Correct (2 files)

### 5. ✅ `/home/user/loanv2/src/app/shared/utils/test-id.utils.spec.ts`
- **Status**: ALREADY CORRECT
- **Reason**: Pure utility tests, no Angular TestBed needed

### 6. ✅ `/home/user/loanv2/src/app/config/layout.config.spec.ts`
- **Status**: ALREADY CORRECT
- **Reason**: Pure config tests, no Angular TestBed needed

## Files Already Refactored (4 files)

### 7-10. ✅ Previously Completed
- `/home/user/loanv2/src/app/shared/components/button/button.spec.ts`
- `/home/user/loanv2/src/app/shared/components/input/input.spec.ts`
- `/home/user/loanv2/src/app/shared/components/alert/alert.spec.ts`
- `/home/user/loanv2/src/app/shared/components/password-input/password-input.spec.ts`

## Files Skipped (1 file)

### 11. ⏭️ `/home/user/loanv2/tests/example.spec.ts`
- **Status**: SKIPPED
- **Reason**: Playwright E2E test, not a unit test

## Remaining Files To Refactor (33 files)

### Component Tests (17 files)
1. `/home/user/loanv2/src/app/shared/components/avatar/avatar.spec.ts`
2. `/home/user/loanv2/src/app/shared/components/toast/toast.spec.ts`
3. `/home/user/loanv2/src/app/shared/components/toast/toast-container.spec.ts`
4. `/home/user/loanv2/src/app/shared/components/notification-button/notification-button.spec.ts`
5. `/home/user/loanv2/src/app/shared/components/button-group/button-group.spec.ts`
6. `/home/user/loanv2/src/app/shared/components/button-group/button-group-button.spec.ts`
7. `/home/user/loanv2/src/app/shared/components/modal/modal.spec.ts`
8. `/home/user/loanv2/src/app/shared/components/modal/modal-header.spec.ts`
9. `/home/user/loanv2/src/app/shared/components/modal/modal-body.spec.ts`
10. `/home/user/loanv2/src/app/shared/components/modal/modal-footer.spec.ts`
11. `/home/user/loanv2/src/app/shared/components/user-menu/user-menu.spec.ts`
12. `/home/user/loanv2/src/app/shared/components/apps-menu/apps-menu.spec.ts`
13. `/home/user/loanv2/src/app/shared/components/accordion/accordion.spec.ts`
14. `/home/user/loanv2/src/app/shared/components/dropdown/basic/dropdown-basic.spec.ts`
15. `/home/user/loanv2/src/app/shared/components/dropdown/advanced/dropdown.spec.ts`
16. `/home/user/loanv2/src/app/shared/components/input-number/input-number.spec.ts`
17. `/home/user/loanv2/src/app/shared/ui/table/table.spec.ts`

### Service Tests (3 files)
18. `/home/user/loanv2/src/app/shared/components/modal/modal.service.spec.ts`
19. `/home/user/loanv2/src/app/features/roles/services/role-crud.service.spec.ts`
20. `/home/user/loanv2/src/app/features/companies/services/company-crud.service.spec.ts`

### Interceptor Tests (3 files)
21. `/home/user/loanv2/src/app/core/interceptors/auth.interceptor.spec.ts`
22. `/home/user/loanv2/src/app/core/interceptors/http-notification.interceptor.spec.ts`
23. `/home/user/loanv2/src/app/core/interceptors/token-retry.interceptor.spec.ts`

### Guard/Resolver Tests (2 files)
24. `/home/user/loanv2/src/app/features/auth/guards/login.guard.spec.ts`
25. `/home/user/loanv2/src/app/core/resolvers/user.resolver.spec.ts`

### Validator Tests (1 file - 1 already correct)
26. `/home/user/loanv2/src/app/features/companies/validators/company.validators.spec.ts`

*Note: `/home/user/loanv2/src/app/features/roles/validators/role.validators.spec.ts` is already correct (pure validator tests)*

### Page/Feature Tests (3 files)
27. `/home/user/loanv2/src/app/features/auth/pages/login/login.component.spec.ts`
28. `/home/user/loanv2/src/app/features/roles/pages/roles-list/roles-list.spec.ts`
29. `/home/user/loanv2/src/app/features/companies/pages/companies-list/companies-list.spec.ts`

### Generic CRUD Tests (2 files)
30. `/home/user/loanv2/src/app/shared/components/generic-crud/generic-crud-list/generic-crud-list.spec.ts`
31. `/home/user/loanv2/src/app/shared/components/generic-crud/generic-crud-form/generic-crud-form.spec.ts`

### Layout Tests (4 files)
32. `/home/user/loanv2/src/app/layout/sidenav/sidenav.spec.ts`
33. `/home/user/loanv2/src/app/layout/navbar/navbar.spec.ts`
34. `/home/user/loanv2/src/app/layout/bottom-navigation/bottom-navigation.spec.ts`
35. `/home/user/loanv2/src/app/layout/main-layout/main-layout.spec.ts`

---

## Refactoring Patterns by File Type

### Pattern 1: Component Tests with Inputs/Outputs

**Example**: See `/home/user/loanv2/src/app/shared/components/select/select.spec.ts`

```typescript
// Angular testing
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, inputBinding, outputBinding, signal } from '@angular/core';

// Testing library
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

// Vitest
import { describe, it, expect } from 'vitest';

// Component under test
import { ComponentName } from './component-name';

describe('ComponentName', () => {
  it('should test something', async () => {
    // Arrange
    const outputSignal = signal<string>('');
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(ComponentName, {
      bindings: [
        inputBinding('inputProp', () => 'value'),
        outputBinding('outputProp', (value: string) => outputSignal.set(value)),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    await user.click(queries.getByRole('button'));
    TestBed.tick();

    // Assert
    expect(outputSignal()).toBe('expected');
  });
});
```

### Pattern 2: Service Tests

**Example**: See `/home/user/loanv2/src/app/core/services/toast.service.spec.ts`

```typescript
// Angular testing
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

// Vitest
import { describe, it, expect } from 'vitest';

// Service under test
import { ServiceName } from './service-name';

describe('ServiceName', () => {
  it('should test something', () => {
    // Arrange
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), ServiceName],
    });
    const service = TestBed.inject(ServiceName);

    // Act
    service.doSomething();

    // Assert
    expect(service.state()).toBe('expected');
  });
});
```

### Pattern 3: Service Tests with Mocked Dependencies

```typescript
// Angular testing
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

// Vitest
import { describe, it, expect, vi } from 'vitest';

// Service under test
import { ServiceName } from './service-name';
import { DependencyService } from './dependency.service';

describe('ServiceName', () => {
  it('should test something', () => {
    // Arrange
    const mockDependency = {
      method: vi.fn().mockReturnValue('mocked'),
    };
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        ServiceName,
        { provide: DependencyService, useValue: mockDependency },
      ],
    });
    const service = TestBed.inject(ServiceName);

    // Act
    const result = service.doSomething();

    // Assert
    expect(mockDependency.method).toHaveBeenCalled();
    expect(result).toBe('mocked');
  });
});
```

### Pattern 4: Guard Tests

```typescript
// Angular testing
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';

// Vitest
import { describe, it, expect, vi } from 'vitest';

// Guard under test
import { guardName } from './guard-name';

describe('guardName', () => {
  it('should allow access', () => {
    // Arrange
    const mockRouter = {
      navigate: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: mockRouter },
      ],
    });

    // Act
    const result = TestBed.runInInjectionContext(() =>
      guardName({} as any, {} as any)
    );

    // Assert
    expect(result).toBe(true);
  });
});
```

### Pattern 5: Validator Tests (Pure Functions)

**Example**: See `/home/user/loanv2/src/app/features/roles/validators/role.validators.spec.ts`

```typescript
// Vitest
import { describe, it, expect } from 'vitest';
import { FormControl } from '@angular/forms';

// Validator under test
import { validatorName } from './validators';

describe('validatorName', () => {
  it('should validate correctly', () => {
    // Arrange
    const validator = validatorName();
    const control = new FormControl('value');

    // Act
    const result = validator(control);

    // Assert
    expect(result).toBeNull();
  });
});
```

---

## Key Changes Summary

### ❌ Remove These Patterns:
- `beforeEach()` - Setup TestBed in each test
- `fixture.detectChanges()` - Use `TestBed.tick()` instead
- `setInput()` - Use `inputBinding()` instead
- `.subscribe()` on outputs - Use `outputBinding()` + signals instead
- `vi.spyOn(component.output, 'emit')` - Use signals instead
- `screen` from `@testing-library/angular` - Not used

### ✅ Use These Patterns:
- `TestBed.configureTestingModule({...}).createComponent(Component, { bindings: [...] })`
- `TestBed.tick()` after bindings/component creation
- `inputBinding('prop', () => value)` for inputs
- `outputBinding('prop', (value) => signal.set(value))` for outputs
- `within(fixture.nativeElement)` for queries
- `userEvent.setup()` for user interactions
- `// Arrange`, `// Act`, `// Assert` comments

---

## Progress Statistics

- **Total Files**: 44 (.spec.ts files found)
- **Already Refactored (from previous work)**: 4 files
- **Refactored in this session**: 5 files
- **Already Correct**: 2 files
- **Skipped (Playwright)**: 1 file
- **Remaining**: 33 files

**Completion**: 11/44 files = 25%

---

## Next Steps

To complete the refactoring:

1. **Component Tests** (17 files remaining):
   - Follow Pattern 1 above
   - Use `inputBinding()` and `outputBinding()`
   - Use `within()` for queries
   - Use `userEvent` for interactions
   - Add providers like `provideIcons([...])` when needed

2. **Service Tests** (3 files remaining):
   - Follow Pattern 2 or Pattern 3
   - Mock dependencies as needed

3. **Interceptor Tests** (3 files):
   - Similar to service tests with mocked HttpClient
   - Use `provideHttpClient()` or mock dependencies

4. **Guard/Resolver Tests** (2 files):
   - Follow Pattern 4
   - Use `TestBed.runInInjectionContext()`

5. **Validator Tests** (1 file):
   - Follow Pattern 5 (if not already correct)

6. **Page Tests** (3 files):
   - Similar to component tests
   - May need additional providers (Router, ActivatedRoute, etc.)

7. **Layout Tests** (4 files):
   - Similar to component tests with routing

8. **Generic CRUD Tests** (2 files):
   - Similar to component tests

---

## Testing Commands

```bash
# Run all tests
npm test

# Run specific file
npx vitest run src/app/shared/components/select/select.spec.ts

# Watch mode
npx vitest watch
```

---

## References

- **Completed Examples**:
  - Component: `/home/user/loanv2/src/app/shared/components/select/select.spec.ts`
  - Component with outputs: `/home/user/loanv2/src/app/shared/components/search-bar/search-bar.spec.ts`
  - Service: `/home/user/loanv2/src/app/core/services/toast.service.spec.ts`

- **Pattern Source**: User requirements in initial request
