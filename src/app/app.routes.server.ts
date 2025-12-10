import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },
  { path: 'login', renderMode: RenderMode.Server },

  { path: 'home', renderMode: RenderMode.Server },

  { path: 'companies', renderMode: RenderMode.Server },
  { path: 'companies/**', renderMode: RenderMode.Server },

  { path: 'roles', renderMode: RenderMode.Server },
  { path: 'roles/**', renderMode: RenderMode.Server },

  { path: 'users', renderMode: RenderMode.Server },
  { path: 'users/**', renderMode: RenderMode.Server },

  { path: 'customers', renderMode: RenderMode.Server },
  { path: 'customers/**', renderMode: RenderMode.Server },
];
