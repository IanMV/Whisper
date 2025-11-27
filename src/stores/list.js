import { useAuthStore } from "./auth";

const findIndex = (arr, id, type) => arr.findIndex(i => i.id === id && i.type === type);

export const saveUserData = (user) => {
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];
  const index = allUsers.findIndex(u => u.id === user.id);
  if (index !== -1) allUsers[index] = user;
  else allUsers.push(user);
  localStorage.setItem("users", JSON.stringify(allUsers));

  const authStore = useAuthStore();
  authStore.currentUser = user;
};

export const toggleList = (id, type = "movie") => {
  const authStore = useAuthStore();
  const user = authStore.currentUser;
  if (!user) return;

  if (!user.myList) user.myList = [];
  const index = findIndex(user.myList, id, type);
  if (index === -1) user.myList.push({ id, type });
  else user.myList.splice(index, 1);

  saveUserData(user);
};

export const like = (id, type = "movie") => {
  const authStore = useAuthStore();
  const user = authStore.currentUser;
  if (!user) return;

  if (!user.liked) user.liked = [];
  if (!user.disliked) user.disliked = [];

  if (findIndex(user.liked, id, type) === -1) user.liked.push({ id, type });
  user.disliked = user.disliked.filter(i => !(i.id === id && i.type === type));

  saveUserData(user);
};

export const dislike = (id, type = "movie") => {
  const authStore = useAuthStore();
  const user = authStore.currentUser;
  if (!user) return;

  if (!user.disliked) user.disliked = [];
  if (!user.liked) user.liked = [];

  if (findIndex(user.disliked, id, type) === -1) user.disliked.push({ id, type });
  user.liked = user.liked.filter(i => !(i.id === id && i.type === type));

  saveUserData(user);
};
