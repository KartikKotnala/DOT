<template>
  <div class="min-h-screen bg-transparent text-white px-4 md:px-8 pb-6 relative">
    <div class="ambient-glow"></div>

    
    <div class="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md pt-6 pb-5 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-white/5 space-y-5">
      <Header class="header-card" />
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2 nav-card">
          <Sidebar />
        </div>
        <div class="search-card">
          <SearchBar />
        </div>
      </div>
    </div>


    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-4">
      
      <div 
        v-for="item in brands" 
        :key="item.id" 
        @click="goToSubBrand(item.id)"
        class="hero-card h-130 bg-zinc-900/50 p-7 rounded-2xl border border-white/10 flex flex-col justify-between
        transition-all duration-300 ease-out cursor-pointer
        hover:-translate-y-2 hover:border-red-500/40 hover:shadow-[0_10px_30px_rgba(239,68,68,0.1)]
        group"
      >
        <div>
          <div class="w-full h-80 mb-4">
            <BrandSlider :images="item.picture" :brandName="item.name" />
          </div>
          <h3 class="text-2xl font-bold mb-2 text-white">{{ item.name }}</h3>
          <p class="text-zinc-400 text-sm mb-4 leading-relaxed">{{ item.description }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";
import { useRouter } from "vue-router"; 

import Header from "@/components/Header/Header.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import SearchBar from "@/components/Search/SearchBar.vue";
import BrandSlider from "@/components/ProductPage/BrandSlider.vue"; 

const router = useRouter();
const brands = ref([]);

onMounted(async() => {
  const tl = gsap.timeline();
  tl.from(".header-card", { opacity: 0, y: -40, duration: 0.8 })
    .from(".nav-card", { opacity: 0, x: -50, duration: 0.6 }, "-=0.3")
    .from(".search-card", { opacity: 0, x: 50, duration: 0.6 }, "-=0.6")
    .from(".hero-card", { opacity: 0, y: 50, scale: 0.96, duration: 0.8, stagger: 0.2 }, "-=0.2");
    
  try {
    const response = await fetch('/ProductsNames.json');
    brands.value = await response.json();
  } catch(error) {
    console.error("error to load the data", error);
  }
});

const goToSubBrand = (brandId) => {
  router.push(`/product/${brandId}`);
};
</script>