<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { mapStores } from 'pinia';
import { useHashiStore } from '@/stores/hashi';
import {
  useHashiAlgorithmStore,
  type AlgorithmPath,
  type Condition
} from '@/stores/HashiAlgorithm';
import TermBuilder from './TermBuilder.vue';
import OperatorOption from './OperatorOption.vue';
import { pathAppendTerm } from '@/services/AlgorithmPathService';

export default defineComponent({
  props: {
    condition: { type: Object as PropType<Condition>, required: true },
    path: { type: Object as PropType<AlgorithmPath>, required: true }
  },
  computed: {
    ...mapStores(useHashiStore, useHashiAlgorithmStore)
  },
  methods: { pathAppendTerm },
  components: { TermBuilder, OperatorOption }
});
</script>

<template class="container">
  <TermBuilder :term="condition.lhs" :path="pathAppendTerm(path, 0)" />
  <OperatorOption
    :value="condition.operator"
    @change="(newOp) => hashiAlgorithmStore.changeConditionOperator(path, newOp)"
  />
  <TermBuilder :term="condition.rhs" :path="pathAppendTerm(path, 1)" />
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
}
</style>
