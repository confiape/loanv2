import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { fn } from 'storybook/test';
import { Accordion } from './accordion';
import { AccordionItemComponent } from './accordion-item';
import { AccordionItemHeaderComponent } from './accordion-item-header';
import { AccordionItemContentComponent } from './accordion-item-content';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';


const meta: Meta<Accordion> = {
  title: 'UI/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        Accordion,
        AccordionItemComponent,
        AccordionItemHeaderComponent,
        AccordionItemContentComponent,
      ],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    allowMultiple: {
      control: 'boolean',
      description: 'Allow multiple accordion items to be expanded simultaneously',
    },
    itemSelected: {
      description: 'Event emitted when an accordion item is toggled',
    },
  },
};

export default meta;
type Story = StoryObj<Accordion>;

/**
 * Default accordion with three items in single expansion mode.
 */
export const Default: Story = {
  args: {
    allowMultiple: false,
    itemSelected: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-2xl mx-auto">
        <app-accordion [allowMultiple]="false">
          <app-accordion-item id="item1">
            <app-accordion-item-header>What is your return policy?</app-accordion-item-header>
            <app-accordion-item-content>
              <p>You can return any item within 30 days of purchase. Items must be unused and in their original packaging.</p>
            </app-accordion-item-content>
          </app-accordion-item>

          <app-accordion-item id="item2">
            <app-accordion-item-header>How long does shipping take?</app-accordion-item-header>
            <app-accordion-item-content>
              <p>Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout.</p>
            </app-accordion-item-content>
          </app-accordion-item>

          <app-accordion-item id="item3">
            <app-accordion-item-header>Do you ship internationally?</app-accordion-item-header>
            <app-accordion-item-content>
              <p>Yes, we ship to over 100 countries worldwide. International shipping rates vary by location.</p>
            </app-accordion-item-content>
          </app-accordion-item>
        </app-accordion>
      </div>
    `),
  }),
};

/**
 * Accordion with multiple items expanded at once.
 */
export const MultipleExpanded: Story = {
  args: {
    allowMultiple: true,
    itemSelected: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-2xl mx-auto">
        <app-accordion [allowMultiple]="true">
          <app-accordion-item id="item1" [expanded]="true">
            <app-accordion-item-header>Product Details</app-accordion-item-header>
            <app-accordion-item-content>
              <p>High-quality materials and craftsmanship. Made with sustainable and eco-friendly components.</p>
            </app-accordion-item-content>
          </app-accordion-item>

          <app-accordion-item id="item2" [expanded]="true">
            <app-accordion-item-header>Specifications</app-accordion-item-header>
            <app-accordion-item-content>
              <ul class="list-disc list-inside space-y-1">
                <li>Dimensions: 10" x 8" x 2"</li>
                <li>Weight: 1.5 lbs</li>
                <li>Material: Premium leather</li>
              </ul>
            </app-accordion-item-content>
          </app-accordion-item>

          <app-accordion-item id="item3">
            <app-accordion-item-header>Care Instructions</app-accordion-item-header>
            <app-accordion-item-content>
              <p>Clean with a damp cloth. Avoid direct sunlight and excessive moisture.</p>
            </app-accordion-item-content>
          </app-accordion-item>
        </app-accordion>
      </div>
    `),
  }),
};

/**
 * Accordion with one item initially expanded.
 */
export const InitiallyExpanded: Story = {
  args: {
    allowMultiple: false,
    itemSelected: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-2xl mx-auto">
        <app-accordion [allowMultiple]="false">
          <app-accordion-item id="item1" [expanded]="true">
            <app-accordion-item-header>Getting Started</app-accordion-item-header>
            <app-accordion-item-content>
              <p>Welcome! Start by exploring the features in the navigation menu. You can customize your settings in the profile section.</p>
            </app-accordion-item-content>
          </app-accordion-item>

          <app-accordion-item id="item2">
            <app-accordion-item-header>Advanced Features</app-accordion-item-header>
            <app-accordion-item-content>
              <p>Unlock advanced features by upgrading to a premium account. Contact support for more information.</p>
            </app-accordion-item-content>
          </app-accordion-item>

          <app-accordion-item id="item3">
            <app-accordion-item-header>Support</app-accordion-item-header>
            <app-accordion-item-content>
              <p>Need help? Check our documentation or contact our support team at support@example.com.</p>
            </app-accordion-item-content>
          </app-accordion-item>
        </app-accordion>
      </div>
    `),
  }),
};

/**
 * Accordion with disabled items.
 */
export const WithDisabledItems: Story = {
  args: {
    allowMultiple: false,
    itemSelected: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-2xl mx-auto">
        <app-accordion [allowMultiple]="false">
          <app-accordion-item id="item1">
            <app-accordion-item-header>Available Feature</app-accordion-item-header>
            <app-accordion-item-content>
              <p>This feature is available and can be accessed by all users.</p>
            </app-accordion-item-content>
          </app-accordion-item>

          <app-accordion-item id="item2" [disabled]="true">
            <app-accordion-item-header>Premium Feature (Disabled)</app-accordion-item-header>
            <app-accordion-item-content>
              <p>This feature requires a premium subscription.</p>
            </app-accordion-item-content>
          </app-accordion-item>

          <app-accordion-item id="item3">
            <app-accordion-item-header>Another Available Feature</app-accordion-item-header>
            <app-accordion-item-content>
              <p>This is another feature available to all users.</p>
            </app-accordion-item-content>
          </app-accordion-item>
        </app-accordion>
      </div>
    `),
  }),
};

/**
 * Accordion with rich content including lists and formatting.
 */
export const RichContent: Story = {
  args: {
    allowMultiple: true,
    itemSelected: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-2xl mx-auto">
        <app-accordion [allowMultiple]="true">
          <app-accordion-item id="item1">
            <app-accordion-item-header>Features Overview</app-accordion-item-header>
            <app-accordion-item-content>
              <div class="space-y-3">
                <h4 class="font-semibold">Key Features:</h4>
                <ul class="list-disc list-inside space-y-1">
                  <li>Real-time collaboration</li>
                  <li>Cloud storage integration</li>
                  <li>Advanced security protocols</li>
                  <li>24/7 customer support</li>
                </ul>
              </div>
            </app-accordion-item-content>
          </app-accordion-item>

          <app-accordion-item id="item2">
            <app-accordion-item-header>Pricing Plans</app-accordion-item-header>
            <app-accordion-item-content>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="font-medium">Basic</span>
                  <span class="text-accent">$9.99/month</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="font-medium">Pro</span>
                  <span class="text-accent">$19.99/month</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="font-medium">Enterprise</span>
                  <span class="text-accent">Contact us</span>
                </div>
              </div>
            </app-accordion-item-content>
          </app-accordion-item>

          <app-accordion-item id="item3">
            <app-accordion-item-header>Technical Requirements</app-accordion-item-header>
            <app-accordion-item-content>
              <div class="space-y-2">
                <p class="font-semibold">Minimum Requirements:</p>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                  <li>Stable internet connection (5 Mbps+)</li>
                  <li>JavaScript enabled</li>
                  <li>Cookies enabled for authentication</li>
                </ul>
              </div>
            </app-accordion-item-content>
          </app-accordion-item>
        </app-accordion>
      </div>
    `),
  }),
};

/**
 * Accordion with many items to test scrolling behavior.
 */
export const ManyItems: Story = {
  args: {
    allowMultiple: false,
    itemSelected: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-2xl mx-auto">
        <app-accordion [allowMultiple]="false">
          <app-accordion-item id="item1">
            <app-accordion-item-header>Section 1</app-accordion-item-header>
            <app-accordion-item-content>
              <p>Content for section 1</p>
            </app-accordion-item-content>
          </app-accordion-item>

          <app-accordion-item id="item2">
            <app-accordion-item-header>Section 2</app-accordion-item-header>
            <app-accordion-item-content>
              <p>Content for section 2</p>
            </app-accordion-item-content>
          </app-accordion-item>

          <app-accordion-item id="item3">
            <app-accordion-item-header>Section 3</app-accordion-item-header>
            <app-accordion-item-content>
              <p>Content for section 3</p>
            </app-accordion-item-content>
          </app-accordion-item>

          <app-accordion-item id="item4">
            <app-accordion-item-header>Section 4</app-accordion-item-header>
            <app-accordion-item-content>
              <p>Content for section 4</p>
            </app-accordion-item-content>
          </app-accordion-item>

          <app-accordion-item id="item5">
            <app-accordion-item-header>Section 5</app-accordion-item-header>
            <app-accordion-item-content>
              <p>Content for section 5</p>
            </app-accordion-item-content>
          </app-accordion-item>

          <app-accordion-item id="item6">
            <app-accordion-item-header>Section 6</app-accordion-item-header>
            <app-accordion-item-content>
              <p>Content for section 6</p>
            </app-accordion-item-content>
          </app-accordion-item>

          <app-accordion-item id="item7">
            <app-accordion-item-header>Section 7</app-accordion-item-header>
            <app-accordion-item-content>
              <p>Content for section 7</p>
            </app-accordion-item-content>
          </app-accordion-item>
        </app-accordion>
      </div>
    `),
  }),
};

/**
 * Compact accordion without padding for tight spaces.
 */
export const Compact: Story = {
  args: {
    allowMultiple: false,
    itemSelected: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-4 max-w-xl mx-auto">
        <app-accordion [allowMultiple]="false">
          <app-accordion-item id="item1">
            <app-accordion-item-header>Quick Question 1</app-accordion-item-header>
            <app-accordion-item-content>
              <p class="text-sm">Short answer here.</p>
            </app-accordion-item-content>
          </app-accordion-item>

          <app-accordion-item id="item2">
            <app-accordion-item-header>Quick Question 2</app-accordion-item-header>
            <app-accordion-item-content>
              <p class="text-sm">Another brief answer.</p>
            </app-accordion-item-content>
          </app-accordion-item>

          <app-accordion-item id="item3">
            <app-accordion-item-header>Quick Question 3</app-accordion-item-header>
            <app-accordion-item-content>
              <p class="text-sm">Final short answer.</p>
            </app-accordion-item-content>
          </app-accordion-item>
        </app-accordion>
      </div>
    `),
  }),
};
