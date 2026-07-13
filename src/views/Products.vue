<template>
  <div class="min-h-screen bg-app text-main px-4 md:px-8 pb-6 relative">
    <div class="ambient-glow"></div>

    
    <div class="sticky top-0 z-50 bg-panel backdrop-blur-md pt-6 pb-5 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-line space-y-5">
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
        class="hero-card h-130 bg-panel p-7 rounded-[2rem] border border-line flex flex-col justify-between
        transition-all duration-500 ease-out cursor-pointer relative overflow-hidden
        hover:-translate-y-3 hover:border-red-500/50 hover:shadow-[0_20px_40px_-10px_rgba(239,68,68,0.25)]
        hover:bg-gradient-to-b hover:from-panel hover:to-red-500/5 group"
      >
        <div>
          <div class="w-full h-80 mb-4">
            <BrandSlider :images="item.picture" :brandName="item.name" />
          </div>
          <h3 class="text-2xl font-bold mb-2 text-main">{{ item.name }}</h3>
          <p class="text-muted text-sm mb-4 leading-relaxed">{{ item.description }}</p>
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