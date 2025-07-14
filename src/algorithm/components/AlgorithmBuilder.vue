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
import { useRoute } from 'vue-router';
import { loadLevel } from '@/Title-Screen/services/levels';

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

const route = useRoute();
function resetHashi(): void {
  const levelStr = route.params.level;
  const hashi = loadLevel(levelStr as string);
  hashiState.setHashi(hashi.wrappedItem);
}

const algorithmName = toRef(hashiAlgorithmStore.name);
</script>

<template>
  <h2>
    <div class="btn-toolbar">
      <EditableLabel v-model="algorithmName" />

      <div class="btn-group">
        <!-- Pause -->
        <button class="btn" @click="() => setPlayState('paused')">
          <i class="bi-stop" :class="{ activeState: playState === 'paused' }"></i>
        </button>

        <!-- Step -->
        <button class="btn" @click="stepAndPause">
          <i class="bi-arrow-bar-right"></i>
        </button>

        <!-- Play Normal -->
        <button class="btn" @click="() => setPlayState('normal')">
          <i class="bi-play" :class="{ activeState: playState === 'normal' }"></i>
        </button>

        <!-- Play Fast -->
        <button class="btn" @click="() => setPlayState('fast')">
          <i class="bi-fast-forward" :class="{ activeState: playState === 'fast' }"></i>
        </button>
      </div>

      <!-- Reset -->
      <button class="btn" @click="resetHashi">
        <i class="bi-bootstrap-reboot"></i>
        <!-- bi-arrow-counterclockwise -->
      </button>
    </div>
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
