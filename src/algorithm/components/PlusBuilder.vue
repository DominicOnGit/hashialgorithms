<script setup lang="ts">
import {
  type AlgorithmPath,
  type PlusTerm,
  type SelectorKind
} from '@/algorithm/stores/HashiAlgorithm';
import TermBuilder from './TermBuilder.vue';
import { pathAppend } from '@/algorithm/services/AlgorithmPathService';

defineProps<{
  term: PlusTerm;
  path: AlgorithmPath;
  allowSum: boolean;
  onEdgeOrVertex: SelectorKind;
}>();
</script>

<template>
  <TermBuilder
    @mousedown.stop
    :term="term.lhs"
    :path="pathAppend(path, 0)"
    :on-edge-or-vertex="onEdgeOrVertex"
    :allowSum="allowSum"
  ></TermBuilder>
  +
  <TermBuilder
    @mousedown.stop
    :term="term.rhs"
    :path="pathAppend(path, 1)"
    :on-edge-or-vertex="onEdgeOrVertex"
    :allowSum="allowSum"
  ></TermBuilder>
</template>

<style scoped></style>
