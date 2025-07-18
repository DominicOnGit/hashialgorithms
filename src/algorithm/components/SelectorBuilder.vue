<script setup lang="ts">
import { computed } from 'vue';
import { type Selector } from '@/algorithm/stores/HashiAlgorithm';
import SelectorTypeOption from './SelectorTypeOption.vue';
import ConditionBuilder from './ConditionBuilder.vue';
import SlowPressButton from '@/components/SlowPressButton.vue';
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
  <!-- Select -->
  <div class="row">
    <div class="col col-2 gx-2 gx-sm-4 text-end">
      {{ isFirst ? 'Select' : 'then select' }}
    </div>
    <div class="col">
      <SelectorTypeOption
        :value="selector"
        :useIncident="!isFirst"
        :allowExcludeAncestor="!isFirstOrSecond"
        @change="(newKind) => hashiAlgorithmStore.changeSelectorKind(path, newKind)"
      />
    </div>
    <div class="col col-sm-1 col-2 gx-0 text-center">
      <SlowPressButton class="nakedBtn" @activated="() => hashiAlgorithmStore.deleteSelector(path)">
        <i class="bi-trash"></i>
      </SlowPressButton>
    </div>
  </div>

  <!-- Conditions -->
  <div class="row py-1" v-for="(condition, index) of selector.conditions" :key="index">
    <div class="col col-2 gx-2 gx-sm-4 text-end">{{ index === 0 ? 'with' : 'and' }}</div>
    <div class="col">
      <ConditionBuilder :condition="condition" :path="selectCondition(path, index)" />
    </div>
    <div class="col col-sm-1 col-2 gx-0 text-center">
      <SlowPressButton
        class="nakedBtn"
        @activated="() => hashiAlgorithmStore.deleteCondition(selectCondition(path, index))"
      >
        <i class="bi-trash"></i>
      </SlowPressButton>
    </div>
  </div>

  <!-- add Condition -->
  <div class="row mb-3">
    <div class="col offset-2">
      <button class="btn btn-secondary" @click="() => hashiAlgorithmStore.newCondition(path)">
        add condition
      </button>
    </div>
  </div>
</template>

<style scoped>
.spaceUnder {
  padding-bottom: 10px;
}
.rightAlign {
  text-align: right;
}
</style>
