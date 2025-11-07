import {
  ChangeDetectionStrategy,
  Component,
  HostAttributeToken,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  AlertVariant,
  generateAlertTestIds,
  getAlertClasses,
  getAlertIcon,
} from './alert-helpers';

const DATA_TESTID = new HostAttributeToken('data-testid');

@Component({
  selector: 'app-alert',
  standalone: true,
  template: `
    <div
      [attr.data-testid]="alertTestId()"
      [class]="containerClasses()"
      [attr.role]="'alert'"
      [attr.aria-live]="'polite'"
    >
      <div class="flex items-center">
        @if (showIcon()) {
          <div
            [attr.data-testid]="iconTestId()"
            class="shrink-0 inline me-3"
            [innerHTML]="iconHtml()"
            aria-hidden="true"
          ></div>
        }

        <div [attr.data-testid]="contentTestId()" class="flex-1">
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
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
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
})
export class Alert {
  private readonly hostTestId = inject(DATA_TESTID, { optional: true });
  private readonly sanitizer = inject(DomSanitizer);

  readonly variant = input<AlertVariant>('info');
  readonly title = input<string>('');
  readonly dismissible = input<boolean>(false);
  readonly showIcon = input<boolean>(true);
  readonly withBorder = input<boolean>(false);
  readonly hasActions = input<boolean>(false);

  readonly dismissed = output<void>();

  private readonly testIds = generateAlertTestIds(this.hostTestId);
  readonly alertTestId = this.testIds.alert;
  readonly iconTestId = this.testIds.icon;
  readonly closeButtonTestId = this.testIds.closeButton;
  readonly contentTestId = this.testIds.content;

  protected readonly classes = computed(() => getAlertClasses(this.variant(), this.withBorder()));

  protected readonly containerClasses = computed(() => this.classes().container);
  protected readonly textClasses = computed(() => this.classes().text);

  protected readonly iconHtml = computed<SafeHtml>(() => {
    const iconSvg = getAlertIcon(this.variant());
    return this.sanitizer.sanitize(1, iconSvg) || '';
  });

  protected handleDismiss(): void {
    this.dismissed.emit();
  }
}
