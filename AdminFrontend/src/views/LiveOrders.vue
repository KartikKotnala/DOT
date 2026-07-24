<template>
  <div class="min-h-screen font-sans flex antialiased bg-slate-50 dark:bg-[#090d16] text-slate-800 dark:text-slate-100 transition-colors duration-300">
    
    <!-- Sidebar -->
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0">
      
      <!-- Top Header -->
      <header class="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0d1322]/90 px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 backdrop-blur-xl transition-colors duration-300 shadow-xs">
        <div class="flex items-center gap-3">
          <h1 class="text-sm font-black tracking-wider uppercase text-slate-900 dark:text-slate-100">
            Live Kiosk Orders
          </h1>
          <span class="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Stream
          </span>
        </div>

        <div class="flex items-center gap-4 text-slate-500">
          <button 
            @click="fetchOrders" 
            :disabled="isLoading"
            class="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-2xs active:scale-95"
          >
            <span :class="{ 'animate-spin': isLoading }">🔄</span>
            <span>{{ isLoading ? 'Refreshing...' : 'Refresh Orders' }}</span>
          </button>
        </div>
      </header>

      <!-- Main Live Orders Content Area -->
      <main class="p-6 space-y-6 overflow-y-auto custom-scrollbar">
        
        <div class="rounded-2xl border p-6 bg-white dark:bg-[#0d1322] border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          
          <!-- Filter Controls Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-4 mb-6">
            <div>
              <h2 class="text-base font-bold text-slate-900 dark:text-slate-100">Active Kiosk Feed</h2>
              <p class="text-xs text-slate-400">View customer orders and update fulfillment status in real time</p>
            </div>

            <div class="flex flex-wrap gap-1.5 p-1 rounded-xl border bg-slate-100/80 dark:bg-slate-900/80 border-slate-200/60 dark:border-slate-800">
              <button 
                v-for="st in ['All', 'Pending', 'Processing', 'Completed', 'Cancelled']" 
                :key="st"
                @click="selectedFilter = st"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                :class="selectedFilter === st ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-2xs border border-slate-200/60 dark:border-blue-500/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'"
              >
                {{ st }}
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredOrders.length === 0" class="text-center py-16 text-slate-400 text-xs bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            No active orders matching "<span class="font-semibold text-slate-600 dark:text-slate-300">{{ selectedFilter }}</span>" status.
          </div>

          <!-- Orders Cards Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="order in filteredOrders" 
              :key="order.id"
              class="border rounded-2xl p-5 flex flex-col justify-between gap-4 bg-white dark:bg-[#111827] border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/40 transition-all shadow-xs hover:shadow-sm"
            >
              <div class="flex justify-between items-start border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <div>
                  <span class="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-tight">{{ order.orderCode }}</span>
                  <p class="text-[10px] font-medium text-slate-400 mt-0.5">
                    {{ formatDate(order.createdAt) }} • Kiosk: <span class="font-semibold text-slate-600 dark:text-slate-300">{{ order.kioskId }}</span>
                  </p>
                </div>
                <span 
                  class="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border inline-flex items-center gap-1.5"
                  :class="{
                    'bg-amber-500/10 text-amber-500 border-amber-500/20': order.status === 'Pending',
                    'bg-blue-500/10 text-blue-500 border-blue-500/20': order.status === 'Processing',
                    'bg-emerald-500/10 text-emerald-500 border-emerald-500/20': order.status === 'Completed',
                    'bg-rose-500/10 text-rose-500 border-rose-500/20': order.status === 'Cancelled'
                  }"
                >
                  <span 
                    class="w-1.5 h-1.5 rounded-full"
                    :class="{
                      'bg-amber-500': order.status === 'Pending',
                      'bg-blue-500': order.status === 'Processing',
                      'bg-emerald-500': order.status === 'Completed',
                      'bg-rose-500': order.status === 'Cancelled'
                    }"
                  ></span>
                  {{ order.status }}
                </span>
              </div>

              <!-- Customer Details -->
              <div class="grid grid-cols-3 gap-2 text-[11px] p-3 rounded-xl border bg-slate-50 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800/60">
                <div>
                  <span class="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Customer</span>
                  <span class="font-bold text-slate-800 dark:text-slate-200 truncate block">{{ order.customerName }}</span>
                </div>
                <div>
                  <span class="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Phone</span>
                  <span class="font-bold text-slate-800 dark:text-slate-200 block truncate">{{ order.customerPhone }}</span>
                </div>
                <div>
                  <span class="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Payment</span>
                  <span class="font-bold text-blue-500 uppercase block">{{ order.paymentMethod }}</span>
                </div>
              </div>

              <!-- Ordered Items List -->
              <div class="space-y-1.5 my-1">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ordered Items:</span>
                <div 
                  v-for="item in order.items" 
                  :key="item.id" 
                  class="flex justify-between text-xs text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/30 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800/40"
                >
                  <span class="font-medium truncate pr-2">{{ item.quantity }}x {{ item.productName || item.productId }}</span>
                  <span class="font-bold text-slate-900 dark:text-slate-100 shrink-0">₹{{ (item.price * item.quantity).toLocaleString() }}</span>
                </div>
              </div>

              <!-- Total & Action Buttons -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 gap-3">
                <div>
                  <span class="text-[9px] text-slate-400 uppercase font-bold block tracking-wider">Total Amount</span>
                  <span class="text-base font-black text-emerald-600 dark:text-emerald-400">₹{{ Number(order.grandTotal).toLocaleString() }}</span>
                </div>

                <div class="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                  <button 
                    v-for="stOpt in ['Pending', 'Processing', 'Completed', 'Cancelled']" 
                    :key="stOpt"
                    @click="updateOrderStatus(order.id, stOpt)"
                    :disabled="order.status === stOpt"
                    class="px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                    :class="order.status === stOpt ? 'bg-slate-900 text-white border-slate-900 dark:bg-blue-600 dark:border-blue-600' : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'"
                  >
                    {{ stOpt }}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Sidebar from '@/components/layout/Sidebar.vue';

const orders = ref([]);
const selectedFilter = ref('All');
const isLoading = ref(false);
let autoRefreshTimer = null;

// Fetch Live Orders from Express Backend
const fetchOrders = async () => {
  isLoading.value = true;
  try {
    const res = await fetch('http://localhost:5001/api/admin/orders');
    orders.value = await res.json();
  } catch (err) {
    console.error('Failed to fetch orders:', err);
  } finally {
    isLoading.value = false;
  }
};

// Update Order Status in Express API & MySQL
const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const res = await fetch(`http://localhost:5001/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await res.json();
    if (data.success) {
      const order = orders.value.find(o => o.id === orderId);
      if (order) order.status = newStatus;
    }
  } catch (err) {
    console.error('Failed to update status:', err);
  }
};

// Format Date safely
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString('en-IN', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
};

const filteredOrders = computed(() => {
  if (selectedFilter.value === 'All') return orders.value;
  return orders.value.filter(o => o.status === selectedFilter.value);
});

onMounted(() => {
  fetchOrders();
  autoRefreshTimer = setInterval(fetchOrders, 10000);
});

onUnmounted(() => {
  if (autoRefreshTimer) clearInterval(autoRefreshTimer);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.2);
  border-radius: 9999px;
}
</style>