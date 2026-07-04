<template>
  <div class="w-full h-full relative overflow-hidden bg-zinc-800 rounded-xl border" :style="{ borderColor: 'var(--border-color)' }">
    
    <TransitionGroup name="slide" v-if="images && images.length > 0">
      <div 
        v-for="(img, idx) in images" 
        v-show="idx === activeIndex"
        :key="img"
        class="absolute inset-0 w-full h-full"
      >
        <img 
          :src="getImageUrl(img)" 
          :alt="brandName" 
          class="w-full h-full object-cover object-center" 
        />
      </div>
    </TransitionGroup>
    
    <div v-else class="w-full h-full flex items-center justify-center text-zinc-500 text-sm">
      No Image Available
    </div>

    <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
      <span 
        v-for="(img, idx) in images" 
        :key="idx"
        :class="[
          'w-1.5 h-1.5 rounded-full transition-all duration-300'
        ]"
        :style="{
          backgroundColor: idx === activeIndex ? 'var(--accent)' : 'rgba(255, 255, 255, 0.25)',
          transform: idx === activeIndex ? 'scale(1.2)' : 'scale(1)'
        }"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  images: { type: Array, required: true },
  brandName: { type: String, required: true }
});

const activeIndex = ref(0);
let slideTimer = null;

onMounted(() => {
  if (props.images && props.images.length > 1) {
    slideTimer = setInterval(() => {
      if (activeIndex.value < props.images.length - 1) {
        activeIndex.value++;
      } else {
        activeIndex.value = 0; 
      }
    }, 3000);
  }
});

onBeforeUnmount(() => {
  if (slideTimer) clearInterval(slideTimer);
});

const getImageUrl = (imageName) => {
  try {
    return new URL(`../../assets/images/${imageName}`, import.meta.url).href;
  } catch (error) {
    console.error("Slider could not resolve asset filename:", imageName);
    return "";
  }
};
</script>

<style scoped>
/* THE LEFT-TO-RIGHT SLIDE TIMELINE RULES */

/* 1. Incoming image starts completely hidden over on the left side (-100%) */
.slide-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

/* 2. Outgoing image slides all the way out to the right side (100%) */
.slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}


.slide-enter-active,
.slide-leave-active {
  transition: transform 0.65s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease;
}


.slide-leave-active {
  position: absolute;
}
</style>