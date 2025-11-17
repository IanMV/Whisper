<script setup>
import { onMounted } from "vue";

import Carousel from "@/components/mid-components/Carousel.vue";
import Section from "@/components/mid-components/Section.vue";

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
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
});
</script>

<template>
  <Carousel />
  <h1>Home Page</h1>
  <Section/>
</template>

<style scoped>
h1 {
  margin-top: 100px;
}
</style>
