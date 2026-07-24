import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Products from '../views/Products.vue';
import Roles from '../views/Roles.vue';
import LiveOrders from '@/views/LiveOrders.vue'; 
import Users from '@/views/Users.vue';
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
    path: '/orders',
    name: 'LiveOrders',
    component: LiveOrders, 
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
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Protection Guard
router.beforeEach((to, from) => {
  const { isAuthenticated } = useAuth();

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return '/login';
  } 
  
  if (to.path === '/login' && isAuthenticated.value) {
    return '/';
  }

  return true;
});

export default router;