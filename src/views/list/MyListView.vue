
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Logo from "@/components/svg/Logo.vue";

const authStore = useAuthStore();
const router = useRouter();

const TMDB = "817aab6edd675cf23cb2adfd4ddfcfab";

const listMyList = ref([]);
const listLiked = ref([]);
const listDisliked = ref([]);
const loading = ref(false);

const refMy = ref(null);
const refLiked = ref(null);
const refDisliked = ref(null);


const backgroundUrl = ref('')
const terrorMovies = [346364, 348, 694, 138843, 214]
const API_KEY = '817aab6edd675cf23cb2adfd4ddfcfab'
let shuffledMovies = []
let index = 0

const shuffleMovies = () => { shuffledMovies = [...terrorMovies].sort(() => Math.random() - 0.5); index = 0 }
const loadRandomBackground = async () => {
  if (index >= shuffledMovies.length) shuffleMovies()
  const movieId = shuffledMovies[index++]
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`)
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
    const res = await axios.get(`https://api.themoviedb.org/3/${type}/${id}?api_key=${TMDB}&language=pt-BR`);
    const data = res.data;
    return { ...data, type, title: type === "movie" ? data.title : data.name };
  } catch {
    return null;
  }
}

async function loadLists() {
  if (!authStore.currentUser) return;
  loading.value = true;
  const user = authStore.currentUser;

  const loadArr = async arr => arr.length ? (await Promise.all(arr.map(loadItem))).filter(Boolean) : [];
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
  router.push("/login");
}
</script>

<template>
    <section v-if="!authStore.logado" class="first-page" :style="{
    background: `linear-gradient(to bottom, rgba(0,0,0,0.5), #0c0c0c), url(${backgroundUrl})`,
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

      <div v-if="!loading && listMyList.length" class="section-block">
        <h2 class="section-title">Minha Lista</h2>
        <div class="carousel-wrapper">
          <button class="nav-btn left" @click="scroll(refMy, -1)">‹</button>
          <div class="carousel" ref="refMy">
            <article v-for="m in listMyList" :key="m.id + m.type" class="movie-item" @click="goTo(m)">
              <img :src="poster(m.poster_path)" :alt="m.title" />
              <p class="movie-title">{{ m.title }}</p>
            </article>
          </div>
          <button class="nav-btn right" @click="scroll(refMy, 1)">›</button>
        </div>
      </div>

      <div v-if="!loading && listLiked.length" class="section-block">
        <h2 class="section-title">Curtidos</h2>
        <div class="carousel-wrapper">
          <button class="nav-btn left" @click="scroll(refLiked, -1)">‹</button>
          <div class="carousel" ref="refLiked">
            <article v-for="m in listLiked" :key="m.id + m.type" class="movie-item" @click="goTo(m)">
              <img :src="poster(m.poster_path)" :alt="m.title" />
              <p class="movie-title">{{ m.title }}</p>
            </article>
          </div>
          <button class="nav-btn right" @click="scroll(refLiked, 1)">›</button>
        </div>
      </div>

      <div v-if="!loading && listDisliked.length" class="section-block">
        <h2 class="section-title">Descurtidos</h2>
        <div class="carousel-wrapper">
          <button class="nav-btn left" @click="scroll(refDisliked, -1)">‹</button>
          <div class="carousel" ref="refDisliked">
            <article v-for="m in listDisliked" :key="m.id + m.type" class="movie-item" @click="goTo(m)">
              <img :src="poster(m.poster_path)" :alt="m.title" />
              <p class="movie-title">{{ m.title }}</p>
            </article>
          </div>
          <button class="nav-btn right" @click="scroll(refDisliked, 1)">›</button>
        </div>
      </div>

      <div v-if="!loading && !listMyList.length && !listLiked.length && !listDisliked.length" class="info">
        Nenhum item encontrado — adicione filmes ou séries às suas listas.
      </div>
    </section>
</template>

<style scoped lang="scss">
.first-page {
  width: 100%;
  padding: 10% 20px;
  background: #0d0d0d;
  color: #fff;
  color: #aaa;
  text-align: center;
  height: 100vh;
}

.login {
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  margin-left: 12%;
  padding: 20px;
  width: 420px;
  height: 550px;
  box-shadow: 0 8px 32px #000;
  color: #fff;
  margin-top: 20px;
  text-align: center;
  align-items: center;
}

.logo {
  margin: 30px auto;
}

h1 {
  text-align: center;
  margin-bottom: 0px;
  font-weight: bold;
  font-size: 2.5rem;
    color: c.$color-red-detail;
}

p {
  text-align: center;
  font-size: 0.9rem;
  margin-bottom: 20px;
  margin-top: 10px;
  color: c.$color-gray-text;
}

.login-btn {
  background: c.$color-red-hover;
  padding: 12px 30px;
  font-size: 1.1rem;
  border: none;
  color: c.$color-white-text;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.4s all;
  margin-right: 10px;
}

.create-btn {
  background: transparent;
  color: c.$color-red-hover;
  border: 2px solid c.$color-red-hover;
  padding: 12px 30px;
  font-size: 1.1rem;
  border-radius: 12px;
  font-weight: bold;
}



.section-block {
  margin-bottom: 36px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 14px;
  color: #fff;
}

.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.carousel {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 12px 0;
  width: 100%;
  scroll-behavior: smooth;
  position: relative;
}

/* Fade nas extremidades para efeito “cinema” */
.carousel-wrapper::before,
.carousel-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50px;
  pointer-events: none;
  z-index: 5;
}

.carousel-wrapper::before {
  left: 0;
  background: linear-gradient(to right, #0d0d0d 0%, transparent 100%);
}

.carousel-wrapper::after {
  right: 0;
  background: linear-gradient(to left, #0d0d0d 0%, transparent 100%);
}

/* Cards */
.movie-item {
  position: relative;
  min-width: 160px;
  max-width: 160px;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: 0.3s transform, 0.3s box-shadow;
}

.movie-item:hover {
  transform: translateY(-10px) scale(1.08);
  z-index: 10;
}

.movie-item img {
  width: 160px;
  height: 240px;
  object-fit: cover;
  display: block;
  transition: 0.3s all;
  border-radius: 12px;
}

/* Overlay com gradiente e título flutuante */
.movie-item .overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(transparent, rgba(0,0,0,0.85));
  display: flex;
  align-items: flex-end;
  padding: 8px;
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  box-sizing: border-box;
  transition: 0.3s all;
}

/* Botão de play flutuante */
.movie-item .play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  background: rgba(255,0,0,0.85);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #fff;
  cursor: pointer;
  transition: 0.3s all;
}

.movie-item:hover .play-btn {
  transform: translate(-50%, -50%) scale(1);
}

.nav-btn {
  background: rgba(0,0,0,0.7);
  color: #fff;
  border: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: 10px;
  cursor: pointer;
  border-radius: 999px;
  font-size: 24px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s all;
  z-index: 20;
}

.nav-btn:hover {
  background: rgba(255,0,0,0.85);
  transform: translateY(-50%) scale(1.1);
}

.nav-btn.left {
  left: -12px;
}

.nav-btn.right {
  right: -12px;
}
</style>


