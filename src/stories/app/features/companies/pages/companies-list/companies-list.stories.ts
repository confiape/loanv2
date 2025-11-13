import { Meta, StoryObj } from '@storybook/angular';
import { CompaniesListComponent } from '@loan/app/features/companies/pages/companies-list/companies-list';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

const meta: Meta<CompaniesListComponent> = {
  title: 'Features/Companies/CompaniesList',
  component: CompaniesListComponent,
  tags: ['autodocs'],
  decorators: [
    (Story) => ({
      template: `
        <div class="min-h-screen p-8">
          <story />
        </div>
      `,
      providers: [
        provideRouter([]),
        provideHttpClient(),
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<CompaniesListComponent>;

export const Default: Story = {
  args: {},
};
