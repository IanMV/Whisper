<script setup>
import "vue3-carousel/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import { ref, onMounted } from "vue";

const carouselConfig = {
  itemsToShow: 1,
  wrapAround: true,
  autoplay: 3000, // ← roda a cada 3 segundos
  pauseAutoplayOnHover: false,
};

const filmes = ref([]);

onMounted(async () => {
  const url =
    "https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1";

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NmI1ZWM5NjMyMzQ2MjY0OWYwODM0MGI3NzNlMDEwMSIsIm5iZiI6MTc2MDM2NDAwNS4xOSwic3ViIjoiNjhlZDA1ZTVlNWJjZDVmOGRiZDY5MTBiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.bOdFJEEPm4xyguH6NLfr24XL3_0IbPeeP-GrOeYVfJ0",
      accept: "application/json",
    },
  }).then((res) => res.json());

  filmes.value = res.results.slice(0, 10);
});



defineProps
</script>

<template>
  <Carousel :mouse-drag="false" class="carousel" v-bind="carouselConfig">
    <Slide class="carousel-slide" v-for="filme in filmes" :key="filme.id">
      <img
        class="carousel-slide-img"
        :src="`https://image.tmdb.org/t/p/w1280${filme.backdrop_path}`"
        alt=""
      />
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
