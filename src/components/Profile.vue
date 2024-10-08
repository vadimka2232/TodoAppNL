<template>
  <div class="profiles">
    <button class="profiles__button-add" @click="showForm = !showForm">
      {{ showForm ? 'Отменить добавление' : 'Добавить профиль' }}
    </button>

    <FormComponent v-if="showForm" @selectProfile="emitSelectProfile" :formFields="formFields"/>

    <ProfilesList 
      :profiles="profiles" 
      :usedProfile="usedProfile" 
      :currentPage="currentPage" 
      :itemsPerPage="itemsPerPage" 
      @selectProfile="emitSelectProfile" 
    />

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
import Pagination from './PaginationComponent/Pagination.vue';
import FormComponent from './FormComponent/FormComponent.vue'; 
import ProfilesList from './ProfilesComponent/ProfilesList.vue'; // Импортируем новый компонент
import type { Profile } from '../contracts/profiles';

const emit = defineEmits<{ (e: 'selectProfile', profile: Profile): void }>(); 

const profileStore = useProfileStore();

const profiles = computed(() => profileStore.profiles); 
const usedProfile = computed(() => profileStore.usedProfile); 

const showForm = ref(false);

const currentPage = ref(1);
const itemsPerPage = 5;

const totalPages = computed(() => Math.ceil(profiles.value.length / itemsPerPage));

const emitSelectProfile = (profile: Profile) => {
  showForm.value = false; 
  profileStore.setUserProfile(profile); 
  emit('selectProfile', profile); 
};

const changePage = (page: number) => {
  currentPage.value = page;
};

onMounted(async () => {
  if (!profiles.value.length) {
    await profileStore.fetchProfiles();
  }
});

// Определяем поля для формы
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
</style>
