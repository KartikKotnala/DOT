<template>
  <div class="min-h-screen bg-app text-main px-4 md:px-8 py-6 relative font-sans select-none">
    
    <div 
      v-if="isCheckoutModalOpen" 
      class="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in print:hidden"
      @click.self="closeCheckoutModal"
    >
      <div class="bg-panel border border-line w-full max-w-lg rounded-3xl p-6 shadow-2xl relative flex flex-col gap-5 text-main font-mono">
        
        <button 
          @click="closeCheckoutModal" 
          class="absolute top-4 right-4 text-muted hover:text-main text-sm font-bold transition-colors focus:outline-none cursor-pointer"
        >
          ✕
        </button>

        <div class="border-b border-line pb-3">
          <span class="text-[10px] text-red-400 font-bold uppercase tracking-widest block mb-0.5">Quick Kiosk Checkout</span>
          <h2 class="text-lg font-black text-main uppercase">Customer Information</h2>
        </div>

        <form @submit.prevent="submitFinalOrder" class="flex flex-col gap-4 text-xs">
          <div>
            <label class="block text-[10px] uppercase text-muted font-bold mb-1">Full Name <span class="text-red-400">*</span></label>
            <input 
              v-model="customer.name" 
              type="text" 
              required
              placeholder="e.g. John Doe" 
              class="w-full bg-white/5 border border-line rounded-xl px-3 py-2.5 text-main focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          <div>
            <label class="block text-[10px] uppercase text-muted font-bold mb-1">Mobile Number <span class="text-red-400">*</span></label>
            <input 
              v-model="customer.phone" 
              type="tel" 
              required
              placeholder="e.g. +91 9876543210" 
              class="w-full bg-white/5 border border-line rounded-xl px-3 py-2.5 text-main focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          <div>
            <label class="block text-[10px] uppercase text-muted font-bold mb-1">Email Address</label>
            <input 
              v-model="customer.email" 
              type="email" 
              placeholder="e.g. john@example.com" 
              class="w-full bg-white/5 border border-line rounded-xl px-3 py-2.5 text-main focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          <div>
            <label class="block text-[10px] uppercase text-muted font-bold mb-1.5">Payment Option</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="method in [
                  { id: 'upi', label: 'UPI / QR', icon: '📱' },
                  { id: 'card', label: 'Card Tap', icon: '💳' },
                  { id: 'cash', label: 'Pay at Store', icon: '💵' }
                ]"
                :key="method.id"
                type="button"
                @click.prevent="selectPaymentMethod(method.id)"
                class="py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer font-bold"
                :class="paymentMethod === method.id 
                  ? 'bg-red-600/20 border-red-500 text-white shadow-md' 
                  : 'bg-white/5 border-line/60 text-muted hover:text-main'"
              >
                <span class="text-base">{{ method.icon }}</span>
                <span class="text-[10px]">{{ method.label }}</span>
              </button>
            </div>
          </div>

          <div class="bg-white/5 border border-line/60 rounded-xl p-3 flex justify-between items-center text-xs my-1">
            <span class="text-muted">Payable Amount:</span>
            <span class="text-emerald-400 font-extrabold text-sm">₹{{ grandTotal.toLocaleString() }}</span>
          </div>

          <button 
            type="submit"
            :disabled="isSubmitting"
            class="w-full py-3.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer mt-2"
          >
            {{ isSubmitting ? 'Processing...' : 'Confirm & Generate Receipt' }}
          </button>
        </form>

      </div>
    </div>


    <div 
      v-if="completedOrder" 
      class="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
    >
      <div class="bg-white text-black w-full max-w-sm rounded-3xl p-6 shadow-2xl relative flex flex-col gap-4 font-mono text-xs printable-receipt">
        
        <div class="text-center border-b border-dashed border-gray-400 pb-3">
          <h2 class="text-base font-black tracking-tight uppercase">SMART MALL KIOSK</h2>
          <p class="text-[10px] text-gray-600">Level 2 Central Atrium Kiosk</p>
          <div class="mt-2 text-[11px] font-bold bg-gray-100 py-1 px-2 rounded-lg inline-block">
            ORDER: {{ completedOrder.orderCode }}
          </div>
        </div>

        <div class="space-y-1 text-[11px] border-b border-dashed border-gray-400 pb-3">
          <div class="flex justify-between">
            <span class="text-gray-500">Customer:</span>
            <span class="font-bold">{{ completedOrder.customerName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Phone:</span>
            <span class="font-bold">{{ completedOrder.customerPhone }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Payment:</span>
            <span class="font-bold uppercase">{{ completedOrder.paymentMethod }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Date:</span>
            <span>{{ new Date().toLocaleDateString() }} {{ new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
          </div>
        </div>

        <div class="space-y-2 max-h-40 overflow-y-auto pr-1 border-b border-dashed border-gray-400 pb-3">
          <div 
            v-for="item in completedOrder.items" 
            :key="item.id" 
            class="flex justify-between items-start text-[11px]"
          >
            <div class="flex-1 pr-2">
              <p class="font-bold truncate">{{ item.name }}</p>
              <p class="text-[9px] text-gray-500">Qty: {{ item.quantity }} × ₹{{ item.price.toLocaleString() }}</p>
            </div>
            <span class="font-bold">₹{{ (item.price * item.quantity).toLocaleString() }}</span>
          </div>
        </div>

        <div class="space-y-1 text-[11px]">
          <div class="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>₹{{ completedOrder.subtotal.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>GST (18%):</span>
            <span>₹{{ completedOrder.tax.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-sm font-black border-t border-black pt-2 mt-1">
            <span>TOTAL PAID:</span>
            <span>₹{{ completedOrder.grandTotal.toLocaleString() }}</span>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center pt-2 border-t border-dashed border-gray-400">
          <QrcodeVue :value="completedOrder.orderCode" :size="75" level="H" />
          <p class="text-[9px] text-gray-500 mt-1">Scan at store counter for pickup</p>
        </div>

        <div class="flex gap-2 pt-2 print:hidden">
          <button 
            @click="printReceipt" 
            class="flex-1 py-3 bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
          >
            🖨️ Print Receipt
          </button>
          <button 
            @click="finishOrderSession" 
            class="py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs uppercase rounded-xl transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>


    <div class="flex items-center justify-between border-b border-line pb-4 mb-6 print:hidden">
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
      v-if="cartItems.length === 0 && !completedOrder" 
      class="flex flex-col items-center justify-center py-20 bg-panel/40 border border-line rounded-3xl text-center shadow-xl max-w-xl mx-auto print:hidden"
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

    <div v-else-if="!completedOrder" class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[80vh] print:hidden">
      
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
            @click="openCheckoutModal"
            class="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg transition-all duration-200 transform active:scale-[0.98] cursor-pointer focus:outline-none"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCart } from '@/usecart';
import QrcodeVue from 'qrcode.vue';

const router = useRouter();
const { cartItems, totalItemCount, subtotal, increaseQty, decreaseQty, removeFromCart, clearCart } = useCart();

const isCheckoutModalOpen = ref(false);
const isSubmitting = ref(false);
const completedOrder = ref(null); // Stores receipt data after order creation

const customer = ref({ name: '', phone: '', email: '' });
const paymentMethod = ref('upi');

const selectPaymentMethod = (methodId) => { paymentMethod.value = methodId; };

const tax = computed(() => Math.round(subtotal.value * 0.18));
const grandTotal = computed(() => subtotal.value + tax.value);

const goBack = () => router.back();
const openCheckoutModal = () => { if (cartItems.value.length > 0) isCheckoutModalOpen.value = true; };
const closeCheckoutModal = () => { isCheckoutModalOpen.value = false; };

// 🚀 Submit Order to Express API
const submitFinalOrder = async () => {
  isSubmitting.value = true;

  const payload = {
    kioskId: localStorage.getItem('ACTIVE_KIOSK_ID') || 'kiosk_floor2_atrium',
    customerName: customer.value.name.trim(),
    customerPhone: customer.value.phone.trim(),
    customerEmail: customer.value.email.trim() || 'N/A',
    paymentMethod: paymentMethod.value,
    items: [...cartItems.value],
    subtotal: subtotal.value,
    tax: tax.value,
    grandTotal: grandTotal.value
  };

  try {
    const response = await fetch('http://localhost:5001/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.success) {
      // Store completed order info to render receipt
      completedOrder.value = {
        ...payload,
        orderCode: data.orderCode
      };
      
      clearCart();
      closeCheckoutModal();
      customer.value = { name: '', phone: '', email: '' };
    } else {
      alert("Checkout error: " + (data.error || "Could not process order"));
    }
  } catch (error) {
    console.error("Submission failed:", error);
    alert("Server error connecting to Port 5001.");
  } finally {
    isSubmitting.value = false;
  }
};

// 🖨️ Trigger Browser/POS Printer
const printReceipt = () => {
  window.print();
};

const finishOrderSession = () => {
  completedOrder.value = null;
  router.push('/products');
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
@keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
.animate-fade-in { animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.01); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.08); border-radius: 10px; }

/* 🖨️ CSS PRINT RULES: Hides entire web page except the receipt modal when printing */
@media print {
  body * {
    visibility: hidden;
  }
  .printable-receipt, .printable-receipt * {
    visibility: visible;
  }
  .printable-receipt {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 15px;
    box-shadow: none;
    border: none;
  }
}
</style>