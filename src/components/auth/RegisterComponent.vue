<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import Logo from '@/components/svg/Logo.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

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
  <section class="login-container">
    <div class="login">
      <Logo class="logo" />
      <h1>Criar Conta</h1>
      <p>Preencha os dados abaixo para se registrar</p>

      <form @submit.prevent="handleRegister">
        <div>
          <label for="name">Nome:</label>
          <div class="input-group">
            <span class="mdi mdi-account-outline"></span>
            <input
              type="text"
              id="name"
              v-model="name"
              required
              placeholder="Digite seu nome"
            />
          </div>
        </div>

        <div>
          <label for="email">Email:</label>
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

        <div class="password-fields">
          <div>
            <label for="password">Senha:</label>
            <div class="input-group">
              <span class="mdi mdi-lock-outline"></span>
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                required
                placeholder="Digite sua senha"
              />
            </div>
          </div>
          <div>
            <label for="confirm-password">Confirmar Senha:</label>
            <div class="input-group">
              <span class="mdi mdi-lock-outline"></span>
              <input
                :type="showPassword ? 'text' : 'password'"
                id="confirm-password"
                v-model="confirmPassword"
                required
                placeholder="Confirme sua senha"
              />
            </div>
          </div>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

        <button type="submit">Criar Conta</button>

        <div class="create-account">
          <span @click="authStore.authView = 'login'" class="create-link">
            Voltar ao Login
          </span>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.login-container {
  height: 100vh;
  width: 100%;
  background: linear-gradient(to right, c.$color-black-bottom, c.$color-black-bottom 50%, transparent);
  display: flex;
  align-items: center;
  padding: 0;
}

.login {
  background: c.$color-gray-bottom;
  backdrop-filter: blur(10px);
  border-radius: 16px;
  margin-left: 12%;
  margin-top: 50px;
  padding: 20px;
  width: 420px;
  height: 600px;
  box-shadow: 0 8px 32px c.$color-black-bottom;
  color: c.$color-white-text;
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
  font-size: 2rem;
  color: c.$color-red-detail;
}

p {
  text-align: center;
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
  color: c.$color-red-detail;
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

.password-fields {
  display: flex;
  gap: 10px;
  margin: 0;
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
}

.create-link {
  display: inline-block;
  margin-top: 5px;
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
