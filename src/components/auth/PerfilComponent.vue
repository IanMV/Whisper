<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { Cropper, CircleStencil } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const selectedImage = ref(authStore.currentUser?.photo || null);

const showCropper = ref(false);
const tempImage = ref(null);
const cropperRef = ref(null);

const isEditing = ref(false);
let backupUser = null;

const startEdit = () => {
  backupUser = JSON.parse(JSON.stringify(authStore.currentUser));
  isEditing.value = true;
};

const cancelEdit = () => {
  authStore.currentUser = JSON.parse(JSON.stringify(backupUser));
  isEditing.value = false;
};

const saveEdit = () => {
  if (typeof authStore.updateUserInfo === "function") {
    authStore.updateUserInfo(authStore.currentUser);
  } else if (typeof authStore.updateProfile === "function") {
    authStore.updateProfile(authStore.currentUser);
  } else {
    console.warn("Nenhuma função de update encontrada no store.");
  }
  isEditing.value = false;
};

const handleImageUpload = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    tempImage.value = reader.result;
    showCropper.value = true;
  };
  reader.readAsDataURL(file);
};

const saveCropped = async () => {
  try {
    const cmp = cropperRef.value;
    if (!cmp) return (showCropper.value = false);

    let result = null;

    if (typeof cmp.getResult === "function") {
      try {
        result = cmp.getResult();
      } catch { }
    }

    if (!result && cmp?.result) result = cmp.result;

    let canvas = result?.canvas || null;

    if (!canvas && typeof cmp.getCanvas === "function") {
      try {
        canvas = cmp.getCanvas();
      } catch { }
    }

    if (!canvas) {
      console.error("Erro ao obter canvas do cropper");
      showCropper.value = false;
      return;
    }

    const dataUrl = canvas.toDataURL("image/png");
    selectedImage.value = dataUrl;

    if (typeof authStore.updateUserPhoto === "function") {
      await authStore.updateUserPhoto(dataUrl);
    } else {
      authStore.currentUser.photo = dataUrl;
    }

    showCropper.value = false;
  } catch (err) {
    console.error("Erro em saveCropped:", err);
    showCropper.value = false;
  }
};
</script>

<template>
  <section>
    <div class="perfil-container">
      <div class="left-card">
        <div class="foto-area">
          <div class="circle">
            <img :src="selectedImage || '/img/default-avatar.png'" alt="avatar" />
          </div>

          <label class="upload-label">
            <input type="file" accept="image/*" @change="handleImageUpload" hidden />
            Alterar foto
          </label>
        </div>
        <input type="name" v-model="authStore.currentUser.name" :disabled="!isEditing" class="nome" />
        <p class="logout" @click="(authStore.logado = false), (authStore.authView = 'login')">
          Sair da Conta
        </p>
      </div>

      <div class="right-card">
        <div class="panel">
          <div class="panel-header">
            <h3>Informações Pessoais:</h3>

            <div class="edit-buttons">
              <button v-if="!isEditing" class="btn-editar" @click="startEdit">
                Editar
              </button>

              <div v-else class="edit-group">
                <button class="btn-salvar" @click="saveEdit">Salvar</button>
                <button class="btn-cancelar" @click="cancelEdit">
                  Cancelar
                </button>
              </div>
            </div>
          </div>

          <div class="fields">
            <div class="row-two">
              <input type="text" :value="authStore.currentUser.cpf" @input="authStore.updateCPF($event.target.value)"
                placeholder="000.000.000-00" :disabled="!isEditing" />
              <input type="date" v-model="authStore.currentUser.dataNascimento" :disabled="!isEditing" />
            </div>

            <input type="email" :value="authStore.currentUser.email" @input="authStore.updateEmail($event.target.value)"
              placeholder="seuemail@email.com" :disabled="!isEditing" />

            <textarea placeholder="Biografia" v-model="authStore.currentUser.bio" :disabled="!isEditing"></textarea>
          </div>

          <div class="panel-footer">
            <RouterLink to="/destaques">
              <button class="btn-outline">Destaques</button>
            </RouterLink>
            <RouterLink to="/minha-lista">
              <button class="btn-white">Minha Lista </button>
            </RouterLink>
          </div>
        </div>
      </div>

      <div v-if="showCropper" class="cropper-modal">
        <div class="cropper-box">
          <Cropper ref="cropperRef" :src="tempImage" :stencil-component="CircleStencil"
            :stencil-props="{ aspectRatio: 1 }" class="cropper" />

          <div class="cropper-actions">
            <button class="btn salvar" @click="saveCropped">Salvar</button>
            <button class="btn cancelar" @click="showCropper = false">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
input:disabled,
textarea:disabled {
  cursor: not-allowed;
}

.edit-group {
  display: flex;
  gap: 10px;
}

.btn-salvar {
  background: c.$color-red-detail;
  color: c.$color-white-text;
  padding: 8px 15px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

.btn-salvar:hover {
  background: c.$color-red-hover;
  box-shadow: c.$color-red-hover 0px 0px 8px;
}

.btn-cancelar {
  background: transparent;
  color: c.$color-white-text;
  padding: 8px 15px;
  border-radius: 8px;
  border: 1px solid c.$color-white-text;
  cursor: pointer;
  transition: 0.3s;
}

.btn-cancelar:hover {
  border-color: c.$color-red-hover;
  color: c.$color-red-hover;
  box-shadow: c.$color-red-hover 0px 0px 8px;
}

section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.perfil-container {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 28px;
  border-radius: 12px;
  padding: 80px 80px;
  color: c.$color-white-text;
  background: c.$color-gray-bottom;
  width: 80%;
  height: 60%;
}

.left-card {
  background: c.$color-black-bottom;
  padding: 22px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.foto-area .circle {
  width: 240px;
  height: 240px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid c.$color-red-detail;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

.foto-area .circle img {
  width: 200%;
  height: 100%;
  object-fit: cover;
}

.upload-label {
  background: c.$color-red-detail;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 12px;
  color: c.$color-white-text;
  font-weight: 500;
  margin-left: 70px;
  transition: 0.3s;
}

.upload-label:hover {
  background: c.$color-red-hover;
  color: c.$color-white-text;
  box-shadow: c.$color-red-hover 0px 0px 8px;
  transform: scale(1.05);
}

.foto-area:has(.upload-label:hover) .circle {
  border-color: c.$color-red-hover;
  box-shadow: c.$color-red-hover 0px 0px 8px;
}

input.nome {
  font-size: 2rem;
  font-weight: 600;
  margin-top: 10px;
  background: c.$color-black-bottom;
  border: 1px solid c.$color-gray-text;
  color: c.$color-white-text;
  padding: 10px;
  border-radius: 6px;
  outline: none;
  text-align: center;
  width: 300px;
}

.logout {
  color: c.$color-red-detail;
  cursor: pointer;
  transition: 0.3s;
}

.logout:hover {
  color: c.$color-red-hover;
  text-shadow: c.$color-red-hover 0px 0px 3px;
  transform: scale(1.05);
}

.right-card {
  background: c.$color-black-bottom;
  border-radius: 12px;
  padding: 30px 40px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-header h3 {
  color: c.$color-white-text;
  margin: 0;
  font-size: 1.7rem;
  font-weight: 500;
}

.btn-editar {
  background: c.$color-red-detail;
  color: c.$color-white-text;
  padding: 8px 15px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

.btn-editar:hover {
  background: c.$color-red-hover;
  box-shadow: c.$color-red-hover 0px 0px 8px;
}

.panel .fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.row-two {
  display: flex;
  gap: 12px;
}

.row-two input {
  flex: 1;
}

input,
textarea {
  background: c.$color-black-bottom;
  border: 1px solid c.$color-gray-text;
  color: c.$color-white-text;
  padding: 10px;
  border-radius: 6px;
  outline: none;
}

input:focus,
textarea:focus {
  border-color: c.$color-red-detail;
  box-shadow: c.$color-red-hover 0px 0px 8px;
}

textarea {
  height: 110px;
  resize: none;
  padding: 10px;
}

.panel-footer {
  margin-top: 18px;
  display: flex;
  justify-content: space-between;
}

.btn-outline {
  background: transparent;
  border: 1px solid c.$color-white-text;
  padding: 15px 150px;
  border-radius: 8px;
  color: c.$color-white-text;
  cursor: pointer;
  transition: 0.3s;
  width: 100%;
  font-size: 1.2rem;
}

.btn-outline:hover {
  border-color: c.$color-red-hover;
  color: c.$color-red-hover;
  box-shadow: c.$color-red-hover 0px 0px 8px;
}

.btn-white {
  background: c.$color-red-detail;
  color: c.$color-white-text;
  padding: 15px 150px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
  width: 100%;
  font-size: 1.2rem;
}

.btn-white:hover {
  background: c.$color-red-hover;
  box-shadow: c.$color-red-hover 0px 0px 8px;
}

.cropper-modal {
  position: fixed;
  inset: 0;
  background: c.$color-black-bottom;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.cropper-box {
  background: c.$color-black-bottom;
  padding: 20px;
  border-radius: 12px;
  width: 460px;
  text-align: center;
}

.cropper {
  width: 360px;
  height: 360px;
  margin: 0 auto;
  background: c.$color-black-bottom;
  border-radius: 8px;
}

.cropper-actions {
  display: flex;
  gap: 12px;
  margin-top: 14px;
  justify-content: center;
}

.btn.salvar {
  background: c.$color-red-detail;
  color: c.$color-white-text;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

.btn.salvar:hover {
  background: c.$color-red-hover;
  box-shadow: c.$color-red-hover 0px 0px 8px;
}

.btn.cancelar {
  background: transparent;
  border: 1px solid c.$color-white-text;
  color: c.$color-white-text;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.btn.cancelar:hover {
  border-color: c.$color-red-hover;
  color: c.$color-red-hover;
  box-shadow: c.$color-red-hover 0px 0px 8px;
}
</style>
