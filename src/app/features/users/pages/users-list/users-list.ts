import { Component, inject } from '@angular/core';
import { GenericCrudListComponent } from '@loan/app/shared/components/generic-crud';
import { UserCrudService } from '../../services/user-crud.service';

/**
 * Users list page component
 * Uses GenericCrudListComponent for CRUD operations
 */
@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [GenericCrudListComponent],
  template: ` <app-generic-crud-list [service]="service" [dataTestId]="'users'" /> `,
})
export class UsersListComponent {
  readonly service = inject(UserCrudService);
}
