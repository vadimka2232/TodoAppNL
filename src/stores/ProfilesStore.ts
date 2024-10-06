import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProfileStore = defineStore('profileStore', () => {
  const profiles = ref([]);
  const userProfile = ref();

  // Асинхронная функция для загрузки профилей
  async function fetchProfiles() {
    try {
      const response = await fetch('/profilesApi/profiles.json');
      const data = await response.json();
      profiles.value = data;

      // Если профиль не выбран, выбрать первый по умолчанию
      if (!userProfile.value) {
        userProfile.value = profiles.value[0];
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  }

  // Функция для установки выбранного профиля
  function setUserProfile(profile: any) {
    userProfile.value = profile;
  }

  // Функция для добавления нового профиля
  function addUserProfile(newProfile: any) {
    const profileWithId = {
      ...newProfile,
      userId: Date.now(), // Генерируем уникальный ID для нового профиля
    };
    profiles.value.push(profileWithId); // Добавляем новый профиль в массив
  }

  return {
    setUserProfile,
    userProfile,
    profiles,
    fetchProfiles,
    addUserProfile, // Экспортируем функцию добавления
  };
});
