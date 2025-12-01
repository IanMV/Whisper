<script setup>
import "vue3-carousel/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import { useAuthStore } from "@/stores/auth";
const auth = useAuthStore()


const carouselConfig = {
  itemsToShow: 1,
  wrapAround: true,
  autoplay: 3000,
  pauseAutoplayOnHover: false,
};

const filmes = ref([]);

onMounted(async () => {
  const randomPage = Math.floor(Math.random() * 4) + 1;

  const url =
    "https://api.themoviedb.org/3/discover/movie?" +
    `language=pt-BR&page=${randomPage}` +
    "&with_genres=27" +
    "&sort_by=popularity.desc" +
    "&vote_average.gte=6" +
    "&vote_count.gte=800";

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
      accept: "application/json",
    },
  }).then((res) => res.json());

  filmes.value = res.results.slice(0, 10);
});

const openMovie = (id) => router.push(`/movie/${id}`);

const addToList = (id) => {
  if (!auth.token) return router.push("/my-list");
  toggleList(id);
};
</script>

<template>
  <Carousel :mouse-drag="false" class="carousel" v-bind="carouselConfig">
    <Slide class="carousel-slide" v-for="filme in filmes" :key="filme.id">
      <img
        class="carousel-slide-img "
        :src="`https://image.tmdb.org/t/p/w1920${filme.backdrop_path}`"
        alt=""
      />
      <div class="carousel-slide-info">
        <h2 class="carousel-slide-info-title">{{ filme.title }} <small class="year"
            >({{ new Date(filme.release_date).getFullYear() }})</small
          ></h2>
        <p class="carousel-slide-info-overview">{{ filme.overview }}</p>
        <div class="hero-buttons">
          <button @click="openMovie(filme.id)" class="hero-btn">
            Ver detalhes
          </button>
          <button @click="addToList(filme.id)" class="hero-btn add-btn">
            Minha Lista
          </button>
        </div>
      </div>
      
    </Slide>
  </Carousel>
</template>

<style scoped lang="scss">
.carousel {
  height: 100vh;
  width: 100vw;
}

.carousel-slide {
  position: relative;
  height: 100%;
  width: 100%;

    &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.5), #0c0c0c);
    pointer-events: none;
    z-index: 2;
  }
}

.year {
  font-weight: normal;
  color: c.$color-red-hover;
  font-size: 2rem;
}

.carousel-slide-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  
}

.carousel-slide-info {
    z-index: 3;
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(25, 1fr);
  grid-template-rows: repeat(20, 1fr);
}

.carousel-slide-info-title {
  color: c.$color-white-text;
  font-size: s.$g;
  grid-row: 15 / 16;
  grid-column: 2 / 12;
}

.carousel-slide-info-overview {

  color: c.$color-white-text;
  grid-row: 17 / 18;
  grid-column: 2 / 13;
   font-size: 1.2rem;
  color: c.$color-gray-text;
  margin-bottom: 25px;
}


.hero-buttons {
  display: flex;
  gap: 12px;
  grid-column: 2 / 13;
  grid-row: 18 / 20;
  z-index: 3;
}


.hero-btn {
  background: c.$color-red-hover;
  padding: 12px 22px;
  font-size: 1rem;
  border: 2px solid c.$color-red-hover;
  color: c.$color-white-text;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.4s all;
  max-height: 50px;
}

.add-btn {
  background: transparent;
  color: c.$color-red-hover;
  border: 2px solid c.$color-red-hover;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: bold;
  transition: 0.4s all;
}

.add-btn:hover,
.hero-btn:hover {
  transform: scale(1.05);
  background: c.$color-red-hover;
  color: c.$color-white-text;
  box-shadow: c.$color-red-hover 0px 0px 8px;
}

</style>
