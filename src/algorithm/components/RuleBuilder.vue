<script setup lang="ts">
import { type Rule, type AlgorithmPath } from '@/algorithm/stores/HashiAlgorithm';
import SelectorBuilder from './SelectorBuilder.vue';
import { pathAppend } from '@/algorithm/services/AlgorithmPathService';
import { useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';

defineProps<{
  rule: Rule;
  path: AlgorithmPath;
}>();

const hashiAlgorithmStore = useHashiAlgorithmStore();
</script>

<template>
  <table>
    <template v-for="(selector, index) in rule.selectorSequence" :key="index">
      <SelectorBuilder :selector="selector" :path="pathAppend(path, index)" />
    </template>
    <tr>
      <td colspan="2">
        <button @click="hashiAlgorithmStore.newSelector(path)">continue selecting</button>
      </td>
    </tr>
  </table>
</template>

<style scoped></style>
