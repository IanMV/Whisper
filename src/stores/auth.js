import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import router from '@/router'

export const useAuthStore = defineStore('authStore', () => {

  const savedUsers = JSON.parse(localStorage.getItem('users')) || [
    {
      id: 1,
      name: 'Vini Jr',
      email: 'a@a',
      password: 'a',
      cpf: '',
      dataNascimento: '',
      bio: '',
      photo: null,
    },
  ]

  const savedCurrentUser = JSON.parse(localStorage.getItem('currentUser')) || null
  const savedLogado = JSON.parse(localStorage.getItem('logado')) || false
  const savedAuthView = localStorage.getItem('authView') || 'login'

  const users = ref(savedUsers)
  const currentUser = ref(savedCurrentUser)
  const logado = ref(savedLogado)
  const authView = ref(savedAuthView)

  watch(users, (v) => {
    localStorage.setItem('users', JSON.stringify(v))
  }, { deep: true })

  watch(currentUser, (v) => {
    localStorage.setItem('currentUser', JSON.stringify(v))
  }, { deep: true })

  watch(logado, (v) => {
    localStorage.setItem('logado', JSON.stringify(v))
  })

  watch(authView, (v) => {
    localStorage.setItem('authView', v)
  })

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
    const existingUser = users.value.find((u) => u.email === email)
    if (existingUser) return false

    const newUser = {
      id: users.value.length + 1,
      name,
      email,
      password,
      cpf: '',
      dataNascimento: '',
      bio: '',
      photo: null,
    }

    users.value.push(newUser)
    return true
  }

  function forgotPassword(email) {
    return users.value.some((u) => u.email === email)
  }

  function resetPassword(email, newPassword) {
    const userIndex = users.value.findIndex((u) => u.email === email)
    if (userIndex !== -1) {
      users.value[userIndex].password = newPassword
      return true
    }
    return false
  }

  function logout() {
    logado.value = false
    currentUser.value = null
    
    try {
      router.push('/login')
    } catch {}
  }

  function updateUserPhoto(photoBase64) {
    if (!currentUser.value) return

    currentUser.value.photo = photoBase64

    const index = users.value.findIndex(
      (u) => u.id === currentUser.value.id
    )

    if (index !== -1) {
      users.value[index].photo = photoBase64
    }
  }

  function updateUserInfo(newData) {
    if (!currentUser.value) return

    const index = users.value.findIndex(
      (u) => u.id === currentUser.value.id
    )

    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...newData }
      currentUser.value = users.value[index]
    }
  }

  return {
    users,
    currentUser,
    logado,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    updateUserPhoto,
    updateUserInfo,
    authView,
  }
})
