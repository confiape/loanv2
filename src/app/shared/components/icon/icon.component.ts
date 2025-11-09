import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, distinctUntilChanged, switchMap } from 'rxjs';
import { of } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {IconService} from '@loan/app/core/services';

const SIZE_VARIANTS = new Set(['sm', 'md', 'lg'] as const);

@Component({
  selector: 'app-icon',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"inline-flex items-center justify-center"',
    '[innerHTML]': 'svgContent()',
    '[attr.role]': 'roleAttr()',
    '[attr.aria-label]': 'ariaLabelAttr()',
    '[attr.aria-hidden]': 'ariaHiddenAttr()',
    '[style.width.px]': 'numericSize()',
    '[style.height.px]': 'numericSize()',
  },
})
export class IconComponent {
  private readonly iconService = inject(IconService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly emptyIcon = this.sanitizer.bypassSecurityTrustHtml('');

  name = input<string>('');
  svg = input<string>(''); // Inline SVG string
  size = input<'sm' | 'md' | 'lg' | number>('md');
  ariaLabel = input<string | null>(null);

  protected readonly normalizedName = computed(() => this.normalizeName(this.name()));

  private readonly iconContent = toSignal<SafeHtml | null>(
    toObservable(this.normalizedName).pipe(
      distinctUntilChanged(),
      switchMap((name) => {
        if (!name) {
          return of(this.emptyIcon);
        }

        return this.iconService.getSvg(name).pipe(catchError(() => of(this.emptyIcon)));
      }),
    ),
    { initialValue: null, requireSync: false },
  );

  protected readonly svgContent = computed(() => {
    // If inline SVG is provided, use it directly
    const inlineSvg = this.svg();
    if (inlineSvg) {
      return this.sanitizer.bypassSecurityTrustHtml(inlineSvg);
    }

    // Otherwise, use the loaded icon content
    return this.iconContent() ?? this.emptyIcon;
  });

  protected readonly numericSize = computed(() => {
    const current = this.size();
    return typeof current === 'number' ? current : null;
  });

  protected readonly roleAttr = computed(() => (this.ariaLabelAttr() ? 'img' : null));

  protected readonly ariaLabelAttr = computed(() => {
    const label = this.ariaLabel();
    if (!label) {
      return null;
    }
    const trimmed = label.trim();
    return trimmed.length > 0 ? trimmed : null;
  });

  protected readonly ariaHiddenAttr = computed(() =>
    this.ariaLabelAttr() === null ? 'true' : null,
  );

  private normalizeName(name: string): string {
    return name.trim().replace(/\.svg$/i, '');
  }
}
