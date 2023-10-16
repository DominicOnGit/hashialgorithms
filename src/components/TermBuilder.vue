<script setup lang="ts">
import { computed } from 'vue';
import { useHashiAlgorithmStore, type AlgorithmPath, type Term } from '@/stores/HashiAlgorithm';
import { TermBuilderService } from '@/services/TermBuilderService';
import { getAncestorSelector } from '@/services/AlgorithmPathService';
import { termToString } from '@/services/TermBuilderService';

const props = defineProps<{
  term: Term;
  path: AlgorithmPath;
}>();

const hashiAlgorithmStore = useHashiAlgorithmStore();

const termBuilderService = computed(() => {
  const ancestorSelector = getAncestorSelector(hashiAlgorithmStore, props.path);
  return new TermBuilderService(ancestorSelector.kind);
});

const allPossibleTerms = computed(() => {
  return termBuilderService.value.getAllTermOptions();
});

function getSelcetedIndex(e: Event): number {
  const selectElement = e.target as HTMLSelectElement;
  return selectElement.selectedIndex;
}
</script>

<template>
  <select
    @change="(e) => hashiAlgorithmStore.changeTerm(path, allPossibleTerms[getSelcetedIndex(e)])"
  >
    <option
      v-for="(possibleTerm, index) in allPossibleTerms"
      :key="index"
      :selected="termToString(term) == termToString(possibleTerm)"
    >
      {{ termToString(possibleTerm) }}
    </option>
  </select>
</template>

<style scoped></style>
