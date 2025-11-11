<script setup>
import { RouterLink } from "vue-router";
import Logo from "@/../public/logo.svg";
</script>

<template>
  <footer>
    <RouterLink to="/">
      <Logo />
    </RouterLink>
    <p>&copy; 2025 - Todos os direitos reservados</p>
  </footer>
</template>

<style scoped lang="scss">
footer {
  color: c.$color-white;
  text-align: center;
  padding: 20px;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 10px;

}
</style>
