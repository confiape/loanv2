# Playwright Test IDs Reference

> Reference of all `data-testid` attributes exposed by components for e2e testing.

## How It Works

Components accept a `data-testid` attribute that acts as a **prefix** for all internal elements:

```html
<app-input data-testid="email" />
<!-- Generates: email-wrapper, email-label, email-input, etc. -->
```

If no `data-testid` is provided, no test IDs are rendered.

---

## Component Test IDs

### Input

**Location:** `src/app/shared/components/input/`

| Test ID | Element |
|---------|---------|
| `{prefix}-wrapper` | Main container |
| `{prefix}-label` | Label element |
| `{prefix}-input` | Input field |
| `{prefix}-prefix-icon` | Icon at start |
| `{prefix}-suffix-icon` | Icon at end |
| `{prefix}-button` | Suffix button (e.g., search) |
| `{prefix}-help-text` | Help message |
| `{prefix}-success-message` | Success message |
| `{prefix}-error-message` | Error message |

**Example:**
```html
<app-input data-testid="email" [label]="'Email'" />
```
```typescript
await page.getByTestId('email-input').fill('user@example.com');
await expect(page.getByTestId('email-error-message')).toBeVisible();
```

---

### Button

**Location:** `src/app/shared/components/button/`

| Test ID | Element |
|---------|---------|
| `{prefix}` | Native `<button>` element |
| `{prefix}-content` | Slot content wrapper (label + icons) |
| `{prefix}-spinner` | Loading indicator container |

**Example:**
```html
<app-button data-testid="primary-cta">
  Continue
</app-button>
```
```typescript
await page.getByTestId('primary-cta').click();
await page.getByTestId('primary-cta-spinner').waitFor({ state: 'hidden' });
```

---

### Accordion

**Location:** `src/app/shared/components/accordion/`

| Test ID | Element |
|---------|---------|
| `{prefix}-accordion` | Main accordion container |
| `{prefix}-item-{itemId}` | Accordion item wrapper |
| `{prefix}-heading-{itemId}` | Heading element |
| `{prefix}-button-{itemId}` | Toggle button |
| `{prefix}-header-{itemId}` | Header text |
| `{prefix}-icon-{itemId}` | Expand/collapse icon |
| `{prefix}-body-{itemId}` | Body container |
| `{prefix}-body-{itemId}-content` | Body content |

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
await page.getByTestId('faq-button-shipping').click();
await expect(page.getByTestId('faq-body-shipping')).toBeVisible();
```

---

### InputNumber

**Location:** `src/app/shared/components/input-number/`

| Test ID | Element |
|---------|---------|
| `{prefix}-wrapper` | Main container |
| `{prefix}-label` | Label element |
| `{prefix}-input` | Input field (type=number) |
| `{prefix}-prefix-icon` | Icon at start |
| `{prefix}-buttons` | Increment/decrement buttons container |
| `{prefix}-increment` | Increment button (+) |
| `{prefix}-decrement` | Decrement button (-) |
| `{prefix}-help-text` | Help message |
| `{prefix}-success-message` | Success message |
| `{prefix}-error-message` | Error message |

**Example:**
```html
<app-input-number data-testid="quantity" [label]="'Quantity'" [min]="1" [max]="100" />
```
```typescript
await page.getByTestId('quantity-input').fill('50');
await page.getByTestId('quantity-increment').click();
await expect(page.getByTestId('quantity-input')).toHaveValue('51');
await page.getByTestId('quantity-decrement').click();
await expect(page.getByTestId('quantity-input')).toHaveValue('50');
```

---

### Select

**Location:** `src/app/shared/components/select/`

| Test ID | Element |
|---------|---------|
| `{prefix}-wrapper` | Main container |
| `{prefix}-label` | Label element |
| `{prefix}-select` | Select dropdown element |
| `{prefix}-help-text` | Help message |
| `{prefix}-success-message` | Success message |
| `{prefix}-error-message` | Error message |

**Example:**
```html
<app-select
  data-testid="country"
  [label]="'Country'"
  [options]="[
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' }
  ]"
/>
```
```typescript
await page.getByTestId('country-select').selectOption('US');
await expect(page.getByTestId('country-select')).toHaveValue('US');
await expect(page.getByTestId('country-label')).toBeVisible();
```
