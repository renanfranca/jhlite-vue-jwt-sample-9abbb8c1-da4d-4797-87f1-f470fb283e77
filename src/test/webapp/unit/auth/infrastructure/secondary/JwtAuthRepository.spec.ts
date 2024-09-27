import type { Account } from '@/auth/domain/Account';
import type { LoginCredentials } from '@/auth/domain/LoginCredentials';
import type { LoginResponse } from '@/auth/domain/LoginResponse';
import { JwtAuthRepository } from '@/auth/infrastructure/secondary/JwtAuthRepository';
import type { RestLoginCredentials } from '@/auth/infrastructure/secondary/RestLoginCredentials';
import { describe, expect, it } from 'vitest';
import { stubAxiosHttp } from '../../../shared/http/infrastructure/secondary/AxiosHttpStub';

describe('JwtAuthRepository', () => {
  describe('login', () => {
    it('should call the login endpoint with correct credentials and store the token', async () => {
      const mockResponse: LoginResponse = { token: 'fake-jwt-token' };
      const mockAxiosHttp = stubAxiosHttp();
      mockAxiosHttp.post.resolves({ data: mockResponse });
      const jwtAuthRepository = new JwtAuthRepository(mockAxiosHttp);

      const credentials: LoginCredentials = { username: 'test-user', password: 'password' };
      const response = await jwtAuthRepository.login(credentials);

      const [uri, payload] = mockAxiosHttp.post.getCall(0).args;
      const expectedPayload: RestLoginCredentials = { username: 'test-user', password: 'password' };
      expect(uri).toBe('/api/auth/login');
      expect(payload).toEqual(expectedPayload);
      expect(localStorage.getItem('jwt-token')).toBe('fake-jwt-token');
      expect(response).toEqual(mockResponse);
    });

    it('should enforce type safety for login credentials and response', async () => {
      const mockAxiosHttp = stubAxiosHttp();
      mockAxiosHttp.post.resolves({ data: { token: 'fake-token' } });
      const jwtAuthRepository = new JwtAuthRepository(mockAxiosHttp);
      const credentials: LoginCredentials = { username: 'user', password: 'pass' };
      const loginPromise: Promise<LoginResponse> = jwtAuthRepository.login(credentials);

      // @ts-expect-error
      jwtAuthRepository.login({ username: 'user' });

      // @ts-expect-error
      jwtAuthRepository.login({ username: 'user', password: 'pass', extraField: 'value' });

      expect(loginPromise).toBeInstanceOf(Promise);

      // Add this to ensure the Promise resolves
      return loginPromise.then(response => {
        expect(response).toEqual({ token: 'fake-token' });
      });
    });
  });

  describe('logout', () => {
    it('should remove the token from localStorage', async () => {
      localStorage.setItem('jwt-token', 'fake-jwt-token');
      const mockAxiosHttp = stubAxiosHttp();
      const jwtAuthRepository = new JwtAuthRepository(mockAxiosHttp);

      jwtAuthRepository.logout();

      expect(localStorage.getItem('jwt-token')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should call the user endpoint and return the user data', async () => {
      const mockUser: Account = {
        activated: true,
        authorities: ['ROLE_USER'],
        email: 'test-user@example.com',
        firstName: 'Test',
        lastName: 'User',
        langKey: 'en',
        login: 'test-user',
      };
      const mockAxiosHttp = stubAxiosHttp();
      mockAxiosHttp.get.resolves({ data: mockUser });
      const jwtAuthRepository = new JwtAuthRepository(mockAxiosHttp);

      const user = await jwtAuthRepository.getCurrentUser();


      const [uri, payload] = mockAxiosHttp.get.getCall(0).args;
      expect(uri).toBe('api/account');
      expect(payload).toBeUndefined();
      expect(user).toEqual(mockUser);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if a token exists in localStorage', async () => {
      localStorage.setItem('jwt-token', 'fake-jwt-token');
      const mockAxiosHttp = stubAxiosHttp();
      const jwtAuthRepository = new JwtAuthRepository(mockAxiosHttp);

      const isAuthenticated = jwtAuthRepository.isAuthenticated();

      expect(isAuthenticated).toBe(true);
    });

    it('should return false if no token exists in localStorage', async () => {
      localStorage.removeItem('jwt-token');
      const mockAxiosHttp = stubAxiosHttp();
      const jwtAuthRepository = new JwtAuthRepository(mockAxiosHttp);

      const isAuthenticated = jwtAuthRepository.isAuthenticated();

      expect(isAuthenticated).toBe(false);
    });
  });
});
