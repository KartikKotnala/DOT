import { ref } from 'vue';

const isAuthenticated = ref(localStorage.getItem('PORTAL_AUTH') === 'true');
const currentUser = ref(JSON.parse(localStorage.getItem('PORTAL_USER')) || null);

export function useAuth() {
  const login = (username, password) => {
    // Simple authentication logic (can connect to backend later)
    if (username === 'admin' && password === 'admin123') {
      isAuthenticated.value = true;
      currentUser.value = { name: 'Manager John', role: 'Admin' };
      localStorage.setItem('PORTAL_AUTH', 'true');
      localStorage.setItem('PORTAL_USER', JSON.stringify(currentUser.value));
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials. Use admin / admin123' };
  };

  const logout = () => {
    isAuthenticated.value = false;
    currentUser.value = null;
    localStorage.removeItem('PORTAL_AUTH');
    localStorage.removeItem('PORTAL_USER');
  };

  return {
    isAuthenticated,
    currentUser,
    login,
    logout
  };
}