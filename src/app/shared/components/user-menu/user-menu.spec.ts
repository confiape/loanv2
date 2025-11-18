import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, inputBinding, outputBinding, signal } from '@angular/core';
import { describe, expect, it, vi } from 'vitest';
import { UserMenuComponent, UserMenuItem } from './user-menu';

describe('UserMenuComponent', () => {
  const mockMenuItems: UserMenuItem[] = [
    { id: '1', label: 'Profile', icon: 'user', action: 'profile' },
    { id: '2', label: 'Settings', icon: 'settings', action: 'settings' },
    { id: '3', label: 'Logout', icon: 'logout', action: 'logout' },
  ];

  const defaultProviders = [provideZonelessChangeDetection()];

  it('renders with default user name', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(UserMenuComponent);
    TestBed.tick();

    // Assert
    const initials = fixture.nativeElement.querySelector('[aria-label*="Iniciales"]');
    expect(initials?.textContent?.trim()).toBe('US');
  });

  it('computes user initials from full name', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(UserMenuComponent, {
      bindings: [inputBinding('userName', () => 'John Doe')],
    });
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance.userInitials()).toBe('JD');
  });

  it('computes user initials from single name', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(UserMenuComponent, {
      bindings: [inputBinding('userName', () => 'Alice')],
    });
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance.userInitials()).toBe('AL');
  });

  it('opens menu on toggle', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(UserMenuComponent, {
      bindings: [inputBinding('menuItems', () => mockMenuItems)],
    });
    TestBed.tick();

    const button = fixture.nativeElement.querySelector('button');

    // Act
    button?.click();
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance.isOpen()).toBe(true);
  });

  it('displays menu items when open', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(UserMenuComponent, {
      bindings: [inputBinding('menuItems', () => mockMenuItems)],
    });
    TestBed.tick();

    // Act
    fixture.componentInstance.toggle();
    TestBed.tick();

    // Assert
    expect(fixture.nativeElement.textContent).toContain('Profile');
    expect(fixture.nativeElement.textContent).toContain('Settings');
    expect(fixture.nativeElement.textContent).toContain('Logout');
  });

  it('emits menuOpened event when opened', () => {
    // Arrange
    const menuOpenedSignal = signal(0);
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(UserMenuComponent, {
      bindings: [outputBinding('menuOpened', () => menuOpenedSignal.update((v) => v + 1))],
    });
    TestBed.tick();

    // Act
    fixture.componentInstance.toggle();
    TestBed.tick();

    // Assert
    expect(menuOpenedSignal()).toBe(1);
  });

  it('emits menuClosed event when closed', () => {
    // Arrange
    const menuClosedSignal = signal(0);
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(UserMenuComponent, {
      bindings: [outputBinding('menuClosed', () => menuClosedSignal.update((v) => v + 1))],
    });
    TestBed.tick();

    // Act
    fixture.componentInstance.toggle();
    TestBed.tick();
    fixture.componentInstance.toggle();
    TestBed.tick();

    // Assert
    expect(menuClosedSignal()).toBe(1);
  });

  it('emits menuItemClick when item is clicked', () => {
    // Arrange
    const menuItemClickSignal = signal<UserMenuItem | null>(null);
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(UserMenuComponent, {
      bindings: [
        inputBinding('menuItems', () => mockMenuItems),
        outputBinding('menuItemClick', (item: UserMenuItem) => menuItemClickSignal.set(item)),
      ],
    });
    TestBed.tick();

    fixture.componentInstance.toggle();
    TestBed.tick();

    const menuItem = fixture.nativeElement.querySelector('[role="menuitem"]') as HTMLElement;

    // Act
    menuItem?.click();

    // Assert
    expect(menuItemClickSignal()).toEqual(mockMenuItems[0]);
  });

  it('closes menu after item click', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(UserMenuComponent, {
      bindings: [inputBinding('menuItems', () => mockMenuItems)],
    });
    TestBed.tick();

    fixture.componentInstance.toggle();
    TestBed.tick();

    expect(fixture.componentInstance.isOpen()).toBe(true);

    const menuItem = fixture.nativeElement.querySelector('[role="menuitem"]') as HTMLElement;

    // Act
    menuItem?.click();
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance.isOpen()).toBe(false);
  });

  it('closes menu on Escape key', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(UserMenuComponent);
    TestBed.tick();

    fixture.componentInstance.open();
    TestBed.tick();

    expect(fixture.componentInstance.isOpen()).toBe(true);

    // Act
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance.isOpen()).toBe(false);
  });

  it('closes menu on click outside', async () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(UserMenuComponent);
    TestBed.tick();

    fixture.componentInstance.open();
    TestBed.tick();

    expect(fixture.componentInstance.isOpen()).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 0));

    // Act
    const event = new MouseEvent('click', { bubbles: true });
    document.body.dispatchEvent(event);

    await new Promise((resolve) => setTimeout(resolve, 0));
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance.isOpen()).toBe(false);
  });

  it('filters out divider items from visibleMenuItems', () => {
    // Arrange
    const itemsWithDivider: UserMenuItem[] = [
      ...mockMenuItems,
      { id: '4', label: '', divider: true },
    ];

    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(UserMenuComponent, {
      bindings: [inputBinding('menuItems', () => itemsWithDivider)],
    });
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance.visibleMenuItems().length).toBe(3);
  });

  it('does not emit menuItemClick for divider items', () => {
    // Arrange
    const itemsWithDivider: UserMenuItem[] = [
      { id: '1', label: 'Profile', action: 'profile' },
      { id: '2', label: '', divider: true },
    ];

    const menuItemClickSignal = signal<UserMenuItem | null>(null);
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(UserMenuComponent, {
      bindings: [
        inputBinding('menuItems', () => itemsWithDivider),
        outputBinding('menuItemClick', (item: UserMenuItem) => menuItemClickSignal.set(item)),
      ],
    });
    TestBed.tick();

    const dividerItem = itemsWithDivider[1];

    // Act
    fixture.componentInstance.onMenuItemClick(dividerItem, new Event('click'));

    // Assert
    expect(menuItemClickSignal()).toBeNull();
  });

  it('displays user email when provided', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(UserMenuComponent, {
      bindings: [
        inputBinding('userName', () => 'John Doe'),
        inputBinding('userEmail', () => 'john@example.com'),
      ],
    });
    TestBed.tick();

    // Act
    fixture.componentInstance.toggle();
    TestBed.tick();

    // Assert
    expect(fixture.nativeElement.textContent).toContain('john@example.com');
  });

  it('hasUserInfo returns true when userName or userEmail provided', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(UserMenuComponent, {
      bindings: [inputBinding('userName', () => 'John Doe')],
    });
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance.hasUserInfo()).toBe(true);
  });

  it('hasUserInfo returns false when no user info provided', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(UserMenuComponent, {
      bindings: [inputBinding('userName', () => ''), inputBinding('userEmail', () => '')],
    });
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance.hasUserInfo()).toBe(false);
  });
});
