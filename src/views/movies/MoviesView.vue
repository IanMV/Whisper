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
onMounted(async () => {
  const res_movie = await tmdbApi.getMovieById(props.id);
  movie.value = res_movie;

  const res_images = await tmdbApi.searchImage(props.id);
  backdrops.value = res_images.backdrops.slice(0, 10);

  const res_videos = await tmdbApi.searchVideo(props.id);
   const trailer = res_videos.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );

  yt.value = trailer ? trailer.key : null;
});
</script>

<template>
  <section>
    <MovieCarousel :images="backdrops" />
    <div>
      <h2>{{ movie.title }}</h2>
      <p>{{ movie.overview }}</p>
      <p>Lançamento: {{ movie.release_date }}</p>
    </div>
  </section>
  <section v-if="movie.video"></section>
  <section>
    <iframe
    v-if="yt"
      :src="`https://www.youtube.com/embed/${yt}`"
      title="Trailer"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </section>
</template>
