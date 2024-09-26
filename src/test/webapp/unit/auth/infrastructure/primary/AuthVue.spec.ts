import { AUTH_REPOSITORY } from '@/auth/application/AuthProvider';
import AuthVue from '@/auth/infrastructure/primary/AuthVue.vue';
import { provide } from '@/injections';
import { flushPromises, type VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import type { SinonStub } from 'sinon';
import sinon from 'sinon';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('AuthVue', () => {
  let wrapper: VueWrapper;
  let authRepository: AuthRepositoryStub;

  interface AuthRepositoryStub {
    login: SinonStub;
    logout: SinonStub;
    getCurrentUser: SinonStub;
    isAuthenticated: SinonStub;
  }

  const stubAuthRepository = (): AuthRepositoryStub => ({
    login: sinon.stub(),
    logout: sinon.stub(),
    getCurrentUser: sinon.stub(),
    isAuthenticated: sinon.stub(),
  });

  const wrap = (authRepository: AuthRepositoryStub): VueWrapper => {
    provide(AUTH_REPOSITORY, authRepository);
    return mount(AuthVue);
  };

  beforeEach(() => {
    authRepository = stubAuthRepository();
  });

  const setAuthenticatedState = (authenticated: boolean, username: string = 'testuser') => {
    authRepository.isAuthenticated.resolves(authenticated);
    if (authenticated) {
      authRepository.getCurrentUser.resolves({ username });
    }
  };

  it('should render login form when not authenticated', async () => {
    setAuthenticatedState(false);
    wrapper = wrap(authRepository);
    await flushPromises();

    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button').text()).toBe('Login');
  });

  it('should render welcome message and logout button when authenticated', async () => {
    setAuthenticatedState(true);
    wrapper = wrap(authRepository);
    await flushPromises();

    expect(wrapper.find('form').exists()).toBe(false);
    expect(wrapper.find('p').text()).toBe('Welcome, testuser');
    expect(wrapper.find('button').text()).toBe('Logout');
  });

  it('should call login method when form is submitted', async () => {
    setAuthenticatedState(false);
    wrapper = wrap(authRepository);
    await flushPromises();

    await wrapper.find('input[type="text"]').setValue('testuser');
    await wrapper.find('input[type="password"]').setValue('password');
    await wrapper.find('form').trigger('submit');

    expect(authRepository.login.calledWith('testuser', 'password')).toBe(true);
    
    // Simulate successful login
    setAuthenticatedState(true);
    await flushPromises();

    expect(wrapper.find('p').text()).toBe('Welcome, testuser');
    expect(wrapper.find('button').text()).toBe('Logout');
  });

  it('should call logout method when logout button is clicked', async () => {
    setAuthenticatedState(true);
    wrapper = wrap(authRepository);
    await flushPromises();

    await wrapper.find('button').trigger('click');

    expect(authRepository.logout.called).toBe(true);
    
    // Simulate successful logout
    setAuthenticatedState(false);
    await flushPromises();

    expect(wrapper.find('form').exists()).toBe(true);
  });

  it('should check authentication status on component mount', async () => {
    setAuthenticatedState(true);
    wrapper = wrap(authRepository);
    await flushPromises();

    expect(authRepository.isAuthenticated.called).toBe(true);
    expect(authRepository.getCurrentUser.called).toBe(true);
    expect(wrapper.find('p').text()).toBe('Welcome, testuser');
  });
});
