<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { RouterLink } from 'vue-router'
import Skull from "./svg/Skull.vue";
import Logo from './svg/Logo.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()

const showSearch = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const lastScroll = ref(0)
const showHeader = ref(true)
const searchResults = ref([]) 
const isSearching = ref(false) 

const TMDB_API_KEY = '817aab6edd675cf23cb2adfd4ddfcfab' 

const toggleSearch = async () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    await nextTick()
    searchInput.value?.focus()
  } else {
    searchResults.value = []
    searchQuery.value = ''
  }
}

const handleClickOutside = (event) => {
  const searchArea = document.querySelector('.search-container')
  if (searchArea && !searchArea.contains(event.target)) {
    showSearch.value = false
    searchResults.value = []
    searchQuery.value = ''
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

const searchTMDB = async (query) => {
  if (!query.trim()) {
    searchResults.value = []
    return
  }
  isSearching.value = true
  try {
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR&page=1`
    const response = await fetch(url)
    const data = await response.json()
    searchResults.value = data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv').slice(0, 5) 
  } catch (error) {
    console.error('Erro na busca TMDB:', error)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

watch(searchQuery, (newQuery) => {
  if (showSearch.value) {
    clearTimeout(window.searchTimeout)
    window.searchTimeout = setTimeout(() => searchTMDB(newQuery), 300)
  }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
  clearTimeout(window.searchTimeout)
})
</script>

<template>
  <header :class="{ hidden: !showHeader }">
    <div class="header-left">
      <h1>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
      </h1>

      <nav>
        <ul>
          <li>
            <RouterLink to="/">Início</RouterLink>
          </li>
          <li>
            <RouterLink to="/filmes">Filmes</RouterLink>
          </li>
          <li>
            <RouterLink to="/series">Séries</RouterLink>
          </li>
          <li>
            <RouterLink to="/detalhes">Destaques</RouterLink>
          </li>
          <li>
            <RouterLink to="/lista">Minha Lista</RouterLink>
          </li>
        </ul>
      </nav>
    </div>

    <div class="header-right">
      <div class="search-container">
        <span class="mdi mdi-magnify" @click.stop="toggleSearch"></span>

        <input ref="searchInput" v-model="searchQuery" type="text" placeholder="Pesquisar filmes/séries..." class="search-input"
          :class="{ active: showSearch }" />

        <div v-if="showSearch && (searchResults.length > 0 || isSearching)" class="search-results">
          <div v-if="isSearching" class="loading">Buscando...</div>
          <div v-else-if="searchResults.length === 0 && searchQuery.trim()">Nenhum resultado encontrado.</div>
          <div v-for="result in searchResults" :key="result.id" class="result-item" @click="handleResultClick(result)">
            <img :src="result.poster_path ? `https://image.tmdb.org/t/p/w92${result.poster_path}` : 'https://via.placeholder.com/92x138?text=Sem+Imagem'" :alt="result.title || result.name" />
            <div class="result-info">
              <h4>{{ result.title || result.name }}</h4>
              <p>{{ result.release_date || result.first_air_date ? new Date(result.release_date || result.first_air_date).getFullYear() : 'Ano N/A' }}</p>
            </div>
          </div>
        </div>
      </div>

      <RouterLink to="/auth">
        <Skull />
      </RouterLink>
    </div>
  </header>
</template>

<style scoped lang="scss">

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  width: 400px;
  background-color: c.$color-black-bottom;
  border: 1px  solid c.$color-red-hover;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10000;
  box-shadow: 0 4px 8px c.$color-black-bottom;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid c.$color-gray-bottom;
}

.result-item:hover {
  background-color: rgba(255, 0, 0, 0.1);
}

.result-item img {
  width: 50px;
  height: 75px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 4px;
}

.result-info h4 {
  margin: 0;
  font-size: 1rem;
  color: c.$color-white-text;
}

.result-info p {
  margin: 0;
  font-size: 0.8rem;
  color: c.$color-red-hover;
}

.loading {
  padding: 10px;
  text-align: center;
  color: c.$color-white-text;
}

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
  color: c.$color-white-text;
  text-decoration: none;
}

nav ul li:hover a {
  text-shadow: c.$color-red-hover 0px 0px 3px;
  color: c.$color-red-hover;

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
  color: c.$color-white-text;
}

.search-container .mdi-magnify:hover {
  transform: scale(1.2);
  color: c.$color-red-hover;
}

.search-input {
  border-color: c.$color-red-hover;
  border-style: solid;
  padding: 8px 12px 8px 38px;
  font-size: 1rem;
  border-radius: 20px;
  background-color: transparent;
  color: c.$color-white-text !important;
  outline: none;
  width: 0;
  opacity: 0;
  transition: all 0.3s ease;
}

.search-input.active {
  width: 400px;
  opacity: 1;
  border-color: c.$color-red-hover;
  border-style: solid;
  box-shadow: black 0px 0px 8px;
  color: c.$color-red-hover;
}

.search-input.active~.mdi-magnify,
.search-container:has(.search-input.active) .mdi-magnify {
  color: c.$color-red-hover;
}
</style>