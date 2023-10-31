<script setup lang="ts">
import { type AlgorithmPath, type Condition, type Operator } from '@/stores/HashiAlgorithm';
import TermBuilder from './TermBuilder.vue';
import { pathAppend } from '@/services/AlgorithmPathService';
import ComboboxMultiSelect from './ComboboxMultiSelect.vue';
import { useHashiAlgorithmStore } from '@/stores/HashiAlgorithmStore';

defineProps<{
  condition: Condition;
  path: AlgorithmPath;
}>();

const hashiAlgorithmStore = useHashiAlgorithmStore();

const operators: Operator[] = ['eq', 'le', 'lt'];

const operatorLabels: { [key in Operator]: string } = {
  eq: '\u003d',
  le: '\u2264',
  lt: '\u003c'
  // gt: '\u003e'
  // ge: '\u2265'
};
</script>

<template>
  <span class="condition">
    <TermBuilder :term="condition.lhs" :path="pathAppend(path, 0)" :allow-sum="true" />

    <ComboboxMultiSelect
      :options="operators"
      :active="condition.operator"
      :label-getter="(item) => operatorLabels[item as Operator]"
      @update:model-value="(newOp) => hashiAlgorithmStore.changeConditionOperator(path, newOp)"
    >
    </ComboboxMultiSelect>

    <TermBuilder :term="condition.rhs" :path="pathAppend(path, 1)" :allow-sum="true" />
  </span>
</template>

<style scoped>
.condition {
  display: flex;
  flex-direction: row;
  gap: 5px;
}
</style>
