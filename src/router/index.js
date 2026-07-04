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
    {
      path: "/products",
      name: "Products",
      component: Products,
    },
    {
      path: "/product/:id", 
      name: "BrandDetail",
      component: () => import('@/components/ProductPage/BrandDetail.vue'),
    },

    {
      path: "/phone/:id/directions",
      name: "PhoneDirection",
      component: () => import('@/views/PhoneDirection.vue'),
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