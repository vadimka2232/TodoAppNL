<template>
  <div class="profiles">
    <button class="profiles__button-add" @click="showForm = !showForm">
      {{ showForm ? 'Отменить добавление' : 'Добавить профиль' }}
    </button>

    <div v-if="showForm" class="profiles__form">
      <label class="profiles__label">Имя: 
        <input v-model="newProfile.name" type="text" placeholder="Введите имя" class="profiles__input" />
      </label>
      <label class="profiles__label">Возраст: 
        <input v-model="newProfile.age" type="number" placeholder="Введите возраст" class="profiles__input" />
      </label>
      <label class="profiles__label">Почта: 
        <input v-model="newProfile.email" type="email" placeholder="Введите почту" class="profiles__input" />
      </label>
      <label class="profiles__label">Место проживания: 
        <input v-model="newProfile.location" type="text" placeholder="Введите место проживания" class="profiles__input" />
      </label>
      <button class="profiles__button-save" @click="addProfile">Сохранить профиль</button>
    </div>

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

const emit = defineEmits(['selectProfile']);

const profileStore = useProfileStore();

const profiles = computed(() => profileStore.profiles);
const usedProfile = computed(() => profileStore.userProfile);

const showForm = ref(false);
const newProfile = ref({
  name: '',
  age: 0,
  email: '',
  location: ''
});
const currentPage = ref(1);
const itemsPerPage = 5;

const totalPages = computed(() => Math.ceil(profiles.value.length / itemsPerPage));

const paginatedProfiles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return profiles.value.slice(start, start + itemsPerPage);
});

const emitSelectProfile = (profile: any) => {
  profileStore.setUserProfile(profile);
  emit('selectProfile', profile);
};

const addProfile = () => {
  if (newProfile.value.name && newProfile.value.age && newProfile.value.email && newProfile.value.location) {
    profileStore.addUserProfile({
      ...newProfile.value,
      userId: Date.now()
    });
    showForm.value = false;
    newProfile.value = { name: '', age: 0, email: '', location: '' };
  } else {
    alert('Пожалуйста, заполните все поля!');
  }
};

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

.profiles__form {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.profiles__label {
  margin-bottom: 10px;
}

.profiles__input {
  padding: 5px;
  margin-left: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.profiles__button-save {
  align-self: flex-start;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 10px;
}

.profiles__button-save:hover {
  background-color: #2980b9;
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
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
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
