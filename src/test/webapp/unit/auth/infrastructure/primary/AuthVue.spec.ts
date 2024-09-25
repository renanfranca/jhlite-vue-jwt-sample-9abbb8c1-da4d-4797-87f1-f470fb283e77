import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import AuthVue from '@/auth/infrastructure/primary/AuthVue.vue';
import { AUTH_REPOSITORY } from '@/auth/application/AuthProvider';

describe('AuthVue', () => {
  let wrapper;
  let mockAuthRepository;

  beforeEach(() => {
    mockAuthRepository = {
      login: vi.fn(),
      logout: vi.fn(),
      getCurrentUser: vi.fn(),
      isAuthenticated: vi.fn(),
    };

    wrapper = mount(AuthVue, {
      global: {
        provide: {
          [AUTH_REPOSITORY]: mockAuthRepository,
        },
      },
    });
  });

  it('should render login form when not authenticated', async () => {
    mockAuthRepository.isAuthenticated.mockResolvedValue(false);
    await wrapper.vm.$nextTick();

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
