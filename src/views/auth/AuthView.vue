<script setup>
import ForgotPasswordComponent from '@/components/auth/ForgotPasswordComponent.vue';
import LoginComponent from '@/components/auth/LoginComponent.vue';
import RegisterComponent from '@/components/auth/RegisterComponent.vue';
import PerfilComponent from '@/components/auth/PerfilComponent.vue';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore()
</script>

<template>
    <main>
        <LoginComponent v-if="authStore.logado === false && authStore.authView === 'login'" />
        <RegisterComponent v-else-if="authStore.logado === false && authStore.authView === 'register'" />
        <ForgotPasswordComponent v-else-if="authStore.logado === false && authStore.authView === 'forgotPassword'" />
        <PerfilComponent v-else-if="authStore.logado" />
    </main>
</template>