import { describe, expect, it } from 'vitest';
import { Component, ViewChild, inputBinding } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { Avatar, AvatarSize, AvatarShape, AvatarVariant, StatusIndicator } from './avatar';

@Component({
  selector: 'app-avatar-host',
  standalone: true,
  imports: [Avatar],
  template: `
    <app-avatar
      [dataTestId]="'user-avatar'"
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
  describe('defaults', () => {
    it('renders a placeholder icon with default configuration', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar);
      const component = fixture.componentInstance;
      TestBed.tick();

      // Assert
      expect(component.variant()).toBe('placeholder');
      expect(fixture.nativeElement.querySelector('svg')).toBeTruthy();
      expect(component.size()).toBe('md');
      expect(component.shape()).toBe('full');
      expect(component.statusIndicator()).toBeNull();
    });
  });

  describe('placeholder variant', () => {
    it('shows the placeholder SVG with expected attributes', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar, {
        bindings: [inputBinding('variant', () => 'placeholder')],
      });
      TestBed.tick();
      const host = fixture.nativeElement;

      // Assert
      const svg = host.querySelector('svg');
      const path = host.querySelector('svg path');
      expect(svg?.getAttribute('fill')).toBe('currentColor');
      expect(svg?.getAttribute('viewBox')).toBe('0 0 20 20');
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
      expect(path?.getAttribute('d')).toBe('M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z');
      expect(fixture.componentInstance.placeholderIconClasses()).toContain('-left-1');
    });

    it('adjusts placeholder icon size when avatar size changes', () => {
      // Arrange - Test with xs size
      const fixtureXs = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar, {
        bindings: [
          inputBinding('variant', () => 'placeholder'),
          inputBinding('size', () => 'xs'),
        ],
      });
      TestBed.tick();
      expect(fixtureXs.componentInstance.placeholderIconClasses()).toContain('w-8 h-8');

      // Act - Create new component with xl size
      const fixtureXl = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar, {
        bindings: [
          inputBinding('variant', () => 'placeholder'),
          inputBinding('size', () => 'xl'),
        ],
      });
      TestBed.tick();

      // Assert
      expect(fixtureXl.componentInstance.placeholderIconClasses()).toContain('w-40 h-40');
    });
  });

  describe('image variant', () => {
    it('renders the provided image source and alt text', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar, {
        bindings: [
          inputBinding('variant', () => 'image'),
          inputBinding('imageSrc', () => 'https://example.com/avatar.jpg'),
          inputBinding('imageAlt', () => 'Jane Doe'),
        ],
      });
      TestBed.tick();
      const host = fixture.nativeElement;

      // Assert
      const img = host.querySelector('img');
      expect(img?.getAttribute('src')).toBe('https://example.com/avatar.jpg');
      expect(img?.getAttribute('alt')).toBe('Jane Doe');
      expect(fixture.componentInstance.imageClasses()).toContain('object-cover');
    });

    it('falls back to default alt text when none is supplied', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar, {
        bindings: [
          inputBinding('variant', () => 'image'),
          inputBinding('imageSrc', () => 'test.jpg'),
        ],
      });
      TestBed.tick();

      // Assert
      expect(fixture.nativeElement.querySelector('img')?.getAttribute('alt')).toBe('Avatar');
    });
  });

  describe('initials variant', () => {
    it('renders provided initials and associated classes', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar, {
        bindings: [
          inputBinding('variant', () => 'initials'),
          inputBinding('initials', () => 'JD'),
        ],
      });
      TestBed.tick();
      const host = fixture.nativeElement;

      // Assert
      const initials = host.querySelector('span');
      expect(initials?.textContent?.trim()).toBe('JD');
      expect(fixture.componentInstance.initialsClasses()).toContain('font-medium');
      expect(fixture.componentInstance.initialsClasses()).toContain('bg-bg-secondary');
    });

    it('supports empty initials without crashing', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar, {
        bindings: [
          inputBinding('variant', () => 'initials'),
          inputBinding('initials', () => ''),
        ],
      });
      TestBed.tick();

      // Assert
      const initials = fixture.nativeElement.querySelector('span');
      expect(initials?.textContent?.trim()).toBe('');
    });
  });

  describe('size handling', () => {
    const sizeExpectations: Record<
      AvatarSize,
      { container: string; text: string; indicator: string }
    > = {
      xs: { container: 'w-6 h-6', text: 'text-xs', indicator: 'w-2 h-2' },
      sm: { container: 'w-8 h-8', text: 'text-sm', indicator: 'w-2.5 h-2.5' },
      md: { container: 'w-10 h-10', text: 'text-base', indicator: 'w-3.5 h-3.5' },
      lg: { container: 'w-20 h-20', text: 'text-2xl', indicator: 'w-5 h-5' },
      xl: { container: 'w-36 h-36', text: 'text-5xl', indicator: 'w-8 h-8' },
    };

    (Object.keys(sizeExpectations) as AvatarSize[]).forEach((size) => {
      it(`applies classes for size ${size}`, () => {
        // Arrange
        const fixture = TestBed.configureTestingModule({
          providers: [provideZonelessChangeDetection()],
        }).createComponent(Avatar, {
          bindings: [
            inputBinding('size', () => size),
            inputBinding('variant', () => 'initials'),
            inputBinding('initials', () => 'JD'),
            inputBinding('statusIndicator', () => 'online'),
          ],
        });
        TestBed.tick();
        const component = fixture.componentInstance;

        // Assert
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
      it(`applies ${shape} to container, image, and initials`, () => {
        // Arrange
        const fixture = TestBed.configureTestingModule({
          providers: [provideZonelessChangeDetection()],
        }).createComponent(Avatar, {
          bindings: [
            inputBinding('shape', () => shape),
            inputBinding('variant', () => 'initials'),
            inputBinding('initials', () => 'JD'),
          ],
        });
        TestBed.tick();
        const component = fixture.componentInstance;

        // Assert
        expect(component.containerClasses()).toContain(shapeExpectations[shape]);
        expect(component.imageClasses()).toContain(shapeExpectations[shape]);
        expect(component.initialsClasses()).toContain(shapeExpectations[shape]);
      });
    });
  });

  describe('status indicator', () => {
    it('omits the indicator by default', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar);
      TestBed.tick();

      // Assert
      expect(fixture.nativeElement.querySelector('span.absolute.rounded-full')).toBeNull();
    });

    it('renders indicator with correct color and positioning', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar, {
        bindings: [
          inputBinding('statusIndicator', () => 'away'),
          inputBinding('statusPosition', () => 'top-left'),
          inputBinding('size', () => 'md'),
        ],
      });
      TestBed.tick();
      const component = fixture.componentInstance;

      // Assert
      const indicator = fixture.nativeElement.querySelector('span.absolute.rounded-full');
      expect(indicator).toBeTruthy();
      expect(component.indicatorClasses()).toContain('top-0 left-0');
      expect(component.indicatorClasses()).toContain('bg-yellow-400');
      expect(component.indicatorClasses()).toContain('border-2');
    });

    it('supports multiple indicator positions', () => {
      // Arrange & Assert - Test top-left
      const fixtureTopLeft = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar, {
        bindings: [
          inputBinding('statusIndicator', () => 'online'),
          inputBinding('statusPosition', () => 'top-left'),
        ],
      });
      TestBed.tick();
      expect(fixtureTopLeft.componentInstance.indicatorClasses()).toContain('top-0 left-0');

      // Test top-right
      const fixtureTopRight = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar, {
        bindings: [
          inputBinding('statusIndicator', () => 'online'),
          inputBinding('statusPosition', () => 'top-right'),
        ],
      });
      TestBed.tick();
      expect(fixtureTopRight.componentInstance.indicatorClasses()).toContain('top-0 right-0');

      // Test bottom-left
      const fixtureBottomLeft = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar, {
        bindings: [
          inputBinding('statusIndicator', () => 'online'),
          inputBinding('statusPosition', () => 'bottom-left'),
        ],
      });
      TestBed.tick();
      expect(fixtureBottomLeft.componentInstance.indicatorClasses()).toContain('bottom-0 left-0');

      // Test bottom-right
      const fixtureBottomRight = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar, {
        bindings: [
          inputBinding('statusIndicator', () => 'online'),
          inputBinding('statusPosition', () => 'bottom-right'),
        ],
      });
      TestBed.tick();
      expect(fixtureBottomRight.componentInstance.indicatorClasses()).toContain('bottom-0 right-0');
    });
  });

  describe('computed class composition', () => {
    it('combines container classes consistently', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar, {
        bindings: [
          inputBinding('size', () => 'lg'),
          inputBinding('shape', () => 'sm'),
        ],
      });
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.containerClasses()).toContain('w-20 h-20');
      expect(fixture.componentInstance.containerClasses()).toContain('rounded-sm');
      expect(fixture.componentInstance.containerClasses()).toContain('overflow-hidden');
    });

    it('combines initials classes consistently', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar, {
        bindings: [
          inputBinding('variant', () => 'initials'),
          inputBinding('initials', () => 'JD'),
          inputBinding('size', () => 'sm'),
          inputBinding('shape', () => 'full'),
        ],
      });
      TestBed.tick();

      // Assert
      const classes = fixture.componentInstance.initialsClasses();
      ['font-medium', 'text-sm', 'text-text-primary', 'bg-bg-secondary', 'rounded-full'].forEach(
        (cls) => {
          expect(classes).toContain(cls);
        },
      );
    });
  });

  describe('data-testid integration', () => {
    it('generates prefixed IDs when host attribute is provided', () => {
      // Arrange
      TestBed.configureTestingModule({
        imports: [AvatarHostComponent],
        providers: [provideZonelessChangeDetection()],
      });
      const fixture = TestBed.createComponent(AvatarHostComponent);
      TestBed.tick();

      // Act
      const hostElement = fixture.nativeElement.querySelector('app-avatar') as HTMLElement;
      const avatarInstance = fixture.componentInstance.avatar;

      // Assert
      expect(avatarInstance.componentTestId()).toBe('user-avatar-avatar');
      expect(avatarInstance.imageTestId()).toBe('user-avatar-image');
      expect(avatarInstance.indicatorTestId()).toBe('user-avatar-indicator');
      expect(hostElement.getAttribute('data-testid')).toBe('user-avatar-avatar');
    });

    it('returns null when no host attribute is provided', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar);
      TestBed.tick();
      const component = fixture.componentInstance;

      // Assert
      expect(component.componentTestId()).toBeNull();
      expect(component.imageTestId()).toBeNull();
      expect(component.initialsTestId()).toBeNull();
      expect(component.placeholderTestId()).toBeNull();
      expect(component.indicatorTestId()).toBeNull();
    });
  });

  describe('reactivity', () => {
    it('updates when inputs change via rerender', () => {
      // Arrange - Test placeholder variant
      const fixturePlaceholder = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar, {
        bindings: [inputBinding('variant', () => 'placeholder')],
      });
      TestBed.tick();
      expect(fixturePlaceholder.nativeElement.querySelector('svg')).toBeTruthy();

      // Act - Create new component with initials variant
      const fixtureInitials = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar, {
        bindings: [
          inputBinding('variant', () => 'initials'),
          inputBinding('initials', () => 'AB'),
        ],
      });
      TestBed.tick();

      // Assert
      expect(fixtureInitials.nativeElement.querySelector('svg')).toBeNull();
      expect(fixtureInitials.nativeElement.querySelector('span')?.textContent?.trim()).toBe('AB');
    });

    it('handles empty strings across inputs', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar, {
        bindings: [
          inputBinding('variant', () => 'image'),
          inputBinding('imageSrc', () => ''),
          inputBinding('imageAlt', () => ''),
          inputBinding('initials', () => ''),
        ],
      });
      TestBed.tick();
      const host = fixture.nativeElement;

      // Assert
      const img = host.querySelector('img');
      expect(img?.getAttribute('src')).toBe('');
      expect(img?.getAttribute('alt')).toBe('');
    });
  });

  describe('accessibility and layout', () => {
    it('keeps content centered and inline-flex', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Avatar);
      TestBed.tick();
      const host = fixture.nativeElement;

      // Assert
      const container = host.querySelector('.inline-flex');
      expect(container).toBeTruthy();
      expect(container?.classList.contains('items-center')).toBe(true);
      expect(container?.classList.contains('justify-center')).toBe(true);
    });
  });
});
