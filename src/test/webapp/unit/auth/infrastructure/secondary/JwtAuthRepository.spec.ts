import { JwtAuthRepository } from '@/auth/infrastructure/secondary/JwtAuthRepository';
import { describe, expect, it } from 'vitest';
import { stubAxiosHttp } from '../../../shared/http/infrastructure/secondary/AxiosHttpStub';

describe('JwtAuthRepository', () => {
  describe('login', () => {
    it('should call the login endpoint and store the token', async () => {
      const mockResponse = { data: { token: 'fake-jwt-token' } };
      const mockAxiosHttp = stubAxiosHttp();
      mockAxiosHttp.post.resolves(mockResponse);
      const jwtAuthRepository = new JwtAuthRepository(mockAxiosHttp);

      await jwtAuthRepository.login('test-user', 'password');

      const [uri, payload] = mockAxiosHttp.post.getCall(0).args;
      expect(uri).toBe('/api/auth/login');
      expect(payload).toEqual({ username: 'test-user', password: 'password' });
      expect(localStorage.getItem('jwt-token')).toBe('fake-jwt-token');
    });
  });

  describe('logout', () => {
    it('should remove the token from localStorage', async () => {
      localStorage.setItem('jwt-token', 'fake-jwt-token');
      const mockAxiosHttp = stubAxiosHttp();
      const jwtAuthRepository = new JwtAuthRepository(mockAxiosHttp);

      await jwtAuthRepository.logout();

      expect(localStorage.getItem('jwt-token')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should call the user endpoint and return the user data', async () => {
      const mockUser = { id: 1, username: 'test-user' };
      const mockAxiosHttp = stubAxiosHttp();
      mockAxiosHttp.get.resolves({ data: mockUser });
      const jwtAuthRepository = new JwtAuthRepository(mockAxiosHttp);

      const user = await jwtAuthRepository.getCurrentUser();

      const [uri, payload] = mockAxiosHttp.get.getCall(0).args;
      expect(uri).toBe('/api/auth/user');
      expect(payload).toBeUndefined();
      expect(user).toEqual(mockUser);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if a token exists in localStorage', async () => {
      localStorage.setItem('jwt-token', 'fake-jwt-token');
      const mockAxiosHttp = stubAxiosHttp();
      const jwtAuthRepository = new JwtAuthRepository(mockAxiosHttp);

      const isAuthenticated = await jwtAuthRepository.isAuthenticated();

      expect(isAuthenticated).toBe(true);
    });

    it('should return false if no token exists in localStorage', async () => {
      localStorage.removeItem('jwt-token');
      const mockAxiosHttp = stubAxiosHttp();
      const jwtAuthRepository = new JwtAuthRepository(mockAxiosHttp);

      const isAuthenticated = await jwtAuthRepository.isAuthenticated();

      expect(isAuthenticated).toBe(false);
    });
  });
});
