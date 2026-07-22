<template>
  <div class="min-h-screen bg-[#001529] text-slate-100 flex items-center justify-center p-4 font-sans">
    
    <div class="w-full max-w-md bg-white text-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-200">
      
      <div class="text-center mb-8">
        <div class="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-xl mx-auto mb-3 shadow-md">
          M
        </div>
        <h1 class="text-xl font-bold tracking-tight text-slate-900">MALL STAFF PORTAL</h1>
        <p class="text-xs text-slate-500 mt-1">Sign in to access management control center</p>
      </div>

      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4 text-xs font-medium">
        <div>
          <label class="block text-slate-600 uppercase font-bold mb-1 tracking-wider text-[10px]">Username</label>
          <input 
            v-model="username" 
            type="text" 
            required
            placeholder="e.g. admin" 
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label class="block text-slate-600 uppercase font-bold mb-1 tracking-wider text-[10px]">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required
            placeholder="••••••••" 
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <button 
          type="submit"
          class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer mt-2"
        >
          Sign In
        </button>
      </form>

      <div class="mt-6 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
        Demo Credentials: <strong class="text-slate-600">admin / admin123</strong>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { login } = useAuth();

const username = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = () => {
  errorMessage.value = '';
  const result = login(username.value, password.value);
  
  if (result.success) {
    router.push('/');
  } else {
    errorMessage.value = result.message;
  }
};
</script>