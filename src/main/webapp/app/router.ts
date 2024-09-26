import { homeRoutes } from '@/home/application/HomeRouter';
import { createRouter, createWebHistory } from 'vue-router';

//TODO: add the auth routes
export const routes = [...homeRoutes()];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
