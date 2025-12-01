import { defineStore } from "pinia";
import { ref } from "vue";
import router from "@/router";

export const useAuthStore = defineStore("authStore", () => {

  function sanitizeCPF(cpf) {
    return (cpf || "").replace(/\D/g, "").slice(0, 11);
  }

  function formatCPF(cpf) {
    const v = sanitizeCPF(cpf);
    if (v.length <= 3) return v;
    if (v.length <= 6) return `${v.slice(0, 3)}.${v.slice(3)}`;
    if (v.length <= 9) return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
    return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`;
  }

  const users = ref(
    JSON.parse(localStorage.getItem("users")) || [
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
        disliked: [],
      },
    ]
  );

  const logado = ref(JSON.parse(localStorage.getItem("logado")) || false);
  const currentUser = ref(JSON.parse(localStorage.getItem("currentUser")) || null);
  const authView = ref("login");

  const saveUsers = () =>
    localStorage.setItem("users", JSON.stringify(users.value));

  const saveAuthState = () => {
    localStorage.setItem("logado", JSON.stringify(logado.value));
    localStorage.setItem("currentUser", JSON.stringify(currentUser.value));
  };

  const saveCurrentUser = () => {
    if (!currentUser.value) return;

    const i = users.value.findIndex(u => u.id === currentUser.value.id);
    if (i !== -1) users.value[i] = { ...currentUser.value };

    saveUsers();
    saveAuthState();
  };

  function updateCPF(value) {
    if (!currentUser.value) return;
    const cleaned = sanitizeCPF(value);
    currentUser.value.cpf = formatCPF(cleaned);
    saveCurrentUser();
  }

  function updateUserPhoto(photo) {
    if (!currentUser.value) return;
    currentUser.value.photo = photo;
    saveCurrentUser();
  }

  function login(email, password) {
    const found = users.value.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      currentUser.value = null;
      logado.value = false;
      saveAuthState();
      return false;
    }

    currentUser.value = { ...found };
    logado.value = true;
    saveAuthState();
    return true;
  }

  function register(name, email, password) {
    const exists = users.value.some((u) => u.email === email);
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
      disliked: [],
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

    saveUsers,
    saveCurrentUser,

    updateCPF,
    updateUserPhoto,
  };
});
