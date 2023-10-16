<script setup lang="ts">
import type { Condition, Selector } from '@/stores/HashiAlgorithm';

defineProps<{
  value: Condition['operator'];
}>();
defineEmits(['change']);
function getValue(e: Event): Selector['kind'] {
  const selectElement = e.target as HTMLSelectElement;
  return selectElement.value as Selector['kind'];
}
</script>

<template>
  <select @change="(e) => $emit('change', getValue(e))">
    <option value="eq" :selected="value === 'eq'">&equals;</option>
    <option value="le" :selected="value === 'le'">&le;</option>
    <option value="lt" :selected="value === 'lt'">&lt;</option>
  </select>
</template>

<style scoped></style>
