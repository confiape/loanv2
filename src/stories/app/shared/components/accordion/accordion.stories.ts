import { Meta, StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { Accordion, AccordionItem } from '@loan/app/shared/components/accordion/accordion';
import { createLightDarkComparison, wrapInLightDarkComparison } from '@loan/stories/story-helpers';


const meta: Meta<Accordion> = {
  title: 'Shared/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    items: { control: 'object' },
    allowMultiple: { control: 'boolean' },
    itemSelected: { action: 'itemSelected' },
  },
};

export default meta;
type Story = StoryObj<Accordion>;

const defaultItems: AccordionItem[] = [
  {
    id: '1',
    title: 'What is Flowbite?',
    content:
      'Flowbite is an open-source library of interactive components built on top of Tailwind CSS including buttons, dropdowns, modals, navbars, and more.',
  },
  {
    id: '2',
    title: 'Is there a Figma file available?',
    content:
      'Flowbite is first conceptualized and designed using the Figma software so everything you see in the library has a design equivalent in our Figma file.',
  },
  {
    id: '3',
    title: 'What are the differences between Flowbite and Tailwind UI?',
    content:
      'The main difference is that the core components from Flowbite are open source under the MIT license, whereas Tailwind UI is a paid product.',
  },
];

/**
 * Default accordion with single item open at a time (default behavior)
 */
export const Default: Story = {
  args: {
    items: defaultItems,
    allowMultiple: false,
    itemSelected: fn(),
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-accordion',
      `[items]="items" [allowMultiple]="allowMultiple" (itemSelected)="itemSelected($event)"`,
    ),
  }),
};

/**
 * Accordion allowing multiple items to be open simultaneously
 */
export const MultipleOpen: Story = {
  args: {
    items: defaultItems,
    allowMultiple: true,
    itemSelected: fn(),
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-accordion',
      `[items]="items" [allowMultiple]="allowMultiple" (itemSelected)="itemSelected($event)"`,
    ),
  }),
};

/**
 * Accordion with minimal content (edge case)
 */
export const ShortContent: Story = {
  args: {
    items: [
      {
        id: '1',
        title: 'Question 1',
        content: 'Short answer.',
      },
      {
        id: '2',
        title: 'Question 2',
        content: 'Another short answer.',
      },
    ],
    allowMultiple: false,
    itemSelected: fn(),
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-accordion',
      `[items]="items" [allowMultiple]="allowMultiple" (itemSelected)="itemSelected($event)"`,
    ),
  }),
};

/**
 * Accordion with long content (overflow handling)
 */
export const LongContent: Story = {
  args: {
    items: [
      {
        id: '1',
        title: 'Detailed Question 1',
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
      },
      {
        id: '2',
        title: 'Detailed Question 2',
        content: `Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.`,
      },
      {
        id: '3',
        title: 'Detailed Question 3',
        content: `Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`,
      },
    ],
    allowMultiple: false,
    itemSelected: fn(),
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-accordion',
      `[items]="items" [allowMultiple]="allowMultiple" (itemSelected)="itemSelected($event)"`,
    ),
  }),
};

/**
 * Accordion with single item (minimal state)
 */
export const SingleItem: Story = {
  args: {
    items: [
      {
        id: '1',
        title: 'Only Question',
        content: 'This is the only accordion item.',
      },
    ],
    allowMultiple: false,
    itemSelected: fn(),
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-accordion',
      `[items]="items" [allowMultiple]="allowMultiple" (itemSelected)="itemSelected($event)"`,
    ),
  }),
};

/**
 * Empty accordion (no items)
 */
export const Empty: Story = {
  args: {
    items: [],
    allowMultiple: false,
    itemSelected: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8">
        <p class="text-gray-500 dark:text-gray-400">No accordion items available</p>
        <app-accordion [items]="items" [allowMultiple]="allowMultiple" (itemSelected)="itemSelected($event)"></app-accordion>
      </div>
    `),
  }),
};

/**
 * Accordion with many items (scrolling/pagination edge case)
 */
export const ManyItems: Story = {
  args: {
    items: Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Question ${i + 1}`,
      content: `Answer content for question ${i + 1}. This accordion has many items to test scrolling behavior.`,
    })),
    allowMultiple: false,
    itemSelected: fn(),
  },
  render: (args) => ({
    props: args,
    template: createLightDarkComparison(
      'app-accordion',
      `[items]="items" [allowMultiple]="allowMultiple" (itemSelected)="itemSelected($event)"`,
    ),
  }),
};
