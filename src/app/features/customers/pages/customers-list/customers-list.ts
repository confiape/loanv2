import { Component, inject } from '@angular/core';
import { GenericCrudListComponent } from '@loan/app/shared/components/generic-crud';
import { CustomerCrudService } from '../../services/customer-crud.service';

/**
 * Customers list page component
 * Uses GenericCrudListComponent for CRUD operations
 */
@Component({
  selector: 'app-customers-list',
  imports: [GenericCrudListComponent],
  template: ` <app-generic-crud-list [service]="service" [dataTestId]="'customers'" /> `,
})
export class CustomersListComponent {
  readonly service = inject(CustomerCrudService);
}
