<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import Skull from "./svg/Skull.vue";
import Logo from './svg/Logo.vue';

const showSearch = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const lastScroll = ref(0)
const showHeader = ref(true)

const toggleSearch = async () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    await nextTick()
    searchInput.value?.focus()
  }
}

const handleClickOutside = (event) => {
  const searchArea = document.querySelector('.search-container')
  if (searchArea && !searchArea.contains(event.target)) {
    showSearch.value = false
  }
}

const handleScroll = () => {
  const currentScroll = window.scrollY
  if (currentScroll > lastScroll.value && currentScroll > 80) {
    showHeader.value = false
  } else {
    showHeader.value = true
  }
  lastScroll.value = currentScroll
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header :class="{ hidden: !showHeader }">
    <div class="header-left">
      <h1>
        <RouterLink to="/">
          <Logo/>
        </RouterLink>
      </h1>

      <nav>
        <ul>
          <li><RouterLink to="/">Início</RouterLink></li>
          <li><RouterLink to="/filmes">Filmes</RouterLink></li>
          <li><RouterLink to="/series">Séries</RouterLink></li>
          <li><RouterLink to="/detalhes">Destaques</RouterLink></li>
            <li><RouterLink to="/lista">Minha Lista</RouterLink></li>
        </ul>
      </nav>
    </div>

    <div class="header-right">
      <div class="search-container">
        <span class="mdi mdi-magnify" @click.stop="toggleSearch"></span>

        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          placeholder="Pesquisar..."
          class="search-input"
          :class="{ active: showSearch }"
        />
      </div>

      <RouterLink to="/login">
        <Skull/>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped lang="scss">
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px 0px 40px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  transition: transform 0.4s ease, opacity 0.4s ease;
  z-index: 9999;
}

header.hidden {
  transform: translateY(-100%);
  opacity: 0;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left img {
  height: 50px;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin-left: 40px;
  padding: 0;
}

nav ul li {
  cursor: pointer;
  transition: all 0.3s ease;
}

nav ul li:hover {
  transform: scale(1.1);
}

nav ul li a {
  font-size: 1.03rem;
  text-decoration: none;
  font-weight: normal;
  transition: all 0.3s ease;
  color: c.$color-white;
  text-decoration: none;
}

nav ul li:hover a {
  text-shadow: black 0px 0px 3px;
  color: c.$color-red;

}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-container .mdi-magnify {
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: absolute;
  left: 10px;
  z-index: 2;
  color: c.$color-white;
}

.search-container .mdi-magnify:hover {
  transform: scale(1.2);
    color: c.$color-red;
}

.search-input {
    border-color: c.$color-red;
  border-style: solid;
  padding: 8px 12px 8px 38px;
  font-size: 1rem;
  border-radius: 20px;
  background-color: transparent;
  color: c.$color-white !important;
  outline: none;
  width: 0;
  opacity: 0;
  transition: all 0.3s ease;
}

.search-input.active {
  width: 400px;
  opacity: 1;
  border-color: c.$color-red;
  border-style: solid;
  box-shadow: black 0px 0px 8px;
   color: c.$color-red;
}

.search-input.active ~ .mdi-magnify,
.search-container:has(.search-input.active) .mdi-magnify {
  color: c.$color-red;
}
</style>