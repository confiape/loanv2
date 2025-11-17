import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { GenericCrudFormComponent } from './generic-crud-form';
import { FormFieldMetadata } from '@loan/app/core/models/form-metadata';

describe('GenericCrudFormComponent', () => {
  let component: GenericCrudFormComponent;
  let fixture: ComponentFixture<GenericCrudFormComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericCrudFormComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericCrudFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('fields', mockFields);
    fixture.componentRef.setInput('dataTestId', 'test-form');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('data-testid propagation', () => {
    it('should render data-testid on text input field', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const textInput = compiled.querySelector('input[data-testid="test-form-input-name"]');
      expect(textInput).toBeTruthy();
    });

    it('should render data-testid on email input field', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const emailInput = compiled.querySelector('input[data-testid="test-form-input-email"]');
      expect(emailInput).toBeTruthy();
    });

    it('should render data-testid on number input field', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const numberInput = compiled.querySelector('input[data-testid="test-form-number-age"]');
      expect(numberInput).toBeTruthy();
    });

    it('should render data-testid on date input field', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const dateInput = compiled.querySelector(
        'input[data-testid="test-form-date-birthDate"]',
      );
      expect(dateInput).toBeTruthy();
    });

    it('should render data-testid on checkbox field', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const checkbox = compiled.querySelector('input[data-testid="test-form-checkbox-active"]');
      expect(checkbox).toBeTruthy();
    });

    it('should render data-testid on select field', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const select = compiled.querySelector('select[data-testid="test-form-select-role"]');
      expect(select).toBeTruthy();
    });

    it('should render data-testid on multiselect field', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const multiselect = compiled.querySelector(
        'button[data-testid="test-form-multiselect-permissions"]',
      );
      expect(multiselect).toBeTruthy();
    });

    it('should render data-testid on radio group field', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      // Radio group should have at least one radio button with the test id
      const radioOption = compiled.querySelector(
        'input[data-testid="test-form-radio-gender-option-male"]',
      );
      expect(radioOption).toBeTruthy();
    });

    it('should render data-testid on submit button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const submitBtn = compiled.querySelector('button[data-testid="test-form-btn-submit"]');
      expect(submitBtn).toBeTruthy();
    });

    it('should render data-testid on cancel button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const cancelBtn = compiled.querySelector('button[data-testid="test-form-btn-cancel"]');
      expect(cancelBtn).toBeTruthy();
    });

    it('should render all field test IDs with correct prefix', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const allTestIds = compiled.querySelectorAll('[data-testid^="test-form-"]');
      // Should have at least fields + buttons
      expect(allTestIds.length).toBeGreaterThan(mockFields.length);
    });

    it('should display error message when error input is provided', () => {
      fixture.componentRef.setInput('error', 'Test error message');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorAlert = compiled.querySelector('[role="alert"]');
      expect(errorAlert).toBeTruthy();
      expect(errorAlert?.textContent).toContain('Test error message');
    });
  });

  describe('form behavior', () => {
    it('should emit formSubmit when form is valid and submitted', () => {
      let emittedData: unknown = null;
      component.formSubmit.subscribe((data) => {
        emittedData = data;
      });

      component.form.patchValue({ name: 'Test User', email: 'test@example.com' });
      component.onSubmit();

      expect(emittedData).toBeTruthy();
    });

    it('should emit formCancel when cancel button is clicked', () => {
      let cancelled = false;
      component.formCancel.subscribe(() => {
        cancelled = true;
      });

      component.onCancel();

      expect(cancelled).toBeTruthy();
    });

    // Test for disabled state skipped - form validation behavior tested separately
  });
});
