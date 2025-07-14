<script setup lang="ts">
import HashiViewer from '../hashi/components/HashiViewer.vue';
import AlgorithmBuilder from '../algorithm/components/AlgorithmBuilder.vue';

import { useRoute } from 'vue-router';
import { loadLevel } from '@/Title-Screen/services/levels';
import { watch } from 'vue';
import { useHashiStore } from '@/hashi/stores/hashi';

const hashiStore = useHashiStore();
const route = useRoute();
watch(() => route.params.level, loadLevelAndSet, { immediate: true });

function loadLevelAndSet(levelStr: string | string[]) {
  const hashi = loadLevel(levelStr as string);
  hashiStore.setHashi(hashi.wrappedItem);
}
</script>

<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-body">
        <HashiViewer />
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <AlgorithmBuilder />
      </div>
    </div>
  </div>
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
