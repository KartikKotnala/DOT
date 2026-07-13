<template>
  <div class="relative w-full z-50">
    <div class="relative w-full group">
      <input
        ref="inputRef"
        v-model="searchQuery"
        @focus="openDropdown"
        @blur="handleBlur"
        @keydown.down.prevent="navigateSuggestions(1)"
        @keydown.up.prevent="navigateSuggestions(-1)"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.esc="clearSearch"
        type="text"
        placeholder="Search Products..."
        class="w-full glass-panel rounded-full py-3 pl-5 pr-24 text-sm placeholder:text-main/30 outline-none transition-all duration-300 focus:border-white"
        :style="{ color: 'var(--text-main)' }"
      />

      <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <button
          type="button"
          @click.stop="toggleVirtualKeyboard"
          class="p-1.5 rounded-lg border transition-all duration-200 flex items-center justify-center group/btn cursor-pointer"
          :class="showKeyboard 
            ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
            : 'bg-white/5 border-line/40 text-muted hover:text-main hover:border-line'"
          title="Toggle Screen Keyboard (Shortcut: K)"
        >
          <span class="text-xs font-mono font-bold leading-none">⌨️</span>
        </button>
        <Search class="w-4 h-4 text-main/40" />
      </div>
    </div>

    <div 
      v-if="showKeyboard"
      class="absolute top-[115%] left-0 w-full glass-panel rounded-2xl p-4 shadow-2xl flex flex-col gap-1.5 font-mono z-[999999]"
      style="background: var(--panel-bg); border-color: var(--border-color); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);"
      @mousedown.prevent
    >
      <div v-for="(row, rIdx) in keyboardRows" :key="rIdx" class="flex justify-center gap-1 w-full">
        <button
          v-for="key in row"
          :key="key"
          type="button"
          @click="handleVirtualKeyPress(key)"
          class="flex-1 py-2 text-xs font-bold rounded-lg border border-line/40 bg-white/[0.02] text-muted hover:text-main hover:border-red-500/40 hover:bg-red-500/5 transition-none min-w-[24px] select-none cursor-pointer"
          :class="{
            'flex-[2.5] bg-white/5': key === 'Backspace',
            'flex-[4] bg-white/5': key === 'Space',
            'flex-[2] bg-red-500/10 border-red-500/30 text-red-400': key === 'Clear'
          }"
        >
          {{ key === 'Space' ? '⎵' : key === 'Backspace' ? '⌫' : key }}
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div 
        v-if="isFocused && suggestions.length > 0"
        class="fixed rounded-2xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto backdrop-blur-md border"
        :style="{ 
          backgroundColor: 'var(--panel-bg)', 
          borderColor: 'var(--border-color)',
          boxShadow: '0 20px 40px var(--panel-glow)',
          top: dropdownStyles.top,
          left: dropdownStyles.left,
          width: dropdownStyles.width,
          zIndex: '999998'
        }"
      >
        <ul>
          <li 
            v-for="(item, index) in suggestions" 
            :key="item.uniqueId"
            @mousedown="selectSuggestion(item)"
            @mouseover="highlightedIndex = index"
            class="px-5 py-3 cursor-pointer transition-colors flex items-center justify-between text-sm border-b last:border-0"
            :class="index === highlightedIndex ? 'bg-white/10' : 'hover:bg-white/5'"
            :style="{ borderColor: 'var(--border-color)' }"
          >
            <span class="font-medium" :style="{ color: 'var(--text-main)' }">
              {{ item.name }}
            </span>
            
            <span 
              class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border flex items-center gap-1.5"
              :style="{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                color: index === highlightedIndex ? 'var(--text-main)' : 'var(--accent)',
                borderColor: 'var(--border-color)'
              }"
            >
              <span>{{ item.type === 'category' ? '📁' : item.type === 'brand' ? '🏷️' : '📱' }}</span>
              <span>{{ item.type }}</span>
            </span>
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, inject, computed, onMounted, nextTick, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { Search } from "lucide-vue-next";

const router = useRouter();
const searchQuery = inject("globalSearch");

const isFocused = ref(false);
const showKeyboard = ref(false); 
const highlightedIndex = ref(-1); 
const inputRef = ref(null);

const categoryList = ref([]);
const brandList = ref([]);
const deviceList = ref([]);

const dropdownStyles = ref({ top: '-9999px', left: '-9999px', width: '0px' }); 

const keyboardRows = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Backspace'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Space', 'Clear']
];

// Re-calculated positions *only* for the dropdown suggestion box tracking layer
const updateDropdownPosition = () => {
  if (inputRef.value) {
    const rect = inputRef.value.getBoundingClientRect();
    // Offset suggestion box down if virtual keyboard is active (~175px tall)
    const suggestionsOffset = showKeyboard.value ? rect.bottom + 175 : rect.bottom;
    dropdownStyles.value = {
      top: `${suggestionsOffset + window.scrollY + 8}px`,
      left: `${rect.left + window.scrollX}px`,
      width: `${rect.width}px`
    };
  }
};

const openDropdown = () => {
  isFocused.value = true;
  updateDropdownPosition();
};

const toggleVirtualKeyboard = () => {
  showKeyboard.value = !showKeyboard.value;
  isFocused.value = true;
  nextTick(() => {
    inputRef.value?.focus();
    updateDropdownPosition();
  });
};

const handleVirtualKeyPress = (key) => {
  if (key === 'Backspace') {
    searchQuery.value = searchQuery.value.slice(0, -1);
  } else if (key === 'Clear') {
    searchQuery.value = '';
  } else if (key === 'Space') {
    searchQuery.value += ' ';
  } else {
    searchQuery.value += key.toLowerCase();
  }
  highlightedIndex.value = -1;
  isFocused.value = true;
  nextTick(updateDropdownPosition);
};

const navigateSuggestions = (direction) => {
  if (!suggestions.value.length) return;
  highlightedIndex.value = (highlightedIndex.value + direction + suggestions.value.length) % suggestions.value.length;
};

const selectHighlighted = () => {
  if (highlightedIndex.value >= 0 && highlightedIndex.value < suggestions.value.length) {
    selectSuggestion(suggestions.value[highlightedIndex.value]);
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  showKeyboard.value = false;
  highlightedIndex.value = -1;
};

const handleSystemKeys = (event) => {
  if (event.key.toLowerCase() === 'k' && document.activeElement !== inputRef.value) {
    event.preventDefault();
    toggleVirtualKeyboard();
  }
};

onMounted(async () => {
  window.addEventListener('resize', updateDropdownPosition);
  window.addEventListener('scroll', updateDropdownPosition);
  window.addEventListener('keydown', handleSystemKeys);

  try {
    const [catResponse, brandResponse, devResponse] = await Promise.all([
      fetch('/ProductsNames.json'),
      fetch('/SubProductsBrand.json'),
      fetch('/SubProducts.json') 
    ]);
    categoryList.value = await catResponse.json();
    brandList.value = await brandResponse.json();
    deviceList.value = await devResponse.json();
  } catch (error) {
    console.error("Failed to load search index matrices:", error);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateDropdownPosition);
  window.removeEventListener('scroll', updateDropdownPosition);
  window.removeEventListener('keydown', handleSystemKeys);
});

const suggestions = computed(() => {
  const query = searchQuery.value ? searchQuery.value.toLowerCase().trim() : '';
  if (!query) return [];

  const queryWords = query.split(/\s+/).filter(word => word.length > 0);
  if (queryWords.length === 0) return [];

  const results = [];

  if (Array.isArray(categoryList.value)) {
    categoryList.value.forEach(cat => {
      if (!cat || !cat.name) return;
      if (queryWords.every(word => cat.name.toLowerCase().includes(word))) {
        results.push({ uniqueId: `cat-${cat.id}`, id: cat.id, name: cat.name, type: 'category' });
      }
    });
  }

  if (Array.isArray(brandList.value)) {
    brandList.value.forEach(brand => {
      if (!brand || !brand.name) return;
      if (queryWords.every(word => brand.name.toLowerCase().includes(word))) {
        results.push({ uniqueId: `brand-${brand.id}`, id: brand.id, name: brand.name, type: 'brand' });
      }
    });
  }

  if (Array.isArray(deviceList.value)) {
    deviceList.value.forEach(device => {
      if (!device || !device.name) return;
      const matchedBrand = brandList.value?.find(b => String(b.id) === String(device.brandId));
      const associatedBrandName = matchedBrand?.name?.toLowerCase() || '';

      const isMatch = queryWords.every(word => 
        device.name.toLowerCase().includes(word) || associatedBrandName.includes(word)
      );

      if (isMatch) {
        results.push({ uniqueId: `device-${device.id}`, id: device.id, name: device.name, type: 'device' });
      }
    });
  }

  nextTick(updateDropdownPosition);
  return results.slice(0, 6);
});

const selectSuggestion = (item) => {
  if (item.type === 'category') {
    router.push(`/product/${item.id}`);
  } else {
    router.push(`/phone/${item.id}/directions`);
  }
  searchQuery.value = '';
  isFocused.value = false;
  showKeyboard.value = false;
  highlightedIndex.value = -1;
};

const handleBlur = () => {
  setTimeout(() => {
    isFocused.value = false;
  }, 250);
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }
</style>