<template>
  <div>
    <Skull />
  </div>
</template>

<script setup>
import Skull from "@/../public/skull.svg";
</script>

<style scoped lang="scss">
div {
  transition: all 0.3s ease-in-out;
  scale: 0.8;
}

div:hover {
  transform: scale(1.1);
  transition: all 0.3s ease-in-out;

  :deep(svg path) {
    fill: c.$color-red;
  }

  :deep(svg circle) {
    stroke: c.$color-red;
  }
}
</style>
