import { AUTH_REPOSITORY } from '@/auth/application/AuthProvider';
import AuthVue from '@/auth/infrastructure/primary/AuthVue.vue';
import { provide } from '@/injections';
import { flushPromises, type VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import type { SinonStub } from 'sinon';
import sinon from 'sinon';
import { describe, expect, it } from 'vitest';

describe('AuthVue', () => {
  interface AuthRepositoryStub {
    login: SinonStub;
    logout: SinonStub;
    getCurrentUser: SinonStub;
    isAuthenticated: SinonStub;
  }

  const stubAuthRepository = (): AuthRepositoryStub => ({
    login: sinon.stub().resolves(),
    logout: sinon.stub(),
    getCurrentUser: sinon.stub(),
    isAuthenticated: sinon.stub(),
  });

  const wrap = (authRepository: AuthRepositoryStub): VueWrapper => {
    provide(AUTH_REPOSITORY, authRepository);
    return mount(AuthVue);
  };

  const setAuthenticatedState = (authRepository: AuthRepositoryStub, authenticated: boolean, username: string = 'testuser') => {
    authRepository.isAuthenticated.returns(authenticated);
    if (authenticated) {
      authRepository.getCurrentUser.resolves({ username });
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
    expect(wrapper.find('p').text()).toBe('Welcome, testuser');
    expect(wrapper.find('button').text()).toBe('Logout');
  });

  it('should not call getCurrentUser when not authenticated', async () => {
    const authRepository = stubAuthRepository();
    setAuthenticatedState(authRepository, false);

    const wrapper = wrap(authRepository);
    await flushPromises();

    expect(authRepository.isAuthenticated.called).toBe(true);
    expect(authRepository.getCurrentUser.called).toBe(false);
    expect(wrapper.find('form').exists()).toBe(true);
  });
});
