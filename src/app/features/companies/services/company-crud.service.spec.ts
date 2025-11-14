import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';
import { CompanyCrudService } from './company-crud.service';
import { CompanyApiService, CompanyDto, SaveCompanyDto } from '@loan/app/shared/openapi';

describe('CompanyCrudService', () => {
  let service: CompanyCrudService;
  let apiServiceMock: {
    getAllCompanies: Mock;
    createCompany: Mock;
    updateCompany: Mock;
    deleteCompany: Mock;
  };
  let routerMock: {
    navigate: Mock;
  };

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

  beforeEach(() => {
    apiServiceMock = {
      getAllCompanies: vi.fn() as Mock,
      createCompany: vi.fn() as Mock,
      updateCompany: vi.fn() as Mock,
      deleteCompany: vi.fn() as Mock,
    };

    routerMock = {
      navigate: vi.fn().mockResolvedValue(true) as Mock,
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        CompanyCrudService,
        { provide: CompanyApiService, useValue: apiServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    service = TestBed.inject(CompanyCrudService);
  });

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should start with empty items', () => {
      expect(service.items()).toEqual([]);
    });

    it('should start with loading false', () => {
      expect(service.loading()).toBe(false);
    });

    it('should start with modal closed', () => {
      expect(service.showModal()).toBe(false);
    });

    it('should start with no editing item', () => {
      expect(service.editingItem()).toBeNull();
    });
  });

  describe('Metadata Properties', () => {
    it('should have correct item type name', () => {
      expect(service.itemTypeName).toBe('company');
    });

    it('should have correct item type plural name', () => {
      expect(service.itemTypePluralName).toBe('companies');
    });

    it('should compute route base path from plural name', () => {
      expect(service.routeBasePath).toBe('/companies');
    });

    it('should return item display name', () => {
      const company = mockCompanies[0];
      expect(service.getItemDisplayName(company)).toBe('Company One');
    });

    describe('getTableColumns', () => {
      it('should return table columns configuration', () => {
        const columns = service.getTableColumns();

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
        const fields = service.getFormFields();

        expect(fields).toHaveLength(1);
        expect(fields[0].key).toBe('name');
        expect(fields[0].label).toBe('Company Name');
        expect(fields[0].type).toBe('text');
      });

      it('should include all required validators', () => {
        const fields = service.getFormFields();
        const nameField = fields[0];

        expect(nameField.validators).toBeDefined();
        expect(nameField.validators).toHaveLength(4);
      });

      it('should include help text', () => {
        const fields = service.getFormFields();
        const nameField = fields[0];

        expect(nameField.helpText).toContain('2-40 characters');
        expect(nameField.helpText).toContain('no special characters');
      });
    });
  });

  describe('Data Operations', () => {
    describe('loadAllItems', () => {
      it('should load items from API', async () => {
        apiServiceMock.getAllCompanies.mockReturnValue(of(mockCompanies));

        await new Promise<void>((resolve) => {
          service.loadAllItems().subscribe(() => {
            expect(service.items()).toEqual(mockCompanies);
            expect(apiServiceMock.getAllCompanies).toHaveBeenCalled();
            resolve();
          });
        });
      });

      it('should set loading state during fetch', () => {
        apiServiceMock.getAllCompanies.mockReturnValue(of(mockCompanies));

        service.loadAllItems().subscribe(() => {
          expect(service.loading()).toBe(false);
        });
      });
    });

    describe('saveItem', () => {
      it('should create new company when no id present', async () => {
        apiServiceMock.createCompany.mockReturnValue(of(mockCompanyDto));

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
        const updateDto = { id: '1', name: 'Updated Company' } as CompanyDto;
        apiServiceMock.updateCompany.mockReturnValue(of(updateDto));

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
        apiServiceMock.deleteCompany.mockReturnValue(of({}));
        service['_items'].set([...mockCompanies]);

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
    beforeEach(() => {
      service['_items'].set([...mockCompanies]);
    });

    it('should filter by company name', () => {
      service.onSearch('Company One');

      const filtered = service.filteredItems();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Company One');
    });

    it('should filter by company id', () => {
      service.onSearch('2');

      const filtered = service.filteredItems();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('2');
    });

    it('should be case insensitive', () => {
      service.onSearch('abc');

      const filtered = service.filteredItems();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('ABC Corp');
    });

    it('should return all items when search is empty', () => {
      service.onSearch('');

      const filtered = service.filteredItems();
      expect(filtered).toHaveLength(3);
    });

    it('should return empty array when no matches', () => {
      service.onSearch('nonexistent');

      const filtered = service.filteredItems();
      expect(filtered).toHaveLength(0);
    });
  });

  describe('UI Actions with Router Navigation', () => {
    describe('onNewItem', () => {
      it('should open modal for new item', () => {
        service.onNewItem();

        expect(service.showModal()).toBe(true);
        expect(service.editingItem()).toBeNull();
      });

      it('should not navigate when creating new item', () => {
        service.onNewItem();

        expect(routerMock.navigate).not.toHaveBeenCalled();
      });
    });

    describe('onEditItem', () => {
      it('should navigate to edit route with item id', () => {
        const company = mockCompanies[0];
        service.onEditItem(company);

        expect(routerMock.navigate).toHaveBeenCalledWith(['/companies', '1']);
      });
    });

    describe('onFormCancel', () => {
      it('should close modal', () => {
        service['_showModal'].set(true);
        service.onFormCancel();

        expect(service.showModal()).toBe(false);
      });

      it('should clear editing item', () => {
        service['_editingItem'].set(mockCompanies[0]);
        service.onFormCancel();

        expect(service.editingItem()).toBeNull();
      });

      it('should navigate back to list', () => {
        service.onFormCancel();

        expect(routerMock.navigate).toHaveBeenCalledWith(['/companies']);
      });
    });

    describe('onFormSave', () => {
      it('should navigate back to list after save', () => {
        service.onFormSave();

        expect(routerMock.navigate).toHaveBeenCalledWith(['/companies']);
      });
    });
  });

  describe('Selection Management', () => {
    beforeEach(() => {
      service['_items'].set([...mockCompanies]);
    });

    it('should update selected items', () => {
      const selectedIds = new Set(['1', '2']);
      service.onSelectionChange(selectedIds);

      expect(service.selectedItems()).toEqual(selectedIds);
    });

    it('should select all items', () => {
      service['_pageSize'].set(0); // Disable pagination for this test
      service.onSelectAll(true);

      expect(service.selectedItems().size).toBe(3);
    });

    it('should clear all selections', () => {
      service['_selectedItems'].set(new Set(['1', '2']));
      service.onSelectAll(false);

      expect(service.selectedItems().size).toBe(0);
    });

    it('should remove item from selection', () => {
      service['_selectedItems'].set(new Set(['1', '2', '3']));
      service.removeFromSelection('2');

      expect(service.selectedItems().has('2')).toBe(false);
      expect(service.selectedItems().size).toBe(2);
    });

    it('should clear all selections with clearSelection', () => {
      service['_selectedItems'].set(new Set(['1', '2']));
      service.clearSelection();

      expect(service.selectedItems().size).toBe(0);
    });

    it('should return selected items data', () => {
      service['_selectedItems'].set(new Set(['1', '3']));

      const selectedData = service.selectedItemsData();
      expect(selectedData).toHaveLength(2);
      expect(selectedData[0].id).toBe('1');
      expect(selectedData[1].id).toBe('3');
    });

    it('should indicate if there are selections', () => {
      expect(service.hasSelection()).toBe(false);

      service['_selectedItems'].set(new Set(['1']));
      expect(service.hasSelection()).toBe(true);
    });
  });

  describe('Delete Operations', () => {
    beforeEach(() => {
      service['_items'].set([...mockCompanies]);
    });

    it('should show delete confirmation modal', () => {
      service.onDeleteItem(mockCompanies[0]);

      expect(service.showDeleteConfirm()).toBe(true);
    });

    it('should cancel delete operation', () => {
      service['_showDeleteConfirm'].set(true);
      service.cancelDelete();

      expect(service.showDeleteConfirm()).toBe(false);
    });

    it('should confirm single delete', () => {
      apiServiceMock.deleteCompany.mockReturnValue(of({}));
      service['_deleteTarget'].set(mockCompanies[0]);
      service['_showDeleteConfirm'].set(true);

      service.confirmDelete();

      expect(apiServiceMock.deleteCompany).toHaveBeenCalledWith('1');
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      service['_items'].set([...mockCompanies]);
      service['_pageSize'].set(2);
    });

    it('should return paginated data', () => {
      service['_currentPage'].set(1);

      const tableData = service.getTableData();
      expect(tableData).toHaveLength(2);
    });

    it('should change page', () => {
      service.onPageChange(2);

      expect(service.currentPage()).toBe(2);
    });

    it('should return all data when pagination disabled', () => {
      service['_pageSize'].set(0);

      const tableData = service.getTableData();
      expect(tableData).toHaveLength(3);
    });
  });

  describe('Delete Message', () => {
    it('should return message for single item delete', () => {
      service['_deleteTarget'].set(mockCompanies[0]);

      const message = service.deleteMessage();
      expect(message).toContain('Company One');
      expect(message).toContain('delete');
    });

    it('should return message for bulk delete', () => {
      service['_selectedItems'].set(new Set(['1', '2']));
      service['_deleteTarget'].set(null);

      const message = service.deleteMessage();
      expect(message).toContain('2 items');
    });
  });
});
