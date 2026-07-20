<!-- <template>
  <div class="min-h-screen bg-app text-main px-4 md:px-8 py-6 relative font-sans">
    
    <div class="ambient-glow"></div>

    <div 
      v-if="isWizardOpen" 
      class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      @click.self="closeWizard"
    >
      <div class="bg-panel/95 backdrop-blur-xl border border-line w-full max-w-md rounded-3xl p-6 shadow-2xl relative flex flex-col gap-5 transform scale-100 transition-transform">
        
        <button 
          @click="closeWizard" 
          class="absolute top-5 right-5 w-7 h-7 flex items-center justify-center rounded-full bg-white/5 border border-line/40 text-muted hover:text-main text-xs transition-colors focus:outline-none"
        >
          ✕
        </button>

        <div class="flex flex-col gap-1">
          <span class="text-[9px] uppercase tracking-[0.25em] text-red-500 font-bold block font-mono">
            Step {{ currentStep }} of 3
          </span>
          <h2 class="text-xl font-extrabold text-main tracking-tight">
            {{ stepTitles[currentStep - 1] }}
          </h2>
        </div>

        <div class="flex items-center gap-1.5 w-full bg-white/5 h-[3px] rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-300" :class="currentStep === 1 ? 'w-1/3 bg-red-500' : currentStep === 2 ? 'w-2/3 bg-red-500' : 'w-full bg-red-500'"></div>
        </div>

        <div v-if="currentStep === 1" class="flex flex-col gap-1.5 mt-2 animate-slide-down">
          <button
            v-for="domain in domainOptions"
            :key="domain.id"
            type="button"
            @click="goToStep2(domain.id)"
            class="w-full text-left px-4 py-3.5 rounded-xl border border-line bg-panel/30 hover:border-red-500/50 hover:bg-white/[0.02] text-muted hover:text-main transition-all duration-200 flex items-center gap-3 group focus:outline-none"
          >
            <span class="text-xl grayscale group-hover:grayscale-0 transition-all duration-200">{{ domain.emoji }}</span>
            <span class="text-xs font-semibold tracking-wide flex-1">{{ domain.name }}</span>
            <span class="text-xs opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-red-400">→</span>
          </button>
        </div>

        <div v-if="currentStep === 2" class="flex flex-col gap-1.5 mt-2 animate-slide-down">
          <div class="max-h-[240px] overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-1.5">
            <button
              v-for="subOption in currentSubOptions"
              :key="subOption.value"
              type="button"
              @click="goToStep3(subOption.value)"
              class="w-full text-left px-4 py-3.5 rounded-xl border border-line bg-panel/30 hover:border-red-500/50 hover:bg-white/[0.02] text-muted hover:text-main transition-all duration-200 flex items-center justify-between group focus:outline-none text-xs font-medium font-mono"
            >
              <span class="truncate">📍 {{ subOption.name }}</span>
              <span class="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-red-400">→</span>
            </button>
          </div>
          
          <div class="flex items-center justify-between mt-3 pt-3 border-t border-line/30">
            <button type="button" @click="currentStep = 1" class="text-[11px] font-bold uppercase tracking-wider text-muted hover:text-red-400 transition-colors">
              ← Change Category
            </button>
          </div>
        </div>

        <div v-if="currentStep === 3" class="flex flex-col gap-5 mt-2 animate-slide-down">
          
          <div class="bg-white/[0.02] border border-line rounded-2xl p-4 flex flex-col gap-2.5 text-xs font-mono">
            <div class="flex items-start justify-between"><span class="text-muted/40">Category:</span> <span class="text-main font-bold capitalize text-right">{{ tempSelection.category }} Setup</span></div>
            <div class="flex items-start justify-between"><span class="text-muted/40">Target Location:</span> <span class="text-red-400 font-bold select-all text-right">{{ tempSelection.targetSubElement }}</span></div>
          </div>

          <div v-if="tempSelection.category === 'store' && filteredProductsForBrand.length > 0" class="flex flex-col gap-2">
            <label class="text-[10px] text-muted/40 uppercase tracking-widest font-bold ml-1 font-mono">Associated Product Item (Optional)</label>
            <div class="grid grid-cols-2 gap-1.5 max-h-[120px] overflow-y-auto custom-scrollbar p-0.5">
              <button
                v-for="prod in filteredProductsForBrand"
                :key="prod.id"
                type="button"
                @click="tempSelection.product = tempSelection.product === prod.name ? '' : prod.name"
                class="px-3 py-2.5 text-left rounded-xl transition-all duration-200 border text-[11px] font-sans truncate focus:outline-none"
                :class="tempSelection.product === prod.name 
                  ? 'bg-red-500/10 border-red-500 text-main font-bold shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                  : 'bg-panel/40 border-line text-muted hover:text-main hover:bg-white/5 hover:border-line/80'"
              >
                🏷️ {{ prod.name }}
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-line/30">
            <button type="button" @click="currentStep = 2" class="text-[11px] text-muted hover:text-main transition-colors font-bold uppercase tracking-wider">
              Back
            </button>
            <button type="button" @click="finalizeWizardSelection" class="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors shadow-md focus:outline-none">
              Save Selection
            </button>
          </div>
        </div>

      </div>
    </div>

    <div class="sticky top-0 z-50 bg-panel backdrop-blur-md pt-6 pb-5 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-line">
      <Header class="header-card" />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <div class="md:col-span-2 nav-card"><Sidebar /></div>
        <div class="search-card"><SearchBar /></div>
      </div>
    </div>

    <div class="w-full mt-8 mb-16 form-content-card">
      <div class="mb-8 border-b border-line pb-6">
        <router-link to="/" class="inline-flex items-center text-red-400 font-semibold hover:text-red-300 transition-colors text-xs uppercase tracking-wider mb-3">
          <span class="mr-2">←</span> Back to Dashboard
        </router-link>
        <h1 class="text-4xl font-extrabold tracking-tight text-main sm:text-5xl mt-1">Support & Feedback Hub</h1>
        <p class="text-sm sm:text-base text-muted mt-2 max-w-3xl leading-relaxed">
          Log store location errors, digital layout path glitches, or center maintenance tickets using the step-by-step assistant below.
        </p>
      </div>

      <div v-if="formSubmitted" class="glass-panel rounded-2xl p-12 text-center border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.08)] max-w-2xl mx-auto my-12">
        <div class="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl mb-6">✓</div>
        <h2 class="text-2xl font-bold text-main mb-3">Ticket Submitted Successfully</h2>
        <p class="text-sm sm:text-base text-muted max-w-md mx-auto mb-8 leading-relaxed">Your report parameters have been logged and compiled straight to our operations control team desks.</p>
        <button @click="resetForm" class="px-6 py-3 bg-panel border border-line text-sm font-semibold rounded-xl hover:bg-panel hover:brightness-110 transition-all duration-200">Submit Another Report</button>
      </div>

      <form v-else @submit.prevent="submitComplaint" class="glass-panel rounded-2xl p-6 md:p-10 lg:p-12 flex flex-col gap-8 shadow-2xl shadow-black/40">
        
        <div>
          <h3 class="text-sm font-bold font-mono text-red-400/80 uppercase tracking-widest mb-4">01 / Contact Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <label class="text-[11px] text-muted uppercase tracking-wider font-bold ml-1">Full Name</label>
              <input v-model="formData.name" type="text" required placeholder="e.g. John Doe" class="w-full bg-panel border border-line rounded-xl px-4 py-3 text-sm text-main focus:outline-none focus:border-red-500/50 transition-all duration-200 font-medium" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-[11px] text-muted uppercase tracking-wider font-bold ml-1">Email Address</label>
              <input v-model="formData.email" type="email" required placeholder="e.g. johndoe@example.com" class="w-full bg-panel border border-line rounded-xl px-4 py-3 text-sm text-main focus:outline-none focus:border-red-500/50 transition-all duration-200 font-medium" />
            </div>
          </div>
        </div>

        <div class="border-t border-line pt-6">
          <h3 class="text-sm font-bold font-mono text-red-400/80 uppercase tracking-widest mb-4">02 / Issue Category Mapping</h3>
          <div class="flex flex-col gap-2.5">
            <label class="text-[11px] text-muted uppercase tracking-wider font-bold ml-1">Assigned Support Category Target</label>
            
            <div 
              @click="openWizard"
              class="w-full bg-panel border border-line rounded-xl px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-all duration-200 flex items-center justify-between group select-none min-h-[58px]"
              :class="{ 'border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.03)]': formData.targetSubElement }"
            >
              <div class="flex flex-col justify-center">
                <span v-if="!formData.targetSubElement" class="text-xs text-muted/50 font-sans tracking-wide transition-colors group-hover:text-muted/80">
                  Tap here to select the issue category and location path...
                </span>
                <div v-else class="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span class="bg-white/5 px-2 py-0.5 rounded border border-line text-main capitalize">{{ currentDomainEmoji }} {{ formData.category }}</span>
                  <span class="text-red-400">➔</span>
                  <span class="bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 text-red-400 font-bold">📍 {{ formData.targetSubElement }}</span>
                  <span v-if="formData.product" class="text-muted/40">➔</span>
                  <span v-if="formData.product" class="bg-white/5 px-2 py-0.5 rounded border border-line text-muted font-sans font-medium">🏷️ {{ formData.product }}</span>
                </div>
              </div>
              
              <span class="text-xs text-red-400 font-bold uppercase tracking-wider font-mono opacity-60 group-hover:opacity-100 transition-opacity">
                {{ formData.targetSubElement ? 'Edit Location' : 'Choose Path' }}
              </span>
            </div>
          </div>
        </div>

        <div class="border-t border-line pt-6">
          <h3 class="text-sm font-bold font-mono text-red-400/80 uppercase tracking-widest mb-4">03 / Experience Grading</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-panel border border-line rounded-2xl p-6 lg:p-8">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line md:border-b-0 pb-4 sm:pb-0">
              <span class="text-xs sm:text-sm text-muted font-mono">Platform/App UI Fluidity:</span>
              <div class="flex gap-2" @mouseleave="hoverRatings.app = 0">
                <button v-for="star in 5" :key="star" type="button" @mouseover="hoverRatings.app = star" @click="formData.ratings.app = star" class="text-3xl transition-all duration-150 transform hover:scale-125 focus:outline-none" :class="star <= (hoverRatings.app || formData.ratings.app) ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]' : 'text-muted/30'">★</button>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span class="text-xs sm:text-sm text-muted font-mono">Mall Cleanliness & Care:</span>
              <div class="flex gap-2" @mouseleave="hoverRatings.cleanliness = 0">
                <button v-for="star in 5" :key="star" type="button" @mouseover="hoverRatings.cleanliness = star" @click="formData.ratings.cleanliness = star" class="text-3xl transition-all duration-150 transform hover:scale-125 focus:outline-none" :class="star <= (hoverRatings.cleanliness || formData.ratings.cleanliness) ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]' : 'text-muted/30'">★</button>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-line pt-6 flex flex-col gap-2">
          <h3 class="text-sm font-bold font-mono text-red-400/80 uppercase tracking-widest mb-2">04 / Description of Issue</h3>
          <textarea v-model="formData.description" rows="6" required placeholder="Please describe the exact problem you encountered (e.g. Level 2 digital map routing path to Nike is showing an error, or elevator systems near Sector D are currently offline)..." class="w-full bg-panel border border-line rounded-xl px-5 py-4 text-sm sm:text-base text-main focus:outline-none focus:border-red-500/50 focus:bg-panel/70 transition-all duration-200 font-medium custom-scrollbar resize-none leading-relaxed"></textarea>
        </div>

        <div class="flex items-center justify-end border-t border-line pt-6 mt-2">
          <button type="submit" class="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-200 shadow-xl shadow-red-900/20 transform hover:-translate-y-0.5 focus:outline-none">
            Submit Support Report
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import gsap from 'gsap';

import Header from "@/components/Header/Header.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import SearchBar from "@/components/Search/SearchBar.vue";

const brandList = ref([]);
const productList = ref([]);
const formSubmitted = ref(false);

// PROGRESSIVE STEPS DATA HANDLERS
const isWizardOpen = ref(false);
const currentStep = ref(1);
const tempSelection = ref({ category: '', targetSubElement: '', product: '' });

// 🌟 USER FRIENDLY PROSE FOR THE SELECTION TITLES
const stepTitles = [
  "Select Category",
  "Specify Location",
  "Review Selection Details"
];

const hoverRatings = ref({ app: 0, cleanliness: 0 });

const domainOptions = [
  { id: 'app', name: 'Digital App & Map Navigation Problems', emoji: '📱' },
  { id: 'store', name: 'Specific Retail Store / Brand Outlets', emoji: '🛍️' },
  { id: 'facility', name: 'Physical Mall Cleanliness & Upkeep', emoji: '🧹' },
  { id: 'other', name: 'General Enquiries / Other Comments', emoji: '💬' }
];

const formData = ref({
  name: '',
  email: '',
  category: '',
  targetSubElement: '',
  product: '',
  description: '',
  ratings: { app: 0, cleanliness: 0 }
});

const currentDomainEmoji = computed(() => {
  const match = domainOptions.find(d => d.id === formData.value.category);
  return match ? match.emoji : '📍';
});

const openWizard = () => {
  tempSelection.value = { 
    category: formData.value.category || 'app', 
    targetSubElement: formData.value.targetSubElement, 
    product: formData.value.product 
  };
  currentStep.value = formData.value.targetSubElement ? 3 : 1;
  isWizardOpen.value = true;
};

const closeWizard = () => { isWizardOpen.value = false; };

const goToStep2 = (domainId) => {
  tempSelection.value.category = domainId;
  tempSelection.value.targetSubElement = '';
  tempSelection.value.product = '';
  currentStep.value = 2;
};

const goToStep3 = (subValue) => {
  tempSelection.value.targetSubElement = subValue;
  tempSelection.value.product = '';
  currentStep.value = 3;
};

const finalizeWizardSelection = () => {
  formData.value.category = tempSelection.value.category;
  formData.value.targetSubElement = tempSelection.value.targetSubElement;
  formData.value.product = tempSelection.value.product;
  closeWizard();
};

const currentSubOptions = computed(() => {
  const cat = tempSelection.value.category;
  if (cat === 'store') return brandList.value.map(b => ({ name: b.name, value: b.name }));
  if (cat === 'app') {
    return [
      { name: 'Indoor Map Canvas Glitch', value: 'map' },
      { name: 'Search Bar Filtering Issues', value: 'search' },
      { name: 'App Theme Display Loading Error', value: 'theme' },
      { name: 'Incorrect Floor Routing Path', value: 'routes' }
    ];
  }
  if (cat === 'facility') {
    return [
      { name: 'Restrooms & Washrooms Cleanliness', value: 'clean' },
      { name: 'Escalator / Elevator Breakdown', value: 'escalator' },
      { name: 'Basement Parking Floor Issues', value: 'parking' },
      { name: 'Air Conditioning / Ventilation Levels', value: 'hvac' }
    ];
  }
  return [{ name: 'General Comments Matrix Box', value: 'general' }];
});

const filteredProductsForBrand = computed(() => {
  if (!tempSelection.value.targetSubElement || tempSelection.value.category !== 'store') return [];
  const brand = brandList.value.find(b => b.name === tempSelection.value.targetSubElement);
  if (!brand) return [];
  return productList.value.filter(p => p.brandId === brand.id);
});

const submitComplaint = () => { formSubmitted.value = true; };
const resetForm = () => {
  formSubmitted.value = false;
  formData.value = { name: '', email: '', category: '', targetSubElement: '', product: '', description: '', ratings: { app: 0, cleanliness: 0 } };
};

onMounted(async () => {
  const tl = gsap.timeline();
  tl.from(".header-card", { opacity: 0, y: -40, duration: 0.8 })
    .from(".nav-card", { opacity: 0, x: -50, duration: 0.6 }, "-=0.3")
    .from(".search-card", { opacity: 0, x: 50, duration: 0.6 }, "-=0.6")
    .from(".form-content-card", { opacity: 0, y: 40, scale: 0.99, duration: 0.8 }, "-=0.4");

  try {
    const [brandRes, productRes] = await Promise.all([
      fetch('/SubProductsBrand.json'),
      fetch('/SubProducts.json')
    ]);
    brandList.value = await brandRes.json();
    productList.value = await productRes.json();
  } catch (error) {
    console.error("Data tracking reference breakdown:", error);
  }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }

@keyframes fadeIn { from { opacity: 0; transform: scale(0.99); } to { opacity: 1; transform: scale(1); } }
.animate-fade-in { animation: fadeIn 0.15s cubic-bezier(0.215, 0.610, 0.355, 1) forwards; }

@keyframes slideDown { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
.animate-slide-down { animation: slideDown 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style> -->
<template>
  <div class="min-h-screen bg-app text-main px-4 md:px-8 py-6 relative font-sans flex flex-col justify-between selection:bg-red-500/30">
    <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] rounded-full bg-red-500/5 blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vh] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>

    <div class="w-full pt-2 pb-5 border-b border-line backdrop-blur-md z-10">
      <Header class="header-card" />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <div class="md:col-span-2 nav-card"><Sidebar /></div>
        <div class="search-card"><SearchBar /></div>
      </div>
    </div>

    <div class="w-full flex-grow flex items-center justify-center my-10 main-kiosk-card z-20">
      <div 
        class="w-full max-w-3xl border border-line rounded-[36px] p-8 md:p-12 relative min-h-[480px] flex flex-col justify-between transition-all duration-500 shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl bg-panel/40"
        style="box-shadow: inset 0 1px 1px rgba(255,255,255,0.05), 0 25px 70px rgba(0,0,0,0.7);"
      >
        <div class="flex items-center justify-between border-b border-line/20 pb-5">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-white/5 border border-line/60 flex items-center justify-center shadow-inner">
              <span class="text-xl animate-pulse">⚡</span>
            </div>
            <div>
              <h2 class="text-md font-black tracking-[0.05em] text-main uppercase font-mono">Response CENTER</h2>
              <p class="text-[9px] font-mono text-muted/40 uppercase tracking-widest mt-0.5">FEEDBACK </p>
            </div>
          </div>
          <div class="text-[10px] font-mono font-black tracking-widest text-red-400 bg-red-500/10 px-4 py-1.5 rounded-xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            {{ currentKioskStep === 'category' ? 'PHASE 01 / 03' : currentKioskStep === 'app' ? 'PHASE 02 / 03' : currentKioskStep === 'cleanliness' ? 'PHASE 03 / 03' : 'PROCESS COMPLETE' }}
          </div>
        </div>

        <div v-if="currentKioskStep === 'category'" class="flex-grow flex flex-col justify-center gap-8 py-6 animate-slide-down">
          <div class="text-center">
            <h3 class="text-xl md:text-2xl font-black tracking-tight text-main/90 uppercase font-mono">
              Select Incident Domain
            </h3>
            <p class="text-xs text-muted/50 font-mono mt-1">What requires immediate support attention today?</p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
            <button
              v-for="domain in domainOptions"
              :key="domain.id"
              type="button"
              @click="handleCategorySelection(domain.id)"
              class="w-full text-left p-5 rounded-2xl border border-line/80 bg-white/[0.01] hover:border-red-500/40 hover:bg-white/[0.03] text-muted hover:text-main transition-all cubic-bezier(0.4, 0, 0.2, 1) duration-300 flex items-center gap-5 group focus:outline-none cursor-pointer shadow-lg active:scale-[0.98]"
            >
              <span class="text-3xl filter saturate-[0.8] brightness-90 group-hover:saturate-100 group-hover:brightness-110 group-hover:scale-110 transition-all duration-300 transform">{{ domain.emoji }}</span>
              <div class="flex flex-col flex-1 min-w-0">
                <span class="text-xs font-black tracking-wider uppercase text-main/90 font-mono">{{ domain.label }}</span>
                <span class="text-[10px] text-muted/50 font-sans mt-1 leading-normal truncate group-hover:text-muted transition-colors">{{ domain.description }}</span>
              </div>
              <span class="text-xs text-muted/20 group-hover:text-red-400 transform translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300 font-mono font-bold">➔</span>
            </button>
          </div>
        </div>

        <div v-if="currentKioskStep === 'app'" class="flex-grow flex flex-col justify-center items-center text-center gap-10 py-6 animate-slide-down">
          <div class="flex flex-col gap-2">
            <h3 class="text-xl md:text-2xl font-black tracking-tight text-main/90 uppercase font-mono">Rate Interface Fluidity</h3>
            <p class="text-xs text-muted/40 font-mono max-w-xs mx-auto">Tap the emoji node matching your app navigation experience</p>
          </div>
          
          <div class="flex justify-center items-center gap-2 sm:gap-4 flex-wrap">
            <button 
              v-for="emoji in kioskEmojis" 
              :key="emoji.score"
              type="button"
              @click="handleQuizScore('app', emoji.score)"
              class="flex flex-col items-center gap-3 p-4 w-24 rounded-2xl transition-all duration-300 border border-transparent hover:border-line hover:bg-white/[0.02] group/emoji transform hover:scale-110 active:scale-95 focus:outline-none cursor-pointer"
            >
              <span class="text-5xl filter brightness-95 group-hover/emoji:brightness-110 scale-animation drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">{{ emoji.glyph }}</span>
              <span class="text-[9px] uppercase font-black tracking-widest font-mono text-muted/30 group-hover/emoji:text-red-400 transition-colors mt-2">
                {{ emoji.text }}
              </span>
            </button>
          </div>
          
          <button type="button" @click="currentKioskStep = 'category'" class="text-[10px] font-black text-muted/40 hover:text-red-400 uppercase tracking-widest font-mono focus:outline-none cursor-pointer transition-colors border border-line/40 px-4 py-2 rounded-xl bg-white/[0.01]">
            ← Return to Domains
          </button>
        </div>

        <div v-if="currentKioskStep === 'cleanliness'" class="flex-grow flex flex-col justify-center items-center text-center gap-10 py-6 animate-slide-down">
          <div class="flex flex-col gap-2">
            <h3 class="text-xl md:text-2xl font-black tracking-tight text-main/90 uppercase font-mono">Rate Center Care & Upkeep</h3>
            <p class="text-xs text-muted/40 font-mono max-w-xs mx-auto">Staging session data parameters package verification</p>
          </div>

          <div class="flex justify-center items-center gap-2 sm:gap-4 flex-wrap">
            <button 
              v-for="emoji in kioskEmojis" 
              :key="emoji.score"
              type="button"
              @click="handleQuizScore('cleanliness', emoji.score)"
              class="flex flex-col items-center gap-3 p-4 w-24 rounded-2xl transition-all duration-300 border border-transparent hover:border-line hover:bg-white/[0.02] group/emoji transform hover:scale-110 active:scale-95 focus:outline-none cursor-pointer"
            >
              <span class="text-5xl filter brightness-95 group-hover/emoji:brightness-110 scale-animation drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">{{ emoji.glyph }}</span>
              <span class="text-[9px] uppercase font-black tracking-widest font-mono text-muted/30 group-hover/emoji:text-red-400 transition-colors mt-2">
                {{ emoji.text }}
              </span>
            </button>
          </div>

          <button type="button" @click="currentKioskStep = 'app'" class="text-[10px] font-black text-muted/40 hover:text-red-400 uppercase tracking-widest font-mono focus:outline-none cursor-pointer transition-colors border border-line/40 px-4 py-2 rounded-xl bg-white/[0.01]">
            ← Back to Previous Index
          </button>
        </div>

        <div v-if="currentKioskStep === 'success'" class="flex-grow flex flex-col justify-center items-center text-center gap-6 py-12 animate-slide-down">
          <div class="relative flex items-center justify-center">
            <div class="absolute inset-0 w-24 h-24 rounded-full bg-emerald-500/10 blur-xl animate-pulse"></div>
            <div class="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center text-4xl animate-bounce shadow-inner">
              ✓
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <h2 class="text-2xl md:text-3xl font-black text-main uppercase tracking-tight font-mono">FEEDBACK SUBMITTED</h2>
            <p class="text-xs text-muted max-w-xs mx-auto font-medium leading-relaxed">
              Your feedback has been submitted.
            </p>
          </div>
          <div class="mt-4 text-[9px] font-mono text-emerald-400/60 uppercase tracking-widest bg-emerald-500/5 border border-emerald-500/10 px-4 py-2 rounded-xl animate-pulse">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Refreashing...
          </div>
        </div>

        <div class="w-full bg-white/5 h-[3px] rounded-full overflow-hidden mt-6 relative">
          <div 
            class="h-full rounded-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
            :style="{ 
              width: currentKioskStep === 'category' ? '25%' : currentKioskStep === 'app' ? '50%' : currentKioskStep === 'cleanliness' ? '75%' : '100%' 
            }"
          ></div>
        </div>

      </div>
    </div>

    <div class="text-center text-[9px] font-mono text-muted/20 uppercase tracking-[0.3em] w-full border-t border-line/20 pt-5">
      Terminal Identity: KIOSK_MN_NORTH_04 // Database Matrix Synced
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

import Header from "@/components/Header/Header.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import SearchBar from "@/components/Search/SearchBar.vue";

const currentKioskStep = ref('category');

const kioskSessionLogs = ref({
  categoryTarget: '',
  appScore: 0,
  cleanlinessScore: 0
});

const domainOptions = [
  { id: 'navigation', label: 'Map Navigation', emoji: '📱', description: 'Glitches inside routing vectors or paths' },
  { id: 'stores', label: 'Store Outlets', emoji: '🛍️', description: 'Incorrect level directory configurations' },
  { id: 'upkeep', label: 'Mall Facilities', emoji: '🧹', description: 'Upkeep failures or facility breakdowns' },
  { id: 'enquiry', label: 'General Help', emoji: '💬', description: 'Information desk or system UI inquiries' }
];

const kioskEmojis = [
  { score: 1, glyph: '😡', text: 'Angry' },
  { score: 2, glyph: '🙁', text: 'Poor' },
  { score: 3, glyph: '😐', text: 'Neutral' },
  { score: 4, glyph: '😊', text: 'Good' },
  { score: 5, glyph: '🤩', text: 'Amazing' }
];

const handleCategorySelection = (categoryId) => {
  kioskSessionLogs.value.categoryTarget = categoryId;
  setTimeout(() => { currentKioskStep.value = 'app'; }, 150);
};

const handleQuizScore = (type, score) => {
  if (type === 'app') {
    kioskSessionLogs.value.appScore = score;
    setTimeout(() => { currentKioskStep.value = 'cleanliness'; }, 200);
  } else if (type === 'cleanliness') {
    kioskSessionLogs.value.cleanlinessScore = score;
    setTimeout(() => { executeKioskLogSubmission(); }, 200);
  }
};

const executeKioskLogSubmission = () => {
  currentKioskStep.value = 'success';
  console.log("KIOSK MATRIX LOG BUNDLE PACKET:", JSON.parse(JSON.stringify(kioskSessionLogs.value)));
  
  setTimeout(() => {
    kioskSessionLogs.value = { categoryTarget: '', appScore: 0, cleanlinessScore: 0 };
    currentKioskStep.value = 'category';
  }, 4000);
};

onMounted(() => {
  const tl = gsap.timeline();
  tl.from(".header-card", { opacity: 0, y: -30, duration: 0.8, ease: "power4.out" })
    .from(".nav-card", { opacity: 0, x: -40, duration: 0.6, ease: "power3.out" }, "-=0.4")
    .from(".search-card", { opacity: 0, x: 40, duration: 0.6, ease: "power3.out" }, "-=0.6")
    .from(".main-kiosk-card", { opacity: 0, y: 30, scale: 0.99, duration: 0.8, ease: "back.out(1.2)" }, "-=0.4");
});
</script>

<style scoped>
@keyframes fadeIn { from { opacity: 0; transform: scale(0.99); } to { opacity: 1; transform: scale(1); } }
.animate-fade-in { animation: fadeIn 0.2s cubic-bezier(0.215, 0.610, 0.355, 1) forwards; }

@keyframes slideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
.animate-slide-down { animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

.scale-animation {
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.4);
  will-change: transform;
}
.group\/emoji:hover .scale-animation {
  transform: scale(1.38) translateY(-6px) rotate(3deg);
}
.group\/emoji:active .scale-animation {
  transform: scale(0.9);
}
</style>