<script setup lang="ts">
import {
  type AlgorithmPath,
  type Condition,
  type Operator,
  type SelectorKind
} from '@/algorithm/stores/HashiAlgorithm';
import TermBuilder from './TermBuilder.vue';
import { getAncestorSelector, pathAppend } from '@/algorithm/services/AlgorithmPathService';
import ComboboxMultiSelect from '../../components/ComboboxMultiSelect.vue';
import { useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';
import { computed } from 'vue';

const props = defineProps<{
  condition: Condition;
  path: AlgorithmPath;
}>();

const hashiAlgorithmStore = useHashiAlgorithmStore();

const onEdgeOrVertex = computed((): SelectorKind => {
  const ancestorSelector = getAncestorSelector(hashiAlgorithmStore, props.path);
  return ancestorSelector.kind;
});

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
    <TermBuilder
      :term="condition.lhs"
      :path="pathAppend(path, 0)"
      :on-edge-or-vertex="onEdgeOrVertex"
      :allow-sum="true"
    />

    <ComboboxMultiSelect
      :options="operators"
      :active="condition.operator"
      :label-getter="(item) => operatorLabels[item as Operator]"
      @update:model-value="(newOp) => hashiAlgorithmStore.changeConditionOperator(path, newOp)"
    >
    </ComboboxMultiSelect>

    <TermBuilder
      :term="condition.rhs"
      :path="pathAppend(path, 1)"
      :on-edge-or-vertex="onEdgeOrVertex"
      :allow-sum="true"
    />
  </span>
</template>

<style scoped>
.condition {
  display: flex;
  flex-direction: row;
  gap: 5px;
}
</style>
