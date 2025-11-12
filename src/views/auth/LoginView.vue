<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Logo from '@/components/svg/Logo.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  const sucesso = await authStore.login(email.value, password.value)
  if (!sucesso) {
    alert('Email ou senha incorretos!')
  }
}


</script>

<template>
  <section class="login-container">
    <div class="login">
      <Logo class="logo" />
      <h1>Bem-vindo de Volta</h1>
      <p>Entre na sua conta para melhorar sua experiência</p>

      <form @submit.prevent="handleLogin">
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
            <span
              :class="showPassword ? 'mdi mdi-eye-outline' : 'mdi mdi-eye-off-outline'"
              class="toggle-password"
              @click="togglePassword"
            ></span>
          </div>
        </div>

        <div class="options">
          <RouterLink to="/forgot-password" class="forgot-password">
            Esqueci minha senha
          </RouterLink>
        </div>

        <button type="submit">Entrar</button>

        <div class="create-account">
          <p>Não tem uma conta? <RouterLink to="/register" class="create-link">
            Criar conta
          </RouterLink></p>
          
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
  padding: 20px;
  width: 420px;
  height: 550px;
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
  margin-bottom: 0px;
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

form div {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 1.1rem;
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

.input-group span.toggle-password {
  position: absolute;
    left: 350px;
  cursor: pointer;
  color: c.$color-gray-text;
  font-size: 1.2rem;
  transition: color 0.3s;
}

.toggle-password:hover {
  color: c.$color-red-detail;
}

.options {
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
  margin-bottom: 20px;
}

.forgot-password {
  font-size: 0.85rem;
  color: c.$color-red-detail;
  text-decoration: none;
  transition: 0.3s;
}

.forgot-password:hover {
  text-decoration: underline;
    color: c.$color-red-hover;
    text-shadow: c.$color-red-hover 0px 0px 3px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: c.$color-red-detail;
  color: white;
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

.create-account p {
  margin: 0;
  color: c.$color-gray-text;
  font-size: 0.9rem;
}

.create-link {
  display: inline-block;
  margin-top: 5px;
  color: c.$color-red-detail;
  font-weight: 500;
  text-decoration: none;
  transition: 0.3s;
}

.create-link:hover {
  text-decoration: underline;
  color: c.$color-red-hover;
  text-shadow: c.$color-red-hover 0px 0px 3px;
}
</style>