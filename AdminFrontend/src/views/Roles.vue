<template>
  <div class="min-h-screen font-sans flex antialiased bg-slate-50 dark:bg-[#090d16] text-slate-800 dark:text-slate-100 transition-colors duration-300">
    
    <!-- Sidebar Navigation -->
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0">
      
      <!-- Top Sticky Header -->
      <header class="h-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0d1322]/80 px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 backdrop-blur-xl transition-colors duration-300 shadow-xs">
        <div class="flex items-center gap-3.5">

          <div>
            <h1 class="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Roles Management
            </h1>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Configure permissions and access levels across system modules</p>
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
            @click="openAddRoleModal" 
            class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer active:scale-95 shadow-md shadow-blue-600/20 flex items-center gap-2"
          >
            <span class="text-sm">+</span>
            <span>Create Custom Role</span>
          </button>
          
          <button 
            @click="fetchRoles" 
            :disabled="loading"
            class="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shadow-xs active:scale-95"
            title="Refresh Roles"
          >
            <span :class="{ 'animate-spin inline-block': loading }">🔄</span>
          </button>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="p-8 space-y-6 overflow-y-auto custom-scrollbar">
        
        <!-- Non-Manager Read-Only Banner -->
        <div v-if="!isManager" class="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-2xl text-xs font-medium flex items-center gap-3">
          <span class="text-lg">🛡️</span>
          <span>You are viewing in <strong>Read-Only Mode</strong>. Only <strong>Manager</strong> accounts can modify system roles or permission matrix settings.</span>
        </div>

        <!-- System Roles Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="role in roles" 
            :key="getRoleKey(role)" 
            class="group bg-white dark:bg-[#0d1322] rounded-3xl border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <!-- Role Card Header -->
              <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-5">
                <div class="flex items-center gap-2.5">
                  <h3 class="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-wide group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase">
                    {{ role.name }}
                  </h3>
                  <span v-if="role.isSystem" class="text-[9px] bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wider">
                    Built-in
                  </span>
                </div>
                <span class="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  {{ getRoleKey(role) }}
                </span>
              </div>

              <!-- Module Permissions List -->
              <div class="space-y-2 text-xs">
                <div 
                  v-for="(modName, modKey) in moduleCatalog" 
                  :key="modKey" 
                  class="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50"
                >
                  <span class="font-bold text-slate-700 dark:text-slate-300 text-[11px]">{{ modName }}</span>
                  <span 
                    class="text-[10px] font-black uppercase px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition-all"
                    :class="{
                      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20': getPerm(role, modKey) === 'none',
                      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20': getPerm(role, modKey) === 'view',
                      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20': getPerm(role, modKey) === 'edit'
                    }"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="{
                      'bg-rose-500 dark:bg-rose-400': getPerm(role, modKey) === 'none',
                      'bg-amber-500 dark:bg-amber-400': getPerm(role, modKey) === 'view',
                      'bg-emerald-500 dark:bg-emerald-400': getPerm(role, modKey) === 'edit'
                    }"></span>
                    {{ getPermLabel(getPerm(role, modKey)) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer Actions & Assigned User Counter -->
            <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div class="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <span class="text-xs">👥</span>
                <span class="text-[11px] font-black text-slate-700 dark:text-slate-300">
                  {{ getAssignedCount(role) }} <span class="text-[10px] text-slate-400 font-medium uppercase">Assigned</span>
                </span>
              </div>

              <div class="flex items-center gap-2" v-if="isManager">
                <button 
                  @click="editRolePermissions(role)"
                  class="px-3 py-1.5 text-[11px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold rounded-xl border border-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <span>⚙️</span>
                  <span>Configure</span>
                </button>
                
                <button 
                  v-if="!role.isSystem"
                  @click="deleteCustomRole(getRoleKey(role))"
                  class="p-1.5 text-[11px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold rounded-xl border border-rose-500/20 transition-all cursor-pointer active:scale-95"
                  title="Delete Role"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>

    <!-- ================= CONFIGURE ROLE PERMISSIONS MODAL ================= -->
    <div v-if="activeRoleModal" class="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5">
        
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base">
              ⚙️
            </div>
            <div>
              <h3 class="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                {{ isCreatingRole ? 'Create Custom Role' : 'Configure Permissions' }}
              </h3>
              <p class="text-[11px] text-slate-400 mt-0.5">Set module visibility and edit access levels</p>
            </div>
          </div>
          
          <button @click="activeRoleModal = null" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 flex items-center justify-center text-xs transition-colors cursor-pointer">
            ✕
          </button>
        </div>

        <!-- Form Controls -->
        <div class="space-y-3.5 text-xs">
          <!-- Role Name Input (Creating New Role) -->
          <div v-if="isCreatingRole" class="space-y-1.5">
            <label class="font-bold text-slate-700 dark:text-slate-300 text-[11px]">Role Identifier Name *</label>
            <input 
              v-model="newRoleForm.name" 
              type="text" 
              placeholder="e.g. Inventory Controller" 
              class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-slate-100 font-bold text-xs focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <!-- Module Permissions Selectors -->
          <div v-for="(moduleName, moduleKey) in moduleCatalog" :key="moduleKey" class="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
            <div>
              <div class="font-bold text-slate-800 dark:text-slate-200 text-xs">{{ moduleName }}</div>
              <div class="text-[10px] text-slate-400 mt-0.5">Visibility & modification rights</div>
            </div>

            <select 
              v-model="modalPermissions[moduleKey]"
              class="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-[11px] rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="none" class="text-rose-500">🚫 Hide (No Access)</option>
              <option value="view" class="text-amber-500">👁️ View Only</option>
              <option value="edit" class="text-emerald-500">✏️ View & Edit Access</option>
            </select>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button @click="activeRoleModal = null" class="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-2xl transition-all cursor-pointer text-xs active:scale-95">
            Cancel
          </button>
          <button @click="saveRoleConfiguration" :disabled="saving" class="w-2/3 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-2xl uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 text-xs shadow-md shadow-blue-600/20 active:scale-95">
            {{ saving ? 'Saving Changes...' : 'Save Role Matrix' }}
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
const roles = ref([]);
const usersList = ref([]);

const activeRoleModal = ref(null);
const isCreatingRole = ref(false);

const newRoleForm = ref({ name: '' });
const modalPermissions = ref({ catalog: 'view', orders: 'edit', kiosks: 'view', users: 'none', roles: 'none' });

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

// Safely extract role key
const getRoleKey = (roleObj) => {
  return roleObj?.role_key || roleObj?.key || String(roleObj?.name || '').toLowerCase().trim();
};

const getPerm = (roleObj, modKey) => {
  if (!roleObj.permissions) return 'none';
  const perms = typeof roleObj.permissions === 'string' ? JSON.parse(roleObj.permissions) : roleObj.permissions;
  return perms[modKey] || 'none';
};

const getPermLabel = (val) => {
  if (val === 'edit') return 'View & Edit';
  if (val === 'view') return 'View Only';
  return 'Hidden';
};

// Calculate Assigned Users
const getAssignedCount = (roleObj) => {
  if (!usersList.value || !usersList.value.length) return 0;

  const targetKey = getRoleKey(roleObj).toLowerCase().trim();

  return usersList.value.filter(usr => {
    const userRoleValue = String(usr?.role || '').toLowerCase().trim();
    return userRoleValue === targetKey;
  }).length;
};

// Fetch Roles & Users List
const fetchRoles = async () => {
  loading.value = true;
  try {
    const [rolesRes, usersRes] = await Promise.all([
      fetch(`${API_BASE}/api/admin/roles`),
      fetch(`${API_BASE}/api/admin/users`)
    ]);

    if (usersRes.ok) usersList.value = await usersRes.json();
    if (rolesRes.ok) roles.value = await rolesRes.json();
  } catch (err) {
    console.error('Failed to load roles data:', err);
  } finally {
    loading.value = false;
  }
};

// Open Modals
const openAddRoleModal = () => {
  isCreatingRole.value = true;
  newRoleForm.value.name = '';
  modalPermissions.value = { catalog: 'none', orders: 'view', kiosks: 'view', users: 'none', roles: 'none' };
  activeRoleModal.value = { key: 'new' };
};

const editRolePermissions = (role) => {
  isCreatingRole.value = false;
  activeRoleModal.value = role;
  
  if (role.permissions) {
    modalPermissions.value = typeof role.permissions === 'string' ? JSON.parse(role.permissions) : { ...role.permissions };
  }
};

// Save Role Configuration
const saveRoleConfiguration = async () => {
  if (!isManager.value) return;
  saving.value = true;

  try {
    const payload = isCreatingRole.value 
      ? { name: newRoleForm.value.name, permissions: modalPermissions.value }
      : { permissions: modalPermissions.value };

    const targetKey = getRoleKey(activeRoleModal.value);
    const url = isCreatingRole.value 
      ? `${API_BASE}/api/admin/roles`
      : `${API_BASE}/api/admin/roles/${targetKey}`;

    const res = await fetch(url, {
      method: isCreatingRole.value ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      activeRoleModal.value = null;
      fetchRoles();
    }
  } catch (err) {
    console.error('Failed to save role configuration:', err);
  } finally {
    saving.value = false;
  }
};

// Delete Custom Role
const deleteCustomRole = async (roleKey) => {
  if (!confirm(`Delete role "${roleKey}"? Users with this role will default to Agent.`)) return;
  try {
    const res = await fetch(`${API_BASE}/api/admin/roles/${roleKey}`, { method: 'DELETE' });
    if (res.ok) fetchRoles();
  } catch (err) {
    console.error('Failed to delete role:', err);
  }
};

onMounted(fetchRoles);
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