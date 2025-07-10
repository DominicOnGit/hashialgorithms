<script setup lang="ts">
import { isRuleEnabled, useHashiAlgorithmStore } from '@/algorithm/stores/HashiAlgorithmStore';
import { vElementDeselected } from '@/directives/vElementDeselected';
import RuleBuilder from './RuleBuilder.vue';
import { createPathToRule } from '@/algorithm/services/AlgorithmPathService';
import type { Rule } from '../stores/HashiAlgorithm';
import { ref, nextTick, onBeforeMount, toRef } from 'vue';
import SlowPressButton from '@/components/SlowPressButton.vue';
import { useAlgorithmRunnerStore } from '../stores/AlgorithmRunnerStore';
import { useHashiStore } from '@/hashi/stores/hashi';
import { HashiUtil } from '@/hashi/services/HashiUtil';
import { RuleRunner } from '../services/RuleRunner';
import { AllRulesAlgorithm } from '../stores/rules';
import EditableLabel from '@/components/EditableLabel.vue';
import { AlgorithmRunner } from '../services/AlgorithmRunner';

const hashiAlgorithmStore = useHashiAlgorithmStore();
const runState = useAlgorithmRunnerStore();
const hashiState = useHashiStore();

const nameEditors = ref();
const activeRuleIndex = ref(0);
const editedNameIndex = ref<number | null>(null);

hashiState.$subscribe(() => updateRuleState());
hashiAlgorithmStore.$subscribe(() => updateRuleState());

function updateRuleState(): void {
  hashiAlgorithmStore.rules.forEach((rule, index) => {
    const runner = new RuleRunner(rule, new HashiUtil(hashiState));
    const state = runner.getRuleState();

    runState.setRuleState(index, state);
  });
}

onBeforeMount(() => {
  console.log('loading AllRulesAlgorithm', AllRulesAlgorithm);
  hashiAlgorithmStore.$patch(AllRulesAlgorithm);
});

function getName(rule: Rule, index: number): string {
  return rule.name ?? 'Rule ' + (index + 1);
}

function editName(index: number): void {
  activeRuleIndex.value = index;
  editedNameIndex.value = index;
  nextTick(() => {
    if (nameEditors.value.length !== 1) throw new Error();
    nameEditors.value[0].focus();
    nameEditors.value[0].select();
  });
}

function stopNameEditing(): void {
  console.log('stopNameEditing');
  editedNameIndex.value = null;
}

function newRule(): void {
  hashiAlgorithmStore.newRule();
  activeRuleIndex.value = hashiAlgorithmStore.rules.length - 1;
}

function deleteRule(index: number): void {
  hashiAlgorithmStore.deleteRule(createPathToRule(index));
}

function enableRule(index: number): void {
  hashiAlgorithmStore.enableRule(index);
}
function disableRule(index: number): void {
  hashiAlgorithmStore.disableRule(index);
}

function stepRule(index: number): void {
  const ruleRunner = new RuleRunner(hashiAlgorithmStore.rules[index], new HashiUtil(hashiState));
  const stepResult = ruleRunner.runRuleStep();
}

let shakeTimeout: NodeJS.Timeout | null = null;
function stepAlgorithm(): void {
  const algoRunner = new AlgorithmRunner(hashiAlgorithmStore, new HashiUtil(hashiState));
  const res = algoRunner.runStep();
  if (shakeTimeout != null) {
    clearTimeout(shakeTimeout);
  }
  if (res) {
    shakeRunning.value = true;
    console.log('shake');
    shakeTimeout = setTimeout(() => {
      shakeRunning.value = false;
      console.log('shake end');
    }, 500);
  } else {
    shakeRunning.value = false;
    console.log('no shake');
  }
}

const shakeRunning = ref(false);
const algorithmName = toRef(hashiAlgorithmStore.name);
</script>

<template>
  <h2>
    <EditableLabel v-model="algorithmName" />
    <button class="ruleBtn btn" @click="stepAlgorithm()">
      <i class="bi-arrow-right"></i>
    </button>
  </h2>

  <ul class="nav flex-column nav-pills">
    <li v-for="(rule, index) in hashiAlgorithmStore.rules" :key="index" class="nav-item">
      <a
        :ref="'a' + index"
        class="nav-link"
        :class="{
          active: activeRuleIndex === index
        }"
        @click="activeRuleIndex = index"
      >
        <span
          :class="{ shake: shakeRunning && runState.activeRule === index }"
          style="display: inline-flex"
        >
          <i v-if="runState.activeRule === index" class="ruleState bi-activity"></i>

          <template v-else>
            <i v-if="runState.ruleStates[index] == 'matching'" class="ruleState bi-play-circle"></i>
            <i
              v-else-if="runState.ruleStates[index] == 'noMatch'"
              class="ruleState bi-stop-circle"
            ></i>
            <i
              v-else-if="runState.ruleStates[index] == 'unknown'"
              class="ruleState bi-hourglass"
            ></i>
            <i
              v-else-if="runState.ruleStates[index] == 'infiniteLoop'"
              class="ruleState bi-repeat"
            ></i>
          </template>
        </span>

        <!-- <span
          v-if="runState.activeRule === index"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span> -->
        <template v-if="editedNameIndex === index">
          <input
            ref="nameEditors"
            v-if="editedNameIndex === index"
            v-elementDeselected="{ handler: stopNameEditing, exclude: ['a' + index] }"
            v-model="rule.name"
            type="text"
          />
          <button class="btn" @click="stopNameEditing">
            <i class="bi-check-lg"></i>
          </button>
        </template>
        <template v-else>
          <span>{{ getName(rule, index) }} </span>
          <button class="ruleBtn btn" @click="editName(index)">
            <i class="bi-pencil"></i>
          </button>
          <button
            v-if="isRuleEnabled(hashiAlgorithmStore, index)"
            class="ruleBtn btn"
            @click="disableRule(index)"
          >
            <i class="bi-stop"></i>
          </button>
          <button v-else class="ruleBtn btn" @click="enableRule(index)">
            <i class="bi-play"></i>
          </button>
          <SlowPressButton class="ruleBtn btn" @activated="() => deleteRule(index)">
            <i class="bi-trash"></i>
          </SlowPressButton>

          <button class="ruleBtn btn" @click="stepRule(index)">
            <i class="bi-arrow-right"></i>
          </button>
        </template>
      </a>
    </li>
    <li class="nav-item"><a class="nav-link" @click="newRule">NEW</a></li>
  </ul>

  <RuleBuilder
    v-if="hashiAlgorithmStore.rules.length > 0"
    :path="createPathToRule(activeRuleIndex)"
  />
</template>

<style scoped>
.shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) none;
  transform: translate3d(0, 0, 0);
}

.test {
  transform: translate3d(50px, 0, 0);
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
}
</style>
