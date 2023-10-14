<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useHashiStore } from '@/stores/hashi';
import { useHashiAlgorithmStore } from '@/stores/HashiAlgorithm';
import { AlgorithmRunner } from '@/services/AlgorithmRunner';

export default defineComponent({
  data() {
    return {
      vueCanvas: undefined as CanvasRenderingContext2D | undefined | null
    };
  },
  computed: {
    ...mapStores(useHashiStore, useHashiAlgorithmStore)
  },
  methods: {
    reset(): void {
      console.log('reset');
      this.hashiStore.$reset();
      // const hashi = new HashiBuilder().buildEmpty()
      // this.hashiStore.setHashi(hashi)
    },
    step(): void {
      console.log('step');
      const runner = new AlgorithmRunner(this.hashiAlgorithmStore, this.hashiStore);
      runner.runStep();
    }
  }
});
</script>

<template>
  <div>
    <button @click="reset">reset</button>
    <button @click="step">step</button>
  </div>
</template>

<style scoped></style>
