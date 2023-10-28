<script setup lang="ts">
import Multiselect from 'vue-multiselect';
import ComboboxSelection from './components/ComboboxSelection.vue';
import SelectionOption from './components/SelectionOption.vue';
import TermBuilder from './components/TermBuilder.vue';
import { computed, ref } from 'vue';
import { useHashiAlgorithmStore, type AlgorithmPath, type Term } from './stores/HashiAlgorithm';
import { AlgorithmPathService } from './services/AlgorithmPathService';

function selected() {
  console.log('selected it TEST');
}

interface OptionType {
  label: string;
  id: number;
}

const optRaw: OptionType[] = [
  {
    label: 'hello',
    id: 12
  },
  {
    label: 'other, longer',
    id: 44
  }
];

const opt = ref(optRaw);

const algoState = useHashiAlgorithmStore();

const path: AlgorithmPath = { ruleIndex: 0, selectorIndex: 0, conditionIndex: 0, termIndex: 0 };

const term = computed((): Term => {
  const res = new AlgorithmPathService().getComponent(algoState, path) as Term;
  return res;
});
</script>

<template>
  <h1>Test</h1>
  start
  <ComboboxSelection :options="opt" :selected="opt[0]">
    <template #default="slotProps"> {{ slotProps.selectedItem.label }} </template>
    <template #option="slotProps"> {{ slotProps.item.label }} </template>
  </ComboboxSelection>
  continue
  <!-- <TermBuilder :path="path" :term="term"></TermBuilder> -->
  <!-- 
  <Multiselect :options="opt" :modelValue="opt[1]" :searchable="false">
    <template #singleLabel="slotProps">
      {{ slotProps }}
    </template>
  </Multiselect>
  and here we -->
</template>

<style scoped></style>
