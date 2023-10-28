<script setup lang="ts">
import ActionBar from './components/ActionBar.vue';
import HashiViewer from './components/HashiViewer.vue';
import AlgorithmBuilder from './components/AlgorithmBuilder.vue';
</script>

<template>
  <header>
    <h1>Hashi Algorithm</h1>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
