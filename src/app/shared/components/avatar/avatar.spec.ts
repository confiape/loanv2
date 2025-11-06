import { beforeEach, describe, expect, it } from 'vitest';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { Avatar, AvatarSize, AvatarShape, AvatarVariant, StatusIndicator } from './avatar';

type AvatarInputs = Partial<{
  variant: AvatarVariant;
  size: AvatarSize;
  shape: AvatarShape;
  imageSrc: string;
  imageAlt: string;
  initials: string;
  statusIndicator: StatusIndicator;
  statusPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}>;

interface RenderOptions {
  inputs?: AvatarInputs;
  hostAttributes?: Record<string, string>;
}

interface RenderResult {
  fixture: ComponentFixture<Avatar>;
  component: Avatar;
  host: HTMLElement;
  rerender: (options?: RenderOptions) => Promise<void>;
}

async function renderAvatar(options: RenderOptions = {}): Promise<RenderResult> {
  const fixture = TestBed.createComponent(Avatar);
  const component = fixture.componentInstance;
  const host = fixture.nativeElement as HTMLElement;

  if (options.hostAttributes) {
    for (const [attr, value] of Object.entries(options.hostAttributes)) {
      host.setAttribute(attr, value);
    }
  }

  if (options.inputs) {
    for (const [key, value] of Object.entries(options.inputs)) {
      fixture.componentRef.setInput(key as keyof AvatarInputs, value as never);
    }
  }

  fixture.detectChanges();
  await fixture.whenStable();

  const rerender = async (update: RenderOptions = {}) => {
    if (update.hostAttributes) {
      for (const [attr, value] of Object.entries(update.hostAttributes)) {
        host.setAttribute(attr, value);
      }
    }

    if (update.inputs) {
      for (const [key, value] of Object.entries(update.inputs)) {
        fixture.componentRef.setInput(key as keyof AvatarInputs, value as never);
      }
    }

    fixture.detectChanges();
    await fixture.whenStable();
  };

  return { fixture, component, host, rerender };
}

@Component({
  selector: 'app-avatar-host',
  standalone: true,
  imports: [Avatar],
  template: `
    <app-avatar
      data-testid="user-avatar"
      [variant]="variant"
      [imageSrc]="imageSrc"
      [statusIndicator]="statusIndicator"
    ></app-avatar>
  `,
})
class AvatarHostComponent {
  variant: AvatarVariant = 'image';
  imageSrc = 'test.jpg';
  statusIndicator: StatusIndicator = 'online';

  @ViewChild(Avatar, { static: true })
  avatar!: Avatar;
}

describe('Avatar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avatar, AvatarHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  describe('defaults', () => {
    it('renders a placeholder icon with default configuration', async () => {
      const { host, component } = await renderAvatar();

      expect(component.variant()).toBe('placeholder');
      expect(host.querySelector('svg')).toBeTruthy();
      expect(component.size()).toBe('md');
      expect(component.shape()).toBe('full');
      expect(component.statusIndicator()).toBeNull();
    });
  });

  describe('placeholder variant', () => {
    it('shows the placeholder SVG with expected attributes', async () => {
      const { host, component } = await renderAvatar({ inputs: { variant: 'placeholder' } });
      const svg = host.querySelector('svg');
      const path = host.querySelector('svg path');

      expect(svg?.getAttribute('fill')).toBe('currentColor');
      expect(svg?.getAttribute('viewBox')).toBe('0 0 20 20');
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
      expect(path?.getAttribute('d')).toBe('M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z');
      expect(component.placeholderIconClasses()).toContain('-left-1');
    });

    it('adjusts placeholder icon size when avatar size changes', async () => {
      const { component, rerender } = await renderAvatar({
        inputs: { variant: 'placeholder', size: 'xs' },
      });
      expect(component.placeholderIconClasses()).toContain('w-8 h-8');

      await rerender({ inputs: { size: 'xl' } });
      expect(component.placeholderIconClasses()).toContain('w-40 h-40');
    });
  });

  describe('image variant', () => {
    it('renders the provided image source and alt text', async () => {
      const { host, component } = await renderAvatar({
        inputs: {
          variant: 'image',
          imageSrc: 'https://example.com/avatar.jpg',
          imageAlt: 'Jane Doe',
        },
      });

      const img = host.querySelector('img');
      expect(img?.getAttribute('src')).toBe('https://example.com/avatar.jpg');
      expect(img?.getAttribute('alt')).toBe('Jane Doe');
      expect(component.imageClasses()).toContain('object-cover');
    });

    it('falls back to default alt text when none is supplied', async () => {
      const { host } = await renderAvatar({
        inputs: {
          variant: 'image',
          imageSrc: 'test.jpg',
        },
      });

      expect(host.querySelector('img')?.getAttribute('alt')).toBe('Avatar');
    });
  });

  describe('initials variant', () => {
    it('renders provided initials and associated classes', async () => {
      const { host, component } = await renderAvatar({
        inputs: {
          variant: 'initials',
          initials: 'JD',
        },
      });

      const initials = host.querySelector('span');
      expect(initials?.textContent?.trim()).toBe('JD');
      expect(component.initialsClasses()).toContain('font-medium');
      expect(component.initialsClasses()).toContain('bg-bg-secondary');
    });

    it('supports empty initials without crashing', async () => {
      const { host } = await renderAvatar({
        inputs: { variant: 'initials', initials: '' },
      });

      const initials = host.querySelector('span');
      expect(initials?.textContent?.trim()).toBe('');
    });
  });

  describe('size handling', () => {
    const sizeExpectations: Record<AvatarSize, { container: string; text: string; indicator: string }> = {
      xs: { container: 'w-6 h-6', text: 'text-xs', indicator: 'w-2 h-2' },
      sm: { container: 'w-8 h-8', text: 'text-sm', indicator: 'w-2.5 h-2.5' },
      md: { container: 'w-10 h-10', text: 'text-base', indicator: 'w-3.5 h-3.5' },
      lg: { container: 'w-20 h-20', text: 'text-2xl', indicator: 'w-5 h-5' },
      xl: { container: 'w-36 h-36', text: 'text-5xl', indicator: 'w-8 h-8' },
    };

    (Object.keys(sizeExpectations) as AvatarSize[]).forEach((size) => {
      it(`applies classes for size ${size}`, async () => {
        const { component } = await renderAvatar({
          inputs: { size, variant: 'initials', initials: 'JD', statusIndicator: 'online' },
        });

        expect(component.containerClasses()).toContain(sizeExpectations[size].container);
        expect(component.initialsClasses()).toContain(sizeExpectations[size].text);
        expect(component.indicatorClasses()).toContain(sizeExpectations[size].indicator);
      });
    });
  });

  describe('shape handling', () => {
    const shapeExpectations: Record<AvatarShape, string> = {
      full: 'rounded-full',
      sm: 'rounded-sm',
    };

    (Object.keys(shapeExpectations) as AvatarShape[]).forEach((shape) => {
      it(`applies ${shape} to container, image, and initials`, async () => {
        const { component } = await renderAvatar({
          inputs: {
            shape,
            variant: 'initials',
            initials: 'JD',
          },
        });

        expect(component.containerClasses()).toContain(shapeExpectations[shape]);
        expect(component.imageClasses()).toContain(shapeExpectations[shape]);
        expect(component.initialsClasses()).toContain(shapeExpectations[shape]);
      });
    });
  });

  describe('status indicator', () => {
    it('omits the indicator by default', async () => {
      const { host } = await renderAvatar();
      expect(host.querySelector('span.absolute.rounded-full')).toBeNull();
    });

    it('renders indicator with correct color and positioning', async () => {
      const { component, host } = await renderAvatar({
        inputs: { statusIndicator: 'away', statusPosition: 'top-left', size: 'md' },
      });

      const indicator = host.querySelector('span.absolute.rounded-full');
      expect(indicator).toBeTruthy();
      expect(component.indicatorClasses()).toContain('top-0 left-0');
      expect(component.indicatorClasses()).toContain('bg-yellow-400');
      expect(component.indicatorClasses()).toContain('border-2');
    });

    it('supports multiple indicator positions', async () => {
      const positions: Array<['top-left' | 'top-right' | 'bottom-left' | 'bottom-right', string]> = [
        ['top-left', 'top-0 left-0'],
        ['top-right', 'top-0 right-0'],
        ['bottom-left', 'bottom-0 left-0'],
        ['bottom-right', 'bottom-0 right-0'],
      ];

      for (const [position, expected] of positions) {
        const { component } = await renderAvatar({
          inputs: { statusIndicator: 'online', statusPosition: position },
        });

        expect(component.indicatorClasses()).toContain(expected);
      }
    });
  });

  describe('computed class composition', () => {
    it('combines container classes consistently', async () => {
      const { component } = await renderAvatar({ inputs: { size: 'lg', shape: 'sm' } });
      expect(component.containerClasses()).toContain('w-20 h-20');
      expect(component.containerClasses()).toContain('rounded-sm');
      expect(component.containerClasses()).toContain('overflow-hidden');
    });

    it('combines initials classes consistently', async () => {
      const { component } = await renderAvatar({
        inputs: { variant: 'initials', initials: 'JD', size: 'sm', shape: 'full' },
      });

      const classes = component.initialsClasses();
      ['font-medium', 'text-sm', 'text-text-primary', 'bg-bg-secondary', 'rounded-full'].forEach((cls) => {
        expect(classes).toContain(cls);
      });
    });
  });

  describe('data-testid integration', () => {
    it('generates prefixed IDs when host attribute is provided', async () => {
      const fixture = TestBed.createComponent(AvatarHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      const hostElement = fixture.nativeElement.querySelector('app-avatar') as HTMLElement;
      const avatarInstance = fixture.componentInstance.avatar;

      expect(avatarInstance.componentTestId()).toBe('user-avatar-avatar');
      expect(avatarInstance.imageTestId()).toBe('user-avatar-image');
      expect(avatarInstance.indicatorTestId()).toBe('user-avatar-indicator');
      expect(hostElement.getAttribute('data-testid')).toBe('user-avatar-avatar');
    });

    it('returns null when no host attribute is provided', async () => {
      const { component } = await renderAvatar();
      expect(component.componentTestId()).toBeNull();
      expect(component.imageTestId()).toBeNull();
      expect(component.initialsTestId()).toBeNull();
      expect(component.placeholderTestId()).toBeNull();
      expect(component.indicatorTestId()).toBeNull();
    });
  });

  describe('reactivity', () => {
    it('updates when inputs change via rerender', async () => {
      const { rerender, host } = await renderAvatar({
        inputs: { variant: 'placeholder' },
      });

      expect(host.querySelector('svg')).toBeTruthy();

      await rerender({ inputs: { variant: 'initials', initials: 'AB' } });

      expect(host.querySelector('svg')).toBeNull();
      expect(host.querySelector('span')?.textContent?.trim()).toBe('AB');
    });

    it('handles empty strings across inputs', async () => {
      const { host } = await renderAvatar({
        inputs: { variant: 'image', imageSrc: '', imageAlt: '', initials: '' },
      });

      const img = host.querySelector('img');
      expect(img?.getAttribute('src')).toBe('');
      expect(img?.getAttribute('alt')).toBe('');
    });
  });

  describe('accessibility and layout', () => {
    it('keeps content centered and inline-flex', async () => {
      const { host } = await renderAvatar();
      const container = host.querySelector('.inline-flex');
      expect(container).toBeTruthy();
      expect(container?.classList.contains('items-center')).toBe(true);
      expect(container?.classList.contains('justify-center')).toBe(true);
    });
  });
});
