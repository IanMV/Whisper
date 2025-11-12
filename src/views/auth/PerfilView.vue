<script setup>
import { ref, computed } from 'vue'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const selectedImage = ref(authStore.currentUser?.photo || null)
const imageToCrop = ref(null)
const showCropper = ref(false)
const cropperRef = ref(null)
const zoom = ref(1)

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    imageToCrop.value = ev.target.result
    showCropper.value = true
  }
  reader.readAsDataURL(file)
}

const handleZoom = (val) => {
  zoom.value = parseFloat(val)
  if (cropperRef.value) {
    const coords = cropperRef.value.getResult()?.coordinates
    cropperRef.value.setCoordinates(coords, { zoom: zoom.value })
  }
}

const previewImage = computed(() => {
  if (!cropperRef.value) return null
  const result = cropperRef.value.getResult()
  return result?.canvas?.toDataURL() || null
})

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
</script>

<template>
  <section class="perfil-container">
    <div class="perfil-box">
      <div class="perfil-left">
        <label for="fileInput" class="foto-label">
          <img
            v-if="selectedImage"
            :src="selectedImage"
            alt="Foto de perfil"
            class="foto"
          />
          <div v-else class="foto-placeholder"></div>
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          @change="handleImageUpload"
          hidden
        />
        <h2>{{ authStore.currentUser.name }}</h2>
        <p>User</p>
      </div>
    </div>

    <div v-if="showCropper" class="modal">
      <div class="cropper-container">
        <h3>Editar foto de perfil</h3>

        <div class="cropper-content">
          <div class="cropper-area">
            <Cropper
              ref="cropperRef"
              :src="imageToCrop"
              :stencil-component="CircleStencil"
              :stencil-props="{ aspectRatio: 1 }"
              class="cropper"
            />
          </div>
        </div>

        <div class="buttons">
          <button class="btn salvar" @click="saveCroppedImage">Salvar</button>
          <button class="btn cancelar" @click="showCropper = false">Cancelar</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.perfil-container {
  width: 100%;
  min-height: 100vh;
  background: #0f0f0f;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.perfil-box {
  display: flex;
  background: #1b1b1b;
  border-radius: 8px;
  padding: 30px;
  width: 90%;
  max-width: 900px;
  gap: 20px;
}

.perfil-left {
  flex: 1;
  background: #111;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 3px solid #222;
  border-radius: 4px;
  padding: 20px;
}

.foto-label {
  cursor: pointer;
}

.foto {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  margin-bottom: 20px;
  transition: 0.3s;
}

.foto:hover {
  opacity: 0.8;
}

.foto-placeholder {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #fff;
  margin-bottom: 20px;
}

.perfil-left h2 {
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.perfil-left p {
  font-size: 0.9rem;
  color: #ccc;
}


.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.cropper-container {
  background: #1a1a1a;
  padding: 25px 30px;
  border-radius: 12px;
  width: 750px;
  text-align: center;
}

.cropper-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  margin: 20px 0;
}

.cropper-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cropper {
  width: 300px;
  height: 300px;
  border-radius: 10px;
  overflow: hidden;
  background: #222;
}

.preview-area {
  text-align: center;
  color: #fff;
}

.preview-circle {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e50914;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: #333;
}

.buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.btn.salvar {
  background: #e50914;
  border: none;
  color: #fff;
}

.btn.cancelar {
  background: transparent;
  border: 1px solid #fff;
  color: #fff;
}
</style>
