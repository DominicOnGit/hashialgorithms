<script setup lang="ts">
import { computed } from 'vue';
import { type Selector, type AlgorithmPath } from '@/stores/HashiAlgorithm';
import SelectorTypeOption from './SelectorTypeOption.vue';
import ConditionBuilder from './ConditionBuilder.vue';
import { getSelectorIndex, pathAppend } from '@/services/AlgorithmPathService';
import { useHashiAlgorithmStore } from '@/stores/HashiAlgorithmStore';

const props = defineProps<{
  selector: Selector;
  path: AlgorithmPath;
}>();

const isFirst = computed(() => {
  return getSelectorIndex(props.path) === 0;
});

const hashiAlgorithmStore = useHashiAlgorithmStore();
</script>

<template>
  <tr>
    <td class="rightAlign">{{ isFirst ? 'Select' : 'then select' }}</td>
    <td>
      <SelectorTypeOption
        :value="selector.kind"
        :isFirst="isFirst"
        @change="(newKind) => hashiAlgorithmStore.changeSelectorKind(path, newKind)"
      />
    </td>
    <td><button @click="hashiAlgorithmStore.deleteSelector(path)">x</button></td>
  </tr>
  <tr v-for="(condition, index) of selector.conditions" :key="index">
    <td class="rightAlign">{{ index === 0 ? 'with' : 'and' }}</td>
    <td>
      <ConditionBuilder :condition="condition" :path="pathAppend(path, index)" />
    </td>
    <td>
      <button @click="() => hashiAlgorithmStore.deleteCondition(pathAppend(path, index))">x</button>
    </td>
  </tr>
  <tr class="rightAlign">
    <button @click="() => hashiAlgorithmStore.newCondition(path)">+</button>
  </tr>
</template>

<style scoped>
.rightAlign {
  text-align: right;
}
</style>
