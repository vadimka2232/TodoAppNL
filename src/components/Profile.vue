<template>
  <div class="profiles-container">
    <ul class="profile-list">
      <li
        v-for="profile in profiles"
        :key="profile.userId"
        :class="['profile-item', { 'selected-profile': profile.userId === usedProfile?.userId }]"
      >
        <div class="profile-info">
          <strong class="profile-name">Name:</strong> {{ profile.name }}
        </div>
        <button class="select-button" @click="emitSelectProfile(profile)">Выбрать профиль</button>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed  } from 'vue';
import { useProfileStore } from '../stores/ProfilesStore';

// Определяем emit с помощью defineEmits
const emit = defineEmits(['selectProfile']); // Ожидаемое событие

const profileStore = useProfileStore();
const profiles = computed(() => profileStore.profiles);
const usedProfile = computed(() => profileStore.userProfile);

// Метод для обработки клика на профиль
const emitSelectProfile = (profile: any) => {
  profileStore.setUserProfile(profile); // Устанавливаем выбранный профиль в store
  emit('selectProfile', profile); // Вызываем emit и передаем выбранный профиль как аргумент
  // console.log(usedProfile.value)
};

onMounted(async () => {
  await profileStore.fetchProfiles();
});

</script>

<style scoped>
.profiles-container {
  display: flex;
  justify-content: center;
  padding: 20px 0px;
}

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

.profile-name {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.2rem;
}

.select-button {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.9rem; /* Чуть меньше размер текста на кнопке */
}

.select-button:hover {
  background-color: #2980b9;
}

.select-button:active {
  background-color: #1c6ea4;
}
.selected-profile {
  background-color: #d6eaf8; /* Светло-голубой фон для выделенного профиля */
  border: 2px solid #3498db; /* Синяя рамка вокруг выбранного профиля */
  transform: translateY(-5px); /* Немного поднимаем элемент для выделения */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Более яркая тень для создания эффекта */
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease; /* Плавный переход для всех изменений */
}
</style>
