<script setup lang="ts">
import { type SumTerm } from '@/algorithm/stores/HashiAlgorithm';
import TermBuilder from './TermBuilder.vue';
import { extendTermPath } from '@/algorithm/services/AlgorithmPathService';

import SelectorTypeOption from './SelectorTypeOption.vue';
import { useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';
import type { AlgorithmTermPath } from '../stores/AlgorithmPath';

defineProps<{
  term: SumTerm;
  path: AlgorithmTermPath;
}>();

const hashiAlgorithmStore = useHashiAlgorithmStore();
</script>

<template>
  SUM
  <TermBuilder
    @mousedown.stop
    :term="term.what"
    :path="extendTermPath(path, 1)"
    :on-edge-or-vertex="term.over.kind"
    :allowSum="false"
  ></TermBuilder>
  Over
  <SelectorTypeOption
    @mousedown.stop
    :value="term.over"
    :useIncident="false"
    :allow-exclude-ancestor="true"
    @change="(newKind) => hashiAlgorithmStore.changeSelectorKind(extendTermPath(path, 0), newKind)"
  />
</template>

<style scoped></style>
