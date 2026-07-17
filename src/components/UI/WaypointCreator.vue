<template>
  <div class="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 font-mono text-xs max-w-sm w-85">
    
    <div class="bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
      
      <div class="flex items-center justify-between border-b border-zinc-800 pb-2">
        <div class="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          Waypoint Tracer Core
        </div>
        <span class="text-[10px] text-zinc-500">Nodes: {{ waypointNodes.length }}</span>
      </div>

      <p class="text-[11px] text-zinc-400 font-sans leading-normal">
        💡 <strong class="text-zinc-200">Kiosk Admin Hack:</strong> Open your browser dev-tools, click anywhere inside your SVG frame canvas, and watch the matrix auto-build your coordinate strings.
      </p>

      <div class="bg-black/60 border border-zinc-800/80 rounded-xl p-2.5 flex flex-col gap-2">
        <span class="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Generated SVG Path Data:</span>
        <code class="text-[11px] text-amber-400 break-all select-all font-mono leading-tight bg-zinc-900/50 p-2 rounded border border-zinc-800/40 block max-h-20 overflow-y-auto custom-mini-scroll">
          {{ computedPathString || '--- EMPTY MATRIX STACK ---' }}
        </code>
        
        <div class="grid grid-cols-2 gap-2 mt-1">
          <button 
            type="button"
            @click="clearTracedRoute"
            :disabled="waypointNodes.length === 0"
            class="py-1.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-900 text-zinc-400 border border-zinc-800 rounded-lg font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer"
          >
            Clear Nodes
          </button>
          <button 
            type="button"
            @click="copyTracedPathToClipboard"
            :disabled="waypointNodes.length === 0"
            class="py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded-lg font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer"
          >
            {{ wasCopied ? '✓ Copied!' : 'Copy Path' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Active node storage pipeline matrix arrays
const waypointNodes = ref([]);
const wasCopied = ref(false);

/**
 * 🌟 EXPOSED INTERFACE HOOK METHOD: 
 * Parent component maps its click handlers straight into this pipeline.
 * Passes the native click event along with your workspace scale transforms.
 */
const injectCanvasClickNode = (event, svgElement, zoomScale = 1.0, panOffset = { x: 0, y: 0 }) => {
  if (!svgElement) return null;

  // 1. Get raw container screen relative dimensions
  const rect = svgElement.getBoundingClientRect();

  // 2. Localize click position inside the box frame boundaries
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  // 3. Mathematical matrix rollback: strips off transforms to find raw SVG coordinate space points
  const rawX = Math.round((clickX - panOffset.x) / zoomScale);
  const rawY = Math.round((clickY - panOffset.y) / zoomScale);

  // 4. Protect bounds against out-of-range anomalies
  if (rawX >= 0 && rawX <= 800 && rawY >= 0 && rawY <= 600) {
    waypointNodes.value.push({ x: rawX, y: rawY });
    return { x: rawX, y: rawY };
  }
  return null;
};

// Computes standard SVG path command strings
const computedPathString = computed(() => {
  if (waypointNodes.value.length === 0) return '';
  return waypointNodes.value.reduce((accPathString, node, index) => {
    return index === 0 
      ? `M ${node.x} ${node.y}` 
      : `${accPathString} L ${node.x} ${node.y}`;
  }, '');
});

const clearTracedRoute = () => {
  waypointNodes.value = [];
};

const copyTracedPathToClipboard = async () => {
  if (!computedPathString.value) return;
  try {
    await navigator.clipboard.writeText(computedPathString.value);
    wasCopied.value = true;
    setTimeout(() => { wasCopied.value = false; }, 2000);
  } catch (err) {
    console.error("Tracer clipboard failure:", err);
  }
};

// Expose internal references to parent scope hooks
defineExpose({
  waypointNodes,
  computedPathString,
  injectCanvasClickNode,
  clearTracedRoute
});
</script>

<style scoped>
.custom-mini-scroll::-webkit-scrollbar { width: 4px; }
.custom-mini-scroll::-webkit-scrollbar-track { background: transparent; }
.custom-mini-scroll::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
.custom-mini-scroll::-webkit-scrollbar-thumb:hover { background: #52525b; }
</style>