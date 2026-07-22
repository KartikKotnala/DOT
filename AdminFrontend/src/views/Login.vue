<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4 antialiased font-sans">
    <div class="bg-white w-full max-w-md rounded-2xl border border-slate-200/80 p-8 shadow-xl">
      
      <!-- App Header -->
      <div class="text-center mb-6">
        <h1 class="text-base font-black text-slate-900 uppercase tracking-wider">Kiosk Management Portal</h1>
        <p class="text-xs text-slate-500 mt-0.5">Secure Role-Based Authentication</p>
      </div>

      <!-- Mode Switcher -->
      <div class="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200/60">
        <button 
          @click="switchTab('login')" 
          type="button"
          class="flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer"
          :class="mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
        >
          Sign In
        </button>
        <button 
          @click="switchTab('signup')" 
          type="button"
          class="flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer"
          :class="mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
        >
          Register
        </button>
      </div>

      <!-- Feedback Alerts -->
      <div v-if="errorMsg" class="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
        <span>⚠️</span> <span>{{ errorMsg }}</span>
      </div>
      <div v-if="successMsg" class="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
        <span>✅</span> <span>{{ successMsg }}</span>
      </div>

      <!-- 1. LOGIN FORM -->
      <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Email Address</label>
          <input 
            v-model="loginForm.email" 
            required 
            type="email" 
            placeholder="user@portal.com" 
            class="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" 
          />
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Password</label>
          <div class="relative">
            <input 
              v-model="loginForm.password" 
              required 
              :type="showLoginPassword ? 'text' : 'password'" 
              placeholder="••••••••" 
              class="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl p-3 pr-10 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" 
            />
            <button 
              type="button" 
              @click="showLoginPassword = !showLoginPassword" 
              class="absolute right-3 top-3.5 text-slate-400 hover:text-slate-700 text-sm cursor-pointer select-none"
            >
              {{ showLoginPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <button type="submit" :disabled="loading" class="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50">
          {{ loading ? 'Authenticating...' : 'Sign In' }}
        </button>
      </form>

      <!-- 2. REGISTRATION STEP 1: Enter Details & Role -->
      <form v-else-if="mode === 'signup' && step === 1" @submit.prevent="handleRegister" class="space-y-3.5 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Full Name *</label>
          <input 
            v-model="signupForm.name" 
            required 
            type="text" 
            placeholder="John Doe" 
            class="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" 
          />
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Email Address *</label>
          <input 
            v-model="signupForm.email" 
            required 
            type="email" 
            placeholder="user@portal.com" 
            class="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" 
          />
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Password *</label>
          <div class="relative">
            <input 
              v-model="signupForm.password" 
              required 
              :type="showSignupPassword ? 'text' : 'password'" 
              placeholder="••••••••" 
              class="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl p-2.5 pr-10 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" 
            />
            <button 
              type="button" 
              @click="showSignupPassword = !showSignupPassword" 
              class="absolute right-3 top-3 text-slate-400 hover:text-slate-700 text-sm cursor-pointer select-none"
            >
              {{ showSignupPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Requested Role *</label>
          <div class="relative">
            <select 
              v-model="signupForm.role" 
              required 
              class="w-full bg-slate-50 text-slate-900 font-semibold border border-slate-200 rounded-xl p-2.5 pr-8 appearance-none focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer transition-colors"
            >
              <option value="agent" class="bg-white text-slate-900 py-1 font-semibold">
                Agent (Field Operations)
              </option>
              <option value="admin" class="bg-white text-slate-900 py-1 font-semibold">
                Admin (System Management)
              </option>
            </select>
            
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <button type="submit" :disabled="loading" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50">
          {{ loading ? 'Sending OTP Code...' : 'Register' }}
        </button>
      </form>

      <!-- 3. REGISTRATION STEP 2: Verify 3-Min OTP -->
      <form v-else-if="mode === 'signup' && step === 2" @submit.prevent="handleVerifyOtp" class="space-y-4 text-xs">
        <div class="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-800 text-[11px] font-medium">
          Enter the 6-digit verification code sent to <strong class="text-slate-900">{{ signupForm.email }}</strong>.
          <div class="mt-1 font-bold text-rose-600">⌛ Code expires in 3 minutes.</div>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">6-Digit OTP Code</label>
          <input 
            v-model="signupForm.otp" 
            required 
            type="text" 
            maxlength="6" 
            placeholder="123456" 
            class="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl p-3 font-mono text-center text-xl font-bold tracking-widest focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" 
          />
        </div>

        <button type="submit" :disabled="loading" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50">
          {{ loading ? 'Verifying Code...' : 'Verify OTP' }}
        </button>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const API_BASE = 'http://localhost:5001';

const mode = ref('login');
const step = ref(1);
const loading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

// Password Visibility Toggles
const showLoginPassword = ref(false);
const showSignupPassword = ref(false);

const loginForm = ref({ email: '', password: '' });
const signupForm = ref({ name: '', email: '', password: '', role: 'agent', otp: '' });

const switchTab = (tab) => {
  mode.value = tab;
  step.value = 1;
  errorMsg.value = '';
  successMsg.value = '';
};

// Handle Login
const handleLogin = async () => {
  errorMsg.value = '';
  loading.value = true;
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm.value)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    localStorage.setItem('portalUser', JSON.stringify(data.user));
    router.push('/');
  } catch (err) {
    errorMsg.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Handle Registration & OTP Request
const handleRegister = async () => {
  errorMsg.value = '';
  successMsg.value = '';
  loading.value = true;
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupForm.value)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    successMsg.value = 'OTP sent! Please check your email inbox.';
    step.value = 2;
  } catch (err) {
    errorMsg.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Handle OTP Verification
const handleVerifyOtp = async () => {
  errorMsg.value = '';
  loading.value = true;
  try {
    const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: signupForm.value.email,
        otp: signupForm.value.otp
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    successMsg.value = 'Email verified! Account is awaiting manager approval.';
    mode.value = 'login';
    step.value = 1;
  } catch (err) {
    errorMsg.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>