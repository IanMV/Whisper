<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Logo from "@/components/svg/Logo.vue";

const authStore = useAuthStore();
const router = useRouter();

const listMyList = ref([]);
const listLiked = ref([]);
const listDisliked = ref([]);
const loading = ref(false);

const refMy = ref(null);
const refLiked = ref(null);
const refDisliked = ref(null);


const backgroundUrl = ref('')
const terrorMovies = [346364, 348, 694, 138843, 214]
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
let shuffledMovies = []
let index = 0

const shuffleMovies = () => { shuffledMovies = [...terrorMovies].sort(() => Math.random() - 0.5); index = 0 }
const loadRandomBackground = async () => {
  if (index >= shuffledMovies.length) shuffleMovies()
  const movieId = shuffledMovies[index++]
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=pt-BR`, {

      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },

    })
    const data = await res.json()
    if (data.backdrop_path) backgroundUrl.value = `https://image.tmdb.org/t/p/original${data.backdrop_path}`
  } catch (e) { console.error('Erro ao carregar imagem:', e) }
}

onMounted(() => {
  shuffleMovies()
  loadRandomBackground()
  setInterval(loadRandomBackground, 8000)
})

function poster(path, size = "w342") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "/no-poster.png";
}

async function loadItem(item) {
  if (!item) return null;
  const id = item.id;
  const type = item.type || "movie";
  try {
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?language=pt-BR`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
   
    const data = await res.json(); console.log(data)
    return { ...data, type, title: type === "movie" ? data.title : data.name };
  } catch {
    return null;
  }
}

async function loadLists() {
  if (!authStore.currentUser) return;

  loading.value = true;

  const user = authStore.currentUser;

  const loadArr = async (arr) =>
    arr.length
      ? (await Promise.all(arr.map(loadItem))).filter(Boolean)
      : [];

  listMyList.value = await loadArr(user.myList || []);
  listLiked.value = await loadArr(user.liked || []);
  listDisliked.value = await loadArr(user.disliked || []);

  loading.value = false;
}

onMounted(loadLists);

function goTo(item) {
  if (!item || !item.id) return;
  router.push(`/${item.type}/${item.id}`);
}

function scroll(refObj, dir = 1, step = 360) {
  if (!refObj?.value) return;
  refObj.value.scrollBy({ left: step * dir, behavior: "smooth" });
}

function goAuth(view) {
  authStore.authView = view;
  router.push("/auth");
}

</script>

<template>
  <section v-if="!authStore.logado" class="first-page" :style="{
    background: ` url(${backgroundUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: 'darken'
  }">
    <div class="login">
      <Logo class="logo" />
      <h1>Minha Lista</h1>
      <p>Você precisa estar logado para ver suas listas.</p>
      <button @click="goAuth('login')" class="login-btn">Login</button>
      <button @click="goAuth('register')" class="create-btn">Criar Conta</button>
    </div>
  </section>

  <section v-else>
    <div v-if="loading" class="info">Carregando listas...</div>

    <div class="lists">
      <div v-if="!loading && listMyList.length" class="section-block">
        <h2 class="section-title">Minha Lista</h2>
        <div class="carousel-wrapper">
          <button class="nav-btn left" @click="scroll(refMy, -1)"><span class="mdi mdi-chevron-left"></span></button>
          <div class="carousel" ref="refMy">
            <article v-for="m in listMyList" :key="m.id + m.type" class="movie-item" @click="goTo(m)">
              <img :src="poster(m.poster_path)" :alt="m.title" />
            </article>
          </div>
          <button class="nav-btn right" @click="scroll(refMy, 1)"><span class="mdi mdi-chevron-right"></span></button>
        </div>

      <div v-if="!loading && listLiked.length" class="section-block">
        <h2 class="section-title">Curtidos</h2>
        <div class="carousel-wrapper">
          <button class="nav-btn left" @click="scroll(refLiked, -1)"><span class="mdi mdi-chevron-left"></span></button>
          <div class="carousel" ref="refLiked">
            <article v-for="m in listLiked" :key="m.id + m.type" class="movie-item" @click="goTo(m)">
              <img :src="poster(m.poster_path)" :alt="m.title" />
            </article>
          </div>
          <button class="nav-btn right" @click="scroll(refLiked, 1)"><span
              class="mdi mdi-chevron-right"></span></button>
        </div>
      </div>

      <div v-if="!loading && listDisliked.length" class="section-block">
        <h2 class="section-title">Descurtidos</h2>
        <div class="carousel-wrapper">
          <button class="nav-btn left" @click="scroll(refDisliked, -1)"><span
              class="mdi mdi-chevron-left"></span></button>
          <div class="carousel" ref="refDisliked">
            <article v-for="m in listDisliked" :key="m.id + m.type" class="movie-item" @click="goTo(m)">
              <img :src="poster(m.poster_path)" :alt="m.title" />
            </article>
          </div>
          <button class="nav-btn right" @click="scroll(refDisliked, 1)"><span
              class="mdi mdi-chevron-right"></span></button>
        </div>
      </div>
    </div>

    <div v-if="!loading && !listMyList.length && !listLiked.length && !listDisliked.length" class="info" :style="{
      background: ` url(${backgroundUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundBlendMode: 'darken'
    }">
      <div class="add">
        <h1>Nenhum item encontrado</h1>
        <p> adicione filmes ou séries às suas listas.</p>
        <button @click="router.push('/moviePage')" class="movies-btn">Ver Filmes</button>
        <button @click="router.push('/highlight')" class="highlight-btn">Ver detaques</button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.first-page,
.info {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: c.$color-white-text;
  text-align: center;
}

.first-page::after,
.info::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), c.$color-black-bottom);
}

.login,
.add {
  position: relative;
  z-index: 10;
  background: c.$color-black-blur;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 40px 45px;
  width: 500px;
  height: auto;
}

.logo {
  margin: 0 auto 30px auto;
}

h1 {
  text-align: center;
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 2.5rem;
  color: c.$color-red-hover;
}

p {
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 28px;
  color: c.$color-gray-text;
}

.login-btn,
.movies-btn {
  background: c.$color-red-hover;
  padding: 14px 20px;
  font-size: 1.2rem;
  border: 2px solid c.$color-red-hover;
  color: c.$color-white-text;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.4s ease;
  margin-right: 10px;
}

.login-btn:hover,
.movies-btn:hover {
  transform: scale(1.05);
  background: c.$color-red-hover;
  color: c.$color-white-text;
  box-shadow: c.$color-red-hover 0px 0px 8px;
}

.create-btn,
.highlight-btn {
  background: transparent;
  color: c.$color-red-hover;
  border: 2px solid c.$color-red-hover;
  padding: 14px 32px;
  font-size: 1.2rem;
  border-radius: 12px;
  font-weight: bold;
  transition: 0.4s ease;
}

.create-btn:hover,
.highlight-btn:hover {
  transform: scale(1.05);
  background: c.$color-red-hover;
  color: c.$color-white-text;
  box-shadow: c.$color-red-hover 0px 0px 8px;
}

.lists {
  margin-top: 150px;
}

.section-title {
  font-size: 2rem;
  margin: 80px 50px 20px 50px;
  color: c.$color-white-text;
  border-bottom: 2px solid c.$color-white-text;
}

.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.carousel {
  display: flex;
  overflow: hidden;
  gap: 12px;
  padding: 10px 0px;
  margin-left: 10%;
  width: 80%;
}

.movie-item {
  min-width: 150px;
  cursor: pointer;
  text-align: center;
  transition: 0.4s all;
}

.movie-item:hover {
  transform: scale(1.05);
}

.movie-item img {
  width: 150px;
  height: 220px;
  object-fit: cover;
  border-radius: 12px;
}

.nav-btn {
  position: absolute;
  top: 40%;
  background: transparent;
  border: none;
  font-size: 3rem;
  padding: 10px 15px;
  cursor: pointer;
  color: c.$color-white-text;
  z-index: 2;
  border-radius: 12px;
  transition: 0.4s all;
}

.nav-btn:hover {
  color: c.$color-red-hover;
}

.nav-btn.left {
  left: 50px;
}

.nav-btn.right {
  right: 50px;
}
</style>
