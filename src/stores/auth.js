import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'

function formatCPF(value) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14)
}

function formatDateBR(value) {
  if (!value && value !== '') return ''

  let v = String(value).replace(/\D/g, '')

  v = v.slice(0, 8)

  if (v.length >= 3) v = v.replace(/(\d{2})(\d)/, '$1/$2')
  if (v.length >= 5) v = v.replace(/(\d{2})\/(\d{2})(\d+)/, '$1/$2/$3')

    if (v.length === 10) {
    const [diaS, mesS, anoS] = v.split('/')
    const dia = Number(diaS)
    const mes = Number(mesS)
    const ano = Number(anoS)
    const anoAtual = new Date().getFullYear()

    if (isNaN(dia) || isNaN(mes) || isNaN(ano)) return null
    if (ano < 1900 || ano > anoAtual) return null
    if (mes < 1 || mes > 12) return null

    const ultimoDia = new Date(ano, mes, 0).getDate()
    if (dia < 1 || dia > ultimoDia) return null
  }

  return v
}

function validateEmail(value) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(value)
}

export const useAuthStore = defineStore('authStore', () => {
  const users = ref([
    {
      id: 1,
      name: 'Vini Jr',
      email: 'a@a',
      password: 'a',
      cpf: '',
      dataNascimento: '',
      photo: null,
    },
  ])

  const logado = ref(false)
  const authView = ref('login')
  const currentUser = ref(null)

  function login(email, password) {
    const foundUser = users.value.find(
      (u) => u.email === email && u.password === password
    )

    if (foundUser) {
      currentUser.value = foundUser
      logado.value = true
      return true
    }

    logado.value = false
    currentUser.value = null
    return false
  }

  function register(name, email, password) {
    const exists = users.value.some((u) => u.email === email)
    if (exists) return false

    const newUser = {
      id: users.value.length + 1,
      name,
      email,
      password,
      cpf: '',
      dataNascimento: '',
      photo: null,
    }

    users.value.push(newUser)
    return true
  }

  function forgotPassword(email) {
    return users.value.some((u) => u.email === email)
  }

  function resetPassword(email, newPassword) {
    const index = users.value.findIndex((u) => u.email === email)
    if (index !== -1) {
      users.value[index].password = newPassword
      return true
    }
    return false
  }

  function logout() {
    logado.value = false
    currentUser.value = null
    router.push('/login')
  }

  function updateCPF(value) {
    if (!currentUser.value) return
    currentUser.value.cpf = formatCPF(value)
  }

  function updateEmail(value) {
    if (!currentUser.value) return
    currentUser.value.email = value
  }

  function updateDataNascimento(value) {
    if (!currentUser.value) return

    if (value === '') {
      currentUser.value.dataNascimento = ''
      return
    }

    const formatted = formatDateBR(value)

    if (formatted === null) {
      return
    }

    currentUser.value.dataNascimento = formatted
  }

  function updateProfileImage(userId, image) {
    const user = users.value.find((u) => u.id === userId)
    if (user) {
      user.photo = image
      if (currentUser.value?.id === userId) {
        currentUser.value.photo = image
      }
    }
  }

  return {
    users,
    currentUser,
    logado,
    authView,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,

    updateCPF,
    updateEmail,
    updateDataNascimento,
    updateProfileImage,

    formatCPF,
    formatDateBR,
    validateEmail,
  }
})
