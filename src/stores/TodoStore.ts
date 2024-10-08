import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Todo, TodoResponse } from '../contracts/todos';

export const useTodosStore = defineStore('todosStore', () => {
  const todos = ref<Todo[]>([]);
  const todosCount = ref(0);

  // Загрузка задач из localStorage
  function loadTodosFromLocalStorage() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      todos.value = JSON.parse(storedTodos);
      todosCount.value = Math.ceil(todos.value.length / 15); // Обновляем количество задач
    }
  }

  // Сохранение задач в localStorage
  function saveTodosToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos.value));
  }

  async function fetchTodos() {
    try {
      const response = await fetch('https://dummyjson.com/todos?limit=150');
      const data: TodoResponse = await response.json();
      todos.value = data.todos;
      todosCount.value = Math.ceil(data.todos.length / 15);
      saveTodosToLocalStorage(); // Сохраняем данные после загрузки из API
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }

  function setTodosPage(actualTodo: Todo[]) {
    todosCount.value = Math.ceil(actualTodo?.length / 15);
  }

  function removeTodo(id: number) {
    todos.value = todos.value.filter(todo => todo.id !== id);
    saveTodosToLocalStorage(); // Сохраняем после удаления
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
    saveTodosToLocalStorage(); // Сохраняем после добавления
  }

  function updateTodoCompletion(id: number, completed: boolean) {
    const todo = todos.value.find(todo => todo.id === id);
    if (todo) {
      todo.completed = completed;
      saveTodosToLocalStorage(); // Сохраняем после обновления
    }
  }

  // Слушаем изменения задач и сохраняем их в localStorage
  watch(todos, saveTodosToLocalStorage);

  // Инициализация - загрузка задач из localStorage
  loadTodosFromLocalStorage();

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
