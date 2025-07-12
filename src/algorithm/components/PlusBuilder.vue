<script setup lang="ts">
import { type PlusTerm, type SelectorKind } from '@/algorithm/stores/HashiAlgorithm';
import TermBuilder from './TermBuilder.vue';
import type { AlgorithmTermPath } from '../stores/AlgorithmPath';
import { extendTermPath } from '../services/AlgorithmPathService';

defineProps<{
  term: PlusTerm;
  path: AlgorithmTermPath;
  allowSum: boolean;
  onEdgeOrVertex: SelectorKind;
}>();
</script>

<template>
  <TermBuilder
    @mousedown.stop
    :term="term.lhs"
    :path="extendTermPath(path, 0)"
    :on-edge-or-vertex="onEdgeOrVertex"
    :allowSum="allowSum"
  ></TermBuilder>
  +
  <TermBuilder
    @mousedown.stop
    :term="term.rhs"
    :path="extendTermPath(path, 1)"
    :on-edge-or-vertex="onEdgeOrVertex"
    :allowSum="allowSum"
  ></TermBuilder>
</template>

<style scoped></style>
