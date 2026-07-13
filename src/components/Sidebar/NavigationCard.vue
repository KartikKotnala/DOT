<template>
  <button
    class="px-6 py-2 rounded-full text-xs uppercase tracking-[0.25em]
    transition-all duration-300 font-mono"

    :class="
      active
        ? 'bg-white text-main'
        : 'text-main/50 hover:text-main hover:bg-white/5'
    "
  >
    {{ title }}
  </button>
</template>

<script setup>
defineProps({
  title: String,
  active: Boolean,
});
</script>