<script setup>
import { tmdbApi } from "@/services/tmdb";
import { onMounted, ref } from "vue";
import MovieCarousel from "./components/MovieCarousel.vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const movie = ref([]);
const backdrops = ref([]);
const yt = ref([]);

function formatRelease(date) {
  return date.split("-")[0];
}

function formatRuntime(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}min`;
}

onMounted(async () => {
  {
    const res_movie = await tmdbApi.getMovieById(props.id);
    movie.value = res_movie;
  }
  {
    const res_images = await tmdbApi.searchImage(props.id);
    backdrops.value = res_images.backdrops.slice(0, 10);
  }
  {
    const res_videos = await tmdbApi.searchVideo(props.id);
    const trailer = res_videos.results.find(
      (v) => v.site === "YouTube" && v.type === "Trailer"
    );

    yt.value = trailer ? trailer.key : null;
  }
});
</script>

<template>
  <section class="section-backdrop">
    <MovieCarousel :images="backdrops" />
    <div>
      <div>
        <h2>{{ movie.title }}</h2>
        <p>Avaliação: {{ movie.vote_average }}</p>
      </div>

      <div>
        <p>{{ movie.overview }}</p>
        <p>{{ formatRuntime(movie.runtime) }}</p>
        <p>{{ formatRelease(movie.release_date) }}</p>
      </div>

      <div></div>
      <ul>
        <li v-for="genre in movie.genres">
          <p>{{ genre.name }}</p>
        </li>
      </ul>
    </div>
  </section>

  <section class="section-cast"></section>
  <section class="section-info">oi</section>
  <section class="section-media">
    <iframe
      v-if="yt"
      :src="`https://www.youtube.com/embed/${yt}`"
      title="Trailer"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </section>
  <section class="section-recommends"></section>
</template>

<style scoped lang="scss">
.section-backdrop {
  width: 100dvw;
  height: 100dvh;
  position: relative;

  div {
    position: absolute; 
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: grid;
    grid-template-columns: repeat(25, 1fr);
    grid-template-rows: repeat(20, 1fr);

    h2 {
      grid-row: 3 / 9;
      grid-column: 2 / 12;
      z-index: 2;
      position: relative;
    }

    p {
    }
  }
}

.section-info {
}
.section-media {
}
.section-cast {
}

.section-recommends {
}
</style>
