<template>
  <aside class="w-64 bg-[#001529] text-slate-300 flex flex-col shrink-0 min-h-screen font-sans">
    
    <div class="h-16 flex items-center px-6 gap-3 border-b border-white/10 font-bold text-white text-lg tracking-wide">
      <div class="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-xs font-black shadow-md">
        M
      </div>
      <span>District7</span>
    </div>

    <nav class="flex-1 py-4 text-xs font-semibold space-y-1 px-3">
      
      <router-link 
        to="/" 
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
        :class="$route.path === '/' ? 'bg-blue-600 text-white shadow-md font-bold' : 'hover:bg-white/5 hover:text-white'"
      >
        <span>📊</span> Dashboard
      </router-link>

      <router-link 
        to="/products" 
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
        :class="$route.path === '/products' ? 'bg-blue-600 text-white shadow-md font-bold' : 'hover:bg-white/5 hover:text-white'"
      >
        <span>🏷️</span> Products
      </router-link>

      <router-link 
        to="/roles" 
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
        :class="$route.path === '/roles' ? 'bg-blue-600 text-white shadow-md font-bold' : 'hover:bg-white/5 hover:text-white'"
      >
        <span>👥</span> Roles & Staff
      </router-link>

    </nav>

    <div class="p-4 border-t border-white/10 bg-black/20">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {{ currentUser?.name ? currentUser.name[0] : 'U' }}
          </div>
          <div class="truncate">
            <p class="text-xs font-bold text-white truncate">{{ currentUser?.name || 'Staff User' }}</p>
            <p class="text-[10px] text-slate-400 font-normal">{{ currentUser?.role || 'Manager' }}</p>
          </div>
        </div>

        <button 
          @click="handleLogout"
          class="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer text-sm"
          title="Sign Out"
        >
          🚪
        </button>
      </div>
    </div>

  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const { currentUser, logout } = useAuth();

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>