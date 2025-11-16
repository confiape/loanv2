import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserMenuComponent, UserMenuItem } from './user-menu';

// Wrapper component for testing data-testid attribute
@Component({
  template: `<app-user-menu [testId]="'test-user-menu'" [menuItems]="mockMenuItems"></app-user-menu>`,
  standalone: true,
  imports: [UserMenuComponent],
})
class TestWrapperComponent {
  mockMenuItems: UserMenuItem[] = [
    { id: '1', label: 'Profile', icon: 'user', action: 'profile' },
    { id: '2', label: 'Settings', icon: 'settings', action: 'settings' },
    { id: '3', label: 'Logout', icon: 'logout', action: 'logout' },
  ];
}

describe('UserMenuComponent', () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;
  let compiled: HTMLElement;

  const mockMenuItems: UserMenuItem[] = [
    { id: '1', label: 'Profile', icon: 'user', action: 'profile' },
    { id: '2', label: 'Settings', icon: 'settings', action: 'settings' },
    { id: '3', label: 'Logout', icon: 'logout', action: 'logout' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMenuComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMenuComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  it('renders with default user name', () => {
    fixture.detectChanges();

    const initials = compiled.querySelector('[aria-label*="Iniciales"]');
    expect(initials?.textContent?.trim()).toBe('US');
  });

  it('computes user initials from full name', () => {
    fixture.componentRef.setInput('userName', 'John Doe');
    fixture.detectChanges();

    expect(component.userInitials()).toBe('JD');
  });

  it('computes user initials from single name', () => {
    fixture.componentRef.setInput('userName', 'Alice');
    fixture.detectChanges();

    expect(component.userInitials()).toBe('AL');
  });

  it('opens menu on toggle', () => {
    fixture.componentRef.setInput('menuItems', mockMenuItems);
    fixture.detectChanges();

    const button = compiled.querySelector('button');
    button?.click();
    fixture.detectChanges();

    expect(component.isOpen()).toBe(true);
  });

  it('displays menu items when open', () => {
    fixture.componentRef.setInput('menuItems', mockMenuItems);
    fixture.detectChanges();

    component.toggle();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Profile');
    expect(compiled.textContent).toContain('Settings');
    expect(compiled.textContent).toContain('Logout');
  });

  it('emits menuOpened event when opened', () => {
    const menuOpenedSpy = vi.fn();
    component.menuOpened.subscribe(menuOpenedSpy);

    component.toggle();
    fixture.detectChanges();

    expect(menuOpenedSpy).toHaveBeenCalledTimes(1);
  });

  it('emits menuClosed event when closed', () => {
    const menuClosedSpy = vi.fn();
    component.menuClosed.subscribe(menuClosedSpy);

    component.toggle();
    fixture.detectChanges();
    component.toggle();
    fixture.detectChanges();

    expect(menuClosedSpy).toHaveBeenCalledTimes(1);
  });

  it('emits menuItemClick when item is clicked', () => {
    const menuItemClickSpy = vi.fn();
    fixture.componentRef.setInput('menuItems', mockMenuItems);
    component.menuItemClick.subscribe(menuItemClickSpy);

    component.toggle();
    fixture.detectChanges();

    const menuItem = compiled.querySelector('[role="menuitem"]') as HTMLElement;
    menuItem?.click();

    expect(menuItemClickSpy).toHaveBeenCalledWith(mockMenuItems[0]);
  });

  it('closes menu after item click', () => {
    fixture.componentRef.setInput('menuItems', mockMenuItems);
    fixture.detectChanges();

    component.toggle();
    fixture.detectChanges();

    expect(component.isOpen()).toBe(true);

    const menuItem = compiled.querySelector('[role="menuitem"]') as HTMLElement;
    menuItem?.click();
    fixture.detectChanges();

    expect(component.isOpen()).toBe(false);
  });

  it('closes menu on Escape key', () => {
    fixture.detectChanges();

    component.open();
    fixture.detectChanges();

    expect(component.isOpen()).toBe(true);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.isOpen()).toBe(false);
  });

  it('closes menu on click outside', async () => {
    fixture.detectChanges();

    component.open();
    fixture.detectChanges();

    expect(component.isOpen()).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const event = new MouseEvent('click', { bubbles: true });
    document.body.dispatchEvent(event);

    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    expect(component.isOpen()).toBe(false);
  });

  it('filters out divider items from visibleMenuItems', () => {
    const itemsWithDivider: UserMenuItem[] = [
      ...mockMenuItems,
      { id: '4', label: '', divider: true },
    ];

    fixture.componentRef.setInput('menuItems', itemsWithDivider);
    fixture.detectChanges();

    expect(component.visibleMenuItems().length).toBe(3);
  });

  it('does not emit menuItemClick for divider items', () => {
    const menuItemClickSpy = vi.fn();
    const itemsWithDivider: UserMenuItem[] = [
      { id: '1', label: 'Profile', action: 'profile' },
      { id: '2', label: '', divider: true },
    ];

    fixture.componentRef.setInput('menuItems', itemsWithDivider);
    component.menuItemClick.subscribe(menuItemClickSpy);

    const dividerItem = itemsWithDivider[1];
    component.onMenuItemClick(dividerItem, new Event('click'));

    expect(menuItemClickSpy).not.toHaveBeenCalled();
  });

  it('displays user email when provided', () => {
    fixture.componentRef.setInput('userName', 'John Doe');
    fixture.componentRef.setInput('userEmail', 'john@example.com');
    fixture.detectChanges();

    component.toggle();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('john@example.com');
  });

  it('hasUserInfo returns true when userName or userEmail provided', () => {
    fixture.componentRef.setInput('userName', 'John Doe');
    fixture.detectChanges();

    expect(component.hasUserInfo()).toBe(true);
  });

  it('hasUserInfo returns false when no user info provided', () => {
    fixture.componentRef.setInput('userName', '');
    fixture.componentRef.setInput('userEmail', '');
    fixture.detectChanges();

    expect(component.hasUserInfo()).toBe(false);
  });

  describe('data-testid support', () => {
    it('should render test IDs with wrapper pattern when data-testid attribute is provided', async () => {
      TestBed.resetTestingModule();

      await TestBed.configureTestingModule({
        imports: [TestWrapperComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const wrapperFixture = TestBed.createComponent(TestWrapperComponent);
      wrapperFixture.detectChanges();
      await wrapperFixture.whenStable();

      const hostElement = wrapperFixture.nativeElement.querySelector('app-user-menu');

      // Verify host has -wrapper suffix
      expect(hostElement.getAttribute('data-testid')).toBe('test-user-menu-wrapper');

      // Verify trigger has original ID (no suffix)
      const button = hostElement.querySelector('button');
      expect(button?.getAttribute('data-testid')).toBe('test-user-menu');

      // Open menu by clicking button to verify item test IDs
      button?.dispatchEvent(new MouseEvent('click'));
      wrapperFixture.detectChanges();
      await wrapperFixture.whenStable();

      // Verify item test IDs with indices on correct element types (button or anchor elements with role="menuitem")
      const allMenuItems = hostElement.querySelectorAll('[role="menuitem"]');

      const item0 = (Array.from(allMenuItems || []).find(el =>
        el.getAttribute('data-testid') === 'test-user-menu-item-0'
      );
      expect(item0).toBeTruthy();

      const item1 = (Array.from(allMenuItems || []).find(el =>
        el.getAttribute('data-testid') === 'test-user-menu-item-1'
      );
      expect(item1).toBeTruthy();

      const item2 = (Array.from(allMenuItems || []).find(el =>
        el.getAttribute('data-testid') === 'test-user-menu-item-2'
      );
      expect(item2).toBeTruthy();
    });

    it('should not render test IDs when data-testid attribute is not provided', async () => {
      fixture.componentRef.setInput('menuItems', mockMenuItems);
      fixture.detectChanges();

      const button = compiled.querySelector('button');

      // Verify trigger has NO test ID
      expect(button?.hasAttribute('data-testid')).toBe(false);

      // Open menu to verify no item test IDs
      component.toggle();
      fixture.detectChanges();

      // Verify NO test IDs in menu
      const elementsWithTestId = compiled.querySelectorAll('[data-testid]');
      expect(elementsWithTestId.length).toBe(0);
    });
  });
});
