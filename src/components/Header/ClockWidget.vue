<template>
  <div
    class="glass-panel rounded-3xl p-6 h-[140px] flex flex-col justify-between transition-all duration-300 hover:scale-[1.02]"
  >
    <!-- Header -->
    <div class="flex justify-between items-center">
      <span
        class="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono"
      >
        CHRONO.SYS
      </span>

      <span
        class="text-[10px] uppercase tracking-[0.2em] text-red-500 font-mono"
      >
        LIVE
      </span>
    </div>

    <!-- Time -->
    <div>
      <h2 class="text-4xl font-dot tracking-widest text-white/90">
        {{ time }}
      </h2>

      <div
        class="flex justify-between items-center mt-2 text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono"
      >
        <span>{{ day }}</span>
        <span>{{ date }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const time = ref("");
const day = ref("");
const date = ref("");

let interval;

function updateClock() {
  const now = new Date();

  time.value = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  day.value = now
    .toLocaleDateString("en-US", {
      weekday: "short",
    })
    .toUpperCase();

  const d = String(now.getDate()).padStart(2, "0");
  const m = now
    .toLocaleDateString("en-US", {
      month: "short",
    })
    .toUpperCase();

  const y = now.getFullYear();

  date.value = `${d} ${m} ${y}`;
}

onMounted(() => {
  updateClock();
  interval = setInterval(updateClock, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>