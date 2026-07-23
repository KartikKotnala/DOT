import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Products from '../views/Products.vue';
import Roles from '../views/Roles.vue';
import { useAuth } from '../composables/useAuth.js';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: { requiresAuth: true }
  },
  {
    path: '/roles',
    name: 'Roles',
    component: Roles,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Protection Guard: Modern Vue Router 4 syntax without next()
router.beforeEach((to, from) => {
  const { isAuthenticated } = useAuth();

  // 1. If route requires auth and user is NOT authenticated -> Redirect to /login
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return '/login';
  } 
  
  // 2. If user IS authenticated and tries to visit /login -> Redirect to home/dashboard
  if (to.path === '/login' && isAuthenticated.value) {
    return '/';
  }

  // 3. Allow navigation to proceed
  return true;
});

export default router;