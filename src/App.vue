<template>
  <div :data-theme="currentTheme" class="theme-wrapper min-h-screen">
    <RouterView v-slot="{ Component, route }">
      <Transition
        name="page"
        mode="out-in"
      >
        <component
          :is="Component"
          :key="route.fullPath"
        />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import { ref, provide, watch } from "vue";

// 1. Search Query Provider
const searchQuery = ref("");
provide("globalSearch", searchQuery);

// 🌟 2. THEME STATE ENGINE: Fallback to 'dark' if local storage hasn't saved a choice yet
const currentTheme = ref(localStorage.getItem("app-theme") || "dark");

// 🌟 3. REACTIVE WATCHER: Updates the document body attributes and local storage on updates
watch(currentTheme, (newTheme) => {
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("app-theme", newTheme);
}, { immediate: true });

// 🌟 4. THEME PROVIDER CHANNEL: Share changing capacity down to the ThemeSwitcher widget
provide("appTheme", currentTheme);
</script>

<style>
/* 🌟 Smoothly transitions background repaints across theme switches */
.theme-wrapper {
  background-color: var(--bg-app);
  color: var(--text-main);
  transition: background-color 0.4s ease, color 0.3s ease;
}

/* Page View Transition Animations */
.page-enter-active,
.page-leave-active {
  transition: all .35s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>