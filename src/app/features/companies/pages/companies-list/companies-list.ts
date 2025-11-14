import { Component, inject } from '@angular/core';
import { GenericCrudListComponent } from '@loan/app/shared/components/generic-crud';
import { CompanyCrudService } from '../../services/company-crud.service';

/**
 * Companies list page component
 * Uses GenericCrudListComponent for CRUD operations
 */
@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [GenericCrudListComponent],
  template: `
    <app-generic-crud-list
      [service]="service"
      data-testid="companies"
    />
  `,
})
export class CompaniesListComponent {
  protected readonly service = inject(CompanyCrudService);
}
