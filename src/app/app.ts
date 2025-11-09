import {Component, signal} from '@angular/core';
import {
  BottomNavigationComponent,
  BottomNavItem,
  MainLayoutComponent,
  NavbarComponent,
  SidenavComponent,
  SidenavItem
} from '@loan/app/layout';
import {ToastContainerComponent} from '@loan/app/shared/components/toast';
import {AppMenuItem} from '@loan/app/shared/components/apps-menu/apps-menu.component';
import {UserMenuItem} from '@loan/app/shared/components/user-menu/user-menu.component';
import {
  APPS_MENU_ITEMS,
  BOTTOM_NAV_ITEMS,
  MOCK_NOTIFICATIONS,
  SIDENAV_ITEMS,
  USER_MENU_ITEMS
} from '@loan/app/config/layout.config';
import {Notification} from '@loan/app/shared/components/notification-button/notification-button.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    NavbarComponent,
    ToastContainerComponent,
    SidenavComponent,
    RouterOutlet,
    BottomNavigationComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
}
