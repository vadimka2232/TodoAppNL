<template>
  <div class="table">
    <table border="1">
      <thead>
        <tr class="table-title">
          <th class="col-id">ID</th>
          <th class="col-todo">Todo</th>
          <th class="col-completed">Completed</th>
          <th class="col-actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in props.todos" :key="item.id" class="tr-item">
          <td class="tr-id">{{ item.id }}</td>
          <td class="tr-todo">{{ item.todo }}</td>
          <td class="tr-completed">
            <input 
              type="checkbox" 
              :checked="item.completed" 
              @change="toggleCompletion(item.id, !item.completed)"
            >
          </td>
          <td>
            <button @click="deleteTodo(item.id)" class="delete-button">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
// Импортируем необходимые функции из Vue
import { defineProps, defineEmits, onMounted } from 'vue';
import { useTodosStore } from '../stores/TodoStore';

// Описание интерфейса для задачи
const emit = defineEmits(['deleteTodo']);
const todosStore  = useTodosStore();

// Объявляем props для компонента
const props = defineProps<{
  todos: any[]; // Принимаем массив объектов Todo
  countPages: number; // Указываем тип для countPages
}>();

const toggleCompletion = (id: number, completed: boolean) => {
  todosStore.updateTodoCompletion(id, completed); // Обновляем состояние в store
};

// Функция для удаления задачи
const deleteTodo = (id: number) => {
  emit('deleteTodo', id); // Передаем id задачи в событие
};

// Устанавливаем текущую страницу задач в store при монтировании
onMounted(async () => {
  todosStore.setTodosPage(props.todos);
});
</script>

<style scoped>
.table {
  margin: 20px;
  border-collapse: collapse; /* Убираем двойные границы */
  width: 100%; /* Задаем ширину таблицы */
}

.table-title th {
  border-bottom: 2px solid black; /* Толстая черная линия под заголовками */
  padding: 10px; /* Отступ для заголовков */
  text-align: left; /* Выравнивание текста в заголовках */
}

.col-id {
  width: 50px; /* Фиксированная ширина для столбца ID */
}

.col-todo {
  width: 350px; /* Фиксированная ширина для столбца Todo */
}

.col-completed {
  width: 100px; /* Фиксированная ширина для столбца Completed */
}

.col-actions {
  width: 100px; /* Фиксированная ширина для столбца Actions */
}

.tr-item {
  text-align: left;
  background-color: #f5f5f5; /* Серый фон для строк */
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
