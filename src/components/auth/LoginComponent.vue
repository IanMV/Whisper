<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import Logo from '@/components/svg/Logo.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const terrorMovies = [
  346364,  
  348,     
  694,     
  138843,  
  214,     
]

const backgroundUrl = ref('')
const API_KEY = '817aab6edd675cf23cb2adfd4ddfcfab'

let shuffledMovies = []
let index = 0

function shuffleMovies() {
  shuffledMovies = [...terrorMovies].sort(() => Math.random() - 0.5)
  index = 0
}

async function loadRandomBackground() {
  if (index >= shuffledMovies.length) {
    shuffleMovies()
  }

  const movieId = shuffledMovies[index]
  index++

  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.backdrop_path) {
      backgroundUrl.value = `https://image.tmdb.org/t/p/original${data.backdrop_path}`
    }
  } catch (error) {
    console.error("Erro ao carregar imagem:", error)
  }
}


onMounted(() => {
  shuffleMovies()
  loadRandomBackground()
  setInterval(loadRandomBackground, 8000)
})

const togglePassword = () => (showPassword.value = !showPassword.value)

const handleLogin = async () => {
  const sucesso = await authStore.login(email.value, password.value)
  if (!sucesso) alert('Email ou senha incorretos!')
}
</script>

<template>
  <section
    class="login-container"
    :style="{
    background: `linear-gradient(to bottom, rgba(0,0,0,0.5), #0c0c0c), url(${backgroundUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: 'darken'
  }"
  >
    <div class="login fade">
      <Logo class="logo" />
      <h1>Bem-vindo de Volta</h1>
      <p>Entre na sua conta para melhorar sua experiência</p>

      <form @submit.prevent="handleLogin">
        <div>
          <div class="input-group">
            <span class="mdi mdi-email-outline"></span>
            <input
              type="email"
              id="email"
              v-model="email"
              required
              placeholder="exemplo@gmail.com"
            />
          </div>
        </div>

        <div>
          <div class="input-group">
            <span class="mdi mdi-lock-outline"></span>

            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              required
              placeholder="Digite sua senha"
            />

            <span
              :class="showPassword ? 'mdi mdi-eye-outline' : 'mdi mdi-eye-off-outline'"
              class="toggle-password"
              @click="togglePassword"
            ></span>
          </div>
        </div>

        <div class="options">
          <span
            @click="authStore.authView = 'forgotPassword'"
            class="forgot-password"
          >
            Esqueci minha senha
          </span>
        </div>

        <button type="submit">Entrar</button>

        <div class="create-account">
          <p>
            Não tem uma conta?
            <span
              @click="authStore.authView = 'register'"
              class="create-link"
              >Criar conta</span
            >
          </p>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.login-container {
  height: 100vh;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-blend-mode: darken;
  display: flex;
  align-items: center;
}

.login {
  background: c.$color-black-blur;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  margin-left: 12%;
  padding: 20px;
  width: 420px;
  height: 550px;
  color: c.$color-white-text;
  margin-top: 20px;
}

.logo {
  display: block;
  margin: 20px auto;
  width: 100px;
}

h1 {
  text-align: center;
  font-weight: bold;
  font-size: 2.5rem;
    color: c.$color-red-hover;
}

p {
  text-align: center;
  font-size: 0.9rem;
  margin-bottom: 25px;
  color: c.$color-gray-text;
}

form div {
  margin-bottom: 20px;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-group span.mdi {
  position: absolute;
  left: 10px;
  color: c.$color-gray-text;
  font-size: 1.2rem;
}

.input-group input {
  width: 100%;
  height: 40px;
  padding: 10px 40px 10px 35px;
  border-radius: 12px;
  border: 1px solid c.$color-gray-text;
  background-color: transparent;
  color: c.$color-white-text;
  outline: none;
  transition: 0.4s all;
}

.input-group input:focus {
  border-color: c.$color-red-hover;
  box-shadow: c.$color-red-hover 0px 0px 8px;
}

.input-group span.toggle-password {
  position: absolute;
    left: 350px;
  cursor: pointer;
  color: c.$color-gray-text;
  font-size: 1.2rem;
  transition: 0.4s all;
}

.toggle-password:hover {
  color: c.$color-red-hover;
}

.options {
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
  margin-bottom: 20px;
}

.forgot-password {
  font-size: 0.9rem;
  color: c.$color-red-hover;
  text-decoration: none;
  transition: 0.4s all;
  cursor: pointer;
}

.forgot-password:hover {
  text-decoration: underline;
    color: c.$color-red-hover;
    text-shadow: c.$color-red-hover 0px 0px 3px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: c.$color-red-hover;
  color: c.$color-white-text;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.4s;
}

button:hover {
  background-color: c.$color-red-hover;
  box-shadow: c.$color-red-hover 0px 0px 8px;
  transform: scale(1.05);
}

.create-account {
  text-align: center;
  margin-top: 5px;
  cursor: pointer;
}

.create-account p {
  margin: 0;
  color: c.$color-gray-text;
  font-size: 0.9rem;
}

.create-link {
  display: inline-block;
  margin-top: 10px;
  color: c.$color-red-hover;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
  font-size: 1rem;
  transition: 0.4s all;
}

.create-link:hover {
  text-decoration: underline;
  color: c.$color-red-hover;
  text-shadow: c.$color-red-hover 0px 0px 3px;
}
</style>