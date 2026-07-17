<!-- <template>
  <div class="min-h-screen bg-app text-main px-4 md:px-8 py-6 relative font-sans select-none">
    
    <div 
      v-if="showCrossFloorModal" 
      class="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
    >
      <div 
        class="bg-panel border border-line w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col gap-5 relative text-center"
        style="box-shadow: 0 25px 70px rgba(0,0,0,0.8);"
      >
        <div class="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto text-2xl animate-pulse">
          📍
        </div>
        
        <div class="flex flex-col gap-1">
          <h2 class="text-xl font-black uppercase tracking-tight text-main font-mono">Cross-Floor Route Detected</h2>
          <p class="text-xs text-muted max-w-sm mx-auto font-sans leading-relaxed">
            You are standing at the <span class="text-main font-bold">{{ activeKioskProfile?.name || 'Current Station' }}</span>. Your destination is located on <span class="text-red-400 font-bold">Level {{ location?.floor }}</span>.
          </p>
        </div>

        <div class="border-t border-b border-line/30 py-4 flex flex-col gap-2.5">
          <span class="text-[10px] uppercase tracking-widest font-mono font-bold text-muted/60">Choose Transit Method:</span>
          
          <div class="flex flex-col gap-2">
            <button
              v-for="mode in [
                { id: 'lift', label: 'Use Lift', icon: '🛗' },
                { id: 'escalator', label: 'Use Escalator', icon: '𓊍' },
                { id: 'stairs', label: 'Use Central Stairs', icon: '目' }
              ]"
              :key="mode.id"
              type="button"
              @click="confirmInitialTransit(mode.id)"
              class="w-full py-3 px-4 rounded-xl border border-line/80 bg-white/[0.01] hover:border-red-500/50 hover:bg-white/[0.04] text-muted hover:text-main font-bold flex items-center gap-3 transition-all duration-200 cursor-pointer group focus:outline-none"
            >
              <span class="text-xl group-hover:scale-110 transform transition-transform">{{ mode.icon }}</span>
              <span class="text-xs uppercase tracking-wide font-mono flex-grow text-left">{{ mode.label }}</span>
              <span class="text-xs text-muted/30 group-hover:text-red-400">➔</span>
            </button>
          </div>
        </div>
      </div>
    </div>

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
            <p class="text-xs text-muted font-medium mt-0.5">Floor Location: Lvl {{ selectedDeviceDetails.floor }}</p>
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

      <div class="lg:col-span-9 bg-panel/30 border border-line rounded-3xl p-4 flex flex-col relative shadow-xl h-full overflow-hidden">
        
        <div v-if="!isCrossFloor" class="absolute top-6 left-6 z-50 flex items-center bg-panel p-1 rounded-xl border border-line shadow-lg font-mono">
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
          v-if="isCrossFloor"
          class="absolute left-6 top-1/2 -translate-y-1/2 z-50 bg-panel/80 backdrop-blur-xl border border-line p-2 rounded-2xl flex flex-col gap-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] animate-fade-in"
        >
          <button
            v-for="mode in [
              { id: 'lift', title: 'Elevator Route', icon: '🛗' },
              { id: 'escalator', title: 'Escalator Route', icon: '🪜' },
              { id: 'stairs', title: 'Stairs Route', icon: '🚶' }
            ]"
            :key="mode.id"
            type="button"
            @click="selectedTransitMode = mode.id"
            :title="mode.title"
            class="w-12 h-12 rounded-xl border flex items-center justify-center text-xl transition-all duration-300 cursor-pointer focus:outline-none transform active:scale-95 group/dock"
            :class="selectedTransitMode === mode.id 
              ? 'bg-red-500 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] scale-105' 
              : 'bg-white/5 border-line/40 text-muted hover:text-main hover:bg-white/10 hover:border-line'"
          >
            <span class="group-hover/dock:scale-110 transition-transform duration-200">{{ mode.icon }}</span>
          </button>
        </div>

        <div class="flex-1 w-full flex flex-col gap-4 h-full relative">
          
          <div 
            v-if="fullscreenTargetMap" 
            class="absolute top-2 left-1/2 -translate-x-1/2 z-[105] flex items-center gap-3 bg-red-600 border border-red-500 font-mono text-[10px] font-black tracking-widest text-white px-5 py-2 rounded-full shadow-2xl animate-bounce cursor-pointer"
            @click.stop="fullscreenTargetMap = null"
          >
            <span>✕ EXIT FULLSCREEN ZOOM MODE</span>
          </div>

          <div 
            v-if="!fullscreenTargetMap || fullscreenTargetMap === 'target'"
            @mousedown="handleMapMouseDown($event, 'target')"
            @mousemove="onPan($event, 'target')"
            @mouseup="endPan"
            @mouseleave="endPan"
            @wheel="onZoom($event, 'target')"
            @click="handleMapClick('target')"
            class="relative border rounded-2xl overflow-hidden bg-white shadow-md transition-all duration-300 group/map flex flex-col select-none"
            :class="[
              isCrossFloor ? 'h-[52%] hover:border-red-500/40 hover:shadow-xl' : 'h-full',
              fullscreenTargetMap === 'target' ? '!absolute !inset-0 !h-full !w-full !z-[100] !scale-100' : ''
            ]"
          >
            <div class="absolute top-3 left-16 z-30 font-mono text-[10px] font-bold bg-black/80 text-white px-3 py-1 rounded-xl border border-white/10 shadow-md">
              {{ isCrossFloor ? `PRIMARY DESTINATION LEVEL: LVL 0${location.floor}` : `CURRENT LAYER VIEW: LVL 0${activeFloor}` }}
            </div>

            <div class="w-full h-full relative overflow-hidden bg-white">
              <div 
                class="w-full h-full origin-center flex items-center justify-center transition-none"
                :style="{ transform: `translate(${targetPan.x}px, ${targetPan.y}px) scale(${targetZoom})` }"
              >
                <svg ref="mapSvgRef" class="w-[800px] h-[600px] shrink-0" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                  <defs><clipPath id="destClip"><circle cx="0" cy="-40" r="16" /></clipPath></defs>
                  <rect width="800" height="600" fill="#ffffff" />
                  <component :is="isCrossFloor ? getComponentForFloor(location.floor) : floorComponent" :phone="location" />

                  <g v-if="location">
                    <path 
                      v-if="isCrossFloor ? getSegmentPath('target_floor_segment') : targetedRoutePath" 
                      :d="isCrossFloor ? getSegmentPath('target_floor_segment') : targetedRoutePath" 
                      fill="none" 
                      stroke="#ef4444" 
                      stroke-width="5" 
                      stroke-dasharray="12,10" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      class="animate-route-flow" 
                    />
                    
                    <g v-if="!isCrossFloor || activeFloor === location.floor" :transform="`translate(${location.mapX}, ${location.mapY})`">
                      <circle cx="0" cy="0" r="32" fill="#ef4444" opacity="0.12" class="animate-pulse" />
                      <ellipse cx="0" cy="2" rx="7" ry="2.5" fill="rgba(0, 0, 0, 0.25)" />
                      <path d="M 0 0 C -14 -18 -22 -28 -22 -40 A 22 22 0 1 1 22 -40 C 22 -28 14 -18 0 0 Z" fill="#ef4444" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round" />
                      <circle cx="0" cy="-40" r="16" fill="#ffffff" />
                      <image :href="getLocationImageUrl(location.image)" x="-16" y="-56" width="32" height="32" clip-path="url(#destClip)" preserveAspectRatio="xMidYMid meet" />
                    </g>
                  </g>

                  <g v-if="isCrossFloor && kioskRegistry?.transitHubs?.[selectedTransitMode]">
                    <g v-for="hub in kioskRegistry.transitHubs[selectedTransitMode].filter(h => h.floor === location.floor)" :key="hub.floor" :transform="`translate(${hub.x}, ${hub.y})`">
                      <circle cx="0" cy="0" r="18" fill="#38bdf8" opacity="0.25" class="animate-ping" />
                      <circle cx="0" cy="0" r="8" fill="#38bdf8" stroke="#ffffff" stroke-width="2" />
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <div v-if="isCrossFloor && !fullscreenTargetMap" class="h-4 flex items-center justify-center font-mono text-[9px] font-black tracking-[0.2em] text-muted/40 relative select-none">
            <div class="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-line to-transparent"></div>
            <span class="bg-[#121214] px-4 py-0.5 rounded border border-line uppercase text-sky-400">
              ➔ INTERSECT STACK TRANSIT VIA {{ selectedTransitMode }} ➔
            </span>
          </div>

          <div 
            v-if="isCrossFloor && activeKioskProfile && (!fullscreenTargetMap || fullscreenTargetMap === 'source')"
            @mousedown="handleMapMouseDown($event, 'source')"
            @mousemove="onPan($event, 'source')"
            @mouseup="endPan"
            @mouseleave="endPan"
            @wheel="onZoom($event, 'source')"
            @click="handleMapClick('source')"
            class="relative border rounded-2xl overflow-hidden bg-white shadow-md transition-all duration-300 group/map flex flex-col select-none"
            :class="[
              isCrossFloor ? 'h-[42%] hover:border-emerald-500/40 hover:shadow-xl' : 'hidden',
              fullscreenTargetMap === 'source' ? '!absolute !inset-0 !h-full !w-full !z-[100] !scale-100' : ''
            ]"
          >
            <div class="absolute top-3 left-16 z-30 font-mono text-[10px] font-bold bg-black/80 text-white px-3 py-1 rounded-xl border border-white/10 shadow-md">
              STARTING KIOSK SOURCE: LVL 0{{ activeKioskProfile.floor }}
            </div>

            <div class="w-full h-full relative overflow-hidden bg-white">
              <div 
                class="w-full h-full origin-center flex items-center justify-center transition-none"
                :style="{ transform: `translate(${sourcePan.x}px, ${sourcePan.y}px) scale(${sourceZoom})` }"
              >
                <svg class="w-[800px] h-[600px] shrink-0" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                  <rect width="800" height="600" fill="#ffffff" />
                  <component :is="getComponentForFloor(activeKioskProfile.floor)" :phone="location" />

                  <path 
                    v-if="getSegmentPath('start_floor_segment')" 
                    :d="getSegmentPath('start_floor_segment')" 
                    fill="none" 
                    stroke="#10b981" 
                    stroke-width="5" 
                    stroke-dasharray="12,10" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    class="animate-route-flow" 
                  />

                  <g :transform="`translate(${activeKioskProfile.x}, ${activeKioskProfile.y})`">
                    <circle cx="0" cy="0" r="32" fill="#10b981" opacity="0.15" class="animate-pulse" />
                    <ellipse cx="0" cy="2" rx="7" ry="2.5" fill="rgba(0, 0, 0, 0.2)" />
                    <path d="M 0 0 C -14 -18 -22 -28 -22 -40 A 22 22 0 1 1 22 -40 C 22 -28 14 -18 0 0 Z" fill="#10b981" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round" />
                    <circle cx="0" cy="-40" r="9" fill="#ffffff" />
                    <circle cx="0" cy="-40" r="4" fill="#10b981" />
                  </g>

                  <g v-if="kioskRegistry?.transitHubs?.[selectedTransitMode]">
                    <g v-for="hub in kioskRegistry.transitHubs[selectedTransitMode].filter(h => h.floor === activeKioskProfile.floor)" :key="hub.floor" :transform="`translate(${hub.x}, ${hub.y})`">
                      <circle cx="0" cy="0" r="18" fill="#38bdf8" opacity="0.25" class="animate-ping" />
                      <circle cx="0" cy="0" r="7" fill="#38bdf8" stroke="#ffffff" stroke-width="2" />
                    </g>
                  </g>

                  <div @click="handleMapWorkspaceClick($event)">
// wave path points comment when dont need it 
// also change the script as well when want to use it 
  <svg ref="svgContainerElement">
    <g v-if="tracerRef?.computedPathString">
      <path 
        :d="tracerRef.computedPathString" 
        fill="none" 
        stroke="#10b981" 
        stroke-width="5" 
        stroke-dasharray="8,8" 
        stroke-linecap="round" 
        class="animate-custom-flow" 
      />
      <circle 
        v-for="(node, idx) in tracerRef.waypointNodes" 
        :key="idx" 
        :cx="node.x" 
        :cy="node.y" 
        r="6" 
        fill="#10b981" 
        stroke="#ffffff" 
        stroke-width="2" 
      />
    </g>
  </svg>

  <WaypointCreator ref="tracerRef" />
</div>
                </svg>
              </div>
            </div>
          </div>

        </div>

        <div class="mt-3 flex justify-between items-center text-xs text-muted/60 font-mono bg-panel/5 p-3 rounded-xl border border-zinc-200 z-10 select-none">
          <div class="flex items-center gap-2 text-muted font-bold">
            <span class="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse"></span> 
            {{ isCrossFloor ? 'Kiosk Grid Layout: Tap anywhere over either layout box to toggle full kiosk viewing modes' : `Blueprint Matrix: Level ${activeFloor} Map Active` }}
          </div>
          <button v-if="isCrossFloor" @click="resetMapsPanZoom" class="text-[10px] text-red-400 font-bold uppercase tracking-wider hover:underline focus:outline-none cursor-pointer">Recenter Viewports</button>
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
// comment when dont need it 
import WaypointCreator from '@/components/UI/WaypointCreator.vue';
import CustomSelect from "@/components/Header/CustomSelect.vue";


// comment when not need wavepoint it is 
const tracerRef = ref(null);
const svgContainerElement = ref(null);

const handleMapWorkspaceClick = (event) => {
  if (tracerRef.value && svgContainerElement.value) {
    // Passes the click event directly into the tracker matrix, matching your map zoom scale profiles
    tracerRef.value.injectCanvasClickNode(
      event, 
      svgContainerElement.value, 
      targetZoom.value, // Pass your zoom parameter variable here
      targetPan.value   // Pass your pan parameter variables here
    );
  }
};

// till here

const route = useRoute();
const router = useRouter();

const allLocations = ref([]);
const brandList = ref([]);
const activeFloor = ref(1);

const mapSvgRef = ref(null);
const customNodes = ref([]);
const hasDraggedMoved = ref(false);
const copiedStatus = ref(false);

// MULTI-KIOSK BACKGROUND PROCESS SETTINGS ALLOCATION LAYERS



// Change the KIOSK 
const currentKioskId = ref('kiosk_floor2_atrium');
const activeKioskProfile = ref(null);
const kioskRegistry = ref({ kiosks: [], transitHubs: { lift: [], escalator: [], stairs: [] } });

// Cross Floor Interactive States
const selectedTransitMode = ref('lift'); 
const showCrossFloorModal = ref(false); 
const fullscreenTargetMap = ref(null); // 'target' || 'source' || null

const isModalOpen = ref(false);
const selectedDeviceDetails = ref(null);

//  DUAL RETAINED ZOOM AND PAN CONFIG REGISTRIES
const targetZoom = ref(0.5);
const targetPan = ref({ x: 0, y: 0 });
const sourceZoom = ref(0.5);
const sourcePan = ref({ x: 0, y: 0 });

const activeDragViewport = ref(null); // Tracks 'target' or 'source' context explicitly
const isDragging = ref(false);
const startMouseX = ref(0);
const startMouseY = ref(0);

const location = computed(() => {
  return allLocations.value.find(item => 
    String(item.id) === String(route.params.id) || 
    String(item.brandId) === String(route.params.id)
  );
});

const isCrossFloor = computed(() => {
  if (!location.value || !activeKioskProfile.value) return false;
  return activeKioskProfile.value.floor !== location.value.floor;
});

const checkCrossFloorStatus = () => {
  if (isCrossFloor.value) {
    showCrossFloorModal.value = true;
  } else {
    showCrossFloorModal.value = false;
  }
};

const confirmInitialTransit = (modeId) => {
  selectedTransitMode.value = modeId;
  showCrossFloorModal.value = false;
};

const getComponentForFloor = (floorNum) => {
  if (floorNum === 3) return Floor3;
  if (floorNum === 2) return Floor2;
  return Floor1;
};

const getSegmentPath = (segmentKey) => {
  if (!location.value) return '';
  const paths = location.value.kioskPaths?.[currentKioskId.value];
  if (!paths || typeof paths === 'string') return '';
  return paths[selectedTransitMode.value]?.[segmentKey] || '';
};

const targetedRoutePath = computed(() => {
  if (!location.value || !activeKioskProfile.value) return '';
  const paths = location.value.kioskPaths?.[currentKioskId.value];
  if (!paths) return '';

  if (activeKioskProfile.value.floor === location.value.floor) {
    return typeof paths === 'string' ? paths : '';
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
  return getComponentForFloor(activeFloor.value);
});

const customPathString = computed(() => {
  if (customNodes.value.length === 0) return '';
  return customNodes.value.reduce((path, node, index) => {
    return index === 0 ? `M ${node.x} ${node.y}` : `${path} L ${node.x} ${node.y}`;
  }, '');
});

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
  fullscreenTargetMap.value = null; 
  resetMapsPanZoom();
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

// 🌟 ISOLATED ADVANCED DRAG AND ZOOM ALGORITHMS ENGINE BLOCK
const handleMapMouseDown = (event, viewType) => {
  isDragging.value = true;
  hasDraggedMoved.value = false;
  activeDragViewport.value = isCrossFloor.value ? viewType : 'target';
  
  const targetRegistry = activeDragViewport.value === 'target' ? targetPan.value : sourcePan.value;
  startMouseX.value = event.clientX - targetRegistry.x;
  startMouseY.value = event.clientY - targetRegistry.y;
};

const onPan = (event, viewType) => {
  if (!isDragging.value || activeDragViewport.value !== viewType) return;
  hasDraggedMoved.value = true;
  
  const currentRegistry = activeDragViewport.value === 'target' ? targetPan : sourcePan;
  currentRegistry.value = {
    x: event.clientX - startMouseX.value,
    y: event.clientY - startMouseY.value
  };
};

const endPan = () => {
  isDragging.value = false;
};

const onZoom = (event, viewType) => {
  event.preventDefault();
  const scopeType = isCrossFloor.value ? viewType : 'target';
  const registryZoom = scopeType === 'target' ? targetZoom : sourceZoom;
  
  registryZoom.value = Math.min(Math.max(0.5, registryZoom.value + (event.deltaY * -0.0018)), 3.5);
};

const handleMapClick = (viewType) => {
  // If the user was dragging the blueprint canvas layout around, ignore expansion clicks
  if (hasDraggedMoved.value) return;
  
  if (isCrossFloor.value) {
    fullscreenTargetMap.value = fullscreenTargetMap.value ? null : viewType;
  }
};

const resetMapsPanZoom = () => {
  targetZoom.value = 1.0;
  targetPan.value = { x: 0, y: 0 };
  sourceZoom.value = 1.0;
  sourcePan.value = { x: 0, y: 0 };
};

// Layout Config Synchronizers
watch(location, (newLocation) => {
  if (newLocation) {
    if (!isCrossFloor.value) {
      activeFloor.value = newLocation.floor;
    }
    checkCrossFloorStatus();
  }
}, { immediate: true });

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

    if (kioskRegistry.value && Array.isArray(kioskRegistry.value.kiosks)) {
      activeKioskProfile.value = kioskRegistry.value.kiosks.find(k => k.id === currentKioskId.value);
    }

    if (activeKioskProfile.value && !isCrossFloor.value) {
      activeFloor.value = activeKioskProfile.value.floor;
    }

    checkCrossFloorStatus();

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

@keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
.animate-fade-in { animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.01); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.08); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.18); }
</style> -->

<template>
  <div class="min-h-screen bg-app text-main px-4 md:px-8 py-6 relative font-sans select-none">
    
    <div 
      v-if="showCrossFloorModal" 
      class="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
    >
      <div 
        class="bg-panel border border-line w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col gap-5 relative text-center"
        style="box-shadow: 0 25px 70px rgba(0,0,0,0.8);"
      >
        <div class="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto text-2xl animate-pulse">
          📍
        </div>
        
        <div class="flex flex-col gap-1">
          <h2 class="text-xl font-black uppercase tracking-tight text-main font-mono">Cross-Floor Route Detected</h2>
          <p class="text-xs text-muted max-w-sm mx-auto font-sans leading-relaxed">
            You are standing at the <span class="text-main font-bold">{{ activeKioskProfile?.name || 'Current Station' }}</span>. Your destination is located on <span class="text-red-400 font-bold">Level {{ location?.floor }}</span>.
          </p>
        </div>

        <div class="border-t border-b border-line/30 py-4 flex flex-col gap-2.5">
          <span class="text-[10px] uppercase tracking-widest font-mono font-bold text-muted/60">Choose Transit Method:</span>
          
          <div class="flex flex-col gap-2">
            <button
              v-for="mode in [
                { id: 'lift', label: 'Use Lift', icon: '🛗' },
                { id: 'escalator', label: 'Use Escalator', icon: '𓊍' },
                { id: 'stairs', label: 'Use Central Stairs', icon: '目' }
              ]"
              :key="mode.id"
              type="button"
              @click="confirmInitialTransit(mode.id)"
              class="w-full py-3 px-4 rounded-xl border border-line/80 bg-white/[0.01] hover:border-red-500/50 hover:bg-white/[0.04] text-muted hover:text-main font-bold flex items-center gap-3 transition-all duration-200 cursor-pointer group focus:outline-none"
            >
              <span class="text-xl group-hover:scale-110 transform transition-transform">{{ mode.icon }}</span>
              <span class="text-xs uppercase tracking-wide font-mono flex-grow text-left">{{ mode.label }}</span>
              <span class="text-xs text-muted/30 group-hover:text-red-400">➔</span>
            </button>
          </div>
        </div>
      </div>
    </div>

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
            <p class="text-xs text-muted font-medium mt-0.5">Floor Location: Lvl {{ selectedDeviceDetails.floor }}</p>
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
        
        <div class="mb-4 bg-zinc-900/40 border border-zinc-800 rounded-xl p-3 font-mono text-xs">
          <label class="text-[10px] text-emerald-400 uppercase tracking-widest font-bold block mb-2 ml-1">
            🖥️ Active Kiosk Station Context
          </label>
          <CustomSelect 
            :modelValue="currentKioskId"
            :options="kioskRegistry.kiosks"
            labelKey="name"
            valueKey="id"
            @change="handleKioskContextSwitch"
          />
          <div class="mt-1.5 px-1 text-[10px] text-zinc-500 flex justify-between items-center">
            <span>Terminal Level Status:</span>
            <span class="text-zinc-300 font-bold">Lvl {{ activeKioskProfile?.floor || '1' }}</span>
          </div>
        </div>

        <div 
          v-if="isCrossFloor"
          class="mb-3 bg-white/5 border border-line/60 rounded-xl p-3 font-mono text-xs"
        >
          <span class="text-red-400 font-black tracking-wider uppercase block mb-2 text-[10px]">
            🔀 Alternate Intersect Nodes
          </span>
          <div class="flex flex-col gap-1.5">
            <button
              v-for="(mode, index) in [
                { id: 'lift', label: 'Elevator Node', icon: '🛗' },
                { id: 'escalator', label: 'Escalator Node', icon: '🪜' },
                { id: 'stairs', label: 'Stairs Node', icon: '🚶' }
              ]"
              :key="mode.id"
              type="button"
              @click="selectedTransitMode = mode.id"
              class="w-full py-2 px-3 rounded-lg border text-left flex items-center gap-2.5 transition-colors cursor-pointer focus:outline-none text-xs font-bold"
              :class="selectedTransitMode === mode.id 
                ? 'bg-red-500/10 border-red-500 text-main shadow-sm' 
                : 'bg-transparent border-line/40 text-muted hover:text-main hover:bg-white/5'"
            >
              <span class="text-[10px] text-muted/40 font-mono">0{{ index + 1 }}</span>
              <span>{{ mode.icon }}</span>
              <span class="uppercase text-[11px] font-mono tracking-wide flex-grow">{{ mode.label }}</span>
              <span v-if="selectedTransitMode === mode.id" class="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            </button>
          </div>
        </div>

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

      <div class="lg:col-span-9 bg-panel/30 border border-line rounded-3xl p-4 flex flex-col relative shadow-xl h-full overflow-hidden">
        
        <div v-if="!isCrossFloor" class="absolute top-6 left-6 z-50 flex items-center bg-panel p-1 rounded-xl border border-line shadow-lg font-mono">
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
          v-if="isCrossFloor"
          class="absolute left-6 top-1/2 -translate-y-1/2 z-50 bg-panel/80 backdrop-blur-xl border border-line p-2 rounded-2xl flex flex-col gap-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] animate-fade-in"
        >
          <button
            v-for="mode in [
              { id: 'lift', title: 'Elevator Route', icon: '🛗' },
              { id: 'escalator', title: 'Escalator Route', icon: '🪜' },
              { id: 'stairs', title: 'Stairs Route', icon: '🚶' }
            ]"
            :key="mode.id"
            type="button"
            @click="selectedTransitMode = mode.id"
            :title="mode.title"
            class="w-12 h-12 rounded-xl border flex items-center justify-center text-xl transition-all duration-300 cursor-pointer focus:outline-none transform active:scale-95 group/dock"
            :class="selectedTransitMode === mode.id 
              ? 'bg-red-500 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] scale-105' 
              : 'bg-white/5 border-line/40 text-muted hover:text-main hover:bg-white/10 hover:border-line'"
          >
            <span class="group-hover/dock:scale-110 transition-transform duration-200">{{ mode.icon }}</span>
          </button>
        </div>

        <div class="flex-1 w-full flex flex-col gap-4 h-full relative">
          
          <div 
            v-if="fullscreenTargetMap" 
            class="absolute top-2 left-1/2 -translate-x-1/2 z-[105] flex items-center gap-3 bg-red-600 border border-red-500 font-mono text-[10px] font-black tracking-widest text-white px-5 py-2 rounded-full shadow-2xl animate-bounce cursor-pointer"
            @click.stop="fullscreenTargetMap = null"
          >
            <span>✕ EXIT FULLSCREEN ZOOM MODE</span>
          </div>

          <div 
            v-if="!fullscreenTargetMap || fullscreenTargetMap === 'target'"
            @mousedown="handleMapMouseDown($event, 'target')"
            @mousemove="onPan($event, 'target')"
            @mouseup="endPan"
            @mouseleave="endPan"
            @wheel="onZoom($event, 'target')"
            class="relative border rounded-2xl overflow-hidden bg-white shadow-md transition-all duration-300 group/map flex flex-col select-none"
            :class="[
              isCrossFloor ? 'h-[52%] hover:border-red-500/40 hover:shadow-xl' : 'h-full',
              fullscreenTargetMap === 'target' ? '!absolute !inset-0 !h-full !w-full !z-[100] !scale-100' : ''
            ]"
          >
            <div class="absolute top-3 left-16 z-30 font-mono text-[10px] font-bold bg-black/80 text-white px-3 py-1 rounded-xl border border-white/10 shadow-md">
              {{ isCrossFloor ? `PRIMARY DESTINATION LEVEL: LVL 0${location.floor}` : `CURRENT LAYER VIEW: LVL 0${activeFloor}` }}
            </div>

            <div class="absolute bottom-4 right-4 z-50 flex gap-2">
              <button 
                v-if="isCrossFloor"
                @click.stop="fullscreenTargetMap = fullscreenTargetMap ? null : 'target'"
                class="w-10 h-10 bg-black/80 hover:bg-black border border-line text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-xl transition-all active:scale-95 cursor-pointer focus:outline-none"
                title="Toggle Fullscreen"
              >
                {{ fullscreenTargetMap === 'target' ? '✕' : '⛶' }}
              </button>
            </div>

            <div class="w-full h-full relative overflow-hidden bg-white">
              <div 
                class="w-full h-full origin-center flex items-center justify-center transition-none"
                :style="{ transform: `translate(${targetPan.x}px, ${targetPan.y}px) scale(${targetZoom})` }"
              >
                <svg data-target-map ref="mapSvgRef" @click="handleMapWorkspaceClick($event)" class="w-[800px] h-[600px] shrink-0" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                  <defs><clipPath id="destClip"><circle cx="0" cy="-40" r="16" /></clipPath></defs>
                  <rect width="800" height="600" fill="#ffffff" />
                  <component :is="isCrossFloor ? getComponentForFloor(location.floor) : floorComponent" :phone="location" />

                  <g v-if="location">
                    <path 
                      v-if="isCrossFloor ? getSegmentPath('target_floor_segment') : targetedRoutePath" 
                      :d="isCrossFloor ? getSegmentPath('target_floor_segment') : targetedRoutePath" 
                      fill="none" 
                      stroke="#ef4444" 
                      stroke-width="5" 
                      stroke-dasharray="12,10" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      class="animate-route-flow" 
                    />
                    
                    <g v-if="!isCrossFloor || activeFloor === location.floor" :transform="`translate(${location.mapX}, ${location.mapY})`">
                      <circle cx="0" cy="0" r="32" fill="#ef4444" opacity="0.12" class="animate-pulse" />
                      <ellipse cx="0" cy="2" rx="7" ry="2.5" fill="rgba(0, 0, 0, 0.25)" />
                      <path d="M 0 0 C -14 -18 -22 -28 -22 -40 A 22 22 0 1 1 22 -40 C 22 -28 14 -18 0 0 Z" fill="#ef4444" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round" />
                      <circle cx="0" cy="-40" r="16" fill="#ffffff" />
                      <image :href="getLocationImageUrl(location.image)" x="-16" y="-56" width="32" height="32" clip-path="url(#destClip)" preserveAspectRatio="xMidYMid meet" />
                    </g>
                  </g>

                  <g v-if="isCrossFloor && kioskRegistry?.transitHubs?.[selectedTransitMode]">
                    <g v-for="hub in kioskRegistry.transitHubs[selectedTransitMode].filter(h => h.floor === location.floor)" :key="hub.floor" :transform="`translate(${hub.x}, ${hub.y})`">
                      <circle cx="0" cy="0" r="18" fill="#38bdf8" opacity="0.25" class="animate-ping" />
                      <circle cx="0" cy="0" r="8" fill="#38bdf8" stroke="#ffffff" stroke-width="2" />
                    </g>
                  </g>

                  <g v-if="tracerRef?.computedPathString">
                    <path 
                      :d="tracerRef.computedPathString" 
                      fill="none" 
                      stroke="#10b981" 
                      stroke-width="5" 
                      stroke-dasharray="8,8" 
                      stroke-linecap="round" 
                      class="animate-custom-flow" 
                    />
                    <circle 
                      v-for="(node, idx) in tracerRef.waypointNodes" 
                      :key="idx" 
                      :cx="node.x" 
                      :cy="node.y" 
                      r="6" 
                      fill="#10b981" 
                      stroke="#ffffff" 
                      stroke-width="2" 
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <div v-if="isCrossFloor && !fullscreenTargetMap" class="h-4 flex items-center justify-center font-mono text-[9px] font-black tracking-[0.2em] text-muted/40 relative select-none">
            <div class="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-line to-transparent"></div>
            <span class="bg-[#121214] px-4 py-0.5 rounded border border-line uppercase text-sky-400">
              ➔ INTERSECT STACK TRANSIT VIA {{ selectedTransitMode }} ➔
            </span>
          </div>

          <div 
            v-if="isCrossFloor && activeKioskProfile && (!fullscreenTargetMap || fullscreenTargetMap === 'source')"
            @mousedown="handleMapMouseDown($event, 'source')"
            @mousemove="onPan($event, 'source')"
            @mouseup="endPan"
            @mouseleave="endPan"
            @wheel="onZoom($event, 'source')"
            class="relative border rounded-2xl overflow-hidden bg-white shadow-md transition-all duration-300 group/map flex flex-col select-none"
            :class="[
              isCrossFloor ? 'h-[42%] hover:border-emerald-500/40 hover:shadow-xl' : 'hidden',
              fullscreenTargetMap === 'source' ? '!absolute !inset-0 !h-full !w-full !z-[100] !scale-100' : ''
            ]"
          >
            <div class="absolute top-3 left-16 z-30 font-mono text-[10px] font-bold bg-black/80 text-white px-3 py-1 rounded-xl border border-white/10 shadow-md">
              STARTING KIOSK SOURCE: LVL 0{{ activeKioskProfile.floor }}
            </div>

            <div class="absolute bottom-4 right-4 z-50 flex gap-2">
              <button 
                @click.stop="fullscreenTargetMap = fullscreenTargetMap ? null : 'source'"
                class="w-10 h-10 bg-black/80 hover:bg-black border border-line text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-xl transition-all active:scale-95 cursor-pointer focus:outline-none"
                title="Toggle Fullscreen"
              >
                {{ fullscreenTargetMap === 'source' ? '✕' : '⛶' }}
              </button>
            </div>

            <div class="w-full h-full relative overflow-hidden bg-white">
              <div 
                class="w-full h-full origin-center flex items-center justify-center transition-none"
                :style="{ transform: `translate(${sourcePan.x}px, ${sourcePan.y}px) scale(${sourceZoom})` }"
              >
                <svg data-source-map @click="handleMapWorkspaceClick($event)" class="w-[800px] h-[600px] shrink-0" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                  <rect width="800" height="600" fill="#ffffff" />
                  <component :is="getComponentForFloor(activeKioskProfile.floor)" :phone="location" />

                  <path 
                    v-if="getSegmentPath('start_floor_segment')" 
                    :d="getSegmentPath('start_floor_segment')" 
                    fill="none" 
                    stroke="#10b981" 
                    stroke-width="5" 
                    stroke-dasharray="12,10" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    class="animate-route-flow" 
                  />

                  <g :transform="`translate(${activeKioskProfile.x}, ${activeKioskProfile.y})`">
                    <circle cx="0" cy="0" r="32" fill="#10b981" opacity="0.15" class="animate-pulse" />
                    <ellipse cx="0" cy="2" rx="7" ry="2.5" fill="rgba(0, 0, 0, 0.2)" />
                    <path d="M 0 0 C -14 -18 -22 -28 -22 -40 A 22 22 0 1 1 22 -40 C 22 -28 14 -18 0 0 Z" fill="#10b981" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round" />
                    <circle cx="0" cy="-40" r="9" fill="#ffffff" />
                    <circle cx="0" cy="-40" r="4" fill="#10b981" />
                  </g>

                  <g v-if="kioskRegistry?.transitHubs?.[selectedTransitMode]">
                    <g v-for="hub in kioskRegistry.transitHubs[selectedTransitMode].filter(h => h.floor === activeKioskProfile.floor)" :key="hub.floor" :transform="`translate(${hub.x}, ${hub.y})`">
                      <circle cx="0" cy="0" r="18" fill="#38bdf8" opacity="0.25" class="animate-ping" />
                      <circle cx="0" cy="0" r="7" fill="#38bdf8" stroke="#ffffff" stroke-width="2" />
                    </g>
                  </g>

                  <g v-if="tracerRef?.computedPathString">
                    <path 
                      :d="tracerRef.computedPathString" 
                      fill="none" 
                      stroke="#10b981" 
                      stroke-width="5" 
                      stroke-dasharray="8,8" 
                      stroke-linecap="round" 
                      class="animate-custom-flow" 
                    />
                    <circle 
                      v-for="(node, idx) in tracerRef.waypointNodes" 
                      :key="idx" 
                      :cx="node.x" 
                      :cy="node.y" 
                      r="6" 
                      fill="#10b981" 
                      stroke="#ffffff" 
                      stroke-width="2" 
                    />
                  </g>
                </svg>
              </div>
            </div>
            <WaypointCreator ref="tracerRef" />
          </div>

        </div>

        <div class="mt-3 flex justify-between items-center text-xs text-muted/60 font-mono bg-panel/5 p-3 rounded-xl border border-zinc-200 z-10 select-none">
          <div class="flex items-center gap-2 text-muted font-bold">
            <span class="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse"></span> 
            {{ isCrossFloor ? 'Kiosk Grid Layout: Drop waypoints smoothly or toggle fullscreen via the panel actions buttons' : `Blueprint Matrix: Level ${activeFloor} Map Active` }}
          </div>
          <button v-if="isCrossFloor" @click="resetMapsPanZoom" class="text-[10px] text-red-400 font-bold uppercase tracking-wider hover:underline focus:outline-none cursor-pointer">Recenter Viewports</button>
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
import WaypointCreator from '@/components/UI/WaypointCreator.vue';
import CustomSelect from "@/components/Header/CustomSelect.vue";

const tracerRef = ref(null);

const handleMapWorkspaceClick = (event) => {
  if (hasDraggedMoved.value) return;

  if (tracerRef.value && event.currentTarget) {
    const isTargetMap = event.currentTarget.hasAttribute('data-target-map');
    
    const zoomContext = isTargetMap ? targetZoom.value : sourceZoom.value;
    const panContext = isTargetMap ? targetPan.value : sourcePan.value;
    
    tracerRef.value.injectCanvasClickNode(
      event, 
      event.currentTarget, 
      zoomContext,
      panContext
    );
  }
};

const route = useRoute();
const router = useRouter();

const allLocations = ref([]);
const brandList = ref([]);
const activeFloor = ref(1);

const mapSvgRef = ref(null);
const customNodes = ref([]);
const hasDraggedMoved = ref(false);
const copiedStatus = ref(false);

// 🖥️ MULTI-KIOSK DYNAMIC REGISTRY HOOKS
const currentKioskId = ref(localStorage.getItem('ACTIVE_KIOSK_ID') || 'kiosk_floor2_atrium');
const activeKioskProfile = ref(null);
const kioskRegistry = ref({ kiosks: [], transitHubs: { lift: [], escalator: [], stairs: [] } });

const selectedTransitMode = ref('lift'); 
const showCrossFloorModal = ref(false); 
const fullscreenTargetMap = ref(null); 

const isModalOpen = ref(false);
const selectedDeviceDetails = ref(null);

const targetZoom = ref(0.5);
const targetPan = ref({ x: 0, y: 0 });
const sourceZoom = ref(0.5);
const sourcePan = ref({ x: 0, y: 0 });

const activeDragViewport = ref(null); 
const isDragging = ref(false);
const startMouseX = ref(0);
const startMouseY = ref(0);

const location = computed(() => {
  return allLocations.value.find(item => 
    String(item.id) === String(route.params.id) || 
    String(item.brandId) === String(route.params.id)
  );
});

const isCrossFloor = computed(() => {
  if (!location.value || !activeKioskProfile.value) return false;
  return activeKioskProfile.value.floor !== location.value.floor;
});

const checkCrossFloorStatus = () => {
  if (isCrossFloor.value) {
    showCrossFloorModal.value = true;
  } else {
    showCrossFloorModal.value = false;
  }
};

// 🖥️ NEW: LIVE FRONTEND KIOSK HOT-SWAP CONTEXT METHOD
const handleKioskContextSwitch = (newKioskId) => {
  currentKioskId.value = newKioskId;
  localStorage.setItem('ACTIVE_KIOSK_ID', newKioskId);
  
  if (kioskRegistry.value && Array.isArray(kioskRegistry.value.kiosks)) {
    activeKioskProfile.value = kioskRegistry.value.kiosks.find(k => k.id === newKioskId);
  }
  
  fullscreenTargetMap.value = null;
  resetMapsPanZoom();
  checkCrossFloorStatus();
  
  // Re-adjust floor viewport based on the newly selected kiosk's native floor index
  if (activeKioskProfile.value && !isCrossFloor.value) {
    activeFloor.value = activeKioskProfile.value.floor;
  }
};

const confirmInitialTransit = (modeId) => {
  selectedTransitMode.value = modeId;
  showCrossFloorModal.value = false;
};

const getComponentForFloor = (floorNum) => {
  if (floorNum === 3) return Floor3;
  if (floorNum === 2) return Floor2;
  return Floor1;
};

const getSegmentPath = (segmentKey) => {
  if (!location.value) return '';
  const paths = location.value.kioskPaths?.[currentKioskId.value];
  if (!paths || typeof paths === 'string') return '';
  return paths[selectedTransitMode.value]?.[segmentKey] || '';
};

const targetedRoutePath = computed(() => {
  if (!location.value || !activeKioskProfile.value) return '';
  const paths = location.value.kioskPaths?.[currentKioskId.value];
  if (!paths) return '';

  if (activeKioskProfile.value.floor === location.value.floor) {
    return typeof paths === 'string' ? paths : '';
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
  return getComponentForFloor(activeFloor.value);
});

const selectLocation = (targetItem) => {
  selectedDeviceDetails.value = targetItem;
  isModalOpen.value = true;
};

const confirmAndShowRoute = () => {
  const targetedItemData = selectedDeviceDetails.value;
  isModalOpen.value = false;

  setTimeout(() => {
    if (targetedItemData) {
      activeFloor.value = targetedItemData.floor;
      router.replace(`/phone/${targetedItemData.id}/directions`);
    }
    selectedDeviceDetailsDetails.value = null;
  }, 180);
};

const closeDetailsModal = () => {
  isModalOpen.value = false;
  setTimeout(() => { selectedDeviceDetails.value = null; }, 180);
};

const handleBrandSwitch = (newBrandId) => {
  fullscreenTargetMap.value = null; 
  resetMapsPanZoom();
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

const handleMapMouseDown = (event, viewType) => {
  isDragging.value = true;
  hasDraggedMoved.value = false;
  activeDragViewport.value = isCrossFloor.value ? viewType : 'target';
  
  const targetRegistry = activeDragViewport.value === 'target' ? targetPan.value : sourcePan.value;
  startMouseX.value = event.clientX - targetRegistry.x;
  startMouseY.value = event.clientY - targetRegistry.y;
};

const onPan = (event, viewType) => {
  if (!isDragging.value || activeDragViewport.value !== viewType) return;
  hasDraggedMoved.value = true;
  
  const currentRegistry = activeDragViewport.value === 'target' ? targetPan : sourcePan;
  currentRegistry.value = {
    x: event.clientX - startMouseX.value,
    y: event.clientY - startMouseY.value
  };
};

const endPan = () => {
  isDragging.value = false;
};

const onZoom = (event, viewType) => {
  event.preventDefault();
  const scopeType = isCrossFloor.value ? viewType : 'target';
  const registryZoom = scopeType === 'target' ? targetZoom : sourceZoom;
  
  registryZoom.value = Math.min(Math.max(0.5, registryZoom.value + (event.deltaY * -0.0018)), 3.5);
};

const handleMapClick = (viewType) => {
  if (hasDraggedMoved.value) return;
};

const resetMapsPanZoom = () => {
  targetZoom.value = 0.5;
  targetPan.value = { x: 0, y: 0 };
  sourceZoom.value = 0.5;
  sourcePan.value = { x: 0, y: 0 };
};

watch(location, (newLocation) => {
  if (newLocation) {
    if (!isCrossFloor.value) {
      activeFloor.value = newLocation.floor;
    }
    checkCrossFloorStatus();
  }
}, { immediate: true });

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

    if (kioskRegistry.value && Array.isArray(kioskRegistry.value.kiosks)) {
      activeKioskProfile.value = kioskRegistry.value.kiosks.find(k => k.id === currentKioskId.value);
    }

    if (activeKioskProfile.value && !isCrossFloor.value) {
      activeFloor.value = activeKioskProfile.value.floor;
    }

    checkCrossFloorStatus();

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