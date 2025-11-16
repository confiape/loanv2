# Data Test IDs Reference

> Standardized `data-testid` attributes for Playwright e2e testing

## Overview

All components support an optional `dataTestId` input that acts as a **prefix** for internal elements:

```html
<app-input [dataTestId]="'email'" />
<!-- Generates: email (input), email-wrapper, email-label, etc. -->
```

**Key Rules:**
- If no `dataTestId` is provided, no test IDs are rendered
- The main interactive element receives `{dataTestId}` directly
- Helper elements receive `{dataTestId}-{suffix}`
- Dynamic items use `{dataTestId}-{type}-{sanitized-value}`

## Component Reference

### Input

| Test ID | Element |
|---------|---------|
| `{dataTestId}` | Input field (main element) |
| `{dataTestId}-wrapper` | Container |
| `{dataTestId}-label` | Label |
| `{dataTestId}-prefix-icon` | Prefix icon |
| `{dataTestId}-suffix-icon` | Suffix icon |
| `{dataTestId}-suffix-btn` | Suffix button |
| `{dataTestId}-help` | Help text |
| `{dataTestId}-success` | Success message |
| `{dataTestId}-error` | Error message |

**Example:**
```typescript
await page.getByTestId('email').fill('user@test.com');
await expect(page.getByTestId('email-error')).toBeVisible();
```

---

### Button

| Test ID | Element |
|---------|---------|
| `{dataTestId}` | Button element (main) |
| `{dataTestId}-content` | Content wrapper |
| `{dataTestId}-spinner` | Loading spinner |

**Example:**
```typescript
await page.getByTestId('submit-btn').click();
await page.getByTestId('submit-btn-spinner').waitFor();
```

---

### Select

| Test ID | Element |
|---------|---------|
| `{dataTestId}` | Select element (main) |
| `{dataTestId}-wrapper` | Container |
| `{dataTestId}-label` | Label |
| `{dataTestId}-option-{value}` | Each option (sanitized) |
| `{dataTestId}-help` | Help text |
| `{dataTestId}-success` | Success message |
| `{dataTestId}-error` | Error message |

**Example:**
```typescript
await page.getByTestId('country').selectOption('us');
await page.getByTestId('country-option-us').click();
```

---

### Checkbox

| Test ID | Element |
|---------|---------|
| `{dataTestId}` | Checkbox input (main) |
| `{dataTestId}-wrapper` | Container |
| `{dataTestId}-label` | Label |
| `{dataTestId}-help` | Help text |
| `{dataTestId}-success` | Success message |
| `{dataTestId}-error` | Error message |

**Example:**
```typescript
await page.getByTestId('terms').check();
await expect(page.getByTestId('terms')).toBeChecked();
```

---

### Radio

| Test ID | Element |
|---------|---------|
| `{dataTestId}` | Radio group container |
| `{dataTestId}-wrapper` | Outer wrapper |
| `{dataTestId}-label` | Group label |
| `{dataTestId}-option-{value}` | Radio input (sanitized) |
| `{dataTestId}-option-{value}-label` | Radio label |
| `{dataTestId}-help` | Help text |
| `{dataTestId}-success` | Success message |
| `{dataTestId}-error` | Error message |

**Example:**
```typescript
await page.getByTestId('payment-option-credit-card').check();
```

---

### MultiSelect

| Test ID | Element |
|---------|---------|
| `{dataTestId}` | Button trigger (main) |
| `{dataTestId}-wrapper` | Container |
| `{dataTestId}-label` | Label |
| `{dataTestId}-dropdown` | Dropdown menu |
| `{dataTestId}-search` | Search input |
| `{dataTestId}-list` | Options list |
| `{dataTestId}-option-{value}` | Checkbox option (sanitized) |
| `{dataTestId}-help` | Help text |
| `{dataTestId}-success` | Success message |
| `{dataTestId}-error` | Error message |

**Example:**
```typescript
await page.getByTestId('tags').click();
await page.getByTestId('tags-option-typescript').check();
```

---

### Table

| Test ID | Element |
|---------|---------|
| `{dataTestId}` | Table element (main) |
| `{dataTestId}-wrapper` | Container |
| `{dataTestId}-search` | Search input |
| `{dataTestId}-header` | Table header |
| `{dataTestId}-body` | Table body |
| `{dataTestId}-row-{id\|index}` | Table row (uses model ID if available, else index) |
| `{dataTestId}-select-all` | Select all checkbox |
| `{dataTestId}-pagination` | Pagination controls |

**Example:**
```typescript
await page.getByTestId('users-row-42').click();
await page.getByTestId('users-select-all').check();
```

---

### Modal

| Test ID | Element |
|---------|---------|
| `{dataTestId}` | Modal container (main) |
| `{dataTestId}-overlay` | Dark overlay |
| `{dataTestId}-content` | Content wrapper |

**Example:**
```typescript
await expect(page.getByTestId('confirm-dialog')).toBeVisible();
await page.getByTestId('confirm-dialog-overlay').click(); // dismiss
```

---

### Alert

| Test ID | Element |
|---------|---------|
| `{dataTestId}` | Alert container (main) |
| `{dataTestId}-icon` | Icon element |
| `{dataTestId}-content` | Content wrapper |
| `{dataTestId}-close-btn` | Close button |

**Example:**
```typescript
await expect(page.getByTestId('error-alert')).toBeVisible();
await page.getByTestId('error-alert-close-btn').click();
```

---

### Accordion

| Test ID | Element |
|---------|---------|
| `{dataTestId}` | Accordion container |
| `{dataTestId}-item-{index}` | Accordion item |
| `{dataTestId}-header-{index}` | Item header |
| `{dataTestId}-button-{index}` | Toggle button |
| `{dataTestId}-content-{index}` | Item content |

**Example:**
```typescript
await page.getByTestId('faq-button-0').click();
await expect(page.getByTestId('faq-content-0')).toBeVisible();
```

---

### Dropdown

| Test ID | Element |
|---------|---------|
| `{dataTestId}` | Dropdown root |
| `{dataTestId}-trigger` | Trigger button |
| `{dataTestId}-panel` | Dropdown panel |
| `{dataTestId}-search` | Search input (if enabled) |
| `{dataTestId}-item-{id}` | Menu item (sanitized) |

**Example:**
```typescript
await page.getByTestId('actions').click();
await page.getByTestId('actions-item-delete').click();
```

---

## Value Sanitization

Dynamic values (options, rows, items) are sanitized for test IDs:

```typescript
// Examples:
"United States" → "united-states"
"user@email.com" → "user-email-com"
123 → "123"
"My Value!!!" → "my-value"
```

**Rules:**
- Convert to lowercase
- Replace non-alphanumeric with `-`
- Remove leading/trailing hyphens
- Collapse multiple hyphens

---

## Usage in Components

```html
<!-- Parent passes dataTestId -->
<app-input [dataTestId]="'email'" [label]="'Email'" />

<!-- Child elements automatically get prefixed IDs -->
<!-- email, email-label, email-wrapper, email-help, etc. -->
```

```typescript
// Playwright tests
await page.getByTestId('email').fill('test@example.com');
await page.getByTestId('email-suffix-btn').click();
await expect(page.getByTestId('email-error')).toHaveText('Invalid');
```

---

## Implementation

All components use `input()` signals for `dataTestId`:

```typescript
export class MyComponent {
  private readonly dataTestId = input<string | null>(null);

  // Generate test IDs using helpers
  readonly buttonTestId = computed(() => this.dataTestId());
  readonly labelTestId = computed(() => {
    const id = this.dataTestId();
    return id ? `${id}-label` : null;
  });
}
```

For dynamic items, use the sanitization utility:

```typescript
import { generateItemTestId } from '@loan/app/shared/utils/test-id.utils';

getOptionTestId(value: string): string | null {
  return generateItemTestId(this.dataTestId(), 'option', value);
}
```
