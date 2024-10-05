// store.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTodosStore = defineStore('todosStore',() => {
  const todos = ref([]);
  const todosCount = ref(0);
  async function fetchTodos() {
    try {
        let response = await fetch('https://dummyjson.com/todos?limit=150');
        let data = await response.json();
        todos.value = data.todos;
        todosCount.value = data.todos.length / 15;
        
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
  }
  function setTodosPage(actualTodo:any) {    
    todosCount.value = Math.ceil(actualTodo.length / 15);
  }
  function removeTodo(id: number) {
    console.log(todos.value);
    todos.value = todos.value.filter(todo => todo.id !== id); // Удаляем задачу с соответствующим id
    todosCount.value = Math.ceil(todos.value.length / 15); // Обновляем количество страниц
  }
  return {
    setTodosPage,
    todos,
    todosCount,
    fetchTodos,
    removeTodo,
  };
});