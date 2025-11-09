import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ToastVariant, generateToastTestIds, getToastClasses, getToastIcon } from './toast-helpers';

let toastIdCounter = 0;

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div
      [attr.data-testid]="toastTestId()"
      [class]="containerClasses()"
      [attr.role]="'alert'"
      [attr.aria-live]="'assertive'"
      [attr.aria-atomic]="'true'"
    >
      @if (showIcon()) {
        <div
          [attr.data-testid]="iconTestId()"
          class="inline-flex shrink-0 items-center justify-center"
          [innerHTML]="iconHtml()"
          aria-hidden="true"
        ></div>
      }

      <div [attr.data-testid]="contentTestId()" class="ms-3 text-sm font-normal flex-1">
        @if (title()) {
          <div class="mb-1 font-semibold text-text-primary">{{ title() }}</div>
        }
        <div class="text-text-secondary">{{ message() }}</div>
      </div>

      @if (dismissible()) {
        <button
          type="button"
          [attr.data-testid]="closeButtonTestId()"
          class="ms-auto -mx-1.5 -my-1.5 bg-transparent text-text-secondary hover:text-text-primary rounded-lg focus:ring-2 focus:ring-border p-1.5 inline-flex items-center justify-center h-8 w-8 transition-colors"
          [attr.aria-label]="'Close'"
          (click)="handleClose()"
        >
          <span class="sr-only">Close</span>
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent implements OnInit, OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);
  private autoDismissTimer?: ReturnType<typeof setTimeout>;

  readonly id = signal(`toast-${++toastIdCounter}`);
  readonly variant = input<ToastVariant>('info');
  readonly title = input<string>('');
  readonly message = input<string>('');
  readonly duration = input<number>(3000); // 3 seconds default
  readonly dismissible = input<boolean>(true);
  readonly showIcon = input<boolean>(true);

  readonly closed = output<void>();

  private readonly testIds = generateToastTestIds(this.id());
  readonly toastTestId = this.testIds.toast;
  readonly iconTestId = this.testIds.icon;
  readonly closeButtonTestId = this.testIds.closeButton;
  readonly contentTestId = this.testIds.content;

  protected readonly classes = computed(() => getToastClasses(this.variant()));
  protected readonly containerClasses = computed(() => this.classes().container);

  protected readonly iconHtml = computed<SafeHtml>(() => {
    const iconSvg = getToastIcon(this.variant());
    return this.sanitizer.sanitize(1, iconSvg) || '';
  });

  ngOnInit(): void {
    const duration = this.duration();
    if (duration > 0) {
      this.autoDismissTimer = setTimeout(() => {
        this.handleClose();
      }, duration);
    }
  }

  ngOnDestroy(): void {
    if (this.autoDismissTimer) {
      clearTimeout(this.autoDismissTimer);
    }
  }

  protected handleClose(): void {
    this.closed.emit();
  }
}
