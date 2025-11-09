import { SidenavItem } from '@loan/app/layout/sidenav/sidenav';
import { BottomNavItem } from '@loan/app/layout/bottom-navigation/bottom-navigation';
import {AppMenuItem} from '@loan/app/shared/components/apps-menu/apps-menu';
import {UserMenuItem} from '@loan/app/shared/components/user-menu/user-menu';
import {Notification} from '@loan/app/shared/components/notification-button/notification-button';


// Sidenav Items Configuration
export const SIDENAV_ITEMS: SidenavItem[] = [
  {
    label: 'Dashboard',
    icon: 'heroChartPie',
    value: 'dashboard',
    routerLink: '/dashboard',
  },
  {
    label: 'Loans',
    icon: 'heroDocumentText',
    value: 'loans',
    routerLink: '/loans',
    badge: '12',
    children: [
      {
        label: 'Active Loans',
        icon: 'heroCheckCircle',
        value: 'active-loans',
        routerLink: '/loans/active',
        badge: '8',
      },
      {
        label: 'Pending Approval',
        icon: 'heroClock',
        value: 'pending-loans',
        routerLink: '/loans/pending',
        badge: '4',
      },
      {
        label: 'Completed',
        icon: 'heroCheckBadge',
        value: 'completed-loans',
        routerLink: '/loans/completed',
      },
    ],
  },
  {
    label: 'Customers',
    icon: 'heroUsers',
    value: 'customers',
    routerLink: '/customers',
  },
  {
    label: 'Companies',
    icon: 'heroBuildingOffice2',
    value: 'companies',
    routerLink: '/companies',
  },
  {
    label: 'Roles',
    icon: 'heroUserGroup',
    value: 'roles',
    routerLink: '/roles',
  },
  {
    label: 'Reports',
    icon: 'heroChartBar',
    value: 'reports',
    routerLink: '/reports',
  },
  {
    label: 'divider',
    value: 'divider-1',
    divider: true,
  },
  {
    label: 'Settings',
    icon: 'heroCog6Tooth',
    value: 'settings',
    routerLink: '/settings',
  },
  {
    label: 'Help',
    icon: 'heroQuestionMarkCircle',
    value: 'help',
    routerLink: '/help',
  },
];

// Apps Menu Configuration
export const APPS_MENU_ITEMS: AppMenuItem[] = [
  {
    id: 'sales',
    label: 'Sales',
    icon: 'heroShoppingBag',
    href: '#',
    action: 'sales',
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'heroUsers',
    href: '#',
    action: 'users',
  },
  {
    id: 'inbox',
    label: 'Inbox',
    icon: 'heroInbox',
    href: '#',
    action: 'inbox',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'heroUserCircle',
    href: '#',
    action: 'profile',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'heroCog6Tooth',
    href: '#',
    action: 'settings',
  },
  {
    id: 'products',
    label: 'Products',
    icon: 'heroArchiveBox',
    href: '#',
    action: 'products',
  },
];

// User Menu Configuration
export const USER_MENU_ITEMS: UserMenuItem[] = [
  {
    id: 'profile',
    label: 'My Profile',
    icon: 'heroUserCircle',
    href: '#',
    action: 'profile',
  },
  {
    id: 'settings',
    label: 'Account Settings',
    icon: 'heroCog6Tooth',
    href: '#',
    action: 'settings',
  },
  {
    id: 'divider-1',
    label: '',
    divider: true,
  },
  {
    id: 'help',
    label: 'Help Center',
    icon: 'heroQuestionMarkCircle',
    href: '#',
    action: 'help',
  },
  {
    id: 'divider-2',
    label: '',
    divider: true,
  },
  {
    id: 'logout',
    label: 'Sign Out',
    icon: 'heroArrowRightOnRectangle',
    href: '#',
    action: 'logout',
  },
];

// Mock Notifications (for demo purposes)
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New loan application',
    message: 'John Doe submitted a new loan application for $50,000',
    time: '5 minutes ago',
    read: false,
    iconColor: 'var(--color-accent)',
  },
  {
    id: '2',
    title: 'Payment received',
    message: 'Payment of $1,500 received from customer #12345',
    time: '1 hour ago',
    read: false,
    iconColor: 'var(--color-success)',
  },
  {
    id: '3',
    title: 'Loan approved',
    message: 'Loan application #LP-2024-001 has been approved',
    time: '3 hours ago',
    read: true,
  },
  {
    id: '4',
    title: 'System maintenance',
    message: 'Scheduled maintenance tonight at 2:00 AM',
    time: '1 day ago',
    read: true,
    iconColor: 'var(--color-warning)',
  },
];

// Bottom Navigation Items Configuration (Mobile)
export const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'heroChartPie',
    routerLink: '/dashboard',
  },
  {
    id: 'loans',
    label: 'Loans',
    icon: 'heroDocumentText',
    routerLink: '/loans',
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: 'heroUsers',
    routerLink: '/customers',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'heroChartBar',
    routerLink: '/reports',
  },
];
