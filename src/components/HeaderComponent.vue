<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import Skull from "./svg/Skull.vue"
import Logo from "./svg/Logo.vue"
import { useAuthStore } from '@/stores/auth'
import { useSearchStore } from '@/stores/search'

const authStore = useAuthStore()
const searchStore = useSearchStore()
const router = useRouter()

const showSearch = ref(false)
const searchInput = ref(null)
const highlightedIndex = ref(-1)

const lastScroll = ref(0)
const showHeader = ref(true)

const toggleSearch = async () => {
  showSearch.value = !showSearch.value

  if (showSearch.value) {
    await nextTick()
    searchInput.value?.focus()
  } else {
    searchStore.query = ""
    searchStore.results = []
    highlightedIndex.value = -1
  }
}

const handleClickOutside = (e) => {
  const wrapper = document.querySelector('.search-wrapper')
  if (wrapper && !wrapper.contains(e.target)) {
    showSearch.value = false
    searchStore.query = ""
    searchStore.results = []
    highlightedIndex.value = -1
  }
}

const handleScroll = () => {
  const current = window.scrollY
  showHeader.value = !(current > lastScroll.value && current > 80)
  lastScroll.value = current
}

const openDetails = (item) => {
  if (!item) return
  router.push({ name: 'detailMovie', params: { id: item.id } })
  showSearch.value = false
  searchStore.query = ""
  highlightedIndex.value = -1
}

const handleKeydown = (event) => {
  if (!showSearch.value || searchStore.results.length === 0) return

  if (event.key === "ArrowDown") {
    event.preventDefault()
    highlightedIndex.value =
      (highlightedIndex.value + 1) % searchStore.results.length
  }

  if (event.key === "ArrowUp") {
    event.preventDefault()
    highlightedIndex.value =
      highlightedIndex.value <= 0
        ? searchStore.results.length - 1
        : highlightedIndex.value - 1
  }

  if (event.key === "Enter" && highlightedIndex.value >= 0) {
    openDetails(searchStore.results[highlightedIndex.value])
  }
}

let debounceTimer = null
watch(() => searchStore.query, () => {
  if (!showSearch.value) return

  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchStore.search()
  }, 300)
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('scroll', handleScroll)
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
          <li><RouterLink to="/">Início</RouterLink></li>
          <li><RouterLink to="/moviePage">Filmes</RouterLink></li>
          <li><RouterLink to="/highlight">Destaques</RouterLink></li>
          <li><RouterLink to="/my-list">Minha Lista</RouterLink></li>
        </ul>
      </nav>
    </div>

    <div class="header-right">
      <div class="search-wrapper">
        <div class="search-container">
          <span class="mdi mdi-magnify" @click.stop="toggleSearch"></span>

          <input
            ref="searchInput"
            v-model="searchStore.query"
            type="text"
            placeholder="Pesquisar filmes de terror..."
            class="search-input"
            :class="{ active: showSearch }"
          />

          <div
            v-if="showSearch && (searchStore.results.length || searchStore.loading || searchStore.error)"
            class="search-results"
          >
            <div v-if="searchStore.loading" class="loading">Buscando...</div>
            <div v-else-if="searchStore.error" class="loading">Erro: {{ searchStore.error }}</div>

            <div
              v-else-if="searchStore.results.length === 0 && searchStore.query.trim()"
              class="loading"
            >
              Nenhum resultado encontrado.
            </div>

            <div v-else>
              <div
                v-for="(result, index) in searchStore.results"
                :key="result.id"
                class="result-item"
                :class="{ selected: index === highlightedIndex }"
                @click="openDetails(result)"
              >
                <img
                  :src="result.poster_path
                    ? `https://image.tmdb.org/t/p/w92${result.poster_path}`
                    : 'https://via.placeholder.com/92x138?text=Sem+Imagem'"
                  :alt="result.title"
                />

                <div class="result-info">
                  <h4>{{ result.title }}</h4>
                  <p>
                    {{ result.vote_average ?? 'N/A' }} •
                    {{ result.release_date
                        ? new Date(result.release_date).getFullYear()
                        : 'Ano N/A' }}
                  </p>
                </div>
              </div>
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
  background-color: c.$color-black-blur;
  border: 1px solid c.$color-red-hover;
  border-top: none;
  border-radius: 0 0 12px 12px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10000;
  box-shadow: 0 0 8px c.$color-red-hover;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: 0.4s all;
  border-bottom: 1px solid c.$color-gray-bottom;
}

.result-item:hover,
.result-item.selected {
  background-color: c.$color-red-dark;
}

.result-item img {
  width: 50px;
  height: 75px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 12px;
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
  flex-wrap: wrap;
  align-items: center;
  padding: 20px 40px 0 40px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  transition: 0.4s all;
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
  flex-wrap: wrap;
  gap: 20px;
  margin-left: 40px;
  padding: 0;
}

nav ul li {
  cursor: pointer;
  transition: all 0.4s;
}

nav ul li:hover {
  transform: scale(1.05);
}

nav ul li a {
  font-size: 1.1rem;
  text-decoration: none;
  font-weight: normal;
  color: c.$color-white-text;
  transition: all 0.3s ease;
}

nav ul li:hover a {
  text-shadow: c.$color-red-hover 0 0 3px;
  color: c.$color-red-hover;
}

.header-right {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  position: relative;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.search-container .mdi-magnify {
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  left: 10px;
  z-index: 2;
  color: c.$color-white-text;
  transition: 0.4s all;
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
  background-color: c.$color-black-blur;
  color: c.$color-white-text;
  outline: none;
  width: 0;
  opacity: 0;
  transition: all 0.4s;
}

.search-input.active {
  width: 400px;
  opacity: 1;
  box-shadow: c.$color-red-hover 0 0 8px;
  color: c.$color-gray-text;
}

</style>
