import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { SearchBarComponent } from '@loan/app/shared/components/search-bar/search-bar';

describe('SearchBarComponent', () => {
  let fixture: ComponentFixture<SearchBarComponent>;
  let component: SearchBarComponent;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent],
      providers: [
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  describe('initialization', () => {
    it('creates the component', () => {
      expect(component).toBeDefined();
    });

    it('has default input values', () => {
      expect(component.placeholder()).toBe('Search');
      expect(component.disabled()).toBe(false);
      expect(component.showOnMobile()).toBe(false);
      expect(component.size()).toBe('md');
    });

    it('initializes state signals correctly', () => {
      expect(component.searchQuery()).toBe('');
      expect(component.isFocused()).toBe(false);
    });

    it('renders the form element', () => {
      const form = host.querySelector('form');
      expect(form).toBeTruthy();
      expect(form?.getAttribute('role')).toBe('search');
      expect(form?.getAttribute('aria-label')).toBe('Search form');
    });

    it('renders the search input', () => {
      const input = host.querySelector('input[type="text"]');
      expect(input).toBeTruthy();
    });
  });

  describe('placeholder input', () => {
    it('accepts custom placeholder', () => {
      fixture.componentRef.setInput('placeholder', 'Search loans...');
      fixture.detectChanges();

      expect(component.placeholder()).toBe('Search loans...');
    });

    it('displays placeholder on input element', () => {
      fixture.componentRef.setInput('placeholder', 'Find customers');
      fixture.detectChanges();

      const input = host.querySelector('input') as HTMLInputElement;
      expect(input.placeholder).toBe('Find customers');
    });

    it('updates placeholder dynamically', () => {
      fixture.componentRef.setInput('placeholder', 'First');
      fixture.detectChanges();
      let input = host.querySelector('input') as HTMLInputElement;
      expect(input.placeholder).toBe('First');

      fixture.componentRef.setInput('placeholder', 'Second');
      fixture.detectChanges();
      input = host.querySelector('input') as HTMLInputElement;
      expect(input.placeholder).toBe('Second');
    });

    it('sets aria-label from placeholder', () => {
      fixture.componentRef.setInput('placeholder', 'Search reports');
      fixture.detectChanges();

      const input = host.querySelector('input');
      expect(input?.getAttribute('aria-label')).toBe('Search reports');
    });
  });

  describe('disabled input', () => {
    it('disables input when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const input = host.querySelector('input') as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it('enables input when disabled is false', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();

      const input = host.querySelector('input') as HTMLInputElement;
      expect(input.disabled).toBe(false);
    });

    it('applies disabled styles', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const input = host.querySelector('input');
      expect(input?.className).toContain('disabled:bg-bg-disabled');
      expect(input?.className).toContain('disabled:cursor-not-allowed');
    });

    it('hides clear button when disabled', () => {
      component.searchQuery.set('test query');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const clearButton = host.querySelector('button[aria-label="Clear search"]');
      expect(clearButton).toBeFalsy();
    });
  });

  describe('showOnMobile input', () => {
    it('controls mobile visibility', () => {
      fixture.componentRef.setInput('showOnMobile', false);
      fixture.detectChanges();

      const form = host.querySelector('form');
      expect(form?.className).toContain('hidden');
    });

    it('shows on mobile when true', () => {
      fixture.componentRef.setInput('showOnMobile', true);
      fixture.detectChanges();

      const form = host.querySelector('form');
      expect(form?.className).not.toContain('hidden');
    });
  });

  describe('size input', () => {
    it('applies small size classes', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();

      expect(component.inputClasses).toContain('text-xs');
      expect(component.inputClasses).toContain('p-1.5');
    });

    it('applies medium size classes', () => {
      fixture.componentRef.setInput('size', 'md');
      fixture.detectChanges();

      expect(component.inputClasses).toContain('text-sm');
      expect(component.inputClasses).toContain('p-2.5');
    });

    it('applies large size classes', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();

      expect(component.inputClasses).toContain('text-base');
      expect(component.inputClasses).toContain('p-3');
    });

    it('includes base classes for all sizes', () => {
      const baseClasses = ['bg-bg-secondary', 'border', 'rounded-lg', 'focus:ring-2'];

      baseClasses.forEach((cls) => {
        expect(component.inputClasses).toContain(cls);
      });
    });
  });

  describe('searchQuery signal', () => {
    it('updates searchQuery when input changes', () => {
      const input = host.querySelector('input') as HTMLInputElement;
      input.value = 'test search';
      component.searchQuery.set('test search');

      expect(component.searchQuery()).toBe('test search');
    });

    it('shows clear button when searchQuery has value', () => {
      component.searchQuery.set('test');
      fixture.detectChanges();

      const clearButton = host.querySelector('button[aria-label="Clear search"]');
      expect(clearButton).toBeTruthy();
    });

    it('hides clear button when searchQuery is empty', () => {
      component.searchQuery.set('');
      fixture.detectChanges();

      const clearButton = host.querySelector('button[aria-label="Clear search"]');
      expect(clearButton).toBeFalsy();
    });
  });

  describe('searchChange output', () => {
    it('emits search query when input changes', () => {
      const emitSpy = vi.spyOn(component.searchChange, 'emit');
      component.searchQuery.set('test query');

      component.onSearchInput();

      expect(emitSpy).toHaveBeenCalledWith('test query');
    });

    it('emits empty string', () => {
      const emitSpy = vi.spyOn(component.searchChange, 'emit');
      component.searchQuery.set('');

      component.onSearchInput();

      expect(emitSpy).toHaveBeenCalledWith('');
    });

    it('emits on every input change', () => {
      const emitSpy = vi.spyOn(component.searchChange, 'emit');

      component.searchQuery.set('t');
      component.onSearchInput();

      component.searchQuery.set('te');
      component.onSearchInput();

      component.searchQuery.set('tes');
      component.onSearchInput();

      expect(emitSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('searchSubmit output', () => {
    it('emits search query when form is submitted', () => {
      const emitSpy = vi.spyOn(component.searchSubmit, 'emit');
      component.searchQuery.set('submitted query');
      const event = new Event('submit');

      component.onSearchSubmit(event);

      expect(emitSpy).toHaveBeenCalledWith('submitted query');
    });

    it('prevents default form submission', () => {
      const event = new Event('submit');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onSearchSubmit(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('emits current query value on submit', () => {
      const emitSpy = vi.spyOn(component.searchSubmit, 'emit');
      component.searchQuery.set('current value');

      component.onSearchSubmit(new Event('submit'));

      expect(emitSpy).toHaveBeenCalledWith('current value');
    });
  });

  describe('focus state', () => {
    it('sets isFocused to true on focus', () => {
      expect(component.isFocused()).toBe(false);

      component.onFocus();

      expect(component.isFocused()).toBe(true);
    });

    it('sets isFocused to false on blur', () => {
      component.onFocus();
      expect(component.isFocused()).toBe(true);

      component.onBlur();

      expect(component.isFocused()).toBe(false);
    });

    it('tracks focus state changes', () => {
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
      component.searchQuery.set('test query');

      component.clearSearch();

      expect(component.searchQuery()).toBe('');
    });

    it('emits empty string when clearing', () => {
      const emitSpy = vi.spyOn(component.searchChange, 'emit');
      component.searchQuery.set('test');

      component.clearSearch();

      expect(emitSpy).toHaveBeenCalledWith('');
    });

    it('clears from non-empty to empty', () => {
      component.searchQuery.set('long search query');
      expect(component.searchQuery()).toBe('long search query');

      component.clearSearch();
      expect(component.searchQuery()).toBe('');
    });

    it('handles clearing already empty search', () => {
      component.searchQuery.set('');

      expect(() => component.clearSearch()).not.toThrow();
      expect(component.searchQuery()).toBe('');
    });
  });

  describe('clear button rendering', () => {
    it('renders clear button when there is text', () => {
      component.searchQuery.set('text');
      fixture.detectChanges();

      const clearButton = host.querySelector('button[aria-label="Clear search"]');
      expect(clearButton).toBeTruthy();
    });

    it('clear button triggers clearSearch', () => {
      component.searchQuery.set('text');
      fixture.detectChanges();

      const clearSpy = vi.spyOn(component, 'clearSearch');
      const clearButton = host.querySelector('button[aria-label="Clear search"]') as HTMLButtonElement;

      clearButton.click();

      expect(clearSpy).toHaveBeenCalled();
    });

    it('positions clear button absolutely', () => {
      component.searchQuery.set('text');
      fixture.detectChanges();

      const clearButton = host.querySelector('button[aria-label="Clear search"]') as HTMLElement;
      expect(clearButton.className).toContain('absolute');
      expect(clearButton.className).toContain('right-2');
    });
  });

  describe('search icon', () => {
    it('renders search icon', () => {
      const icon = host.querySelector('.pointer-events-none svg');
      expect(icon).toBeTruthy();
    });

    it('positions search icon on the left', () => {
      const iconWrapper = host.querySelector('.absolute.inset-y-0.left-0');
      expect(iconWrapper).toBeTruthy();
    });

    it('hides icon from pointer events', () => {
      const iconWrapper = host.querySelector('.pointer-events-none');
      expect(iconWrapper).toBeTruthy();
    });

    it('marks icon as decorative with aria-hidden', () => {
      const iconWrapper = host.querySelector('.pointer-events-none');
      expect(iconWrapper?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('label accessibility', () => {
    it('renders label with sr-only class', () => {
      const label = host.querySelector('label');
      expect(label).toBeTruthy();
      expect(label?.className).toContain('sr-only');
    });

    it('associates label with input', () => {
      const label = host.querySelector('label');
      const input = host.querySelector('input');

      expect(label?.getAttribute('for')).toBe('search-input');
      expect(input?.id).toBe('search-input');
    });

    it('label text matches placeholder', () => {
      fixture.componentRef.setInput('placeholder', 'Search users');
      fixture.detectChanges();

      const label = host.querySelector('label');
      expect(label?.textContent).toBe('Search users');
    });
  });

  describe('inputClasses getter', () => {
    it('returns string of classes', () => {
      const classes = component.inputClasses;
      expect(typeof classes).toBe('string');
    });

    it('includes all required base classes', () => {
      const classes = component.inputClasses;
      expect(classes).toContain('bg-bg-secondary');
      expect(classes).toContain('border');
      expect(classes).toContain('rounded-lg');
      expect(classes).toContain('focus:ring-2');
      expect(classes).toContain('pl-10');
    });

    it('includes disabled classes', () => {
      const classes = component.inputClasses;
      expect(classes).toContain('disabled:bg-bg-disabled');
      expect(classes).toContain('disabled:cursor-not-allowed');
      expect(classes).toContain('disabled:opacity-60');
    });

    it('changes based on size input', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      expect(component.inputClasses).toContain('text-xs');

      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      expect(component.inputClasses).toContain('text-base');
    });
  });

  describe('edge cases', () => {
    it('handles very long search queries', () => {
      const longQuery = 'a'.repeat(500);
      component.searchQuery.set(longQuery);

      expect(component.searchQuery()).toBe(longQuery);
    });

    it('handles special characters in search', () => {
      const specialQuery = '<script>alert("xss")</script>';
      component.searchQuery.set(specialQuery);

      expect(component.searchQuery()).toBe(specialQuery);
    });

    it('handles empty placeholder', () => {
      fixture.componentRef.setInput('placeholder', '');
      fixture.detectChanges();

      const input = host.querySelector('input') as HTMLInputElement;
      expect(input.placeholder).toBe('');
    });

    it('handles rapid typing simulation', () => {
      const emitSpy = vi.spyOn(component.searchChange, 'emit');

      'test query'.split('').forEach((char, index) => {
        component.searchQuery.set('test query'.substring(0, index + 1));
        component.onSearchInput();
      });

      expect(emitSpy).toHaveBeenCalledTimes(10);
    });

    it('handles multiple clears', () => {
      const emitSpy = vi.spyOn(component.searchChange, 'emit');

      component.searchQuery.set('test');
      component.clearSearch();
      component.searchQuery.set('another');
      component.clearSearch();

      expect(emitSpy).toHaveBeenCalledWith('');
      expect(component.searchQuery()).toBe('');
    });

    it('handles form submission with empty query', () => {
      const emitSpy = vi.spyOn(component.searchSubmit, 'emit');
      component.searchQuery.set('');

      component.onSearchSubmit(new Event('submit'));

      expect(emitSpy).toHaveBeenCalledWith('');
    });

    it('maintains state after multiple focus/blur cycles', () => {
      for (let i = 0; i < 10; i++) {
        component.onFocus();
        component.onBlur();
      }

      expect(component.isFocused()).toBe(false);
    });
  });

  describe('styling', () => {
    it('applies transition-colors to input', () => {
      const input = host.querySelector('input');
      expect(input?.className).toContain('transition-colors');
    });

    it('applies focus styles', () => {
      const input = host.querySelector('input');
      expect(input?.className).toContain('focus:ring-accent');
      expect(input?.className).toContain('focus:border-accent');
    });

    it('applies hover styles to clear button', () => {
      component.searchQuery.set('test');
      fixture.detectChanges();

      const clearButton = host.querySelector('button[aria-label="Clear search"]');
      expect(clearButton?.className).toContain('hover:bg-bg-secondary');
    });

    it('has proper width styling', () => {
      const input = host.querySelector('input');
      expect(input?.className).toContain('w-full');
    });
  });

  describe('responsive behavior', () => {
    it('hides on mobile by default', () => {
      const form = host.querySelector('form');
      expect(form?.className).toContain('hidden');
    });

    it('can show on mobile when configured', () => {
      fixture.componentRef.setInput('showOnMobile', true);
      fixture.detectChanges();

      const form = host.querySelector('form');
      expect(form?.className).not.toContain('hidden');
    });
  });

  describe('integration scenarios', () => {
    it('simulates user typing and submitting', () => {
      const changeEmitSpy = vi.spyOn(component.searchChange, 'emit');
      const submitEmitSpy = vi.spyOn(component.searchSubmit, 'emit');

      component.searchQuery.set('test');
      component.onSearchInput();

      component.searchQuery.set('test query');
      component.onSearchInput();

      component.onSearchSubmit(new Event('submit'));

      expect(changeEmitSpy).toHaveBeenCalledTimes(2);
      expect(submitEmitSpy).toHaveBeenCalledWith('test query');
    });

    it('simulates typing, clearing, and typing again', () => {
      const emitSpy = vi.spyOn(component.searchChange, 'emit');

      component.searchQuery.set('first');
      component.onSearchInput();

      component.clearSearch();

      component.searchQuery.set('second');
      component.onSearchInput();

      expect(emitSpy).toHaveBeenCalledWith('first');
      expect(emitSpy).toHaveBeenCalledWith('');
      expect(emitSpy).toHaveBeenCalledWith('second');
    });

    it('handles disabled state during typing', () => {
      component.searchQuery.set('test');
      fixture.detectChanges();

      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const clearButton = host.querySelector('button[aria-label="Clear search"]');
      expect(clearButton).toBeFalsy();
    });
  });
});
