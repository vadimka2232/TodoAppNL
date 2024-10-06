<template>
  <div class="todo">
    <div class="todo__button-container">
      <button class="todo__button-add" @click="showForm = !showForm">
        {{ showForm ? 'Отменить добавление' : 'Добавить задачу' }}
      </button>
    </div>

    <div v-if="showForm" class="todo__form">
      <label class="todo__label">
        Задача:
        <input v-model="newTodo.todo" type="text" placeholder="Введите задачу" class="todo__input" />
      </label>
      <button class="todo__button-save" @click="addTodo">Сохранить задачу</button>
    </div>

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
import Pagination from './Pagination.vue';
import TodoTable from './TodoTable.vue';
import { useTodosStore } from '../stores/TodoStore';
import { useProfileStore } from '../stores/ProfilesStore';
import type { NewTodo } from '../contracts/types'; 
import type { Profile } from '../contracts/types'; 

const todosStore = useTodosStore();
const profileStore = useProfileStore(); // Инициализация стейтов

const usedProfile = computed<Profile | null>(() => profileStore.usedProfile); // Забрать выбранный профиль
const filteredTodos = computed(() => {
  if (!usedProfile.value) return todosStore.todos;
  return todosStore.todos.filter((todo) => todo.userId === usedProfile.value.userId);
}); // Отфильтровать по профилю задачи

const currentPage = ref(1);
const itemsPerPage = 15;

const totalPages = computed(() => {
  return Math.ceil(filteredTodos.value.length / itemsPerPage);
}); // Высчитать количество страниц

const paginatedTodos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTodos.value.slice(start, end);
}); // Функция для пересчитывания пагинации

const showForm = ref(false);
const newTodo = ref<NewTodo>({
  todo: '',
  completed: false,
  userId: usedProfile.value?.userId || 0,
});

function deleteTodo(id: number) {
  todosStore.removeTodo(id);
} // Функция удаления задачи

function addTodo() {
  if (newTodo.value.todo) {
    todosStore.addTodo({
      ...newTodo.value,
      userId: usedProfile.value?.userId || 0,
    });

    newTodo.value = { todo: '', completed: false, userId: usedProfile.value?.userId || 0 };
    showForm.value = false;
    currentPage.value = 1;
  } else {
    alert('Пожалуйста, заполните задачу!');
  }
} // Функция добавления задачи

function setPage(page: number) {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
} // Назначить в ref переменную выбранную страницу

onMounted(async () => {
  if (!todosStore.todos.length) {
    await todosStore.fetchTodos();
  } // Забрать все задачи

  if (!usedProfile.value) {
    await profileStore.fetchProfiles();
  } // Забрать все профиля
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
