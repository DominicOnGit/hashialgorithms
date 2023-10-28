<script setup lang="ts">
import { computed } from 'vue';
import {
  useHashiAlgorithmStore,
  type AlgorithmPath,
  type Term,
  type SumTerm
} from '@/stores/HashiAlgorithm';
import TermBuilder from './TermBuilder.vue';
import { TermBuilderService } from '@/services/TermBuilderService';
import { getAncestorSelector, pathAppendSumPart } from '@/services/AlgorithmPathService';
import { termToString } from '@/services/TermBuilderService';

import SelectorTypeOption from './SelectorTypeOption.vue';

const props = defineProps<{
  term: SumTerm;
  path: AlgorithmPath;
}>();

const hashiAlgorithmStore = useHashiAlgorithmStore();

const termBuilderService = computed(() => {
  const ancestorSelector = getAncestorSelector(hashiAlgorithmStore, props.path);
  return new TermBuilderService(ancestorSelector.kind);
});

function getSelcetedIndex(e: Event): number {
  const selectElement = e.target as HTMLSelectElement;
  return selectElement.selectedIndex;
}
</script>

<template>
  SUM
  <TermBuilder
    @mousedown.stop
    :term="term.what"
    :path="pathAppendSumPart(path, 1)"
    :allowSum="false"
  ></TermBuilder>
  Over
  <SelectorTypeOption
    @mousedown.stop
    :value="term.over.kind"
    :isFirst="false"
    @change="
      (newKind) => hashiAlgorithmStore.changeSelectorKind(pathAppendSumPart(path, 0), newKind)
    "
  />
</template>

<style scoped></style>
