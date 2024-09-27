<template>
  <div class="auth-container">
    <form class="auth-form" v-if="!isAuthenticated" @submit.prevent="login">
      <h2 class="auth-title">Login</h2>
      <input type="text" v-model="username" placeholder="Username" class="auth-input" required />
      <input type="password" v-model="password" placeholder="Password" class="auth-input" required />
      <button type="submit" class="auth-btn">Login</button>
    </form>
    <div v-else class="welcome">
      <p>Welcome, {{ currentUser?.login }}</p>
      <button @click="logout" class="auth-btn logout-btn">Logout</button>
    </div>
  </div>
</template>

<script lang="ts">
import { AUTH_REPOSITORY } from '@/auth/application/AuthProvider';
import type { AuthRepository } from '@/auth/domain/AuthRepository';
import type { AuthenticatedUser } from '@/auth/domain/AuthenticatedUser';
import type { LoginCredentials } from '@/auth/domain/LoginCredentials';
import type { LoginResponse } from '@/auth/domain/LoginResponse';
import { inject } from '@/injections';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'AuthVue',
  setup() {
    const authRepository = inject(AUTH_REPOSITORY) as AuthRepository;
    const isAuthenticated = ref(false);
    const currentUser = ref<AuthenticatedUser | null>(null);
    const username = ref('');
    const password = ref('');

    const checkAuth = () => {
      isAuthenticated.value = authRepository.isAuthenticated();
      if (isAuthenticated.value) {
        authRepository.getCurrentUser()
          .then(user => {
            currentUser.value = user;
          })
          .catch(error => {
            console.error('Error getting current user:', error);
          });
      } else {
        currentUser.value = null;
      }
    };

    const login = () => {
      const credentials: LoginCredentials = {
        username: username.value,
        password: password.value
      };

      authRepository.login(credentials)
        .then((response: LoginResponse) => {
          // You might want to do something with the response here
          checkAuth();
        })
        .catch(error => {
          console.error('Login error:', error);
        });
    };

    const logout = () => {
      authRepository.logout();
      checkAuth();
    };

    onMounted(() => {
      checkAuth();
    });

    return {
      isAuthenticated,
      currentUser,
      username,
      password,
      login,
      logout,
    };
  },
});
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f9;
}

.auth-form {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.auth-title {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.auth-input {
  display: block;
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.auth-input:focus {
  border-color: #3b82f6;
  outline: none;
}

.auth-btn {
  display: inline-block;
  background-color: #3b82f6;
  color: #fff;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.auth-btn:hover {
  background-color: #2563eb;
}

.logout-btn {
  background-color: #f87171;
}

.logout-btn:hover {
  background-color: #ef4444;
}

.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome p {
  font-size: 18px;
  margin-bottom: 20px;
}
</style>
