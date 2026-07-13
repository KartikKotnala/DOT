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
          v-if="currentBrand"
          :to="`/product/${currentBrand.ProductsNamesid}`"
          class="inline-flex items-center text-red-400 hover:text-red-300 transition"
        >
          ← Back 
        </router-link>

        <h1 v-if="currentBrand" class="text-3xl font-bold mt-2">
          {{ currentBrand.name }} 
        </h1>
        <p class="text-muted mt-2 max-w-2xl text-sm">
          Select a specific product to see its location on the mall map.
        </p>
      </div>
    </div>

    <!-- SubProduct Cards Layout Grid Track Container -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5 w-full items-start"
    >
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        @click="openProduct(product.id)"
        class="product-card w-full cursor-pointer bg-panel border border-line rounded-2xl overflow-hidden transition-all duration-300 hover:border-red-500/40 hover:-translate-y-1 flex flex-col"
        style="height: 380px;"
      >
        <!-- Item Graphic Blueprint Frame Container -->
        <div 
          class="w-full overflow-hidden shrink-0 bg-white p-4 flex items-center justify-center" 
          style="height: 220px; min-height: 220px; max-height: 220px;"
        >
          <img
            :src="getImageUrl(product.image)"
            :alt="product.name"
            class="w-auto h-auto max-w-full max-h-full object-contain"
          >
        </div>

        <!-- Meta Text Details Panel Description Content -->
        <div class="p-4 flex-grow flex flex-col justify-start overflow-hidden">
          <h2 class="text-base font-bold text-main truncate w-full">
            {{ product.name }}
          </h2>

          <p v-if="product.price" class="text-red-400 text-sm mt-1 font-mono font-semibold">
            ₹{{ Number(product.price).toLocaleString('en-IN') }}
          </p>
          
          <p class="text-muted text-xs mt-2 line-clamp-3 leading-relaxed">
            {{ product.description || 'Premium smartphone device.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Empty Array Fallback Display Indicator -->
    <div
      v-if="filteredProducts.length === 0"
      class="text-center py-24 text-muted/60 text-sm"
    >
      No Products Found
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

const brandList = ref([]);
const subProductList = ref([]);

const searchQuery = inject("globalSearch");

onMounted(async () => {
  // 1. Instantly run static base interface framework structural entries
  const tl = gsap.timeline();
  tl.from(".header-card", { opacity: 0, y: -40, duration: 0.8 })
    .from(".nav-card", { opacity: 0, x: -50, duration: 0.6 }, "-=0.3")
    .from(".search-card", { opacity: 0, x: 50, duration: 0.6 }, "-=0.6");

  try {
    const [brandsResponse, subProductsResponse] = await Promise.all([
      fetch("/SubProductsBrand.json"),
      fetch("/SubProducts.json"),
    ]);

    brandList.value = await brandsResponse.json();
    subProductList.value = await subProductsResponse.json();

    // 🌟 2. AUTOMATIC ROUTING CHECK
    // If there are no products, OR the only product found matches the brand ID,
    // skip the grid completely and go straight to the map directions.
    if (
      filteredProducts.value.length === 0 || 
      (filteredProducts.value.length === 1 && filteredProducts.value[0].id === route.params.id)
    ) {
      openProduct(route.params.id);
      return; // Stop right here so the code below doesn't run!
    }

    // 3. Wait for Vue to fully complete layout updates for newly pushed loops
    await nextTick();

    // 4. Run explicit fromTo timeline mapping for sub-products
    if (filteredProducts.value.length > 0) {
      gsap.fromTo(".product-card", 
        { 
          opacity: 0, 
          y: 30, 
          scale: 0.99 
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          stagger: 0.08, 
          duration: 0.5, 
          clearProps: "all" 
        }
      );
    }
  } catch (error) {
    console.error("Error loading component data matrices:", error);
  }
});

const currentBrand = computed(() => {
  return brandList.value.find(
    (brand) => String(brand.id) === String(route.params.id)
  );
});

const filteredProducts = computed(() => {
  let list = subProductList.value.filter(
    (product) => String(product.brandId) === String(route.params.id)
  );

  if (searchQuery?.value) {
    const term = searchQuery.value.toLowerCase().trim();
    list = list.filter((product) => product.name.toLowerCase().includes(term));
  }
  return list;
});

const openProduct = (productId) => {
  router.push(`/phone/${productId}/directions`);
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