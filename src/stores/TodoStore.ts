import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Todo, TodoResponse } from '../contracts/types';

export const useTodosStore = defineStore('todosStore', () => {
  const todos = ref<Todo[]>([]);
  const todosCount = ref(0);

  async function fetchTodos() {
    try {
      const response = await fetch('https://dummyjson.com/todos?limit=150');
      const data: TodoResponse = await response.json();
      todos.value = data.todos;
      todosCount.value = Math.ceil(data.todos.length / 15);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }

  function setTodosPage(actualTodo: Todo[]) {
    todosCount.value = Math.ceil(actualTodo?.length / 15);
  }

  function removeTodo(id: number) {
    todos.value = todos.value.filter(todo => todo.id !== id);
  }

  function addTodo(newTodo: Omit<Todo, 'id'>) {
    const maxId = Math.max(...todos.value.map(todo => todo.id), 0);
    const nextId = maxId + 1;

    const todoToAdd: Todo = {
      ...newTodo,
      id: nextId,
    };

    todos.value.push(todoToAdd);
    todosCount.value = Math.ceil(todos.value.length / 15);
  }

  function updateTodoCompletion(id: number, completed: boolean) {
    const todo = todos.value.find(todo => todo.id === id);
    if (todo) {
      todo.completed = completed;
    }
  }

  return {
    setTodosPage,
    todos,
    todosCount,
    fetchTodos,
    removeTodo,
    addTodo,
    updateTodoCompletion,
  };
});
