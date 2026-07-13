<template>
  <kbd 
    class="inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold font-mono text-muted/60 bg-white/[0.03] border border-line/50 rounded-md shadow-sm pointer-events-none uppercase tracking-wider scale-90 group-hover:border-red-500/40 group-hover:text-red-400 transition-colors duration-150 select-none"
  >
    {{ label }}
  </kbd>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

// Define configuration properties
const props = defineProps({
  label: { 
    type: String, 
    required: true 
  },
  bindKey: { 
    type: String, 
    required: false,
    default: '' // Optional physical hardware key connection parameter
  }
});

// Define output emission signals
const emit = defineEmits(['trigger']);

// Core keyboard event parsing pipeline listener
const handlePhysicalKeydown = (event) => {
  if (!props.bindKey) return;

  // Standardize string comparison keys (e.g., matching "Escape" or "Enter" neatly)
  if (event.key.toLowerCase() === props.bindKey.toLowerCase()) {
    event.preventDefault();
    emit('trigger'); // Fire execution trigger event line straight up to parent
  }
};

onMounted(() => {
  if (props.bindKey) {
    window.addEventListener('keydown', handlePhysicalKeydown);
  }
});

onBeforeUnmount(() => {
  if (props.bindKey) {
    window.removeEventListener('keydown', handlePhysicalKeydown);
  }
});
</script>

<style scoped>
/* Scoped modifications to isolate font parameters strictly inside the element block */
kbd {
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
}
</style>