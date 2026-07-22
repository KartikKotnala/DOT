<template>
  <div class="min-h-screen bg-[#f0f2f5] text-slate-800 font-sans flex">
    
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0">
      
      <!-- Top Bar -->
      <header class="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-sm">
        <h1 class="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Catalog Management
        </h1>

        <div class="flex items-center gap-2">
          <button @click="openModal('category')" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
            + Add Category
          </button>
          <button @click="openModal('brand')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
            + Add Brand
          </button>
          <button @click="openModal('subProduct')" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
            + Add Sub-Product
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="p-6 space-y-6 overflow-y-auto">
        
        <!-- Tab Navigation -->
        <div class="flex gap-4 border-b border-slate-200 pb-3">
          <button 
            @click="activeTab = 'categories'"
            class="text-xs font-bold pb-1 transition-all cursor-pointer"
            :class="activeTab === 'categories' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-700'"
          >
            📂 Categories ({{ categories.length }})
          </button>
          <button 
            @click="activeTab = 'brands'"
            class="text-xs font-bold pb-1 transition-all cursor-pointer"
            :class="activeTab === 'brands' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-700'"
          >
            🏷️ Brands ({{ brands.length }})
          </button>
          <button 
            @click="activeTab = 'subProducts'"
            class="text-xs font-bold pb-1 transition-all cursor-pointer"
            :class="activeTab === 'subProducts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-700'"
          >
            📱 Sub-Products ({{ subProducts.length }})
          </button>
        </div>

        <!-- Tab 1: Categories -->
        <div v-if="activeTab === 'categories'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="cat in categories" :key="cat.id" class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <span class="text-[10px] font-mono font-bold text-slate-400 block uppercase">ID: {{ cat.id }}</span>
              <h3 class="font-bold text-slate-800 text-sm mt-1">{{ cat.name }}</h3>
              <p class="text-xs text-slate-500 mt-2">{{ cat.description || 'No description provided.' }}</p>
            </div>
            
            <div class="flex justify-end gap-2 mt-4 pt-3 border-t">
              <button @click="openModal('category', cat)" class="px-2.5 py-1 text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold rounded-lg transition-all cursor-pointer">✏️ Edit</button>
              <button @click="deleteItem('categories', cat.id)" class="px-2.5 py-1 text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold rounded-lg transition-all cursor-pointer">🗑️ Delete</button>
            </div>
          </div>
        </div>

        <!-- Tab 2: Brands -->
        <div v-else-if="activeTab === 'brands'" class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="b in brands" :key="b.id" class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-center flex flex-col items-center justify-between gap-3">
            <div class="flex flex-col items-center gap-2">
              <div class="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden p-1 border">
                <img :src="getImageUrl(b.image)" :alt="b.name" class="h-full object-contain" @error="onImageError" />
              </div>
              <div>
                <span class="text-[9px] font-mono text-slate-400 block">Brand ID: {{ b.id }}</span>
                <h4 class="font-bold text-slate-800 text-sm">{{ b.name }}</h4>
              </div>
            </div>

            <div class="flex gap-2 w-full pt-2 border-t justify-center">
              <button @click="openModal('brand', b)" class="px-2 py-1 text-[11px] bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold rounded-lg transition-all cursor-pointer">✏️ Edit</button>
              <button @click="deleteItem('brands', b.id)" class="px-2 py-1 text-[11px] bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold rounded-lg transition-all cursor-pointer">🗑️ Delete</button>
            </div>
          </div>
        </div>

        <!-- Tab 3: Sub-Products -->
        <div v-else-if="activeTab === 'subProducts'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="prod in subProducts" :key="prod.id" class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4">
            <div>
              <div class="w-full h-32 bg-slate-50 border border-slate-100 rounded-xl mb-3 flex items-center justify-center overflow-hidden p-2">
                <img :src="getImageUrl(prod.image)" :alt="prod.name" class="h-full object-contain" @error="onImageError" />
              </div>

              <div class="flex justify-between items-start mb-1">
                <span class="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  Floor {{ prod.floor }}
                </span>
                <span class="text-xs font-black text-emerald-600">₹{{ prod.price?.toLocaleString() }}</span>
              </div>

              <h3 class="font-bold text-slate-800 text-sm">{{ prod.name }}</h3>
              <p class="text-[11px] font-mono text-slate-400 mt-0.5">
                {{ prod.storage ? prod.storage : '' }} {{ prod.ram ? '| RAM: ' + prod.ram : '' }}
              </p>
              <p class="text-xs text-slate-500 mt-2 line-clamp-2">{{ prod.description }}</p>
            </div>

            <div>
              <div class="text-[10px] bg-slate-50 p-2 rounded-lg border text-slate-500 font-mono flex justify-between mb-3">
                <span>Brand: {{ prod.brandId }}</span>
                <span>Map: ({{ prod.mapX }}, {{ prod.mapY }})</span>
              </div>

              <div class="flex justify-end gap-2 pt-2 border-t">
                <button @click="openModal('subProduct', prod)" class="px-2.5 py-1 text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold rounded-lg transition-all cursor-pointer">✏️ Edit</button>
                <button @click="deleteItem('products', prod.id)" class="px-2.5 py-1 text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold rounded-lg transition-all cursor-pointer">🗑️ Delete</button>
              </div>
            </div>
          </div>
        </div>

      </main>

      <!-- Category Modal -->
      <div v-if="modalType === 'category'" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white text-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
          <div class="flex justify-between items-center border-b pb-3">
            <h3 class="font-bold text-sm uppercase">{{ isEditing ? 'Edit Category' : 'Add Category' }}</h3>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
          </div>

          <form @submit.prevent="submitCategory" class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-600 mb-1">Category ID *</label>
              <input v-model="categoryForm.id" :disabled="isEditing" required type="text" placeholder="e.g. 1" class="w-full bg-slate-50 border rounded-xl p-2.5 disabled:bg-slate-200" />
            </div>

            <div>
              <label class="block font-bold text-slate-600 mb-1">Category Name *</label>
              <input v-model="categoryForm.name" required type="text" placeholder="e.g. Mobile Phones" class="w-full bg-slate-50 border rounded-xl p-2.5" />
            </div>

            <div>
              <label class="block font-bold text-slate-600 mb-1">Description</label>
              <textarea v-model="categoryForm.description" placeholder="e.g. Mobile devices and smart handhelds" class="w-full bg-slate-50 border rounded-xl p-2.5 h-20 resize-none"></textarea>
            </div>

            <button type="submit" class="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl uppercase transition-all cursor-pointer">
              {{ isEditing ? 'Update Category' : 'Save Category' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Brand Modal -->
      <div v-if="modalType === 'brand'" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white text-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
          <div class="flex justify-between items-center border-b pb-3">
            <h3 class="font-bold text-sm uppercase">{{ isEditing ? 'Edit Brand' : 'Add Brand' }}</h3>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
          </div>

          <form @submit.prevent="submitBrand" class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-600 mb-1">Brand ID *</label>
              <input v-model="brandForm.id" :disabled="isEditing" required type="text" placeholder="e.g. b3" class="w-full bg-slate-50 border rounded-xl p-2.5 disabled:bg-slate-200" />
            </div>

            <div>
              <label class="block font-bold text-slate-600 mb-1">Category ID *</label>
              <input v-model="brandForm.ProductsNamesid" required type="text" placeholder="e.g. 1 (for Phone)" class="w-full bg-slate-50 border rounded-xl p-2.5" />
            </div>

            <div>
              <label class="block font-bold text-slate-600 mb-1">Brand Name *</label>
              <input v-model="brandForm.name" required type="text" placeholder="e.g. OnePlus" class="w-full bg-slate-50 border rounded-xl p-2.5" />
            </div>

            <!-- Image File Upload -->
            <div>
              <label class="block font-bold text-slate-600 mb-1">Brand Logo / Image *</label>
              <input @change="handleFileUpload($event, 'brand')" type="file" accept="image/*" class="w-full bg-slate-50 border rounded-xl p-2 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-white hover:file:bg-slate-900 cursor-pointer" />
              <div v-if="brandForm.image" class="mt-2 flex items-center gap-2">
                <img :src="getImageUrl(brandForm.image)" class="w-8 h-8 object-contain rounded border" />
                <span class="text-[10px] text-slate-400 truncate max-w-[200px]">Selected Image</span>
              </div>
            </div>

            <button type="submit" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl uppercase transition-all cursor-pointer">
              {{ isEditing ? 'Update Brand' : 'Save Brand' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Sub-Product Modal -->
      <div v-if="modalType === 'subProduct'" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white text-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center border-b pb-3">
            <h3 class="font-bold text-sm uppercase">{{ isEditing ? 'Edit Sub-Product' : 'Add Sub-Product' }}</h3>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
          </div>

          <form @submit.prevent="submitSubProduct" class="space-y-3 text-xs">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-bold text-slate-600 mb-1">Sub-Product ID *</label>
                <input v-model="subProductForm.id" :disabled="isEditing" required type="text" placeholder="e.g. p1" class="w-full bg-slate-50 border rounded-xl p-2.5 disabled:bg-slate-200" />
              </div>
              <div>
                <label class="block font-bold text-slate-600 mb-1">Brand ID *</label>
                <input v-model="subProductForm.brandId" required type="text" placeholder="e.g. b1" class="w-full bg-slate-50 border rounded-xl p-2.5" />
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-600 mb-1">Product Name *</label>
              <input v-model="subProductForm.name" required type="text" placeholder="e.g. iPhone 15 Pro" class="w-full bg-slate-50 border rounded-xl p-2.5" />
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-bold text-slate-600 mb-1">Price (₹) *</label>
                <input v-model="subProductForm.price" required type="number" placeholder="93399" class="w-full bg-slate-50 border rounded-xl p-2.5" />
              </div>
              
              <!-- Image File Upload -->
              <div>
                <label class="block font-bold text-slate-600 mb-1">Product Image *</label>
                <input @change="handleFileUpload($event, 'subProduct')" type="file" accept="image/*" class="w-full bg-slate-50 border rounded-xl p-1.5 text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
              </div>
            </div>

            <div v-if="subProductForm.image" class="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border">
              <img :src="getImageUrl(subProductForm.image)" class="w-10 h-10 object-contain rounded border bg-white" />
              <span class="text-[10px] text-slate-500 truncate">Image Ready</span>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-bold text-slate-600 mb-1">Storage</label>
                <input v-model="subProductForm.storage" type="text" placeholder="256GB" class="w-full bg-slate-50 border rounded-xl p-2.5" />
              </div>
              <div>
                <label class="block font-bold text-slate-600 mb-1">RAM</label>
                <input v-model="subProductForm.ram" type="text" placeholder="8GB" class="w-full bg-slate-50 border rounded-xl p-2.5" />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="block font-bold text-slate-600 mb-1">Floor</label>
                <input v-model="subProductForm.floor" type="number" placeholder="1" class="w-full bg-slate-50 border rounded-xl p-2.5" />
              </div>
              <div>
                <label class="block font-bold text-slate-600 mb-1">Map X</label>
                <input v-model="subProductForm.mapX" type="number" placeholder="520" class="w-full bg-slate-50 border rounded-xl p-2.5" />
              </div>
              <div>
                <label class="block font-bold text-slate-600 mb-1">Map Y</label>
                <input v-model="subProductForm.mapY" type="number" placeholder="295" class="w-full bg-slate-50 border rounded-xl p-2.5" />
              </div>
            </div>

            <button type="submit" class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl uppercase transition-all cursor-pointer">
              {{ isEditing ? 'Update Sub-Product' : 'Save Sub-Product' }}
            </button>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Sidebar from '../components/layout/Sidebar.vue';

// 1. Default Tab set to categories
const activeTab = ref('categories');
const modalType = ref(null);
const isEditing = ref(false);

const categories = ref([]);
const brands = ref([]);
const subProducts = ref([]);

// Initial Blank Form State Builders
const createInitialCategoryForm = () => ({ id: '', name: '', description: '' });
const createInitialBrandForm = () => ({ id: '', ProductsNamesid: '1', name: '', image: '' });
const createInitialSubProductForm = () => ({
  id: '', brandId: 'b1', name: '', price: '', storage: '',
  ram: '', image: '', description: '', floor: 1, mapX: 0, mapY: 0, kioskPaths: {}
});

// Form Reactive States
const categoryForm = ref(createInitialCategoryForm());
const brandForm = ref(createInitialBrandForm());
const subProductForm = ref(createInitialSubProductForm());

// Handle File Selection and Convert to Base64
const handleFileUpload = (event, targetType) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64Image = e.target.result;
    if (targetType === 'brand') {
      brandForm.value.image = base64Image;
    } else if (targetType === 'subProduct') {
      subProductForm.value.image = base64Image;
    }
  };
  reader.readAsDataURL(file);
};

// Fetch Catalog Data
const fetchCatalog = async () => {
  try {
    const res = await fetch('http://localhost:5001/api/admin/catalog');
    const data = await res.json();
    categories.value = data.categories || [];
    brands.value = data.brands || [];
    subProducts.value = data.products || data.subProducts || [];
  } catch (err) {
    console.error('Failed to load catalog:', err);
  }
};

// Modal Control
const openModal = (type, itemData = null) => {
  modalType.value = type;
  if (itemData) {
    isEditing.value = true;
    if (type === 'category') categoryForm.value = { ...itemData };
    if (type === 'brand') brandForm.value = { ...itemData };
    if (type === 'subProduct') subProductForm.value = { ...itemData };
  } else {
    isEditing.value = false;
    if (type === 'category') categoryForm.value = createInitialCategoryForm();
    if (type === 'brand') brandForm.value = createInitialBrandForm();
    if (type === 'subProduct') subProductForm.value = createInitialSubProductForm();
  }
};

const closeModal = () => {
  modalType.value = null;
  isEditing.value = false;
};

// API Handlers (Create & Update)
const submitCategory = async () => {
  const url = isEditing.value
    ? `http://localhost:5001/api/admin/categories/${categoryForm.value.id}`
    : 'http://localhost:5001/api/admin/categories';
  
  try {
    await fetch(url, {
      method: isEditing.value ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryForm.value)
    });
    closeModal();
    fetchCatalog();
  } catch (err) {
    console.error('Failed to submit category:', err);
  }
};

const submitBrand = async () => {
  const url = isEditing.value
    ? `http://localhost:5001/api/admin/brands/${brandForm.value.id}`
    : 'http://localhost:5001/api/admin/brands';

  try {
    await fetch(url, {
      method: isEditing.value ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brandForm.value)
    });
    closeModal();
    fetchCatalog();
  } catch (err) {
    console.error('Failed to submit brand:', err);
  }
};

const submitSubProduct = async () => {
  const url = isEditing.value
    ? `http://localhost:5001/api/admin/products/${subProductForm.value.id}`
    : 'http://localhost:5001/api/admin/products';

  try {
    await fetch(url, {
      method: isEditing.value ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subProductForm.value)
    });
    closeModal();
    fetchCatalog();
  } catch (err) {
    console.error('Failed to submit sub-product:', err);
  }
};

// Delete Handler
const deleteItem = async (resourceType, id) => {
  if (!confirm(`Are you sure you want to delete item ${id}?`)) return;
  try {
    await fetch(`http://localhost:5001/api/admin/${resourceType}/${id}`, {
      method: 'DELETE'
    });
    fetchCatalog();
  } catch (err) {
    console.error(`Failed to delete ${resourceType}:`, err);
  }
};

// Image Helper - handles both Base64 uploaded images and traditional URL/assets
const getImageUrl = (imageSrc) => {
  if (!imageSrc) return 'https://via.placeholder.com/150?text=No+Image';
  if (imageSrc.startsWith('data:image') || imageSrc.startsWith('http')) {
    return imageSrc;
  }
  try {
    return new URL(`../assets/images/${imageSrc}`, import.meta.url).href;
  } catch {
    return 'https://via.placeholder.com/150?text=No+Image';
  }
};

const onImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/150?text=No+Image';
};

onMounted(fetchCatalog);
</script>