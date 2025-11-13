import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { LoginComponent } from '@loan/app/features/auth/pages/login/login';
import { loginGuard } from '@loan/app/features/auth/guards/login.guard';
import { userResolver } from '@loan/app/core/resolvers/user.resolver';
import { CompaniesListComponent } from '@loan/app/features/companies/pages/companies-list/companies-list';
import { RolesListComponent } from '@loan/app/features/roles/pages/roles-list/roles-list';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: '',
    component: MainLayoutComponent,
    resolve: {
      currentUser: userResolver,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        component: LoginComponent,
      },
      {
        path: 'companies',
        component: CompaniesListComponent,
      },
      {
        path: 'companies/:id',
        component: CompaniesListComponent,
      },
      {
        path: 'roles',
        component: RolesListComponent,
      },
      {
        path: 'roles/:id',
        component: RolesListComponent,
      },
    ],
  },
];
