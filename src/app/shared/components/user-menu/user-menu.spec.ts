import { render } from '@testing-library/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { describe, expect, it, vi } from 'vitest';
import { UserMenuComponent, UserMenuItem } from './user-menu';

describe('UserMenuComponent', () => {
  const mockMenuItems: UserMenuItem[] = [
    { id: '1', label: 'Profile', icon: 'user', action: 'profile' },
    { id: '2', label: 'Settings', icon: 'settings', action: 'settings' },
    { id: '3', label: 'Logout', icon: 'logout', action: 'logout' },
  ];

  async function renderComponent(props?: Record<string, unknown>) {
    return render(UserMenuComponent, {
      providers: [provideZonelessChangeDetection()],
      componentProperties: props,
    });
  }

  it('renders with default user name', async () => {
    const { container } = await renderComponent();

    const initials = container.querySelector('[aria-label*="Iniciales"]');
    expect(initials?.textContent?.trim()).toBe('US');
  });

  it('computes user initials from full name', async () => {
    const { fixture } = await renderComponent({ userName: 'John Doe' });

    expect(fixture.componentInstance.userInitials()).toBe('JD');
  });

  it('computes user initials from single name', async () => {
    const { fixture } = await renderComponent({ userName: 'Alice' });

    expect(fixture.componentInstance.userInitials()).toBe('AL');
  });

  it('opens menu on toggle', async () => {
    const { container, fixture } = await renderComponent({ menuItems: mockMenuItems });

    const button = container.querySelector('button');
    button?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.isOpen()).toBe(true);
  });

  it('displays menu items when open', async () => {
    const { container, fixture } = await renderComponent({ menuItems: mockMenuItems });

    fixture.componentInstance.toggle();
    fixture.detectChanges();

    expect(container.textContent).toContain('Profile');
    expect(container.textContent).toContain('Settings');
    expect(container.textContent).toContain('Logout');
  });

  it('emits menuOpened event when opened', async () => {
    const { fixture } = await renderComponent();
    const menuOpenedSpy = vi.fn();
    fixture.componentInstance.menuOpened.subscribe(menuOpenedSpy);

    fixture.componentInstance.toggle();
    fixture.detectChanges();

    expect(menuOpenedSpy).toHaveBeenCalledTimes(1);
  });

  it('emits menuClosed event when closed', async () => {
    const { fixture } = await renderComponent();
    const menuClosedSpy = vi.fn();
    fixture.componentInstance.menuClosed.subscribe(menuClosedSpy);

    fixture.componentInstance.toggle();
    fixture.detectChanges();
    fixture.componentInstance.toggle();
    fixture.detectChanges();

    expect(menuClosedSpy).toHaveBeenCalledTimes(1);
  });

  it('emits menuItemClick when item is clicked', async () => {
    const { container, fixture } = await renderComponent({ menuItems: mockMenuItems });
    const menuItemClickSpy = vi.fn();
    fixture.componentInstance.menuItemClick.subscribe(menuItemClickSpy);

    fixture.componentInstance.toggle();
    fixture.detectChanges();

    const menuItem = container.querySelector('[role="menuitem"]') as HTMLElement;
    menuItem?.click();

    expect(menuItemClickSpy).toHaveBeenCalledWith(mockMenuItems[0]);
  });

  it('closes menu after item click', async () => {
    const { container, fixture } = await renderComponent({ menuItems: mockMenuItems });

    fixture.componentInstance.toggle();
    fixture.detectChanges();

    expect(fixture.componentInstance.isOpen()).toBe(true);

    const menuItem = container.querySelector('[role="menuitem"]') as HTMLElement;
    menuItem?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.isOpen()).toBe(false);
  });

  it('closes menu on Escape key', async () => {
    const { fixture } = await renderComponent();

    fixture.componentInstance.open();
    fixture.detectChanges();

    expect(fixture.componentInstance.isOpen()).toBe(true);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    fixture.detectChanges();

    expect(fixture.componentInstance.isOpen()).toBe(false);
  });

  it('closes menu on click outside', async () => {
    const { fixture } = await renderComponent();

    fixture.componentInstance.open();
    fixture.detectChanges();

    expect(fixture.componentInstance.isOpen()).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const event = new MouseEvent('click', { bubbles: true });
    document.body.dispatchEvent(event);

    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    expect(fixture.componentInstance.isOpen()).toBe(false);
  });

  it('filters out divider items from visibleMenuItems', async () => {
    const itemsWithDivider: UserMenuItem[] = [
      ...mockMenuItems,
      { id: '4', label: '', divider: true },
    ];

    const { fixture } = await renderComponent({ menuItems: itemsWithDivider });

    expect(fixture.componentInstance.visibleMenuItems().length).toBe(3);
  });

  it('does not emit menuItemClick for divider items', async () => {
    const itemsWithDivider: UserMenuItem[] = [
      { id: '1', label: 'Profile', action: 'profile' },
      { id: '2', label: '', divider: true },
    ];

    const { fixture } = await renderComponent({ menuItems: itemsWithDivider });
    const menuItemClickSpy = vi.fn();
    fixture.componentInstance.menuItemClick.subscribe(menuItemClickSpy);

    const dividerItem = itemsWithDivider[1];
    fixture.componentInstance.onMenuItemClick(dividerItem, new Event('click'));

    expect(menuItemClickSpy).not.toHaveBeenCalled();
  });

  it('displays user email when provided', async () => {
    const { container, fixture } = await renderComponent({
      userName: 'John Doe',
      userEmail: 'john@example.com',
    });

    fixture.componentInstance.toggle();
    fixture.detectChanges();

    expect(container.textContent).toContain('john@example.com');
  });

  it('hasUserInfo returns true when userName or userEmail provided', async () => {
    const { fixture } = await renderComponent({ userName: 'John Doe' });

    expect(fixture.componentInstance.hasUserInfo()).toBe(true);
  });

  it('hasUserInfo returns false when no user info provided', async () => {
    const { fixture } = await renderComponent({ userName: '', userEmail: '' });

    expect(fixture.componentInstance.hasUserInfo()).toBe(false);
  });
});
