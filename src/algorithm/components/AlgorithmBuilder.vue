<script setup lang="ts">
import { useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';
import RuleBuilder from './RuleBuilder.vue';
import RuleList from './RuleList.vue';
import { createPathToRule } from '@/algorithm/services/AlgorithmPathService';
import { ref, onBeforeMount, toRef } from 'vue';
import { useHashiStore } from '@/hashi/stores/hashi';
import { HashiUtil } from '@/hashi/services/HashiUtil';
import EditableLabel from '@/components/EditableLabel.vue';
import { AlgorithmRunner } from '../services/AlgorithmRunner';
import { LoadAlgorithm, SaveAlgorithm } from '@/services/storageService';

const hashiAlgorithmStore = useHashiAlgorithmStore();
const hashiState = useHashiStore();

const activeRuleIndex = ref(0);

onBeforeMount(() => {
  const loaded = LoadAlgorithm();
  if (loaded != null) {
    hashiAlgorithmStore.$patch(loaded);
  }
});

hashiAlgorithmStore.$subscribe((mutation, algorithm) => {
  SaveAlgorithm(algorithm);
});

function setActiveRuleIndex(index: number): void {
  activeRuleIndex.value = index;
}

function stepAlgorithm(): boolean {
  const algoRunner = new AlgorithmRunner(hashiAlgorithmStore, new HashiUtil(hashiState));
  const res = algoRunner.runStep();
  return res;
}

function stepAndQueue(): void {
  if (playState.value !== 'paused') {
    const stepOk = stepAlgorithm();
    if (stepOk) {
      setTimeout(
        () => {
          stepAndQueue();
        },
        playState.value === 'fast' ? 250 : 1000
      );
    } else {
      playState.value = 'paused';
      console.log('algorithm ended');
    }
  }
}

type PlayState = 'normal' | 'fast' | 'paused';

const playState = ref<PlayState>('paused');

function setPlayState(state: PlayState): void {
  const oldState = playState.value;
  if (oldState === state) {
    return;
  }
  playState.value = state;
  if (oldState === 'paused') {
    console.log('start playing algorithm');
    stepAndQueue();
  }
}

function stepAndPause(): void {
  setPlayState('paused');
  stepAlgorithm();
}

const algorithmName = toRef(hashiAlgorithmStore.name);
</script>

<template>
  <h2>
    <EditableLabel v-model="algorithmName" />

    <!-- Pause -->
    <button class="ruleBtn btn" @click="() => setPlayState('paused')">
      <i class="bi-stop" :class="{ activeState: playState === 'paused' }"></i>
    </button>

    <!-- Step -->
    <button class="ruleBtn btn" @click="stepAndPause">
      <i class="bi-arrow-bar-right"></i>
    </button>

    <!-- Play Normal -->
    <button class="ruleBtn btn" @click="() => setPlayState('normal')">
      <i class="bi-play" :class="{ activeState: playState === 'normal' }"></i>
    </button>

    <!-- Play Fast -->
    <button class="ruleBtn btn" @click="() => setPlayState('fast')">
      <i class="bi-fast-forward" :class="{ activeState: playState === 'fast' }"></i>
    </button>
  </h2>

  <RuleList @selected="setActiveRuleIndex" />

  <RuleBuilder
    v-if="hashiAlgorithmStore.rules.length > 0"
    :path="createPathToRule(activeRuleIndex)"
  />
</template>

<style scoped>
.activeState {
  color: var(--bs-primary);
}
</style>
