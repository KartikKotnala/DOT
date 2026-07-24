<template>
  <div 
    class="min-h-screen font-sans flex antialiased bg-slate-50 dark:bg-[#090d16] text-slate-800 dark:text-slate-100 transition-colors duration-300"
  >
    
    <!-- Sidebar -->
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0">
      
      <!-- Top Navigation Header -->
      <header 
        class="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0d1322]/90 px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 backdrop-blur-xl transition-colors duration-300 shadow-xs"
      >
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 font-black text-xs">
            📈
          </div>
          <div>
            <h1 class="text-sm font-black tracking-wider uppercase text-slate-900 dark:text-slate-100">Analytics</h1>
            <p class="text-[10px] text-slate-400 font-medium -mt-0.5">Real-time Kiosk Network Performance </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <!-- Sync Data Button -->
          <button 
            @click="fetchOrders" 
            :disabled="isLoading"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-sm active:scale-95"
          >
            <span :class="{ 'animate-spin': isLoading }">🔄</span>
            <span>{{ isLoading ? 'Refreshing...' : 'Refresh' }}</span>
          </button>
        </div>
      </header>

      <!-- Main Dashboard Canvas -->
      <main class="p-6 space-y-6 overflow-y-auto custom-scrollbar">
        
        <!-- SUMMARY KPI METRICS GRID (6 Key Indicators) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          
          <!-- Metric 1: Gross Revenue -->
          <div 
            class="p-4 rounded-2xl border transition-all bg-white dark:bg-[#0d1322] border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 shadow-xs"
          >
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Gross Sales</span>
            <p class="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">₹{{ totalRevenue.toLocaleString() }}</p>
            <div class="flex items-center gap-1 mt-1 text-[10px] font-bold" :class="revenueGrowth >= 0 ? 'text-emerald-500' : 'text-rose-500'">
              <span>{{ revenueGrowth >= 0 ? '▲' : '▼' }} {{ Math.abs(revenueGrowth) }}%</span>
              <span class="text-slate-400 font-medium">trend</span>
            </div>
          </div>

          <!-- Metric 2: Total Volume -->
          <div 
            class="p-4 rounded-2xl border transition-all bg-white dark:bg-[#0d1322] border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 shadow-xs"
          >
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Total Orders</span>
            <p class="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">{{ orders.length }}</p>
            <p class="text-[10px] text-slate-400 font-medium mt-1">{{ uniqueKiosksCount }} Active Kiosks</p>
          </div>

          <!-- Metric 3: Avg Order Value -->
          <div 
            class="p-4 rounded-2xl border transition-all bg-white dark:bg-[#0d1322] border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 shadow-xs"
          >
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Avg Ticket</span>
            <p class="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">₹{{ averageOrderValue.toLocaleString() }}</p>
            <p class="text-[10px] text-slate-400 font-medium mt-1">Per Checkout</p>
          </div>

          <!-- Metric 4: Pending Backlog -->
          <div 
            class="p-4 rounded-2xl border transition-all bg-white dark:bg-[#0d1322] border-slate-200/80 dark:border-slate-800/80 hover:border-amber-500/50 shadow-xs"
          >
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Queue Backlog</span>
            <p class="text-xl font-black tracking-tight text-amber-500">{{ pendingOrdersCount }}</p>
            <p class="text-[10px] text-slate-400 font-medium mt-1">{{ orders.length ? Math.round((pendingOrdersCount / orders.length) * 100) : 0 }}% Backlog</p>
          </div>

          <!-- Metric 5: Fulfillment Efficiency -->
          <div 
            class="p-4 rounded-2xl border transition-all bg-white dark:bg-[#0d1322] border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/50 shadow-xs"
          >
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Fulfillment Rate</span>
            <p class="text-xl font-black tracking-tight text-emerald-500">{{ fulfillmentRate }}%</p>
            <p class="text-[10px] text-slate-400 font-medium mt-1">{{ completedOrdersCount }} Completed</p>
          </div>

          <!-- Metric 6: Peak Hour Node -->
          <div 
            class="p-4 rounded-2xl border transition-all bg-white dark:bg-[#0d1322] border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 shadow-xs"
          >
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Peak Hour</span>
            <p class="text-xl font-black tracking-tight text-indigo-500 dark:text-indigo-400">{{ peakHour }}</p>
            <p class="text-[10px] text-slate-400 font-medium mt-1">Highest Traffic</p>
          </div>

        </div>

        <!-- ROW 1 CHARTS: Revenue Vector Curve & Full Lifecycle SVG Pie Chart -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- CHART 1: REVENUE VECTOR GRAPH -->
          <div 
            class="lg:col-span-2 rounded-2xl p-6 border flex flex-col justify-between bg-white dark:bg-[#0d1322] border-slate-200/80 dark:border-slate-800/80 shadow-xs"
          >
            <div class="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
              <div>
                <h2 class="text-base font-extrabold tracking-wide text-slate-900 dark:text-slate-100">Total Revenue </h2>
                <p class="text-xs text-slate-400 mt-0.5">Sequential sales growth curve across transaction timestamps</p>
              </div>
              <span class="text-xs font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-xl border border-blue-500/20">
                Graph Plot
              </span>
            </div>

            <!-- SVG Vector Curve Graphic -->
            <div class="h-64 w-full relative pt-6 pb-2">
              <svg class="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
                <!-- Grid Lines -->
                <line x1="0" y1="20" x2="500" y2="20" :stroke="isDarkMode ? '#1e293b' : '#f1f5f9'" stroke-width="1" stroke-dasharray="4" />
                <line x1="0" y1="70" x2="500" y2="70" :stroke="isDarkMode ? '#1e293b' : '#f1f5f9'" stroke-width="1" stroke-dasharray="4" />
                <line x1="0" y1="120" x2="500" y2="120" :stroke="isDarkMode ? '#1e293b' : '#f1f5f9'" stroke-width="1" stroke-dasharray="4" />

                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.35" />
                    <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.0" />
                  </linearGradient>
                </defs>

                <path :d="chartAreaPath" fill="url(#revenueGradient)" />
                <path :d="chartLinePath" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

                <circle 
                  v-for="(pt, idx) in chartPoints" 
                  :key="idx" 
                  :cx="pt.x" 
                  :cy="pt.y" 
                  r="4.5" 
                  fill="#3b82f6" 
                  :stroke="isDarkMode ? '#0d1322' : '#ffffff'" 
                  stroke-width="2" 
                />
              </svg>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400 font-medium">
              <span>Gross Total: <strong class="font-black text-slate-900 dark:text-slate-100">₹{{ totalRevenue.toLocaleString() }}</strong></span>
              <span class="text-emerald-500 font-bold">● Network Active</span>
            </div>
          </div>

          <!-- CHART 2: SVG PIE CHART (Order Status Proportion) -->
          <div 
            class="rounded-2xl p-6 border flex flex-col justify-between bg-white dark:bg-[#0d1322] border-slate-200/80 dark:border-slate-800/80 shadow-xs"
          >
            <div class="border-b pb-4 border-slate-100 dark:border-slate-800">
              <h2 class="text-base font-extrabold tracking-wide text-slate-900 dark:text-slate-100">Order Status Pie Chart</h2>
              <p class="text-xs text-slate-400 mt-0.5">Lifecycle state volume ratio</p>
            </div>

            <!-- SVG Multi-Segment Pie Chart Visual -->
            <div class="relative flex items-center justify-center my-4">
              <svg class="w-48 h-48 -rotate-90 transform overflow-visible" viewBox="-1 -1 2 2">
                <path 
                  v-for="(slice, idx) in pieSlices" 
                  :key="idx"
                  :d="slice.path" 
                  :fill="slice.color" 
                  class="transition-all duration-500 hover:opacity-80 cursor-pointer"
                />
              </svg>

              <!-- Central Overlay -->
              <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span class="text-2xl font-black text-slate-900 dark:text-slate-100">{{ orders.length }}</span>
                <span class="text-[9px] uppercase tracking-wider text-slate-400 font-black">Orders</span>
              </div>
            </div>

            <!-- Pie Legend Grid -->
            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div v-for="item in statusBreakdown" :key="item.name" class="flex items-center justify-between text-xs">
                <span class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                  <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: item.color }"></span>
                  {{ item.name }}
                </span>
                <span class="font-black text-slate-900 dark:text-slate-100">{{ item.percentage }}%</span>
              </div>
            </div>
          </div>

        </div>

        <!-- ROW 2 CHARTS: Payment Radial Donut & Kiosk Volume Load -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- CHART 3: RADIAL DONUT (Payment Methods Split) -->
          <div 
            class="rounded-2xl p-6 border flex flex-col justify-between bg-white dark:bg-[#0d1322] border-slate-200/80 dark:border-slate-800/80 shadow-xs"
          >
            <div class="border-b pb-4 border-slate-100 dark:border-slate-800">
              <h2 class="text-base font-extrabold tracking-wide text-slate-900 dark:text-slate-100">Payment Method Distribution</h2>
              <p class="text-xs text-slate-400 mt-0.5">Checkout method breakdown across customers</p>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-around my-4 gap-4">
              <div class="relative flex items-center justify-center">
                <svg class="w-40 h-40 -rotate-90 transform overflow-visible" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" :stroke="isDarkMode ? '#1e293b' : '#f1f5f9'" stroke-width="3.5" />
                  <circle 
                    v-for="(seg, idx) in donutSegments" 
                    :key="idx"
                    cx="18" cy="18" r="15.915" 
                    fill="none" 
                    :stroke="seg.color" 
                    stroke-width="3.8"
                    :stroke-dasharray="`${seg.dash} ${100 - seg.dash}`"
                    :stroke-dashoffset="seg.offset"
                    class="transition-all duration-700"
                  />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span class="text-xl font-black text-slate-900 dark:text-slate-100">₹{{ totalRevenue.toLocaleString() }}</span>
                  <span class="text-[8px] uppercase tracking-wider text-slate-400 font-extrabold">Revenue</span>
                </div>
              </div>

              <div class="space-y-3 w-full sm:w-1/2">
                <div 
                  v-for="item in paymentBreakdown" 
                  :key="item.name" 
                  class="p-2.5 rounded-xl border flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800"
                >
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: item.color }"></span>
                    <span class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ item.name }}</span>
                  </div>
                  <span class="text-xs font-black text-blue-500">{{ item.percentage }}%</span>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 font-medium text-center">
              Channels: UPI, Cash & POS Integrated
            </div>
          </div>

          <!-- CHART 4: KIOSK HARDWARE LOAD BARS -->
          <div 
            class="rounded-2xl p-6 border flex flex-col justify-between bg-white dark:bg-[#0d1322] border-slate-200/80 dark:border-slate-800/80 shadow-xs"
          >
            <div class="border-b pb-4 mb-4 border-slate-100 dark:border-slate-800">
              <h2 class="text-base font-extrabold tracking-wide text-slate-900 dark:text-slate-100">Kiosk Throughput Load</h2>
              <p class="text-xs text-slate-400 mt-0.5">Order distribution across physical kiosk hardware</p>
            </div>

            <div class="space-y-3.5 my-2">
              <div v-for="kiosk in kioskLoadBreakdown" :key="kiosk.id" class="space-y-1">
                <div class="flex justify-between text-xs font-bold">
                  <span class="text-slate-700 dark:text-slate-300">Kiosk Node #{{ kiosk.id }}</span>
                  <span class="text-blue-500 font-black">{{ kiosk.count }} Orders ({{ kiosk.percentage }}%)</span>
                </div>
                <div class="w-full rounded-full h-3 overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <div 
                    class="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-700" 
                    :style="{ width: `${kiosk.percentage}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span>Active Kiosk Nodes: <strong class="text-slate-900 dark:text-slate-100">{{ uniqueKiosksCount }}</strong></span>
              <span class="text-emerald-500 font-bold">● Network Online</span>
            </div>
          </div>

        </div>

        <!-- QUICK ACCESS BANNER
        <div 
          class="p-6 rounded-2xl border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-slate-800 to-blue-900 dark:from-blue-950/40 dark:via-[#0d1322] dark:to-indigo-950/40 text-white border-blue-200/60 dark:border-blue-500/20"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-600/30 rounded-2xl flex items-center justify-center text-2xl shrink-0 border border-blue-400/30">
              📦
            </div>
            <div>
              <h3 class="text-base font-bold">Live Order Management Station</h3>
              <p class="text-xs text-slate-300 mt-0.5">Need to process incoming orders, update fulfillment states, or inspect customer receipts?</p>
            </div>
          </div>

          <router-link 
            to="/orders" 
            class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap shrink-0"
          >
            Go to Live Orders ➔
          </router-link>
        </div> -->

      </main>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import { useTheme } from '@/composables/useTheme';

const orders = ref([]);
const isLoading = ref(false);
const { isDarkMode } = useTheme(); // Global theme state
let autoRefreshTimer = null;

const fetchOrders = async () => {
  isLoading.value = true;
  try {
    const res = await fetch('http://localhost:5001/api/admin/orders');
    orders.value = await res.json();
  } catch (err) {
    console.error('Failed to fetch analytics:', err);
  } finally {
    isLoading.value = false;
  }
};

// Summary Metric Calculations
const totalRevenue = computed(() => orders.value.reduce((acc, o) => acc + Number(o.grandTotal || 0), 0));
const averageOrderValue = computed(() => orders.value.length ? Math.round(totalRevenue.value / orders.value.length) : 0);
const pendingOrdersCount = computed(() => orders.value.filter(o => o.status === 'Pending').length);
const completedOrdersCount = computed(() => orders.value.filter(o => o.status === 'Completed').length);
const fulfillmentRate = computed(() => orders.value.length ? Math.round((completedOrdersCount.value / orders.value.length) * 100) : 0);
const uniqueKiosksCount = computed(() => new Set(orders.value.map(o => o.kioskId).filter(Boolean)).size || 1);

// Peak Operational Hour Analysis
const peakHour = computed(() => {
  if (!orders.value.length) return 'N/A';
  const hourCounts = {};
  orders.value.forEach(o => {
    if (o.createdAt) {
      const hour = new Date(o.createdAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }
  });
  const maxHour = Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b, '12');
  return `${maxHour}:00 - ${Number(maxHour) + 1}:00`;
});

const revenueGrowth = computed(() => {
  if (orders.value.length < 2) return 0;
  const sorted = [...orders.value].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const mid = Math.floor(sorted.length / 2);
  const prior = sorted.slice(0, mid).reduce((acc, o) => acc + Number(o.grandTotal || 0), 0);
  const curr = sorted.slice(mid).reduce((acc, o) => acc + Number(o.grandTotal || 0), 0);
  if (prior === 0) return curr > 0 ? 100 : 0;
  return Number((((curr - prior) / prior) * 100).toFixed(1));
});

// SVG Line Chart Calculation Points
const chartPoints = computed(() => {
  if (!orders.value.length) return [];
  const sorted = [...orders.value].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const maxRevenue = Math.max(...sorted.map(o => Number(o.grandTotal || 0)), 100);

  return sorted.map((o, idx) => ({
    x: (idx / Math.max(sorted.length - 1, 1)) * 480 + 10,
    y: 160 - (Number(o.grandTotal || 0) / maxRevenue) * 130
  }));
});

const chartLinePath = computed(() => {
  if (!chartPoints.value.length) return '';
  return chartPoints.value.reduce((acc, pt, idx) => idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`, '');
});

const chartAreaPath = computed(() => {
  if (!chartPoints.value.length) return '';
  const line = chartLinePath.value;
  const lastX = chartPoints.value[chartPoints.value.length - 1].x;
  const firstX = chartPoints.value[0].x;
  return `${line} L ${lastX} 170 L ${firstX} 170 Z`;
});

// Status Distribution Breakdown
const statusBreakdown = computed(() => {
  const total = orders.value.length || 1;
  const counts = {
    Pending: orders.value.filter(o => o.status === 'Pending').length,
    Processing: orders.value.filter(o => o.status === 'Processing').length,
    Completed: orders.value.filter(o => o.status === 'Completed').length,
    Cancelled: orders.value.filter(o => o.status === 'Cancelled').length,
  };

  return [
    { name: 'Pending', count: counts.Pending, percentage: Math.round((counts.Pending / total) * 100), color: '#f59e0b' },
    { name: 'Processing', count: counts.Processing, percentage: Math.round((counts.Processing / total) * 100), color: '#3b82f6' },
    { name: 'Completed', count: counts.Completed, percentage: Math.round((counts.Completed / total) * 100), color: '#10b981' },
    { name: 'Cancelled', count: counts.Cancelled, percentage: Math.round((counts.Cancelled / total) * 100), color: '#f43f5e' },
  ];
});

// Dynamic SVG Pie Chart Path Generator
const pieSlices = computed(() => {
  let cumulativePercent = 0;
  return statusBreakdown.value.map(item => {
    const percent = item.percentage / 100;
    
    // Handle edge case where single status is 100%
    if (percent >= 0.999) {
      return { 
        path: 'M 0 -1 A 1 1 0 1 1 0 1 A 1 1 0 1 1 0 -1 Z', 
        color: item.color 
      };
    }
    
    if (percent <= 0) return { path: '', color: item.color };

    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
    cumulativePercent += percent;
    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
    const largeArcFlag = percent > 0.5 ? 1 : 0;

    const pathData = [
      `M ${startX} ${startY}`,
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      `L 0 0`,
    ].join(' ');

    return { path: pathData, color: item.color };
  });
});

function getCoordinatesForPercent(percent) {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
}

// Payment Method Radial Donut
const paymentBreakdown = computed(() => {
  const total = orders.value.length || 1;
  const counts = {
    upi: orders.value.filter(o => o.paymentMethod?.toLowerCase() === 'upi').length,
    cash: orders.value.filter(o => o.paymentMethod?.toLowerCase() === 'cash').length,
    card: orders.value.filter(o => o.paymentMethod?.toLowerCase() === 'card').length,
  };

  return [
    { name: 'UPI / QR', percentage: Math.round((counts.upi / total) * 100), color: '#3b82f6' },
    { name: 'Cash', percentage: Math.round((counts.cash / total) * 100), color: '#10b981' },
    { name: 'Card / POS', percentage: Math.round((counts.card / total) * 100), color: '#f59e0b' },
  ];
});

const donutSegments = computed(() => {
  let offset = 0;
  return paymentBreakdown.value.map(item => {
    const dash = item.percentage;
    const currentOffset = offset;
    offset -= dash;
    return { dash, offset: currentOffset, color: item.color };
  });
});

// Kiosk Load Breakdown
const kioskLoadBreakdown = computed(() => {
  const total = orders.value.length || 1;
  const map = {};
  orders.value.forEach(o => {
    const kId = o.kioskId || '1';
    map[kId] = (map[kId] || 0) + 1;
  });
  return Object.keys(map).map(id => ({
    id,
    count: map[id],
    percentage: Math.round((map[id] / total) * 100)
  }));
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