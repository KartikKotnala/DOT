import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/Home.vue";
import Products from "@/views/Products.vue";
import Cart from "@/views/Cart.vue";
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
    {
      path: "/product/:id", 
      name: "BrandDetail",
      component: () => import("@/components/ProductPage/BrandDetail.vue"),
    },
    // Page 3: Indoor Navigation Radar Map System
    {
      path: "/phone/:id/directions",
      name: "PhoneDirection",
      component: () => import("@/views/PhoneDirection.vue"),
    },
    {
      path: "/assistant",
      name: "Assistant",
      component: () => import("@/views/Assistant.vue"),
    },
    {
      path: "/contact",
      name: "Contact",
      component: Contact,
    },
    
    {
      path:"/cart",
      name:"Cart",
      component:Cart,
    },
    
  ],
});

export default router;