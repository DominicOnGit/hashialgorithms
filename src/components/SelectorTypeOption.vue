<script setup lang="ts">
import type { SelectorKind } from '@/stores/HashiAlgorithm';
import ComboboxMultiSelect from './ComboboxMultiSelect.vue';

const props = defineProps<{
  value: SelectorKind;
  isFirst: boolean;
}>();
defineEmits(['change']);

const options: SelectorKind[] = ['vertex', 'edge'];

const labels: { [key in SelectorKind]: string } = {
  edge: props.isFirst ? 'Edge' : 'Incident Edge',
  vertex: props.isFirst ? 'Vertex' : 'Incident Vertex'
};
</script>

<template>
  <ComboboxMultiSelect
    :options="options"
    :active="value"
    :label-getter="(x) => labels[x as SelectorKind]"
    @update:model-value="(val) => $emit('change', val)"
  />
</template>

<style scoped></style>
