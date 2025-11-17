import { provideZonelessChangeDetection, inputBinding, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GenericCrudFormComponent } from './generic-crud-form';
import { FormFieldMetadata } from '@loan/app/core/models/form-metadata';
import { describe, it, expect } from 'vitest';

describe('GenericCrudFormComponent', () => {
  const mockFields: FormFieldMetadata[] = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter name',
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email',
    },
    {
      key: 'age',
      label: 'Age',
      type: 'number',
    },
    {
      key: 'birthDate',
      label: 'Birth Date',
      type: 'date',
    },
    {
      key: 'active',
      label: 'Active',
      type: 'checkbox',
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
      ],
    },
    {
      key: 'permissions',
      label: 'Permissions',
      type: 'multiselect',
      options: [
        { value: 'read', label: 'Read' },
        { value: 'write', label: 'Write' },
      ],
    },
    {
      key: 'gender',
      label: 'Gender',
      type: 'radio',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
      ],
    },
  ];

  it('should create', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(GenericCrudFormComponent, {
      bindings: [
        inputBinding('fields', () => mockFields),
        inputBinding('dataTestId', () => 'test-form'),
      ],
    });
    TestBed.tick();

    expect(fixture.nativeElement).toBeTruthy();
  });

  describe('data-testid propagation', () => {
    it('should render data-testid on text input field', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(GenericCrudFormComponent, {
        bindings: [
          inputBinding('fields', () => mockFields),
          inputBinding('dataTestId', () => 'test-form'),
        ],
      });
      TestBed.tick();

      const textInput = fixture.nativeElement.querySelector('input[data-testid="test-form-input-name"]');
      expect(textInput).toBeTruthy();
    });

    it('should render data-testid on email input field', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(GenericCrudFormComponent, {
        bindings: [
          inputBinding('fields', () => mockFields),
          inputBinding('dataTestId', () => 'test-form'),
        ],
      });
      TestBed.tick();

      const emailInput = fixture.nativeElement.querySelector('input[data-testid="test-form-input-email"]');
      expect(emailInput).toBeTruthy();
    });

    it('should render data-testid on number input field', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(GenericCrudFormComponent, {
        bindings: [
          inputBinding('fields', () => mockFields),
          inputBinding('dataTestId', () => 'test-form'),
        ],
      });
      TestBed.tick();

      const numberInput = fixture.nativeElement.querySelector('input[data-testid="test-form-number-age"]');
      expect(numberInput).toBeTruthy();
    });

    it('should render data-testid on date input field', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(GenericCrudFormComponent, {
        bindings: [
          inputBinding('fields', () => mockFields),
          inputBinding('dataTestId', () => 'test-form'),
        ],
      });
      TestBed.tick();

      const dateInput = fixture.nativeElement.querySelector(
        'input[data-testid="test-form-date-birthDate"]',
      );
      expect(dateInput).toBeTruthy();
    });

    it('should render data-testid on checkbox field', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(GenericCrudFormComponent, {
        bindings: [
          inputBinding('fields', () => mockFields),
          inputBinding('dataTestId', () => 'test-form'),
        ],
      });
      TestBed.tick();

      const checkbox = fixture.nativeElement.querySelector('input[data-testid="test-form-checkbox-active"]');
      expect(checkbox).toBeTruthy();
    });

    it('should render data-testid on select field', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(GenericCrudFormComponent, {
        bindings: [
          inputBinding('fields', () => mockFields),
          inputBinding('dataTestId', () => 'test-form'),
        ],
      });
      TestBed.tick();

      const select = fixture.nativeElement.querySelector('select[data-testid="test-form-select-role"]');
      expect(select).toBeTruthy();
    });

    it('should render data-testid on multiselect field', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(GenericCrudFormComponent, {
        bindings: [
          inputBinding('fields', () => mockFields),
          inputBinding('dataTestId', () => 'test-form'),
        ],
      });
      TestBed.tick();

      const multiselect = fixture.nativeElement.querySelector(
        'button[data-testid="test-form-multiselect-permissions"]',
      );
      expect(multiselect).toBeTruthy();
    });

    it('should render data-testid on radio group field', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(GenericCrudFormComponent, {
        bindings: [
          inputBinding('fields', () => mockFields),
          inputBinding('dataTestId', () => 'test-form'),
        ],
      });
      TestBed.tick();

      const radioOption = fixture.nativeElement.querySelector(
        'input[data-testid="test-form-radio-gender-option-male"]',
      );
      expect(radioOption).toBeTruthy();
    });

    it('should render data-testid on submit button', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(GenericCrudFormComponent, {
        bindings: [
          inputBinding('fields', () => mockFields),
          inputBinding('dataTestId', () => 'test-form'),
        ],
      });
      TestBed.tick();

      const submitBtn = fixture.nativeElement.querySelector('button[data-testid="test-form-btn-submit"]');
      expect(submitBtn).toBeTruthy();
    });

    it('should render data-testid on cancel button', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(GenericCrudFormComponent, {
        bindings: [
          inputBinding('fields', () => mockFields),
          inputBinding('dataTestId', () => 'test-form'),
        ],
      });
      TestBed.tick();

      const cancelBtn = fixture.nativeElement.querySelector('button[data-testid="test-form-btn-cancel"]');
      expect(cancelBtn).toBeTruthy();
    });

    it('should render all field test IDs with correct prefix', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(GenericCrudFormComponent, {
        bindings: [
          inputBinding('fields', () => mockFields),
          inputBinding('dataTestId', () => 'test-form'),
        ],
      });
      TestBed.tick();

      const allTestIds = fixture.nativeElement.querySelectorAll('[data-testid^="test-form-"]');
      expect(allTestIds.length).toBeGreaterThan(mockFields.length);
    });

    it('should display error message when error input is provided', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(GenericCrudFormComponent, {
        bindings: [
          inputBinding('fields', () => mockFields),
          inputBinding('dataTestId', () => 'test-form'),
          inputBinding('error', () => 'Test error message'),
        ],
      });
      TestBed.tick();

      const errorAlert = fixture.nativeElement.querySelector('[role="alert"]');
      expect(errorAlert).toBeTruthy();
      expect(errorAlert?.textContent).toContain('Test error message');
    });
  });

  describe('form behavior', () => {
    it('should emit formSubmit when form is valid and submitted', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(GenericCrudFormComponent, {
        bindings: [
          inputBinding('fields', () => mockFields),
          inputBinding('dataTestId', () => 'test-form'),
        ],
      });
      TestBed.tick();

      const component = fixture.componentInstance;
      let emittedData: unknown = null;
      component.formSubmit.subscribe((data) => {
        emittedData = data;
      });

      component.form.patchValue({ name: 'Test User', email: 'test@example.com' });
      component.onSubmit();

      expect(emittedData).toBeTruthy();
    });

    it('should emit formCancel when cancel button is clicked', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(GenericCrudFormComponent, {
        bindings: [
          inputBinding('fields', () => mockFields),
          inputBinding('dataTestId', () => 'test-form'),
        ],
      });
      TestBed.tick();

      const component = fixture.componentInstance;
      let cancelled = false;
      component.formCancel.subscribe(() => {
        cancelled = true;
      });

      component.onCancel();

      expect(cancelled).toBeTruthy();
    });
  });
});
