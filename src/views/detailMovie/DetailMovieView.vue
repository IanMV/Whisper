<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { toggleList, like, dislike } from "@/stores/list";
import router from "@/router";

const props = defineProps({ id: { type: [String, Number], required: true } });
const TMDB = "817aab6edd675cf23cb2adfd4ddfcfab";

const authStore = useAuthStore();
const showTrailer = ref(false);
const movie = ref(null);
const credits = ref([]);
const trailerKey = ref(null);
const images = ref([]);
const mainImage = ref(null);
const imageModalIndex = ref(null);
const similarMovies = ref([]);
const carousel = ref(null);
const thumbCarousel = ref(null);
const similarTrack = ref(null);
const selectedIndex = ref(0);

const year = computed(() => movie.value?.release_date?.split("-")[0] || "--");

const myListCheck = computed(() => authStore.currentUser?.myList?.some(i=>i.id===movie.value?.id && i.type==='movie'));
const likedCheck = computed(() => authStore.currentUser?.liked?.some(i=>i.id===movie.value?.id && i.type==='movie'));
const dislikedCheck = computed(() => authStore.currentUser?.disliked?.some(i=>i.id===movie.value?.id && i.type==='movie'));

const posterOrPlaceholder = (path, size='w300') => path ? `https://image.tmdb.org/t/p/${size}${path}` : "https://via.placeholder.com/300x450?text=Sem+Foto";

const loadMovie = async ()=>{
  try{
    const [details, castData, videosData, imagesData] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/movie/${props.id}`, { params:{ api_key: TMDB, language:'pt-BR' }}),
      axios.get(`https://api.themoviedb.org/3/movie/${props.id}/credits`, { params:{ api_key: TMDB, language:'pt-BR' }}),
      axios.get(`https://api.themoviedb.org/3/movie/${props.id}/videos`, { params:{ api_key: TMDB, language:'pt-BR' }}),
      axios.get(`https://api.themoviedb.org/3/movie/${props.id}/images`, { params:{ api_key: TMDB }}),
    ]);
    movie.value = details.data;
    credits.value = (castData.data.cast||[]).slice(0,14).filter(a=>a.profile_path);
    trailerKey.value = (videosData.data.results||[]).find(v=>v.type==='Trailer' && v.site==='YouTube')?.key || null;
    const allImages = [...(imagesData.data.backdrops||[]), ...(imagesData.data.posters||[])].filter(i=>i.file_path);
    images.value = allImages.slice(0,10);
    mainImage.value = images.value[0];
  }catch(e){ console.error(e); }
};

const filteredSimilar = computed(() => 
  similarMovies.value.filter(m => m.genre_ids?.includes(27))
);


const fetchSimilar = async ()=>{
  try{
    const res = await axios.get(`https://api.themoviedb.org/3/movie/${props.id}/similar?api_key=${TMDB}&language=pt-BR&page=1`);
    similarMovies.value = res.data.results||[];
  }catch(e){ console.error(e); }
};

const openImage = i => imageModalIndex.value = i;
const closeImage = () => imageModalIndex.value = null;
const prevImage = () => { if(imageModalIndex.value>0) imageModalIndex.value--; };
const nextImage = () => { if(imageModalIndex.value<credits.value.length-1) imageModalIndex.value++; };
const selectImage = i => { const clicked=images.value[i]; const current=mainImage.value; mainImage.value=clicked; images.value.splice(i,1,current); selectedIndex.value=i; };

const scrollLeft = ()=>carousel.value.scrollBy({ left:-250, behavior:'smooth' });
const scrollRight = ()=>carousel.value.scrollBy({ left:250, behavior:'smooth' });
const scrollThumbsLeft = ()=>thumbCarousel.value.scrollBy({ left:-200, behavior:'smooth' });
const scrollThumbsRight = ()=>thumbCarousel.value.scrollBy({ left:200, behavior:'smooth' });
const scrollSimilarLeft = ()=>similarTrack.value.scrollBy({ left:-300, behavior:'smooth' });
const scrollSimilarRight = ()=>similarTrack.value.scrollBy({ left:300, behavior:'smooth' });

onMounted(()=>{ loadMovie(); fetchSimilar(); });
watch(()=>props.id, ()=>{ loadMovie(); fetchSimilar(); });

</script>

<template>
  <div class="movie-page" v-if="movie">

    <section class="hero-wrap">
      <div class="hero"
        :style="{ background: `linear-gradient(to bottom, rgba(0,0,0,0.5), #0c0c0c), url(${posterOrPlaceholder(movie.backdrop_path, 'original')})`, backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: 'darken' }">
        
        <div class="hero-left">
          <img class="poster" :src="posterOrPlaceholder(movie.poster_path, 'w500')" />
        </div>

        <div class="hero-right">
          <h1 class="title">{{ movie.title }} <span class="year">({{ year }})</span></h1>

          <div class="meta">
            <div class="rating">{{ movie.vote_average.toFixed(1) }} <span class="mdi mdi-star"></span></div>
            <div class="duration">{{ Math.floor(movie.runtime / 60) }}h {{ movie.runtime % 60 }}m <span class="mdi mdi-clock-outline"></span></div>
            <div class="language">{{ movie.original_language.toUpperCase() }} <span class="mdi mdi-translate"></span></div>
          </div>

          <div class="genres">{{ movie.genres.map(g => g.name).join(' • ') }}</div>
          <p class="overview">{{ movie.overview }}</p>

          <div class="hero-actions">
            <button v-if="trailerKey" class="btn btn-trailer" @click="showTrailer = true">
              <span class="mdi mdi-play"></span>
            </button>

            <button class="btn btn-list" :class="{ active: authStore.logado && myListCheck }"
              @click="authStore.logado ? toggleList(movie.id, 'movie') : router.push('/auth')">
              <span class="mdi mdi-plus"></span>
            </button>

            <button class="btn btn-like" :class="{ active: authStore.logado && likedCheck }"
              @click="authStore.logado ? like(movie.id, 'movie') : router.push('/auth')">
              <span class="mdi mdi-thumb-up"></span>
            </button>

            <button class="btn btn-dislike" :class="{ active: authStore.logado && dislikedCheck }"
              @click="authStore.logado ? dislike(movie.id, 'movie') : router.push('/auth')">
              <span class="mdi mdi-thumb-down"></span>
            </button>
          </div>
        </div>

      </div>
    </section>

    <div v-if="showTrailer" class="trailer-modal" @click.self="showTrailer = false">
      <div class="trailer-inner">
        <button class="trailer-close" @click="showTrailer = false">✖</button>
        <iframe v-if="trailerKey" :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1`" frameborder="0"
          allow="autoplay; encrypted-media" allowfullscreen></iframe>
      </div>
    </div>

    <section class="section">
      <h2>Elenco:</h2>
      <div class="carousel-wrapper">
        <button class="carousel-btn prev" @click="scrollLeft"><span class="mdi mdi-chevron-left"></span></button>
        <div class="carousel" ref="carousel">
          <div v-for="(actor, index) in credits" :key="actor.id" class="actor-card" @click="openImage(index)">
            <div class="actor-thumb">
              <img :src="posterOrPlaceholder(actor.profile_path, 'w300')" />
            </div>
            <div class="actor-info">
              <h3>{{ actor.name }}</h3>
              <p>{{ actor.character }}</p>
            </div>
          </div>
        </div>
        <button class="carousel-btn next" @click="scrollRight"><span class="mdi mdi-chevron-right"></span></button>
      </div>
    </section>

    <div v-if="imageModalIndex !== null" class="image-modal" @click.self="closeImage">
      <div class="image-modal-content">
        <button v-if="imageModalIndex > 0" class="image-modal-nav prev" @click="prevImage"><span class="mdi mdi-chevron-left"></span></button>
        <img :src="posterOrPlaceholder(credits[imageModalIndex].profile_path, 'original')" />
        <button v-if="imageModalIndex < credits.length - 1" class="image-modal-nav next" @click="nextImage"><span class="mdi mdi-chevron-right"></span></button>
      </div>
    </div>

    <section class="section movie-details">
      <h2>Detalhes do Filme:</h2>
      <div class="details-card">
        <div class="detail-item"><span class="mdi mdi-movie-open-outline icon"></span>
          <div class="d-text"><strong>Título Original</strong><p>{{ movie.original_title || '--' }}</p></div>
        </div>
        <div class="detail-item"><span class="mdi mdi-calendar icon"></span>
          <div class="d-text"><strong>Lançamento</strong><p>{{ movie.release_date || '--' }}</p></div>
        </div>
        <div class="detail-item"><span class="mdi mdi-translate icon"></span>
          <div class="d-text"><strong>Idioma Original</strong><p>{{ movie.original_language?.toUpperCase() || '--' }}</p></div>
        </div>
        <div class="detail-item"><span class="mdi mdi-timer-outline icon"></span>
          <div class="d-text"><strong>Duração</strong><p>{{ movie.runtime ? Math.floor(movie.runtime/60)+'h '+movie.runtime%60+'m':'--' }}</p></div>
        </div>
        <div class="detail-item"><span class="mdi mdi-ticket-confirmation-outline icon"></span>
          <div class="d-text"><strong>Status</strong><p>{{ movie.status || '--' }}</p></div>
        </div>
        <div class="detail-item full"><span class="mdi mdi-shape-outline icon"></span>
          <div class="d-text"><strong>Gêneros</strong><p>{{ movie.genres.map(g => g.name).join(', ') || '--' }}</p></div>
        </div>
        <div class="detail-item"><span class="mdi mdi-star-outline icon"></span>
          <div class="d-text"><strong>Nota Média</strong><p>{{ movie.vote_average?.toFixed(1) || '--' }} / 10</p></div>
        </div>
        <div class="detail-item"><span class="mdi mdi-fire icon"></span>
          <div class="d-text"><strong>Popularidade</strong><p>{{ movie.popularity?.toFixed(1) || '--' }}</p></div>
        </div>
        <div class="detail-item"><span class="mdi mdi-currency-usd icon"></span>
          <div class="d-text"><strong>Orçamento</strong><p>{{ movie.budget ? new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(movie.budget): '--' }}</p></div>
        </div>
        <div class="detail-item"><span class="mdi mdi-cash-multiple icon"></span>
          <div class="d-text"><strong>Receita</strong><p>{{ movie.revenue ? new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(movie.revenue): '--' }}</p></div>
        </div>
        <div class="detail-item full" v-if="movie.homepage"><span class="mdi mdi-web icon"></span>
          <div class="d-text"><strong>Website Oficial</strong><p><a :href="movie.homepage" target="_blank">{{ movie.homepage }}</a></p></div>
        </div>
      </div>
    </section>

    <section class="gallery" v-if="images.length">
      <h2 class="gallery-title">Galeria de Imagens:</h2>
      <div class="gallery-main">
        <img :src="posterOrPlaceholder(mainImage.file_path, 'w1280')" class="gallery-main-img" />
      </div>
      <div class="gallery-strip">
        <button class="gallery-arrow left" @click="scrollThumbsLeft"><span class="mdi mdi-chevron-left"></span></button>
        <div class="thumbs" ref="thumbCarousel">
          <div v-for="(img,index) in images" :key="index" class="thumb" :class="{ active: index===selectedIndex }" @click="selectImage(index)">
            <img :src="posterOrPlaceholder(img.file_path, 'w300')" />
          </div>
        </div>
        <button class="gallery-arrow right" @click="scrollThumbsRight"><span class="mdi mdi-chevron-right"></span></button>
      </div>
    </section>

    <section class="similar-movies-section" v-if="filteredSimilar.length">
      <h2>Filmes Parecidos:</h2>
      <div class="similar-carousel">
        <button class="carousel-btn prev" @click="scrollSimilarLeft"><span class="mdi mdi-chevron-left"></span></button>
        <div class="similar-track" ref="similarTrack">
          <div v-for="movie in filteredSimilar" :key="movie.id" class="similar-item" @click="$router.push(`/movie/${movie.id}`)">
            <img :src="posterOrPlaceholder(movie.poster_path, 'w342')" :alt="movie.title" />
          </div>
        </div>
        <button class="carousel-btn next" @click="scrollSimilarRight"><span class="mdi mdi-chevron-right"></span></button>
      </div>
    </section>

  </div>
</template>

<style scoped lang="scss">
.movie-page {
  color: c.$color-white-text;
}

.hero {
  padding: 50px 6vw;
  display: flex;
  gap: 30px;
  min-height: 100vh;
  align-items: end;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.poster {
  width: 230px;
  border-radius: 14px;
}

.hero-right {
  max-width: 50%;
}

.title {
  font-size: 2.5rem;
  font-weight: 500;
}

.year {
  font-weight: normal;
  color: c.$color-red-hover;
  font-size: 1.3rem;
}

.meta {
  display: flex;
  gap: 12px;
  margin: 12px 0;
}

.meta div {
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid c.$color-red-hover;
  color: c.$color-red-hover;
}

.meta .mdi {
  margin-left: 4px;
  font-size: 1rem;
  color: c.$color-red-hover;
}

.overview {
  margin-bottom: 20px;
  line-height: 1.5;
  font-size: 1rem;
  color: c.$color-white-text;
}

.genres {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  color: c.$color-gray-text;
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn {
  padding: 7px 15px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.4s ease;
}

.btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 10px c.$color-red-hover;
  background-color: c.$color-red-hover;
  color: c.$color-white-text;
}

.btn-trailer {
  background: c.$color-red-hover;
  color: c.$color-white-text;
}

.btn-list,
.btn-like,
.btn-dislike {
  background: transparent;
  border: 1px solid c.$color-red-hover;
  color: c.$color-red-hover;
  transition: all 0.6s ease;
}

.btn-list.active,
.btn-like.active,
.btn-dislike.active {
  background: c.$color-red-hover;
  border: none;
  color: c.$color-white-text;
}

.trailer-modal {
  position: fixed;
  inset: 0;
  background: c.$color-black-blur;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.trailer-inner {
  width: 90%;
  max-width: 900px;
  position: relative;
}

.trailer-inner iframe {
  width: 100%;
  height: 500px;
  border-radius: 12px;
}

.trailer-close {
  position: absolute;
  top: 0px;
  right: 0;
  background: c.$color-black-bottom;
  color: c.$color-white-text;
  border: 1px solid c.$color-white-text;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.section h2 {
  font-size: 2rem;
  margin: 80px 50px 20px 50px;
  color: c.$color-white-text;
  border-bottom: 2px solid c.$color-white-text;
}

.carousel-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.carousel {
  display: flex;
  overflow-x: hidden;
  overflow-y: hidden;
  gap: 12px;
  padding: 10px 0px;
  width: 80%;
}

.actor-card {
  width: 150px;
  flex-shrink: 0;
  cursor: pointer;
  text-align: center;
  background: c.$color-black-bottom;
  border-radius: 12px;
  padding: 0 0 10px 0;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;

  &:hover {
    transform: translateY(-4px) scale(1.02);
    background: c.$color-red-dark;
    box-shadow: c.$color-red-hover 0px 0px 12px;
  }

  &:active {
    transform: scale(0.97);
    box-shadow: 0 4px 10px c.$color-red-hover;
  }
}

.actor-thumb img {
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
}

.actor-info h3 {
  font-size: 1.3rem;
  margin: 4px 0 0;
  color: c.$color-white-text;
  transition: 0.3s ease;
}

.actor-info p {
  font-size: 0.9rem;
  margin: 0;
  color: c.$color-gray-text;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: c.$color-white-text;
  font-size: 3rem;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
}

.carousel-btn.prev {
  left: 50px;
}

.carousel-btn.next {
  right: 50px;
}

.carousel-btn span {
  transition: color 0.3s ease;
}

.carousel-btn span:hover {
  color: c.$color-red-hover;
}

.image-modal {
  position: fixed;
  inset: 0;
  background: c.$color-black-blur;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.image-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.image-modal-content img {
  width: auto;
  height: 80vh;
  border-radius: 12px;
  object-fit: contain;
}

.image-modal-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  color: c.$color-white-text;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  z-index: 10;
}

.image-modal-nav span {
  font-size: 3rem;
  transition: color 0.3s ease;
}

.image-modal-nav span:hover {
  color: c.$color-red-hover;
}

.image-modal-nav.prev {
  left: -60px;
}

.image-modal-nav.next {
  right: -60px;
}

.gallery {
  margin-top: 80px;
  width: 100%;
}

.gallery-title {
  font-size: 2rem;
  margin: 80px 50px 40px 50px;
  color: c.$color-white-text;
  border-bottom: 2px solid c.$color-white-text;
}

.gallery-main {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
}

.gallery-main-img {
  width: auto;
  height: 400px;
  border-radius: 16px;
  object-fit: cover;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}


.gallery-strip {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 80%;
  margin: 0 auto;
}

.gallery-arrow {
  width: 50px;
  height: 90px;
  border: none;
  background: transparent;
  color: c.$color-white-text;
  font-size: 32px;
  border-radius: 14px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s;
}

.gallery-arrow:hover {
  color: c.$color-red-hover;
}

.thumbs {
  display: flex;
  overflow-x: auto;
  gap: 14px;
  padding: 10px 0;
  scroll-behavior: smooth;
  flex: 1;
}

.thumbs::-webkit-scrollbar {
  height: 7px;
}

.thumbs::-webkit-scrollbar-thumb {
  background: c.$color-red-hover;
  border-radius: 10px;
}

.thumb {
  min-width: 150px;
  height: 90px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.28s ease, outline 0.28s ease;
  position: relative;

  background: c.$color-red-dark;
  backdrop-filter: blur(6px);
  border: 1px solid c.$color-red-hover;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb:hover {
  transform: scale(1.08);
}

.thumb.active {
  outline: 3px solid c.$color-red-hover;
  transform: scale(1.1);
  box-shadow: 0 0 18px c.$color-red-hover;
}

.movie-details {
  margin: 80px 0;
}

.details-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin: 40px 8vw;
  border-radius: 14px;
  backdrop-filter: blur(8px);
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 15px;
  border: 1px solid c.$color-gray-bottom;
  border-left: 3px solid c.$color-red-hover;
  border-radius: 8px;
  transition: 0.3s ease;
}

.detail-item:hover {
  transform: translateX(8px);
  background: c.$color-red-dark;
  border: 1px solid c.$color-red-hover;
  border-left: 5px solid c.$color-red-hover;
  box-shadow: c.$color-red-hover 0px 0px 12px;
}

.detail-item.full {
  grid-column: span 2;
}

.icon {
  font-size: 2rem;
  color: c.$color-red-hover;
}

.d-text strong {
  font-size: 1.2rem;
  color: c.$color-white-text;
}

.d-text p {
  margin: 4px 0 0;
  font-size: 1.1rem;
  color: c.$color-gray-text;
}

.d-text a {
  color: c.$color-red-hover;
}


.movie-images {
  margin: 80px 0;
  color: c.$color-white-text;
}

.main-image {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}


.thumbnails-carousel-wrapper {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 5px;
  width: 90%;
  max-width: 850px;
}

.thumbnails-carousel {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  flex: 1;
  padding: 5px 0;
}

.thumbnails-carousel::-webkit-scrollbar {
  display: none;
}

.thumb {
  flex-shrink: 0;
  width: 120px;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.thumb:hover {
  transform: scale(1.1);
  box-shadow: c.$color-red-hover 0px 0px 8px;
}

.thumb img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.similar-movies-section {
  margin-top: 80px;
  margin-bottom: 100px;
}

.similar-movies-section h2 {
  font-size: 2rem;
  margin: 0 50px 20px 50px;
  color: c.$color-white-text;
  border-bottom: 2px solid c.$color-white-text;
}

.similar-carousel {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.similar-track {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-bottom: 10px;
  width: 80%;

}

.similar-track::-webkit-scrollbar {
  height: 0;
}

.similar-item {
  min-width: 150px;
  cursor: pointer;
  text-align: center;
  transition: 0.3s;
}

.similar-item img {
  width: 150px;
  height: 220px;
  object-fit: cover;
  border-radius: 10px;
}

.similar-item:hover {
  transform: scale(1.06);
}
</style>
