import { AUTH_REPOSITORY } from '@/auth/application/AuthProvider';
import AuthVue from '@/auth/infrastructure/primary/AuthVue.vue';
import { provide } from '@/injections';
import { flushPromises, type VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import type { SinonStub } from 'sinon';
import sinon from 'sinon';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('AuthVue', () => {
  let wrapper;
  let mockAuthRepository;

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

  const componentVm = (wrapper: VueWrapper) => wrapper.findComponent(AuthVue).vm;

  it('should render login form when not authenticated', async () => {
    const mockAuthRepository = stubAuthRepository();
    mockAuthRepository.isAuthenticated.resolves(false);
    const wrapper = wrap(mockAuthRepository);
    await flushPromises();

    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button').text()).toBe('Login');
  });

  it('should render welcome message and logout button when authenticated', async () => {
    mockAuthRepository.isAuthenticated.mockResolvedValue(true);
    mockAuthRepository.getCurrentUser.mockResolvedValue({ username: 'testuser' });
    await wrapper.vm.$nextTick();

    expect(wrapper.find('form').exists()).toBe(false);
    expect(wrapper.find('p').text()).toBe('Welcome, testuser');
    expect(wrapper.find('button').text()).toBe('Logout');
  });

  it('should call login method when form is submitted', async () => {
    mockAuthRepository.isAuthenticated.mockResolvedValue(false);
    await wrapper.vm.$nextTick();

    await wrapper.find('input[type="text"]').setValue('testuser');
    await wrapper.find('input[type="password"]').setValue('password');
    await wrapper.find('form').trigger('submit');

    expect(mockAuthRepository.login).toHaveBeenCalledWith('testuser', 'password');
  });

  it('should call logout method when logout button is clicked', async () => {
    mockAuthRepository.isAuthenticated.mockResolvedValue(true);
    mockAuthRepository.getCurrentUser.mockResolvedValue({ username: 'testuser' });
    await wrapper.vm.$nextTick();

    await wrapper.find('button').trigger('click');

    expect(mockAuthRepository.logout).toHaveBeenCalled();
  });
});
