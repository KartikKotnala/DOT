<template>
  <div class="min-h-screen bg-transparent text-white px-4 md:px-8 pb-6 relative">
    <div class="ambient-glow"></div>

    <!-- 🌟 STICKY HEADER & DESCRIPTION CONTAINER (Exactly as you fixed it) -->
    <div class="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md pt-6 pb-5 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-white/10">
      <Header class="header-card" />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <div class="md:col-span-2 nav-card">
          <Sidebar />
        </div>
        <div class="search-card">
          <SearchBar />
        </div>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 gap-4">
        <div>
          <router-link 
            to="/products" 
            class="inline-flex items-center text-red-400 font-semibold hover:text-red-300 transition-colors group text-sm"
          >
            <span class="transform group-hover:-translate-x-1 transition-transform mr-2">←</span> 
            Back to Brands Catalog
          </router-link>
          
          <h1 v-if="currentBrand" class="text-2xl font-bold text-white mt-1">
            {{ currentBrand.name }} Collection
          </h1>
        </div>

        <div class="flex items-center gap-2 sort-control bg-zinc-900/40 px-3 py-2 rounded-xl border border-white/10">
          <label for="sort" class="text-xs text-zinc-400 font-medium uppercase tracking-wider">Sort by Price:</label>
          <select 
            id="sort" 
            v-model="activeSortOption"
            class="bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer pr-2"
          >
            <option value="default" class="bg-zinc-950 text-white">Featured</option>
            <option value="low-high" class="bg-zinc-950 text-white">Low to High</option>
            <option value="high-low" class="bg-zinc-950 text-white">High to Low</option>
          </select>
        </div>
      </div>

      <p v-if="currentBrand" class="text-zinc-400 max-w-2xl text-sm leading-relaxed mt-3 brand-desc">
        {{ currentBrand.description }}
      </p>
    </div>

    <!-- Scrollable Cards Layout Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-1.5">
      
      <!-- 
        🌟 CARD INTERACTION UPDATE 
        Added cursor-pointer, @click navigation routing, and hover translate shifts.
      -->
      <div 
        v-for="phone in processedPhones" 
        :key="phone.id"
        @click="$router.push(`/phone/${phone.id}/directions`)"
        class="phone-card cursor-pointer bg-zinc-900/50 border border-white/10 p-4 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:border-red-500/40 hover:shadow-[0_10px_20px_rgba(239,68,68,0.05)] hover:-translate-y-1"
      >
        <div>
          <div class="w-full h-72 bg-zinc-800/40 rounded-xl mb-2 overflow-hidden relative border border-white/5">
            <img 
              v-if="phone.image"
              :src="getPhoneImageUrl(phone.image)" 
              :alt="phone.name" 
              class="w-full h-full object-cover object-center"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
              No Image Preview
            </div>
          </div>

          <h3 class="text-base font-bold text-white mb-0.5 tracking-tight">{{ phone.name }}</h3>
          <p class="text-[11px] text-zinc-500 mb-2">Storage: {{ phone.storage || '128GB' }}</p>
        </div>

        <div class="flex items-center justify-between mt-2 border-t border-white/5 pt-2.5">
          <span class="text-red-400 font-bold text-base">₹{{ Number(phone.price).toLocaleString('en-IN') }}</span>
          
          <!-- 🌟 @click.stop prevents card click actions from firing when buying -->
          <button 
            @click.stop
            class="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg transition-all duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>

    </div>

    <div v-if="processedPhones.length === 0" class="text-center py-20 text-zinc-500 text-sm">
      No specific smartphones matching your search filters found.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject } from 'vue';
import { useRoute } from 'vue-router';
import gsap from 'gsap';

import Header from "@/components/Header/Header.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import SearchBar from "@/components/Search/SearchBar.vue";

const route = useRoute();
const brandList = ref([]);
const phoneList = ref([]);
const activeSortOption = ref('default');

const searchQuery = inject("globalSearch");

onMounted(async () => {
  const tl = gsap.timeline();
  tl.from(".header-card", { opacity: 0, y: -40, duration: 0.8 })
    .from(".nav-card", { opacity: 0, x: -50, duration: 0.6 }, "-=0.3")
    .from(".search-card", { opacity: 0, x: 50, duration: 0.6 }, "-=0.6")
    .from(".sort-control", { opacity: 0, y: 20, duration: 0.4 }, "-=0.2")
    .from(".phone-card", { opacity: 0, y: 40, scale: 0.98, duration: 0.6, stagger: 0.1 }, "-=0.2");

  try {
    const [brandResponse, phoneResponse] = await Promise.all([
      fetch('/brand.json'),
      fetch('/phone.json') 
    ]);

    brandList.value = await brandResponse.json();
    phoneList.value = await phoneResponse.json();
  } catch (error) {
    console.error("Failed to load catalog datasets:", error);
  }
});

const currentBrand = computed(() => {
  const currentId = route.params.id;
  if (!currentId) return null;

  if (String(currentId).startsWith('p')) {
    const targetPhone = phoneList.value.find(p => String(p.id) === String(currentId));
    if (targetPhone) {
      return brandList.value.find(b => String(b.id) === String(targetPhone.brandId));
    }
  }

  return brandList.value.find(b => String(b.id) === String(currentId));
});

const processedPhones = computed(() => {
  const currentId = route.params.id;
  if (!currentId) return [];

  let list = [];

  if (String(currentId).startsWith('p')) {
    list = phoneList.value.filter(phone => String(phone.id) === String(currentId));
  } else {
    list = phoneList.value.filter(phone => String(phone.brandId) === String(currentId));
  }
  
  if (searchQuery && searchQuery.value) {
    const term = searchQuery.value.toLowerCase().trim();
    list = list.filter(phone => phone.name.toLowerCase().includes(term));
  }
  
  if (activeSortOption.value === 'low-high') {
    return [...list].sort((itemA, itemB) => itemA.price - itemB.price);
  }
  
  if (activeSortOption.value === 'high-low') {
    return [...list].sort((itemA, itemB) => itemB.price - itemA.price);
  }
  
  return list;
});

const getPhoneImageUrl = (imageName) => {
  try {
    return new URL(`../../assets/images/${imageName}`, import.meta.url).href;
  } catch (error) {
    console.error("Image path resolution failed:", imageName);
    return "";
  }
};
</script>