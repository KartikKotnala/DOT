<template>
  
  <header class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-stretch w-full select-none">

    <!-- Logo Section -->
    <div class="flex items-center w-full">
      <Logo class="w-full" />
    </div>

    <!-- Weather Widget Section -->
    <div class="flex items-center w-full">
      <WeatherWidget class="w-full" />
    </div>

    <!-- Clock Widget Section -->
    <div class="flex items-center w-full">
      <ClockWidget class="w-full" />
    </div>

    <!-- Theme Switcher Section -->
    <div class="flex items-center w-full">
      <ThemeSwitcher class="w-full" />
    </div>

  </header>
</template>

<script setup>
import Logo from "./Logo.vue";
import WeatherWidget from "./WeatherWidget.vue";
import ClockWidget from "./ClockWidget.vue";
import ThemeSwitcher from "./ThemeSwitcher.vue";
</script>