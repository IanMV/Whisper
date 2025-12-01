<script setup>
import { ref, onMounted } from "vue";
const movies = ref([]);
import { tmdbApi } from "@/services/tmdb";

onMounted(async () => {
  const res = await tmdbApi.getPopularMovies();
  movies.value = res.results;
});

const props = defineProps({
  title: String,
  genres: Array,
});

const carouselRefs = ref([]);

const list = ref([{
  title: "Porque não os clássicos?",
  movies: ["4488", "653","30497", "348", "948", "138843", "274", "10331","19614", "9003", "4232", "109428", "2667", "176", "23827", "694", "565"]
}]);

const m = ref([]);

onMounted(async () => {
  const ids = list.value[0].movies.map(Number);
  m.value = await Promise.all(
    ids.map((id) => tmdbApi.getMovieById(id))
  );
});
const openMovie = (id) => router.push(`/movie/${id}`);

function scrollLeft(index) {
  const el = carouselRefs.value[index];
  if (el) el.scrollBy({ left: -400, behavior: "smooth" });
}
function scrollRight(index) {
  const el = carouselRefs.value[index];
  if (el) el.scrollBy({ left: 400, behavior: "smooth" });
}
</script>

<template>
  <div v-for="(item, index) in list" class="carousel" >
    <h2 class="carousel-title">{{ item.title }}</h2>
    <div class="carousel-container">
      <button class="carousel-arrow left" @click="scrollLeft(index)">
        <span class="mdi mdi-chevron-left"></span>
      </button>
      <div class="carousel-list" ref="carouselRefs" :data-index="index">
        <div
          v-for="movie in m"
          :key="movie.id"
          class="movie-card"
          @click="openMovie(movie.id)"
        >
            <img
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
          />
          
        </div>
      </div>
      <button class="carousel-arrow right" @click="scrollRight(index)">
        <span class="mdi mdi-chevron-right"></span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.carousel {
  margin-top: 30px;
  padding: 0 20px;
  position: relative;
  overflow: hidden;
}

.carousel-title {
  font-size: 2rem;
  margin: 80px 50px 20px 50px;
  color: c.$color-white-text;
  border-bottom: 2px solid c.$color-white-text;
}

.carousel-container {
  display: flex;
  overflow: hidden;
  gap: 12px;
  padding: 10px 0px;
  margin-left: 10%;
  width: 80%;
}

.carousel-list {
  display: flex;
  overflow: hidden;
  gap: 12px;
}

.carousel-arrow {
  position: absolute;
  top: 60%;
  background: transparent;
  border: none;
  font-size: 2rem;
  padding: 10px 15px;
  cursor: pointer;
  color: c.$color-white-text;
  z-index: 2;
  transition: 0.4s all;
}

.carousel-arrow:hover {
  color: c.$color-red-hover;
}

.carousel-arrow.left {
  left: 50px;
}

.carousel-arrow.right {
  right: 50px;
}

.movie-card {
  min-width: 150px;
  cursor: pointer;
  text-align: center;
  transition: 0.4s all;
}

.movie-card img {
  width: 150px;
  height: 220px;
  object-fit: cover;
  border-radius: 12px;
}

.movie-card:hover {
    transform: scale(1.05);
}
</style>