<template>
  <!-- 
    Matches your Weather Widget specs perfectly: 
    glass-panel, h-[140px], rounded-3xl, same hovers, and flex layout 
  -->
  <div
    @click="cycleTheme"
    class="glass-panel rounded-3xl p-6 h-[140px] flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] cursor-pointer select-none group"
    :style="{ borderColor: 'var(--border-color)' }"
  >
    <!-- Header -->
    <div class="flex justify-between items-center">
      <span
        class="text-[10px] uppercase tracking-[0.3em] font-mono"
        :style="{ color: 'var(--text-muted)' }"
      >
        THEME.SYS
      </span>

      <!-- Icon shifts dynamically based on theme and uses your active --accent color glow! -->
      <component 
        :is="currentIcon" 
        class="w-5 h-5 transition-transform duration-500 group-hover:rotate-45"
        :style="{ 
          color: 'var(--accent)', 
          filter: 'drop-shadow(0 0 8px var(--accent))' 
        }" 
      />
    </div>

    <!-- Theme Information -->
    <div>
      <h2 
        class="text-xl font-dot tracking-widest uppercase truncate"
        :style="{ color: 'var(--text-main)' }"
      >
        {{ themeNames[activeTheme] }}
      </h2>

      <div class="flex justify-between items-end mt-2">
        <p class="text-[10px] uppercase tracking-wider" :style="{ color: 'var(--text-muted)' }">
          Click to Shift
        </p>

        <p
          class="text-[10px] uppercase tracking-[0.2em] font-mono"
          :style="{ color: 'var(--text-muted)' }"
        >
          SYS_v4.0
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from "vue";
import { Palette, Leaf, Waves, Sun } from "lucide-vue-next";

// Inject global active theme state channel from App.vue
const activeTheme = inject("appTheme");

const themes = ["dark", "green", "blue", "orange", "light", "light-green", "light-blue"];

// Clean display mapping names matching Nothing OS aesthetics
const themeNames = {
  dark: "Crimson Black",
  green: "Emerald Matrix",
  blue: "Cobalt Ocean",
  orange: " Cyber Orange",
  light: "Pure White",
  "light-green": "Mint Breeze",
  "light-blue": "Sky Clear"
};

// Map dynamic icons to their matching theme aesthetics
const currentIcon = computed(() => {
  if (activeTheme.value === "green" || activeTheme.value === "light-green") return Leaf;
  if (activeTheme.value === "blue" || activeTheme.value === "light-blue") return Waves;
  if (activeTheme.value === "orange" || activeTheme.value === "light") return Sun;
  return Palette; 
});

// Smoothly cycle indexes on tap
const cycleTheme = () => {
  const currentIndex = themes.indexOf(activeTheme.value);
  const nextIndex = (currentIndex + 1) % themes.length;
  activeTheme.value = themes[nextIndex];
};
</script>