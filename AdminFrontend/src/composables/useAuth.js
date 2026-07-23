import { ref, computed } from 'vue';

// Shared global reactive state
const currentUser = ref(JSON.parse(localStorage.getItem('portalUser')) || null);

export function useAuth() {
  const isAuthenticated = computed(() => !!currentUser.value);

  const login = (userData) => {
    currentUser.value = userData;
    localStorage.setItem('portalUser', JSON.stringify(userData));
  };

  const logout = () => {
    currentUser.value = null;
    localStorage.removeItem('portalUser');
  };

  return {
    isAuthenticated,
    currentUser,
    login,
    logout
  };
}