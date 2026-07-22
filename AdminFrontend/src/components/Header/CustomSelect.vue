<template>
  <div class="relative w-full" ref="dropdownRef">
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="w-full bg-panel border border-line rounded-xl px-4 py-2.5 text-sm text-main flex items-center justify-between font-medium shadow-sm transition-colors hover:bg-panel/80 focus:outline-none"
    >
      <span>{{ selectedLabel }}</span>
      <span 
        class="text-[10px] transition-transform duration-200 text-muted/60"
        :class="{ 'rotate-180': isOpen }"
      >
        ▼
      </span>
    </button>

    <div 
      v-if="isOpen"
      class="absolute top-[105%] left-0 w-full bg-panel/95 backdrop-blur-md border border-line rounded-xl mt-1 py-1.5 shadow-2xl z-50 flex flex-col max-h-[220px] overflow-y-auto custom-scrollbar animate-fade-in"
    >
      <button
        v-for="option in options"
        :key="option[valueKey]"
        type="button"
        @click="selectOption(option[valueKey])"
        class="w-full text-left px-4 py-2 text-xs font-semibold font-mono tracking-wider transition-colors"
        :class="String(option[valueKey]) === String(modelValue) 
          ? 'bg-red-600 text-white' 
          : 'text-muted hover:text-main hover:bg-white/5'"
      >
        {{ option[labelKey] }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Number], required: true },
  options: { type: Array, required: true },
  labelKey: { type: String, default: 'name' },  // The key to display (e.g., 'name' or 'label')
  valueKey: { type: String, default: 'id' },    // The key to bind data to (e.g., 'id' or 'value')
  placeholder: { type: String, default: 'Select Option' }
});

const emit = defineEmits(['update:modelValue', 'change']);

const isOpen = ref(false);
const dropdownRef = ref(null);

// Computes what text should be visible on the closed button surface
const selectedLabel = computed(() => {
  const match = props.options.find(opt => String(opt[props.valueKey]) === String(props.modelValue));
  return match ? match[props.labelKey] : props.placeholder;
});

const selectOption = (val) => {
  isOpen.value = false;
  emit('update:modelValue', val);
  emit('change', val);
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => window.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => window.removeEventListener('click', handleClickOutside));
</script>

<style scoped>
@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.animate-fade-in { animation: fadeIn 0.15s cubic-bezier(0.215, 0.610, 0.355, 1) forwards; }
</style>