import { describe, it, expect, vi } from 'vitest';
import type { AuthRepository } from '@/auth/domain/AuthRepository';

describe('AuthRepository', () => {
  it('should define the AuthRepository interface', () => {
    const mockRepository: AuthRepository = {
      login: vi.fn(),
      logout: vi.fn(),
      currentUser: vi.fn(),
      authenticated: vi.fn(),
    };

    expect(mockRepository.login).toBeDefined();
    expect(mockRepository.logout).toBeDefined();
    expect(mockRepository.currentUser).toBeDefined();
    expect(mockRepository.authenticated).toBeDefined();
  });
});
