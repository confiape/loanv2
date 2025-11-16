# Playwright Test IDs Reference

> Comprehensive reference of `data-testid` attributes for e2e testing with Playwright.

## How It Works

Components use a **wrapper pattern** for test IDs:

```html
<app-input data-testid="email" />
<!-- Generates:
  - Host element: email-wrapper
  - Main element (input): email
  - Label: email-label
  - Error message: email-error-message
-->
```

### Wrapper Pattern Rules

1. **Host Element**: Always receives `-wrapper` suffix (e.g., `email-wrapper`)
2. **Main Element**: Receives the original test ID (e.g., `email`)
3. **Auxiliary Elements**: Receive test ID with descriptive suffix (e.g., `email-label`, `email-error-message`)
4. **Composite Components**: Components that wrap other components (like `PasswordInput`) keep the original test ID on their host without the wrapper pattern

If no `data-testid` is provided on the host element, no test IDs are rendered.

---

## Form Components

### Input

**Location:** `src/app/shared/components/input/`

| Test ID | Element |
|---------|---------|
| `{prefix}-wrapper` | Host element |
| `{prefix}` | Input field (main element) |
| `{prefix}-label` | Label element |
| `{prefix}-button` | Suffix button (search, clear, etc.) |
| `{prefix}-help-text` | Help message |
| `{prefix}-error-message` | Error message |

**Example:**
```html
<app-input data-testid="email" [label]="'Email'" />
```
```typescript
await page.getByTestId('email').fill('user@example.com'); // Main input
await expect(page.getByTestId('email-label')).toHaveText('Email');
await expect(page.getByTestId('email-error-message')).toBeVisible();
```

---

### InputNumber

**Location:** `src/app/shared/components/input-number/`

| Test ID | Element |
|---------|---------|
| `{prefix}-wrapper` | Host element |
| `{prefix}` | Input field (type=number, main element) |
| `{prefix}-label` | Label element |
| `{prefix}-increment` | Increment button (+) |
| `{prefix}-decrement` | Decrement button (-) |
| `{prefix}-help-text` | Help message |
| `{prefix}-error-message` | Error message |

**Example:**
```typescript
await page.getByTestId('quantity').fill('50');
await page.getByTestId('quantity-increment').click();
```

---

### DateInput

**Location:** `src/app/shared/components/date-input/`

| Test ID | Element |
|---------|---------|
| `{prefix}-wrapper` | Host element |
| `{prefix}` | Date input field (main element) |
| `{prefix}-label` | Label element |
| `{prefix}-help-text` | Help message |
| `{prefix}-error-message` | Error message |

---

### Select

**Location:** `src/app/shared/components/select/`

| Test ID | Element |
|---------|---------|
| `{prefix}-wrapper` | Host element |
| `{prefix}` | Select dropdown (main element) |
| `{prefix}-label` | Label element |
| `{prefix}-option-{sanitized-value}` | Each option (value is sanitized) |
| `{prefix}-help-text` | Help message |
| `{prefix}-error-message` | Error message |

**Example:**
```typescript
await page.getByTestId('country').selectOption('US');
await expect(page.getByTestId('country-option-us')).toBeVisible();
```

---

### Multiselect

**Location:** `src/app/shared/components/multiselect/`

| Test ID | Element |
|---------|---------|
| `{prefix}-label` | Label element |
| `{prefix}-button` | Dropdown toggle button |
| `{prefix}-dropdown` | Dropdown panel |
| `{prefix}-search` | Search input (if searchable) |
| `{prefix}-list` | Options list |
| `{prefix}-option-{sanitized-value}` | Each checkbox option |
| `{prefix}-help-text` | Help message |
| `{prefix}-error-message` | Error message |

---

### Checkbox

**Location:** `src/app/shared/components/checkbox/`

| Test ID | Element |
|---------|---------|
| `{prefix}-input` | Checkbox input |
| `{prefix}-label` | Label text |
| `{prefix}-help-text` | Help message |
| `{prefix}-error-message` | Error message |

---

### Radio Group

**Location:** `src/app/shared/components/radio/`

| Test ID | Element |
|---------|---------|
| `{prefix}-radio-{index}` | Radio input (index-based) |
| `{prefix}-label-{index}` | Radio label (index-based) |
| `{prefix}-help-text` | Help message |
| `{prefix}-error-message` | Error message |

**Example:**
```typescript
await page.getByTestId('gender-radio-0').check(); // Male
await page.getByTestId('gender-radio-1').check(); // Female
```

---

## UI Components

### Button

**Location:** `src/app/shared/components/button/`

| Test ID | Element |
|---------|---------|
| `{prefix}-wrapper` | Host element |
| `{prefix}` | Button element (main element) |
| `{prefix}-spinner` | Loading spinner |

**Example:**
```html
<app-button data-testid="submit-btn">Submit</app-button>
```
```typescript
await page.getByTestId('submit-btn').click(); // Main button
await expect(page.getByTestId('submit-btn-spinner')).toBeVisible();
```

---

### Alert

**Location:** `src/app/shared/components/alert/`

| Test ID | Element |
|---------|---------|
| `{prefix}-wrapper` | Host element |
| `{prefix}` | Alert container (main element) |
| `{prefix}-close` | Close button (if dismissible) |

---

### Modal

**Location:** `src/app/shared/components/modal/`

| Test ID | Element |
|---------|---------|
| `{prefix}-overlay` | Modal overlay/backdrop |
| `{prefix}-close` | Close button |
| `{prefix}-header` | Modal header |

**Example:**
```typescript
await expect(page.getByTestId('confirm-overlay')).toBeVisible();
await page.getByTestId('confirm-close').click();
```

---

### Accordion

**Location:** `src/app/shared/components/accordion/`

| Test ID | Element |
|---------|---------|
| `{prefix}-trigger-{itemId}` | Expand/collapse trigger |
| `{prefix}-panel-{itemId}` | Accordion panel content |

**Example:**
```html
<app-accordion data-testid="faq">
  <app-accordion-item id="shipping">
    <app-accordion-item-header>Shipping</app-accordion-item-header>
    <app-accordion-item-content>Details</app-accordion-item-content>
  </app-accordion-item>
</app-accordion>
```
```typescript
await page.getByTestId('faq-trigger-shipping').click();
await expect(page.getByTestId('faq-panel-shipping')).toBeVisible();
```

---

### Dropdown (Advanced)

**Location:** `src/app/shared/components/dropdown/advanced/`

| Test ID | Element |
|---------|---------|
| `{prefix}` | Dropdown container (host) |
| `{prefix}-panel` | Dropdown panel |
| `{prefix}-search` | Search input (if enabled) |

---

### Toast

**Location:** `src/app/shared/components/toast/`

| Test ID | Element |
|---------|---------|
| `{prefix}` | Toast container |
| `{prefix}-close` | Close button |

---

### Button Group Button

**Location:** `src/app/shared/components/button-group/`

| Test ID | Element |
|---------|---------|
| `{prefix}` | Button element (host) |

---

### Apps Menu

**Location:** `src/app/shared/components/apps-menu/`

| Test ID | Element |
|---------|---------|
| `{prefix}-trigger` | Menu trigger button |
| `{prefix}-item-{index}` | Menu item (index-based) |

**Example:**
```typescript
await page.getByTestId('apps-trigger').click();
await page.getByTestId('apps-item-0').click(); // First app
```

---

### User Menu

**Location:** `src/app/shared/components/user-menu/`

| Test ID | Element |
|---------|---------|
| `{prefix}-trigger` | Menu trigger button |
| `{prefix}-item-{index}` | Menu item (index-based) |

---

### Table

**Location:** `src/app/shared/ui/table/`

| Test ID | Element |
|---------|---------|
| `{prefix}-search` | Search input |
| `{prefix}-table` | Table element |
| `{prefix}-select-all` | Select all checkbox |
| `{prefix}-row-{id}` | Table row (if item has ID) |

---

## Implementation Notes

### Wrapper Pattern

All components implement a **wrapper pattern** for test IDs:

- **Host Element**: Always gets `-wrapper` suffix (e.g., `email-wrapper`)
- **Main Element**: Gets the original test ID (e.g., `email` on the `<input>` element)
- **Auxiliary Elements**: Get descriptive suffixes (e.g., `email-label`, `email-error-message`)

**Example:**
```html
<app-input data-testid="username" label="Username">
<!-- Generates:
  - <app-input data-testid="username-wrapper"> (host)
    - <input data-testid="username"> (main element)
    - <label data-testid="username-label"> (auxiliary)
-->
```

### Composite Components

Components that wrap other components (e.g., `PasswordInput` wraps `Input`) do **not** use the wrapper pattern on their host:

- **PasswordInput**: Host keeps original test ID (e.g., `password`)
- This is because `HostAttributeToken` doesn't work with bound attributes
- The actual `<input>` element inside is still accessible via DOM queries

**Example:**
```html
<app-password-input data-testid="password">
<!-- Host element: password (no -wrapper suffix)
     Inner elements accessible via passwordInput.querySelector('input')
-->
```

### Dynamic Values
Dynamic values (option values, item IDs) are sanitized for safe test IDs:
- Lowercase transformation
- Special characters replaced with hyphens
- Example: `"New York"` → `"new-york"`

### Index-Based IDs
Components without unique IDs use zero-based indices:
- Radio buttons: `{prefix}-radio-0`, `{prefix}-radio-1`, `{prefix}-radio-2`
- Menu items: `{prefix}-item-0`, `{prefix}-item-1`, `{prefix}-item-2`

### No Host Attribute = No Test IDs
If a component doesn't have a `data-testid` attribute on its host element, no child test IDs are generated. This keeps the DOM clean when testing is not needed.

---

## Best Practices

1. **Use Descriptive Prefixes:** `data-testid="user-email"` not `data-testid="input1"`
2. **Test User Flows:** Focus on elements users interact with
3. **Avoid Brittle Selectors:** Use test IDs, not class names or complex CSS
4. **Dynamic Content:** Use sanitized values or indices for lists
5. **Accessibility First:** Combine with ARIA attributes for robust tests
