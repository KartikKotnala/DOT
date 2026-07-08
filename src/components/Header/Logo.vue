<template>
  <div class="w-full max-w-[300px]">
    <div
      class="bg-[#111111]
             border border-[#222222]
             rounded-3xl
             h-[140px]
             px-6
             py-5
             flex
             flex-col
             justify-between
             transition-all
             duration-300
             hover:border-white/20
             group"
    >
      <!-- Top Row -->
      <div class="flex justify-between items-center">

        <span
          class="text-[9px]
                 uppercase
                 tracking-[0.35em]
                 text-white/30
                 font-mono"
        >
          SYSTEM.LOGO
        </span>

        <div class="flex items-center gap-2">

          <span
            class="w-2 h-2 rounded-full bg-red-500 animate-pulse"
          ></span>

          <span
            class="text-[9px]
                   uppercase
                   tracking-[0.30em]
                   text-white/25
                   font-mono"
          >
            ACTIVE
          </span>

        </div>

      </div>

      <!-- Logo -->
      <div class="flex-1 flex items-center justify-center overflow-hidden">

        <img
          :src="logo"
          alt="DOT Logo"
          class="h-20
                 w-auto
                 object-contain
                 transition-all
                 duration-300
                 group-hover:scale-105"
        />

      </div>

    </div>
  </div>
</template>

<script setup>
import logo from "@/assets/images/malllogo.png";
</script>