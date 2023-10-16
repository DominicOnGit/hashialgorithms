<script setup lang="ts">
import type { Selector } from '@/stores/HashiAlgorithm';
import { onBeforeUpdate, toRef } from 'vue';

const props = defineProps<{
  value: Selector['kind'];
}>();
defineEmits(['change']);
const selected = toRef(props.value);

onBeforeUpdate(() => console.log('before update', props.value));
</script>

<template>
  <select @change="$emit('change', selected)">
    <option value="vertex" :selected="value === 'vertex'">Vertex</option>
    <option value="edge" :selected="value === 'edge'">Edge</option>
  </select>
</template>

<style scoped></style>
