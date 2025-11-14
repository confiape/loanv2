import { Page, Route } from '@playwright/test';

/**
 * API Mock Helper
 * Intercepta llamadas al API y devuelve respuestas mockeadas
 */
export class ApiMockHelper {
  constructor(private page: Page) {}

  /**
   * Setup all API mocks for authentication and companies
   */
  async setupAllMocks(): Promise<void> {
    await this.mockAuthentication();
    await this.mockCompaniesAPI();
  }

  /**
   * Mock authentication endpoints
   */
  async mockAuthentication(): Promise<void> {
    // Mock IsAuthenticated - return false to allow login
    await this.page.route('**/api/Authentication/IsAuthenticated', (route: Route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ isAuthenticated: false }),
      });
    });

    // Mock Login - return success
    await this.page.route('**/api/Authentication/LogIn', (route: Route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock-jwt-token',
          user: {
            id: 'mock-user-id',
            email: 'admin@confia.com',
            name: 'Admin User',
          },
        }),
      });
    });

    // Mock GetAuthorizationToken
    await this.page.route('**/api/Authentication/GetAuthorizationToken', (route: Route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock-jwt-token',
        }),
      });
    });

    // Mock Logout
    await this.page.route('**/api/Authentication/LogOut', (route: Route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });
  }

  /**
   * Mock companies API endpoints
   */
  async mockCompaniesAPI(): Promise<void> {
    // In-memory storage for companies
    let companies = [
      { id: '1', name: 'Mock Company Alpha' },
      { id: '2', name: 'Mock Company Beta' },
      { id: '3', name: 'Mock Company Gamma' },
    ];

    // Mock GetAll
    await this.page.route('**/api/Company/GetAll', (route: Route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(companies),
      });
    });

    // Mock Create
    await this.page.route('**/api/Company/Create', async (route: Route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      const newCompany = {
        id: `mock-${Date.now()}`,
        ...postData,
      };

      companies.push(newCompany);

      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(newCompany),
      });
    });

    // Mock Update
    await this.page.route('**/api/Company/Update', async (route: Route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      const index = companies.findIndex((c) => c.id === postData.id);
      if (index !== -1) {
        companies[index] = { ...companies[index], ...postData };
      }

      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(companies[index]),
      });
    });

    // Mock Delete
    await this.page.route('**/api/Company/Delete/**', (route: Route) => {
      const url = route.request().url();
      const id = url.split('/').pop();

      companies = companies.filter((c) => c.id !== id);

      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });
  }

  /**
   * Clear all companies (for cleanup between tests)
   */
  async clearCompanies(): Promise<void> {
    // This would need to be implemented with a shared state
    // or by re-setting up mocks
  }
}
