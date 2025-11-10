<script setup>
import { RouterView } from 'vue-router';
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
</script>

<template>
  <HeaderComponent></HeaderComponent>
  <main>
    <RouterView></RouterView>
  </main>
  <FooterComponent/>
</template>