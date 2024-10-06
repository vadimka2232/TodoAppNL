<template>
  <div>
    <!-- Форма для добавления новой задачи -->
    <button class="add-todo-button" @click="showForm = !showForm">
      {{ showForm ? 'Отменить добавление' : 'Добавить задачу' }}
    </button>

    <div v-if="showForm" class="add-todo-form">
      <label>
        Задача:
        <input v-model="newTodo.todo" type="text" placeholder="Введите задачу" />
      </label>
      <button class="save-button" @click="addTodo">Сохранить задачу</button>
    </div>

    <!-- Таблица задач с пагинацией -->
    <TodoTable :todos="paginatedTodos" :countPages="totalPages" @deleteTodo="deleteTodo" />
    
    <!-- Элементы управления пагинацией -->
    <Pagination 
      :totalPages="totalPages" 
      :currentPage="currentPage" 
      @update:currentPage="setPage" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import TodoTable from './TodoTable.vue';
import { useTodosStore } from '../stores/TodoStore';
import { useProfileStore } from '../stores/ProfilesStore';
import Pagination from './Pagination.vue'; // Импортируем компонент пагинации

const todosStore = useTodosStore();
const profileStore = useProfileStore();

const usedProfile = computed(() => profileStore.userProfile);
const filteredTodos = computed(() => {
  if (!usedProfile.value) return todosStore.todos;
  
  return todosStore.todos.filter(todo => todo.userId === usedProfile.value.userId);
});

// Пагинация
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

// Локальное состояние для управления формой и новой задачей
const showForm = ref(false);
const newTodo = ref({
  todo: '',
  completed: false,
  userId: usedProfile.value?.userId || 0,
});

// Метод для удаления задачи
function deleteTodo(id: number) {
  todosStore.removeTodo(id);
}

// Метод для добавления новой задачи
function addTodo() {
  if (newTodo.value.todo) {
    todosStore.addTodo({
      ...newTodo.value,
      userId: usedProfile.value?.userId || 0,
    });

    // Сбрасываем форму и скрываем её после добавления задачи
    newTodo.value = { todo: '', completed: false, userId: usedProfile.value?.userId || 0 };
    showForm.value = false;

    // Сбросить текущую страницу к первой после добавления новой задачи
    currentPage.value = 1;
  } else {
    alert('Пожалуйста, заполните задачу!');
  }
}

// Метод для установки текущей страницы
function setPage(page: number) {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

// Получаем данные при монтировании компонента
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
.add-todo-button {
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  margin: 20px 0;
  cursor: pointer;
  font-size: 1rem;
}

.add-todo-button:hover {
  background-color: #2ecc71;
}

.add-todo-form {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.add-todo-form label {
  margin-bottom: 10px;
}

.add-todo-form input {
  padding: 5px;
  margin-left: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.save-button {
  align-self: flex-start;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 10px;
}

.save-button:hover {
  background-color: #2980b9;
}
</style>
