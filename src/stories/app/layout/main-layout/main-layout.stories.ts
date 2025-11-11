import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
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
  heroArchiveBox,
  heroClock,
  heroCheckBadge,
} from '@ng-icons/heroicons/outline';

import { MainLayoutComponent } from '@loan/app/layout/main-layout/main-layout';
import { UserApiService } from '@loan/app/shared/openapi';
import { AuthService } from '@loan/app/core/services/auth.service';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';

@Component({
  selector: 'app-story-placeholder',
  standalone: true,
  template: `<div class="p-6 text-text-primary">Contenido principal</div>`,
})
class StoryPlaceholderComponent {}

const meta: Meta<MainLayoutComponent> = {
  title: 'Layout/MainLayout',
  component: MainLayoutComponent,
  decorators: [
    moduleMetadata({
      imports: [
        MainLayoutComponent,
        StoryPlaceholderComponent,
        RouterTestingModule.withRoutes([{ path: '', component: StoryPlaceholderComponent }]),
      ],
      providers: [
        {
          provide: UserApiService,
          useValue: {
            getCurrentUser: () =>
              of({ email: 'isabella@loan.io', person: { name: 'Isabella Stone' } }),
          },
        },
        {
          provide: AuthService,
          useValue: {
            logout: () => of(undefined),
          },
        },
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
          heroArchiveBox,
          heroClock,
          heroCheckBadge,
        }),
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<MainLayoutComponent>;

const template = wrapInLightDarkComparison(`
  <div class="min-h-screen">
    <app-main-layout></app-main-layout>
  </div>
`);

export const Default: Story = {
  render: () => ({ template }),
};
