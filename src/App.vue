<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <div class="container">
      <nav class="nav">
        <RouterLink to="/" class="links">Profiles</RouterLink>
        <RouterLink to="/todo" class="links">Todos</RouterLink>
        <RouterView />
      </nav>
    </div>
  </header>
</template>

<style scoped>
.container {
  max-width: 100wh;
  height: 100vh;
  display: flex;
  justify-content: center;
}
.nav {
 text-align: center;
}
.links {
  width: 200px;
  font-size: 1.8rem; /* Увеличен размер шрифта */
  display:  inline-block;
  border-bottom: 1px solid black;
  border: 1px solid black;
  padding: 10px; /* Увеличено пространство внутри кнопок */
  color: black;
  text-align: center; /* Центрирование текста */
  text-decoration: none; /* Убираем подчеркивание */
  transition: background-color 0.3s ease; /* Анимация при наведении */
}
</style>
