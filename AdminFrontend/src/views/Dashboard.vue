<template>
  <div class="min-h-screen bg-[#f0f2f5] text-slate-800 font-sans flex">
    
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0">
      
      <header class="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-sm">
        <div class="flex items-center gap-3">
          <h1 class="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Dashboard Overview
          </h1>
          <span class="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
            Live Feed
          </span>
        </div>

        <div class="flex items-center gap-4 text-slate-500">
          <button 
            @click="fetchOrders" 
            :disabled="isLoading"
            class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
          >
            <span>{{ isLoading ? 'Refreshing...' : '🔄 Refresh Feed' }}</span>
          </button>
        </div>
      </header>

      <main class="p-6 space-y-6 overflow-y-auto">
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div class="flex justify-between items-start text-xs text-slate-400 font-semibold mb-1">
              <span>Total Revenue</span>
              <span>ⓘ</span>
            </div>
            <p class="text-2xl font-black text-slate-800">₹{{ totalRevenue.toLocaleString() }}</p>
            <div class="flex items-center gap-3 text-[11px] text-slate-500 mt-2 pb-2 border-b border-slate-100">
              <span>Growth <strong class="text-emerald-500">12.5% ▲</strong></span>
            </div>
            <div class="flex justify-between text-[11px] text-slate-500 pt-2 font-medium">
              <span>Average Order</span>
              <span class="font-bold text-slate-700">₹{{ orders.length ? Math.round(totalRevenue / orders.length) : 0 }}</span>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div class="flex justify-between items-start text-xs text-slate-400 font-semibold mb-1">
              <span>Total Orders</span>
              <span>ⓘ</span>
            </div>
            <p class="text-2xl font-black text-slate-800">{{ orders.length }}</p>
            <div class="h-8 my-2 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-lg opacity-80"></div>
            <div class="flex justify-between text-[11px] text-slate-500 pt-1 font-medium border-t border-slate-100">
              <span>Recorded via Kiosks</span>
              <span class="font-bold text-slate-700">{{ orders.length }}</span>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div class="flex justify-between items-start text-xs text-slate-400 font-semibold mb-1">
              <span>Pending Fulfillment</span>
              <span>ⓘ</span>
            </div>
            <p class="text-2xl font-black text-amber-500">{{ pendingOrdersCount }}</p>
            <div class="w-full bg-slate-100 rounded-full h-2 my-4 overflow-hidden">
              <div 
                class="bg-amber-500 h-full transition-all duration-300" 
                :style="{ width: orders.length ? `${(pendingOrdersCount / orders.length) * 100}%` : '0%' }"
              ></div>
            </div>
            <div class="flex justify-between text-[11px] text-slate-500 pt-1 font-medium border-t border-slate-100">
              <span>Requires Action</span>
              <span class="font-bold text-amber-600">{{ pendingOrdersCount }} orders</span>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div class="flex justify-between items-start text-xs text-slate-400 font-semibold mb-1">
              <span>Completed Orders</span>
              <span>ⓘ</span>
            </div>
            <p class="text-2xl font-black text-emerald-600">{{ completedOrdersCount }}</p>
            <div class="w-full bg-slate-100 rounded-full h-2 my-4 overflow-hidden">
              <div 
                class="bg-emerald-500 h-full transition-all duration-300" 
                :style="{ width: orders.length ? `${(completedOrdersCount / orders.length) * 100}%` : '0%' }"
              ></div>
            </div>
            <div class="flex justify-between text-[11px] text-slate-500 pt-1 font-medium border-t border-slate-100">
              <span>Fulfillment Rate</span>
              <span class="font-bold text-emerald-600">{{ orders.length ? Math.round((completedOrdersCount / orders.length) * 100) : 0 }}%</span>
            </div>
          </div>

        </div>


        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4 mb-6">
            <div>
              <h2 class="text-base font-bold text-slate-800">Live Kiosk Orders</h2>
              <p class="text-xs text-slate-400">View and update customer order states in real time</p>
            </div>

            <div class="flex flex-wrap gap-1.5">
              <button 
                v-for="st in ['All', 'Pending', 'Processing', 'Completed', 'Cancelled']" 
                :key="st"
                @click="selectedFilter = st"
                class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                :class="selectedFilter === st ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
              >
                {{ st }}
              </button>
            </div>
          </div>

          <div v-if="filteredOrders.length === 0" class="text-center py-16 text-slate-400 text-xs">
            No active orders matching "{{ selectedFilter }}" status.
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="order in filteredOrders" 
              :key="order.id"
              class="border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4 bg-slate-50/50 hover:border-blue-300 transition-all shadow-sm"
            >
              <div class="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <span class="font-extrabold text-slate-800 text-sm">{{ order.orderCode }}</span>
                  <p class="text-[10px] text-slate-400 mt-0.5">{{ new Date(order.createdAt).toLocaleString() }} | Kiosk: {{ order.kioskId }}</p>
                </div>
                <span 
                  class="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border"
                  :class="{
                    'bg-amber-100 text-amber-700 border-amber-200': order.status === 'Pending',
                    'bg-blue-100 text-blue-700 border-blue-200': order.status === 'Processing',
                    'bg-emerald-100 text-emerald-700 border-emerald-200': order.status === 'Completed',
                    'bg-red-100 text-red-700 border-red-200': order.status === 'Cancelled'
                  }"
                >
                  ● {{ order.status }}
                </span>
              </div>

              <div class="grid grid-cols-3 gap-2 text-[11px] bg-white p-3 rounded-xl border border-slate-200/80">
                <div>
                  <span class="text-[9px] text-slate-400 block uppercase font-bold">Customer</span>
                  <span class="font-bold text-slate-700 truncate block">{{ order.customerName }}</span>
                </div>
                <div>
                  <span class="text-[9px] text-slate-400 block uppercase font-bold">Phone</span>
                  <span class="font-bold text-slate-700">{{ order.customerPhone }}</span>
                </div>
                <div>
                  <span class="text-[9px] text-slate-400 block uppercase font-bold">Payment</span>
                  <span class="font-bold text-blue-600 uppercase">{{ order.paymentMethod }}</span>
                </div>
              </div>

              <div class="space-y-1.5 my-1">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ordered Items:</span>
                <div 
                  v-for="item in order.items" 
                  :key="item.id" 
                  class="flex justify-between text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-100"
                >
                  <span class="font-medium">{{ item.quantity }}x {{ item.productName || item.productId }}</span>
                  <span class="font-bold">₹{{ (item.price * item.quantity).toLocaleString() }}</span>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-200 pt-3 gap-2">
                <div>
                  <span class="text-[9px] text-slate-400 uppercase font-bold block">Total Amount</span>
                  <span class="text-base font-black text-emerald-600">₹{{ Number(order.grandTotal).toLocaleString() }}</span>
                </div>

                <div class="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                  <button 
                    v-for="stOpt in ['Pending', 'Processing', 'Completed', 'Cancelled']" 
                    :key="stOpt"
                    @click="updateOrderStatus(order.id, stOpt)"
                    :disabled="order.status === stOpt"
                    class="px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    :class="order.status === stOpt ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'"
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
import Sidebar from '../components/layout/Sidebar.vue';

const orders = ref([]);
const selectedFilter = ref('All');
const isLoading = ref(false);
let autoRefreshTimer = null;

// Fetch Live Orders from Express Backend (Port 5001)
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

// Computed Financial Metrics & Filter Logic
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