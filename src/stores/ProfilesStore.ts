import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Profile } from '../contracts/profiles'; // Используем import type

export const useProfileStore = defineStore('profileStore', () => {
  const profiles = ref<Profile[]>([]);
  const usedProfile = ref<Profile | null>(null);
  const nextId = ref(1);

  // Функция для загрузки профилей из localStorage
  function loadProfilesFromLocalStorage() {
    const storedProfiles = localStorage.getItem('profiles');
    if (storedProfiles) {
      profiles.value = JSON.parse(storedProfiles);
      nextId.value = profiles.value.length ? Math.max(...profiles.value.map(p => p.userId)) + 1 : 1; // Устанавливаем следующий ID
      // Загружаем выбранный профиль из localStorage
      const storedProfile = localStorage.getItem('usedProfile');
      if (storedProfile) {
        usedProfile.value = JSON.parse(storedProfile);
      }
    }
  }

  // Функция для сохранения профилей в localStorage
  function saveProfilesToLocalStorage() {
    localStorage.setItem('profiles', JSON.stringify(profiles.value));
  }

  // Функция для сохранения выбранного профиля в localStorage
  function saveUsedProfileToLocalStorage() {
    localStorage.setItem('usedProfile', JSON.stringify(usedProfile.value));
  }

  async function fetchProfiles() {
    try {
      const response = await fetch('/profilesApi/profiles.json');
      const data = await response.json();
      profiles.value = data;

      if (!usedProfile.value) {
        usedProfile.value = profiles.value[0];
      }

      nextId.value = profiles.value.length ? Math.max(...profiles.value.map(p => p.userId)) + 1 : 1;

      // Сохраняем профили в localStorage после загрузки из API
      saveProfilesToLocalStorage();
      // Сохраняем выбранный профиль в localStorage
      saveUsedProfileToLocalStorage();
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  }

  function setUserProfile(profile: Profile) {
    usedProfile.value = profile;
    // Сохраняем выбранный профиль в localStorage
    saveUsedProfileToLocalStorage();
  }

  function addUserProfile(newProfile: Omit<Profile, 'userId'>) {
    const profileWithId: Profile = {
      ...newProfile,
      userId: nextId.value,
    };
    profiles.value.push(profileWithId);
    nextId.value++;

    // Сохраняем профили в localStorage после добавления нового профиля
    saveProfilesToLocalStorage();
  }

  // Загружаем профили из localStorage при инициализации store
  loadProfilesFromLocalStorage();

  // Если профили не загружены из localStorage, загружаем их из API
  if (profiles.value.length === 0) {
    fetchProfiles();
  }

  // Слушаем изменения в profiles и сохраняем их в localStorage
  watch(profiles, saveProfilesToLocalStorage);
  // Слушаем изменения в usedProfile и сохраняем их в localStorage
  watch(usedProfile, saveUsedProfileToLocalStorage);

  return {
    setUserProfile,
    usedProfile,
    profiles,
    fetchProfiles,
    addUserProfile,
  };
});
