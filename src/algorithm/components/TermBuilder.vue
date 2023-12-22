<script setup lang="ts">
import { computed } from 'vue';
import {
  type AlgorithmPath,
  type SelectorKind,
  type Term
} from '@/algorithm/stores/HashiAlgorithm';
import { TermBuilderService, getTermId } from '@/algorithm/services/TermBuilderService';
import SumBuilder from './SumBuilder.vue';
import ComboboxMultiSelect from '../../components/ComboboxMultiSelect.vue';
import { useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';
import { useCustomPropertyStore } from '@/stores/CustomPropertyDef';

const props = defineProps<{
  term: Term;
  path: AlgorithmPath;
  allowSum: boolean;
  onEdgeOrVertex: SelectorKind;
}>();

const hashiAlgorithmStore = useHashiAlgorithmStore();
const customPropertiesStore = useCustomPropertyStore();

const options = computed(() => {
  const termBuilderService = new TermBuilderService(
    props.onEdgeOrVertex,
    customPropertiesStore.defs
  );
  const allTerms = termBuilderService.getAllTermOptions(props.allowSum);
  return allTerms;
});
</script>

<template>
  <ComboboxMultiSelect
    :options="options"
    :active="term"
    :key-getter="getTermId"
    :label-getter="getTermId"
    @update:modelValue="(term: Term) => hashiAlgorithmStore.changeTerm(path, term)"
  >
    <template #selected="slotProps">
      <template v-if="slotProps.selectedItem.kind == 'sum'">
        <SumBuilder :term="slotProps.selectedItem" :path="path"></SumBuilder>
      </template>
      <template v-else> {{ getTermId(slotProps.selectedItem) }}</template>
    </template>
  </ComboboxMultiSelect>
</template>

<style></style>
