<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { mapStores } from 'pinia';
import { useHashiStore } from '@/stores/hashi';
import { useHashiAlgorithmStore, type Rule, type AlgorithmPath } from '@/stores/HashiAlgorithm';
import SelectorBuilder from './SelectorBuilder.vue';
import { pathAppendSelector } from '@/services/AlgorithmPathService';

export default defineComponent({
  props: {
    rule: { type: Object as PropType<Rule>, required: true },
    path: { type: Object as PropType<AlgorithmPath>, required: true }
  },
  data() {
    return {};
  },
  computed: {
    ...mapStores(useHashiStore, useHashiAlgorithmStore)
  },
  methods: {
    pathAppendSelector
  },
  components: { SelectorBuilder }
});
</script>

<template>
  <table>
    <template v-for="(selector, index) in rule.selectorSequence" :key="index">
      <SelectorBuilder :selector="selector" :path="pathAppendSelector(path, index)" />
    </template>
  </table>
</template>

<style scoped></style>
