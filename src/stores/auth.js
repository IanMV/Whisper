import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'

export const useAuthStore = defineStore('authStore', () => {
  const users = ref([
    {
      id: 1,
      name: 'Vini Jr',
      email: 'a@a',
      password: 'a',
    },
  ])

  const logado = ref(false)
  const currentUser = ref(null)

  function login(email, password) {
    const foundUser = users.value.find(
      (u) => u.email === email && u.password === password
    )

    if (foundUser) {
      currentUser.value = users.value.find((u) => u.email === email)
      logado.value = true
      try {
        router.push('/perfil')
      } catch (err) {
        console.warn('Redirecionamento não disponível no contexto atual.')
      }
      return true
    } else {
      logado.value = false
      currentUser.value = null
      return false
    }
  }

  function register(name, email, password) {
    const existingUser = users.value.find((u) => u.email === email)
    if (existingUser) {
      return false
    }

    const newUser = {
      id: users.value.length + 1,
      name,
      email,
      password,
    }

    users.value.push(newUser)
    return true
  }

  function forgotPassword(email) {
    const foundUser = users.value.find((u) => u.email === email)
    return !!foundUser
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
    } catch (err) {
      console.warn('Redirecionamento não disponível no contexto atual.')
    }
  }

  const saveCroppedImage = () => {
  const result = cropperRef.value?.getResult()
  if (result?.canvas) {
    const cropped = result.canvas.toDataURL()
    selectedImage.value = cropped

    authStore.currentUser.photo = cropped
    if (typeof authStore.updateProfileImage === 'function') {
      authStore.updateProfileImage(authStore.currentUser.id, cropped)
    }

    showCropper.value = false 
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
    saveCroppedImage,
  }
})
