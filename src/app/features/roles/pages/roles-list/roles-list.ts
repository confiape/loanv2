import { Component, inject } from '@angular/core';
import { GenericCrudListComponent } from '@loan/app/shared/components/generic-crud';
import { RoleCrudService } from '../../services/role-crud.service';

/**
 * Roles list page component
 * Uses GenericCrudListComponent for CRUD operations
 */
@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [GenericCrudListComponent],
  template: `
    <app-generic-crud-list
      [service]="service"
      [testIdPrefix]="'roles'"
    />
  `,
})
export class RolesListComponent {
  protected readonly service = inject(RoleCrudService);
}
