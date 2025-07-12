<script setup lang="ts">
import { computed } from 'vue';
import { type Selector } from '@/algorithm/stores/HashiAlgorithm';
import SelectorTypeOption from './SelectorTypeOption.vue';
import ConditionBuilder from './ConditionBuilder.vue';
import { getComponent } from '@/algorithm/services/AlgorithmPathService';
import { useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';
import type { SelectorPath } from '../stores/AlgorithmPath';
import { selectCondition } from '@/algorithm/services/AlgorithmPathService';

const props = defineProps<{
  path: SelectorPath;
}>();

const hashiAlgorithmStore = useHashiAlgorithmStore();
const selector = computed(() => getComponent(hashiAlgorithmStore, props.path) as Selector);

const isFirst = computed(() => {
  return props.path.selectorIndex === 0;
});

const isFirstOrSecond = computed(() => {
  return props.path.selectorIndex <= 1;
});
</script>

<template>
  <tr>
    <td class="rightAlign">{{ isFirst ? 'Select' : 'then select' }}</td>
    <td>
      <SelectorTypeOption
        :value="selector"
        :useIncident="!isFirst"
        :allowExcludeAncestor="!isFirstOrSecond"
        @change="(newKind) => hashiAlgorithmStore.changeSelectorKind(path, newKind)"
      />
    </td>
    <td><button @click="hashiAlgorithmStore.deleteSelector(path)">x</button></td>
  </tr>
  <tr v-for="(condition, index) of selector.conditions" :key="index">
    <td class="rightAlign">{{ index === 0 ? 'with' : 'and' }}</td>
    <td>
      <ConditionBuilder :condition="condition" :path="selectCondition(path, index)" />
    </td>
    <td>
      <button @click="() => hashiAlgorithmStore.deleteCondition(selectCondition(path, index))">
        x
      </button>
    </td>
  </tr>
  <tr>
    <td></td>
    <td class="spaceUnder">
      <button @click="() => hashiAlgorithmStore.newCondition(path)">add condition</button>
    </td>
  </tr>
</template>

<style scoped>
.spaceUnder {
  padding-bottom: 10px;
}
.rightAlign {
  text-align: right;
}
</style>
