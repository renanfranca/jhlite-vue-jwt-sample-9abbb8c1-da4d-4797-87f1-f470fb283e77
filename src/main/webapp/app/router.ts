import { createRouter, createWebHistory } from 'vue-router';
import { homeRoutes } from '@/home/application/HomeRouter';

export const routes = [...homeRoutes()];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
