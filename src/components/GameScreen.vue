<script setup lang="ts">
import ActionBar from './ActionBar.vue';
import HashiViewer from '../hashi/components/HashiViewer.vue';
import AlgorithmBuilder from '../algorithm/components/AlgorithmBuilder.vue';

import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router';
import { Levels } from '@/Title-Screen/services/levels';
import { watch } from 'vue';
import { useHashiStore } from '@/hashi/stores/hashi';
import { assertNotNull } from '@/services/misc';

const hashiStore = useHashiStore();
const route = useRoute();
watch(() => route.params.level, loadLevel, { immediate: true });

async function loadLevel(levelStr: string | string[]) {
  console.log('loadLevel', levelStr);
  const levelNum = parseInt(levelStr as string, 10);
  const level = Levels.find((level) => level.number === levelNum);
  assertNotNull(level, 'Level not found');

  const hashi = level.load();

  hashiStore.setHashi(hashi.wrappedItem);
}
</script>

<template>
  <ActionBar />
  <HashiViewer style="height: 400px" />

  <AlgorithmBuilder />
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
