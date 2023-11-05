<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useHashiStore } from '@/stores/hashi';
import { AlgorithmRunner } from '@/services/AlgorithmRunner';
import { useMiscStore } from '@/stores/MiscStore';
import { HashiBuilder } from '@/services/HashiBuilder';
import { useHashiAlgorithmStore } from '@/stores/HashiAlgorithmStore';

export default defineComponent({
  data() {
    return {
      vueCanvas: undefined as CanvasRenderingContext2D | undefined | null
    };
  },
  computed: {
    ...mapStores(useHashiStore, useHashiAlgorithmStore, useMiscStore)
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
    },
    animate(): void {
      if (this.miscStore.isRunning) {
        const runner = new AlgorithmRunner(this.hashiAlgorithmStore, this.hashiStore);
        const ok = runner.runStep();
        if (ok) {
          setTimeout(() => this.animate(), 1000);
        } else {
          this.miscStore.isRunning = false;
        }
      }
    },
    toggleRunning(): void {
      this.miscStore.isRunning = !this.miscStore.isRunning;
      if (this.miscStore.isRunning) {
        this.animate();
      }
    },
    grow(): void {
      const builder = new HashiBuilder(this.hashiStore);
      builder.grow({ nx: 11, ny: 11 });
    },
    clearEdges(): void {
      this.hashiStore.edges = [];
    },
    growSomeAndClear(): void {
      const builder = new HashiBuilder(this.hashiStore);
      for (let i = 0; i < 5; i++) {
        builder.grow({ nx: 11, ny: 11 });
      }
      this.clearEdges();
    }
  }
});
</script>

<template>
  <div>
    <button @click="reset">reset</button>
    <button @click="step">step</button>
    <button @click="toggleRunning">{{ miscStore.isRunning ? 'stop' : 'start' }}</button>
    <button @click="grow">grow</button>
    <button @click="clearEdges">clear</button>
    <button @click="growSomeAndClear">growProblem</button>
  </div>
</template>

<style scoped></style>
