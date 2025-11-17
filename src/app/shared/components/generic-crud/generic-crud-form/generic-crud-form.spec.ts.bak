import { provideZonelessChangeDetection } from '@angular/core';
import { render } from '@testing-library/angular';
import { GenericCrudFormComponent } from './generic-crud-form';
import { FormFieldMetadata } from '@loan/app/core/models/form-metadata';

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

  it('should create', async () => {
    const { container } = await render(GenericCrudFormComponent, {
      componentInputs: {
        fields: mockFields,
        dataTestId: 'test-form',
      },
      providers: [provideZonelessChangeDetection()],
    });

    expect(container).toBeTruthy();
  });

  describe('data-testid propagation', () => {
    it('should render data-testid on text input field', async () => {
      const { container } = await render(GenericCrudFormComponent, {
        componentInputs: {
          fields: mockFields,
          dataTestId: 'test-form',
        },
        providers: [provideZonelessChangeDetection()],
      });

      const textInput = container.querySelector('input[data-testid="test-form-input-name"]');
      expect(textInput).toBeTruthy();
    });

    it('should render data-testid on email input field', async () => {
      const { container } = await render(GenericCrudFormComponent, {
        componentInputs: {
          fields: mockFields,
          dataTestId: 'test-form',
        },
        providers: [provideZonelessChangeDetection()],
      });

      const emailInput = container.querySelector('input[data-testid="test-form-input-email"]');
      expect(emailInput).toBeTruthy();
    });

    it('should render data-testid on number input field', async () => {
      const { container } = await render(GenericCrudFormComponent, {
        componentInputs: {
          fields: mockFields,
          dataTestId: 'test-form',
        },
        providers: [provideZonelessChangeDetection()],
      });

      const numberInput = container.querySelector('input[data-testid="test-form-number-age"]');
      expect(numberInput).toBeTruthy();
    });

    it('should render data-testid on date input field', async () => {
      const { container } = await render(GenericCrudFormComponent, {
        componentInputs: {
          fields: mockFields,
          dataTestId: 'test-form',
        },
        providers: [provideZonelessChangeDetection()],
      });

      const dateInput = container.querySelector(
        'input[data-testid="test-form-date-birthDate"]',
      );
      expect(dateInput).toBeTruthy();
    });

    it('should render data-testid on checkbox field', async () => {
      const { container } = await render(GenericCrudFormComponent, {
        componentInputs: {
          fields: mockFields,
          dataTestId: 'test-form',
        },
        providers: [provideZonelessChangeDetection()],
      });

      const checkbox = container.querySelector('input[data-testid="test-form-checkbox-active"]');
      expect(checkbox).toBeTruthy();
    });

    it('should render data-testid on select field', async () => {
      const { container } = await render(GenericCrudFormComponent, {
        componentInputs: {
          fields: mockFields,
          dataTestId: 'test-form',
        },
        providers: [provideZonelessChangeDetection()],
      });

      const select = container.querySelector('select[data-testid="test-form-select-role"]');
      expect(select).toBeTruthy();
    });

    it('should render data-testid on multiselect field', async () => {
      const { container } = await render(GenericCrudFormComponent, {
        componentInputs: {
          fields: mockFields,
          dataTestId: 'test-form',
        },
        providers: [provideZonelessChangeDetection()],
      });

      const multiselect = container.querySelector(
        'button[data-testid="test-form-multiselect-permissions"]',
      );
      expect(multiselect).toBeTruthy();
    });

    it('should render data-testid on radio group field', async () => {
      const { container } = await render(GenericCrudFormComponent, {
        componentInputs: {
          fields: mockFields,
          dataTestId: 'test-form',
        },
        providers: [provideZonelessChangeDetection()],
      });

      const radioOption = container.querySelector(
        'input[data-testid="test-form-radio-gender-option-male"]',
      );
      expect(radioOption).toBeTruthy();
    });

    it('should render data-testid on submit button', async () => {
      const { container } = await render(GenericCrudFormComponent, {
        componentInputs: {
          fields: mockFields,
          dataTestId: 'test-form',
        },
        providers: [provideZonelessChangeDetection()],
      });

      const submitBtn = container.querySelector('button[data-testid="test-form-btn-submit"]');
      expect(submitBtn).toBeTruthy();
    });

    it('should render data-testid on cancel button', async () => {
      const { container } = await render(GenericCrudFormComponent, {
        componentInputs: {
          fields: mockFields,
          dataTestId: 'test-form',
        },
        providers: [provideZonelessChangeDetection()],
      });

      const cancelBtn = container.querySelector('button[data-testid="test-form-btn-cancel"]');
      expect(cancelBtn).toBeTruthy();
    });

    it('should render all field test IDs with correct prefix', async () => {
      const { container } = await render(GenericCrudFormComponent, {
        componentInputs: {
          fields: mockFields,
          dataTestId: 'test-form',
        },
        providers: [provideZonelessChangeDetection()],
      });

      const allTestIds = container.querySelectorAll('[data-testid^="test-form-"]');
      expect(allTestIds.length).toBeGreaterThan(mockFields.length);
    });

    it('should display error message when error input is provided', async () => {
      const { container } = await render(GenericCrudFormComponent, {
        componentInputs: {
          fields: mockFields,
          dataTestId: 'test-form',
          error: 'Test error message',
        },
        providers: [provideZonelessChangeDetection()],
      });

      const errorAlert = container.querySelector('[role="alert"]');
      expect(errorAlert).toBeTruthy();
      expect(errorAlert?.textContent).toContain('Test error message');
    });
  });

  describe('form behavior', () => {
    it('should emit formSubmit when form is valid and submitted', async () => {
      const { fixture } = await render(GenericCrudFormComponent, {
        componentInputs: {
          fields: mockFields,
          dataTestId: 'test-form',
        },
        providers: [provideZonelessChangeDetection()],
      });

      const component = fixture.componentInstance;
      let emittedData: unknown = null;
      component.formSubmit.subscribe((data) => {
        emittedData = data;
      });

      component.form.patchValue({ name: 'Test User', email: 'test@example.com' });
      component.onSubmit();

      expect(emittedData).toBeTruthy();
    });

    it('should emit formCancel when cancel button is clicked', async () => {
      const { fixture } = await render(GenericCrudFormComponent, {
        componentInputs: {
          fields: mockFields,
          dataTestId: 'test-form',
        },
        providers: [provideZonelessChangeDetection()],
      });

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
