<script setup lang="ts">
import { computed } from 'vue';
import { type AlgorithmPath, type Term } from '@/algorithm/stores/HashiAlgorithm';
import { TermBuilderService } from '@/algorithm/services/TermBuilderService';
import { getAncestorSelector } from '@/algorithm/services/AlgorithmPathService';
import SumBuilder from './SumBuilder.vue';
import ComboboxMultiSelect from '../../components/ComboboxMultiSelect.vue';
import { useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';

const props = defineProps<{
  term: Term;
  path: AlgorithmPath;
  allowSum: boolean;
}>();

const hashiAlgorithmStore = useHashiAlgorithmStore();

const termBuilderService = computed(() => {
  const ancestorSelector = getAncestorSelector(hashiAlgorithmStore, props.path);
  return new TermBuilderService(ancestorSelector.kind);
});

const options = computed(() => {
  const allTerms = termBuilderService.value.getAllTermOptions(props.allowSum);
  return allTerms;
});
</script>

<template>
  <ComboboxMultiSelect
    :options="options"
    :active="term"
    :key-getter="termBuilderService.getTermId"
    :label-getter="termBuilderService.getTermId"
    @update:modelValue="(term: Term) => hashiAlgorithmStore.changeTerm(path, term)"
  >
    <template #selected="slotProps">
      <template v-if="slotProps.selectedItem.kind == 'sum'">
        <SumBuilder :term="slotProps.selectedItem" :path="path"></SumBuilder>
      </template>
      <template v-else> {{ termBuilderService.getTermId(slotProps.selectedItem) }}</template>
    </template>
  </ComboboxMultiSelect>
</template>

<style></style>
