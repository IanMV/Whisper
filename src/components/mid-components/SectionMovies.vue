<script setup>
import { ref, onMounted } from "vue";
const movies = ref([]);
import { tmdbApi } from "@/services/tmdb";

onMounted(async () => {
  const res = await tmdbApi.getPopularMovies();
  movies.value = res.results;
  console.log(movies.value);
});

const props = defineProps({
  title: String,
  genres: Array,
});

const list = ref([])

function scrollMovie(){
  console.log(list.value.scrollWidth)
     list.scrollWidth = list.scrollWidth;
}


</script>

<template>
  <section class="section">
    <h3 class="section-title">{{ props.title }}</h3>
    <button><</button>
    <ul class="section-list" :ref="(e) => list = e">
      <li class="section-list-item" v-for="movie in movies">
        <router-link :to="{ name: 'movie', params: { id: movie.id } }">
          <img
            :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}
`"
            alt=""
          />
        </router-link>
      </li>
    </ul>
    <button @click="scrollMovie()">></button>
  </section>
</template>

<style scoped lang="scss">


.section {
  margin: 0 20px 0 20px;
  display: grid;
  grid-template-columns: 10% 80% 10%;
  grid-template-rows: 1fr 1fr;
}

.section .section-title {
  grid-row: 1 / 2;
  grid-column: 1 / 4;
}

.section .section-list {
  grid-row: 2 / 3;
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 30px;
  grid-template: 2 / 3;
  overflow: hidden;
}

button{
  border: none;
  background-color: transparent;
  color: c.$color-white;
    grid-row: 2 / 3;
     grid-template: 1 / 2;

    &:last-child{
      grid-template: 3 / 4;
    }
}

.section .section-list .section-list-item {
}
</style>
