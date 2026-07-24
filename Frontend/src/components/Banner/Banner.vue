<template>
  <div
    class="animate-card glass-panel group rounded-3xl p-6 h-[420px] relative overflow-hidden transition-all duration-300 hover:scale-[1.01]"
  >
    <div class="absolute inset-0 z-0">
      <Transition name="fade">
        <img
          :src="images[currentImage]"
          :key="currentImage"
          class="absolute inset-0 w-full h-full object-cover opacity-40 will-change-transform animate-ken-burns"
          loading="eager"
        />
      </Transition>
    </div>

    <div
      class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"
    ></div>

    <div
      class="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-5 z-20"
    >
      <button
        @click="previousSlide"
        class="w-11 h-11 rounded-full bg-app/50 backdrop-blur-md border border-line
               text-main flex items-center justify-center
               opacity-0 group-hover:opacity-100
               transition-all duration-300
               hover:bg-red-500 hover:border-red-500 hover:scale-110 cursor-pointer focus:outline-none"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>

      <button
        @click="nextSlide"
        class="w-11 h-11 rounded-full bg-app/50 backdrop-blur-md border border-line
               text-main flex items-center justify-center
               opacity-0 group-hover:opacity-100
               transition-all duration-300
               hover:bg-red-500 hover:border-red-500 hover:scale-110 cursor-pointer focus:outline-none"
      >
        <ChevronRight class="w-5 h-5" />
      </button>
    </div>

    <div class="relative z-20 h-full flex flex-col justify-between select-none">

      <div class="flex justify-between">
        <span class="text-[10px] uppercase tracking-[0.3em] text-main/50 font-mono">
          PRODUCT INDEX
        </span>
        <span class="text-xs text-main/30 font-mono">
          0{{ currentImage + 1 }}/0{{ images.length }}
        </span>
      </div>

      <div>
        <h2 class="text-4xl font-dot tracking-widest text-main/90 mb-2 uppercase">
          Mall EXPERIENCE
        </h2>

        <p class="text-main/60 max-w-md">
          Every visit brings new experiences, exciting brands, and lasting memories.
        </p>

        <div class="flex gap-2 mt-6">
          <button
            v-for="(_, index) in images"
            :key="index"
            @click="currentImage = index"
            class="h-1 rounded-full transition-all duration-300 cursor-pointer focus:outline-none"
            :class="
              currentImage === index
                ? 'w-8 bg-red-500'
                : 'w-2 bg-white/20 hover:bg-white/50'
            "
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

import img1 from "@/assets/images/dominos.jpg";
import img2 from "@/assets/images/images-2.jpeg";
import img3 from "@/assets/images/images-3.jpeg";
import img4 from "@/assets/images/images-4.jpeg";
import img5 from "@/assets/images/images-5.jpeg";
import img6 from "@/assets/images/images-6.jpeg";

const images = [img1, img2, img3, img4, img5, img6];
const currentImage = ref(0);

function nextSlide() {
  currentImage.value = (currentImage.value + 1) % images.length;
}

function previousSlide() {
  currentImage.value = (currentImage.value - 1 + images.length) % images.length;
}

let interval;

onMounted(() => {
  interval = setInterval(() => {
    nextSlide();
  }, 4000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style scoped>
/* 🌟 NEW: CSS Crossfade parameters prevent resolution redraw rendering blurs */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>