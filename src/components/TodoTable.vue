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
import { defineProps, defineEmits, onMounted } from 'vue';
import { useTodosStore } from '../stores/TodoStore';
import type { Todo } from '../contracts/todos';

const emit = defineEmits<{
  (e: 'deleteTodo', id: number): void; 
}>();

const todosStore = useTodosStore();


const props = defineProps<{
  todos: Todo[]; 
  countPages: number; 
}>();

const toggleCompletion = (id: number, completed: boolean) => {
  todosStore.updateTodoCompletion(id, completed); 
};


const deleteTodo = (id: number) => {
  emit('deleteTodo', id); 
};


onMounted(async () => {
  todosStore.setTodosPage(props.todos);
});
</script>

<style scoped>
.table {
  margin: 20px;
  border-collapse: collapse;
  width: 100%;
}

.table-title th {
  border-bottom: 2px solid black;
  padding: 10px;
  text-align: left;
}

.col-id {
  width: 50px;
}

.col-todo {
  width: 350px;
}

.col-completed {
  width: 100px;
}

.col-actions {
  width: 100px;
}

.tr-item {
  text-align: left;
  background-color: #f5f5f5; 
}

.tr-item:nth-child(odd) {
  background-color: #e0e0e0; 
}

.tr-item td {
  padding: 10px;
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
