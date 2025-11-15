import {
  ChangeDetectionStrategy,
  Component,
  HostAttributeToken,
  inject,
  output,
} from '@angular/core';
import { generateModalTestIds } from './modal-helpers';

const DATA_TESTID = new HostAttributeToken('data-testid');

@Component({
  selector: 'app-modal-header',
  standalone: true,
  template: `
    <div
      [attr.data-testid]="headerTestId()"
      class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-border"
    >
      <h3 class="text-xl font-semibold text-text-primary">
        <ng-content />
      </h3>
      <button
        type="button"
        [attr.data-testid]="closeButtonTestId()"
        class="text-text-secondary bg-transparent hover:bg-bg-secondary hover:text-text-primary rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition-colors"
        (click)="closeClick.emit()"
        aria-label="Close modal"
      >
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
        <span class="sr-only">Close modal</span>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalHeader {
  private readonly hostTestId = inject(DATA_TESTID, { optional: true });
  private readonly testIds = generateModalTestIds(this.hostTestId);

  readonly headerTestId = this.testIds.header;
  readonly closeButtonTestId = this.testIds.close;

  readonly closeClick = output<void>();
}
