
<template>
  <Transition name="pop-fade">
    <div 
      v-if="totalItemCount > 0 && route.path !== '/cart'"
      @click="goToCart"
      class="fixed bottom-6 right-6 z-[300] bg-red-600 hover:bg-red-500 text-white p-4 rounded-2xl shadow-[0_15px_30px_rgba(239,68,68,0.4)] flex items-center gap-3 cursor-pointer border border-red-400 backdrop-blur-xl transition-all duration-300 transform active:scale-95 group select-none"
    >
      <div class="relative">
        <span class="text-2xl group-hover:scale-110 transition-transform block">🛒</span>
        <span class="absolute -top-2 -right-2 bg-white text-red-600 font-mono text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-red-500 shadow-md animate-pulse">
          {{ totalItemCount }}
        </span>
      </div>

      <div class="flex flex-col font-mono text-xs pr-1">
        <span class="text-[9px] uppercase tracking-widest text-white/80 font-bold">Kiosk Bag</span>
        <span class="font-extrabold text-sm">₹{{ subtotal.toLocaleString() }}</span>
      </div>

      <span class="text-xs ml-1 group-hover:translate-x-1 transition-transform">➔</span>
    </div>
  </Transition>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useCart } from '@/usecart';

const route = useRoute();
const router = useRouter();

// Retrieve reactive cart state from global store
const { totalItemCount, subtotal } = useCart();

const goToCart = () => {
  router.push('/cart');
};
</script>

<style scoped>
/* Smooth Pop and Fade Transitions */
.pop-fade-enter-active,
.pop-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.pop-fade-enter-from,
.pop-fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
</style>