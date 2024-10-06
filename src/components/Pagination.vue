<template>
    <div class="pagination-controls">
      <button 
        v-for="page in totalPages" 
        :key="page" 
        @click="setPage(page)" 
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps<{
    totalPages: number;
    currentPage: number;
  }>();
  
  const emit = defineEmits();
  
  function setPage(page: number) {
    // Вызов события для установки страницы
    emit('update:currentPage', page);
  }
  </script>
  
  <style scoped>
  .pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  
  .pagination-controls button {
    margin: 0 5px;
    padding: 8px 12px; /* Добавляем небольшой отступ */
    background-color: #f0f0f0; /* Светлый фон для кнопок */
    color: #333; /* Темный текст */
    border: none;
    border-radius: 4px; /* Округленные углы */
    cursor: pointer;
    transition: background-color 0.3s; /* Плавный переход при наведении */
  }
  
  .pagination-controls button.active {
    background-color: #e74c3c; /* Цвет для активной страницы */
    color: white; /* Белый текст для активной страницы */
  }
  
  .pagination-controls button:hover {
    background-color: #e0e0e0; /* Светло-серый фон при наведении */
  }
  </style>
  