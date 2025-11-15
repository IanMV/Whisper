<script setup>
import { ref } from 'vue'
import Logo from '@/components/svg/Logo.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

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
  <section class="login-container">
    <div class="login">
      <Logo class="logo" />

      <template v-if="stage === 'email'">
        <h1>Esqueceu sua senha?</h1>
        <p>Insira o e-mail cadastrado para redefinir sua senha</p>

        <form @submit.prevent="handleEmailSubmit">
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
            <label for="password">Nova Senha:</label>
            <div class="input-group">
              <span class="mdi mdi-lock-outline"></span>
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                required
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
            <label for="confirmPassword">Confirmar Senha:</label>
            <div class="input-group">
              <span class="mdi mdi-lock-outline"></span>
              <input
                :type="showPassword ? 'text' : 'password'"
                id="confirmPassword"
                v-model="confirmPassword"
                required
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
  min-height: 480px;
  box-shadow: 0 8px 32px c.$color-black-bottom;
  color: c.$color-white-text;
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
