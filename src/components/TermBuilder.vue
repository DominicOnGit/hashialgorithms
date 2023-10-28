<script setup lang="ts">
import { computed, onBeforeUpdate, ref } from 'vue';
import { useHashiAlgorithmStore, type AlgorithmPath, type Term } from '@/stores/HashiAlgorithm';
import { TermBuilderService } from '@/services/TermBuilderService';
import { getAncestorSelector } from '@/services/AlgorithmPathService';
import { termToString } from '@/services/TermBuilderService';
import SumBuilder from './SumBuilder.vue';
import Multiselect from 'vue-multiselect';
import ComboboxMultiSelect from './ComboboxMultiSelect.vue';

type TermAndId = { id: string; term: Term };

const props = defineProps<{
  term: Term;
  path: AlgorithmPath;
  allowSum: boolean;
}>();

const hashiAlgorithmStore = useHashiAlgorithmStore();

const isOpen = ref(false);

const termBuilderService = computed(() => {
  const ancestorSelector = getAncestorSelector(hashiAlgorithmStore, props.path);
  return new TermBuilderService(ancestorSelector.kind);
});

const options = computed(() => {
  const allTerms = termBuilderService.value.getAllTermOptions(props.allowSum);
  const propTermId = termBuilderService.value.getTermId(props.term);
  const activeAt = allTerms.findIndex((x) => termBuilderService.value.getTermId(x) === propTermId);
  allTerms.splice(activeAt, 1, props.term);
  // console.log(allTerms);
  return allTerms;
});

const getSelectData = computed(() => {
  const propTermId = termBuilderService.value.getTermId(props.term);
  const otherTerms = termBuilderService.value
    .getAllTermOptions(props.allowSum)
    .filter((term) => termBuilderService.value.getTermId(term) !== propTermId);
  const allTerms = [props.term, ...otherTerms];
  const allTermsAndIds = allTerms.map((term) => {
    return { id: termBuilderService.value.getTermId(term), term: term };
  });
  const res = {
    options: allTermsAndIds,
    current: allTermsAndIds[0]
  };
  console.log(res);
  return res;
});
</script>

<template>
  <ComboboxMultiSelect
    :options="options"
    :active="term"
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

  <!-- <multiselect
    :options="getSelectData.options"
    :modelValue="getSelectData.current"
    track-by="id"
    label="id"
    @update:modelValue="(e: any, u: any) => hashiAlgorithmStore.changeTerm(path, e.term)"
    :searchable="false"
    :allow-empty="false"
    :show-labels="false"
  >
    <template #singleLabel="slotProps">
      <template v-if="slotProps.option.term.kind == 'sum'">
        <SumBuilder :term="slotProps.option.term" :path="path"></SumBuilder>
      </template>
      <template v-else> {{ slotProps.option.id }}</template>
    </template>
  </multiselect> -->
</template>

<!--
multiselect: field without popup
multiselect__content: entire popup
multiselect__option: an item in the popup
-->

<style>
.multiselect {
  position: relative;
  display: inline-block;

  color: black;
  padding: 2px;
  border: 1px solid rgb(118, 118, 118);
  border-radius: 2px;
}
.multiselect__content-wrapper {
  position: absolute;
  z-index: 1;
  background-color: white;
  border: 1px solid black;
  padding: 5px;
  box-shadow: 10px 5px 5px gray;
}
.multiselect__content {
  padding: 0;
  margin: 0;
  min-width: 100%;
  display: inline-block;
  list-style: none;
}

.multiselect__option {
  display: block;
  padding: 5px;
  cursor: pointer;
}

.multiselect__option--highlight {
  background: #41b883;
  color: #fff;
}
</style>
