<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { mapStores } from 'pinia';
import { useHashiStore } from '@/stores/hashi';
import { useHashiAlgorithmStore, type Selector, type AlgorithmPath } from '@/stores/HashiAlgorithm';
import SelectorTypeOption from './SelectorTypeOption.vue';
import ConditionBuilder from './ConditionBuilder.vue';
import { pathAppendCondition } from '@/services/AlgorithmPathService';
import path from 'path';

export default defineComponent({
  props: {
    selector: { type: Object as PropType<Selector>, required: true },
    path: { type: Object as PropType<AlgorithmPath>, required: true }
  },
  computed: {
    ...mapStores(useHashiStore, useHashiAlgorithmStore),
    isFirst(): boolean {
      return this.path.selectorIndex === 0;
    }
  },
  methods: { pathAppendCondition },
  components: { SelectorTypeOption, ConditionBuilder }
});
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
  </tr>
  <tr v-for="(condition, index) of selector.conditions" :key="index">
    <td class="rightAlign">{{ index === 0 ? 'with' : 'and' }}</td>
    <td>
      <ConditionBuilder :condition="condition" :path="pathAppendCondition(path, index)" />
    </td>
    <td><button @click="() => hashiAlgorithmStore.deleteCondition(path, index)">x</button></td>
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
