import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { of, throwError, firstValueFrom } from 'rxjs';
import { vi } from 'vitest';
import { userResolver } from './user.resolver';
import { UserApiService, UserDto } from '@loan/app/shared/openapi';
import { UserStateService } from '@loan/app/core/services/user.service';

describe('userResolver', () => {
  let mockUserApiService: { getCurrentUser: ReturnType<typeof vi.fn> };
  let mockUserStateService: {
    setUser: ReturnType<typeof vi.fn>;
    clearUser: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockUserApiService = {
      getCurrentUser: vi.fn(),
    };

    mockUserStateService = {
      setUser: vi.fn(),
      clearUser: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: UserApiService, useValue: mockUserApiService },
        { provide: UserStateService, useValue: mockUserStateService },
      ],
    });
  });

  it('resolves user and updates state on success', async () => {
    const mockUser: UserDto = {
      id: '123',
      email: 'john@example.com',
      isActive: true,
      person: {} as any,
      roles: [],
      permissions: [],
      companies: [],
    };
    mockUserApiService.getCurrentUser.mockReturnValue(of(mockUser));

    const result = await TestBed.runInInjectionContext(() => {
      const resolved = userResolver({} as any, {} as any);
      return firstValueFrom(resolved as any);
    });

    expect(result).toEqual(mockUser);
    expect(mockUserApiService.getCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockUserStateService.setUser).toHaveBeenCalledWith(mockUser);
    expect(mockUserStateService.clearUser).not.toHaveBeenCalled();
  });

  it('returns null and clears user state on error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('API Error');
    mockUserApiService.getCurrentUser.mockReturnValue(throwError(() => mockError));

    const result = await TestBed.runInInjectionContext(() => {
      const resolved = userResolver({} as any, {} as any);
      return firstValueFrom(resolved as any);
    });

    expect(result).toBeNull();
    expect(mockUserApiService.getCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockUserStateService.clearUser).toHaveBeenCalledTimes(1);
    expect(mockUserStateService.setUser).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading user:', mockError);

    consoleErrorSpy.mockRestore();
  });
});
