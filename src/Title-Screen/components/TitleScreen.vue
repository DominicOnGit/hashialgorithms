<script setup lang="ts">
import { ref } from 'vue';
import { LevelsByCategory } from '../services/levels';
import { getStartForLevel, getUrl } from '@/Story/service/stories';
import type { Level } from '../stores/level';

const levelCategories = ref(LevelsByCategory);

function startLevelPath(level: Level): string {
  const start = getStartForLevel(level);
  return getUrl(start);
}
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
        @click="
          console.log(startLevelPath(level));
          $router.push({ path: startLevelPath(level) });
        "
      >
        {{ level.number }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
