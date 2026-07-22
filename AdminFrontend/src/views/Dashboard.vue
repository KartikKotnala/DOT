<template>
  <div class="min-h-screen bg-slate-100/70 text-slate-800 font-sans flex antialiased">
    
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0">
      
      <!-- Top Header -->
      <header class="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0 shadow-sm sticky top-0 z-10">
        <div class="flex items-center gap-3">
          <h1 class="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
            Dashboard Overview
          </h1>
          <span class="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Feed
          </span>
        </div>

        <div class="flex items-center gap-4 text-slate-500">
          <button 
            @click="fetchOrders" 
            :disabled="isLoading"
            class="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-xs active:scale-95"
          >
            <span :class="{ 'animate-spin': isLoading }">🔄</span>
            <span>{{ isLoading ? 'Refreshing...' : 'Refresh Feed' }}</span>
          </button>
        </div>
      </header>

      <!-- Main Dashboard Area -->
      <main class="p-6 space-y-6 overflow-y-auto">
        
        <!-- Summary Metric Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <!-- Card 1: Total Revenue -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start text-xs text-slate-400 font-semibold mb-1">
              <span>Total Revenue</span>
              <span class="text-slate-300">ⓘ</span>
            </div>
            <p class="text-2xl font-black text-slate-900 tracking-tight">₹{{ totalRevenue.toLocaleString() }}</p>
            
            <div class="flex items-center gap-2 text-[11px] mt-2 pb-2 border-b border-slate-100">
              <span class="font-bold" :class="revenueGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'">
                {{ revenueGrowth >= 0 ? '▲' : '▼' }} {{ Math.abs(revenueGrowth) }}%
              </span>
              <span class="text-slate-400 font-medium">vs prior period</span>
            </div>
            
            <div class="flex justify-between text-[11px] text-slate-500 pt-2 font-medium">
              <span>Average Order</span>
              <span class="font-bold text-slate-800">₹{{ averageOrderValue.toLocaleString() }}</span>
            </div>
          </div>

          <!-- Card 2: Total Orders -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start text-xs text-slate-400 font-semibold mb-1">
                <span>Total Orders</span>
                <span class="text-slate-300">ⓘ</span>
              </div>
              <p class="text-2xl font-black text-slate-900 tracking-tight">{{ orders.length }}</p>
            </div>
            
            <div class="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px]">
              <span class="text-slate-500 font-medium">Recorded via Kiosks</span>
              <span class="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{{ orders.length }}</span>
            </div>
          </div>

          <!-- Card 3: Pending Orders -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start text-xs text-slate-400 font-semibold mb-1">
              <span>Pending Fulfillment</span>
              <span class="text-slate-300">ⓘ</span>
            </div>
            <p class="text-2xl font-black text-amber-500 tracking-tight">{{ pendingOrdersCount }}</p>
            
            <div class="w-full bg-slate-100 rounded-full h-2 my-3 overflow-hidden">
              <div 
                class="bg-amber-500 h-full transition-all duration-500 rounded-full" 
                :style="{ width: orders.length ? `${(pendingOrdersCount / orders.length) * 100}%` : '0%' }"
              ></div>
            </div>
            
            <div class="flex justify-between text-[11px] text-slate-500 pt-1 font-medium border-t border-slate-100">
              <span>Requires Action</span>
              <span class="font-bold text-amber-600">{{ pendingOrdersCount }} orders</span>
            </div>
          </div>

          <!-- Card 4: Completed Orders -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start text-xs text-slate-400 font-semibold mb-1">
              <span>Completed Orders</span>
              <span class="text-slate-300">ⓘ</span>
            </div>
            <p class="text-2xl font-black text-emerald-600 tracking-tight">{{ completedOrdersCount }}</p>
            
            <div class="w-full bg-slate-100 rounded-full h-2 my-3 overflow-hidden">
              <div 
                class="bg-emerald-500 h-full transition-all duration-500 rounded-full" 
                :style="{ width: orders.length ? `${(completedOrdersCount / orders.length) * 100}%` : '0%' }"
              ></div>
            </div>
            
            <div class="flex justify-between text-[11px] text-slate-500 pt-1 font-medium border-t border-slate-100">
              <span>Fulfillment Rate</span>
              <span class="font-bold text-emerald-600">{{ fulfillmentRate }}%</span>
            </div>
          </div>

        </div>

        <!-- Orders Table / Grid Section -->
        <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4 mb-6">
            <div>
              <h2 class="text-base font-bold text-slate-900">Live Kiosk Orders</h2>
              <p class="text-xs text-slate-400">View and update customer order states in real time</p>
            </div>

            <div class="flex flex-wrap gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
              <button 
                v-for="st in ['All', 'Pending', 'Processing', 'Completed', 'Cancelled']" 
                :key="st"
                @click="selectedFilter = st"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                :class="selectedFilter === st ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60' : 'text-slate-600 hover:text-slate-900'"
              >
                {{ st }}
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredOrders.length === 0" class="text-center py-16 text-slate-400 text-xs bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            No active orders matching "<span class="font-semibold text-slate-600">{{ selectedFilter }}</span>" status.
          </div>

          <!-- Orders Cards Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="order in filteredOrders" 
              :key="order.id"
              class="border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between gap-4 bg-white hover:border-blue-300 transition-all shadow-xs hover:shadow-sm"
            >
              <div class="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span class="font-extrabold text-slate-900 text-sm tracking-tight">{{ order.orderCode }}</span>
                  <p class="text-[10px] font-medium text-slate-400 mt-0.5">
                    {{ formatDate(order.createdAt) }} • Kiosk: <span class="font-semibold text-slate-600">{{ order.kioskId }}</span>
                  </p>
                </div>
                <span 
                  class="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border inline-flex items-center gap-1.5"
                  :class="{
                    'bg-amber-50 text-amber-700 border-amber-200': order.status === 'Pending',
                    'bg-blue-50 text-blue-700 border-blue-200': order.status === 'Processing',
                    'bg-emerald-50 text-emerald-700 border-emerald-200': order.status === 'Completed',
                    'bg-rose-50 text-rose-700 border-rose-200': order.status === 'Cancelled'
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
              <div class="grid grid-cols-3 gap-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span class="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Customer</span>
                  <span class="font-bold text-slate-800 truncate block">{{ order.customerName }}</span>
                </div>
                <div>
                  <span class="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Phone</span>
                  <span class="font-bold text-slate-800 block truncate">{{ order.customerPhone }}</span>
                </div>
                <div>
                  <span class="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Payment</span>
                  <span class="font-bold text-blue-600 uppercase block">{{ order.paymentMethod }}</span>
                </div>
              </div>

              <!-- Ordered Items List -->
              <div class="space-y-1.5 my-1">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ordered Items:</span>
                <div 
                  v-for="item in order.items" 
                  :key="item.id" 
                  class="flex justify-between text-xs text-slate-700 bg-slate-50/50 px-3 py-1.5 rounded-lg border border-slate-100"
                >
                  <span class="font-medium truncate pr-2">{{ item.quantity }}x {{ item.productName || item.productId }}</span>
                  <span class="font-bold text-slate-900 shrink-0">₹{{ (item.price * item.quantity).toLocaleString() }}</span>
                </div>
              </div>

              <!-- Total & Action Buttons -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 pt-3 gap-3">
                <div>
                  <span class="text-[9px] text-slate-400 uppercase font-bold block tracking-wider">Total Amount</span>
                  <span class="text-base font-black text-emerald-600">₹{{ Number(order.grandTotal).toLocaleString() }}</span>
                </div>

                <div class="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                  <button 
                    v-for="stOpt in ['Pending', 'Processing', 'Completed', 'Cancelled']" 
                    :key="stOpt"
                    @click="updateOrderStatus(order.id, stOpt)"
                    :disabled="order.status === stOpt"
                    class="px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                    :class="order.status === stOpt ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'"
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

// Dynamic Financial Metrics
const filteredOrders = computed(() => {
  if (selectedFilter.value === 'All') return orders.value;
  return orders.value.filter(o => o.status === selectedFilter.value);
});

const totalRevenue = computed(() => {
  return orders.value.reduce((acc, o) => acc + Number(o.grandTotal || 0), 0);
});

const averageOrderValue = computed(() => {
  if (!orders.value.length) return 0;
  return Math.round(totalRevenue.value / orders.value.length);
});

const pendingOrdersCount = computed(() => {
  return orders.value.filter(o => o.status === 'Pending').length;
});

const completedOrdersCount = computed(() => {
  return orders.value.filter(o => o.status === 'Completed').length;
});

const fulfillmentRate = computed(() => {
  if (!orders.value.length) return 0;
  return Math.round((completedOrdersCount.value / orders.value.length) * 100);
});

// Dynamic Revenue Growth Calculation
// Splitting dataset by median timestamp to compare recent vs prior revenue
const revenueGrowth = computed(() => {
  if (orders.value.length < 2) return 0;

  const sortedOrders = [...orders.value].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const midpoint = Math.floor(sortedOrders.length / 2);

  const priorPeriod = sortedOrders.slice(0, midpoint);
  const currentPeriod = sortedOrders.slice(midpoint);

  const priorRevenue = priorPeriod.reduce((acc, o) => acc + Number(o.grandTotal || 0), 0);
  const currentRevenue = currentPeriod.reduce((acc, o) => acc + Number(o.grandTotal || 0), 0);

  if (priorRevenue === 0) return currentRevenue > 0 ? 100 : 0;

  const growth = ((currentRevenue - priorRevenue) / priorRevenue) * 100;
  return Number(growth.toFixed(1));
});

onMounted(() => {
  fetchOrders();
  autoRefreshTimer = setInterval(fetchOrders, 10000);
});

onUnmounted(() => {
  if (autoRefreshTimer) clearInterval(autoRefreshTimer);
});
</script>