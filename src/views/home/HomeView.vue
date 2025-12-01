<script setup>
import { onMounted } from "vue";

import Carousel from "@/components/mid-components/Carousel.vue";
import Section from "@/components/mid-components/SectionMovies.vue";

onMounted(() => {
  const url =
    "https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1";

  fetch(url, {
    method: "GET",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmI1ZWM5NjMyMzQ2MjY0OWYwODM0MGI3NzNlMDEwMSIsIm5iZiI6MTc2MDM2NDAwNS4xOSwic3ViIjoiNjhlZDA1ZTVlNWJjZDVmOGRiZDY5MTBiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.bOdFJEEPm4xyguH6NLfr24XL3_0IbPeeP-GrOeYVfJ0", // Token de acesso v4
      accept: "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));
});
</script>

<template>
  <Carousel />
  <Section title="Por que não inicia com clássicos?" :manual="true" />
  <Section title="Alguns recentes" genres="with_genres=27&primary_release_date.gte=2010-01-01&primary_release_date.lte=2019-12-31&sort_by=vote_average.asc"/>
  <Section title="Populares" genres="with_genres=27&vote_count.gte=300&sort_by=vote_average.desc
"/>
</template>

<style scoped></style>
