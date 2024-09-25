import { describe, it, expect, vi } from 'vitest';
import { AUTH_REPOSITORY, provideForAuth } from '@/auth/application/AuthProvider';
import { JwtAuthRepository } from '@/auth/infrastructure/secondary/JwtAuthRepository';
import { inject } from '@/injections';

vi.mock('@/auth/infrastructure/secondary/JwtAuthRepository');
vi.mock('@/injections');

describe('AuthProvider', () => {
  it('should provide JwtAuthRepository', () => {
    const mockAxiosHttp = {};
    provideForAuth(mockAxiosHttp);

    expect(inject).toHaveBeenCalledWith(AUTH_REPOSITORY, expect.any(JwtAuthRepository));
  });
});
