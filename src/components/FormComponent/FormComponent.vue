<template>
  <div v-if="showForm" class="profiles__form">
    <div v-for="(field, index) in props.formFields" :key="index">
      <label class="profiles__label">{{ field.label }}: 
        <input 
          v-model="formValues[field.model]" 
          :type="field.type" 
          :placeholder="field.placeholder" 
          class="profiles__input" 
        />
      </label>
    </div>
    <button class="profiles__button-save" @click="submitForm">Сохранить</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useProfileStore } from '../../stores/ProfilesStore';
import type { Profile } from '../../contracts/profiles';
import type { NewTodo } from '../../contracts/todos';

const emit = defineEmits<{ (e: 'selectProfile', profile: Profile): void } | { (e: 'addTodo', todo: NewTodo): void }>();

const profileStore = useProfileStore();

const showForm = ref(true);
const formValues = ref<{ [key: string]: any }>({}); // Используем динамический объект для значений

// Пропс для передачи массива объектов
const props = defineProps<{
  formFields: Array<{ label: string; model: string; type: string; placeholder: string }>
}>();

// Функция для обработки отправки формы
const submitForm = () => {
  // Проверяем, заполнены ли все поля
  const allFieldsFilled = props.formFields.every(field => formValues.value[field.model]);

  if (allFieldsFilled) {
    if (props.formFields[0].model === 'todo') {
      emit('addTodo', { ...formValues.value });
    } else {
      profileStore.addUserProfile({ ...formValues.value });
      const lastAddedProfile = profileStore.profiles[profileStore.profiles.length - 1]; 
      emit('selectProfile', lastAddedProfile); 
    }

    showForm.value = false;
    formValues.value = {}; // Сбрасываем значения
  } else {
    alert('Пожалуйста, заполните все поля!');
  }
};
</script>

<style scoped>
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
</style>
