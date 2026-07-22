import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Products from '../views/Products.vue';
import Roles from '../views/Roles.vue';
import { useAuth } from '../composables/useAuth';

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

// Protection Guard: Redirect to /login if not authenticated
router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth();
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated.value) {
    next('/');
  } else {
    next();
  }
});

export default router;