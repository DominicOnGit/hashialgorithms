<script setup lang="ts">
import SlowPressButton from './SlowPressButton.vue';
</script>

<template>
  <h1>Test</h1>

  <SlowPressButton @activated="console.log('activated')">OK</SlowPressButton>
</template>

<style scoped></style>
