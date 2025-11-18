import { signal } from '@angular/core';
import { ComponentTestBuilder } from './component-builder';
import { Alert } from '@loan/shared/components/alert/alert';
import { AlertVariant } from '@loan/shared/components/alert/alert-helpers';

/**
 * Specialized test builder for Alert component
 *
 * Extends ComponentTestBuilder with type-safe convenience methods
 * for Alert-specific configuration.
 *
 * @example
 * ```ts
 * describe('Alert', () => {
 *   let builder: AlertTestBuilder;
 *
 *   beforeEach(() => {
 *     builder = new AlertTestBuilder()
 *       .withInfoVariant()
 *       .withMessage('Default message')
 *       .asDismissible();
 *   });
 *
 *   it('should display info alert', () => {
 *     const fixture = builder.build(); // Auto-clones internally
 *     expect(fixture.componentInstance.variant()).toBe('info');
 *   });
 *
 *   it('should display success alert', () => {
 *     const fixture = builder
 *       .withSuccessVariant()
 *       .build();
 *     expect(fixture.componentInstance.variant()).toBe('success');
 *   });
 * });
 * ```
 */
export class AlertTestBuilder extends ComponentTestBuilder<Alert> {
  private dismissedSignal = signal<void | null>(null);

  constructor() {
    super(Alert);
    // Set default output handler
    this.withOutput('dismissed', () => this.dismissedSignal.set(undefined));
  }

  // ============ Variant Methods ============

  withInfoVariant(): this {
    return this.withInput('variant', 'info');
  }

  withSuccessVariant(): this {
    return this.withInput('variant', 'success');
  }

  withWarningVariant(): this {
    return this.withInput('variant', 'warning');
  }

  withErrorVariant(): this {
    return this.withInput('variant', 'error');
  }

  withVariant(variant: AlertVariant): this {
    return this.withInput('variant', variant);
  }

  // ============ Content Methods ============

  withMessage(title: string): this {
    return this.withInput('title', title);
  }

  withoutMessage(): this {
    return this.withInput('title', '');
  }

  // ============ Feature Methods ============

  asDismissible(): this {
    return this.withInput('dismissible', true);
  }

  asNotDismissible(): this {
    return this.withInput('dismissible', false);
  }

  withIcon(): this {
    return this.withInput('showIcon', true);
  }

  withoutIcon(): this {
    return this.withInput('showIcon', false);
  }

  withBorder(): this {
    return this.withInput('withBorder', true);
  }

  withoutBorder(): this {
    return this.withInput('withBorder', false);
  }

  withActions(): this {
    return this.withInput('hasActions', true);
  }

  withoutActions(): this {
    return this.withInput('hasActions', false);
  }

  // ============ TestId Method ============

  withTestId(testId: string): this {
    return this.withInput('dataTestId', testId);
  }

  withoutTestId(): this {
    return this.withInput('dataTestId', null);
  }

  // ============ Output Helpers ============

  /**
   * Configure custom dismissed handler
   */
  onDismissed(handler: () => void): this {
    return this.withOutput('dismissed', handler);
  }

  /**
   * Get the signal that tracks dismissed events
   * Useful for assertions in tests
   */
  getDismissedSignal() {
    return this.dismissedSignal;
  }

  /**
   * Reset the dismissed signal
   * Useful between multiple actions in the same test
   */
  resetDismissed(): void {
    this.dismissedSignal.set(null);
  }
}
