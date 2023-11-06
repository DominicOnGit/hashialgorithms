<script setup lang="ts">
import {
  type Rule,
  type AlgorithmPath,
  type HashiAction,
  type SetPropertyAction
} from '@/algorithm/stores/HashiAlgorithm';
import ComboboxMultiSelect from '@/components/ComboboxMultiSelect.vue';
import { pathAppend } from '@/algorithm/services/AlgorithmPathService';
import { useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';
import { computed } from 'vue';
import RuleBuilder from './RuleBuilder.vue';
import TermBuilder from './TermBuilder.vue';

const props = defineProps<{
  action: SetPropertyAction;
  path: AlgorithmPath;
}>();

const hashiAlgorithmStore = useHashiAlgorithmStore();

const propertyOptions = computed((): string[] => {
  return ['maxMultiplicity'];
});

function getKey(item: SetPropertyAction): string {
  return item.kind;
}

function getLabel(item: SetPropertyAction): string {
  return item.kind;
}

function changeProperty(newProperty: string): void {
  const newAction: SetPropertyAction = {
    ...props.action,
    property: newProperty
  };
  hashiAlgorithmStore.changeAction(props.path, newAction);
}
</script>

<template>
  Set
  <ComboboxMultiSelect
    @mousedown.stop
    :options="propertyOptions"
    :active="action.property"
    :key-getter="(x) => x"
    :label-getter="(x) => x"
    @update:model-value="(val: string) => changeProperty(val)"
  />
  =
  <TermBuilder
    @mousedown.stop
    :term="action.value"
    :path="pathAppend(path, 0)"
    :on-edge-or-vertex="'edge'"
    :allow-sum="false"
  ></TermBuilder>
</template>

<style scoped></style>
