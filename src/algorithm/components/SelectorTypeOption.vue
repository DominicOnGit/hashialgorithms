<script setup lang="ts">
import type {
  SelectorKind,
  SelectorKindAndExcludeAncestor
} from '@/algorithm/stores/HashiAlgorithm';
import ComboboxMultiSelect from '../../components/ComboboxMultiSelect.vue';
import { computed } from 'vue';

const props = defineProps<{
  value: SelectorKindAndExcludeAncestor;
  useIncident: boolean;
  allowExcludeAncestor: boolean;
}>();
defineEmits<{
  change: [result: SelectorKindAndExcludeAncestor];
}>();

const options = computed((): SelectorKindAndExcludeAncestor[] => {
  const base: SelectorKindAndExcludeAncestor[] = [
    { kind: 'vertex', excludeAncestor: false },
    { kind: 'edge', excludeAncestor: false }
  ];
  if (props.allowExcludeAncestor) {
    return [
      ...base,
      { kind: 'vertex', excludeAncestor: true },
      { kind: 'edge', excludeAncestor: true }
    ];
  }
  return base;
});

const kindLabels: { [key in SelectorKind]: string } = {
  edge: 'Edge',
  vertex: 'Vertex'
};

function getKey(item: SelectorKindAndExcludeAncestor): string {
  return JSON.stringify({
    kind: item.kind,
    excludeAncestor: item.excludeAncestor ?? false
  });
}

function getLabel(item: SelectorKindAndExcludeAncestor): string {
  const prefix =
    props.allowExcludeAncestor && item.excludeAncestor
      ? 'Other '
      : props.useIncident
      ? 'Incident '
      : '';
  return prefix + kindLabels[item.kind];
}
</script>

<template>
  <ComboboxMultiSelect
    :options="options"
    :active="value"
    :key-getter="getKey"
    :label-getter="getLabel"
    @update:model-value="(val) => $emit('change', val)"
  />
</template>

<style scoped></style>
