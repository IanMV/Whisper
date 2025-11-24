<script setup>
import "vue3-carousel/carousel.css";
import { Carousel, Slide } from "vue3-carousel";

const carouselConfig = {
  itemsToShow: 1,
  wrapAround: true,
  autoplay: 3000,
  pauseAutoplayOnHover: false,
};

const props = defineProps({
  images: Array,
});
</script>

<template>
  <Carousel :mouse-drag="false" class="carousel" v-bind="carouselConfig">
    <Slide class="carousel-slide" v-for="(image, index) in images" :key="index">
      <img
        class="carousel-slide-img"
        :src="`https://image.tmdb.org/t/p/w1280${image.file_path}`"
        alt="Backdrop"
      />
    </Slide>
  </Carousel>
</template>

<style scoped lang="scss">
.carousel {
  height: 100vh;
  width: 100vw;
}

.carousel-slide-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

</style>
