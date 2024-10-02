import type { AuthenticatedUser } from '@/auth/domain/AuthenticatedUser';
import type { LoginCredentials } from '@/auth/domain/LoginCredentials';
import { JwtAuthRepository } from '@/auth/infrastructure/secondary/JwtAuthRepository';
import type { RestLoginCredentials } from '@/auth/infrastructure/secondary/RestLoginCredentials';
import type { RestLoginResponse } from '@/auth/infrastructure/secondary/RestLoginResponse';
import { describe, expect, it } from 'vitest';
import { stubAxiosHttp } from '../../../shared/http/infrastructure/secondary/AxiosHttpStub';

const STORAGE_KEY_JWT_TOKEN = 'jwtToken';

describe('JwtAuthRepository', () => {
  describe('login', () => {
    it('should call the login endpoint with correct credentials and store the token', async () => {
      const mockResponse: RestLoginResponse = { id_token: 'fake-jwt-token' };
      const mockAxiosHttp = stubAxiosHttp();
      mockAxiosHttp.post.resolves({ data: mockResponse });
      const jwtAuthRepository = new JwtAuthRepository(mockAxiosHttp, localStorage);
      const credentials: LoginCredentials = { username: 'test-user', password: 'password' };

      await jwtAuthRepository.login(credentials);

      const [uri, payload] = mockAxiosHttp.post.getCall(0).args;
      const expectedPayload: RestLoginCredentials = { username: 'test-user', password: 'password' };
      expect(uri).toBe('api/authenticate');
      expect(payload).toEqual(expectedPayload);
      expect(localStorage.getItem(STORAGE_KEY_JWT_TOKEN)).toBe('fake-jwt-token');
    });
  });

  describe('logout', () => {
    it('should remove the token from localStorage', async () => {
      localStorage.setItem(STORAGE_KEY_JWT_TOKEN, 'fake-jwt-token');
      const mockAxiosHttp = stubAxiosHttp();
      const jwtAuthRepository = new JwtAuthRepository(mockAxiosHttp, localStorage);

      jwtAuthRepository.logout();

      expect(localStorage.getItem(STORAGE_KEY_JWT_TOKEN)).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should call the user endpoint and return the user data', async () => {
      const mockUser: AuthenticatedUser = {
        activated: true,
        authorities: ['ROLE_USER'],
        email: 'test-user@example.com',
        firstName: 'Test',
        lastName: 'User',
        langKey: 'en',
        login: 'test.user',
      };
      const mockAxiosHttp = stubAxiosHttp();
      mockAxiosHttp.get.resolves({ data: mockUser });
      const jwtAuthRepository = new JwtAuthRepository(mockAxiosHttp, localStorage);

      const user = await jwtAuthRepository.getCurrentUser();

      const [uri, payload] = mockAxiosHttp.get.getCall(0).args;
      expect(uri).toBe('api/account');
      expect(payload).toBeUndefined();
      expect(user).toEqual(mockUser);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if a token exists in localStorage', async () => {
      localStorage.setItem(STORAGE_KEY_JWT_TOKEN, 'fake-jwt-token');
      const mockAxiosHttp = stubAxiosHttp();
      const jwtAuthRepository = new JwtAuthRepository(mockAxiosHttp, localStorage);

      const isAuthenticated = jwtAuthRepository.isAuthenticated();

      expect(isAuthenticated).toBe(true);
    });

    it('should return false if no token exists in localStorage', async () => {
      localStorage.removeItem(STORAGE_KEY_JWT_TOKEN);
      const mockAxiosHttp = stubAxiosHttp();
      const jwtAuthRepository = new JwtAuthRepository(mockAxiosHttp, localStorage);

      const isAuthenticated = jwtAuthRepository.isAuthenticated();

      expect(isAuthenticated).toBe(false);
    });
  });

  describe('getToken', () => {
    it('should return the token if it exists in localStorage', () => {
      const mockAxiosHttp = stubAxiosHttp();
      const jwtAuthRepository = new JwtAuthRepository(mockAxiosHttp, localStorage);
      localStorage.setItem(STORAGE_KEY_JWT_TOKEN, 'fake-jwt-token');

      const token = jwtAuthRepository.getToken();

      expect(token).toBe('fake-jwt-token');
    });

    it('should return null if no token exists in localStorage', () => {
      const mockAxiosHttp = stubAxiosHttp();
      const jwtAuthRepository = new JwtAuthRepository(mockAxiosHttp, localStorage);
      localStorage.removeItem(STORAGE_KEY_JWT_TOKEN);

      const token = jwtAuthRepository.getToken();

      expect(token).toBeNull();
    });
  });
});
