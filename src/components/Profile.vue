<template>
  <div class="profiles-container">
    <button class="add-profile-button" @click="showForm = !showForm">
      {{ showForm ? 'Отменить добавление' : 'Добавить профиль' }}
    </button>

    <div v-if="showForm" class="add-profile-form">
      <label>Имя: <input v-model="newProfile.name" type="text" placeholder="Введите имя" /></label>
      <label>Возраст: <input v-model="newProfile.age" type="number" placeholder="Введите возраст" /></label>
      <label>Почта: <input v-model="newProfile.email" type="email" placeholder="Введите почту" /></label>
      <label>Место проживания: <input v-model="newProfile.location" type="text" placeholder="Введите место проживания" /></label>
      <button class="save-button" @click="addProfile">Сохранить профиль</button>
    </div>

    <ul class="profile-list">
      <li v-for="profile in paginatedProfiles" :key="profile.userId" :class="['profile-item', { 'selected-profile': profile.userId === usedProfile?.userId }]">
        <div class="profile-info">
          <strong class="profile-name">Name:</strong> {{ profile.name }}
        </div>
        <button class="select-button" @click="emitSelectProfile(profile)">Выбрать профиль</button>
      </li>
    </ul>

    <Pagination
      :totalPages="totalPages"
      :currentPage="currentPage"
      @update:currentPage="changePage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useProfileStore } from '../stores/ProfilesStore';
import Pagination from './Pagination.vue'; // Импортируем компонент пагинации

const emit = defineEmits(['selectProfile']);

const profileStore = useProfileStore();

const profiles = computed(() => profileStore.profiles);
const usedProfile = computed(() => profileStore.userProfile);

// Локальное состояние для управления формой и пагинацией
const showForm = ref(false);
const newProfile = ref({
  name: '',
  age: 0,
  email: '',
  location: ''
});
const currentPage = ref(1);
const itemsPerPage = 5; // Количество профилей на странице

// Вычисляем общее количество страниц
const totalPages = computed(() => Math.ceil(profiles.value.length / itemsPerPage));

// Вычисляем профили для отображения на текущей странице
const paginatedProfiles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return profiles.value.slice(start, start + itemsPerPage);
});

// Метод для обработки клика на профиль
const emitSelectProfile = (profile: any) => {
  profileStore.setUserProfile(profile);
  emit('selectProfile', profile);
};

// Метод для добавления нового профиля
const addProfile = () => {
  if (newProfile.value.name && newProfile.value.age && newProfile.value.email && newProfile.value.location) {
    profileStore.addUserProfile({
      ...newProfile.value,
      userId: Date.now() // Генерируем уникальный ID для профиля
    });
    showForm.value = false; // Закрываем форму после добавления
    newProfile.value = { name: '', age: 0, email: '', location: '' }; // Сбрасываем поля формы
  } else {
    alert('Пожалуйста, заполните все поля!');
  }
};

// Изменение страницы
const changePage = (page: number) => {
  currentPage.value = page;
};

onMounted(async () => {
  if (!profiles.value.length) {
    await profileStore.fetchProfiles();
  }
});
</script>

<style scoped>
.profiles-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0px;
}

.add-profile-button {
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  margin-bottom: 20px;
  cursor: pointer;
  font-size: 1rem;
}

.add-profile-button:hover {
  background-color: #2ecc71;
}

.add-profile-form {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.add-profile-form label {
  margin-bottom: 10px;
}

.add-profile-form input {
  padding: 5px;
  margin-left: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.save-button {
  align-self: flex-start;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 10px;
}

.save-button:hover {
  background-color: #2980b9;
}

/* Восстановленные стили для кнопки "Выбрать профиль" */
.select-button {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.9rem;
}

.select-button:hover {
  background-color: #2980b9;
}

.select-button:active {
  background-color: #1c6ea4;
}

/* Остальные стили для списка профилей */
.profile-list {
  width: 100%;
  list-style-type: none;
  padding: 0;
}

.profile-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.profile-item:not(:last-child) {
  margin-bottom: 15px;
}

.profile-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.selected-profile {
  background-color: #d6eaf8;
  border: 2px solid #3498db;
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}
</style>
