<template>
  <nav
    class="animate-card glass-panel rounded-full p-2 flex justify-between items-center overflow-x-auto"
  >
    <RouterLink
      v-for="item in navItems"
      :key="item.name"
      :to="item.path"
      class="px-6 py-2 rounded-full text-xs uppercase tracking-[0.25em] font-mono transition-all duration-300"
      :class="
        $route.path === item.path
          ? 'bg-red-600 text-main font-bold shadow-lg shadow-red-600/30'
          : 'text-main/50 hover:text-main hover:bg-white/10'
      "
    >
      {{ item.name }}
    </RouterLink>
  </nav>
</template>

<script setup>
const navItems = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Cart", path: "/cart" }, 
  { name: "Assistant", path: "/assistant" },
  { name: "Complaint", path: "/contact" },
];
</script>