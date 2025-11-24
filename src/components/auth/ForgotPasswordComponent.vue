<script setup>
import { ref, onMounted } from 'vue'
import Logo from '@/components/svg/Logo.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const terrorMovies = [
  346364, 
  348,    
  694,    
  138843, 
  214     
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

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`
    )
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
})

const stage = ref('email') 
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleEmailSubmit = () => {
  if (!email.value) {
    errorMessage.value = 'Por favor, insira seu email.'
    return
  }

  const found = authStore.forgotPassword(email.value)
  if (!found) {
    errorMessage.value = 'Email não encontrado em nossa base de dados.'
    return
  }

  errorMessage.value = ''
  stage.value = 'reset'
}

const handlePasswordReset = () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!password.value || !confirmPassword.value) {
    errorMessage.value = 'Preencha todos os campos.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'As senhas não coincidem.'
    return
  }

  const updated = authStore.resetPassword(email.value, password.value)
  if (updated) {
    successMessage.value = 'Senha alterada com sucesso!'
    stage.value = 'success'
  } else {
    errorMessage.value = 'Erro ao alterar a senha. Tente novamente.'
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

      <template v-if="stage === 'email'">
        <h1>Esqueceu sua senha?</h1>
        <p>Insira o e-mail cadastrado para redefinir sua senha</p>

        <form @submit.prevent="handleEmailSubmit">
          <div>
            <label>Email:</label>
            <div class="input-group">
              <span class="mdi mdi-email-outline"></span>
              <input
                type="email"
                v-model="email"
                required
                placeholder="exemplo@gmail.com"
              />
            </div>
          </div>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

          <button type="submit">Continuar</button>

          <div class="create-account">
            <span @click="authStore.authView = 'login'" class="create-link">
              Voltar ao Login
            </span>
          </div>
        </form>
      </template>

      <template v-else-if="stage === 'reset'">
        <h1>Redefinir Senha</h1>
        <p>Crie uma nova senha para sua conta</p>

        <form @submit.prevent="handlePasswordReset">
          <div>
            <label>Nova Senha:</label>
            <div class="input-group">
              <span class="mdi mdi-lock-outline"></span>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="Digite sua nova senha"
              />
              <span
                class="mdi"
                :class="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click="showPassword = !showPassword"
              ></span>
            </div>
          </div>

          <div>
            <label>Confirmar Senha:</label>
            <div class="input-group">
              <span class="mdi mdi-lock-outline"></span>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="confirmPassword"
                placeholder="Confirme sua nova senha"
              />
            </div>
          </div>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

          <button type="submit">Salvar Nova Senha</button>

          <div class="create-account">
            <span @click="authStore.authView = 'login'" class="create-link">
              Voltar ao Login
            </span>
          </div>
        </form>
      </template>

      <template v-else-if="stage === 'success'">
        <h1>Senha Alterada!</h1>
        <p class="success-message">{{ successMessage }}</p>

        <div class="create-account">
          <span @click="authStore.authView = 'login'" class="create-link">
            Ir para o Login
          </span>
        </div>
      </template>
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
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  margin-left: 12%;
  padding: 60px 20px;
  width: 420px;
  height: 550px;
  box-shadow: 0 8px 32px #000;
  color: #fff;
  margin-top: 20px;
  text-align: center;
}

.logo {
  display: block;
  margin: 20px auto 20px;
  width: 100px;
}

h1 {
  margin-bottom: 0;
  font-weight: bold;
  font-size: 2rem;
  color: c.$color-red-detail;
}

p {
  font-size: 0.8rem;
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
  color: c.$color-white-text;
  font-size: 1rem;
  margin-bottom: 25px;
}

form div {
  margin-bottom: 20px;
  text-align: left;
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

.input-group span.mdi-eye-outline,
.input-group span.mdi-eye-off-outline {
  right: 10px;
  left: auto;
  cursor: pointer;
  color: c.$color-gray-text;
  transition: color 0.2s;
}

.input-group span.mdi-eye-outline:hover,
.input-group span.mdi-eye-off-outline:hover {
  color: c.$color-red-detail;
}

.input-group input {
  width: 100%;
  height: 40px;
  padding: 10px 40px 10px 35px;
  border-radius: 6px;
  border: 1px solid c.$color-gray-text;
  background-color: transparent;
  color: c.$color-white-text;
  outline: none;
  transition: 0.3s;
}

.input-group input:focus {
  border-color: c.$color-red-detail;
  box-shadow: c.$color-red-hover 0px 0px 8px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: c.$color-red-detail;
  color: c.$color-white-text;
  border: none;
  border-radius: 6px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background-color: c.$color-red-detail;
  box-shadow: c.$color-red-hover 0px 0px 8px;
}

.create-account {
  text-align: center;
  margin-top: 5px;
}

.create-link {
  display: inline-block;
  color: c.$color-red-detail;
  font-weight: 500;
  text-decoration: none;
  transition: 0.3s;
  cursor: pointer;
}

.create-link:hover {
  text-decoration: underline;
  color: c.$color-red-hover;
  text-shadow: c.$color-red-hover 0px 0px 3px;
}
</style>
