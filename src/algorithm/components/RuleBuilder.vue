<script setup lang="ts">
import { type Rule, type AlgorithmPath } from '@/algorithm/stores/HashiAlgorithm';
import SelectorBuilder from './SelectorBuilder.vue';
import ActionBuilder from './ActionBuilder.vue';
import {
  pathSelectorAndAppend,
  pathActionAndAppend,
  getComponent
} from '@/algorithm/services/AlgorithmPathService';
import { useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';
import { computed } from 'vue';

const props = defineProps<{
  path: AlgorithmPath;
}>();

const hashiAlgorithmStore = useHashiAlgorithmStore();

const rule = computed(() => getComponent(hashiAlgorithmStore, props.path) as Rule);
</script>

<template>
  <table>
    <template v-for="(selector, index) in rule.selectorSequence" :key="index">
      <SelectorBuilder :selector="selector" :path="pathSelectorAndAppend(path, index)" />
    </template>
    <tr>
      <td colspan="2">
        <button @click="hashiAlgorithmStore.newSelector(path)">continue selecting</button>
      </td>
    </tr>
    <tr>
      <td>then</td>
      <td>
        <ActionBuilder :action="rule.action" :path="pathActionAndAppend(path, 0)"></ActionBuilder>
      </td>
    </tr>
  </table>
</template>

<style scoped></style>
