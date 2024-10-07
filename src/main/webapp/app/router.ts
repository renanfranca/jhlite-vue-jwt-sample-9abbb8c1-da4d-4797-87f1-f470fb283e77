import { authRoutes } from '@/auth/application/AuthRouter';
import { homeRoutes } from '@/home/application/HomeRouter';
import { createRouter, createWebHistory } from 'vue-router';

export const routes = [...homeRoutes(), ...authRoutes()];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
