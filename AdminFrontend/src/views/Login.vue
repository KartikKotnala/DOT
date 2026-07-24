<template>
  <div class="min-h-screen bg-slate-950 dark:bg-[#090d16] text-slate-100 font-sans flex items-center justify-center p-4 antialiased relative overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.25),rgba(255,255,255,0))]">
    
    <!-- Background Glow Orbs -->
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

    <div class="bg-[#0d1322]/90 backdrop-blur-2xl w-full max-w-md rounded-2xl border border-slate-800/80 p-8 shadow-2xl shadow-blue-950/40 relative z-10">
      
      <!-- App Header -->
      <div class="text-center mb-6">
        <div class="w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-2xl mx-auto mb-3 flex items-center justify-center text-xl shadow-inner">
          🔐
        </div>
        <h1 class="text-base font-black text-slate-100 uppercase tracking-wider">Kiosk Management Portal</h1>
        <p class="text-xs text-slate-400 mt-0.5">Secure Portal Access</p>
      </div>

      <!-- Mode Switcher -->
      <div class="flex bg-slate-900/80 p-1 rounded-xl mb-6 border border-slate-800/80 shadow-inner">
        <button 
          @click="switchTab('login')" 
          type="button"
          class="flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer"
          :class="mode === 'login' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200'"
        >
          Sign In
        </button>
        <button 
          @click="switchTab('signup')" 
          type="button"
          class="flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer"
          :class="mode === 'signup' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200'"
        >
          Register
        </button>
      </div>

      <!-- Feedback Alerts -->
      <div v-if="errorMsg" class="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl flex items-center gap-2">
        <span>⚠️</span> <span>{{ errorMsg }}</span>
      </div>
      <div v-if="successMsg" class="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2">
        <span>✅</span> <span>{{ successMsg }}</span>
      </div>

      <!-- ================= SIGN IN FORM ================= -->
      <form v-if="mode === 'login'" @submit.prevent="handleLoginSubmit" class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-slate-300 mb-1">Email Address</label>
          <input 
            v-model="loginForm.email" 
            required 
            type="email" 
            placeholder="user@portal.com" 
            class="w-full bg-slate-900/90 text-slate-100 placeholder:text-slate-500 border border-slate-800 rounded-xl p-3 focus:outline-none focus:border-blue-500 transition-colors" 
          />
        </div>

        <div>
          <label class="block font-bold text-slate-300 mb-1">Password</label>
          <div class="relative">
            <input 
              v-model="loginForm.password" 
              required 
              :type="showLoginPassword ? 'text' : 'password'" 
              placeholder="••••••••" 
              class="w-full bg-slate-900/90 text-slate-100 placeholder:text-slate-500 border border-slate-800 rounded-xl p-3 pr-10 focus:outline-none focus:border-blue-500 transition-colors" 
            />
            <button 
              type="button" 
              @click="showLoginPassword = !showLoginPassword" 
              class="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 text-sm cursor-pointer select-none"
            >
              {{ showLoginPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <button type="submit" :disabled="loading" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-blue-600/30 active:scale-95">
          {{ loading ? 'Authenticating...' : 'Sign In' }}
        </button>
      </form>

      <!-- ================= REGISTRATION FORM ================= -->
      <form v-else-if="mode === 'signup' && registrationStep === 1" @submit.prevent="handleRegisterSubmit" class="space-y-3.5 text-xs">
        <div>
          <label class="block font-bold text-slate-300 mb-1">Full Name *</label>
          <input 
            v-model="signupForm.name" 
            required 
            type="text" 
            placeholder="John Doe" 
            class="w-full bg-slate-900/90 text-slate-100 placeholder:text-slate-500 border border-slate-800 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 transition-colors" 
          />
        </div>

        <div>
          <label class="block font-bold text-slate-300 mb-1">Email Address *</label>
          <input 
            v-model="signupForm.email" 
            required 
            type="email" 
            placeholder="user@portal.com" 
            class="w-full bg-slate-900/90 text-slate-100 placeholder:text-slate-500 border border-slate-800 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 transition-colors" 
          />
        </div>

        <div>
          <label class="block font-bold text-slate-300 mb-1">Password *</label>
          <div class="relative">
            <input 
              v-model="signupForm.password" 
              required 
              :type="showSignupPassword ? 'text' : 'password'" 
              placeholder="••••••••" 
              class="w-full bg-slate-900/90 text-slate-100 placeholder:text-slate-500 border border-slate-800 rounded-xl p-2.5 pr-10 focus:outline-none focus:border-blue-500 transition-colors" 
            />
            <button 
              type="button" 
              @click="showSignupPassword = !showSignupPassword" 
              class="absolute right-3 top-3 text-slate-500 hover:text-slate-300 text-sm cursor-pointer select-none"
            >
              {{ showSignupPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-300 mb-1">Requested Role *</label>
          <div class="relative">
            <select 
              v-model="signupForm.role" 
              required 
              class="w-full bg-slate-900/90 text-slate-100 font-semibold border border-slate-800 rounded-xl p-2.5 pr-8 appearance-none focus:outline-none focus:border-blue-500 cursor-pointer transition-colors"
            >
              <option value="agent" class="bg-slate-900 text-slate-100 py-1 font-semibold">
                Agent (Field Operations)
              </option>
              <option value="admin" class="bg-slate-900 text-slate-100 py-1 font-semibold">
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

        <button type="submit" :disabled="loading" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-blue-600/30 active:scale-95">
          {{ loading ? 'Processing...' : 'Register' }}
        </button>
      </form>

      <form v-else-if="mode === 'signup' && registrationStep === 2" @submit.prevent="handleRegisterVerify" class="space-y-4 text-xs">
        <div class="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-amber-300 text-[11px] font-medium">
          Enter the verification code sent to <strong class="text-white">{{ signupForm.email }}</strong>.
          <div class="mt-1 font-bold text-rose-400">⌛ Expires in 3 minutes.</div>
        </div>

        <div>
          <label class="block font-bold text-slate-300 mb-1">6-Digit Verification Code</label>
          <input 
            v-model="signupForm.otp" 
            required 
            type="text" 
            maxlength="6" 
            placeholder="123456" 
            class="w-full bg-slate-900/90 text-slate-100 placeholder:text-slate-600 border border-slate-800 rounded-xl p-3 font-mono text-center text-xl font-bold tracking-widest focus:outline-none focus:border-blue-500 transition-colors" 
          />
        </div>

        <div class="flex gap-2">
          <button type="button" @click="registrationStep = 1" class="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all cursor-pointer">
            Back
          </button>
          <button type="submit" :disabled="loading" class="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-emerald-600/30 active:scale-95">
            {{ loading ? 'Verifying...' : 'Verify & Complete' }}
          </button>
        </div>
      </form>

    </div>

    <!-- ================= 2FA LOGIN VERIFICATION POPUP MODAL ================= -->
    <div v-if="show2FAModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div class="bg-[#0d1322] border border-slate-800 text-slate-100 w-full max-w-sm rounded-2xl p-6 shadow-2xl space-y-4">
        
        <div class="text-center">
          <div class="w-10 h-10 bg-blue-600/20 border border-blue-500/30 rounded-xl mx-auto mb-2 flex items-center justify-center text-lg">
            📩
          </div>
          <h3 class="font-bold text-sm text-slate-100">2-Step Verification Required</h3>
          <p class="text-xs text-slate-400 mt-1">
            We sent a 6-digit security code to <strong class="text-white">{{ loginForm.email }}</strong>
          </p>
        </div>

        <div v-if="modalError" class="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl text-center">
          {{ modalError }}
        </div>

        <form @submit.prevent="handleVerifyLogin2FA" class="space-y-4 text-xs">
          <div>
            <input 
              v-model="loginForm.otp" 
              required 
              type="text" 
              maxlength="6" 
              placeholder="123456" 
              class="w-full bg-slate-900 text-slate-100 placeholder:text-slate-600 border border-slate-800 rounded-xl p-3 font-mono text-center text-xl font-bold tracking-widest focus:outline-none focus:border-blue-500 transition-colors" 
            />
          </div>

          <div class="flex gap-2">
            <button type="button" @click="show2FAModal = false" class="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all cursor-pointer">
              Cancel
            </button>
            <button type="submit" :disabled="loading" class="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl uppercase transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-blue-600/30">
              {{ loading ? 'Verifying...' : 'Confirm Code' }}
            </button>
          </div>
        </form>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth.js';

const router = useRouter();
const { login } = useAuth();
const API_BASE = 'http://localhost:5001';

const mode = ref('login');
const registrationStep = ref(1);
const show2FAModal = ref(false);
const loading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');
const modalError = ref('');

const showLoginPassword = ref(false);
const showSignupPassword = ref(false);

const loginForm = ref({ email: '', password: '', otp: '' });
const signupForm = ref({ name: '', email: '', password: '', role: 'agent', otp: '' });

const switchTab = (tab) => {
  mode.value = tab;
  registrationStep.value = 1;
  show2FAModal.value = false;
  errorMsg.value = '';
  successMsg.value = '';
  modalError.value = '';
};

// --- LOGIN FLOW ---
const handleLoginSubmit = async () => {
  errorMsg.value = '';
  successMsg.value = '';
  loading.value = true;
  
  try {
    const res = await fetch(`${API_BASE}/api/auth/send-login-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginForm.value.email, password: loginForm.value.password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    loginForm.value.otp = '';
    show2FAModal.value = true; // Open the verification pop-up modal
  } catch (err) {
    errorMsg.value = err.message;
  } finally {
    loading.value = false;
  }
};

const handleVerifyLogin2FA = async () => {
  modalError.value = '';
  loading.value = true;

  try {
    const res = await fetch(`${API_BASE}/api/auth/login-with-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: loginForm.value.email,
        password: loginForm.value.password,
        otp: loginForm.value.otp
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    show2FAModal.value = false;
    login(data.user);
    await router.push('/');
  } catch (err) {
    modalError.value = err.message;
  } finally {
    loading.value = false;
  }
};

// --- REGISTRATION FLOW ---
const handleRegisterSubmit = async () => {
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

    successMsg.value = 'Verification code sent to your email!';
    registrationStep.value = 2;
  } catch (err) {
    errorMsg.value = err.message;
  } finally {
    loading.value = false;
  }
};

const handleRegisterVerify = async () => {
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

    successMsg.value = 'Account verified and created! You can now sign in.';
    mode.value = 'login';
    registrationStep.value = 1;
  } catch (err) {
    errorMsg.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>