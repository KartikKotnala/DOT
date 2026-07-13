<template>
  <div class="min-h-screen bg-app text-main px-4 md:px-8 pb-12 relative font-sans">
    <div class="ambient-glow"></div>

    <div class="sticky top-0 z-50 bg-panel/90 backdrop-blur-xl pt-6 pb-5 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-line shadow-sm">
      <Header class="header-card" />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <div class="md:col-span-2 nav-card">
          <Sidebar />
        </div>
        <div class="search-card">
          <SearchBar />
        </div>
      </div>
    </div>

    <div class="w-full mt-8 mb-16 flex justify-center assistant-content opacity-0">
      <div class="w-full max-w-4xl bg-panel border border-line rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[75vh]">
        
        <div class="p-6 border-b border-line flex items-center justify-between bg-panel/50">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-red-500/10 border border-red-500 flex items-center justify-center text-red-500 text-xl shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              🤖
            </div>
            <div>
              <h2 class="text-xl font-bold text-main">Mall Navigator AI</h2>
              <p class="text-xs text-emerald-500 font-mono flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500" :class="isListening ? 'animate-ping' : 'animate-pulse'"></span> 
                <span>{{ isListening ? 'Listening to voice stream...' : 'Search database synced // Online' }}</span>
              </p>
            </div>
          </div>
          <button @click="resetChat" class="text-xs text-muted hover:text-red-400 transition-colors uppercase tracking-widest font-bold focus:outline-none">
            Reset Chat
          </button>
        </div>

        <div class="flex-grow p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6" id="chat-window">
          <div v-for="(msg, index) in messages" :key="index" class="flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
            <div class="max-w-[75%] p-4 rounded-2xl relative"
                 :class="msg.role === 'user' ? 'bg-red-500 text-white rounded-tr-sm' : 'bg-line/20 text-main border border-line rounded-tl-sm'">
              <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ msg.text }}</p>
              
              <div v-if="msg.action" class="mt-3 flex flex-wrap gap-2">
                <button 
                  v-for="act in msg.actions" 
                  :key="act.route"
                  @click="executeAction(act.route)" 
                  class="text-xs font-bold px-4 py-2 bg-panel border border-line rounded-lg hover:border-red-400 hover:text-red-400 transition-all focus:outline-none cursor-pointer flex items-center gap-1.5"
                >
                  <span>{{ act.label }}</span> ↗
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-line bg-panel/50">
          <div class="flex flex-wrap gap-2 mb-4">
            <button 
              v-for="shortcut in shortcuts" 
              :key="shortcut.id"
              @click="sendShortcut(shortcut)"
              class="px-4 py-2 bg-panel border border-line rounded-full text-xs font-bold text-muted hover:text-red-400 hover:border-red-400 transition-colors shadow-sm focus:outline-none cursor-pointer"
            >
              {{ shortcut.label }}
            </button>
          </div>
          
          <form @submit.prevent="sendMessage" class="flex items-center gap-3">
            <div class="flex-grow relative">
              <input 
                type="text" 
                v-model="inputText"
                placeholder="Ask me where stores are, find categories, or request directions..."
                class="w-full bg-app border border-line rounded-xl pl-5 pr-14 py-4 text-sm text-main focus:outline-none focus:border-red-500/50 transition-all font-medium"
              />
              
              <button
                v-if="hasVoiceSupport"
                type="button"
                @click.stop="startListening"
                class="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-200 focus:outline-none cursor-pointer"
                :class="isListening 
                  ? 'bg-red-500 text-white border-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.4)]' 
                  : 'bg-white/5 border-line/40 text-muted hover:text-main hover:border-line'"
                title="Speak Question"
              >
                <span class="text-sm leading-none">🎙️</span>
              </button>
            </div>

            <button type="submit" :disabled="!inputText.trim()" class="w-14 h-14 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-red-900/20 focus:outline-none cursor-pointer">
              <span class="text-xl -rotate-45 transform ml-1 mt-1">➔</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";

import Header from "@/components/Header/Header.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import SearchBar from "@/components/Search/SearchBar.vue";
import { useVoice } from "@/useVoice";

const router = useRouter();

const categoryList = ref([]);
const brandList = ref([]);
const deviceList = ref([]);

const shortcuts = [
  { id: 1, label: " Find Apple", query: "Take me to Apple" },
  { id: 2, label: " Food Options", query: "Show me food outlets" },
  { id: 3, label: " File Report", query: "I want to file a complaint" },
  { id: 4, label: " Support Hub", query: "Open layout support" }
];

const initialMessage = {
  role: "system",
  text: "Welcome to our intelligent directory portal. Speak or type your request—I will look up live floor locations, category branches, and display custom path vectors for you instantly."
};

const messages = ref([initialMessage]);
const inputText = ref("");

// 🌟 Hook voice recognition to fill input and submit, but we bypass any speakText routines
const { isListening, startListening, hasVoiceSupport } = useVoice((transcript) => {
  inputText.value = transcript;
  sendMessage();
});

onMounted(async () => {
  const tl = gsap.timeline();
  tl.from(".header-card", { opacity: 0, y: -40, duration: 0.8 })
    .from(".nav-card", { opacity: 0, x: -50, duration: 0.6 }, "-=0.3")
    .from(".search-card", { opacity: 0, x: 50, duration: 0.6 }, "-=0.6")
    .to(".assistant-content", { opacity: 1, y: -10, duration: 0.6 }, "-=0.2");

  try {
    const [catRes, brandRes, devRes] = await Promise.all([
      fetch('/ProductsNames.json'),
      fetch('/SubProductsBrand.json'),
      fetch('/SubProducts.json')
    ]);
    categoryList.value = await catRes.json();
    brandList.value = await brandRes.json();
    deviceList.value = await devRes.json();
  } catch (error) {
    console.error("Assistant indices synchronization failure:", error);
  }
});

const scrollToBottom = async () => {
  await nextTick();
  const chatWin = document.getElementById('chat-window');
  if (chatWin) chatWin.scrollTop = chatWin.scrollHeight;
};

const sendShortcut = (shortcut) => {
  inputText.value = shortcut.query;
  sendMessage();
};

const sendMessage = () => {
  if (!inputText.value.trim()) return;
  
  const queryText = inputText.value;
  messages.value.push({ role: "user", text: queryText });
  inputText.value = "";
  scrollToBottom();
  
  setTimeout(() => {
    const query = queryText.toLowerCase().trim();
    const queryWords = query.split(/\s+/);
    
    let replyText = "";
    let matchedActions = [];

    if (query.includes("complaint") || query.includes("report") || query.includes("support")) {
      replyText = "Opening our operations incident logging terminal path for you.";
      matchedActions.push({ label: "Open Support Form", route: "/contact" });
    } 
    else {
      let matchedBrands = brandList.value.filter(b => 
        queryWords.some(word => b.name?.toLowerCase().includes(word))
      );

      let matchedProducts = deviceList.value.filter(d => 
        queryWords.some(word => d.name?.toLowerCase().includes(word))
      );

      let matchedCategories = categoryList.value.filter(c => 
        queryWords.some(word => c.name?.toLowerCase().includes(word))
      );

      if (matchedBrands.length > 0) {
        replyText = `I found ${matchedBrands.length} brand branch registry matches: \n`;
        matchedBrands.forEach(b => {
          const productSample = deviceList.value.find(d => String(d.brandId) === String(b.id));
          const floorInfo = productSample ? `on Level ${productSample.floor}` : '';
          replyText += `• ${b.name} ${floorInfo}.\n`;
          matchedActions.push({ 
            label: `Maps to ${b.name}`, 
            route: productSample ? `/phone/${productSample.id}/directions` : `/product/${b.id}` 
          });
        });
      } else if (matchedProducts.length > 0) {
        replyText = `I matched the following direct items in our inventory registry:\n`;
        matchedProducts.slice(0, 3).forEach(p => {
          replyText += `• ${p.name} located on Level ${p.floor}.\n`;
          matchedActions.push({ label: `Map ${p.name}`, route: `/phone/${p.id}/directions` });
        });
      } else if (matchedCategories.length > 0) {
        replyText = `I tracked down the following mall operational departments matching that category:\n`;
        matchedCategories.forEach(c => {
          replyText += `• ${c.name} category division.\n`;
          matchedActions.push({ label: `Browse ${c.name}`, route: `/product/${c.id}` });
        });
      } else {
        replyText = "I couldn't isolate that query parameter inside our mall directory profiles. Please try searching for a brand name like Nike, Apple, or Puma, or type 'support'.";
      }
    }

    messages.value.push({
      role: "system",
      text: replyText,
      action: matchedActions.length > 0,
      actions: matchedActions
    });
    
    scrollToBottom();
    // 🌟 REMOVED: speakText(replyText) is gone so it stays quiet!
  }, 700);
};

const executeAction = (route) => {
  router.push(route);
};

const resetChat = () => {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  messages.value = [initialMessage];
};
</script>