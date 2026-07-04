<template>
  <!-- 
    We use a template ref "searchContainer" to calculate exactly 
    where the dropdown should float on your viewport window 
  -->
  <div ref="searchContainer" class="animate-card relative w-full z-50">
    <!-- Search Input -->
    <input
      v-model="searchQuery"
      @focus="openDropdown"
      @blur="handleBlur"
      type="text"
      placeholder="Search Products..."
      class="w-full glass-panel
      rounded-full
      py-3
      pl-5
      pr-12
      text-sm
      placeholder:text-white/30
      outline-none
      transition-all
      duration-300
      focus:border-white"
      :style="{ color: 'var(--text-main)' }"
    />

    <Search
      class="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
    />

    <!-- 🌟 TELEPORT ENGINE: Shoots the dropdown to the bottom of <body> so it can't get blocked -->
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
          zIndex: '999999' /* High layer stack override code */
        }"
      >
        <ul>
          <li 
            v-for="item in suggestions" 
            :key="item.uniqueId"
            @mousedown="selectSuggestion(item)"
            class="px-5 py-3 hover:bg-white/5 cursor-pointer transition-colors flex items-center justify-between text-sm border-b last:border-0"
            :style="{ borderColor: 'var(--border-color)' }"
          >
            <span class="font-medium" :style="{ color: 'var(--text-main)' }">{{ item.name }}</span>
            
            <span 
              class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border"
              :style="{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                color: 'var(--accent)',
                borderColor: 'var(--border-color)'
              }"
            >
              {{ item.type }}
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
const brandList = ref([]);
const phoneList = ref([]);

// References to handle layout sizing calculations smoothly
const searchContainer = ref(null);
const dropdownStyles = ref({ top: '0px', left: '0px', width: '0px' });

// Track where the input box is in real viewport space
const updateDropdownPosition = () => {
  if (searchContainer.value) {
    const rect = searchContainer.value.getBoundingClientRect();
    dropdownStyles.value = {
      top: `${rect.bottom + window.scrollY + 8}px`, // Locks box slightly below input area border
      left: `${rect.left + window.scrollX}px`,
      width: `${rect.width}px` // Forces dropdown width matching input boundary tracking length
    };
  }
};

const openDropdown = () => {
  isFocused.value = true;
  updateDropdownPosition();
};

onMounted(async () => {
  // Listen to window size shifts or page scroll position alterations to reposition dropdown anchor point
  window.addEventListener('resize', updateDropdownPosition);
  window.addEventListener('scroll', updateDropdownPosition);

  try {
    const [brandResponse, phoneResponse] = await Promise.all([
      fetch('/brand.json'),
      fetch('/phone.json') 
    ]);
    brandList.value = await brandResponse.json();
    phoneList.value = await phoneResponse.json();
  } catch (error) {
    console.error("Failed to load search index matrices:", error);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateDropdownPosition);
  window.removeEventListener('scroll', updateDropdownPosition);
});

// SMART LIVE FILTER LOGIC 
const suggestions = computed(() => {
  const query = searchQuery.value ? searchQuery.value.toLowerCase().trim() : '';
  if (!query) return [];

  const queryWords = query.split(/\s+/).filter(word => word.length > 0);
  if (queryWords.length === 0) return [];

  const results = [];

  // 1. Safe Brand Matching
  if (Array.isArray(brandList.value)) {
    brandList.value.forEach(brand => {
      if (!brand || !brand.name) return;
      const brandNameLower = brand.name.toLowerCase();
      const isMatch = queryWords.every(word => brandNameLower.includes(word));
      
      if (isMatch) {
        results.push({ uniqueId: `brand-${brand.id}`, id: brand.id, name: brand.name, type: 'brand' });
      }
    });
  }

  // 2. Safe Product Matching + Smart Brand Cross-Referencing
  if (Array.isArray(phoneList.value)) {
    phoneList.value.forEach(phone => {
      if (!phone || !phone.name) return;
      
      const phoneNameLower = phone.name.toLowerCase();
      
      // Look up the brand name associated with this phone's brandId
      const matchedBrand = brandList.value?.find(b => String(b.id) === String(phone.brandId));
      const associatedBrandName = matchedBrand?.name?.toLowerCase() || '';

      // Match if query words exist in the product name OR its parent brand name
      const isMatch = queryWords.every(word => 
        phoneNameLower.includes(word) || associatedBrandName.includes(word)
      );

      if (isMatch) {
        results.push({ 
          uniqueId: `phone-${phone.id}`, 
          id: phone.id, // ✨ FIX: Changed from phone.brandId to phone.id to isolate the exact item
          name: phone.name, 
          type: 'device' 
        });
      }
    });
  }

  // Re-calculate location box coordinates every time results mutate live
  nextTick(updateDropdownPosition);
  return results.slice(0, 6);
});

// Handle item selection when dropdown choice is clicked
const selectSuggestion = (item) => {
  router.push(`/product/${item.id}`);
  searchQuery.value = '';
  isFocused.value = false;
};

const handleBlur = () => {
  setTimeout(() => {
    isFocused.value = false;
  }, 200);
};
</script>