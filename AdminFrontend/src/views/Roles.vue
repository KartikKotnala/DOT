<template>
  <div class="min-h-screen bg-[#f0f2f5] text-slate-800 font-sans flex">
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-sm">
        <h1 class="text-sm font-bold text-slate-700 uppercase tracking-wider">Roles & Staff Permissions</h1>
      </header>

      <main class="p-8">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 class="text-base font-bold text-slate-800 mb-2">Access Control</h2>
          <p class="text-xs text-slate-500">Manage admin, manager, and kiosk staff roles.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/layout/Sidebar.vue';
</script>