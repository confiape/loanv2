import { describe, it, expect, vi, Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';
import { CompanyCrudService } from './company-crud.service';
import { CompanyApiService, CompanyDto, SaveCompanyDto } from '@loan/app/shared/openapi';

const mockCompanies: CompanyDto[] = [
  { id: '1', name: 'Company One' },
  { id: '2', name: 'Company Two' },
  { id: '3', name: 'ABC Corp' },
];

const mockSaveDto: SaveCompanyDto = {
  name: 'New Company',
};

const mockCompanyDto: CompanyDto = {
  id: '4',
  name: 'New Company',
};

describe('CompanyCrudService', () => {
  function setupTestBed() {
    const apiServiceMock = {
      getAllCompanies: vi.fn() as Mock,
      createCompany: vi.fn() as Mock,
      updateCompany: vi.fn() as Mock,
      deleteCompany: vi.fn() as Mock,
    };

    const routerMock = {
      navigate: vi.fn() as Mock,
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        CompanyCrudService,
        { provide: CompanyApiService, useValue: apiServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    const service = TestBed.inject(CompanyCrudService);

    return { service, apiServiceMock, routerMock };
  }

  describe('Initialization', () => {
    it('should be created', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      expect(service).toBeTruthy();
    });

    it('should start with empty items', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      expect(service.items()).toEqual([]);
    });

    it('should start with loading false', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      expect(service.loading()).toBe(false);
    });

    it('should start with modal closed', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      expect(service.showModal()).toBe(false);
    });

    it('should start with no editing item', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      expect(service.editingItem()).toBeNull();
    });
  });

  describe('Metadata Methods', () => {
    it('should return correct route base path', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      expect(service.getRouteBasePath()).toBe('/companies');
    });

    it('should return correct item type name', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      expect(service.getItemTypeName()).toBe('company');
    });

    it('should return correct item type plural name', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      expect(service.getItemTypePluralName()).toBe('companies');
    });

    it('should return item display name', () => {
      // Arrange
      const { service } = setupTestBed();
      const company = mockCompanies[0];

      // Act & Assert
      expect(service.getItemDisplayName(company)).toBe('Company One');
    });

    describe('getTableColumns', () => {
      it('should return table columns configuration', () => {
        // Arrange
        const { service } = setupTestBed();

        // Act
        const columns = service.getTableColumns();

        // Assert
        expect(columns).toHaveLength(2);
        expect(columns[0].key).toBe('name');
        expect(columns[0].label).toBe('Name');
        expect(columns[0].sortable).toBe(true);
        expect(columns[1].key).toBe('id');
        expect(columns[1].label).toBe('ID');
      });
    });

    describe('getFormFields', () => {
      it('should return form fields configuration', () => {
        // Arrange
        const { service } = setupTestBed();

        // Act
        const fields = service.getFormFields();

        // Assert
        expect(fields).toHaveLength(1);
        expect(fields[0].key).toBe('name');
        expect(fields[0].label).toBe('Company Name');
        expect(fields[0].type).toBe('text');
      });

      it('should include all required validators', () => {
        // Arrange
        const { service } = setupTestBed();

        // Act
        const fields = service.getFormFields();
        const nameField = fields[0];

        // Assert
        expect(nameField.validators).toBeDefined();
        expect(nameField.validators).toHaveLength(4);
      });

      it('should include help text', () => {
        // Arrange
        const { service } = setupTestBed();

        // Act
        const fields = service.getFormFields();
        const nameField = fields[0];

        // Assert
        expect(nameField.helpText).toContain('2-40 characters');
        expect(nameField.helpText).toContain('no special characters');
      });
    });
  });

  describe('Data Operations', () => {
    describe('loadAllItems', () => {
      it('should load items from API', async () => {
        // Arrange
        const { service, apiServiceMock } = setupTestBed();
        apiServiceMock.getAllCompanies.mockReturnValue(of(mockCompanies));

        // Act & Assert
        await new Promise<void>((resolve) => {
          service.loadAllItems().subscribe(() => {
            expect(service.items()).toEqual(mockCompanies);
            expect(apiServiceMock.getAllCompanies).toHaveBeenCalled();
            resolve();
          });
        });
      });

      it('should set loading state during fetch', () => {
        // Arrange
        const { service, apiServiceMock } = setupTestBed();
        apiServiceMock.getAllCompanies.mockReturnValue(of(mockCompanies));

        // Act
        service.loadAllItems().subscribe(() => {
          // Assert
          expect(service.loading()).toBe(false);
        });
      });
    });

    describe('saveItem', () => {
      it('should create new company when no id present', async () => {
        // Arrange
        const { service, apiServiceMock } = setupTestBed();
        apiServiceMock.createCompany.mockReturnValue(of(mockCompanyDto));

        // Act & Assert
        await new Promise<void>((resolve) => {
          service.saveItem(mockSaveDto).subscribe((result) => {
            expect(result).toEqual(mockCompanyDto);
            expect(apiServiceMock.createCompany).toHaveBeenCalledWith(mockSaveDto);
            expect(apiServiceMock.updateCompany).not.toHaveBeenCalled();
            resolve();
          });
        });
      });

      it('should update company when id is present', async () => {
        // Arrange
        const { service, apiServiceMock } = setupTestBed();
        const updateDto = { id: '1', name: 'Updated Company' } as CompanyDto;
        apiServiceMock.updateCompany.mockReturnValue(of(updateDto));

        // Act & Assert
        await new Promise<void>((resolve) => {
          service.saveItem(updateDto as unknown as SaveCompanyDto).subscribe((result) => {
            expect(result).toEqual(updateDto);
            expect(apiServiceMock.updateCompany).toHaveBeenCalledWith(updateDto);
            expect(apiServiceMock.createCompany).not.toHaveBeenCalled();
            resolve();
          });
        });
      });
    });

    describe('deleteItem', () => {
      it('should delete item by id', async () => {
        // Arrange
        const { service, apiServiceMock } = setupTestBed();
        apiServiceMock.deleteCompany.mockReturnValue(of({}));
        service['_items'].set([...mockCompanies]);

        // Act & Assert
        await new Promise<void>((resolve) => {
          service.deleteItem('1').subscribe(() => {
            expect(apiServiceMock.deleteCompany).toHaveBeenCalledWith('1');
            expect(service.items().find((c) => c.id === '1')).toBeUndefined();
            resolve();
          });
        });
      });
    });
  });

  describe('Search Functionality', () => {
    it('should filter by company name', () => {
      // Arrange
      const { service } = setupTestBed();
      service['_items'].set([...mockCompanies]);

      // Act
      service.onSearch('Company One');
      const filtered = service.filteredItems();

      // Assert
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Company One');
    });

    it('should filter by company id', () => {
      // Arrange
      const { service } = setupTestBed();
      service['_items'].set([...mockCompanies]);

      // Act
      service.onSearch('2');
      const filtered = service.filteredItems();

      // Assert
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('2');
    });

    it('should be case insensitive', () => {
      // Arrange
      const { service } = setupTestBed();
      service['_items'].set([...mockCompanies]);

      // Act
      service.onSearch('abc');
      const filtered = service.filteredItems();

      // Assert
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('ABC Corp');
    });

    it('should return all items when search is empty', () => {
      // Arrange
      const { service } = setupTestBed();
      service['_items'].set([...mockCompanies]);

      // Act
      service.onSearch('');
      const filtered = service.filteredItems();

      // Assert
      expect(filtered).toHaveLength(3);
    });

    it('should return empty array when no matches', () => {
      // Arrange
      const { service } = setupTestBed();
      service['_items'].set([...mockCompanies]);

      // Act
      service.onSearch('nonexistent');
      const filtered = service.filteredItems();

      // Assert
      expect(filtered).toHaveLength(0);
    });
  });

  describe('UI Actions with Router Navigation', () => {
    describe('onNewItem', () => {
      it('should open modal for new item', () => {
        // Arrange
        const { service } = setupTestBed();

        // Act
        service.onNewItem();

        // Assert
        expect(service.showModal()).toBe(true);
        expect(service.editingItem()).toBeNull();
      });

      it('should not navigate when creating new item', () => {
        // Arrange
        const { service, routerMock } = setupTestBed();

        // Act
        service.onNewItem();

        // Assert
        expect(routerMock.navigate).not.toHaveBeenCalled();
      });
    });

    describe('onEditItem', () => {
      it('should navigate to edit route with item id', () => {
        // Arrange
        const { service, routerMock } = setupTestBed();
        const company = mockCompanies[0];

        // Act
        service.onEditItem(company);

        // Assert
        expect(routerMock.navigate).toHaveBeenCalledWith(['/companies', '1']);
      });
    });

    describe('onFormCancel', () => {
      it('should close modal', () => {
        // Arrange
        const { service } = setupTestBed();
        service['_showModal'].set(true);

        // Act
        service.onFormCancel();

        // Assert
        expect(service.showModal()).toBe(false);
      });

      it('should clear editing item', () => {
        // Arrange
        const { service } = setupTestBed();
        service['_editingItem'].set(mockCompanies[0]);

        // Act
        service.onFormCancel();

        // Assert
        expect(service.editingItem()).toBeNull();
      });

      it('should navigate back to list', () => {
        // Arrange
        const { service, routerMock } = setupTestBed();

        // Act
        service.onFormCancel();

        // Assert
        expect(routerMock.navigate).toHaveBeenCalledWith(['/companies']);
      });
    });

    describe('onAfterFormSave', () => {
      it('should navigate back to list after save', () => {
        // Arrange
        const { service, routerMock } = setupTestBed();

        // Act
        service['onAfterFormSave']();

        // Assert
        expect(routerMock.navigate).toHaveBeenCalledWith(['/companies']);
      });
    });
  });

  describe('Selection Management', () => {
    it('should update selected items', () => {
      // Arrange
      const { service } = setupTestBed();
      const selectedIds = new Set(['1', '2']);

      // Act
      service.onSelectionChange(selectedIds);

      // Assert
      expect(service.selectedItems()).toEqual(selectedIds);
    });

    it('should select all items', () => {
      // Arrange
      const { service } = setupTestBed();
      service['_items'].set([...mockCompanies]);
      service['_pageSize'].set(0);

      // Act
      service.onSelectAll(true);

      // Assert
      expect(service.selectedItems().size).toBe(3);
    });

    it('should clear all selections', () => {
      // Arrange
      const { service } = setupTestBed();
      service['_selectedItems'].set(new Set(['1', '2']));

      // Act
      service.onSelectAll(false);

      // Assert
      expect(service.selectedItems().size).toBe(0);
    });

    it('should remove item from selection', () => {
      // Arrange
      const { service } = setupTestBed();
      service['_selectedItems'].set(new Set(['1', '2', '3']));

      // Act
      service.removeFromSelection('2');

      // Assert
      expect(service.selectedItems().has('2')).toBe(false);
      expect(service.selectedItems().size).toBe(2);
    });

    it('should clear all selections with clearSelection', () => {
      // Arrange
      const { service } = setupTestBed();
      service['_selectedItems'].set(new Set(['1', '2']));

      // Act
      service.clearSelection();

      // Assert
      expect(service.selectedItems().size).toBe(0);
    });

    it('should return selected items data', () => {
      // Arrange
      const { service } = setupTestBed();
      service['_items'].set([...mockCompanies]);
      service['_selectedItems'].set(new Set(['1', '3']));

      // Act
      const selectedData = service.selectedItemsData();

      // Assert
      expect(selectedData).toHaveLength(2);
      expect(selectedData[0].id).toBe('1');
      expect(selectedData[1].id).toBe('3');
    });

    it('should indicate if there are selections', () => {
      // Arrange
      const { service } = setupTestBed();

      // Assert (before)
      expect(service.hasSelection()).toBe(false);

      // Act
      service['_selectedItems'].set(new Set(['1']));

      // Assert (after)
      expect(service.hasSelection()).toBe(true);
    });
  });

  describe('Delete Operations', () => {
    it('should show delete confirmation modal', () => {
      // Arrange
      const { service } = setupTestBed();
      service['_items'].set([...mockCompanies]);

      // Act
      service.onDeleteItem(mockCompanies[0]);

      // Assert
      expect(service.showDeleteConfirm()).toBe(true);
    });

    it('should cancel delete operation', () => {
      // Arrange
      const { service } = setupTestBed();
      service['_showDeleteConfirm'].set(true);

      // Act
      service.cancelDelete();

      // Assert
      expect(service.showDeleteConfirm()).toBe(false);
    });

    it('should confirm single delete', () => {
      // Arrange
      const { service, apiServiceMock } = setupTestBed();
      apiServiceMock.deleteCompany.mockReturnValue(of({}));
      service['_deleteTarget'].set(mockCompanies[0]);
      service['_showDeleteConfirm'].set(true);

      // Act
      service.confirmDelete();

      // Assert
      expect(apiServiceMock.deleteCompany).toHaveBeenCalledWith('1');
    });
  });

  describe('Pagination', () => {
    it('should return paginated data', () => {
      // Arrange
      const { service } = setupTestBed();
      service['_items'].set([...mockCompanies]);
      service['_pageSize'].set(2);
      service['_currentPage'].set(1);

      // Act
      const tableData = service.getTableData();

      // Assert
      expect(tableData).toHaveLength(2);
    });

    it('should change page', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act
      service.onPageChange(2);

      // Assert
      expect(service.currentPage()).toBe(2);
    });

    it('should return all data when pagination disabled', () => {
      // Arrange
      const { service } = setupTestBed();
      service['_items'].set([...mockCompanies]);
      service['_pageSize'].set(0);

      // Act
      const tableData = service.getTableData();

      // Assert
      expect(tableData).toHaveLength(3);
    });
  });

  describe('Delete Message', () => {
    it('should return message for single item delete', () => {
      // Arrange
      const { service } = setupTestBed();
      service['_deleteTarget'].set(mockCompanies[0]);

      // Act
      const message = service.deleteMessage();

      // Assert
      expect(message).toContain('Company One');
      expect(message).toContain('delete');
    });

    it('should return message for bulk delete', () => {
      // Arrange
      const { service } = setupTestBed();
      service['_selectedItems'].set(new Set(['1', '2']));
      service['_deleteTarget'].set(null);

      // Act
      const message = service.deleteMessage();

      // Assert
      expect(message).toContain('2 items');
    });
  });
});
