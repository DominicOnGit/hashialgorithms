<script setup lang="ts">
import { ref } from 'vue';
import { LevelCategories } from '../stores/level';
import { LevelsByCategory } from '../services/levels';

const levelCategories = ref(LevelsByCategory);
</script>

<template>
  <h2>Levels</h2>

  <div v-for="category in levelCategories">
    <h3>{{ category.categoryName }}</h3>
    <div class="btn-group">
      <button
        v-for="level in category.levels"
        class="btn btn-light"
        @click="$router.push({ path: `/play/${level.number}` })"
      >
        {{ level.number }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
