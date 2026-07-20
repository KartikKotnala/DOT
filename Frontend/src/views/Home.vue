<template>
  <div class="min-h-screen bg-app text-main px-4 md:px-8 py-6 relative">
    <div class="ambient-glow"></div>

    <Header class="header-card" />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
      <div class="md:col-span-2 nav-card">
        <Sidebar />
      </div>

      <div class="search-card relative z-50">
        <SearchBar />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 relative z-10">
      <div class="hero-card">
        <Banner />
      </div>

      <div id="video-player-root" class="hero-card">
        <Teleport to="#teleport-video-target" :disabled="!isMounted">
          <VideoPlayer />
        </Teleport>
      </div>
    </div>

    <div id="teleport-video-target" class="contents"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";

import Header from "@/components/Header/Header.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import SearchBar from "@/components/Search/SearchBar.vue";
import Banner from "@/components/Banner/Banner.vue";
import VideoPlayer from "@/components/Video/VideoPlayer.vue";

// Staging mount flag to make sure Teleport doesn't fire until DOM nodes are safe
const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;

  const tl = gsap.timeline();
  tl.from(".header-card", {
    opacity: 0,
    y: -40,
    duration: 0.8,
  })
  .from(".nav-card", {
    opacity: 0,
    x: -50,
    duration: 0.6,
  }, "-=0.3")
  .from(".search-card", {
    opacity: 0,
    x: 50,
    duration: 0.6,
  }, "-=0.6")
  .from(".hero-card", {
    opacity: 0,
    y: 50,
    scale: 0.96,
    duration: 0.8,
    stagger: 0.2,
  }, "-=0.2");
});
</script>