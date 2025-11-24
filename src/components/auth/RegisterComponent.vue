<script setup>
import { ref, onMounted } from 'vue'
import Logo from '@/components/svg/Logo.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

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

const togglePassword = () => showPassword.value = !showPassword.value

const handleRegister = () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Preencha todos os campos.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'As senhas não coincidem.'
    return
  }

  const registrado = authStore.register(name.value, email.value, password.value)
  if (!registrado) {
    errorMessage.value = 'Esse email já está cadastrado.'
  } else {
    successMessage.value = 'Conta criada com sucesso!'
    setTimeout(() => authStore.authView = 'login', 1500)
  }
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

    <div class="login">
      <Logo class="logo" />
      <h1>Criar Conta</h1>
      <p>Preencha os dados abaixo para se registrar</p>

      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <span class="mdi mdi-account-outline"></span>
          <input type="text" v-model="name" placeholder="Nome completo" />
        </div>

        <div class="input-group">
          <span class="mdi mdi-email-outline"></span>
          <input type="email" v-model="email" placeholder="Email" />
        </div>

        <div class="password-fields">
          <div class="input-group">
          <span class="mdi mdi-lock-outline"></span>
          <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Senha" />
        </div>

        <div class="input-group">
          <span class="mdi mdi-lock-outline"></span>
          <input :type="showPassword ? 'text' : 'password'" v-model="confirmPassword" placeholder="Confirmar senha" />
        </div>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

        <button type="submit">Criar Conta</button>

        <div class="create-account">
          <p>
            Já tem uma conta?
            <span class="create-link" @click="authStore.authView = 'login'">Voltar</span>
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
  margin: 20px auto 20px;
  width: 100px;
}

h1 {
  text-align: center;
  margin-bottom: 0;
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

.error-message {
  color: c.$color-red-hover;
  text-align: center;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.success-message {
  color: c.$color-red-hover;
  text-align: center;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

form div {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 1rem;
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

.password-fields {
  display: flex;
  gap: 10px;
  margin: 0;
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
  font-size: 1rem;
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
