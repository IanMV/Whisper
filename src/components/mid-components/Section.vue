<script setup>
import { ref, onMounted } from "vue";
const movies = ref([]);
import { tmdbApi } from "@/services/tmdb";

onMounted(async () => {
 const res = await tmdbApi.getPopularMovies();
movies.value = res.results
  console.log(movies.value);
});

const props = defineProps({
  title: String,
  genres: Array,
});
</script>

<template>
  <section class="carousel">
    <h3>{{ props.title }}oi</h3>
    <ul>
      <li v-for="movie in movies">
        <router-link :to="{ name: 'movie', params: { id: movie.id } }">
          <img
            :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}
`"
            alt=""
          />
        </router-link>
      </li>
    </ul>
  </section>
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
}

.carousel-slide-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.carousel-slide-info {
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(25, 1fr);
  grid-template-rows: repeat(20, 1fr);
}

.carousel-slide-info-title {
  color: c.$color-white;
  font-size: s.$g;
  grid-row: 8 / 9;
  grid-column: 2 / 12;
}

.carousel-slide-info-overview {
  font-size: s.$m2;
  color: c.$color-white;
  grid-row: 10 / 12;
  grid-column: 2 / 12;
}
</style>
