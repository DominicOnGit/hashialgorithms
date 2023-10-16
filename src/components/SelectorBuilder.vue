<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { mapStores } from 'pinia';
import { useHashiStore } from '@/stores/hashi';
import { useHashiAlgorithmStore, type Selector, type AlgorithmPath } from '@/stores/HashiAlgorithm';
import SelectorTypeOption from './SelectorTypeOption.vue';

export default defineComponent({
  props: {
    selector: { type: Object as PropType<Selector>, required: true },
    path: { type: Object as PropType<AlgorithmPath>, required: true }
  },
  computed: {
    ...mapStores(useHashiStore, useHashiAlgorithmStore)
  },
  methods: {
    changeSelectorKind(kind: Selector['kind']) {
      console.log('change', kind);
    }
  },
  components: { SelectorTypeOption }
});
</script>

<template>
  <tr>
    <td>Select {{ selector.kind }}</td>
    <td>
      <SelectorTypeOption
        :value="selector.kind"
        @change="(newKind) => hashiAlgorithmStore.changeSelectorKind(path, newKind)"
      />
    </td>
  </tr>
</template>

<style scoped></style>
