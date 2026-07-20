<template>
  <div class="w-full max-w-[300px]">
    <div
      class="bg-panel
             border border-line
             rounded-3xl
             h-[140px]
             px-6
             py-5
             flex
             flex-col
             justify-between
             transition-all
             duration-300
             hover:brightness-110
             group"
    >
      <div class="flex justify-between items-center">

        <span
          class="text-[9px]
                 uppercase
                 tracking-[0.35em]
                 text-muted/40
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
                   text-muted/40
                   font-mono"
        >
            ACTIVE
          </span>

        </div>

      </div>

      <div class="flex-1 flex items-center justify-center overflow-hidden">

        <img
          :src="logo"
          alt="DOT Logo"
          :style="appTheme && appTheme.includes('light') ? 'filter: invert(1);' : ''"
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
import { inject } from "vue";
import logo from "@/assets/images/malllogo.png";

const appTheme = inject("appTheme");
</script>