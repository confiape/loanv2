import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { LoginComponent } from '@loan/app/features/auth/pages/login/login';
import { loginGuard } from '@loan/app/features/auth/guards/login.guard';
import { userResolver } from '@loan/app/core/resolvers/user.resolver';
import { commonDataResolver } from '@loan/app/core/resolvers/common-data.resolver';
import { CompaniesListComponent } from '@loan/app/features/companies/pages/companies-list/companies-list';
import { RolesListComponent } from '@loan/app/features/roles/pages/roles-list/roles-list';
import { UsersListComponent } from '@loan/app/features/users/pages/users-list/users-list';
import { CustomersListComponent } from '@loan/app/features/customers/pages/customers-list/customers-list';
import {Home} from '@loan/app/features/home';

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
      commonData: commonDataResolver,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        component: Home,
      },
      {
        path: 'companies',
        component: CompaniesListComponent,
      },
      {
        path: 'companies/new',
        component: CompaniesListComponent,
      },
      {
        path: 'companies/:id',
        component: CompaniesListComponent,
      },
      {
        path: 'companies/:id/edit',
        component: CompaniesListComponent,
      },
      {
        path: 'roles',
        component: RolesListComponent,
      },
      {
        path: 'roles/new',
        component: RolesListComponent,
      },
      {
        path: 'roles/:id',
        component: RolesListComponent,
      },
      {
        path: 'roles/:id/edit',
        component: RolesListComponent,
      },
      {
        path: 'users',
        component: UsersListComponent,
      },
      {
        path: 'users/new',
        component: UsersListComponent,
      },
      {
        path: 'users/:id',
        component: UsersListComponent,
      },
      {
        path: 'users/:id/edit',
        component: UsersListComponent,
      },
      {
        path: 'customers',
        component: CustomersListComponent,
      },
      {
        path: 'customers/new',
        component: CustomersListComponent,
      },
      {
        path: 'customers/:id',
        component: CustomersListComponent,
      },
      {
        path: 'customers/:id/edit',
        component: CustomersListComponent,
      },
    ],
  },
];
