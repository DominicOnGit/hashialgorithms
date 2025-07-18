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

  <!-- Selectors -->
  <template v-for="(selector, index) in rule.selectorSequence" :key="index">
    <SelectorBuilder :path="selectSelector(path, index)" />
  </template>

  <!-- add selector -->
  <div class="row">
    <div class="col offset-2">
      <button class="btn btn-secondary" @click="hashiAlgorithmStore.newSelector(path)">
        continue selecting
      </button>
    </div>
  </div>

  <!-- action -->
  <div class="row mt-4">
    <div class="col col-2 text-end">then</div>
    <div class="col col-9">
      <ActionBuilder :action="rule.action" :path="selectAction(path)"></ActionBuilder>
    </div>
  </div>
</template>

<style scoped>
.rightAlign {
  text-align: right;
}
.spaceUnder {
  padding-bottom: 10px;
}
</style>
