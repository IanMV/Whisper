
import HomeView from "@/views/home/HomeView.vue";

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'
import LoginView from '../views/auth/AuthView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {

      path: "/movie/:id",
      name: "movie",
      component: MoviesView,
      props: true,
    },
    {
      path: '/auth',
      name: 'auth',
      component: LoginView,
    },
  ],
});

export default router;
