<script setup lang="ts">
import { type Rule } from '@/algorithm/stores/HashiAlgorithm';
import SelectorBuilder from './SelectorBuilder.vue';
import ActionBuilder from './ActionBuilder.vue';
import {
  getComponent,
  selectAction,
  selectSelector
} from '@/algorithm/services/AlgorithmPathService';
import { useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';
import { computed } from 'vue';
import EditableLabel from '@/components/EditableLabel.vue';
import type { RulePath } from '../stores/AlgorithmPath';

const props = defineProps<{
  path: RulePath;
}>();

const hashiAlgorithmStore = useHashiAlgorithmStore();

const rule = computed(() => getComponent(hashiAlgorithmStore, props.path) as Rule);
</script>

<template>
  <h2><EditableLabel v-model="rule.name" /></h2>

  <table>
    <tbody>
      <template v-for="(selector, index) in rule.selectorSequence" :key="index">
        <SelectorBuilder :path="selectSelector(path, index)" />
      </template>
      <tr>
        <td colspan="2">
          <button @click="hashiAlgorithmStore.newSelector(path)">continue selecting</button>
        </td>
      </tr>
      <tr>
        <td>then</td>
        <td>
          <ActionBuilder :action="rule.action" :path="selectAction(path)"></ActionBuilder>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped></style>
