<template>
  <div class="todo">
    <div class="todo__button-container">
      <button class="todo__button-add" @click="showForm = !showForm">
        {{ showForm ? 'Отменить добавление' : 'Добавить задачу' }}
      </button>
    </div>

    <FormComponent 
      v-if="showForm" 
      :formFields="formFields" 
      @addTodo="addTodo"
    />

    <TodoTable :todos="paginatedTodos" :countPages="totalPages" @deleteTodo="deleteTodo" />

    <Pagination 
      :totalPages="totalPages" 
      :currentPage="currentPage" 
      @update:currentPage="setPage" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Pagination from './PaginationComponent/Pagination.vue';
import TodoTable from './TodoTable.vue';
import FormComponent from './FormComponent/FormComponent.vue'; // Импортируем универсальную форму
import { useTodosStore } from '../stores/TodoStore';
import { useProfileStore } from '../stores/ProfilesStore';
import type { NewTodo } from '../contracts/todos';
import type { Profile } from '../contracts/profiles';

const todosStore = useTodosStore();
const profileStore = useProfileStore(); 

const usedProfile = computed<Profile | null>(() => profileStore.usedProfile);
const filteredTodos = computed(() => {
  if (!usedProfile.value) return todosStore.todos;
  return todosStore.todos.filter((todo) => todo.userId === usedProfile.value.userId);
}); 

const currentPage = ref(1);
const itemsPerPage = 15;

const totalPages = computed(() => {
  return Math.ceil(filteredTodos.value.length / itemsPerPage);
}); 

const paginatedTodos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTodos.value.slice(start, end);
}); 

const showForm = ref(false);

// Определяем поля для формы
const formFields = [
  { label: 'Задача', model: 'todo', type: 'text', placeholder: 'Введите задачу' },
];

function deleteTodo(id: number) {
  todosStore.removeTodo(id);
} 

function addTodo(newTodo: NewTodo) {
  showForm.value = false;
  if (newTodo.todo) {
    todosStore.addTodo({
      ...newTodo,
      userId: usedProfile.value?.userId || 0,
    });

    showForm.value = false;
    currentPage.value = 1;
  } else {
    alert('Пожалуйста, заполните задачу!');
  }
}

function setPage(page: number) {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
} 

onMounted(async () => {
  if (!todosStore.todos.length) {
    await todosStore.fetchTodos();
  }

  if (!usedProfile.value) {
    await profileStore.fetchProfiles();
  }
});
</script>

<style scoped>
.todo__button-container {
  width: 100%;
  text-align: center;
}
.todo__button-add {
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  margin: 20px 0;
  cursor: pointer;
  font-size: 1rem;
}

.todo__button-add:hover {
  background-color: #2ecc71;
}

.todo__form {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.todo__label {
  margin-bottom: 10px;
}

.todo__input {
  padding: 5px;
  margin-left: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.todo__button-save {
  align-self: flex-start;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 10px;
}

.todo__button-save:hover {
  background-color: #2980b9;
}
</style>
