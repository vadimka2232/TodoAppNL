<template>
    <div class="pagination">
        <h1>ggg</h1>
            <button 
                v-for="page in pagesCount" :key="page"
            >
                {{ page }}
            </button>
    </div>
</template>
  
<script setup lang="ts">
import { ref, defineProps } from 'vue';

// Пропсы для компонента
const props = defineProps<{
    todos: [],  // Общее количество элементов
    pagesCount:Number;
}>();
const itemsPerPage = 15;
const currentPage = ref(1);
  
// Вычисляем общее количество страниц


</script>
  
<style scoped>
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0;
}

.page-button {
    background-color: #ecf0f1;
    color: #34495e;
    border: none;
    border-radius: 4px;
    padding: 10px 15px;
    cursor: pointer;
    margin: 0 5px;
    transition: background-color 0.3s ease;
}

.page-button.active {
    background-color: #3498db;
    color: white;
}

.page-button:hover {
    background-color: #bdc3c7;
}
</style>
