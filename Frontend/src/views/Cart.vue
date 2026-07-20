<template>
  <div class="min-h-screen bg-app text-main px-4 md:px-8 py-6 relative font-sans select-none">
    
    <div class="flex items-center justify-between border-b border-line pb-4 mb-6">
      <div>
        <button 
          @click="goBack" 
          class="inline-flex items-center text-red-400 font-semibold hover:text-red-300 transition-colors text-xs uppercase tracking-wider focus:outline-none cursor-pointer"
        >
          <span class="mr-2">←</span> CONTINUE BROWSING
        </button>
        <h1 class="text-xl font-bold mt-1 text-main tracking-tight">Your Shopping Bag</h1>
      </div>
      <div class="text-xs text-muted/60 font-mono">KIOSK_ORDER_SESSION_v1.0</div>
    </div>

    <div 
      v-if="cartItems.length === 0" 
      class="flex flex-col items-center justify-center py-20 bg-panel/40 border border-line rounded-3xl text-center shadow-xl max-w-xl mx-auto"
    >
      <div class="w-20 h-20 bg-white/5 border border-line rounded-full flex items-center justify-center text-3xl mb-4">
        🛒
      </div>
      <h2 class="text-lg font-bold text-main">Your cart is currently empty</h2>
      <p class="text-xs text-muted max-w-sm mt-1 mb-6 leading-relaxed font-sans">
        Select products across the mall stores to add them to your interactive kiosk session list.
      </p>
      <button 
        @click="goBack"
        class="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
      >
        Explore Outlets
      </button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[80vh]">
      
      <div class="lg:col-span-8 bg-panel/30 border border-line rounded-3xl p-5 flex flex-col gap-3 overflow-y-auto custom-scrollbar h-full">
        
        <div class="flex justify-between items-center px-1 mb-1">
          <span class="text-xs uppercase font-mono font-bold text-muted/80 tracking-widest">
            Selected Products ({{ totalItemCount }})
          </span>
          <button 
            @click="clearCart" 
            class="text-[10px] font-mono font-bold text-red-400 hover:underline uppercase tracking-wider cursor-pointer"
          >
            Clear Entire Bag
          </button>
        </div>

        <div 
          v-for="item in cartItems" 
          :key="item.id"
          class="bg-panel border border-line rounded-2xl p-4 flex items-center gap-4 transition-all hover:border-line/80 shadow-md group"
        >
          <div class="w-16 h-16 bg-white rounded-xl p-1.5 border border-line flex items-center justify-center overflow-hidden shrink-0">
            <img 
              :src="getImageUrl(item.image)" 
              :alt="item.name" 
              class="w-full h-full object-contain"
            />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <span class="text-[9px] font-mono font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                Lvl {{ item.floor }} Outlet
              </span>
              <span v-if="item.storage" class="text-[9px] font-mono text-muted/60">
                {{ item.storage }}
              </span>
            </div>
            <h3 class="text-sm font-bold text-main truncate">{{ item.name }}</h3>
            <p class="text-xs font-mono font-bold text-emerald-400 mt-1">
              ₹{{ ((item.price || 0) * item.quantity).toLocaleString() }}
              <span v-if="item.quantity > 1" class="text-[10px] text-muted font-normal">
                (₹{{ (item.price || 0).toLocaleString() }} each)
              </span>
            </p>
          </div>

          <div class="flex items-center bg-white/5 border border-line rounded-xl p-1 font-mono shrink-0">
            <button 
              @click="decreaseQty(item.id)"
              class="w-8 h-8 rounded-lg bg-panel text-main font-bold flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors focus:outline-none cursor-pointer"
            >
              −
            </button>
            <span class="w-10 text-center font-bold text-xs text-main">{{ item.quantity }}</span>
            <button 
              @click="increaseQty(item.id)"
              class="w-8 h-8 rounded-lg bg-panel text-main font-bold flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors focus:outline-none cursor-pointer"
            >
              +
            </button>
          </div>

          <button 
            @click="removeFromCart(item.id)"
            class="text-muted/40 hover:text-red-400 p-2 text-sm font-mono transition-colors focus:outline-none cursor-pointer ml-1"
            title="Remove item"
          >
            ✕
          </button>
        </div>

      </div>

      <div class="lg:col-span-4 bg-panel border border-line rounded-3xl p-6 flex flex-col justify-between shadow-2xl h-full font-mono">
        
        <div>
          <h2 class="text-base font-extrabold text-main uppercase tracking-tight border-b border-line pb-4 mb-4">
            Order Summary
          </h2>

          <div class="flex flex-col gap-3.5 text-xs">
            <div class="flex justify-between items-center text-muted">
              <span>Items Total ({{ totalItemCount }}):</span>
              <span class="text-main font-bold">₹{{ subtotal.toLocaleString() }}</span>
            </div>

            <div class="flex justify-between items-center text-muted">
              <span>Estimated Taxes (GST 18%):</span>
              <span class="text-main font-bold">₹{{ tax.toLocaleString() }}</span>
            </div>

            <div class="flex justify-between items-center text-muted">
              <span>Kiosk Processing Fee:</span>
              <span class="text-emerald-400 font-bold">FREE</span>
            </div>

            <div class="border-t border-line/60 my-2 pt-3 flex justify-between items-center text-sm font-black">
              <span class="text-main">Grand Total:</span>
              <span class="text-emerald-400 text-lg">₹{{ grandTotal.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3 mt-6">
          <button 
            @click="proceedToCheckout"
            :disabled="isSubmitting"
            class="w-full py-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg transition-all duration-200 transform active:scale-[0.98] cursor-pointer focus:outline-none"
          >
            {{ isSubmitting ? 'Processing Order...' : 'Proceed to Checkout' }}
          </button>

          <p class="text-[10px] text-muted/50 text-center font-sans">
            🔒 Secure local kiosk session. Post direct order to MySQL.
          </p>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
// 🛒 Import Global Cart Composable
import { useCart } from '@/usecart';

const router = useRouter();

// 🛒 Extract State & Actions from useCart
const { cartItems, totalItemCount, subtotal, increaseQty, decreaseQty, removeFromCart, clearCart } = useCart();

const isSubmitting = ref(false);

// Calculated Totals
const tax = computed(() => Math.round(subtotal.value * 0.18));
const grandTotal = computed(() => subtotal.value + tax.value);

const goBack = () => {
  router.back();
};

// 🚀 Live Checkout Handler connecting to Port 5001 API
const proceedToCheckout = async () => {
  if (cartItems.value.length === 0) return;
  isSubmitting.value = true;

  try {
    const response = await fetch('http://localhost:5001/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kioskId: localStorage.getItem('ACTIVE_KIOSK_ID') || 'kiosk_floor2_atrium',
        items: cartItems.value,
        subtotal: subtotal.value,
        tax: tax.value,
        grandTotal: grandTotal.value
      })
    });

    const data = await response.json();
    if (data.success) {
      alert(`🎉 Order Placed Successfully!\nYour Order Receipt Code: ${data.orderCode}`);
      clearCart();
      router.push('/products');
    } else {
      alert("Checkout failed: " + (data.error || "Unknown server error"));
    }
  } catch (error) {
    console.error("Order submission error:", error);
    alert("Server error connecting to Port 5001.");
  } finally {
    isSubmitting.value = false;
  }
};

const getImageUrl = (imageName) => {
  try {
    return new URL(`../assets/images/${imageName}`, import.meta.url).href;
  } catch {
    return "";
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.01); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.08); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.18); }
</style>