<template>
    <ul class="profiles__list">
      <li 
        v-for="profile in paginatedProfiles" 
        :key="profile.userId" 
        :class="['profiles__item', { 'profiles__item--selected': profile.userId === usedProfile?.userId }]">
        <div class="profiles__info">
          <strong class="profiles__name">Name:</strong> {{ profile.name }}
        </div>
        <button class="profiles__button-select" @click="emitSelectProfile(profile)">Выбрать профиль</button>
      </li>
    </ul>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import type { Profile } from '../../contracts/profiles';
  
  const emit = defineEmits<{ (e: 'selectProfile', profile: Profile): void }>();
  
  const props = defineProps<{
    profiles: Profile[];
    usedProfile: Profile | null;
    currentPage: number;
    itemsPerPage: number;
  }>();
  
  const paginatedProfiles = computed(() => {
    const start = (props.currentPage - 1) * props.itemsPerPage;
    return props.profiles.slice(start, start + props.itemsPerPage);
  });
  
  const emitSelectProfile = (profile: Profile) => {
    emit('selectProfile', profile); // Эмитим событие с выбранным профилем
  };
  </script>
  
  <style scoped>
  .profiles__list {
    width: 100%;
    list-style-type: none;
    padding: 0;
  }
  
  .profiles__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 4px;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .profiles__item:not(:last-child) {
    margin-bottom: 15px;
  }
  
  .profiles__item:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  .profiles__item--selected {
    background-color: #d6eaf8;
    border: 2px solid #3498db;
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
  
  .profiles__button-select {
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 0.9rem;
  }
  
  .profiles__button-select:hover {
    background-color: #2980b9;
  }
  
  .profiles__button-select:active {
    background-color: #1c6ea4;
  }
  </style>
  