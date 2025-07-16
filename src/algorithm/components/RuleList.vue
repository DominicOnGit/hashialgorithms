<script setup lang="ts">
import { isRuleEnabled, useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';
import { createPathToRule } from '@/algorithm/services/AlgorithmPathService';
import { ref, watch } from 'vue';
import SlowPressButton from '@/components/SlowPressButton.vue';
import { useAlgorithmRunnerStore, type RuleState } from '../stores/AlgorithmRunnerStore';
import { useHashiStore } from '@/hashi/stores/hashi';
import { HashiUtil } from '@/hashi/services/HashiUtil';
import { RuleRunner } from '../services/RuleRunner';
import { UiActionLogger } from '@/services/logging';

const emit = defineEmits<{
  selected: [index: number];
}>();

const hashiAlgorithmStore = useHashiAlgorithmStore();
const runState = useAlgorithmRunnerStore();
const hashiState = useHashiStore();

const activeRuleIndex = ref(0);

watch(activeRuleIndex, (newIndex: number) => {
  emit('selected', newIndex);
});

updateRuleState();

hashiState.$subscribe(() => updateRuleState());
hashiAlgorithmStore.$subscribe(() => updateRuleState());

const shakeRunning = ref(false);
watch(
  () => runState.lastStepAt,
  () => {
    shakeRunning.value = true;
    setTimeout(() => {
      shakeRunning.value = false;
    }, 500);
  }
);

function updateRuleState(): void {
  hashiAlgorithmStore.rules.forEach((rule, index) => {
    const runner = new RuleRunner(rule, new HashiUtil(hashiState));
    const state = runner.getRuleState();

    runState.setRuleState(index, state);
  });
}

function newRuleName(index: number): string {
  return 'Rule ' + (index + 1);
}

function newRule(): void {
  hashiAlgorithmStore.newRule();
  activeRuleIndex.value = hashiAlgorithmStore.rules.length - 1;
}

function deleteRule(index: number): void {
  if (activeRuleIndex.value >= hashiAlgorithmStore.rules.length - 1) {
    activeRuleIndex.value = hashiAlgorithmStore.rules.length - 2;
    emit('selected', activeRuleIndex.value);
  }
  hashiAlgorithmStore.deleteRule(createPathToRule(index));
  UiActionLogger.info(`deleted ${index}, active now=${activeRuleIndex.value}`);
}

function enableRule(index: number): void {
  hashiAlgorithmStore.enableRule(index);
}
function disableRule(index: number): void {
  hashiAlgorithmStore.disableRule(index);
}

function isRuleValid(index: number): boolean {
  const ruleRunner = new RuleRunner(hashiAlgorithmStore.rules[index], new HashiUtil(hashiState));
  const res = ruleRunner.isValid();
  return res;
}

function stepRule(index: number): void {
  const ruleRunner = new RuleRunner(hashiAlgorithmStore.rules[index], new HashiUtil(hashiState));
  ruleRunner.runRuleStep();
}

function ruleStateIcon(state: RuleState): string {
  switch (state) {
    case 'matching':
      return 'bi-play-circle';
    case 'noMatch':
      return 'bi-stop-circle';
    case 'unknown':
      return 'bi-hourglass';
    case 'infiniteLoop':
      return 'bi-repeat';
    case 'invalid':
      return 'bi-slash-circle';
  }
}
</script>

<template>
  <div class="list-group list-group-flush">
    <a
      v-for="(rule, index) in hashiAlgorithmStore.rules"
      :key="index"
      class="list-group-item list-group-item-action"
      :class="{
        active: activeRuleIndex === index
      }"
      @click="activeRuleIndex = index"
    >
      <!-- rule state indicator -->
      <span
        :class="{ shake: shakeRunning && runState.activeRule === index }"
        style="display: inline-flex"
      >
        <i v-if="runState.activeRule === index && shakeRunning" class="ruleState bi-activity"></i>
        <i v-else class="ruleState" :class="ruleStateIcon(runState.ruleStates[index])"></i>
      </span>

      <!-- name -->
      <span>{{ rule.name ?? newRuleName(index) }}</span>

      <!-- enable / disable  -->
      <button
        v-if="isRuleEnabled(hashiAlgorithmStore, index)"
        class="ruleBtn btn"
        @click="disableRule(index)"
      >
        <i class="bi-ban notActiveState"></i>
      </button>
      <button v-else class="ruleBtn btn" @click="enableRule(index)">
        <i class="bi-ban activeState"></i>
      </button>

      <!-- delete -->
      <SlowPressButton class="ruleBtn btn" @activated="() => deleteRule(index)">
        <i class="bi-trash"></i>
      </SlowPressButton>

      <!-- step -->
      <button class="ruleBtn btn" :disabled="!isRuleValid(index)" @click="stepRule(index)">
        <i class="bi-arrow-bar-right"></i>
      </button>
    </a>

    <!-- new  -->
    <!-- class="list-group-item list-group-item-action" -->
    <button type="button" class="btn list-group-item list-group-item-action" @click="newRule">
      Add Rule
    </button>
  </div>
</template>

<style scoped>
.shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) none;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-0.5px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(1px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-2px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(2px, 0, 0);
  }
}

.ruleState {
  margin-right: 5px;
}
.ruleBtn {
  --bs-btn-padding-x: 0.5rem;
  --bs-btn-padding-y: 0.1rem;
  border-color: transparent !important;
}
.activeState {
  color: var(--bs-primary);
}
.notActiveState {
  color: var(--bs-tertiary-color);
}

.list-group-item.active {
  background-color: var(--bs-secondary-bg);
  border-color: var(--bs-tertiary-color);
  color: var(--bs-body-color);
}
</style>
