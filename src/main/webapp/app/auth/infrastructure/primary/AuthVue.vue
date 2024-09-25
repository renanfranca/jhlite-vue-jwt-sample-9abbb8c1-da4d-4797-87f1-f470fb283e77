<template>
  <div>
    <form v-if="!isAuthenticated" @submit.prevent="login">
      <input type="text" v-model="username" placeholder="Username" required>
      <input type="password" v-model="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
    <div v-else>
      <p>Welcome, {{ currentUser?.username }}</p>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { inject } from '@/injections';
import { AUTH_REPOSITORY } from '@/auth/application/AuthProvider';
import type { AuthRepository } from '@/auth/domain/AuthRepository';

export default defineComponent({
  name: 'AuthVue',
  setup() {
    const authRepository = inject(AUTH_REPOSITORY) as AuthRepository;
    const isAuthenticated = ref(false);
    const currentUser = ref(null);
    const username = ref('');
    const password = ref('');

    const checkAuth = async () => {
      isAuthenticated.value = await authRepository.isAuthenticated();
      if (isAuthenticated.value) {
        currentUser.value = await authRepository.getCurrentUser();
      }
    };

    const login = async () => {
      await authRepository.login(username.value, password.value);
      await checkAuth();
    };

    const logout = async () => {
      await authRepository.logout();
      await checkAuth();
    };

    onMounted(checkAuth);

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
