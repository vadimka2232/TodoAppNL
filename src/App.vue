<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="app-container">
    <nav class="app-nav">
      <RouterLink to="/" class="app-nav__link">Profiles</RouterLink>
      <RouterLink to="/todo" class="app-nav__link">Todos</RouterLink>
    </nav>
    <div class="app-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 100wh;
  height: 100vh;
  display: flex;
  flex-direction: column;

  align-items: center; 
}

.app-nav {
  text-align: center;
}

.app-nav__link {
  width: 200px;
  font-size: 1.8rem;
  display: inline-block;
  border: 1px solid black;
  border-bottom: 1px solid black;
  padding: 10px; 
  color: black;
  text-align: center; 
  text-decoration: none; 
  transition: background-color 0.3s ease; 
}

.app-nav__link:hover {
  background-color: #f0f0f0;
}
</style>
