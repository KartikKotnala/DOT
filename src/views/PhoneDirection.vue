<template>
  <div class="min-h-screen bg-zinc-950 text-white px-4 md:px-8 py-6 relative font-sans">
    
    <!-- Top Action Navigation Banner -->
    <div class="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
      <div>
        <button 
          @click="abortNavigation" 
          class="inline-flex items-center text-red-400 font-semibold hover:text-red-300 transition-colors text-xs uppercase tracking-wider"
        >
          <span class="mr-2">←</span> BACK
        </button>
        <h1 class="text-xl font-bold mt-1 text-white tracking-tight"> Shopping Mall Map</h1>
      </div>
      <div class="text-xs text-zinc-500 font-mono">SYSTEM: HYBRID_ROUTE_BUILDER_v13.5</div>
    </div>

    <!-- Main Dynamic Content Grid Layout -->
    <div v-if="phone" class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[85vh]">
      
      <!-- LEFT SIDE PANEL: Clean view showing only the models list -->
      <div class="lg:col-span-3 bg-zinc-900/40 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar h-full">
        
        <div class="text-xs text-white/50 uppercase tracking-widest font-bold mb-2 ml-1">
          All Available Models
        </div>

        <div 
          v-for="item in allPhones" 
          :key="item.id"
          @click="selectPhone(item)"
          class="flex items-center gap-3 bg-zinc-900/20 border p-2.5 rounded-xl cursor-pointer transition-all duration-200 group"
          :class="String(item.id) === String(route.params.id) ? 'border-red-500 bg-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.15)]' : 'border-white/5 hover:border-white/10 hover:bg-zinc-800/30'"
        >
          <div class="w-12 h-12 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center overflow-hidden border border-zinc-700/30">
            <img 
              v-if="item.image"
              :src="getPhoneImageUrl(item.image)" 
              :alt="item.name" 
              class="w-full h-full object-contain"
            />
          </div>
          
          <div class="flex-1 min-w-0">
            <h3 
              class="text-sm font-bold truncate transition-colors" 
              :class="String(item.id) === String(route.params.id) ? 'text-red-400' : 'text-zinc-100 group-hover:text-white'"
            >
              {{ item.name }}
            </h3>
            <p class="text-[11px] text-zinc-400 truncate font-medium mt-0.5">
              {{ getBrandName(item.brandId) }} • <span class="text-zinc-500">Floor {{ item.floor }}</span>
            </p>
          </div>

          <div v-if="String(item.id) === String(route.params.id)" class="shrink-0 flex items-center pr-1">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          </div>
        </div>

      </div>

      <!-- RIGHT SIDE PANEL -->
      <div class="lg:col-span-9 bg-white border border-white/10 rounded-2xl p-2 flex flex-col relative overflow-hidden shadow-xl h-full">
        
        <!-- FLOATING HUD PANEL -->
        <div class="absolute top-4 left-4 z-50 flex items-center bg-zinc-950/95 p-1 rounded-xl border border-white/10 shadow-lg font-mono">
          <button 
            v-for="f in [3, 2, 1]" 
            :key="f"
            @click="activeFloor = f"
            class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
            :class="activeFloor === f ? 'bg-red-500 text-white shadow' : 'text-zinc-400 hover:text-white'"
          >
            Lvl {{ f }}
            <span v-if="phone.floor === f" class="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 ml-1 animate-ping"></span>
          </button>
        </div>

        <!-- 🌟 NEW: SMALL CLEAN FLOATING HUD PANEL (Only appears when custom path drawing begins) -->
        <div 
          v-if="customNodes.length > 0"
          class="absolute top-4 right-4 z-50 flex items-center gap-3 bg-zinc-950/95 border border-white/10 rounded-xl p-2 pl-3 shadow-xl animate-fade-in font-mono text-xs"
        >
          <div class="flex items-center gap-1.5 text-zinc-300">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
            Custom Waypoints: <span class="text-white font-bold">{{ customNodes.length }}</span>
          </div>
          <button 
            @click="clearCustomRoute"
            class="px-2.5 py-1 bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded-lg hover:bg-red-500/30 transition-all duration-150"
          >
            Reset Path
          </button>
        </div>

        <!-- MOUSE INTERACTION TRACKING FRAME -->
        <div 
          class="flex-1 w-full bg-white rounded-xl overflow-hidden relative select-none"
          :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
          @mousedown="handleMapMouseDown"
          @mousemove="onPan"
          @mouseup="endPan"
          @mouseleave="endPan"
          @wheel="onZoom"
        >

          <!-- PAN/ZOOM GRAPHICS CANVAS WRAPPER -->
          <div 
            class="w-full h-full origin-center flex items-center justify-center"
            :class="isDragging ? 'transition-none' : 'transition-transform duration-700 ease-in-out'"
            :style="{ transform: `translate(${panX}px, ${panY}px) scale(${zoomScale})` }"
          >
            <div class="relative w-[800px] h-[600px]">
              
              <svg 
                ref="mapSvgRef"
                class="w-full h-full" 
                viewBox="0 0 800 600" 
                xmlns="http://www.w3.org/2000/svg"
              >
                
                <defs>
                  <clipPath id="phoneClip">
                    <circle cx="0" cy="-40" r="16" />
                  </clipPath>
                </defs>

                <!-- Base Canvas Sheet -->
                <rect width="800" height="600" fill="#ffffff" />
                <rect x="10" y="10" width="780" height="580" fill="none" stroke="#e2e8f0" stroke-width="3" rx="8" />

                <!-- Renders whichever floor sub-component file is active -->
                <component :is="floorComponent" :phone="phone" />

                <!-- FLOORS 2 & 3 CENTRAL TRANSIT ESCALATOR CORE -->
                <g v-if="activeFloor >= 2" transform="translate(400, 410)">
                  <circle cx="0" cy="0" r="32" fill="#10b981" opacity="0.12" class="animate-pulse" />
                  <ellipse cx="0" cy="2" rx="7" ry="2.5" fill="rgba(0, 0, 0, 0.2)" />
                  <path d="M 0 0 C -14 -18 -22 -28 -22 -40 A 22 22 0 1 1 22 -40 C 22 -28 14 -18 0 0 Z" fill="#10b981" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round" />
                  <circle cx="0" cy="-40" r="8" fill="#ffffff" />
                  <polygon points="-4,-38 0,-43 4,-38" fill="#10b981" />
                  <text x="0" y="-50" font-size="10" fill="#10b981" text-anchor="middle" font-weight="bold" font-family="sans-serif">ESCALATOR FROM L1</text>
                </g>

                <!-- 🌟 FIXED: STANDARD DATA ROUTE REMAINS ALWAYS ACTIVE AND RENDERED -->
                <g v-if="phone && activeFloor === phone.floor">
                  <path 
                    v-if="phone.path"
                    :d="phone.path" 
                    fill="none" 
                    stroke="#ef4444" 
                    stroke-width="5" 
                    stroke-dasharray="12,10" 
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="animate-route-flow"
                  />

                  <!-- DESTINATION TARGET PIN -->
                  <g :transform="`translate(${phone.mapX}, ${phone.mapY})`">
                    <circle cx="0" cy="0" r="32" fill="#ef4444" opacity="0.12" class="animate-pulse" />
                    <ellipse cx="0" cy="2" rx="7" ry="2.5" fill="rgba(0, 0, 0, 0.25)" />
                    <path d="M 0 0 C -14 -18 -22 -28 -22 -40 A 22 22 0 1 1 22 -40 C 22 -28 14 -18 0 0 Z" fill="#ef4444" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round" />
                    <circle cx="0" cy="-40" r="16" fill="#ffffff" />
                    <image 
                      :href="getPhoneImageUrl(phone.image)" 
                      x="-16" 
                      y="-56" 
                      width="32" 
                      height="32" 
                      clip-path="url(#phoneClip)" 
                      preserveAspectRatio="xMidYMid meet" 
                    />
                  </g>
                </g>

                <!-- DYNAMIC CUSTOM GREEN PATH OVERLAY LAYER (Draws directly alongside red path) -->
                <g v-if="customPathString">
                  <path 
                    :d="customPathString"
                    fill="none"
                    stroke="#10b981"
                    stroke-width="5"
                    stroke-dasharray="8,8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="animate-custom-flow"
                  />
                  
                  <!-- Waypoint click markers -->
                  <g v-for="(node, index) in customNodes" :key="index" :transform="`translate(${node.x}, ${node.y})`">
                    <circle cx="0" cy="0" r="5" fill="#10b981" stroke="#ffffff" stroke-width="1.5" />
                  </g>
                </g>

              </svg>
            </div>
          </div>

          <!-- Cross-Floor Indicator HUD Notification Banner -->
          <div v-if="phone && activeFloor !== phone.floor" class="absolute top-4 right-4 z-50 bg-red-500 text-white font-mono font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 shadow-md animate-bounce">
            ⚠️ TARGET MODEL IS LOCATED ON LEVEL {{ phone.floor }}
          </div>

          <!-- Floating Map HUD UI Overlay: Zoom Buttons Layer -->
          <div class="absolute bottom-4 right-4 flex flex-col gap-1 shadow-md z-50">
            <button @click.stop="uiZoom(0.3)" class="w-9 h-9 bg-zinc-900/90 text-white font-semibold text-lg rounded-t-lg border border-white/10 flex items-center justify-center hover:bg-zinc-800 active:bg-zinc-700 transition-colors">+</button>
            <button @click.stop="uiZoom(-0.3)" class="w-9 h-9 bg-zinc-900/90 text-white font-semibold text-lg rounded-b-lg border-t-0 border border-white/10 flex items-center justify-center hover:bg-zinc-800 active:bg-zinc-700 transition-colors">−</button>
          </div>

          <!-- Recenter Button -->
          <div class="absolute bottom-4 left-4 shadow-sm z-50">
            <button @click.stop="resetMap" class="px-3 py-1.5 bg-zinc-900/90 text-white font-medium text-xs rounded-lg border border-white/10 flex items-center gap-1.5 hover:bg-zinc-800 transition-colors shadow">Recenter View</button>
          </div>

        </div>
        
        <!-- Bottom Stat Metadata Sync Banner -->
        <div class="mt-3 flex justify-between items-center text-xs text-zinc-500 font-mono bg-zinc-900/5 p-3 rounded-xl border border-zinc-200">
          <div class="flex items-center gap-2 text-zinc-600 font-bold">
            <span class="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse"></span> 
            Active Floor Blueprint Matrix: Level {{ activeFloor }} Display View Mode
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Floor components import points
import Floor1 from '@/components/MapFloors/Floor1.vue';
import Floor2 from '@/components/MapFloors/Floor2.vue';
import Floor3 from '@/components/MapFloors/Floor3.vue';

const route = useRoute();
const router = useRouter();

const allPhones = ref([]);
const brandList = ref([]);
const activeFloor = ref(1);

// Route builder tracking state nodes
const mapSvgRef = ref(null);
const customNodes = ref([]);
const hasDraggedMoved = ref(false);

const phone = computed(() => {
  return allPhones.value.find(p => String(p.id) === String(route.params.id));
});

// Reactive mapping switch linking state levels to component paths
const floorComponent = computed(() => {
  if (activeFloor.value === 3) return Floor3;
  if (activeFloor.value === 2) return Floor2;
  return Floor1;
});

// Converts tracking nodes directly into clean path strings
const customPathString = computed(() => {
  if (customNodes.value.length === 0) return '';
  return customNodes.value.reduce((path, node, index) => {
    return index === 0 ? `M ${node.x} ${node.y}` : `${path} L ${node.x} ${node.y}`;
  }, '');
});

const clearCustomRoute = () => {
  customNodes.value = [];
};

const getBrandName = (brandId) => {
  if (!brandList.value.length) return "Device Brand";
  const brandObj = brandList.value.find(b => String(b.id) === String(brandId));
  return brandObj ? brandObj.name : "Premium Brand";
};

const selectPhone = (targetItem) => {
  clearCustomRoute();
  activeFloor.value = targetItem.floor;
  router.replace(`/phone/${targetItem.id}/directions`);
};

const abortNavigation = () => {
  if (phone.value) {
    router.push(`/brand/${phone.value.brandId}`);
  } else {
    router.push('/');
  }
};

// --- 📍 AUTO-PAN TARGETING ---
const focusOnTarget = (targetX, targetY) => {
  zoomScale.value = 1.35;
  const cx = 400;
  const cy = 300;
  const dx = targetX - cx;
  const dy = targetY - cy;
  
  panX.value = -dx * zoomScale.value;
  panY.value = -(dy - 20) * zoomScale.value;
};

watch(
  () => route.params.id,
  () => {
    if (phone.value) {
      activeFloor.value = phone.value.floor;
      setTimeout(() => {
        focusOnTarget(phone.value.mapX, phone.value.mapY);
      }, 60);
    }
  },
  { immediate: true }
);

// --- 🕹️ LIVE PAN/ZOOM ENGINE ---
const zoomScale = ref(1.0);
const panX = ref(0);
const panY = ref(0);
const isDragging = ref(false);
const startMouseX = ref(0);
const startMouseY = ref(0);

let zoomTimeout = null;
const onZoom = (event) => {
  event.preventDefault();
  isDragging.value = true; 
  const scaleStep = event.deltaY * -0.0015;
  zoomScale.value = Math.min(Math.max(0.4, zoomScale.value + scaleStep), 3.5);
  clearTimeout(zoomTimeout);
  zoomTimeout = setTimeout(() => { isDragging.value = false; }, 150);
};

const uiZoom = (factor) => { zoomScale.value = Math.min(Math.max(0.4, zoomScale.value + factor), 3.5); };

const handleMapMouseDown = (event) => {
  isDragging.value = true;
  hasDraggedMoved.value = false;
  startMouseX.value = event.clientX - panX.value;
  startMouseY.value = event.clientY - panY.value;
};

const onPan = (event) => {
  if (!isDragging.value) return;
  if (Math.abs(event.clientX - (startMouseX.value + panX.value)) > 5 || 
      Math.abs(event.clientY - (startMouseY.value + panY.value)) > 5) {
    hasDraggedMoved.value = true;
  }
  panX.value = event.clientX - startMouseX.value;
  panY.value = event.clientY - startMouseY.value;
};

const endPan = (event) => {
  if (isDragging.value) {
    if (!hasDraggedMoved.value && mapSvgRef.value) {
      const rect = mapSvgRef.value.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;
      
      const svgInternalX = Math.round((clickX / rect.width) * 800);
      const svgInternalY = Math.round((clickY / rect.height) * 600);
      
      customNodes.value.push({ x: svgInternalX, y: svgInternalY });
    }
    isDragging.value = false;
  }
};

const resetMap = () => { zoomScale.value = 1.0; panX.value = 0; panY.value = 0; };

onMounted(async () => {
  try {
    const [brandsResponse, subProductsResponse] = await Promise.all([
      fetch('/SubProductsBrand.json'),
      fetch('/SubProducts.json')
    ]);
    brandList.value = await brandsResponse.json();
    allPhones.value = await subProductsResponse.json();
  } catch (error) {
    console.error("Failed to load map data configurations:", error);
  }
});

const getPhoneImageUrl = (imageName) => {
  try {
    return new URL(`../assets/images/${imageName}`, import.meta.url).href;
  } catch (error) {
    return "";
  }
};
</script>

<style scoped>
@keyframes routeMove { to { stroke-dashoffset: -24; } }
.animate-route-flow { animation: routeMove 1s linear infinite; }

/* Dedicated speed tracking for custom green lines */
@keyframes customMove { to { stroke-dashoffset: -16; } }
.animate-custom-flow { animation: customMove 0.8s linear infinite; }

@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.animate-fade-in { animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.01); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.08); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.18); }

.room { cursor: pointer; transition: .3s; }
.room:hover, .active-zone {
  filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.35));
  stroke: #ef4444 !important;
}
</style>