import { Injectable, signal } from '@angular/core';

/**
 * Service to provide test ID prefix from parent containers to child components
 * Used by GenericCrud to pass testIdPrefix to all child components
 */
@Injectable()
export class TestIdPrefixService {
  /**
   * The test ID prefix provided by the parent container
   */
  readonly prefix = signal<string | null>(null);

  /**
   * Set the prefix value
   */
  setPrefix(value: string | null): void {
    this.prefix.set(value);
  }
}
