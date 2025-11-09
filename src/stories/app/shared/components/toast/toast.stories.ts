import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { ToastComponent, ToastContainerComponent, ToastService } from '@loan/app/shared/components/toast';
import { Button } from '@loan/app/shared/components/button';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';

@Component({
  selector: 'app-toast-demo',
  standalone: true,
  imports: [ToastContainerComponent, Button],
  template: `
    <app-toast-container #toastContainer [position]="position" />
    <div class="flex flex-col gap-4 p-8 items-center">
      <div class="flex gap-2 flex-wrap justify-center">
        <app-button (buttonClick)="showInfo()">Show Info</app-button>
        <app-button [tone]="'success'" (buttonClick)="showSuccess()">Show Success</app-button>
        <app-button [tone]="'danger'" (buttonClick)="showError()">Show Error</app-button>
        <app-button [tone]="'warning'" (buttonClick)="showWarning()">Show Warning</app-button>
      </div>
      <app-button [variant]="'outline'" [tone]="'neutral'" (buttonClick)="clearAll()"
        >Clear All</app-button
      >
    </div>
  `,
})
class ToastDemoComponent implements AfterViewInit {
  @ViewChild('toastContainer', { static: false }) toastContainer!: ToastContainerComponent;
  private readonly toastService = inject(ToastService);

  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center' = 'top-right';

  ngAfterViewInit(): void {
    this.toastService.setContainer(this.toastContainer);
  }

  showInfo(): void {
    this.toastService.info('This is an informational message', 'Info');
  }

  showSuccess(): void {
    this.toastService.success('Your changes have been saved successfully!', 'Success');
  }

  showError(): void {
    this.toastService.error('There was an error processing your request', 'Error', 5000);
  }

  showWarning(): void {
    this.toastService.warning('Please review the information before proceeding', 'Warning');
  }

  clearAll(): void {
    this.toastService.clear();
  }
}

const meta: Meta = {
  title: 'UI/Toast',
  decorators: [
    moduleMetadata({
      imports: [ToastDemoComponent, ToastComponent, ToastContainerComponent, Button],
      providers: [ToastService],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const TopRight: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <app-toast-demo />
    `),
  }),
};

export const TopLeft: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <app-toast-demo />
    `),
  }),
};

export const BottomRight: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <app-toast-demo />
    `),
  }),
};

export const WithTitle: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8">
        <p class="text-text-secondary mb-4 text-center">
          Toasts with titles for better context
        </p>
        <app-toast-demo />
      </div>
    `),
  }),
};

export const LongDuration: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8">
        <p class="text-text-secondary mb-4 text-center">
          Error toasts stay visible for 5 seconds by default
        </p>
        <app-toast-demo />
      </div>
    `),
  }),
};
