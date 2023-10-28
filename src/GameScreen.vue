<script setup lang="ts">
import ActionBar from './components/ActionBar.vue';
import HashiViewer from './components/HashiViewer.vue';
import AlgorithmBuilder from './components/AlgorithmBuilder.vue';
</script>

<template>
  <ActionBar />
  <HashiViewer style="height: 200px" />

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
