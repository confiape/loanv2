# STORYBOOK.md – Storybook Documentation Guide

> Applies to: **Angular 20 (Zoneless)** application with **Tailwind CSS v4** and **standalone components**.
> Goal: ensure every UI component has consistent, accessible, and themed stories.

---

## 1. Purpose

Storybook documents reusable UI components in **isolation**.
It provides:

- Visual testing in **Light/Dark** mode.
- **Responsive previews** (mobile/desktop).
- Component **interaction and state coverage**.
- **Automated documentation** for developers and QA.

---

## 2. Folder Structure

```
src/stories/
├── story-helpers.ts           # Shared Light/Dark helpers
├── ui/                        # Component stories
│   ├── button.stories.ts
│   ├── dropdown.stories.ts
│   ├── modal.stories.ts
└── themes/                    # Global decorators and theme preview
```

---

## 3. Required Helpers

Located in `src/stories/story-helpers.ts`.

### `createLightDarkComparison()`

Displays Light + Dark themes side-by-side.

```ts
template: createLightDarkComparison('app-button', `[variant]="variant" [size]="size"`);
```

### `createVariantComparison()`

Displays multiple variants in a grid.

```ts
template: createVariantComparison(
  'app-alert',
  ['primary', 'success', 'error'],
  'message="Example message"',
);
```

### `wrapInLightDarkComparison()`

Wraps a custom or complex layout in both themes.

```ts
template: wrapInLightDarkComparison(`
  <div class="p-8">
    <app-modal [isOpen]="true" title="Example"></app-modal>
  </div>
`);
```

### `createLightDarkRender()`

Shorthand helper for simple components.

```ts
render: createLightDarkRender('app-badge', `[variant]="variant"`);
```

---

## 4. Meta Configuration

Every story must define a `Meta` object:

```ts
import { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button';

const meta: Meta<ButtonComponent> = {
  title: 'UI/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen', // REQUIRED for theme helpers
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'error'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<ButtonComponent>;
```

---

## 5. Story Coverage (Minimum Set)

Each component should include **5–10 stories** covering all states.

| Type             | Example                               |
| ---------------- | ------------------------------------- |
| Default          | `Default: Story`                      |
| Variants         | `AllVariants: Story`                  |
| Sizes            | `Sizes: Story`                        |
| Disabled/Loading | `Disabled`, `Loading`                 |
| Edge Cases       | `EmptyState`, `Overflow`, `LongLabel` |

Example:

```ts
export const Default: Story = { args: { variant: 'primary', label: 'Click me' } };
export const AllVariants: Story = {
  render: () =>
    createVariantComparison('app-button', ['primary', 'secondary', 'error'], `label='Click'`),
};
```

---

## 6. ArgTypes Best Practices

| Control   | Usage                    |
| --------- | ------------------------ |
| `select`  | Variants, sizes          |
| `boolean` | Toggles, states          |
| `text`    | Labels, placeholders     |
| `number`  | Values, progress, steps  |
| `color`   | Theme visualization only |

Use `fn()` from `storybook/test` to mock events:

```ts
args: { onClick: fn() },
```

---
