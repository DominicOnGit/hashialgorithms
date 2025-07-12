<script setup lang="ts">
import { ref } from 'vue';
import { LevelsByCategory } from '../services/levels';

const levelCategories = ref(LevelsByCategory);
</script>

<template>
  <h2>Levels</h2>

  <div v-for="category in levelCategories" :key="category.categoryName">
    <h3>{{ category.categoryName }}</h3>
    <div class="btn-group">
      <button
        v-for="level in category.levels"
        :key="level.number"
        class="btn btn-light"
        @click="$router.push({ path: `/play/${level.number}` })"
      >
        {{ level.number }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
