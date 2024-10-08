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

const emit = defineEmits<{
  (event: 'update:currentPage', page: number): void;
}>();

function setPage(page: number) {
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
    padding: 8px 12px;
    background-color: #f0f0f0;
    color: #333;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .pagination-controls button.active {
    background-color: #e74c3c;
    color: white;
  }
  
  .pagination-controls button:hover {
    background-color: #e0e0e0;
  }
  </style>
  