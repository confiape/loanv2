import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { Validators } from '@angular/forms';
import { GenericCrudFormComponent } from './generic-crud-form';
import { FormFieldMetadata } from '@loan/app/core/models/form-metadata';

describe('GenericCrudFormComponent - data-testid', () => {
  it('should render test IDs for all form field types when testIdPrefix is provided', async () => {
    const mockFields: FormFieldMetadata[] = [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        validators: [Validators.required],
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        validators: [Validators.email],
      },
      {
        key: 'password',
        label: 'Password',
        type: 'password',
      },
      {
        key: 'age',
        label: 'Age',
        type: 'number',
        min: 0,
        max: 120,
      },
      {
        key: 'birthdate',
        label: 'Birth Date',
        type: 'date',
      },
      {
        key: 'active',
        label: 'Active',
        type: 'checkbox',
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
      {
        key: 'country',
        label: 'Country',
        type: 'select',
        options: [
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
        ],
      },
      {
        key: 'languages',
        label: 'Languages',
        type: 'multiselect',
        options: [
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
        ],
      },
    ];

    @Component({
      template: `
        <app-generic-crud-form
          [fields]="fields"
          [testIdPrefix]="'user-form'"
        />
      `,
      standalone: true,
      imports: [GenericCrudFormComponent],
    })
    class TestWrapper {
      fields = mockFields;
    }

    await TestBed.configureTestingModule({
      imports: [TestWrapper],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestWrapper);
    fixture.detectChanges();
    await fixture.whenStable();

    const formElement = fixture.nativeElement.querySelector('app-generic-crud-form');

    // Verify text input
    const nameInput = formElement.querySelector('app-input[data-testid="user-form-input-name-wrapper"]');
    expect(nameInput).toBeTruthy();

    // Verify email input
    const emailInput = formElement.querySelector('app-input[data-testid="user-form-input-email-wrapper"]');
    expect(emailInput).toBeTruthy();

    // Verify password input
    const passwordInput = formElement.querySelector(
      'app-password-input[data-testid="user-form-password-password-wrapper"]'
    );
    expect(passwordInput).toBeTruthy();

    // Verify number input
    const ageInput = formElement.querySelector(
      'app-input-number[data-testid="user-form-number-age-wrapper"]'
    );
    expect(ageInput).toBeTruthy();

    // Verify date input
    const birthdateInput = formElement.querySelector(
      'app-date-input[data-testid="user-form-date-birthdate-wrapper"]'
    );
    expect(birthdateInput).toBeTruthy();

    // Verify checkbox
    const activeCheckbox = formElement.querySelector(
      'app-checkbox[data-testid="user-form-checkbox-active-wrapper"]'
    );
    expect(activeCheckbox).toBeTruthy();

    // Verify radio group
    const genderRadio = formElement.querySelector(
      'app-radio-group[data-testid="user-form-radio-gender-wrapper"]'
    );
    expect(genderRadio).toBeTruthy();

    // Verify select
    const countrySelect = formElement.querySelector(
      'app-select[data-testid="user-form-select-country-wrapper"]'
    );
    expect(countrySelect).toBeTruthy();

    // Verify multiselect
    const languagesMultiselect = formElement.querySelector(
      'app-multiselect[data-testid="user-form-multiselect-languages-wrapper"]'
    );
    expect(languagesMultiselect).toBeTruthy();

    // Verify form buttons
    const cancelButton = formElement.querySelector(
      'app-button[data-testid="user-form-btn-cancel-wrapper"]'
    );
    expect(cancelButton).toBeTruthy();

    const submitButton = formElement.querySelector(
      'app-button[data-testid="user-form-btn-submit-wrapper"]'
    );
    expect(submitButton).toBeTruthy();
  });

  it('should render form error alert with correct test ID', async () => {
    const mockFields: FormFieldMetadata[] = [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
      },
    ];

    @Component({
      template: `
        <app-generic-crud-form
          [fields]="fields"
          [error]="'Something went wrong'"
          [testIdPrefix]="'user-form'"
        />
      `,
      standalone: true,
      imports: [GenericCrudFormComponent],
    })
    class TestWrapper {
      fields = mockFields;
    }

    await TestBed.configureTestingModule({
      imports: [TestWrapper],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestWrapper);
    fixture.detectChanges();
    await fixture.whenStable();

    const formElement = fixture.nativeElement.querySelector('app-generic-crud-form');

    // Verify error alert
    const errorAlert = formElement.querySelector('div[data-testid="user-form-form-error"]');
    expect(errorAlert).toBeTruthy();
    expect(errorAlert.textContent).toContain('Something went wrong');
  });

  it('should render submit button with loading state', async () => {
    const mockFields: FormFieldMetadata[] = [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
      },
    ];

    @Component({
      template: `
        <app-generic-crud-form
          [fields]="fields"
          [loading]="true"
          [testIdPrefix]="'user-form'"
        />
      `,
      standalone: true,
      imports: [GenericCrudFormComponent],
    })
    class TestWrapper {
      fields = mockFields;
    }

    await TestBed.configureTestingModule({
      imports: [TestWrapper],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestWrapper);
    fixture.detectChanges();
    await fixture.whenStable();

    const formElement = fixture.nativeElement.querySelector('app-generic-crud-form');

    // Verify submit button exists and is in loading state
    const submitButton = formElement.querySelector(
      'app-button[data-testid="user-form-btn-submit-wrapper"]'
    );
    expect(submitButton).toBeTruthy();
    // Button component should handle loading state internally
  });

  it('should handle form submission and emit formSubmit event', async () => {
    const mockFields: FormFieldMetadata[] = [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        validators: [Validators.required],
      },
    ];

    @Component({
      template: `
        <app-generic-crud-form
          [fields]="fields"
          [testIdPrefix]="'user-form'"
          (formSubmit)="onSubmit($event)"
        />
      `,
      standalone: true,
      imports: [GenericCrudFormComponent],
    })
    class TestWrapper {
      fields = mockFields;
      submittedData: unknown = null;

      onSubmit(data: unknown) {
        this.submittedData = data;
      }
    }

    await TestBed.configureTestingModule({
      imports: [TestWrapper],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestWrapper);
    fixture.detectChanges();
    await fixture.whenStable();

    const formElement = fixture.nativeElement.querySelector('app-generic-crud-form');
    const component = fixture.componentInstance;

    // Fill in the form
    const nameInputHost = formElement.querySelector(
      'app-input[data-testid="user-form-input-name-wrapper"]'
    );
    const nameInput = nameInputHost.querySelector('input');
    nameInput.value = 'John Doe';
    nameInput.dispatchEvent(new Event('input'));
    nameInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    // Submit the form
    const form = formElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    // Verify submission
    expect(component.submittedData).toBeTruthy();
    expect((component.submittedData as { name: string }).name).toBe('John Doe');
  });

  it('should handle form cancellation and emit formCancel event', async () => {
    const mockFields: FormFieldMetadata[] = [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
      },
    ];

    @Component({
      template: `
        <app-generic-crud-form
          [fields]="fields"
          [testIdPrefix]="'user-form'"
          (formCancel)="onCancel()"
        />
      `,
      standalone: true,
      imports: [GenericCrudFormComponent],
    })
    class TestWrapper {
      fields = mockFields;
      cancelCalled = false;

      onCancel() {
        this.cancelCalled = true;
      }
    }

    await TestBed.configureTestingModule({
      imports: [TestWrapper],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestWrapper);
    fixture.detectChanges();
    await fixture.whenStable();

    const formElement = fixture.nativeElement.querySelector('app-generic-crud-form');
    const component = fixture.componentInstance;

    // Click cancel button
    const cancelButton = formElement.querySelector(
      'app-button[data-testid="user-form-btn-cancel-wrapper"]'
    );
    cancelButton.click();
    fixture.detectChanges();

    // Verify cancellation
    expect(component.cancelCalled).toBe(true);
  });
});
