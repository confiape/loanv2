import {
  Component,
  input,
  ChangeDetectionStrategy,
  computed,
  inject,
  HostAttributeToken,
} from '@angular/core';
import { CommonModule } from '@angular/common';

const DATA_TESTID = new HostAttributeToken('data-testid');

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'full' | 'sm';
export type AvatarVariant = 'image' | 'initials' | 'placeholder';
export type StatusIndicator = 'online' | 'offline' | 'away' | 'dnd' | null;

interface AvatarSizeConfig {
  container: string;
  initialsText: string;
  placeholderIcon: string;
  indicator: string;
}

const SIZES: Record<AvatarSize, AvatarSizeConfig> = {
  xs: {
    container: 'w-6 h-6',
    initialsText: 'text-xs',
    placeholderIcon: 'w-8 h-8',
    indicator: 'w-2 h-2',
  },
  sm: {
    container: 'w-8 h-8',
    initialsText: 'text-sm',
    placeholderIcon: 'w-10 h-10',
    indicator: 'w-2.5 h-2.5',
  },
  md: {
    container: 'w-10 h-10',
    initialsText: 'text-base',
    placeholderIcon: 'w-12 h-12',
    indicator: 'w-3.5 h-3.5',
  },
  lg: {
    container: 'w-20 h-20',
    initialsText: 'text-2xl',
    placeholderIcon: 'w-24 h-24',
    indicator: 'w-5 h-5',
  },
  xl: {
    container: 'w-36 h-36',
    initialsText: 'text-5xl',
    placeholderIcon: 'w-40 h-40',
    indicator: 'w-8 h-8',
  },
};

const SHAPE_CLASSES: Record<AvatarShape, string> = {
  full: 'rounded-full',
  sm: 'rounded-sm',
};

const STATUS_COLORS: Record<Exclude<StatusIndicator, null>, string> = {
  online: 'bg-green-400',
  offline: 'bg-gray-400',
  away: 'bg-yellow-400',
  dnd: 'bg-red-400',
};

const STATUS_POSITIONS: Record<string, string> = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-right': 'bottom-0 right-0',
};

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="inline-flex items-center justify-center relative"
      [class]="containerClasses()"
      [attr.data-testid]="componentTestId()"
    >
      <!-- Image Avatar -->
      @if (variant() === 'image') {
        <img
          [src]="imageSrc()"
          [alt]="imageAlt()"
          [class]="imageClasses()"
          [attr.data-testid]="imageTestId()"
        />
      }

      <!-- Initials Avatar -->
      @if (variant() === 'initials') {
        <span [class]="initialsClasses()" [attr.data-testid]="initialsTestId()">
          {{ initials() }}
        </span>
      }

      <!-- Placeholder Icon Avatar -->
      @if (variant() === 'placeholder') {
        <div
          class="relative overflow-hidden"
          [class]="containerClasses()"
          [attr.data-testid]="placeholderTestId()"
        >
          <svg
            class="absolute text-text-secondary dark:text-gray-400"
            [class]="placeholderIconClasses()"
            [class.text-text-secondary]="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
      }

      <!-- Status Indicator -->
      @if (statusIndicator() !== null) {
        <span [class]="indicatorClasses()" [attr.data-testid]="indicatorTestId()"></span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-testid]': 'componentTestId()',
  },
})
export class Avatar {
  // Test ID from host
  private readonly hostTestId = inject(DATA_TESTID, { optional: true });

  // Inputs
  readonly variant = input<AvatarVariant>('placeholder');
  readonly size = input<AvatarSize>('md');
  readonly shape = input<AvatarShape>('full');

  // Image variant
  readonly imageSrc = input<string>('');
  readonly imageAlt = input<string>('Avatar');

  // Initials variant
  readonly initials = input<string>('');

  // Status indicator
  readonly statusIndicator = input<StatusIndicator>(null);
  readonly statusPosition = input<keyof typeof STATUS_POSITIONS>('bottom-right');

  // Computed sizes
  private readonly sizeConfig = computed(() => SIZES[this.size()]);
  private readonly shapeClass = computed(() => SHAPE_CLASSES[this.shape()]);

  // Computed classes
  readonly containerClasses = computed(() => {
    const config = this.sizeConfig();
    const shape = this.shapeClass();
    return `${config.container} ${shape} overflow-hidden`.trim();
  });

  readonly imageClasses = computed(() => {
    const shape = this.shapeClass();
    return `w-full h-full object-cover ${shape}`.trim();
  });

  readonly initialsClasses = computed(() => {
    const config = this.sizeConfig();
    const shape = this.shapeClass();
    return `font-medium ${config.initialsText} text-text-primary dark:text-text-secondary ${shape} bg-bg-secondary dark:bg-gray-600 w-full h-full flex items-center justify-center`.trim();
  });

  readonly placeholderIconClasses = computed(() => {
    const config = this.sizeConfig();
    return `${config.placeholderIcon} -left-1`.trim();
  });

  readonly indicatorClasses = computed(() => {
    const config = this.sizeConfig();
    const status = this.statusIndicator();
    const position = STATUS_POSITIONS[this.statusPosition()];
    const color = status ? STATUS_COLORS[status] : 'bg-gray-400';

    return `absolute ${position} ${config.indicator} ${color} border-2 border-white dark:border-gray-800 rounded-full`.trim();
  });

  // Test ID computed values
  readonly componentTestId = computed(() => (this.hostTestId ? `${this.hostTestId}-avatar` : null));

  readonly imageTestId = computed(() => (this.hostTestId ? `${this.hostTestId}-image` : null));

  readonly initialsTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-initials` : null,
  );

  readonly placeholderTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-placeholder` : null,
  );

  readonly indicatorTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-indicator` : null,
  );
}
