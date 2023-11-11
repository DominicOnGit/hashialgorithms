<script setup lang="ts">
import {
  type AlgorithmPath,
  type HashiAction,
  type SetPropertyAction
} from '@/algorithm/stores/HashiAlgorithm';
import ComboboxMultiSelect from '@/components/ComboboxMultiSelect.vue';
import SetPropertyActionBuilder from './SetPropertyActionBuilder.vue';
import { useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';
import { computed } from 'vue';
import { useCustomPropertyStore } from '@/stores/CustomPropertyDef';

defineProps<{
  action: HashiAction;
  path: AlgorithmPath;
}>();

const hashiAlgorithmStore = useHashiAlgorithmStore();
const customPropertiesStore = useCustomPropertyStore();

const options = computed((): HashiAction[] => {
  const actions: HashiAction[] = [{ kind: 'addEdge' }];
  if (customPropertiesStore.defs.length > 0) {
    actions.push({
      kind: 'setProperty',
      property: customPropertiesStore.defs[0].name,
      value: { kind: 'constant', value: 0 }
    });
  }
  return actions;
});

function getKey(item: any): string {
  return item.kind;
}

function getLabel(item: any): string {
  return item.kind;
}
</script>

<template>
  <ComboboxMultiSelect
    :options="options"
    :active="action"
    :key-getter="getKey"
    :label-getter="getLabel"
    @update:model-value="(val: HashiAction) => hashiAlgorithmStore.changeAction(path, val)"
  >
    <template #selected="slotProps">
      <template v-if="slotProps.selectedItem.kind == 'setProperty'">
        <SetPropertyActionBuilder :action="action as SetPropertyAction" :path="path" />
      </template>
    </template>
  </ComboboxMultiSelect>
</template>

<style scoped></style>
