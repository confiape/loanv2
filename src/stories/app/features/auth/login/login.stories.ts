import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { of } from 'rxjs';
import { fn } from 'storybook/test';

import { LoginComponent } from '@loan/app/features/auth/pages/login/login';
import { AuthenticationApiService } from '@loan/app/shared/openapi';
import { AuthService } from '@loan/app/core/services/auth.service';
import { ToastService } from '@loan/app/core/services/toast.service';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';

const authApiMock = {
  logIn: fn().mockReturnValue(of(undefined)),
};

const authServiceMock = {
  getAuthorizationToken: fn().mockReturnValue(of({ accessToken: 'demo-token' })),
};

const toastServiceMock = {
  success: fn(),
  error: fn(),
};

const meta: Meta<LoginComponent> = {
  title: 'Features/Auth/Login',
  component: LoginComponent,
  decorators: [
    moduleMetadata({
      imports: [LoginComponent],
      providers: [
        { provide: AuthenticationApiService, useValue: authApiMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }),
  ],
  args: {},
};

export default meta;
type Story = StoryObj<LoginComponent>;

const template = wrapInLightDarkComparison(`
  <div class="min-h-screen flex items-center justify-center">
    <app-login></app-login>
  </div>
`);

export const Default: Story = {
  render: () => ({
    template,
  }),
};
