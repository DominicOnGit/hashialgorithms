<script setup lang="ts">
import { useHashiStore } from '@/hashi/stores/hashi';
import { AlgorithmRunner } from '@/algorithm/services/AlgorithmRunner';
import { useMiscStore } from '@/stores/MiscStore';
import { HashiBuilder } from '@/hashi/services/HashiBuilder';
import { useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';
import {
  buildWithMaxMultiplicity,
  cloneAndValidate,
  namedHashis
} from '@/hashi/services/HashiSamples';
import { SaveAll, LoadAll, CanLoad } from '@/services/storageService';
import { onMounted, ref } from 'vue';

const hashiStore = useHashiStore();
const hashiAlgorithmStore = useHashiAlgorithmStore();
const miscStore = useMiscStore();

const canLoad = ref(false);

onMounted(() => (canLoad.value = CanLoad()));

function step(): void {
  console.log('step');
  const runner = new AlgorithmRunner(hashiAlgorithmStore, hashiStore);
  runner.runStep();
}

function animate(): void {
  if (miscStore.isRunning) {
    const runner = new AlgorithmRunner(hashiAlgorithmStore, hashiStore);
    const ok = runner.runStep();
    if (ok) {
      setTimeout(() => animate(), 1000);
    } else {
      miscStore.isRunning = false;
    }
  }
}

function toggleRunning(): void {
  miscStore.isRunning = !miscStore.isRunning;
  if (miscStore.isRunning) {
    animate();
  }
}

function grow(): void {
  const builder = new HashiBuilder(hashiStore);
  builder.grow({ nx: 11, ny: 11 });
}

function clearEdges(): void {
  hashiStore.edges = [];
}

function growSomeAndClear(): void {
  const builder = new HashiBuilder(hashiStore);
  for (let i = 0; i < 5; i++) {
    builder.grow({ nx: 11, ny: 11 });
  }
  clearEdges();
}

function hashi1(): void {
  const hashi = buildWithMaxMultiplicity();
  hashiStore.setHashi(hashi);
}

function setHashi(name: string): void {
  const hashi = cloneAndValidate(namedHashis[name]);
  hashiStore.setHashi(hashi);
}

function Save(): void {
  SaveAll();
  canLoad.value = CanLoad();
}
</script>

<template>
  <div>
    <label class="category">Hashi:</label>
    <button
      v-for="hashiName in Object.keys(namedHashis)"
      :key="hashiName"
      @click="setHashi(hashiName)"
    >
      {{ hashiName }}
    </button>
    <button @click="hashi1">Hashi1</button>
  </div>
  <div>
    <label class="category">Builder:</label>
    <button @click="grow">grow</button>
    <button @click="clearEdges">clear</button>
    <button @click="growSomeAndClear">growProblem</button>
  </div>
  <div>
    <label class="category">Algo:</label>
    <button @click="step">step</button>
    <button @click="toggleRunning">{{ miscStore.isRunning ? 'stop' : 'start' }}</button>
  </div>
  <div>
    <label class="category">File:</label>
    <button @click="Save">save</button>
    <button @click="LoadAll" :disabled="!canLoad">load</button>
  </div>
</template>

<style scoped>
.category {
  display: inline-block;
  width: 3em;
}
</style>
