<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { LevelsByCategory } from '../services/levels';
import { getStartForLevel, getUrl } from '@/Story/service/stories';
import type { Level } from '../stores/level';
import { LoadProgress } from '@/services/storageService';
import { useProgressStore, canPlay } from '@/stores/ProgressStore';

const progress = useProgressStore();
const levelCategories = ref(LevelsByCategory);

function startLevelPath(level: Level): string {
  const start = getStartForLevel(level);
  return getUrl(start);
}

onBeforeMount(() => {
  const loaded = LoadProgress();
  if (loaded != null) {
    progress.$patch(loaded);
  }
});
</script>

<template>
  <h2>Levels</h2>

  <div v-for="category in levelCategories" :key="category.categoryName">
    <div class="card m-4" style="width: 20em">
      <div class="card-body">
        <h4 class="card-title">{{ category.categoryName }}</h4>

        <div class="btn-group">
          <template v-for="level in category.levels" :key="level.number">
            <button
              :disabled="!canPlay(progress, level.number)"
              class="btn btn-light"
              @click="$router.push({ path: startLevelPath(level) })"
            >
              {{ level.number }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
