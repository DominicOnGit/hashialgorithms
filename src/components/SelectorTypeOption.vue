<script setup lang="ts">
import type { Selector } from '@/stores/HashiAlgorithm';
import { onBeforeUpdate, ref } from 'vue';

const props = defineProps<{
  value: Selector['kind'];
}>();
defineEmits(['change']);

const selectElem = ref(null);

onBeforeUpdate(() => console.log('before update', props.value));

function getValue(e: Event): Selector['kind'] {
  const selectElement = e.target as HTMLSelectElement;
  return selectElement.value as Selector['kind'];
}
</script>

<template>
  <select ref="selectElem" @change="(e) => $emit('change', getValue(e))">
    <option value="vertex" :selected="value === 'vertex'">Vertex</option>
    <option value="edge" :selected="value === 'edge'">Edge</option>
  </select>
</template>

<style scoped></style>
