import { ref, computed } from 'vue';

// Shared global reactive state initialized from localStorage
const currentUser = ref(JSON.parse(localStorage.getItem('portalUser')) || null);

export function useAuth() {
  // Authentication status flag
  const isAuthenticated = computed(() => !!currentUser.value);

  // User Role getter
  const userRole = computed(() => currentUser.value?.role || 'agent');

  // Parsed Permissions Object
  const userPermissions = computed(() => {
    const raw = currentUser.value?.permissions;
    if (!raw) return {};
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  });

  // Check if user has at least 'view' or 'edit' access to a module
  const canViewModule = (moduleKey) => {
    if (userRole.value === 'manager') return true; // Manager overrides all
    const perm = userPermissions.value[moduleKey];
    return perm === 'view' || perm === 'edit';
  };

  // Check if user has full 'edit' access to a module
  const canEditModule = (moduleKey) => {
    if (userRole.value === 'manager') return true; // Manager overrides all
    return userPermissions.value[moduleKey] === 'edit';
  };

  // Login handler
  const login = (userData) => {
    currentUser.value = userData;
    localStorage.setItem('portalUser', JSON.stringify(userData));
  };

  // Update existing session state without clearing login
  const updateUser = (updatedFields) => {
    if (!currentUser.value) return;
    const mergedData = { ...currentUser.value, ...updatedFields };
    currentUser.value = mergedData;
    localStorage.setItem('portalUser', JSON.stringify(mergedData));
  };

  // Logout handler
  const logout = () => {
    currentUser.value = null;
    localStorage.removeItem('portalUser');
  };

  return {
    isAuthenticated,
    currentUser,
    user: currentUser, // Alias so both destructure formats work!
    userRole,
    userPermissions,
    canViewModule,
    canEditModule,
    login,
    updateUser,
    logout
  };
}