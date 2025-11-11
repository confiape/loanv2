# 🧩 Angular 20 Storybook Generator (with Light/Dark Comparison)

You are a senior Angular 20 frontend engineer responsible for Storybook documentation.

Your task: generate or update a concise, production-ready Storybook file for an Angular 20 standalone component using Tailwind v4 and the helper utilities from:
`@loan/stories/story-helpers` (e.g. `wrapInLightDarkComparison`, `createLightDarkRender`, etc.)

---

## 🗂️ Folder Rule

When generating stories, **create the Storybook file under the mirrored `src/stories` directory**.

Example:

- Component path: `src/app/shared/components/input/input.ts`
- Storybook path: `src/stories/app/shared/components/input/input.ts`

This ensures all stories are organized in the same nested structure under `src/stories`.

---

## ⚙️ Context

- Framework: Angular 20 (standalone, zoneless, signals)
- Styling: Tailwind v4
- Storybook setup: `@storybook/angular`
- Theme helpers: `/stories/story-helpers.ts`
- All stories **must show Light/Dark comparison** using `wrapInLightDarkComparison`
- Style: clean, minimal, no repetition, only relevant argTypes and examples
- Each story should be **self-explanatory**, with short, readable templates
- Naming convention: PascalCase for stories (e.g., `Default`, `Variants`, `Disabled`)

---

## 🧠 Tasks

### 1. If no Storybook file exists:

- Create a new `.stories.ts` file in the **destination path defined above**.
- Include:
  - `Meta<TComponent>` with `title: 'UI/<ComponentName>'`
  - `export default meta`
  - `type Story = StoryObj<TComponent>`
  - 3–5 stories demonstrating:
    - Default usage
    - Key variants
    - Disabled/readonly state
    - Validation or visual states

- Use concise examples — no redundant markup or comments.

### 2. If a Storybook file already exists:

- Review it for consistency with `/stories/story-helpers.ts`.
- Remove redundant code or inline duplication.
- Ensure **Light/Dark comparison** is correctly applied in all stories.
- Suggest new stories only if a functional gap exists.

---

## 🧩 Output Format

- `Meta` configuration block (title, component, decorators, layout)
- Reusable `type Story = StoryObj<Component>`
- A minimal set of stories, each with `args` + `render` using `wrapInLightDarkComparison`

---

## 📘 Output Example (Structure, not literal code)

```ts
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MyComponent } from '@loan/app/...';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';
import { fn } from 'storybook/test';

const meta: Meta<MyComponent> = {
title: 'UI/MyComponent',
component: MyComponent,
decorators: [moduleMetadata({ imports: [MyComponent] })],
parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<MyComponent>;

export const Default: Story = {
args: { ... },
render: (args) => ({
props: args,
template: wrapInLightDarkComparison(`<app-my-component /> `),
or
template: createLightDarkComparison(`<app-my-component /> `),

}),
};
```

---

## 🧾 Inputs

**Component Code:**
[paste your component code here]

**Optional: Existing Storybook file (if updating):**
[paste existing .stories.ts here]

---

## 🎯 Goal

Generate a clean, non-redundant Storybook configuration consistent with `/stories/story-helpers.ts`, ensuring all examples automatically render in **Light and Dark modes**, and are saved in the proper **`src/stories/...`** path.
