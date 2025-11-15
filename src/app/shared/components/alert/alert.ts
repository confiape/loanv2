import {
  ChangeDetectionStrategy,
  Component,
  HostAttributeToken,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroInformationCircle,
  heroCheckCircle,
  heroXCircle,
  heroExclamationTriangle,
  heroXMark,
} from '@ng-icons/heroicons/outline';

import { AlertVariant, generateAlertTestIds, getAlertClasses, getAlertIcon } from './alert-helpers';

const DATA_TESTID = new HostAttributeToken('data-testid');

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgIconComponent],
  template: `
    <div
      [attr.data-testid]="alertTestId()"
      [class]="containerClasses()"
      [attr.role]="'alert'"
      [attr.aria-live]="'polite'"
    >
      <div class="flex items-center">
        @if (showIcon()) {
          <div class="shrink-0 inline me-3" aria-hidden="true">
            <ng-icon [name]="iconName()" size="18" [class]="iconClasses()"></ng-icon>
          </div>
        }

        <div class="flex-1">
          @if (title()) {
            <span [class]="'font-medium ' + textClasses()">{{ title() }}</span>
          }
          <ng-content />
        </div>

        @if (dismissible()) {
          <button
            type="button"
            [attr.data-testid]="closeButtonTestId()"
            [class]="
              'ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8 transition-colors ' +
              textClasses() +
              ' hover:bg-black/10 dark:hover:bg-white/10'
            "
            [attr.aria-label]="'Close alert'"
            (click)="handleDismiss()"
          >
            <span class="sr-only">Dismiss</span>
            <ng-icon [name]="closeIcon" size="12"></ng-icon>
          </button>
        }
      </div>

      @if (hasActions()) {
        <div class="mt-3 flex gap-2">
          <ng-content select="[alert-actions]" />
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      heroInformationCircle,
      heroCheckCircle,
      heroXCircle,
      heroExclamationTriangle,
      heroXMark,
    }),
  ],
})
export class Alert {
  private readonly hostTestId = inject(DATA_TESTID, { optional: true });

  readonly variant = input<AlertVariant>('info');
  readonly title = input<string>('');
  readonly dismissible = input<boolean>(false);
  readonly showIcon = input<boolean>(true);
  readonly withBorder = input<boolean>(false);
  readonly hasActions = input<boolean>(false);

  readonly dismissed = output<void>();

  private readonly testIds = generateAlertTestIds(this.hostTestId);
  readonly alertTestId = this.testIds.alert;
  readonly closeButtonTestId = this.testIds.close;

  protected readonly classes = computed(() => getAlertClasses(this.variant(), this.withBorder()));

  protected readonly containerClasses = computed(() => this.classes().container);
  protected readonly textClasses = computed(() => this.classes().text);

  protected readonly iconName = computed(() => getAlertIcon(this.variant()));
  protected readonly iconClasses = computed(() => this.classes().icon);
  protected readonly closeIcon = 'heroXMark';

  protected handleDismiss(): void {
    this.dismissed.emit();
  }
}
