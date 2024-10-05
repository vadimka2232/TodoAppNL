<template>
  <div>
    <TodoTable :todos="todos" @deleteTodo="deleteTodo"/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import TodoTable from './TodoTable.vue';
import { useTodosStore } from '../stores/TodoStore';

// Массив задач с типизацией
const todosStore = useTodosStore();
const todos = computed(() => todosStore.todos)
// console.log(todos.value);
// Функция для удаления задачи
function deleteTodo(id: number) {
  console.log('Удалить задачу с ID:', id);
  todosStore.removeTodo(id); // Предположим, что в хранилище есть метод removeTodo
}
onMounted(async () => {
  if(!todos.value.length){
    todosStore.fetchTodos();
  }
});
</script>
