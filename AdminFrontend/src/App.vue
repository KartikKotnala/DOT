<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useTheme } from '@/composables/useTheme';

const { initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
</script>