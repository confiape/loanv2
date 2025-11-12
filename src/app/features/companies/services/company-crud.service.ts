import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Validators } from '@angular/forms';
import { BaseCrudService } from '@loan/app/core/services/base-crud.service';
import { TableColumnMetadata, FormFieldMetadata } from '@loan/app/core/models/form-metadata';
import { CompanyDto, SaveCompanyDto, CompanyApiService } from '@loan/app/shared/openapi';
import { noSpecialCharactersValidator } from '../validators/company.validators';

/**
 * CRUD service for Company entities
 * Provides all CRUD operations and form/table configurations
 */
@Injectable({
  providedIn: 'root',
})
export class CompanyCrudService extends BaseCrudService<CompanyDto, SaveCompanyDto> {
  private apiService = inject(CompanyApiService);

  // ========== ABSTRACT METHOD IMPLEMENTATIONS ==========

  protected fetchAllItems(): Observable<CompanyDto[]> {
    return this.apiService.getAllCompanies();
  }

  protected performSave(dto: SaveCompanyDto): Observable<CompanyDto> {
    const isUpdate = 'id' in dto && dto['id'];

    if (isUpdate) {
      // For update, we need to pass CompanyDto (which includes id)
      return this.apiService.updateCompany(dto as unknown as CompanyDto);
    } else {
      // For create, pass SaveCompanyDto
      return this.apiService.createCompany(dto);
    }
  }

  protected performDelete(id: string): Observable<unknown> {
    return this.apiService.deleteCompany(id);
  }

  protected matchesSearch(item: CompanyDto, term: string): boolean {
    const searchableFields = [item.name, item.id];

    return searchableFields.some((field) =>
      field.toLowerCase().includes(term.toLowerCase())
    );
  }

  getTableColumns(): TableColumnMetadata<CompanyDto>[] {
    return [
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        align: 'left',
      },
      {
        key: 'id',
        label: 'ID',
        sortable: true,
        align: 'left',
      },
    ];
  }

  getFormFields(): FormFieldMetadata[] {
    return [
      {
        key: 'name',
        label: 'Company Name',
        type: 'text',
        placeholder: 'Enter company name',
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40),
          noSpecialCharactersValidator(),
        ],
        helpText: 'Company name must be between 2-40 characters with no special characters',
      },
    ];
  }

  getRouteBasePath(): string {
    return '/companies';
  }

  getItemTypeName(): string {
    return 'company';
  }

  getItemTypePluralName(): string {
    return 'companies';
  }

  getItemDisplayName(item: CompanyDto): string {
    return item.name;
  }
}
