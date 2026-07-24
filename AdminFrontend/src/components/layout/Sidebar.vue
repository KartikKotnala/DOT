<template>
  <aside class="w-64 bg-slate-900 dark:bg-[#0b1329] text-slate-300 flex flex-col shrink-0 h-screen sticky top-0 font-sans border-r border-slate-800/80 shadow-2xl select-none z-40 transition-colors duration-300">
    
    <!-- Top Brand Header -->
    <div class="h-16 flex items-center px-5 gap-3 border-b border-slate-800/80 font-bold text-white text-base tracking-wide bg-slate-900/80 dark:bg-slate-900/60 backdrop-blur-md">
      <div class="p-1 rounded-xl bg-slate-800/60 border border-slate-700/50 shadow-inner">
        <img 
          src="@/assets/images/malllogo.png" 
          alt="District7 Logo" 
          class="w-8 h-8 object-contain rounded-lg"
        />
      </div>
      
      <div class="flex flex-col">
        <span class="font-black tracking-wider text-slate-100 text-sm leading-tight">District7</span>
        <span class="text-[10px] font-semibold text-blue-400 tracking-normal">Kiosk Network</span>
      </div>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 py-5 text-xs font-semibold space-y-1.5 px-3.5 overflow-y-auto custom-scrollbar">
      <div class="px-3 pb-2 text-[10px] font-black uppercase tracking-widest text-slate-500/90">
        Navigation Menu
      </div>

      <!-- Dashboard Link (Always Visible) -->
      <router-link 
        to="/" 
        exact
        class="group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 font-medium transition-all duration-200 hover:bg-slate-800/60 hover:text-slate-100 active:scale-[0.98]"
        active-class="bg-blue-600/90 text-white font-bold shadow-md shadow-blue-600/25 border border-blue-500/30 hover:bg-blue-600 hover:text-white"
      >
        <span class="text-base transition-transform duration-200 group-hover:scale-110 shrink-0">📊</span> 
        <span>Dashboard</span>
      </router-link>

      <!-- Live Orders Link (Hidden if permissions[orders] === 'none') -->
      <router-link 
        v-if="canView('orders')"
        to="/orders" 
        class="group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 font-medium transition-all duration-200 hover:bg-slate-800/60 hover:text-slate-100 active:scale-[0.98]"
        active-class="bg-blue-600/90 text-white font-bold shadow-md shadow-blue-600/25 border border-blue-500/30 hover:bg-blue-600 hover:text-white"
      >
        <span class="text-base transition-transform duration-200 group-hover:scale-110 shrink-0">📦</span> 
        <span class="flex-1">Live Orders</span>
      </router-link>

      <!-- Products / Catalog Link (Hidden if permissions[catalog] === 'none') -->
      <router-link 
        v-if="canView('catalog')"
        to="/products" 
        class="group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 font-medium transition-all duration-200 hover:bg-slate-800/60 hover:text-slate-100 active:scale-[0.98]"
        active-class="bg-blue-600/90 text-white font-bold shadow-md shadow-blue-600/25 border border-blue-500/30 hover:bg-blue-600 hover:text-white"
      >
        <span class="text-base transition-transform duration-200 group-hover:scale-110 shrink-0">🏷️</span> 
        <span>Products & Catalog</span>
      </router-link>
      <!-- Users Directory Link -->
      <router-link 
        v-if="userRole === 'manager' || canView('users')"
        to="/users" 
        class="group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 font-medium transition-all duration-200 hover:bg-slate-800/60 hover:text-slate-100 active:scale-[0.98]"
        active-class="bg-blue-600/90 text-white font-bold shadow-md shadow-blue-600/25 border border-blue-500/30 hover:bg-blue-600 hover:text-white"
      >
      <span class="text-base transition-transform duration-200 group-hover:scale-110 shrink-0">👤</span> 
      <span>Users Directory</span>
      </router-link>

      <!-- Roles Management Link (Hidden if permissions[users] === 'none') -->
      <router-link 
        v-if="userRole === 'manager' || canView('users')"
        to="/roles" 
        class="group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 font-medium transition-all duration-200 hover:bg-slate-800/60 hover:text-slate-100 active:scale-[0.98]"
        active-class="bg-blue-600/90 text-white font-bold shadow-md shadow-blue-600/25 border border-blue-500/30 hover:bg-blue-600 hover:text-white"
      >
        <span class="text-base transition-transform duration-200 group-hover:scale-110 shrink-0">👥</span> 
        <span>Roles Management</span>
      </router-link>
    </nav>

    <!-- Global Theme Switcher Section -->
    <div class="px-3.5 py-2.5 border-t border-slate-800/80 bg-slate-900/60 dark:bg-slate-900/40">
      <button 
        @click="toggleTheme"
        class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/50 transition-all duration-200 cursor-pointer active:scale-95"
      >
        <span class="flex items-center gap-2">
          <span>{{ isDarkMode ? '🌙' : '☀️' }}</span>
          <span>Theme Mode</span>
        </span>
        <span class="text-[10px] font-black uppercase tracking-wider text-blue-400">
          {{ isDarkMode ? 'Dark' : 'Light' }}
        </span>
      </button>
    </div>

    <!-- Bottom User Profile Footer -->
    <div class="p-3 border-t border-slate-800/80 bg-slate-900/80 backdrop-blur-md">
      <div class="flex items-center justify-between p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 shadow-inner">
        
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="relative shrink-0">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black text-xs shadow-sm uppercase">
              {{ activeUser?.name ? activeUser.name[0] : 'U' }}
            </div>
            <!-- Status Badge -->
            <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
          </div>

          <div class="truncate">
            <p class="text-xs font-extrabold text-slate-100 truncate leading-tight">
              {{ activeUser?.name || 'Staff User' }}
            </p>
            <p class="text-[10px] text-slate-400 font-medium truncate capitalize">
              {{ userRole }}
            </p>
          </div>
        </div>

        <!-- Logout Button -->
        <button 
          @click="handleLogout"
          class="p-2 hover:bg-rose-500/15 text-slate-400 hover:text-rose-400 rounded-lg transition-all duration-200 cursor-pointer active:scale-90"
          title="Sign Out"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>

      </div>
    </div>

  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useTheme } from '@/composables/useTheme';

const router = useRouter();
const { currentUser, user, logout } = useAuth();
const { isDarkMode, toggleTheme } = useTheme();

// Unwrapped user state
const activeUser = computed(() => {
  return currentUser?.value || user?.value || JSON.parse(localStorage.getItem('portalUser') || '{}');
});

const userRole = computed(() => activeUser.value?.role || 'agent');

// Parse permissions string or object
const userPermissions = computed(() => {
  const rawPerms = activeUser.value?.permissions;
  if (!rawPerms) return null;
  return typeof rawPerms === 'string' ? JSON.parse(rawPerms) : rawPerms;
});

// Helper function to check module visibility
const canView = (moduleKey) => {
  // Manager always sees everything
  if (userRole.value === 'manager') return true;

  // Fallback defaults if no custom permissions assigned yet
  if (!userPermissions.value) {
    if (userRole.value === 'admin') return true;
    return moduleKey === 'orders'; // Agents default to viewing orders
  }

  // Hide tab if permission set to 'none'
  return userPermissions.value[moduleKey] !== 'none';
};

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>

<style scoped>
/* Custom Scrollbar for Long Navigation Lists */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
}
</style>