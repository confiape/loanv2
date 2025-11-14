/**
 * Mock API Server for E2E Tests
 * Provides mock endpoints for authentication and CRUD operations
 * Runs on http://localhost:3001 during E2E tests
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import { Server } from 'http';

interface Company {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export class MockApiServer {
  private app: express.Application;
  private server: Server | null = null;
  private companies: Map<number, Company> = new Map();
  private nextId = 1;
  private isAuthenticated = false;  // Start as not authenticated for login tests

  constructor(private port = 3001) {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.seedData();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`[Mock API] ${req.method} ${req.path}`);
      next();
    });
  }

  private setupRoutes(): void {
    // Authentication routes
    this.app.get('/api/Authentication/IsAuthenticated', this.checkAuth.bind(this));
    this.app.post('/api/Authentication/Login', this.login.bind(this));
    this.app.post('/api/Authentication/Logout', this.logout.bind(this));

    // Companies CRUD routes
    this.app.get('/api/Companies', this.getCompanies.bind(this));
    this.app.get('/api/Companies/:id', this.getCompanyById.bind(this));
    this.app.post('/api/Companies', this.createCompany.bind(this));
    this.app.put('/api/Companies/:id', this.updateCompany.bind(this));
    this.app.delete('/api/Companies/:id', this.deleteCompany.bind(this));
    this.app.post('/api/Companies/BulkDelete', this.bulkDeleteCompanies.bind(this));

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', message: 'Mock API Server running' });
    });
  }

  private seedData(): void {
    // Add some initial test data
    const initialCompanies = [
      { name: 'Acme Corporation' },
      { name: 'TechStart Inc' },
      { name: 'Global Solutions Ltd' },
    ];

    initialCompanies.forEach(({ name }) => {
      const company: Company = {
        id: this.nextId++,
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.companies.set(company.id, company);
    });
  }

  // Authentication handlers
  private checkAuth(req: Request, res: Response): void {
    res.json({ isAuthenticated: this.isAuthenticated });
  }

  private login(req: Request, res: Response): void {
    const { email, password } = req.body;

    // Accept any credentials for testing
    if (email && password) {
      this.isAuthenticated = true;
      res.json({
        success: true,
        user: {
          email,
          name: 'Test Admin',
          role: 'admin',
        },
        token: 'mock-jwt-token',
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  }

  private logout(req: Request, res: Response): void {
    this.isAuthenticated = false;
    res.json({ success: true });
  }

  // Companies handlers
  private getCompanies(req: Request, res: Response): void {
    const { search = '', page = 1, pageSize = 10 } = req.query;

    let companies = Array.from(this.companies.values());

    // Filter by search term
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      companies = companies.filter((c) =>
        c.name.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const total = companies.length;
    const pageNum = Number(page);
    const size = Number(pageSize);
    const startIndex = (pageNum - 1) * size;
    const paginatedData = companies.slice(startIndex, startIndex + size);

    const response: PaginatedResponse<Company> = {
      data: paginatedData,
      total,
      page: pageNum,
      pageSize: size,
    };

    res.json(response);
  }

  private getCompanyById(req: Request, res: Response): void {
    const id = Number(req.params.id);
    const company = this.companies.get(id);

    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  }

  private createCompany(req: Request, res: Response): void {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      res.status(400).json({ message: 'Name is required' });
      return;
    }

    if (name.length < 3) {
      res.status(400).json({ message: 'Name must be at least 3 characters' });
      return;
    }

    if (name.length > 100) {
      res.status(400).json({ message: 'Name must not exceed 100 characters' });
      return;
    }

    const company: Company = {
      id: this.nextId++,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.companies.set(company.id, company);
    console.log(`[Mock API] Created company: ${name} (ID: ${company.id})`);
    res.status(201).json(company);
  }

  private updateCompany(req: Request, res: Response): void {
    const id = Number(req.params.id);
    const { name } = req.body;
    const company = this.companies.get(id);

    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    if (!name || typeof name !== 'string') {
      res.status(400).json({ message: 'Name is required' });
      return;
    }

    if (name.length < 3 || name.length > 100) {
      res.status(400).json({ message: 'Name must be between 3 and 100 characters' });
      return;
    }

    company.name = name;
    company.updatedAt = new Date().toISOString();

    this.companies.set(id, company);
    console.log(`[Mock API] Updated company ID ${id}: ${name}`);
    res.json(company);
  }

  private deleteCompany(req: Request, res: Response): void {
    const id = Number(req.params.id);

    if (this.companies.has(id)) {
      this.companies.delete(id);
      console.log(`[Mock API] Deleted company ID ${id}`);
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  }

  private bulkDeleteCompanies(req: Request, res: Response): void {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      res.status(400).json({ message: 'ids must be an array' });
      return;
    }

    const deletedCount = ids.filter((id) => {
      if (this.companies.has(Number(id))) {
        this.companies.delete(Number(id));
        return true;
      }
      return false;
    }).length;

    console.log(`[Mock API] Bulk deleted ${deletedCount} companies`);
    res.json({ success: true, deletedCount });
  }

  // Server lifecycle
  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(this.port, () => {
          console.log(`[Mock API] Server running on http://localhost:${this.port}`);
          resolve();
        });

        this.server.on('error', (error) => {
          console.error('[Mock API] Server error:', error);
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log('[Mock API] Server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  // Helper methods for tests
  reset(): void {
    this.companies.clear();
    this.nextId = 1;
    this.seedData();
    this.isAuthenticated = false;  // Reset to not authenticated
  }

  setAuthenticated(value: boolean): void {
    this.isAuthenticated = value;
  }
}

// CLI entry point for starting server standalone
if (require.main === module) {
  const port = Number(process.env.MOCK_API_PORT) || 3001;
  const server = new MockApiServer(port);

  server.start().catch((error) => {
    console.error('Failed to start mock server:', error);
    process.exit(1);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('\n[Mock API] Shutting down...');
    await server.stop();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

export default MockApiServer;
