import { describe, it, expect } from 'vitest';
import type { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { setupAxiosInterceptors } from '@/shared/http/infrastructure/secondary/AxiosAuthInterceptor';
import { AUTH_REPOSITORY } from '@/auth/application/AuthProvider';
import { provide } from '@/injections';
import sinon from 'sinon';
import type { SinonStub } from 'sinon';
import type { AuthRepository } from '@/auth/domain/AuthRepository';
import { stubAxiosInstance } from './AxiosStub';
import type { AxiosStubInstance } from './AxiosStub';
import { AxiosHeaders } from 'axios';

interface MockAuthRepository extends AuthRepository {
  authenticated: SinonStub;
  token: SinonStub;
  logout: SinonStub;
}

describe('AxiosAuthInterceptor', () => {
  let axiosInstance: AxiosStubInstance;
  let mockAuthRepository: MockAuthRepository;

  const setupTest = () => {
    axiosInstance = stubAxiosInstance();
    mockAuthRepository = {
      currentUser: sinon.stub(),
      login: sinon.stub(),
      logout: sinon.stub(),
      authenticated: sinon.stub(),
      token: sinon.stub(),
    };
    provide(AUTH_REPOSITORY, mockAuthRepository);
    setupAxiosInterceptors(axiosInstance);
  };

  it('adds Authorization header for authenticated requests', () => {
    setupTest();
    mockAuthRepository.authenticated.resolves(true);
    mockAuthRepository.token.resolves('fake-token');
    const config: InternalAxiosRequestConfig = { headers: new AxiosHeaders() };

    return axiosInstance.runInterceptors(config).then(interceptedConfig => {
      expect(mockAuthRepository.authenticated.called).toBe(true);
      expect(mockAuthRepository.token.called).toBe(true);
      expect(interceptedConfig.headers['Authorization']).toBe('Bearer fake-token');
    });
  });

  it('does not add Authorization header for unauthenticated requests', () => {
    setupTest();
    mockAuthRepository.authenticated.resolves(false);
    const config: InternalAxiosRequestConfig = { headers: new AxiosHeaders() };

    return axiosInstance.runInterceptors(config).then(interceptedConfig => {
      expect(mockAuthRepository.authenticated.called).toBe(true);
      expect(mockAuthRepository.token.called).toBe(false);
      expect(interceptedConfig.headers['Authorization']).toBeUndefined();
    });
  });

  it('calls logout on 401 response', () => {
    setupTest();
    const error: AxiosError = {
      response: { status: 401 } as AxiosResponse,
      isAxiosError: true,
      toJSON: () => ({}),
      name: '',
      message: '',
    };
    const responseInterceptor = axiosInstance.interceptors.response.use.args[0][1];

    return responseInterceptor(error).catch(() => {
      expect(mockAuthRepository.logout.called).toBe(true);
    });
  });

  it('does not call logout for non-401 errors', () => {
    setupTest();
    const error: AxiosError = {
      response: { status: 500 } as AxiosResponse,
      isAxiosError: true,
      toJSON: () => ({}),
      name: '',
      message: '',
    };
    const responseInterceptor = axiosInstance.interceptors.response.use.args[0][1];

    return responseInterceptor(error).catch(() => {
      expect(mockAuthRepository.logout.called).toBe(false);
    });
  });

  it('passes through successful responses without modification', () => {
    setupTest();
    const mockResponse: AxiosResponse = {
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };
    const responseInterceptor = axiosInstance.interceptors.response.use.args[0][0];

    return responseInterceptor(mockResponse).then(result => {
      expect(result).toEqual(mockResponse);
    });
  });
});
