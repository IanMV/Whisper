<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import { toggleList } from "@/stores/list";

const API = "https://api.themoviedb.org/3";
const KEY = "817aab6edd675cf23cb2adfd4ddfcfab";

const auth = useAuthStore();

const heroSlides = ref([]);
const currentSlide = ref(0);

const carousels = ref([]);
const carouselRefs = ref([]);

const heroTerrorMoviesIds = [1305825, 1561473, 1585405, 1583714, 706862];

const THEMES = [
  { title: "Terror Menos Popular:", params: "with_genres=27&sort_by=vote_average.asc" },
  { title: "Terror dos anos 70:", params: "with_genres=27&primary_release_date.gte=1970-01-01&primary_release_date.lte=1979-12-31&sort_by=vote_average.asc" },
  { title: "Terror dos anos 80:", params: "with_genres=27&primary_release_date.gte=1980-01-01&primary_release_date.lte=1989-12-31&sort_by=vote_average.asc" },
  { title: "Terror dos anos 90:", params: "with_genres=27&primary_release_date.gte=1990-01-01&primary_release_date.lte=1999-12-31&sort_by=vote_average.asc" },
  { title: "Terror dos anos 2000:", params: "with_genres=27&primary_release_date.gte=2000-01-01&primary_release_date.lte=2009-12-31&sort_by=vote_average.asc" },
  { title: "Terror dos anos 2010:", params: "with_genres=27&primary_release_date.gte=2010-01-01&primary_release_date.lte=2019-12-31&sort_by=vote_average.asc" },
];

const KEYWORDS = [
  { title: "Sobrenatural:", keyword: "supernatural" },
  { title: "Zumbis:", keyword: "zombie" },
  { title: "Possessão:", keyword: "possession" },
  { title: "Slasher:", keyword: "slasher" },
  { title: "Exorcismo:", keyword: "exorcism" },
  { title: "Vampiro:", keyword: "vampire" },
  { title: "Lobisomem:", keyword: "werewolf" },
  { title: "Fantasma:", keyword: "ghost" },
  { title: "Criança Assombrada:", keyword: "haunted child" },
  { title: "Maldição:", keyword: "curse" },
  { title: "Múmia:", keyword: "mummy" },
  { title: "Demônio:", keyword: "demon" },
  { title: "Clown Assassino:", keyword: "killer clown" },
  { title: "Psicopata:", keyword: "psychopath" },
  { title: "Casa Assombrada:", keyword: "haunted house" },
  { title: "Ritual:", keyword: "ritual" },
  { title: "Culto:", keyword: "cult" },
];

const getPoster = (path) => path ? `https://image.tmdb.org/t/p/w500${path}` : null;
const openMovie = (id) => router.push(`/movie/${id}`);
const addToList = (id) => { if (!auth.token) return router.push("/auth"); toggleList(id); };

const fetchMovie = async (id) => {
  const res = await axios.get(`${API}/movie/${id}?api_key=${KEY}&language=pt-BR`);
  return res.data;
};

const fetchMoviesByTheme = async (params) => {
  const page = Math.floor(Math.random() * 5) + 1;
  const res = await axios.get(`${API}/discover/movie?api_key=${KEY}&language=pt-BR&${params}&page=${page}`);
  return res.data.results.filter(movie => movie.poster_path).slice(0, 20);
};

const fetchKeywordId = async (keyword) => {
  const res = await axios.get(`${API}/search/keyword?api_key=${KEY}&query=${keyword}`);
  if (res.data.results.length > 0) return res.data.results[0].id;
  return null;
};

const loadKeywordCarousels = async () => {
  const carouselsWithKeywords = [];
  for (const k of KEYWORDS) {
    const id = await fetchKeywordId(k.keyword);
    if (!id) continue;
    const page = Math.floor(Math.random() * 5) + 1;
    const res = await axios.get(`${API}/discover/movie?api_key=${KEY}&language=pt-BR&with_genres=27&with_keywords=${id}&sort_by=vote_average.asc&page=${page}`);
    const moviesWithPoster = res.data.results.filter(m => m.poster_path).slice(0, 20);
    if (moviesWithPoster.length > 0)
      carouselsWithKeywords.push({ title: k.title, movies: moviesWithPoster });
  }
  return carouselsWithKeywords;
};

const currentMovie = computed(() => heroSlides.value[currentSlide.value] || {});
const bgHero = computed(() => ({
  backgroundImage: currentMovie.value.backdrop_path
    ? `linear-gradient(to bottom, rgba(0,0,0,0.5), #0c0c0c), url(https://image.tmdb.org/t/p/original${currentMovie.value.backdrop_path})`
    : "linear-gradient(to bottom, rgba(0,0,0,0.5), #0c0c0c)",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

function nextSlide() { currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length; }

function scrollLeft(index) {
  const el = carouselRefs.value[index];
  if (el) el.scrollBy({ left: -400, behavior: "smooth" });
}
function scrollRight(index) {
  const el = carouselRefs.value[index];
  if (el) el.scrollBy({ left: 400, behavior: "smooth" });
}

onMounted(async () => {
  try {

    const heroRequests = heroTerrorMoviesIds.map(id => fetchMovie(id));
    const heroMovies = await Promise.all(heroRequests);
    heroSlides.value = heroMovies.filter(m => m.poster_path).sort((a,b) => a.vote_average - b.vote_average);

    const carouselRequests = THEMES.map(t => fetchMoviesByTheme(t.params));
    const themeMovies = await Promise.all(carouselRequests);
    carousels.value = THEMES.map((t,i) => ({ title: t.title, movies: themeMovies[i] }));

    const keywordCarousels = await loadKeywordCarousels();
    carousels.value.push(...keywordCarousels);

    setInterval(nextSlide, 6000);

  } catch (e) {
    console.error(e);
  } 
});
</script>

<template>
  <div class="page">
    <section v-if="heroSlides.length" class="hero" :style="bgHero">
      <div class="hero-content">
        <h1>{{ currentMovie.title }} <small class="year">({{ new Date(currentMovie.release_date).getFullYear()
            }})</small></h1>
        <p>{{ currentMovie.overview }}</p>
        <div class="hero-buttons">
          <button @click="openMovie(currentMovie.id)" class="hero-btn">Ver detalhes</button>
          <button @click="addToList(currentMovie.id)" class="hero-btn add-btn">Minha Lista</button>
        </div>
      </div>
    </section>

    <div v-for="(carousel, index) in carousels" :key="index" class="carousel">
      <h2 class="carousel-title">{{ carousel.title }}</h2>
      <div class="carousel-container">
        <button class="carousel-arrow left" @click="scrollLeft(index)"><span class="mdi mdi-chevron-left"></span></button>
        <div class="carousel-list" ref="carouselRefs" :data-index="index">
          <div v-for="movie in carousel.movies" :key="movie.id" class="movie-card" @click="openMovie(movie.id)">
            <img :src="getPoster(movie.poster_path)" :alt="movie.title" />
          </div>
        </div>
        <button class="carousel-arrow right" @click="scrollRight(index)"><span class="mdi mdi-chevron-right"></span></button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page {
  width: 100%;
  color: c.$color-white-text;
  min-height: 100vh;
}

.hero {
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 80px 90px;
  position: relative;
  transition: background-image 1s ease-in-out;
}

.hero-content {
  max-width: 1000px;
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 10px;
  font-weight: bold;
}

.hero .year {
  font-weight: normal;
  color: c.$color-red-hover;
  font-size: 2rem;
}

.hero p {
  font-size: 1.2rem;
  color: c.$color-gray-text;
  margin-bottom: 20px;
}

.hero-buttons {
  display: flex;
  gap: 12px;
}

.hero-btn {
  background: c.$color-red-hover;
  padding: 12px 22px;
  font-size: 1rem;
  border: 2px solid c.$color-red-hover;
  color: c.$color-white-text;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.4s all;
}

.add-btn {
  background: transparent;
  color: c.$color-red-hover;
  border: 2px solid c.$color-red-hover;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: bold;
  transition: 0.4s all;
}

.add-btn:hover,
.hero-btn:hover {
  transform: scale(1.05);
  background: c.$color-red-hover;
  color: c.$color-white-text;
  box-shadow: c.$color-red-hover 0px 0px 8px;
}

.carousel {
  margin-top: 30px;
  padding: 0 20px;
  position: relative;
  overflow: hidden;
}

.carousel-title {
  font-size: 2rem;
  margin: 80px 50px 20px 50px;
  color: c.$color-white-text;
  border-bottom: 2px solid c.$color-white-text;
}

.carousel-container {
  display: flex;
  overflow: hidden;
  gap: 12px;
  padding: 10px 0px;
  margin-left: 10%;
  width: 80%;
}

.carousel-list {
  display: flex;
  overflow: hidden;
  gap: 12px;
}

.carousel-arrow {
  position: absolute;
  top: 60%;
  background: transparent;
  border: none;
  font-size: 2rem;
  padding: 10px 15px;
  cursor: pointer;
  color: c.$color-white-text;
  z-index: 2;
  transition: 0.4s all;
}

.carousel-arrow:hover {
  color: c.$color-red-hover;
}

.carousel-arrow.left {
  left: 50px;
}

.carousel-arrow.right {
  right: 50px;
}

.movie-card {
  min-width: 150px;
  cursor: pointer;
  text-align: center;
  transition: 0.4s all;
}

.movie-card img {
  width: 150px;
  height: 220px;
  object-fit: cover;
  border-radius: 12px;
}

.movie-card:hover {
    transform: scale(1.05);
}
</style>