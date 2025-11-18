// Angular testing
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

// Vitest
import { describe, it, expect } from 'vitest';

// Component under test
import { App } from './app';

describe('App', () => {
  it('should create the app', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(App);
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });
});
