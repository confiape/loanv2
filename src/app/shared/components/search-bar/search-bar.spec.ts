// Angular testing
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, inputBinding, outputBinding, signal } from '@angular/core';

// Testing library
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

// Vitest
import { describe, it, expect } from 'vitest';

// Component under test
import { SearchBarComponent } from '@loan/app/shared/components/search-bar/search-bar';

describe('SearchBarComponent', () => {
  describe('initialization', () => {
    it('creates the component', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance).toBeDefined();
    });

    it('has default input values', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;

      // Assert
      expect(component.placeholder()).toBe('Search');
      expect(component.disabled()).toBe(false);
      expect(component.showOnMobile()).toBe(false);
      expect(component.size()).toBe('md');
    });

    it('initializes state signals correctly', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;

      // Assert
      expect(component.searchQuery()).toBe('');
      expect(component.isFocused()).toBe(false);
    });

    it('renders the form element', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const form = queries.getByRole('search');
      expect(form).toBeTruthy();
      expect(form.getAttribute('aria-label')).toBe('Search form');
    });

    it('renders the search input', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      expect(queries.getByRole('textbox')).toBeTruthy();
    });
  });

  describe('placeholder input', () => {
    it('accepts custom placeholder', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [inputBinding('placeholder', () => 'Search loans...')],
      });
      TestBed.tick();
      const component = fixture.componentInstance;

      // Assert
      expect(component.placeholder()).toBe('Search loans...');
    });

    it('displays placeholder on input element', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [inputBinding('placeholder', () => 'Find customers')],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const input = queries.getByRole('textbox') as HTMLInputElement;
      expect(input.placeholder).toBe('Find customers');
    });

    it('sets aria-label from placeholder', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [inputBinding('placeholder', () => 'Search reports')],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const input = queries.getByRole('textbox');
      expect(input.getAttribute('aria-label')).toBe('Search reports');
    });
  });

  describe('disabled input', () => {
    it('disables input when disabled is true', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [inputBinding('disabled', () => true)],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const input = queries.getByRole('textbox') as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it('enables input when disabled is false', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [inputBinding('disabled', () => false)],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const input = queries.getByRole('textbox') as HTMLInputElement;
      expect(input.disabled).toBe(false);
    });

    it('applies disabled styles', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [inputBinding('disabled', () => true)],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const input = queries.getByRole('textbox');
      expect(input.className).toContain('disabled:bg-bg-disabled');
      expect(input.className).toContain('disabled:cursor-not-allowed');
    });

    it('hides clear button when disabled', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [inputBinding('disabled', () => true)],
      });
      TestBed.tick();
      const component = fixture.componentInstance;
      const queries = within(fixture.nativeElement);
      component.searchQuery.set('test query');
      TestBed.tick();

      // Assert
      expect(queries.queryByLabelText('Clear search')).toBeFalsy();
    });
  });

  describe('showOnMobile input', () => {
    it('controls mobile visibility', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [inputBinding('showOnMobile', () => false)],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const form = queries.getByRole('search');
      expect(form.className).toContain('hidden');
    });

    it('shows on mobile when true', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [inputBinding('showOnMobile', () => true)],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const form = queries.getByRole('search');
      expect(form.className).not.toContain('hidden');
    });
  });

  describe('size input', () => {
    it('applies small size classes', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [inputBinding('size', () => 'sm')],
      });
      TestBed.tick();
      const component = fixture.componentInstance;

      // Assert
      expect(component.inputClasses).toContain('text-xs');
      expect(component.inputClasses).toContain('p-1.5');
    });

    it('applies medium size classes', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [inputBinding('size', () => 'md')],
      });
      TestBed.tick();
      const component = fixture.componentInstance;

      // Assert
      expect(component.inputClasses).toContain('text-sm');
      expect(component.inputClasses).toContain('p-2.5');
    });

    it('applies large size classes', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [inputBinding('size', () => 'lg')],
      });
      TestBed.tick();
      const component = fixture.componentInstance;

      // Assert
      expect(component.inputClasses).toContain('text-base');
      expect(component.inputClasses).toContain('p-3');
    });

    it('includes base classes for all sizes', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;
      const baseClasses = ['bg-bg-secondary', 'border', 'rounded-lg', 'focus:ring-2'];

      // Assert
      baseClasses.forEach((cls) => {
        expect(component.inputClasses).toContain(cls);
      });
    });
  });

  describe('searchQuery signal', () => {
    it('updates searchQuery when input changes', async () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;
      const queries = within(fixture.nativeElement);
      const user = userEvent.setup();

      // Act
      const input = queries.getByRole('textbox') as HTMLInputElement;
      await user.type(input, 'test search');
      component.searchQuery.set('test search');
      TestBed.tick();

      // Assert
      expect(component.searchQuery()).toBe('test search');
    });

    it('shows clear button when searchQuery has value', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;
      const queries = within(fixture.nativeElement);

      // Act
      component.searchQuery.set('test');
      TestBed.tick();

      // Assert
      expect(queries.getByLabelText('Clear search')).toBeTruthy();
    });

    it('hides clear button when searchQuery is empty', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;
      const queries = within(fixture.nativeElement);

      // Act
      component.searchQuery.set('');
      TestBed.tick();

      // Assert
      expect(queries.queryByLabelText('Clear search')).toBeFalsy();
    });
  });

  describe('searchChange output', () => {
    it('emits search query when input changes', () => {
      // Arrange
      const searchChangeSignal = signal<string>('');
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [outputBinding('searchChange', (value: string) => searchChangeSignal.set(value))],
      });
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act
      component.searchQuery.set('test query');
      component.onSearchInput();

      // Assert
      expect(searchChangeSignal()).toBe('test query');
    });

    it('emits empty string', () => {
      // Arrange
      const searchChangeSignal = signal<string>('initial');
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [outputBinding('searchChange', (value: string) => searchChangeSignal.set(value))],
      });
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act
      component.searchQuery.set('');
      component.onSearchInput();

      // Assert
      expect(searchChangeSignal()).toBe('');
    });

    it('emits on every input change', () => {
      // Arrange
      const emittedValues: string[] = [];
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [outputBinding('searchChange', (value: string) => emittedValues.push(value))],
      });
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act
      component.searchQuery.set('t');
      component.onSearchInput();
      component.searchQuery.set('te');
      component.onSearchInput();
      component.searchQuery.set('tes');
      component.onSearchInput();

      // Assert
      expect(emittedValues).toEqual(['t', 'te', 'tes']);
    });
  });

  describe('searchSubmit output', () => {
    it('emits search query when form is submitted', () => {
      // Arrange
      const searchSubmitSignal = signal<string>('');
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [outputBinding('searchSubmit', (value: string) => searchSubmitSignal.set(value))],
      });
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act
      component.searchQuery.set('submitted query');
      const event = new Event('submit');
      component.onSearchSubmit(event);

      // Assert
      expect(searchSubmitSignal()).toBe('submitted query');
    });

    it('prevents default form submission', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;
      const event = new Event('submit');
      let defaultPrevented = false;
      event.preventDefault = () => {
        defaultPrevented = true;
      };

      // Act
      component.onSearchSubmit(event);

      // Assert
      expect(defaultPrevented).toBe(true);
    });
  });

  describe('focus state', () => {
    it('sets isFocused to true on focus', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act
      component.onFocus();

      // Assert
      expect(component.isFocused()).toBe(true);
    });

    it('sets isFocused to false on blur', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act
      component.onFocus();
      expect(component.isFocused()).toBe(true);
      component.onBlur();

      // Assert
      expect(component.isFocused()).toBe(false);
    });

    it('tracks focus state changes', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act & Assert
      component.onFocus();
      expect(component.isFocused()).toBe(true);

      component.onBlur();
      expect(component.isFocused()).toBe(false);

      component.onFocus();
      expect(component.isFocused()).toBe(true);
    });
  });

  describe('clear search', () => {
    it('clears search query', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act
      component.searchQuery.set('test query');
      component.clearSearch();

      // Assert
      expect(component.searchQuery()).toBe('');
    });

    it('emits empty string when clearing', () => {
      // Arrange
      const searchChangeSignal = signal<string>('initial');
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [outputBinding('searchChange', (value: string) => searchChangeSignal.set(value))],
      });
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act
      component.searchQuery.set('test');
      component.clearSearch();

      // Assert
      expect(searchChangeSignal()).toBe('');
    });

    it('clears from non-empty to empty', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act
      component.searchQuery.set('long search query');
      expect(component.searchQuery()).toBe('long search query');
      component.clearSearch();

      // Assert
      expect(component.searchQuery()).toBe('');
    });

    it('handles clearing already empty search', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act
      component.searchQuery.set('');

      // Assert
      expect(() => component.clearSearch()).not.toThrow();
      expect(component.searchQuery()).toBe('');
    });
  });

  describe('clear button rendering', () => {
    it('renders clear button when there is text', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;
      const queries = within(fixture.nativeElement);

      // Act
      component.searchQuery.set('text');
      TestBed.tick();

      // Assert
      expect(queries.getByLabelText('Clear search')).toBeTruthy();
    });

    it('clear button triggers clearSearch', async () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;
      const queries = within(fixture.nativeElement);
      const user = userEvent.setup();
      component.searchQuery.set('text');
      TestBed.tick();

      // Act
      const clearButton = queries.getByLabelText('Clear search') as HTMLButtonElement;
      await user.click(clearButton);
      TestBed.tick();

      // Assert
      expect(component.searchQuery()).toBe('');
    });

    it('positions clear button absolutely', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;
      const queries = within(fixture.nativeElement);

      // Act
      component.searchQuery.set('text');
      TestBed.tick();

      // Assert
      const clearButton = queries.getByLabelText('Clear search') as HTMLElement;
      expect(clearButton.className).toContain('absolute');
      expect(clearButton.className).toContain('right-2');
    });
  });

  describe('search icon', () => {
    it('renders search icon', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const icon = queries.queryByRole('search')?.querySelector('svg');
      expect(icon).toBeTruthy();
    });

    it('positions search icon on the left', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const host = fixture.nativeElement as HTMLElement;

      // Assert
      const iconWrapper = host.querySelector('.absolute.inset-y-0.left-0');
      expect(iconWrapper).toBeTruthy();
    });

    it('hides icon from pointer events', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const host = fixture.nativeElement as HTMLElement;

      // Assert
      const iconWrapper = host.querySelector('.pointer-events-none');
      expect(iconWrapper).toBeTruthy();
    });

    it('marks icon as decorative with aria-hidden', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const host = fixture.nativeElement as HTMLElement;

      // Assert
      const iconWrapper = host.querySelector('.pointer-events-none');
      expect(iconWrapper?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('label accessibility', () => {
    it('renders label with sr-only class', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const host = fixture.nativeElement as HTMLElement;

      // Assert
      const label = host.querySelector('label');
      expect(label).toBeTruthy();
      expect(label?.className).toContain('sr-only');
    });

    it('associates label with input', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const host = fixture.nativeElement as HTMLElement;

      // Assert
      const label = host.querySelector('label');
      const input = host.querySelector('input');
      expect(label?.getAttribute('for')).toBe('search-input');
      expect(input?.id).toBe('search-input');
    });

    it('label text matches placeholder', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [inputBinding('placeholder', () => 'Search users')],
      });
      TestBed.tick();
      const host = fixture.nativeElement as HTMLElement;

      // Assert
      const label = host.querySelector('label');
      expect(label?.textContent).toBe('Search users');
    });
  });

  describe('inputClasses getter', () => {
    it('returns string of classes', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;

      // Assert
      expect(typeof component.inputClasses).toBe('string');
    });

    it('includes all required base classes', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;
      const classes = component.inputClasses;

      // Assert
      expect(classes).toContain('bg-bg-secondary');
      expect(classes).toContain('border');
      expect(classes).toContain('rounded-lg');
      expect(classes).toContain('focus:ring-2');
      expect(classes).toContain('pl-10');
    });

    it('includes disabled classes', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;
      const classes = component.inputClasses;

      // Assert
      expect(classes).toContain('disabled:bg-bg-disabled');
      expect(classes).toContain('disabled:cursor-not-allowed');
      expect(classes).toContain('disabled:opacity-60');
    });

    it('changes based on size input', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [inputBinding('size', () => 'sm')],
      });
      TestBed.tick();
      const component = fixture.componentInstance;
      expect(component.inputClasses).toContain('text-xs');
    });
  });

  describe('edge cases', () => {
    it('handles very long search queries', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;
      const longQuery = 'a'.repeat(500);

      // Act
      component.searchQuery.set(longQuery);

      // Assert
      expect(component.searchQuery()).toBe(longQuery);
    });

    it('handles special characters in search', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;
      const specialQuery = '<script>alert("xss")</script>';

      // Act
      component.searchQuery.set(specialQuery);

      // Assert
      expect(component.searchQuery()).toBe(specialQuery);
    });

    it('handles empty placeholder', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [inputBinding('placeholder', () => '')],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const input = queries.getByRole('textbox') as HTMLInputElement;
      expect(input.placeholder).toBe('');
    });

    it('handles rapid typing simulation', () => {
      // Arrange
      const emittedValues: string[] = [];
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [outputBinding('searchChange', (value: string) => emittedValues.push(value))],
      });
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act
      'test query'.split('').forEach((char, index) => {
        component.searchQuery.set('test query'.substring(0, index + 1));
        component.onSearchInput();
      });

      // Assert
      expect(emittedValues.length).toBe(10);
    });

    it('handles multiple clears', () => {
      // Arrange
      const searchChangeSignal = signal<string>('');
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [outputBinding('searchChange', (value: string) => searchChangeSignal.set(value))],
      });
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act
      component.searchQuery.set('test');
      component.clearSearch();
      component.searchQuery.set('another');
      component.clearSearch();

      // Assert
      expect(searchChangeSignal()).toBe('');
      expect(component.searchQuery()).toBe('');
    });

    it('handles form submission with empty query', () => {
      // Arrange
      const searchSubmitSignal = signal<string>('');
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [outputBinding('searchSubmit', (value: string) => searchSubmitSignal.set(value))],
      });
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act
      component.searchQuery.set('');
      component.onSearchSubmit(new Event('submit'));

      // Assert
      expect(searchSubmitSignal()).toBe('');
    });

    it('maintains state after multiple focus/blur cycles', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act
      for (let i = 0; i < 10; i++) {
        component.onFocus();
        component.onBlur();
      }

      // Assert
      expect(component.isFocused()).toBe(false);
    });
  });

  describe('styling', () => {
    it('applies transition-colors to input', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const input = queries.getByRole('textbox');
      expect(input.className).toContain('transition-colors');
    });

    it('applies focus styles', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const input = queries.getByRole('textbox');
      expect(input.className).toContain('focus:ring-accent');
      expect(input.className).toContain('focus:border-accent');
    });

    it('applies hover styles to clear button', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const component = fixture.componentInstance;
      const queries = within(fixture.nativeElement);

      // Act
      component.searchQuery.set('test');
      TestBed.tick();

      // Assert
      const clearButton = queries.getByLabelText('Clear search');
      expect(clearButton.className).toContain('hover:bg-bg-secondary');
    });

    it('has proper width styling', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const input = queries.getByRole('textbox');
      expect(input.className).toContain('w-full');
    });
  });

  describe('responsive behavior', () => {
    it('hides on mobile by default', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent);
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const form = queries.getByRole('search');
      expect(form.className).toContain('hidden');
    });

    it('can show on mobile when configured', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [inputBinding('showOnMobile', () => true)],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const form = queries.getByRole('search');
      expect(form.className).not.toContain('hidden');
    });
  });

  describe('integration scenarios', () => {
    it('simulates user typing and submitting', () => {
      // Arrange
      const changeValues: string[] = [];
      const submitSignal = signal<string>('');
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [
          outputBinding('searchChange', (value: string) => changeValues.push(value)),
          outputBinding('searchSubmit', (value: string) => submitSignal.set(value)),
        ],
      });
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act
      component.searchQuery.set('test');
      component.onSearchInput();

      component.searchQuery.set('test query');
      component.onSearchInput();

      component.onSearchSubmit(new Event('submit'));

      // Assert
      expect(changeValues).toEqual(['test', 'test query']);
      expect(submitSignal()).toBe('test query');
    });

    it('simulates typing, clearing, and typing again', () => {
      // Arrange
      const emittedValues: string[] = [];
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [outputBinding('searchChange', (value: string) => emittedValues.push(value))],
      });
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act
      component.searchQuery.set('first');
      component.onSearchInput();

      component.clearSearch();

      component.searchQuery.set('second');
      component.onSearchInput();

      // Assert
      expect(emittedValues).toContain('first');
      expect(emittedValues).toContain('');
      expect(emittedValues).toContain('second');
    });

    it('handles disabled state during typing', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(SearchBarComponent, {
        bindings: [inputBinding('disabled', () => true)],
      });
      TestBed.tick();
      const component = fixture.componentInstance;
      const queries = within(fixture.nativeElement);

      // Act
      component.searchQuery.set('test');
      TestBed.tick();

      // Assert
      expect(queries.queryByLabelText('Clear search')).toBeFalsy();
    });
  });
});
