import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Type,
  Provider,
  EnvironmentProviders,
  InputSignal,
  OutputEmitterRef,
  inputBinding,
  outputBinding,
  provideZonelessChangeDetection,
} from '@angular/core';

/**
 * Type helper to extract the value type from InputSignal<T>
 */
type InputSignalValue<T> = T extends InputSignal<infer U> ? U : T;

/**
 * Type helper to extract the value type from OutputEmitterRef<T>
 */
type OutputEmitterValue<T> = T extends OutputEmitterRef<infer U> ? U : T;

/**
 * Generic component test builder with auto-cloning build() method
 *
 * Features:
 * - Fluent API for configuring inputs and outputs
 * - Auto-cloning in build() ensures test independence when using beforeEach
 * - Type-safe input/output configuration
 * - Automatic TestBed.tick() after component creation
 *
 * @example
 * ```ts
 * describe('Alert', () => {
 *   let builder: ComponentTestBuilder<Alert>;
 *
 *   beforeEach(() => {
 *     builder = new ComponentTestBuilder(Alert)
 *       .withInput('message', 'Default message')
 *       .withInput('variant', 'info');
 *   });
 *
 *   it('should display message', () => {
 *     // build() auto-clones internally - no manual .clone() needed!
 *     const fixture = builder.build();
 *     expect(fixture.componentInstance.message()).toBe('Default message');
 *   });
 *
 *   it('should override variant', () => {
 *     const fixture = builder
 *       .withInput('variant', 'success')
 *       .build();
 *     expect(fixture.componentInstance.variant()).toBe('success');
 *   });
 * });
 * ```
 */
export class ComponentTestBuilder<T> {
  private bindings: any[] = [];
  private providers: (Provider | EnvironmentProviders)[] = [provideZonelessChangeDetection()];

  constructor(private componentType: Type<T>) {}

  /**
   * Configure an input binding
   * Automatically replaces previous binding for the same property
   */
  withInput<K extends keyof T>(property: K, value: InputSignalValue<T[K]>): this {
    // Remove previous binding for this property
    this.bindings = this.bindings.filter((b) => !this.isInputBinding(b, property as string));
    this.bindings.push(inputBinding(property as string, () => value));
    return this;
  }

  /**
   * Configure an output binding
   * Automatically replaces previous binding for the same property
   */
  withOutput<K extends keyof T>(property: K, handler: (value: any) => void): this {
    // Remove previous binding for this property
    this.bindings = this.bindings.filter((b) => !this.isOutputBinding(b, property as string));
    this.bindings.push(outputBinding(property as string, handler));
    return this;
  }

  /**
   * Add custom providers to the TestBed configuration
   */
  withProviders(providers: (Provider | EnvironmentProviders)[]): this {
    this.providers = [...this.providers, ...providers];
    return this;
  }

  /**
   * Build the component fixture
   *
   * IMPORTANT: This method automatically clones the builder's state before building
   * to ensure test independence when using beforeEach for configuration.
   *
   * You don't need to call .clone() manually!
   */
  build(): ComponentFixture<T> {
    // Auto-clone: Create copies of internal state
    const clonedBindings = [...this.bindings];
    const clonedProviders = [...this.providers];

    const fixture = TestBed.configureTestingModule({
      providers: clonedProviders,
    }).createComponent(this.componentType, {
      bindings: clonedBindings,
    });

    TestBed.tick();
    return fixture;
  }

  /**
   * Manual clone method (optional, rarely needed)
   * Creates a new builder instance with the same configuration
   */
  clone(): ComponentTestBuilder<T> {
    const cloned = new ComponentTestBuilder(this.componentType);
    cloned.bindings = [...this.bindings];
    cloned.providers = [...this.providers];
    return cloned;
  }

  private isInputBinding(binding: any, property: string): boolean {
    // Check if binding is an inputBinding for the given property
    const bindingStr = binding.toString();
    return bindingStr.includes('inputBinding') && bindingStr.includes(property);
  }

  private isOutputBinding(binding: any, property: string): boolean {
    // Check if binding is an outputBinding for the given property
    const bindingStr = binding.toString();
    return bindingStr.includes('outputBinding') && bindingStr.includes(property);
  }
}
