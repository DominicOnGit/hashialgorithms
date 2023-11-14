<script setup lang="ts">
import { ref } from 'vue';
import SlowPressButton from './SlowPressButton.vue';

interface OptionType {
  label: string;
  id: number;
}

const optRaw: OptionType[] = [
  {
    label: 'hello',
    id: 12
  },
  {
    label: 'other, longer',
    id: 44
  }
];

const opt = ref(optRaw);
</script>

<template>
  <h1>Test</h1>

  <SlowPressButton @activated="console.log('activated')">OK</SlowPressButton>
</template>

<style scoped></style>
