<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 p-6 font-mono selection:bg-red-500 selection:text-white">
    
    <header class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-8">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs uppercase font-bold text-slate-400 tracking-wider">Kiosk Control Center</span>
        </div>
        <h1 class="text-2xl font-black tracking-tight text-white mt-1">MALL ADMIN DASHBOARD</h1>
      </div>

      <div class="flex items-center gap-3">
        <button 
          @click="activeTab = 'orders'" 
          class="px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
          :class="activeTab === 'orders' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'"
        >
          📋 Live Orders ({{ orders.length }})
        </button>
        <button 
          @click="fetchOrders" 
          class="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
          title="Refresh Data"
        >
          🔄
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
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-extrabold uppercase text-slate-400 tracking-wider">Incoming Kiosk Orders</h2>
        <span class="text-[10px] text-slate-500">Auto-refreshing every 10s</span>
      </div>

      <div v-if="orders.length === 0" class="text-center py-16 bg-slate-900/30 border border-slate-800 rounded-3xl text-slate-500">
        No customer orders recorded yet.
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div 
          v-for="order in orders" 
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
            <span class="text-[10px] uppercase font-bold text-slate-500">Items Ordered:</span>
            <div 
              v-for="item in order.items" 
              :key="item.id" 
              class="flex justify-between items-center text-xs bg-slate-950/30 px-3 py-1.5 rounded-lg border border-slate-800/40"
            >
              <span class="text-slate-300 font-medium">{{ item.quantity }}x {{ item.productName || item.productId }}</span>
              <span class="font-bold text-slate-400">₹{{ (item.price * item.quantity).toLocaleString() }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between border-t border-slate-800 pt-3">
            <span class="text-[10px] text-slate-500 uppercase font-bold">Update Status:</span>
            <div class="flex gap-1.5">
              <button 
                v-for="st in ['Pending', 'Processing', 'Completed', 'Cancelled']" 
                :key="st"
                @click="updateOrderStatus(order.id, st)"
                class="px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer"
                :class="order.status === st 
                  ? 'bg-slate-800 border-slate-600 text-white shadow-sm' 
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'"
              >
                {{ st }}
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

const activeTab = ref('orders');
const orders = ref([]);
let autoRefreshTimer = null;

// Fetch Live Orders from Express Port 5001 API
const fetchOrders = async () => {
  try {
    const res = await fetch('http://localhost:5001/api/admin/orders');
    orders.value = await res.json();
  } catch (err) {
    console.error('Failed to fetch admin orders:', err);
  }
};

// Update Order Status in MySQL
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

// Revenue & Counts
const totalRevenue = computed(() => orders.value.reduce((acc, o) => acc + Number(o.grandTotal || 0), 0));
const pendingOrdersCount = computed(() => orders.value.filter(o => o.status === 'Pending').length);
const completedOrdersCount = computed(() => orders.value.filter(o => o.status === 'Completed').length);

onMounted(() => {
  fetchOrders();
  autoRefreshTimer = setInterval(fetchOrders, 10000);
});

onUnmounted(() => {
  if (autoRefreshTimer) clearInterval(autoRefreshTimer);
});
</script>