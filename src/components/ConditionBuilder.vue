<script setup lang="ts">
import { defineComponent, type PropType } from 'vue';
import { mapStores } from 'pinia';
import { useHashiStore } from '@/stores/hashi';
import {
  useHashiAlgorithmStore,
  type AlgorithmPath,
  type Condition,
  type Operator
} from '@/stores/HashiAlgorithm';
import TermBuilder from './TermBuilder.vue';
import { pathAppendTerm } from '@/services/AlgorithmPathService';
import ComboboxMultiSelect from './ComboboxMultiSelect.vue';

defineProps<{
  condition: Condition;
  path: AlgorithmPath;
}>();

const hashiStore = useHashiStore();
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
    <TermBuilder :term="condition.lhs" :path="pathAppendTerm(path, 0)" :allow-sum="true" />

    <ComboboxMultiSelect
      :options="operators"
      :active="condition.operator"
      :label-getter="(item) => operatorLabels[item as Operator]"
      @update:model-value="(newOp) => hashiAlgorithmStore.changeConditionOperator(path, newOp)"
    >
    </ComboboxMultiSelect>

    <!-- <OperatorOption
      :value="condition.operator"
      @change="(newOp) => hashiAlgorithmStore.changeConditionOperator(path, newOp)"
    /> -->
    <TermBuilder :term="condition.rhs" :path="pathAppendTerm(path, 1)" :allow-sum="true" />
  </span>
</template>

<style scoped>
.condition {
  display: flex;
  flex-direction: row;
  gap: 5px;
}
</style>
