import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JwtAuthRepository } from '@/auth/infrastructure/secondary/JwtAuthRepository';
import type { AxiosHttp } from '@/shared/http/infrastructure/secondary/AxiosHttp';

describe('JwtAuthRepository', () => {
  let jwtAuthRepository: JwtAuthRepository;
  let mockAxiosHttp: AxiosHttp;

  beforeEach(() => {
    mockAxiosHttp = {
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };
    jwtAuthRepository = new JwtAuthRepository(mockAxiosHttp);
  });

  describe('login', () => {
    it('should call the login endpoint and store the token', async () => {
      const mockResponse = { data: { token: 'fake-jwt-token' } };
      mockAxiosHttp.post.mockResolvedValue(mockResponse);

      await jwtAuthRepository.login('testuser', 'password');

      expect(mockAxiosHttp.post).toHaveBeenCalledWith('/api/auth/login', {
        username: 'testuser',
        password: 'password',
      });
      expect(localStorage.getItem('jwt-token')).toBe('fake-jwt-token');
    });
  });

  describe('logout', () => {
    it('should remove the token from localStorage', async () => {
      localStorage.setItem('jwt-token', 'fake-jwt-token');
      await jwtAuthRepository.logout();
      expect(localStorage.getItem('jwt-token')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should call the user endpoint and return the user data', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      mockAxiosHttp.get.mockResolvedValue({ data: mockUser });

      const user = await jwtAuthRepository.getCurrentUser();

      expect(mockAxiosHttp.get).toHaveBeenCalledWith('/api/auth/user');
      expect(user).toEqual(mockUser);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if a token exists in localStorage', async () => {
      localStorage.setItem('jwt-token', 'fake-jwt-token');
      const isAuthenticated = await jwtAuthRepository.isAuthenticated();
      expect(isAuthenticated).toBe(true);
    });

    it('should return false if no token exists in localStorage', async () => {
      localStorage.removeItem('jwt-token');
      const isAuthenticated = await jwtAuthRepository.isAuthenticated();
      expect(isAuthenticated).toBe(false);
    });
  });
});
