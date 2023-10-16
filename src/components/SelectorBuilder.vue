<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { mapStores } from 'pinia';
import { useHashiStore } from '@/stores/hashi';
import { useHashiAlgorithmStore, type Selector, type AlgorithmPath } from '@/stores/HashiAlgorithm';
import SelectorTypeOption from './SelectorTypeOption.vue';
import ConditionBuilder from './ConditionBuilder.vue';
import { pathAppendCondition } from '@/services/AlgorithmPathService';

export default defineComponent({
  props: {
    selector: { type: Object as PropType<Selector>, required: true },
    path: { type: Object as PropType<AlgorithmPath>, required: true }
  },
  computed: {
    ...mapStores(useHashiStore, useHashiAlgorithmStore)
  },
  methods: { pathAppendCondition },
  components: { SelectorTypeOption, ConditionBuilder }
});
</script>

<template>
  <tr>
    <td>Select</td>
    <td>
      <SelectorTypeOption
        :value="selector.kind"
        @change="(newKind) => hashiAlgorithmStore.changeSelectorKind(path, newKind)"
      />
    </td>
  </tr>
  <tr v-for="(condition, index) of selector.conditions" :key="index">
    <td>{{ index === 0 ? 'with' : 'and' }}</td>
    <td>
      <ConditionBuilder :condition="condition" :path="pathAppendCondition(path, index)" />
    </td>
  </tr>
</template>

<style scoped></style>
