import { defineStore } from "pinia";
import { ref, watch } from "vue";
import router from "@/router";

export const useAuthStore = defineStore("authStore", () => {
  const users = ref(JSON.parse(localStorage.getItem("users")) || [
    {
      id: 1,
      name: "Vini Jr",
      email: "a@a",
      password: "a",
      cpf: "",
      dataNascimento: "",
      photo: null,
      myList: [],
      liked: [],
      disliked: []
    }
  ]);

  const logado = ref(JSON.parse(localStorage.getItem("logado")) || false);
  const currentUser = ref(JSON.parse(localStorage.getItem("currentUser")) || null);
  const authView = ref("login");

  const saveUsers = () => localStorage.setItem("users", JSON.stringify(users.value));

  const saveAuthState = () => {
    localStorage.setItem("logado", JSON.stringify(logado.value));
    localStorage.setItem("currentUser", JSON.stringify(currentUser.value));
  };

  const saveCurrentUser = () => {
    if (!currentUser.value) return;
    const index = users.value.findIndex(u => u.id === currentUser.value.id);
    if (index !== -1) {
      users.value[index] = currentUser.value;
    } else {
      users.value.push(currentUser.value);
    }
    saveUsers();
    saveAuthState();
  };

  watch(currentUser, saveCurrentUser, { deep: true });
  watch(logado, saveAuthState);

  function login(email, password) {
    const foundUser = users.value.find(u => u.email === email && u.password === password);
    if (foundUser) {
      currentUser.value = { ...foundUser }; 
      logado.value = true;
      saveAuthState();
      return true;
    }
    logado.value = false;
    currentUser.value = null;
    saveAuthState();
    return false;
  }

  function register(name, email, password) {
    const exists = users.value.some(u => u.email === email);
    if (exists) return false;

    const newUser = {
      id: users.value.length + 1,
      name,
      email,
      password,
      cpf: "",
      dataNascimento: "",
      photo: null,
      myList: [],
      liked: [],
      disliked: []
    };

    users.value.push(newUser);
    saveUsers();
    return true;
  }

  function logout() {
    logado.value = false;
    currentUser.value = null;
    saveAuthState();
    router.push("/login");
  }

  return {
    users,
    currentUser,
    logado,
    authView,
    login,
    register,
    logout,
    saveUsers
  };
});
