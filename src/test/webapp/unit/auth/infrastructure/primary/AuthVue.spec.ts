import { AUTH_REPOSITORY } from '@/auth/application/AuthProvider';
import type { AuthenticatedUser } from '@/auth/domain/AuthenticatedUser';
import AuthVue from '@/auth/infrastructure/primary/AuthVue.vue';
import { provide } from '@/injections';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import type { SinonStub } from 'sinon';
import sinon from 'sinon';
import { describe, expect, it } from 'vitest';

describe('AuthVue', () => {
  interface AuthRepositoryStub {
    login: SinonStub;
    logout: SinonStub;
    currentUser: SinonStub;
    isAuthenticated: SinonStub;
    getToken: SinonStub;
  }

  const stubAuthRepository = (): AuthRepositoryStub => ({
    login: sinon.stub().resolves(),
    logout: sinon.stub(),
    currentUser: sinon.stub(),
    isAuthenticated: sinon.stub(),
    getToken: sinon.stub(),
  });

  const wrap = (authRepository: AuthRepositoryStub): VueWrapper => {
    provide(AUTH_REPOSITORY, authRepository);
    return mount(AuthVue);
  };

  const setAuthenticatedState = (authRepository: AuthRepositoryStub, authenticated: boolean) => {
    authRepository.isAuthenticated.resolves(authenticated);
    if (authenticated) {
      const mockUser: AuthenticatedUser = {
        activated: true,
        authorities: ['ROLE_USER'],
        email: 'test-user@example.com',
        firstName: 'Test',
        lastName: 'User',
        langKey: 'en',
        login: 'test.user',
      };
      authRepository.currentUser.resolves(mockUser);
    }
  };

  it('should render login form when not authenticated', async () => {
    const authRepository = stubAuthRepository();
    setAuthenticatedState(authRepository, false);

    const wrapper = wrap(authRepository);
    await flushPromises();

    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button').text()).toBe('Login');
  });

  it('should render welcome message and logout button when authenticated', async () => {
    const authRepository = stubAuthRepository();
    setAuthenticatedState(authRepository, true);

    const wrapper = wrap(authRepository);
    await flushPromises();

    expect(wrapper.find('form').exists()).toBe(false);
    expect(wrapper.find('p').text()).toBe('Welcome, test.user');
    expect(wrapper.find('button').text()).toBe('Logout');
  });

  it('should not call getCurrentUser when not authenticated', async () => {
    const authRepository = stubAuthRepository();
    setAuthenticatedState(authRepository, false);

    const wrapper = wrap(authRepository);
    await flushPromises();

    expect(authRepository.isAuthenticated.called).toBe(true);
    expect(authRepository.currentUser.called).toBe(false);
    expect(wrapper.find('form').exists()).toBe(true);
  });
});
