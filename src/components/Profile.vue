<template>
  <div class="profiles">
    <button class="profiles__button-add" @click="showForm = !showForm">
      {{ showForm ? 'Отменить добавление' : 'Добавить профиль' }}
    </button>

    <FormComponent v-if="showForm" @selectProfile="emitSelectProfile" :formFields="formFields"/>

    <ul class="profiles__list">
      <li 
        v-for="profile in paginatedProfiles" 
        :key="profile.userId" 
        :class="['profiles__item', { 'profiles__item--selected': profile.userId === usedProfile?.userId }]">
        <div class="profiles__info">
          <strong class="profiles__name">Name:</strong> {{ profile.name }}
        </div>
        <button class="profiles__button-select" @click="emitSelectProfile(profile)">Выбрать профиль</button>
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
import Pagination from './Pagination.vue';
import FormComponent from './FormComponent/FormComponent.vue'; 
import type { Profile } from '../contracts/profiles';

const emit = defineEmits<{ (e: 'selectProfile', profile: Profile): void }>(); 

const profileStore = useProfileStore();

const profiles = computed(() => profileStore.profiles); 
const usedProfile = computed(() => profileStore.usedProfile); 

const showForm = ref(false);

const currentPage = ref(1);
const itemsPerPage = 5;

const totalPages = computed(() => Math.ceil(profiles.value.length / itemsPerPage));

const paginatedProfiles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return profiles.value.slice(start, start + itemsPerPage);
});

const emitSelectProfile = (profile: Profile) => {
  showForm.value = false; 
  profileStore.setUserProfile(profile); // Устанавливаем выбранный профиль в store
  emit('selectProfile', profile); // Эмитим событие в родительский компонент
};

const changePage = (page: number) => {
  currentPage.value = page;
};

onMounted(async () => {
  if (!profiles.value.length) {
    await profileStore.fetchProfiles();
  }
});

// Метод для добавления профиля в store
const handleAddProfile = (profile: Profile) => {
  profileStore.addUserProfile(profile); // Добавляем новый профиль в store
};
const formFields = [
  { label: 'Имя', model: 'name', type: 'text', placeholder: 'Введите имя' },
  { label: 'Возраст', model: 'age', type: 'number', placeholder: 'Введите возраст' },
  { label: 'Почта', model: 'email', type: 'email', placeholder: 'Введите почту' },
  { label: 'Место проживания', model: 'location', type: 'text', placeholder: 'Введите место проживания' },
];
</script>

<style scoped>
.profiles {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0px;
}

.profiles__button-add {
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  margin-bottom: 20px;
  cursor: pointer;
  font-size: 1rem;
}

.profiles__button-add:hover {
  background-color: #2ecc71;
}

.profiles__list {
  width: 100%;
  list-style-type: none;
  padding: 0;
}

.profiles__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.profiles__item:not(:last-child) {
  margin-bottom: 15px;
}

.profiles__item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.profiles__item--selected {
  background-color: #d6eaf8;
  border: 2px solid #3498db;
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.profiles__button-select {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.9rem;
}

.profiles__button-select:hover {
  background-color: #2980b9;
}

.profiles__button-select:active {
  background-color: #1c6ea4;
}
</style>
