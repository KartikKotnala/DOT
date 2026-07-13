<template>
  <div class="min-h-screen bg-app text-main px-4 md:px-8 pb-6 relative">

    <div class="ambient-glow"></div>

    <!-- Header -->
    <div
      class="sticky top-0 z-50 bg-panel backdrop-blur-md
      pt-6 pb-5 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-line"
    >
      <Header class="header-card" />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <div class="md:col-span-2 nav-card">
          <Sidebar />
        </div>
        <div class="search-card">
          <SearchBar />
        </div>
      </div>

      <div class="mt-6">
        <router-link
          to="/products"
          class="inline-flex items-center text-red-400 hover:text-red-300 transition"
        >
          ← Back
        </router-link>

        <h1 v-if="currentProduct" class="text-3xl font-bold mt-2">
          {{ currentProduct.name }}
        </h1>
        <p v-if="currentProduct" class="text-muted mt-2 max-w-2xl">
          {{ currentProduct.description }}
        </p>
      </div>
    </div>

    <!-- 🌟 FIXED: Kept 5 columns but expanded spacing to gap-6 for a subtle width adjustment -->
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6 mt-5 w-full items-start"
    >
      <!-- 🌟 FIXED: Upscaled total card height to 430px for a taller look -->
      <div
        v-for="brand in filteredBrands"
        :key="brand.id"
        class="w-full h-[430px]"
      >
        <div
          @click="openBrand(brand.id)"
          class="brand-card
          opacity-0
          w-full
          cursor-pointer
          bg-panel
          border
          border-line
          rounded-2xl
          overflow-hidden
          transition-all
          duration-300
          hover:border-red-500/40
          hover:-translate-y-1.5
          flex flex-col shadow-xl shadow-black/30"
          style="height: 430px;"
        >
          <div 
            class="w-full overflow-hidden shrink-0 relative" 
            style="height: 300px; min-height: 300px; max-height: 300px;"
          >
            <img
              :src="getImageUrl(brand.image)"
              :alt="brand.name"
              class="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
            >
          </div>

          <!-- Description Text Layout Block -->
          <div class="p-4 flex-grow flex flex-col justify-start min-w-0">
            <h2 class="text-base font-bold text-main truncate w-full tracking-tight">
              {{ brand.name }}
            </h2>
            <p class="text-muted text-xs mt-1.5 line-clamp-2 leading-relaxed">
              {{ brand.description || 'Explore premium devices from this brand.' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty Array Fallback -->
    <div
      v-if="filteredBrands.length === 0"
      class="text-center py-24 text-muted/60"
    >
      No Brands Found
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import gsap from "gsap";

import Header from "@/components/Header/Header.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import SearchBar from "@/components/Search/SearchBar.vue";

const route = useRoute();
const router = useRouter();

const productList = ref([]);
const brandList = ref([]);

const searchQuery = inject("globalSearch");

onMounted(async () => {
  const tl = gsap.timeline();
  tl.from(".header-card", { opacity: 0, y: -40, duration: 0.8 })
    .from(".nav-card", { opacity: 0, x: -50, duration: 0.6 }, "-=0.3")
    .from(".search-card", { opacity: 0, x: 50, duration: 0.6 }, "-=0.6");

  try {
    const [productsResponse, brandsResponse] = await Promise.all([
      fetch("/ProductsNames.json"),
      fetch("/SubProductsBrand.json"),
    ]);

    productList.value = await productsResponse.json();
    brandList.value = await brandsResponse.json();

    await nextTick();

    if (filteredBrands.value.length > 0) {
      gsap.fromTo(".brand-card", 
        {
          opacity: 0,
          y: 20,
          scale: 0.96
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.06, 
          duration: 0.5,
          ease: "power2.out",
          force3D: true,   
          clearProps: "transform" 
        }
      );
    }
  } catch (error) {
    console.error("Error loading component data matrices:", error);
  }
});

const currentProduct = computed(() => {
  return productList.value.find(
    (product) => String(product.id) === String(route.params.id)
  );
});

const filteredBrands = computed(() => {
  return brandList.value.filter(
    (brand) => String(brand.ProductsNamesid) === String(route.params.id)
  );
});

const openBrand = (brandId) => {
  router.push(`/phone/${brandId}/directions`);
};

const getImageUrl = (imageName) => {
  try {
    return new URL(`../../assets/images/${imageName}`, import.meta.url).href;
  } catch (error) {
    console.error("Image path resolution failed:", imageName);
    return "";
  }
};
</script>