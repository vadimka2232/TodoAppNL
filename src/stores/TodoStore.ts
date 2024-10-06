import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTodosStore = defineStore('todosStore', () => {
  const todos = ref([]); // Список задач
  const todosCount = ref(0); // Количество страниц

  // Функция для получения задач с API
  async function fetchTodos() {
    try {
      let response = await fetch('https://dummyjson.com/todos?limit=150');
      let data = await response.json();
      todos.value = data.todos;
      todosCount.value = Math.ceil(data.todos.length / 15); // Обновляем количество страниц
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }

  // Установка страницы задач
  function setTodosPage(actualTodo: any) {
    todosCount.value = Math.ceil(actualTodo?.length / 15);
  }

  // Удаление задачи по id
  function removeTodo(id: number) {
    todos.value = todos.value.filter(todo => todo.id !== id);
  }

  // Добавление новой задачи с автоинкрементом ID
  function addTodo(newTodo: any) {
    // Найдем максимальный текущий ID среди существующих задач
    const maxId = Math.max(...todos.value.map(todo => todo.id), 0); // Если массив пуст, берем 0
    const nextId = maxId + 1; // Следующий ID

    // Добавляем новую задачу с автоинкрементным ID
    const todoToAdd = {
      ...newTodo,
      id: nextId, // Устанавливаем новый ID
    };

    todos.value.push(todoToAdd); // Добавляем новую задачу в конец массива
    todosCount.value = Math.ceil(todos.value.length / 15); // Обновляем количество страниц
  }

  // Обновление состояния выполнения задачи
  function updateTodoCompletion(id: number, completed: boolean) {
    const todo = todos.value.find(todo => todo.id === id); // Находим задачу по ID
    if (todo) {
      todo.completed = completed; // Обновляем состояние выполнения
    }
  }

  return {
    setTodosPage,
    todos,
    todosCount,
    fetchTodos,
    removeTodo,
    addTodo,
    updateTodoCompletion, // Экспортируем метод для обновления состояния выполнения
  };
});
