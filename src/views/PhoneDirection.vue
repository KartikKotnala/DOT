<template>
  <div class="min-h-screen bg-zinc-950 text-white px-4 md:px-8 py-6 relative font-mono">
    
    <!-- Top Action Navigation Banner -->
    <div class="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
      <div>
        <button 
          @click="$router.back()" 
          class="inline-flex items-center text-red-400 font-semibold hover:text-red-300 transition-colors text-xs uppercase tracking-wider"
        >
          <span class="mr-2">←</span> Abort Navigation
        </button>
        <h1 class="text-xl font-bold mt-1 text-white tracking-tight">Indoor Store Radar System</h1>
      </div>
      <div class="text-xs text-zinc-500">SYSTEM: ACTIVE_ROUTING_v6.0 (STEP_BY_STEP)</div>
    </div>

    <!-- Main Dynamic Content Grid Layout -->
    <div v-if="phone" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      
      <!-- LEFT SIDE PANEL: Scrollable Phone List -->
      <div class="lg:col-span-4 bg-zinc-900/40 border border-white/10 rounded-2xl p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar" style="max-height: 80vh;">
        
        <div class="text-xs text-white/50 uppercase tracking-widest font-bold mb-2 ml-1">
          Available Models
        </div>

        <div 
          v-for="item in sameBrandPhones" 
          :key="item.id"
          @click="selectPhone(item.id)"
          class="flex flex-col bg-zinc-800/20 border rounded-xl p-4 cursor-pointer transition-all duration-300 group"
          :class="item.id === route.params.id ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] bg-zinc-800/60' : 'border-white/5 hover:border-white/20'"
        >
          <div class="w-full h-40 bg-zinc-950/50 rounded-lg mb-3 flex items-center justify-center p-2 relative">
            <img 
              v-if="item.image"
              :src="getPhoneImageUrl(item.image)" 
              :alt="item.name" 
              class="w-full h-full object-contain transition-transform duration-500"
              :class="item.id === route.params.id ? 'scale-110' : 'group-hover:scale-105'"
            />
            
            <div v-if="item.id === route.params.id" class="absolute top-2 right-2">
               <span class="text-[9px] bg-red-500/10 text-red-400 font-mono px-2 py-1 rounded-full uppercase tracking-widest border border-red-500/20 animate-pulse">
                Active Target
              </span>
            </div>
          </div>
          
          <div class="flex flex-col">
            <h3 class="text-lg font-bold text-white tracking-tight" :class="{'text-red-400': item.id === route.params.id}">{{ item.name }}</h3>
            <p class="text-[10px] text-zinc-400 font-mono mt-1">Specs variant: {{ item.storage || '128GB Storage' }}</p>
          </div>

          <div class="mt-4 space-y-2 text-[10px] border-t border-white/5 pt-3 text-zinc-400 font-mono">
             <div class="flex justify-between"><span>Retail Value:</span> <span class="text-white font-bold">₹{{ Number(item.price).toLocaleString('en-IN') }}</span></div>
             <div class="flex justify-between"><span>Target Node:</span> <span :class="item.id === route.params.id ? 'text-red-400 font-bold' : 'text-zinc-300'">Floor {{ item.floor }} [{{ item.mapX }}, {{ item.mapY }}]</span></div>
          </div>
        </div>

      </div>

      <!-- RIGHT SIDE PANEL: Live Interactive Blueprint Mesh Canvas Viewport -->
      <div class="lg:col-span-8 bg-zinc-900/20 border border-white/10 rounded-2xl p-2 flex flex-col justify-between relative overflow-hidden">
        
        <!-- 
          🌟 MOUSE INTERACTION TRACKING FRAME (Dark Theme)
        -->
        <div 
          class="w-full bg-zinc-950/80 rounded-xl aspect-[16/10] overflow-hidden relative border border-white/5 shadow-inner select-none perspective-[2000px]"
          :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
          @mousedown="startPan"
          @mousemove="onPan"
          @mouseup="endPan"
          @mouseleave="endPan"
          @wheel="onZoom"
        >
          
          <!-- HUD: FLOATING NEXT FLOOR BUTTON -->
          <div v-if="activeViewFloor < phone.floor" class="absolute bottom-8 left-1/2 -translate-x-1/2 z-[60]">
             <button 
                @click.stop="goUpFloor" 
                class="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse flex items-center gap-2 border border-red-400/50 transition-all"
              >
               <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
               </svg>
               Take Elevator to Floor {{ activeViewFloor + 1 }}
             </button>
          </div>

          <!-- 🌟 TRUE CSS 3D TRANSFORM WRAPPER -->
          <div 
            class="w-full h-full transition-transform duration-700 ease-in-out origin-center flex items-center justify-center transform-style-3d"
            :style="{ transform: `translate(${panX}px, ${panY}px) scale(${zoomScale})` }"
          >
            <!-- ISOMETRIC 3D CONTAINER -->
            <div class="relative w-[800px] h-[500px] transform-style-3d" style="transform: rotateX(60deg) rotateZ(-45deg);">
              
              <!-- 3D ELEVATOR SHAFT BEAM -->
              <!-- Only grows up to the currently active floor being viewed -->
              <div v-if="activeViewFloor > 1" 
                   class="absolute transition-all duration-1000 ease-in-out" 
                   :style="{
                     left: '478px', 
                     top: '420px', 
                     width: '4px', 
                     height: `${(activeViewFloor - 1) * 150}px`,
                     transform: 'rotateX(-90deg)', 
                     transformOrigin: 'top center',
                     background: 'linear-gradient(to bottom, rgba(234, 179, 8, 1), rgba(234, 179, 8, 0.4))',
                     boxShadow: '0 0 20px rgba(234, 179, 8, 0.8)'
                   }">
              </div>

              <!-- ============================== -->
              <!-- FLOOR 1 (Ground Level Z=0) -->
              <!-- ============================== -->
              <div class="absolute inset-0 transition-opacity duration-700 ease-in-out" 
                   style="transform: translateZ(0px);"
                   :class="activeViewFloor === 1 ? 'opacity-100 z-50' : (activeViewFloor > 1 ? 'opacity-30 pointer-events-none' : 'opacity-0 pointer-events-none')">
                <svg viewBox="0 0 800 500" class="w-full h-full overflow-visible">
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <linearGradient id="floorGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="rgba(39, 39, 42, 0.95)" />
                      <stop offset="100%" stop-color="rgba(24, 24, 27, 0.95)" />
                    </linearGradient>
                  </defs>

                  <polygon points="20,20 780,20 780,480 20,480" class="fill-zinc-800 translate-x-3 translate-y-3" />
                  <polygon points="20,20 780,20 780,480 20,480" fill="url(#floorGrad1)" class="stroke-white/20 stroke-[1.5]" />
                  <text x="30" y="45" class="fill-white/30 font-black text-4xl tracking-tighter" transform="rotate(45 30 45) scale(1, 2)">LEVEL 1</text>
                  <text x="30" y="70" class="fill-white/20 font-mono text-xs uppercase" transform="rotate(45 30 70) scale(1, 1.5)">Ground Entrance</text>

                  <g>
                    <rect x="60" y="60" width="180" height="120" rx="4" class="fill-zinc-700" />
                    <rect x="55" y="55" width="180" height="120" rx="4" class="fill-zinc-900 border stroke-white/30" />
                    <text x="145" y="115" text-anchor="middle" class="fill-zinc-400 text-xs font-mono font-bold">ZONE A</text>
                  </g>
                  <g>
                    <rect x="60" y="230" width="450" height="140" rx="4" class="fill-zinc-700" />
                    <rect x="55" y="225" width="450" height="140" rx="4" class="fill-zinc-900 stroke-white/30" />
                    <text x="280" y="295" text-anchor="middle" class="fill-zinc-400 text-xs font-mono font-bold">FOOD LOUNGE</text>
                  </g>
                  
                  <!-- Elevator Bank (Floor 1) - Clickable to go up -->
                  <g transform="translate(450, 390)" 
                     @click="phone.floor > 1 && activeViewFloor === 1 ? goUpFloor() : null"
                     :class="phone.floor > 1 && activeViewFloor === 1 ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''">
                    <rect x="5" y="5" width="60" height="60" class="fill-yellow-600/30" />
                    <rect x="0" y="0" width="60" height="60" class="fill-zinc-900 stroke-yellow-500 stroke-2" />
                    <text x="30" y="45" text-anchor="middle" class="fill-yellow-500 text-[10px] font-bold">ELEVATOR</text>
                    
                    <!-- Bouncing Up Arrow if it's the target -->
                    <g v-if="phone.floor > 1 && activeViewFloor === 1" transform="translate(30, 25)" class="animate-bounce">
                       <path d="M-10,0 L0,-10 L10,0" fill="none" stroke="#ef4444" stroke-width="4" stroke-linecap="round" filter="url(#glow)"/>
                    </g>
                  </g>

                  <!-- 🛠️ FLOOR 1 ROUTING PATH -->
                  <path 
                    v-if="phone.pathFloor1 && activeViewFloor === 1"
                    :d="phone.pathFloor1" 
                    fill="none" 
                    stroke="#ef4444" 
                    stroke-width="5" 
                    stroke-dasharray="12,10" 
                    class="animate-route-flow"
                    filter="url(#glow)"
                  />

                  <!-- ENTRANCE PIN -->
                  <g transform="translate(120, 420)">
                    <g style="transform: rotateZ(45deg) rotateX(-60deg) translateY(-20px);">
                      <ellipse cx="0" cy="20" rx="12" ry="6" class="fill-emerald-500/40 animate-pulse" />
                      <path d="M0,20 L-10,0 A10,10 0 1,1 10,0 Z" class="fill-emerald-500 stroke-emerald-950 stroke-[2]" />
                      <circle cx="0" cy="-3" r="4" class="fill-emerald-950" />
                      <text y="-20" text-anchor="middle" class="fill-emerald-400 text-[13px] font-mono uppercase tracking-wider font-bold" filter="url(#glow)">Entrance</text>
                    </g>
                  </g>

                  <!-- TARGET PIN (If on Floor 1) -->
                  <g v-if="phone.floor === 1 && activeViewFloor === 1" :transform="`translate(${phone.mapX}, ${phone.mapY})`">
                    <g style="transform: rotateZ(45deg) rotateX(-60deg) translateY(-20px);">
                      <ellipse cx="0" cy="20" rx="16" ry="8" class="fill-red-500/40 animate-pulse" />
                      <path d="M0,20 L-12,0 A12,12 0 1,1 12,0 Z" class="fill-red-500 stroke-red-950 stroke-[2]" />
                      <circle cx="0" cy="-3" r="5" class="fill-red-950" />
                      <text y="-22" text-anchor="middle" class="fill-red-400 text-[13px] font-mono uppercase tracking-wider font-bold" filter="url(#glow)">Target Location</text>
                    </g>
                  </g>
                </svg>
              </div>

              <!-- ============================== -->
              <!-- FLOOR 2 (Level 2 Z=150) -->
              <!-- ============================== -->
              <div class="absolute inset-0 transition-opacity duration-700 ease-in-out" 
                   style="transform: translateZ(150px);"
                   :class="activeViewFloor === 2 ? 'opacity-100 z-50' : (activeViewFloor > 2 ? 'opacity-30 pointer-events-none' : 'opacity-0 pointer-events-none')">
                <svg viewBox="0 0 800 500" class="w-full h-full overflow-visible">
                  <polygon points="20,20 780,20 780,480 20,480" class="fill-zinc-800 translate-x-3 translate-y-3" />
                  <polygon points="20,20 780,20 780,480 20,480" fill="url(#floorGrad1)" class="stroke-white/20 stroke-[1.5]" />
                  <text x="30" y="45" class="fill-white/30 font-black text-4xl tracking-tighter" transform="rotate(45 30 45) scale(1, 2)">LEVEL 2</text>
                  
                  <g>
                    <rect x="290" y="60" width="220" height="120" rx="4" class="fill-zinc-700" />
                    <rect x="285" y="55" width="220" height="120" rx="4" class="fill-zinc-900 stroke-white/40" />
                    <text x="395" y="115" text-anchor="middle" class="fill-zinc-300 text-xs font-mono font-bold">ZONE B</text>
                  </g>

                  <!-- Elevator Bank (Floor 2) -->
                  <g transform="translate(450, 390)"
                     @click="phone.floor > 2 && activeViewFloor === 2 ? goUpFloor() : null"
                     :class="phone.floor > 2 && activeViewFloor === 2 ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''">
                    <rect x="5" y="5" width="60" height="60" class="fill-yellow-600/30" />
                    <rect x="0" y="0" width="60" height="60" class="fill-zinc-900 stroke-yellow-500 stroke-2" />
                    <text x="30" y="45" text-anchor="middle" class="fill-yellow-500 text-[10px] font-bold">ELEVATOR</text>

                    <!-- Bouncing Up Arrow if it's the target -->
                    <g v-if="phone.floor > 2 && activeViewFloor === 2" transform="translate(30, 25)" class="animate-bounce">
                       <path d="M-10,0 L0,-10 L10,0" fill="none" stroke="#ef4444" stroke-width="4" stroke-linecap="round" filter="url(#glow)"/>
                    </g>
                  </g>

                  <!-- 🛠️ FLOOR 2 ROUTING PATH -->
                  <path 
                    v-if="phone.floor === 2 && phone.pathTargetFloor && activeViewFloor === 2"
                    :d="phone.pathTargetFloor" 
                    fill="none" 
                    stroke="#ef4444" 
                    stroke-width="5" 
                    stroke-dasharray="12,10" 
                    class="animate-route-flow"
                    filter="url(#glow)"
                  />

                  <!-- TARGET PIN (If on Floor 2) -->
                  <g v-if="phone.floor === 2 && activeViewFloor === 2" :transform="`translate(${phone.mapX}, ${phone.mapY})`">
                    <g style="transform: rotateZ(45deg) rotateX(-60deg) translateY(-20px);">
                      <ellipse cx="0" cy="20" rx="16" ry="8" class="fill-red-500/40 animate-pulse" />
                      <path d="M0,20 L-12,0 A12,12 0 1,1 12,0 Z" class="fill-red-500 stroke-red-950 stroke-[2]" />
                      <circle cx="0" cy="-3" r="5" class="fill-red-950" />
                      <text y="-22" text-anchor="middle" class="fill-red-400 text-[13px] font-mono uppercase tracking-wider font-bold" filter="url(#glow)">Target Location</text>
                    </g>
                  </g>
                </svg>
              </div>

              <!-- ============================== -->
              <!-- FLOOR 3 (Level 3 Z=300) -->
              <!-- ============================== -->
              <div class="absolute inset-0 transition-opacity duration-700 ease-in-out" 
                   style="transform: translateZ(300px);"
                   :class="activeViewFloor === 3 ? 'opacity-100 z-50' : 'opacity-0 pointer-events-none'">
                <svg viewBox="0 0 800 500" class="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="floorGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="rgba(8, 51, 68, 0.95)" />
                      <stop offset="100%" stop-color="rgba(8, 51, 68, 0.8)" />
                    </linearGradient>
                  </defs>
                  
                  <polygon points="20,20 780,20 780,480 20,480" class="fill-cyan-950 translate-x-3 translate-y-3" />
                  <polygon points="20,20 780,20 780,480 20,480" fill="url(#floorGradCyan)" class="stroke-cyan-500/30 stroke-[1.5]" />
                  <text x="30" y="45" class="fill-cyan-500/40 font-black text-4xl tracking-tighter" transform="rotate(45 30 45) scale(1, 2)">LEVEL 3</text>
                  
                  <g>
                    <rect x="560" y="60" width="200" height="240" rx="4" class="fill-cyan-800" />
                    <rect x="555" y="55" width="200" height="240" rx="4" class="fill-cyan-950 stroke-cyan-400/80" />
                    <text x="655" y="175" text-anchor="middle" class="fill-cyan-300 text-xs font-mono font-bold">ZONE C (DIGITAL)</text>
                  </g>

                  <!-- Elevator Bank (Floor 3) -->
                  <g transform="translate(450, 390)">
                    <rect x="5" y="5" width="60" height="60" class="fill-yellow-600/30" />
                    <rect x="0" y="0" width="60" height="60" class="fill-zinc-900 stroke-yellow-500 stroke-2" />
                    <text x="30" y="35" text-anchor="middle" class="fill-yellow-500 text-[10px] font-bold">ELEVATOR</text>
                  </g>

                  <!-- 🛠️ FLOOR 3 ROUTING PATH -->
                  <path 
                    v-if="phone.floor === 3 && phone.pathTargetFloor && activeViewFloor === 3"
                    :d="phone.pathTargetFloor" 
                    fill="none" 
                    stroke="#ef4444" 
                    stroke-width="5" 
                    stroke-dasharray="12,10" 
                    class="animate-route-flow"
                    filter="url(#glow)"
                  />

                  <!-- TARGET PIN (If on Floor 3) -->
                  <g v-if="phone.floor === 3 && activeViewFloor === 3" :transform="`translate(${phone.mapX}, ${phone.mapY})`">
                    <g style="transform: rotateZ(45deg) rotateX(-60deg) translateY(-20px);">
                      <ellipse cx="0" cy="20" rx="16" ry="8" class="fill-red-500/40 animate-pulse" />
                      <path d="M0,20 L-12,0 A12,12 0 1,1 12,0 Z" class="fill-red-500 stroke-red-950 stroke-[2]" />
                      <circle cx="0" cy="-3" r="5" class="fill-red-950" />
                      <text y="-22" text-anchor="middle" class="fill-red-400 text-[13px] font-mono uppercase tracking-wider font-bold" filter="url(#glow)">Target Location</text>
                    </g>
                  </g>
                </svg>
              </div>

            </div>
          </div>

          <!-- Floating Map HUD UI Overlay 1: Dark Mode Zoom Buttons Layer -->
          <div class="absolute bottom-4 right-4 flex flex-col gap-1 shadow-md z-50">
            <button 
              @click.stop="uiZoom(0.3)"
              class="w-9 h-9 bg-zinc-900/90 text-white font-semibold text-lg rounded-t-lg border border-white/10 flex items-center justify-center hover:bg-zinc-800 active:bg-zinc-700 transition-colors"
            >
              +
            </button>
            <button 
              @click.stop="uiZoom(-0.3)"
              class="w-9 h-9 bg-zinc-900/90 text-white font-semibold text-lg rounded-b-lg border-t-0 border border-white/10 flex items-center justify-center hover:bg-zinc-800 active:bg-zinc-700 transition-colors"
            >
              −
            </button>
          </div>

          <!-- Floating Map HUD UI Overlay 2: Dark Target Camera Recenter Button -->
          <div class="absolute bottom-4 left-4 shadow-sm z-50">
            <button 
              @click.stop="resetMap" 
              class="px-3 py-1.5 bg-zinc-900/90 text-white font-medium text-xs rounded-lg border border-white/10 flex items-center gap-1.5 hover:bg-zinc-800 transition-colors shadow"
            >
                Recenter 
            </button>
          </div>

        </div>
        
        <!-- Bottom Stat Metadata Sync Banner -->
        <div class="mt-3 flex justify-between items-center text-xs text-zinc-500 font-mono bg-zinc-950/40 p-3 rounded-xl border border-white/5">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span> 
            GPS Feed Sync Locked
          </div>
          <div>Viewing Elevation: <span class="text-white font-bold">Floor {{ activeViewFloor }}</span> / {{ phone.floor }}</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const allPhones = ref([]);

const phone = computed(() => {
  return allPhones.value.find(p => String(p.id) === String(route.params.id));
});

const sameBrandPhones = computed(() => {
  if (!phone.value) return [];
  return allPhones.value.filter(p => String(p.brandId) === String(phone.value.brandId));
});

const selectPhone = (phoneId) => {
  router.push(`/phone/${phoneId}/directions`);
};

// --- 📍 STEP-BY-STEP NAVIGATION STATE ---
const activeViewFloor = ref(1);

watch(
  () => route.params.id,
  () => {
    // Reset to ground floor when navigating to a new target
    activeViewFloor.value = 1; 
  },
  { immediate: true }
);

const goUpFloor = () => {
  if (phone.value && activeViewFloor.value < phone.value.floor) {
    activeViewFloor.value++;
    // Auto-pan slightly downwards to center the higher floor visually in 3D
    panY.value += 60;
  }
};


// --- 🕹️ LIVE PAN/ZOOM GRAPHICS TRACKING ENGINE STATE ---
const zoomScale = ref(0.85); // Start slightly zoomed out for the 3D stack
const panX = ref(0);
const panY = ref(50); // Start slightly shifted down to fit the stack
const isDragging = ref(false);
const startMouseX = ref(0);
const startMouseY = ref(0);

// Dynamic Mouse Trackpad/Scroll Wheel Zoom Interpolations
const onZoom = (event) => {
  event.preventDefault();
  const scaleStep = event.deltaY * -0.0015;
  zoomScale.value = Math.min(Math.max(0.5, zoomScale.value + scaleStep), 3.5);
};

// UI Control Button +/- Zoom Handlers
const uiZoom = (factor) => {
  zoomScale.value = Math.min(Math.max(0.5, zoomScale.value + factor), 3.5);
};

// Mouse Drag Capture Inits
const startPan = (event) => {
  isDragging.value = true;
  startMouseX.value = event.clientX - panX.value;
  startMouseY.value = event.clientY - panY.value;
};

// Mouse Vector Movement Shifts
const onPan = (event) => {
  if (!isDragging.value) return;
  panX.value = event.clientX - startMouseX.value;
  panY.value = event.clientY - startMouseY.value;
};

// Halt Drag Lifecycle Binding Events
const endPan = () => {
  isDragging.value = false;
};

// Camera Reset Vector Defaults Coordinate Re-snaps
const resetMap = () => {
  zoomScale.value = 0.85;
  panX.value = 0;
  panY.value = 50;
  activeViewFloor.value = 1; // Reset to ground
};

// --- DATA ACCESS TELEMETRY LOADER ---
onMounted(async () => {
  try {
    const response = await fetch('/phone.json');
    allPhones.value = await response.json();
  } catch (error) {
    console.error("Failed to extract active indoor navigation paths:", error);
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
/* 🚀 CSS ANIMATIONS FOR LIVE MAP TRAILS ROUTE */
@keyframes routeMove {
  to {
    stroke-dashoffset: -20;
  }
}

.animate-route-flow {
  animation: routeMove 1.2s linear infinite;
}

/* Ensure 3D layers don't flatten */
.transform-style-3d {
  transform-style: preserve-3d;
}

/* Custom Scrollbar for Phone List */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>