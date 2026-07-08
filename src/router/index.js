import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/Home.vue";
import Products from "@/views/Products.vue";
import Gallery from "@/views/Gallery.vue";
import About from "@/views/About.vue";
import Contact from "@/views/Contact.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    // Page 1: Main Category Selection Landing Page
    {
      path: "/products",
      name: "Products",
      component: Products,
    },
    // Page 2: Specific Category items view (Lists Brands like Apple, Samsung)
    {
      path: "/product/:id", 
      name: "BrandDetail",
      component: () => import("@/components/ProductPage/BrandDetail.vue"),
    },
    // Page 3: Specific Brand items view (Lists Devices like iPhone 15 Pro)
    {
      path: "/brand/:id", 
      name: "SubProductDetail",
      component: () => import("@/components/ProductPage/SubProductDetail.vue"),
    },
    // Page 4: Indoor Navigation Radar Map System
    {
      path: "/phone/:id/directions",
      name: "PhoneDirection",
      component: () => import("@/views/PhoneDirection.vue"),
    },
    {
      path: "/gallery",
      name: "Gallery",
      component: Gallery,
    },
    {
      path: "/about",
      name: "About",
      component: About,
    },
    {
      path: "/contact",
      name: "Contact",
      component: Contact,
    },
  ],
});

export default router;