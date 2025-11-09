import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {BASE_PATH} from '@loan/app/shared/openapi';
import {authInterceptor} from '@loan/app/core/interceptors/auth.interceptor';
import { provideIcons } from '@ng-icons/core';
import {
  heroBars3,
  heroMagnifyingGlass,
  heroBell,
  heroSquares2x2,
  heroUserCircle,
  heroChevronDown,
  heroChevronUp,
  heroChevronLeft,
  heroChevronRight,
  heroXMark,
  heroCheckCircle,
  heroExclamationTriangle,
  heroInformationCircle,
  heroXCircle,
  heroChartPie,
  heroDocumentText,
  heroUsers,
  heroBuildingOffice2,
  heroUserGroup,
  heroChartBar,
  heroCog6Tooth,
  heroQuestionMarkCircle,
  heroArrowRightOnRectangle,
  heroShoppingBag,
  heroInbox,
  heroUser,
  heroArchiveBox,
  heroClock,
  heroCheckBadge,
} from '@ng-icons/heroicons/outline';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authInterceptor
      ]),
    ),
    {provide: BASE_PATH, useValue: ''},
    provideIcons({
      heroBars3,
      heroMagnifyingGlass,
      heroBell,
      heroSquares2x2,
      heroUserCircle,
      heroChevronDown,
      heroChevronUp,
      heroChevronLeft,
      heroChevronRight,
      heroXMark,
      heroCheckCircle,
      heroExclamationTriangle,
      heroInformationCircle,
      heroXCircle,
      heroChartPie,
      heroDocumentText,
      heroUsers,
      heroBuildingOffice2,
      heroUserGroup,
      heroChartBar,
      heroCog6Tooth,
      heroQuestionMarkCircle,
      heroArrowRightOnRectangle,
      heroShoppingBag,
      heroInbox,
      heroUser,
      heroArchiveBox,
      heroClock,
      heroCheckBadge,
    }),
  ]
};
