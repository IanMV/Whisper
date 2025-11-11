import router from '@/router'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', () => {
  const user = [
    {
      id: 1,
      name: 'John Doe',
      email: 'a@a',
      password: 'a',
    },
  ]

  const logado = false

  function login(email, password) {
    const foundUser = user.find(
      (u) => u.email === email && u.password === password
    )
    if (foundUser) {
      return router.push('/perfil'), logado = true, true
    } else {
      return false
    }
  }

  function register(name, email, password) {
    const existingUser = user.find((u) => u.email === email)
    if (existingUser) {
      return false
    } else {
      const newUser = {
        id: user.length + 1,
        name,
        email,
        password,
      }
      user.push(newUser)
      return true
    }
  }

  function forgotPassword(email) {
    const foundUser = user.find((u) => u.email === email)
    if (foundUser) {
      return true
    } else {
      return false
    }
  }
  return { login, register, forgotPassword, logado }
})