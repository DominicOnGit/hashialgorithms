<script setup lang="ts">
import {
  type AlgorithmPath,
  type SelectorKind,
  type SumTerm
} from '@/algorithm/stores/HashiAlgorithm';
import TermBuilder from './TermBuilder.vue';
import { getAncestorSelector, pathAppend } from '@/algorithm/services/AlgorithmPathService';

import SelectorTypeOption from './SelectorTypeOption.vue';
import { useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';
import { computed } from 'vue';

const props = defineProps<{
  term: SumTerm;
  path: AlgorithmPath;
}>();

const hashiAlgorithmStore = useHashiAlgorithmStore();

const onEdgeOrVertex = computed((): SelectorKind => {
  const ancestorSelector = getAncestorSelector(hashiAlgorithmStore, props.path);
  return ancestorSelector.kind;
});
</script>

<template>
  SUM
  <TermBuilder
    @mousedown.stop
    :term="term.what"
    :path="pathAppend(path, 1)"
    :on-edge-or-vertex="onEdgeOrVertex"
    :allowSum="false"
  ></TermBuilder>
  Over
  <SelectorTypeOption
    @mousedown.stop
    :value="term.over"
    :useIncident="false"
    :allow-exclude-ancestor="true"
    @change="(newKind) => hashiAlgorithmStore.changeSelectorKind(pathAppend(path, 0), newKind)"
  />
</template>

<style scoped></style>
