<template>
  <div class="Table">
    <table border="1">
      <thead>
        <tr class="Table_title">
          <th>ID</th>
          <th>Todo</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in props.todos" :key="item.id" class="tr-item">
          <td class="tr-id">{{ item.id }}</td>
          <td>{{ item.todo }}</td>
          <td>
            <button @click="deleteTodo(item.id)" class="delete-button">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :todos="props.todos" :pagesCount="pagesCount"/>
  </div>
</template>

<script setup lang="ts">
// Импортируем необходимые функции из Vue
import { computed, defineProps, onMounted } from 'vue';
import Pagination from './Pagination.vue';
import { useTodosStore } from '../stores/TodoStore';

// Описание интерфейса для задачи
const emit = defineEmits(['deleteTodo'])
const todosStore  = useTodosStore();
const pagesCount = computed(() => todosStore.todosCount);

// Объявляем props для компонента
const props = defineProps<{
  todos: any[]; // Принимаем массив объектов Todo
}>();

// Функция для удаления задачи
const deleteTodo = (id: number) => {
  emit('deleteTodo', id); // Передаем id задачи в событие
};

onMounted(async () => {
  todosStore.setTodosPage(props.todos);
});
</script>

<style scoped>
.Table {
  margin: 20px;
  border-collapse: collapse; /* Убираем двойные границы */
}

.Table_title th {
  border-bottom: 2px solid black; /* Толстая черная линия под заголовками */
  padding: 10px; /* Отступ для заголовков */
}

.tr-item {
  text-align: left;
  background-color: #f5f5f5; /* Серый фон для строк */
  margin-bottom: 10px; /* Отступ между строками (но работает только с margin) */
}

.tr-item:nth-child(odd) {
  background-color: #e0e0e0; /* Чередование серого фона для четных и нечетных строк */
}

.tr-item td {
  padding: 10px; /* Отступ для ячеек */
}

.delete-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c0392b;
}
</style>
