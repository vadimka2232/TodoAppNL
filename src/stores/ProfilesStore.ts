// store.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProfileStore = defineStore('profileStore', () => {
  const profiles = ref([]);
  const userProfile = ref()
  async function fetchProfiles() {
    try {
      const response = await fetch('/profilesApi/profiles.json');
      const data = await response.json();
      profiles.value = data;

      if(!userProfile.value) {userProfile.value = profiles.value[0];} // Если не заполнен, выбрать первый профиль по умолчанию
      } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  }
  function setUserProfile(profile:any) {
    userProfile.value = profile;
  }

  return {
    setUserProfile,
    userProfile,
    profiles,
    fetchProfiles,
  };
});