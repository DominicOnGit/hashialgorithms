<script setup lang="ts">
import { type AlgorithmPath, type SumTerm } from '@/algorithm/stores/HashiAlgorithm';
import TermBuilder from './TermBuilder.vue';
import { pathAppend } from '@/algorithm/services/AlgorithmPathService';

import SelectorTypeOption from './SelectorTypeOption.vue';
import { useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';

defineProps<{
  term: SumTerm;
  path: AlgorithmPath;
}>();

const hashiAlgorithmStore = useHashiAlgorithmStore();
</script>

<template>
  SUM
  <TermBuilder
    @mousedown.stop
    :term="term.what"
    :path="pathAppend(path, 1)"
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
