import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProfileStore = defineStore('profileStore', () => {
  const profiles = ref([]);
  const userProfile = ref();
  const nextId = ref(1);

  async function fetchProfiles() {
    try {
      const response = await fetch('/profilesApi/profiles.json');
      const data = await response.json();
      profiles.value = data;

      if (!userProfile.value) {
        userProfile.value = profiles.value[0];
      }
      
      nextId.value = profiles.value.length ? Math.max(...profiles.value.map(p => p.userId)) + 1 : 1;
    } catch (error) {
      console.error('Error fetching profiles:', error); 
    }
  }

  function setUserProfile(profile: any) {
    userProfile.value = profile;
  }

  function addUserProfile(newProfile: any) {
    const profileWithId = {
      ...newProfile,
      userId: nextId.value,
    };
    profiles.value.push(profileWithId);
    nextId.value++; 
  }

  return {
    setUserProfile,
    userProfile,
    profiles,
    fetchProfiles,
    addUserProfile,
  };
});
