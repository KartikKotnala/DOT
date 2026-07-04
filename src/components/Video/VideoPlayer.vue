<template>
<div
  class="animate-card glass-panel rounded-3xl p-4 h-[420px] flex flex-col transition-all duration-300 hover:scale-[1.01]"

  @mouseenter="showControls = true"
  @mouseleave="showControls = false"
>
  <!-- Video -->
  <video
    ref="videoPlayer"
    class="w-full h-full object-cover"
    autoplay
    muted
    loop
    playsinline
  >
    <source :src="showcaseVideo" type="video/mp4" />
  </video>

  <!-- Overlay -->
  <div class="absolute inset-0 bg-black/25"></div>

  <!-- Controls -->
  <Transition name="fade">
    <div
      v-if="showControls || !isPlaying"
      class="absolute inset-0 flex items-center justify-center"
    >
      <button
        @click="toggleVideo"
        class="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black hover:scale-110 transition-all duration-300"
      >
        <Play
          v-if="!isPlaying"
          class="w-6 h-6 fill-current ml-1"
        />

        <Pause
          v-else
          class="w-6 h-6 fill-current"
        />
      </button>
    </div>
  </Transition>
</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Play, Pause, Aperture } from "lucide-vue-next";
import showcaseVideo from "@/assets/videos/video.mp4";

const videoPlayer = ref(null);

const isPlaying = ref(true);
const showControls = ref(false);

function toggleVideo() {
  if (!videoPlayer.value) return;

  if (videoPlayer.value.paused) {
    videoPlayer.value.play();
    isPlaying.value = true;
  } else {
    videoPlayer.value.pause();
    isPlaying.value = false;
  }
}

onMounted(() => {
  if (videoPlayer.value) {
    videoPlayer.value.play();

    videoPlayer.value.addEventListener("play", () => {
      isPlaying.value = true;
    });

    videoPlayer.value.addEventListener("pause", () => {
      isPlaying.value = false;
    });
  }
});
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all .25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(.8);
}
</style>