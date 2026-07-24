<template>
  <div class="min-h-screen font-sans flex antialiased bg-slate-50 dark:bg-[#090d16] text-slate-800 dark:text-slate-100 transition-colors duration-300">
    
    <!-- Sidebar Navigation -->
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0">
      
      <!-- Top Sticky Header -->
      <header class="h-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0d1322]/80 px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 backdrop-blur-xl transition-colors duration-300 shadow-xs">
        <div class="flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-lg shadow-md shadow-blue-500/20">
            👥
          </div>
          <div>
            <h1 class="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              User Management
            </h1>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Manage user accounts, roles, profiles, and approval status</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span 
            class="text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shadow-2xs"
            :class="isManager ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="isManager ? 'bg-amber-500 dark:bg-amber-400 animate-pulse' : 'bg-blue-500 dark:bg-blue-400'"></span>
            Logged as: {{ currentUserRole.toUpperCase() }}
          </span>

          <button 
            v-if="isManager"
            @click="openAddUserModal" 
            class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer active:scale-95 shadow-md shadow-blue-600/20 flex items-center gap-2"
          >
            <span class="text-sm">+</span>
            <span>Add User</span>
          </button>
          
          <button 
            @click="fetchUsers" 
            :disabled="loading"
            class="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shadow-xs active:scale-95"
            title="Refresh Users Queue"
          >
            <span :class="{ 'animate-spin inline-block': loading }">🔄</span>
          </button>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="p-8 space-y-6 overflow-y-auto custom-scrollbar">
        
        <!-- Controls Bar: Search & Status Filters -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#0d1322] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <!-- Search Input -->
          <div class="relative w-full sm:w-80">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">🔍</span>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search by name or email..." 
              class="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <!-- Filter Pills -->
          <div class="flex items-center gap-1.5 self-start sm:self-auto">
            <button 
              v-for="filter in ['all', 'pending', 'approved', 'rejected']" 
              :key="filter"
              @click="userFilter = filter"
              class="px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase transition-all cursor-pointer border"
              :class="userFilter === filter 
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'"
            >
              {{ filter }}
              <span v-if="filter === 'pending' && pendingCount > 0" class="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[9px]">
                {{ pendingCount }}
              </span>
            </button>
          </div>
        </div>

        <!-- Users Table Card -->
        <div class="bg-white dark:bg-[#0d1322] rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse table-fixed">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-50/50 dark:bg-slate-900/40">
                  <th class="py-4 px-5 w-1/4">User Profile</th>
                  <th class="py-4 px-5 w-1/4">Contact Details</th>
                  <th class="py-4 px-5 w-32">Role Tier</th>
                  <th class="py-4 px-5 w-32">Status</th>
                  <th class="py-4 px-5 w-72 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="5" class="py-12 text-center text-slate-400 font-bold">
                    No user accounts found matching your filters.
                  </td>
                </tr>

                <tr v-for="usr in filteredUsers" :key="usr.id" class="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors h-16">
                  <!-- User Name -->
                  <td class="py-3 px-5">
                    <div class="font-extrabold text-slate-900 dark:text-slate-100 text-xs truncate">{{ usr.name }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">ID: #{{ usr.id }}</div>
                  </td>

                  <!-- Contact Info -->
                  <td class="py-3 px-5">
                    <div class="text-slate-700 dark:text-slate-300 font-mono text-[11px] truncate">{{ usr.email }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ usr.phone || 'No phone added' }}</div>
                  </td>
                  
                  <!-- Role Selector / Display -->
                  <td class="py-3 px-5">
                    <select 
                      v-if="isManager" 
                      :value="usr.role" 
                      @change="changeUserRole(usr.id, $event.target.value)"
                      class="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-[10px] uppercase rounded-lg px-2.5 py-1 border border-slate-300 dark:border-slate-700 cursor-pointer focus:outline-none focus:border-blue-500"
                    >
                      <option v-for="r in availableRoles" :key="r.role_key || r.key" :value="r.role_key || r.key">
                        {{ (r.name || r.role_key).toUpperCase() }}
                      </option>
                    </select>

                    <span v-else class="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      {{ usr.role }}
                    </span>
                  </td>

                  <!-- Approval Status Badge -->
                  <td class="py-3 px-5">
                    <span 
                      class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border inline-flex items-center gap-1.5"
                      :class="{
                        'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20': usr.status === 'pending',
                        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20': usr.status === 'approved',
                        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20': usr.status === 'rejected'
                      }"
                    >
                      <span class="w-1.5 h-1.5 rounded-full" :class="{
                        'bg-amber-500': usr.status === 'pending',
                        'bg-emerald-500': usr.status === 'approved',
                        'bg-rose-500': usr.status === 'rejected'
                      }"></span>
                      {{ usr.status }}
                    </span>
                  </td>

                  <!-- Action Controls -->
                  <td class="py-3 px-5 text-right">
                    <div class="flex justify-end items-center gap-1.5" v-if="isManager">
                      <button 
                        v-if="usr.status !== 'approved'"
                        @click="updateUserStatus(usr.id, 'approved')"
                        class="px-2.5 py-1 text-[11px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-lg border border-emerald-500/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
                      >
                        ✓ Approve
                      </button>
                      <button 
                        v-if="usr.status !== 'rejected'"
                        @click="updateUserStatus(usr.id, 'rejected')"
                        class="px-2.5 py-1 text-[11px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold rounded-lg border border-rose-500/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
                      >
                        ✕ Reject
                      </button>

                      <!-- Edit Profile Button -->
                      <button 
                        @click="openEditUserModal(usr)"
                        class="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap active:scale-95"
                      >
                        ✏️ Edit
                      </button>

                      <!-- Access Rights Matrix -->
                      <button 
                        @click="openPermissionModal(usr)"
                        class="px-2.5 py-1 text-[11px] bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold rounded-lg border border-blue-500/20 transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap active:scale-95"
                      >
                        ⚙️ Access
                      </button>
                    </div>
                    <span v-else class="text-[10px] text-slate-400 italic">Read-Only</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>

    <!-- ================= ADD / EDIT USER MODAL ================= -->
    <div v-if="showUserModal" class="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5">
        
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base">
              {{ isEditingUser ? '✏️' : '👤' }}
            </div>
            <div>
              <h3 class="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                {{ isEditingUser ? 'Edit User Profile' : 'Add New User Account' }}
              </h3>
              <p class="text-[11px] text-slate-400 mt-0.5">Fill details to update system credentials</p>
            </div>
          </div>
          
          <button @click="showUserModal = false" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 flex items-center justify-center text-xs transition-colors cursor-pointer">
            ✕
          </button>
        </div>

        <!-- Form Inputs -->
        <div class="space-y-3.5 text-xs">
          <!-- Full Name -->
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
            <input 
              v-model="userForm.name" 
              type="text" 
              placeholder="e.g. John Doe" 
              class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-blue-500"
            />
          </div>

          <!-- Email Address -->
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">Email Address *</label>
            <input 
              v-model="userForm.email" 
              type="email" 
              placeholder="user@portal.com" 
              class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-blue-500"
            />
          </div>

          <!-- Phone Number -->
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
            <input 
              v-model="userForm.phone" 
              type="text" 
              placeholder="+91 (9876543210) " 
              class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-blue-500"
            />
          </div>

          <!-- Password (Only when creating new user) -->
          <div v-if="!isEditingUser" class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">Initial Password *</label>
            <input 
              v-model="userForm.password" 
              type="password" 
              placeholder="••••••••" 
              class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-blue-500"
            />
          </div>

          <!-- Assigned Role -->
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">Assigned System Role</label>
            <select 
              v-model="userForm.role" 
              class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-blue-500 cursor-pointer uppercase"
            >
              <option v-for="r in availableRoles" :key="r.role_key || r.key" :value="r.role_key || r.key">
                {{ (r.name || r.role_key).toUpperCase() }}
              </option>
            </select>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button @click="showUserModal = false" class="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-2xl transition-all cursor-pointer text-xs active:scale-95">
            Cancel
          </button>
          <button @click="saveUserForm" :disabled="saving" class="w-2/3 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-2xl uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 text-xs shadow-md shadow-blue-600/20 active:scale-95">
            {{ saving ? 'Saving Profile...' : (isEditingUser ? 'Update Account' : 'Create User') }}
          </button>
        </div>

      </div>
    </div>

    <!-- ================= PERMISSION GOVERNANCE MODAL ================= -->
    <div v-if="activeModalUser" class="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5">
        
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 class="font-bold text-sm text-slate-900 dark:text-slate-100">Configure Access Rights</h3>
            <p class="text-xs text-slate-400 mt-0.5">
              User: <strong class="text-blue-500">{{ activeModalUser.name }}</strong> ({{ activeModalUser.email }})
            </p>
          </div>
          <button @click="activeModalUser = null" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-slate-100 flex items-center justify-center text-xs cursor-pointer">
            ✕
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <div v-for="(moduleName, moduleKey) in moduleCatalog" :key="moduleKey" class="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
            <div>
              <div class="font-bold text-slate-800 dark:text-slate-200 text-xs">{{ moduleName }}</div>
              <div class="text-[10px] text-slate-400 mt-0.5">Define visibility & edit controls</div>
            </div>

            <select 
              v-model="userPermissions[moduleKey]"
              class="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-[11px] rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="none" class="text-rose-500">🚫 Hide (No Access)</option>
              <option value="view" class="text-amber-500">👁️ View Only</option>
              <option value="edit" class="text-emerald-500">✏️ View & Edit Access</option>
            </select>
          </div>
        </div>

        <div class="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button @click="activeModalUser = null" class="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl transition-all cursor-pointer text-xs">
            Cancel
          </button>
          <button @click="saveUserPermissions" :disabled="saving" class="w-2/3 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-2xl uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 text-xs shadow-md shadow-blue-600/20">
            {{ saving ? 'Saving Access...' : 'Save Permission' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import { useAuth } from '@/composables/useAuth.js';

const API_BASE = 'http://localhost:5001';
const { currentUser, user } = useAuth();

const loading = ref(false);
const saving = ref(false);
const users = ref([]);
const availableRoles = ref([]);
const userFilter = ref('all');
const searchQuery = ref('');

// Add / Edit User Form State
const showUserModal = ref(false);
const isEditingUser = ref(false);
const userForm = ref({
  id: null,
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'agent'
});

// Permission Modal State
const activeModalUser = ref(null);
const userPermissions = ref({
  catalog: 'view',
  orders: 'edit',
  kiosks: 'view',
  users: 'none',
  roles: 'none'
});

const moduleCatalog = {
  catalog: 'Catalog Management',
  orders: 'Live Customer Orders',
  kiosks: 'Floor Map & Kiosks',
  users: 'Users Directory',
  roles: 'Roles & Governance'
};

const currentUserRole = computed(() => {
  const activeUser = currentUser?.value || user?.value || JSON.parse(localStorage.getItem('portalUser') || '{}');
  return activeUser?.role || 'agent';
});

const isManager = computed(() => currentUserRole.value === 'manager');

// Computed Queue Filters & Search
const pendingCount = computed(() => users.value.filter(u => u.status === 'pending').length);

const filteredUsers = computed(() => {
  return users.value.filter(usr => {
    const matchesFilter = userFilter.value === 'all' || usr.status === userFilter.value;
    const matchesSearch = searchQuery.value === '' || 
      usr.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
      usr.email?.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesFilter && matchesSearch;
  });
});

// Fetch Available Dynamic Roles from Backend
const fetchAvailableRoles = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/roles`);
    if (res.ok) {
      availableRoles.value = await res.json();
    }
  } catch (err) {
    console.error('Failed to load available roles:', err);
  }
};

// Fetch Users List
const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await fetch(`${API_BASE}/api/admin/users`);
    if (res.ok) {
      users.value = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch users:', err);
  } finally {
    loading.value = false;
  }
};

// Open "Add User" Modal
const openAddUserModal = () => {
  isEditingUser.value = false;
  userForm.value = { id: null, name: '', email: '', phone: '', password: '', role: 'agent' };
  showUserModal.value = true;
};

// Open "Edit User" Modal
const openEditUserModal = (usr) => {
  isEditingUser.value = true;
  userForm.value = {
    id: usr.id,
    name: usr.name || '',
    email: usr.email || '',
    phone: usr.phone || '',
    password: '',
    role: usr.role || 'agent'
  };
  showUserModal.value = true;
};

// Save User Profile (Create or Update)
const saveUserForm = async () => {
  if (!userForm.value.name || !userForm.value.email) {
    alert('Name and Email are required.');
    return;
  }

  saving.value = true;
  try {
    const url = isEditingUser.value 
      ? `${API_BASE}/api/admin/users/${userForm.value.id}` 
      : `${API_BASE}/api/admin/users`;

    const method = isEditingUser.value ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm.value)
    });

    if (res.ok) {
      showUserModal.value = false;
      fetchUsers();
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to save user.');
    }
  } catch (err) {
    console.error('Failed to save user:', err);
  } finally {
    saving.value = false;
  }
};

// Update User Approval Status (Manager Only)
const updateUserStatus = async (userId, status) => {
  if (!isManager.value) return;
  try {
    const res = await fetch(`${API_BASE}/api/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      const targetUser = users.value.find(u => u.id === userId);
      if (targetUser) targetUser.status = status;
    }
  } catch (err) {
    console.error('Failed to update user status:', err);
  }
};

// Promote or Change User Role (Manager Only)
const changeUserRole = async (userId, newRole) => {
  if (!isManager.value) return;
  try {
    const res = await fetch(`${API_BASE}/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    });
    if (res.ok) {
      const targetUser = users.value.find(u => u.id === userId);
      if (targetUser) targetUser.role = newRole;
    }
  } catch (err) {
    console.error('Failed to change user role:', err);
  }
};

// Open Permission Configurator Modal for Specific User
const openPermissionModal = async (usr) => {
  activeModalUser.value = usr;
  
  if (usr.permissions) {
    userPermissions.value = typeof usr.permissions === 'string' ? JSON.parse(usr.permissions) : { ...usr.permissions };
  } else {
    if (usr.role === 'manager') {
      userPermissions.value = { catalog: 'edit', orders: 'edit', kiosks: 'edit', users: 'edit', roles: 'edit' };
    } else if (usr.role === 'admin') {
      userPermissions.value = { catalog: 'edit', orders: 'view', kiosks: 'edit', users: 'view', roles: 'view' };
    } else {
      userPermissions.value = { catalog: 'none', orders: 'edit', kiosks: 'view', users: 'none', roles: 'none' };
    }
  }
};

// Save Permissions in Backend
const saveUserPermissions = async () => {
  if (!activeModalUser.value || !isManager.value) return;
  saving.value = true;

  try {
    const res = await fetch(`${API_BASE}/api/admin/users/${activeModalUser.value.id}/permissions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permissions: userPermissions.value })
    });

    if (res.ok) {
      activeModalUser.value.permissions = { ...userPermissions.value };
      activeModalUser.value = null;
    }
  } catch (err) {
    console.error('Failed to save permissions:', err);
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchAvailableRoles();
  fetchUsers();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.2);
  border-radius: 9999px;
}
</style>