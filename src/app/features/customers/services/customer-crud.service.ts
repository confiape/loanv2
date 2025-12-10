import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Validators } from '@angular/forms';
import { BaseCrudService } from '@loan/app/core/services/base-crud.service';
import {
  TableColumnMetadata,
  FormFieldMetadata,
  DisplayFieldMetadata,
} from '@loan/app/core/models/form-metadata';
import {
  BorrowerClientInformation,
  CreateBorrowerDto,
  BorrowerApiService,
} from '@loan/app/shared/openapi';
import { CommonDataCacheService } from '@loan/app/core/services/cache/common-data-cache.service';
import { formatCurrency } from '@loan/app/shared/utils/formatters';
import { map } from 'rxjs/operators';

/**
 * CRUD service for Customer (Borrower) entities
 * Provides all CRUD operations and form/table configurations
 */
@Injectable({
  providedIn: 'root',
})
export class CustomerCrudService extends BaseCrudService<
  BorrowerClientInformation,
  CreateBorrowerDto
> {
  private apiService = inject(BorrowerApiService);
  private commonDataCache = inject(CommonDataCacheService);
  private router = inject(Router);

  // ========== ABSTRACT METHOD IMPLEMENTATIONS ==========

  protected fetchAllItems(): Observable<BorrowerClientInformation[]> {
    return this.apiService.getAllWithClientInformation();
  }

  protected performSave(dto: CreateBorrowerDto): Observable<BorrowerClientInformation> {
    // Check if it's an update (we'll need to get the ID from editingItem)
    const editingItem = this._editingItem();

    if (editingItem?.id) {
      // Update existing borrower
      return this.apiService.updateBorrower(editingItem.id, dto).pipe(
        // Transform BorrowerClientWithActiveLoansDto to BorrowerClientInformation
        map((result) => ({
          id: result.id,
          person: result.person,
          displayName: result.displayName,
          company: result.company || { id: '', name: '' },
          totalAmountLoaned: 0,
          outstandingAmount: 0,
          lastPayments: [],
        }))
      );
    } else {
      // Create new borrower
      return this.apiService.createBorrower(dto).pipe(
        map((result) => ({
          id: result.id,
          person: result.person,
          displayName: result.displayName,
          company: result.company || { id: '', name: '' },
          totalAmountLoaned: 0,
          outstandingAmount: 0,
          lastPayments: [],
        }))
      );
    }
  }

  protected performDelete(id: string): Observable<unknown> {
    return this.apiService.deleteBorrower(id);
  }

  protected matchesSearch(item: BorrowerClientInformation, term: string): boolean {
    const searchableFields = [
      item.id,
      item.displayName,
      item.person?.name,
      item.person?.dni,
      item.company?.name,
    ];

    return searchableFields.some((field) =>
      field?.toLowerCase().includes(term.toLowerCase())
    );
  }

  getTableColumns(): TableColumnMetadata<BorrowerClientInformation>[] {
    return [
      {
        key: 'displayName',
        label: 'Display Name',
        sortable: true,
        align: 'left',
      },
      {
        key: 'person.name',
        label: 'Full Name',
        sortable: true,
        align: 'left',
        valueGetter: (item) => item.person?.name || 'N/A',
      },
      {
        key: 'person.dni',
        label: 'DNI',
        sortable: true,
        align: 'left',
        valueGetter: (item) => item.person?.dni || 'N/A',
      },
      {
        key: 'company.name',
        label: 'Company',
        sortable: true,
        align: 'left',
        valueGetter: (item) => item.company?.name || 'N/A',
      },
      {
        key: 'totalAmountLoaned',
        label: 'Total Loaned',
        sortable: true,
        align: 'right',
        formatter: (value) => formatCurrency(value),
      },
      {
        key: 'outstandingAmount',
        label: 'Outstanding',
        sortable: true,
        align: 'right',
        formatter: (value) => formatCurrency(value),
      },
    ];
  }

  getFormFields(): FormFieldMetadata[] {
    return [
      {
        key: 'displayName',
        label: 'Display Name',
        type: 'text',
        placeholder: 'Enter display name',
        validators: [Validators.required, Validators.minLength(2)],
        helpText: 'The name to display for this customer',
      },
      {
        key: 'companyId',
        label: 'Company',
        type: 'select',
        placeholder: 'Select a company',
        validators: [Validators.required],
        helpText: 'Select the company this customer belongs to',
        loadOptions: () => of(this.commonDataCache.getCompanyOptions()),
        // Read from company.id (BorrowerClientInformation), write to companyId (CreateBorrowerDto)
        dtoPath: { read: 'company.id', write: 'companyId' },
      },
      {
        key: 'personName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Enter full name',
        validators: [Validators.required, Validators.minLength(2)],
        helpText: 'Customer full name',
        // Read from person.name (BorrowerClientInformation), write to personDto.name (CreateBorrowerDto)
        dtoPath: { read: 'person.name', write: 'personDto.name' },
      },
      {
        key: 'personDni',
        label: 'DNI',
        type: 'text',
        placeholder: 'Enter DNI',
        validators: [Validators.required],
        helpText: 'National ID number',
        // Read from person.dni (BorrowerClientInformation), write to personDto.dni (CreateBorrowerDto)
        dtoPath: { read: 'person.dni', write: 'personDto.dni' },
      },
      {
        key: 'personPhoneNumber',
        label: 'Phone Number',
        type: 'text',
        placeholder: 'Enter phone number',
        validators: [Validators.required],
        helpText: 'Contact phone number',
        // Read from person.phoneNumber (BorrowerClientInformation), write to personDto.phoneNumber (CreateBorrowerDto)
        dtoPath: { read: 'person.phoneNumber', write: 'personDto.phoneNumber' },
      },
      {
        key: 'personNotes',
        label: 'Notes',
        type: 'text',
        placeholder: 'Enter notes',
        helpText: 'Additional notes (optional)',
        // Read from person.notes (BorrowerClientInformation), write to personDto.notes (CreateBorrowerDto)
        dtoPath: { read: 'person.notes', write: 'personDto.notes' },
      },
    ];
  }

  getDisplayFields(): DisplayFieldMetadata[] {
    return [
      {
        key: 'displayName',
        label: 'Display Name',
      },
      {
        key: 'person.name',
        label: 'Full Name',
        valueGetter: (item: unknown) => {
          const customerItem = item as BorrowerClientInformation;
          return customerItem.person?.name || 'N/A';
        },
      },
      {
        key: 'person.dni',
        label: 'DNI',
        valueGetter: (item: unknown) => {
          const customerItem = item as BorrowerClientInformation;
          return customerItem.person?.dni || 'N/A';
        },
      },
      {
        key: 'person.phoneNumber',
        label: 'Phone Number',
        valueGetter: (item: unknown) => {
          const customerItem = item as BorrowerClientInformation;
          return customerItem.person?.phoneNumber || 'N/A';
        },
      },
      {
        key: 'person.notes',
        label: 'Notes',
        valueGetter: (item: unknown) => {
          const customerItem = item as BorrowerClientInformation;
          return customerItem.person?.notes || 'N/A';
        },
      },
      {
        key: 'company.name',
        label: 'Company',
        valueGetter: (item: unknown) => {
          const customerItem = item as BorrowerClientInformation;
          return customerItem.company?.name || 'N/A';
        },
      },
      {
        key: 'totalAmountLoaned',
        label: 'Total Amount Loaned',
        formatter: (value) => formatCurrency(value),
      },
      {
        key: 'outstandingAmount',
        label: 'Outstanding Amount',
        formatter: (value) => formatCurrency(value),
      },
    ];
  }

  getRouteBasePath(): string {
    return '/customers';
  }

  getItemTypeName(): string {
    return 'customer';
  }

  getItemTypePluralName(): string {
    return 'customers';
  }

  getItemDisplayName(item: BorrowerClientInformation): string {
    return item.displayName || item.person?.name || item.id;
  }

  // ========== UI ACTION OVERRIDES (for routing) ==========

  /**
   * Override to navigate to new route
   */
  override onNewItem(): void {
    this.router.navigate([this.getRouteBasePath(), 'new']);
  }

  /**
   * Override to navigate to edit route
   */
  override onEditItem(item: BorrowerClientInformation): void {
    this.router.navigate([this.getRouteBasePath(), item.id, 'edit']);
  }

  /**
   * Override to navigate back to list after saving
   */
  protected override onAfterFormSave(): void {
    this.router.navigate([this.getRouteBasePath()]);
  }

  /**
   * Override to navigate back to list when canceling
   */
  override onFormCancel(): void {
    this._showModal.set(false);
    this._editingItem.set(null);
    this.router.navigate([this.getRouteBasePath()]);
  }
}
