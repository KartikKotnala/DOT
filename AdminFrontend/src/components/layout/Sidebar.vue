<template>
  <aside class="w-64 bg-[#0f172a] text-slate-300 flex flex-col shrink-0 h-screen sticky top-0 font-sans border-r border-slate-800/80 shadow-2xl select-none z-40">
    
    <!-- Top Brand Header with logo.png -->
    <div class="h-16 flex items-center px-6 gap-3 border-b border-slate-800/80 font-bold text-white text-base tracking-wide bg-slate-900/40 backdrop-blur-md">
      <!-- 🖼️ Custom Image Logo -->
      <img 
        src="@/assets/images/logo.png" 
        alt="District7 Logo" 
        class="w-9 h-9 object-contain rounded-xl shadow-md ring-1 ring-white/10"
      />
      
      <div class="flex flex-col">
        <span class="font-extrabold tracking-wider text-slate-100 text-sm">District7</span>
        <span class="text-[10px] font-medium text-slate-400 -mt-1 tracking-normal">Kiosk Network</span>
      </div>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 py-6 text-xs font-semibold space-y-1.5 px-3.5 overflow-y-auto custom-scrollbar">
      <div class="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        Main Menu
      </div>

      <!-- Dashboard Link -->
      <router-link 
        to="/" 
        class="group relative flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200"
        :class="$route.path === '/' 
          ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30' 
          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'"
      >
        <span class="text-base transition-transform duration-200 group-hover:scale-110">📊</span> 
        <span>Dashboard</span>
      </router-link>

      <!-- Products Link -->
      <router-link 
        to="/products" 
        class="group relative flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200"
        :class="$route.path === '/products' 
          ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30' 
          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'"
      >
        <span class="text-base transition-transform duration-200 group-hover:scale-110">🏷️</span> 
        <span>Products</span>
      </router-link>

      <!-- Roles Link -->
      <router-link 
        to="/roles" 
        class="group relative flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200"
        :class="$route.path === '/roles' 
          ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30' 
          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'"
      >
        <span class="text-base transition-transform duration-200 group-hover:scale-110">👥</span> 
        <span>Roles & Staff</span>
      </router-link>
    </nav>

    <!-- Bottom User Profile Footer (Fixed at Bottom) -->
    <div class="p-3.5 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
      <div class="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-700/40">
        
        <div class="flex items-center gap-3 min-w-0">
          <div class="relative shrink-0">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-inner uppercase">
              {{ currentUser?.name ? currentUser.name[0] : 'U' }}
            </div>
            <!-- Active Status Indicator -->
            <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
          </div>

          <div class="truncate">
            <p class="text-xs font-bold text-slate-100 truncate leading-tight">
              {{ currentUser?.name || 'Staff User' }}
            </p>
            <p class="text-[10px] text-slate-400 font-medium truncate capitalize mt-0.5">
              {{ currentUser?.role || 'Manager' }}
            </p>
          </div>
        </div>

        <!-- Sign Out Button -->
        <button 
          @click="handleLogout"
          class="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-all duration-200 cursor-pointer group active:scale-95"
          title="Sign Out"
        >
          <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
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

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
}
</style>