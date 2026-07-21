<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 p-6 font-mono selection:bg-red-500 selection:text-white">
    
    <header class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-8">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs uppercase font-bold text-slate-400 tracking-wider">Kiosk Command Center</span>
        </div>
        <h1 class="text-2xl font-black tracking-tight text-white mt-1">MALL ADMIN DASHBOARD</h1>
      </div>

      <div class="flex items-center gap-3">
        <button 
          @click="fetchOrders" 
          :disabled="isLoading"
          class="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
        >
          <span>{{ isLoading ? 'Refreshing...' : '🔄 Refresh Orders' }}</span>
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <span class="text-[10px] uppercase text-slate-500 font-bold">Total Sales Revenue</span>
        <p class="text-2xl font-black text-emerald-400 mt-1">₹{{ totalRevenue.toLocaleString() }}</p>
      </div>
      <div class="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <span class="text-[10px] uppercase text-slate-500 font-bold">Total Orders</span>
        <p class="text-2xl font-black text-white mt-1">{{ orders.length }}</p>
      </div>
      <div class="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <span class="text-[10px] uppercase text-slate-500 font-bold">Pending Fulfillment</span>
        <p class="text-2xl font-black text-amber-400 mt-1">{{ pendingOrdersCount }}</p>
      </div>
      <div class="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <span class="text-[10px] uppercase text-slate-500 font-bold">Completed Orders</span>
        <p class="text-2xl font-black text-blue-400 mt-1">{{ completedOrdersCount }}</p>
      </div>
    </div>

    <div class="space-y-4">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
        <h2 class="text-xs font-extrabold uppercase text-slate-400 tracking-wider px-2">
          Live Order Feed ({{ filteredOrders.length }})
        </h2>

        <div class="flex flex-wrap gap-1.5">
          <button 
            v-for="filter in ['All', 'Pending', 'Processing', 'Completed', 'Cancelled']" 
            :key="filter"
            @click="selectedFilter = filter"
            class="px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase transition-all cursor-pointer"
            :class="selectedFilter === filter ? 'bg-red-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'"
          >
            {{ filter }}
          </button>
        </div>
      </div>

      <div v-if="isLoading && orders.length === 0" class="text-center py-16 bg-slate-900/30 border border-slate-800 rounded-3xl text-slate-500">
        Connecting to Backend on Port 5001...
      </div>

      <div v-else-if="filteredOrders.length === 0" class="text-center py-16 bg-slate-900/30 border border-slate-800 rounded-3xl text-slate-500">
        No orders found under "{{ selectedFilter }}" status.
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div 
          v-for="order in filteredOrders" 
          :key="order.id"
          class="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-slate-700 transition-all shadow-xl"
        >
          <div class="flex justify-between items-start border-b border-slate-800 pb-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-extrabold text-white text-base">{{ order.orderCode }}</span>
                <span 
                  class="text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full"
                  :class="{
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20': order.status === 'Pending',
                    'bg-blue-500/10 text-blue-400 border border-blue-500/20': order.status === 'Processing',
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': order.status === 'Completed',
                    'bg-red-500/10 text-red-400 border border-red-500/20': order.status === 'Cancelled'
                  }"
                >
                  ● {{ order.status }}
                </span>
              </div>
              <p class="text-[10px] text-slate-500 mt-0.5">
                {{ new Date(order.createdAt).toLocaleString() }} | Kiosk: {{ order.kioskId }}
              </p>
            </div>

            <div class="text-right">
              <span class="text-xs text-slate-400 block">Grand Total</span>
              <span class="text-base font-black text-emerald-400">₹{{ Number(order.grandTotal).toLocaleString() }}</span>
            </div>
          </div>

          <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 grid grid-cols-3 gap-2 text-[11px]">
            <div>
              <span class="text-[9px] text-slate-500 block uppercase">Customer</span>
              <span class="font-bold text-slate-200 truncate block">{{ order.customerName }}</span>
            </div>
            <div>
              <span class="text-[9px] text-slate-500 block uppercase">Phone</span>
              <span class="font-bold text-slate-200">{{ order.customerPhone }}</span>
            </div>
            <div>
              <span class="text-[9px] text-slate-500 block uppercase">Payment Mode</span>
              <span class="font-bold text-amber-400 uppercase">{{ order.paymentMethod }}</span>
            </div>
          </div>

          <div class="space-y-1.5 my-1">
            <span class="text-[10px] uppercase font-bold text-slate-500">Ordered Items:</span>
            <div 
              v-for="item in order.items" 
              :key="item.id" 
              class="flex justify-between items-center text-xs bg-slate-950/30 px-3 py-1.5 rounded-lg border border-slate-800/40"
            >
              <span class="text-slate-300 font-medium">{{ item.quantity }}x {{ item.productName || item.productId }}</span>
              <span class="font-bold text-slate-400">₹{{ (item.price * item.quantity).toLocaleString() }}</span>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-800 pt-3 gap-2">
            <span class="text-[10px] text-slate-500 uppercase font-bold">Process Order:</span>
            <div class="flex flex-wrap gap-1.5 w-full sm:w-auto">
              <button 
                v-for="statusOption in ['Pending', 'Processing', 'Completed', 'Cancelled']" 
                :key="statusOption"
                @click="updateOrderStatus(order.id, statusOption)"
                :disabled="order.status === statusOption"
                class="flex-1 sm:flex-initial px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                :class="order.status === statusOption 
                  ? 'bg-slate-800 border-slate-600 text-white shadow-sm' 
                  : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 bg-slate-950'"
              >
                {{ statusOption }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const orders = ref([]);
const selectedFilter = ref('All');
const isLoading = ref(false);
let autoRefreshTimer = null;

// 1. Fetch Orders from Express API (Port 5001)
const fetchOrders = async () => {
  isLoading.value = true;
  try {
    const res = await fetch('http://localhost:5001/api/admin/orders');
    orders.value = await res.json();
  } catch (err) {
    console.error('Failed to fetch admin orders:', err);
  } finally {
    isLoading.value = false;
  }
};

// 2. Update Order Status in Express API & MySQL
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
    } else {
      alert("Error updating order status");
    }
  } catch (err) {
    console.error('Failed to update status:', err);
    alert("Server error connecting to Port 5001");
  }
};

// 3. Computed Metrics & Filters
const filteredOrders = computed(() => {
  if (selectedFilter.value === 'All') return orders.value;
  return orders.value.filter(o => o.status === selectedFilter.value);
});

const totalRevenue = computed(() => orders.value.reduce((acc, o) => acc + Number(o.grandTotal || 0), 0));
const pendingOrdersCount = computed(() => orders.value.filter(o => o.status === 'Pending').length);
const completedOrdersCount = computed(() => orders.value.filter(o => o.status === 'Completed').length);

onMounted(() => {
  fetchOrders();
  // Auto-refresh order feed every 10 seconds
  autoRefreshTimer = setInterval(fetchOrders, 10000);
});

onUnmounted(() => {
  if (autoRefreshTimer) clearInterval(autoRefreshTimer);
});
</script>