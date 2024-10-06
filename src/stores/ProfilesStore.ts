import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Profile } from '../contracts/types'; // Используем import type

export const useProfileStore = defineStore('profileStore', () => {
  const profiles = ref<Profile[]>([]);
  const usedProfile = ref<Profile | null>(null);
  const nextId = ref(1);

  async function fetchProfiles() {
    try {
      const response = await fetch('/profilesApi/profiles.json');
      const data = await response.json();
      profiles.value = data;

      if (!usedProfile.value) {
        usedProfile.value = profiles.value[0];
      }

      nextId.value = profiles.value.length ? Math.max(...profiles.value.map(p => p.userId)) + 1 : 1;
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  }

  function setUserProfile(profile: Profile) {
    usedProfile.value = profile;
  }

  function addUserProfile(newProfile: Omit<Profile, 'userId'>) {
    const profileWithId: Profile = {
      ...newProfile,
      userId: nextId.value,
    };
    profiles.value.push(profileWithId);
    nextId.value++;
  }

  return {
    setUserProfile,
    usedProfile,
    profiles,
    fetchProfiles,
    addUserProfile,
  };
});
