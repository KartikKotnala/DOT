<template>
  <div class="min-h-screen bg-app text-main px-4 md:px-8 py-6 relative font-sans">
    
    <div 
      v-if="isModalOpen && selectedDeviceDetails" 
      class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      @click.self="closeDetailsModal"
    >
      <div class="bg-panel border border-line w-full max-w-md rounded-3xl p-6 shadow-2xl relative flex flex-col gap-5 transform scale-100 transition-transform">
        
        <button 
          @click="closeDetailsModal" 
          class="absolute top-4 right-4 text-muted hover:text-main text-sm font-bold font-mono transition-colors focus:outline-none"
        >
          ✕
        </button>

        <div class="flex items-center gap-4 border-b border-line pb-4">
          <div class="w-16 h-16 bg-white rounded-xl p-1.5 border border-line flex items-center justify-center overflow-hidden shrink-0">
            <img 
              :src="getLocationImageUrl(selectedDeviceDetails.image)" 
              :alt="selectedDeviceDetails.name" 
              class="w-full h-full object-contain"
            />
          </div>
          <div class="min-w-0">
            <span class="text-[9px] uppercase tracking-widest text-red-400 font-mono font-bold block mb-0.5">
              {{ selectedDeviceDetails.storage ? 'Device Specifications Matrix' : 'Outlet Directory Context' }}
            </span>
            <h2 class="text-lg font-extrabold text-main truncate leading-tight">{{ selectedDeviceDetails.name }}</h2>
            <p class="text-xs text-muted font-medium mt-0.5">Floor Display Location: Lvl {{ selectedDeviceDetails.floor }}</p>
          </div>
        </div>

        <div class="flex flex-col gap-3 font-mono text-xs">
          <template v-if="selectedDeviceDetails.storage || selectedDeviceDetails.ram">
            <div class="flex justify-between items-center py-2 border-b border-line/40">
              <span class="text-muted">Storage Capacity:</span>
              <span class="text-main font-bold">{{ selectedDeviceDetails.storage }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-line/40">
              <span class="text-muted">Memory RAM Layout:</span>
              <span class="text-main font-bold">{{ selectedDeviceDetails.ram }}</span>
            </div>
          </template>

          <template v-else>
            <div class="flex flex-col gap-1.5 py-1 border-b border-line/40 pb-3">
              <span class="text-[10px] text-muted uppercase tracking-wider font-bold">About Brand:</span>
              <p class="text-main/80 font-sans leading-relaxed text-xs font-normal">
                {{ selectedDeviceDetails.description || 'Welcome to our premium retail walk-in outlet location.' }}
              </p>
            </div>
            <div v-if="selectedDeviceDetails.price" class="flex justify-between items-center py-2 border-b border-line/40">
              <span class="text-muted">Standard Pricing Base:</span>
              <span class="text-emerald-400 font-bold">₹{{ selectedDeviceDetails.price }}</span>
            </div>
          </template>
        </div>

        <div class="mt-2 flex gap-3">
          <button 
            @click="confirmAndShowRoute"
            class="w-full py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md transform active:scale-[0.99] cursor-pointer focus:outline-none"
          >
            Lock Waypoint Route
          </button>
        </div>

      </div>
    </div>

    <div class="flex items-center justify-between border-b border-line pb-4 mb-6">
      <div>
        <button 
          @click="abortNavigation" 
          class="inline-flex items-center text-red-400 font-semibold hover:text-red-300 transition-colors text-xs uppercase tracking-wider focus:outline-none"
        >
          <span class="mr-2">←</span> BACK
        </button>
        <h1 class="text-xl font-bold mt-1 text-main tracking-tight">Shopping Mall Map</h1>
      </div>
      <div class="text-xs text-muted/60 font-mono">SYSTEM: MULTI_KIOSK_ROUTER_v14.0</div>
    </div>

    <div v-if="location" class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[85vh]">
      <div class="lg:col-span-3 bg-panel border border-line rounded-2xl p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar h-full">
        
        <div class="mb-4">
          <label class="text-[10px] text-muted/60 uppercase tracking-widest font-bold block mb-1.5 ml-1">
            Switch Brand 
          </label>
          <CustomSelect 
            :modelValue="location.brandId || location.id"
            :options="siblingBrands"
            labelKey="name"
            valueKey="id"
            @change="handleBrandSwitch"
          />
        </div>

        <div class="text-xs text-main/50 uppercase tracking-widest font-bold mb-2 ml-1">
          Available Items
        </div>

        <div 
          v-for="item in filteredSidebarItems" 
          :key="item.id"
          @click="selectLocation(item)"
          class="flex items-center gap-3 bg-panel border p-2.5 rounded-xl cursor-pointer transition-all duration-200 group"
          :class="String(item.id) === String(route.params.id) ? 'border-red-500 bg-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.15)]' : 'border-line hover:border-line hover:bg-panel hover:brightness-110/30'"
        >
          <div class="w-12 h-12 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center overflow-hidden border border-zinc-700/30">
            <img 
              v-if="item.image"
              :src="getLocationImageUrl(item.image)" 
              :alt="item.name" 
              class="w-full h-full object-contain"
            />
          </div>
          
          <div class="flex-1 min-w-0">
            <h3 
              class="text-sm font-bold truncate transition-colors" 
              :class="String(item.id) === String(route.params.id) ? 'text-red-400' : 'text-muted group-hover:text-main'"
            >
              {{ item.name }}
            </h3>
            <p class="text-[11px] text-muted truncate font-medium mt-0.5">
              Level {{ item.floor }} Display
            </p>
          </div>

          <div v-if="String(item.id) === String(route.params.id)" class="shrink-0 flex items-center pr-1">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          </div>
        </div>

        <div v-if="filteredSidebarItems.length === 0" class="text-xs text-muted/60 text-center py-6">
          Direct walk-in store location.
        </div>
      </div>

      <div class="lg:col-span-9 bg-white border border-line rounded-2xl p-2 flex flex-col relative overflow-hidden shadow-xl h-full">
        
        <div class="absolute top-4 left-4 z-50 flex items-center bg-panel p-1 rounded-xl border border-line shadow-lg font-mono">
          <button 
            v-for="f in [3, 2, 1]" 
            :key="f"
            @click="activeFloor = f"
            class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 focus:outline-none cursor-pointer"
            :class="activeFloor === f ? 'bg-red-500 text-main shadow' : 'text-muted hover:text-main'"
          >
            Lvl {{ f }}
            <span v-if="location.floor === f" class="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 ml-1 animate-ping"></span>
          </button>
        </div>

        <div 
          v-if="activeKioskProfile && location && activeKioskProfile.floor !== location.floor"
          class="absolute top-16 left-4 z-50 max-w-sm w-80 bg-panel border border-line rounded-2xl p-4 font-mono text-xs shadow-xl animate-fade-in"
        >
          <div class="flex items-center gap-2 mb-2 text-red-400 font-bold uppercase tracking-wider">
            <span>🔀 Cross-Floor Route Detected</span>
          </div>
          <p class="text-[11px] text-muted mb-3 font-sans leading-normal">
            Target is on <strong>Level {{ location.floor }}</strong>. Pick your transport node:
          </p>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="mode in [
                { id: 'lift', label: 'Lift', icon: '🛗' },
                { id: 'escalator', label: 'Escalator', icon: '🪜' },
                { id: 'stairs', label: 'Stairs', icon: '🚶' }
              ]"
              :key="mode.id"
              type="button"
              @click="selectedTransitMode = mode.id"
              class="py-2 rounded-xl border font-bold flex flex-col items-center gap-1 transition-all cursor-pointer focus:outline-none text-[10px]"
              :class="selectedTransitMode === mode.id 
                ? 'bg-red-500 text-white border-red-500 shadow' 
                : 'bg-white/5 border-line/60 text-muted hover:text-main'"
            >
              <span class="text-base">{{ mode.icon }}</span>
              <span>{{ mode.label }}</span>
            </button>
          </div>
        </div>

        <div 
          v-if="customNodes.length > 0"
          class="absolute top-4 right-4 z-50 flex flex-col gap-2 bg-panel border border-line rounded-xl p-3 shadow-xl animate-fade-in font-mono text-xs max-w-sm w-80"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5 text-muted">
              <span class="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              Waypoints: <span class="text-main font-bold">{{ customNodes.length }}</span>
            </div>
            <button @click="clearCustomRoute" class="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded hover:bg-red-500/20 transition-all text-[10px] cursor-pointer">Reset</button>
          </div>

          <div class="bg-black/40 border border-line/60 rounded-lg p-2 flex flex-col gap-1.5">
            <span class="text-[9px] text-muted uppercase tracking-wider">Generated JSON Path:</span>
            <code class="text-[11px] text-emerald-400 break-all select-all font-mono leading-tight bg-white/5 p-1.5 rounded block max-h-16 overflow-y-auto">
              {{ customPathString }}
            </code>
            <button 
              @click="copyPathToClipboard" 
              class="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[10px] uppercase tracking-wide transition-colors cursor-pointer focus:outline-none"
            >
              {{ copiedStatus ? '✓ Copied!' : 'Copy Path String' }}
            </button>
          </div>
        </div>

        <div 
          class="flex-1 w-full bg-white rounded-xl overflow-hidden relative select-none"
          :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
          @mousedown="handleMapMouseDown"
          @mousemove="onPan"
          @mouseup="endPan"
          @mouseleave="endPan"
          @wheel="onZoom"
        >
          <div 
            class="w-full h-full origin-center flex items-center justify-center"
            :class="isDragging ? 'transition-none' : 'transition-transform duration-700 ease-in-out'"
            :style="{ transform: `translate(${panX}px, ${panY}px) scale(${zoomScale})` }"
          >
            <div class="relative w-[800px] h-[600px]">
              <svg ref="mapSvgRef" class="w-full h-full" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <clipPath id="locationClip"><circle cx="0" cy="-40" r="16" /></clipPath>
                </defs>
                <rect width="800" height="600" fill="#ffffff" />
                <rect x="10" y="10" width="780" height="580" fill="none" stroke="#e2e8f0" stroke-width="3" rx="8" />
                <component :is="floorComponent" :phone="location" />

                <g v-if="location">
                  <path 
                    v-if="targetedRoutePath" 
                    :d="targetedRoutePath" 
                    fill="none" 
                    stroke="#ef4444" 
                    stroke-width="5" 
                    stroke-dasharray="12,10" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    class="animate-route-flow" 
                  />
                  
                  <g v-if="activeFloor === location.floor" :transform="`translate(${location.mapX}, ${location.mapY})`">
                    <circle cx="0" cy="0" r="32" fill="#ef4444" opacity="0.12" class="animate-pulse" />
                    <ellipse cx="0" cy="2" rx="7" ry="2.5" fill="rgba(0, 0, 0, 0.25)" />
                    <path d="M 0 0 C -14 -18 -22 -28 -22 -40 A 22 22 0 1 1 22 -40 C 22 -28 14 -18 0 0 Z" fill="#ef4444" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round" />
                    <circle cx="0" cy="-40" r="16" fill="#ffffff" />
                    
                    <image 
                      :href="getLocationImageUrl(location.image)" 
                      x="-16" 
                      y="-56" 
                      width="32" 
                      height="32" 
                      clip-path="url(#locationClip)" 
                      preserveAspectRatio="xMidYMid meet" 
                    />
                  </g>
                </g>

                <g v-if="activeKioskProfile && activeKioskProfile.floor === activeFloor" :transform="`translate(${activeKioskProfile.x}, ${activeKioskProfile.y})`">
                  <circle cx="0" cy="0" r="32" fill="#10b981" opacity="0.12" class="animate-pulse" />
                  <ellipse cx="0" cy="2" rx="7" ry="2.5" fill="rgba(0, 0, 0, 0.2)" />
                  <path d="M 0 0 C -14 -18 -22 -28 -22 -40 A 22 22 0 1 1 22 -40 C 22 -28 14 -18 0 0 Z" fill="#10b981" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round" />
                  <circle cx="0" cy="-40" r="9" fill="#ffffff" />
                  <circle cx="0" cy="-40" r="4" fill="#10b981" />
                </g>

                <g v-if="kioskRegistry && kioskRegistry.transitHubs && location && activeKioskProfile && activeKioskProfile.floor !== location.floor">
                  <g 
                    v-for="hub in kioskRegistry.transitHubs[selectedTransitMode]" 
                    v-show="hub.floor === activeFloor"
                    :key="hub.floor"
                    :transform="`translate(${hub.x}, ${hub.y})`"
                  >
                    <circle cx="0" cy="0" r="20" fill="#38bdf8" opacity="0.15" class="animate-ping" />
                    <circle cx="0" cy="0" r="8" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5" />
                    <text x="0" y="-14" fill="#38bdf8" font-size="9" font-weight="black" font-family="mono" text-anchor="middle" class="uppercase">
                      {{ selectedTransitMode }} Node
                    </text>
                  </g>
                </g>

                <g v-if="customPathString">
                  <path :d="customPathString" fill="none" stroke="#10b981" stroke-width="5" stroke-dasharray="8,8" stroke-linecap="round" stroke-linejoin="round" class="animate-custom-flow" />
                  <g v-for="(node, index) in customNodes" :key="index" :transform="`translate(${node.x}, ${node.y})`">
                    <circle cx="0" cy="0" r="5" fill="#10b981" stroke="#ffffff" stroke-width="1.5" />
                    <text x="0" y="-10" fill="#047857" font-size="9" font-weight="bold" font-family="mono" text-anchor="middle">{{node.x}},{{node.y}}</text>
                  </g>
                </g>
              </svg>
            </div>
          </div>

          <div v-if="location && activeFloor !== location.floor" class="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-main font-mono font-bold text-xs px-4 py-2.5 rounded-xl border border-line shadow-md animate-bounce">
            ⚠️ TARGET IS LOCATED ON LEVEL {{ location.floor }}
          </div>

          <div class="absolute bottom-4 right-4 flex flex-col gap-1 shadow-md z-50">
            <button @click.stop="uiZoom(0.3)" class="w-9 h-9 bg-panel text-main font-semibold text-lg rounded-t-lg border border-line flex items-center justify-center hover:bg-panel hover:brightness-110 focus:outline-none cursor-pointer">+</button>
            <button @click.stop="uiZoom(-0.3)" class="w-9 h-9 bg-panel text-main font-semibold text-lg rounded-b-lg border border-line flex items-center justify-center hover:bg-panel hover:brightness-110 focus:outline-none cursor-pointer">−</button>
          </div>
          <div class="absolute bottom-4 left-4 shadow-sm z-50">
            <button @click.stop="resetMap" class="px-3 py-1.5 bg-panel text-main font-medium text-xs rounded-lg border border-line flex items-center gap-1.5 hover:bg-panel hover:brightness-110 transition-colors shadow focus:outline-none cursor-pointer">Recenter View</button>
          </div>
        </div>

        <div class="mt-3 flex justify-between items-center text-xs text-muted/60 font-mono bg-panel/5 p-3 rounded-xl border border-zinc-200">
          <div class="flex items-center gap-2 text-muted font-bold">
            <span class="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse"></span> Active Floor Blueprint Matrix: Level {{ activeFloor }} Display View Mode
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Floor1 from '@/components/MapFloors/Floor1.vue';
import Floor2 from '@/components/MapFloors/Floor2.vue';
import Floor3 from '@/components/MapFloors/Floor3.vue';
import CustomSelect from "@/components/Header/CustomSelect.vue";

const route = useRoute();
const router = useRouter();

const allLocations = ref([]);
const brandList = ref([]);
const activeFloor = ref(1);

const mapSvgRef = ref(null);
const customNodes = ref([]);
const hasDraggedMoved = ref(false);
const copiedStatus = ref(false);

// 🖥️ MULTI-KIOSK PLATFORM CONTEXT HOOK REGISTRIES
const currentKioskId = ref(localStorage.getItem('ACTIVE_KIOSK_ID') || 'kiosk_floor1_main');
const activeKioskProfile = ref(null);
const kioskRegistry = ref(null);

// 🌟 THE CROSS-FLOOR TRANSIT MODE TRACKER PARAMETER
const selectedTransitMode = ref('lift'); // Toggles between: 'lift', 'escalator', 'stairs'

const isModalOpen = ref(false);
const selectedDeviceDetails = ref(null);

const location = computed(() => {
  return allLocations.value.find(item => 
    String(item.id) === String(route.params.id) || 
    String(item.brandId) === String(route.params.id)
  );
});

// 🌟 ADJUSTED ROUTE PATH PATHWAY SELECTION SPLITTING MATRICES
const targetedRoutePath = computed(() => {
  if (!location.value || !activeKioskProfile.value) return '';
  
  const paths = location.value.kioskPaths?.[currentKioskId.value];
  if (!paths) return '';

  // Scene A: Standard same-floor mapping direction calculation
  if (activeKioskProfile.value.floor === location.value.floor) {
    return typeof paths === 'string' ? paths : '';
  }

  // Scene B: Multi-floor complex branch pathway segmentation loops
  const transitBlock = paths[selectedTransitMode.value];
  if (!transitBlock) return '';

  // Show segment heading to the lift on the kiosk floor
  if (activeFloor.value === activeKioskProfile.value.floor) {
    return transitBlock.start_floor_segment || '';
  }
  
  // Show segment leaving the lift on the target floor
  if (activeFloor.value === location.value.floor) {
    return transitBlock.target_floor_segment || '';
  }

  return '';
});

const currentBrandProfile = computed(() => {
  if (!location.value || !brandList.value.length) return null;
  return brandList.value.find(b => String(b.id) === String(location.value.brandId || location.value.id));
});

const siblingBrands = computed(() => {
  if (!currentBrandProfile.value) return [];
  return brandList.value.filter(b => 
    String(b.ProductsNamesid) === String(currentBrandProfile.value.ProductsNamesid)
  );
});

const filteredSidebarItems = computed(() => {
  if (!location.value) return [];
  const currentBrandId = location.value.brandId || location.value.id;
  return allLocations.value.filter(item => String(item.brandId) === String(currentBrandId));
});

const floorComponent = computed(() => {
  if (activeFloor.value === 3) return Floor3;
  if (activeFloor.value === 2) return Floor2;
  return Floor1;
});

const customPathString = computed(() => {
  if (customNodes.value.length === 0) return '';
  return customNodes.value.reduce((path, node, index) => {
    return index === 0 ? `M ${node.x} ${node.y}` : `${path} L ${node.x} ${node.y}`;
  }, '');
});

const copyPathToClipboard = async () => {
  if (!customPathString.value) return;
  try {
    await navigator.clipboard.writeText(customPathString.value);
    copiedStatus.value = true;
    setTimeout(() => { copiedStatus.value = false; }, 2000);
  } catch (err) {
    console.error("Clipboard routing failed:", err);
  }
};

const clearCustomRoute = () => { customNodes.value = []; };

const selectLocation = (targetItem) => {
  selectedDeviceDetails.value = targetItem;
  isModalOpen.value = true;
};

const confirmAndShowRoute = () => {
  const targetedItemData = selectedDeviceDetails.value;
  isModalOpen.value = false;

  setTimeout(() => {
    if (targetedItemData) {
      clearCustomRoute();
      activeFloor.value = targetedItemData.floor;
      router.replace(`/phone/${targetedItemData.id}/directions`);
    }
    selectedDeviceDetails.value = null;
  }, 180);
};

const closeDetailsModal = () => {
  isModalOpen.value = false;
  setTimeout(() => { selectedDeviceDetails.value = null; }, 180);
};

const handleBrandSwitch = (newBrandId) => {
  clearCustomRoute();
  const firstItemOfNewBrand = allLocations.value.find(item => String(item.brandId) === String(newBrandId));
  
  if (firstItemOfNewBrand) {
    activeFloor.value = firstItemOfNewBrand.floor;
    router.replace(`/phone/${firstItemOfNewBrand.id}/directions`);
  } else {
    router.replace(`/phone/${newBrandId}/directions`);
  }
};

const abortNavigation = () => {
  if (currentBrandProfile.value && currentBrandProfile.value.ProductsNamesid) {
    router.push(`/product/${currentBrandProfile.value.ProductsNamesid}`);
  } else {
    router.push('/products');
  }
};

// --- PAN/ZOOM ENGINE ---
watch(location, (newLocation) => {
  if (newLocation && !activeKioskProfile.value) {
    activeFloor.value = newLocation.floor;
  }
}, { immediate: true });

const zoomScale = ref(1.0); const panX = ref(0); const panY = ref(0); const isDragging = ref(false);
const startMouseX = ref(0); const startMouseY = ref(0);
let zoomTimeout = null;
const onZoom = (event) => {
  event.preventDefault(); isDragging.value = true;
  zoomScale.value = Math.min(Math.max(0.4, zoomScale.value + (event.deltaY * -0.0015)), 3.5);
  clearTimeout(zoomTimeout); zoomTimeout = setTimeout(() => { isDragging.value = false; }, 150);
};
const uiZoom = (factor) => { zoomScale.value = Math.min(Math.max(0.4, zoomScale.value + factor), 3.5); };
const handleMapMouseDown = (event) => { isDragging.value = true; hasDraggedMoved.value = false; startMouseX.value = event.clientX - panX.value; startMouseY.value = event.clientY - panY.value; };
const onPan = (event) => { if (!isDragging.value) return; if (Math.abs(event.clientX - (startMouseX.value + panX.value)) > 5 || Math.abs(event.clientY - (startMouseY.value + panY.value)) > 5) { hasDraggedMoved.value = true; } panX.value = event.clientX - startMouseX.value; panY.value = event.clientY - startMouseY.value; };
const endPan = (event) => { if (isDragging.value) { isDragging.value = false; } };
const resetMap = () => { zoomScale.value = 1.0; panX.value = 0; panY.value = 0; };

onMounted(async () => {
  try {
    const [brandsResponse, subProductsResponse, kioskResponse] = await Promise.all([
      fetch('/SubProductsBrand.json'),
      fetch('/SubProducts.json'),
      fetch('/KioskRegistry.json')
    ]);
    brandList.value = await brandsResponse.json();
    allLocations.value = await subProductsResponse.json();
    kioskRegistry.value = await kioskResponse.json();

    // Safely assign properties matching the initialization schemas
    if (kioskRegistry.value && Array.isArray(kioskRegistry.value.kisks)) {
      activeKioskProfile.value = kioskRegistry.value.kisks.find(k => k.id === currentKioskId.value);
    } else if (kioskRegistry.value && Array.isArray(kioskRegistry.value.kiosks)) {
      activeKioskProfile.value = kioskRegistry.value.kiosks.find(k => k.id === currentKioskId.value);
    }

    if (activeKioskProfile.value) {
      activeFloor.value = activeKioskProfile.value.floor;
    }

    const exactProductMatch = allLocations.value.find(item => String(item.id) === String(route.params.id));
    if (!exactProductMatch) {
      const firstProductForBrand = allLocations.value.find(item => String(item.brandId) === String(route.params.id));
      if (firstProductForBrand) {
        router.replace(`/phone/${firstProductForBrand.id}/directions`);
      }
    }
  } catch (error) {
    console.error("Failed to load map data configurations:", error);
  }
});

const getLocationImageUrl = (imageName) => {
  try { return new URL(`../assets/images/${imageName}`, import.meta.url).href; } catch { return ""; }
};
</script>

<style scoped>
@keyframes routeMove { to { stroke-dashoffset: -24; } }
.animate-route-flow { animation: routeMove 1s linear infinite; }

@keyframes customMove { to { stroke-dashoffset: -16; } }
.animate-custom-flow { animation: customMove 0.8s linear infinite; }

@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.animate-fade-in { animation: fadeIn 0.18s cubic-bezier(0.215, 0.610, 0.355, 1) forwards; }

.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.01); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.08); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.18); }
</style>