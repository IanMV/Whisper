
import HomeView from "@/views/home/HomeView.vue";

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'
import LoginView from '../views/auth/AuthView.vue'
import DetailMovieView from '../views/detailMovie/DetailMovieView.vue'
import MyListView from '@/views/list/MyListView.vue'
import MoviePageView from '@/views/pages/MovieView.vue'
import HighlightsView from '@/views/highlights/HighlightsView.vue'


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
    { 
      path: '/movie/:id',
      name: 'detailMovie',
      component: DetailMovieView,
      props: true
    },
    { 
      path: '/my-list',
      name: 'myList',
      component: MyListView,
    },
    {
      path: '/moviePage',
      name: 'moviePage',
      component: MoviePageView,
    },
    {
      path: '/highlight',
      name:'highlight',
      component: HighlightsView,
    }
  ],

  scrollBehavior() {
    return { top: 0 }
  }
})
=======
});

export default router;
